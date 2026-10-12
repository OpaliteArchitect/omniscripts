using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Omniscripts.Server.Dtos;
using Omniscripts.Server.Services;

var builder = WebApplication.CreateBuilder(args);

builder
    .Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = false,
            ValidateAudience = false,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!)
            ),
        };
    });
builder.Services.AddAuthorization();

builder.Services.AddScoped<GoogleSheetsService>();

var app = builder.Build();

app.UseAuthentication();
app.UseAuthorization();

app.MapPost(
    "/api/login",
    async (
        LoginRequestDto request,
        GoogleSheetsService sheetsService,
        IConfiguration configuration
    ) =>
    {
        var spreadsheetId = configuration["GoogleSheets:SpreadsheetId"];
        if (string.IsNullOrWhiteSpace(spreadsheetId))
        {
            return Results.Problem("Spreadsheet ID configuration is missing.");
        }

        var expectedPassword = await sheetsService.GetPasswordAsync(spreadsheetId, "Sheet2!B2");
        if (string.IsNullOrWhiteSpace(expectedPassword) || request.Password != expectedPassword)
        {
            return Results.Unauthorized();
        }

        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.UTF8.GetBytes(configuration["Jwt:Key"]!);
        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity([new Claim(ClaimTypes.Name, "AuthenticatedUser")]),
            Expires = DateTimeOffset.UtcNow.AddHours(12).UtcDateTime,
            SigningCredentials = new SigningCredentials(
                new SymmetricSecurityKey(key),
                SecurityAlgorithms.HmacSha256Signature
            ),
        };

        var token = tokenHandler.CreateToken(tokenDescriptor);
        var tokenString = tokenHandler.WriteToken(token);

        var responseDto = new LoginResponseDto(tokenString, DateTimeOffset.UtcNow);
        return Results.Ok(responseDto);
    }
);

app.MapGet(
        "/api/scripts",
        async (GoogleSheetsService sheetsService, IConfiguration config) =>
        {
            var spreadsheetId = config["GoogleSheets:SpreadsheetId"];
            var range = config["GoogleSheets:SheetRange"] ?? "Sheet1!A2:C";

            if (string.IsNullOrEmpty(spreadsheetId))
            {
                return Results.Problem("Spreadsheet ID configuration is missing.", statusCode: 500);
            }

            try
            {
                var rawScripts = await sheetsService.GetScriptsAsync(spreadsheetId, range);

                // Map domain items into the DTO grouped by Category
                var groupedCategories = rawScripts
                    .GroupBy(item => item.Category)
                    .Select(group => new CategoryGroup(
                        Category: group.Key,
                        Items: group
                            .Select(item => new IssueScript(item.Issue, item.Script))
                            .ToList()
                    ))
                    .ToList();

                var dto = new ScriptsDto(groupedCategories);

                return Results.Ok(dto);
            }
            catch (Exception ex)
            {
                return Results.Problem(ex.Message, statusCode: 500);
            }
        }
    )
    .RequireAuthorization();

app.Run();

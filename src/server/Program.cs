var builder = WebApplication.CreateBuilder(args);

// Register GoogleSheetsService
builder.Services.AddScoped<GoogleSheetsService>();

// CORS setup for React frontend dev server
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod();
    });
});

var app = builder.Build();

app.UseCors();

// POST /login
app.MapPost(
    "/login",
    () =>
    {
        // TODO: Implement authentication logic in the future
        return Results.Ok(new { message = "Login placeholder", timestamp = DateTimeOffset.UtcNow });
    }
);

// GET /scripts
app.MapGet(
    "/scripts",
    async (GoogleSheetsService sheetsService, IConfiguration config) =>
    {
        var spreadsheetId = config["GoogleSheets:SpreadsheetId"];
        var range = config["GoogleSheets:SheetRange"] ?? "Sheet1!A2:C"; // Default skips header

        if (string.IsNullOrEmpty(spreadsheetId))
        {
            return Results.Problem("Spreadsheet ID configuration is missing.", statusCode: 500);
        }

        try
        {
            var scripts = await sheetsService.GetScriptsAsync(spreadsheetId, range);
            return Results.Ok(scripts);
        }
        catch (Exception ex)
        {
            return Results.Problem(ex.Message, statusCode: 500);
        }
    }
);

app.Run();

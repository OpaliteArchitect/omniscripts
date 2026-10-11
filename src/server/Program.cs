using Omniscripts.Server.DTOs;
using Omniscripts.Server.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddScoped<GoogleSheetsService>();

var app = builder.Build();

app.MapPost(
    "/api/login",
    () =>
    {
        // TODO: Implement authentication logic in the future
        return Results.Ok(new { message = "Login placeholder", timestamp = DateTimeOffset.UtcNow });
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
                    Items: group.Select(item => new IssueScript(item.Issue, item.Script)).ToList()
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
);

app.Run();

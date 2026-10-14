using Google.Apis.Auth.OAuth2;
using Google.Apis.Services;
using Google.Apis.Sheets.v4;
using Omniscripts.Server.Models;

namespace Omniscripts.Server.Services;

public class GoogleSheetsService
{
    private readonly IConfiguration _configuration;
    private static readonly string[] Scopes = [SheetsService.Scope.SpreadsheetsReadonly];

    public GoogleSheetsService(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public async Task<List<ScriptItem>> GetScriptsAsync(string spreadsheetId, string range)
    {
        var jsonCredential = _configuration["GoogleSheets:ServiceAccountJson"];
        if (string.IsNullOrWhiteSpace(jsonCredential))
        {
            throw new InvalidOperationException(
                "GoogleSheets:ServiceAccountJson configuration is missing."
            );
        }

        var credential = CredentialFactory
            .FromJson<ServiceAccountCredential>(jsonCredential)
            .ToGoogleCredential()
            .CreateScoped(Scopes);

        using var sheetsService = new SheetsService(
            new BaseClientService.Initializer
            {
                HttpClientInitializer = credential,
                ApplicationName = "Omniscripts.Server",
            }
        );

        var request = sheetsService.Spreadsheets.Values.Get(spreadsheetId, range);
        var response = await request.ExecuteAsync();
        var values = response.Values;

        var scripts = new List<ScriptItem>();

        if (values is null || values.Count == 0)
        {
            return scripts;
        }

        foreach (var row in values)
        {
            // Expecting row layout: Category (col 0), Issue (col 1), Script (col 2)
            var category = row.Count > 0 ? row[0]?.ToString() ?? string.Empty : string.Empty;
            var issue = row.Count > 1 ? row[1]?.ToString() ?? string.Empty : string.Empty;
            var scriptText = row.Count > 2 ? row[2]?.ToString() ?? string.Empty : string.Empty;

            scripts.Add(new ScriptItem(category, issue, scriptText));
        }

        return scripts;
    }

    public async Task<string?> GetPasswordAsync(string spreadsheetId, string range = "Sheet2!B2")
    {
        var jsonCredential = _configuration["GoogleSheets:ServiceAccountJson"];
        if (string.IsNullOrWhiteSpace(jsonCredential))
        {
            throw new InvalidOperationException(
                "GoogleSheets:ServiceAccountJson configuration is missing."
            );
        }

        var credential = CredentialFactory
            .FromJson<ServiceAccountCredential>(jsonCredential)
            .ToGoogleCredential()
            .CreateScoped(Scopes);

        using var sheetsService = new SheetsService(
            new BaseClientService.Initializer
            {
                HttpClientInitializer = credential,
                ApplicationName = "Omniscripts.Server",
            }
        );

        var request = sheetsService.Spreadsheets.Values.Get(spreadsheetId, range);
        var response = await request.ExecuteAsync();
        var values = response.Values;

        if (values != null && values.Count > 0 && values[0].Count > 0)
        {
            return values[0][0]?.ToString();
        }

        return null;
    }
}

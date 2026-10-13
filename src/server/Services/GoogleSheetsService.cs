using System.Text;
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
        using var sheetsService = CreateSheetsService();

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
            var category = row.Count > 0 ? row[0]?.ToString() ?? string.Empty : string.Empty;
            var issue = row.Count > 1 ? row[1]?.ToString() ?? string.Empty : string.Empty;
            var scriptText = row.Count > 2 ? row[2]?.ToString() ?? string.Empty : string.Empty;

            scripts.Add(new ScriptItem(category, issue, scriptText));
        }

        return scripts;
    }

    public async Task<string?> GetPasswordAsync(string spreadsheetId, string range = "Sheet2!B2")
    {
        using var sheetsService = CreateSheetsService();

        var request = sheetsService.Spreadsheets.Values.Get(spreadsheetId, range);
        var response = await request.ExecuteAsync();
        var values = response.Values;

        if (values != null && values.Count > 0 && values[0].Count > 0)
        {
            return values[0][0]?.ToString();
        }

        return null;
    }

    private SheetsService CreateSheetsService()
    {
        var base64Config = _configuration["GoogleSheets:ServiceAccountJson"];
        if (string.IsNullOrWhiteSpace(base64Config))
        {
            throw new InvalidOperationException(
                "GoogleSheets:ServiceAccountJson configuration is missing."
            );
        }

        var bytes = Convert.FromBase64String(base64Config.Trim());
        var jsonCredential = Encoding.UTF8.GetString(bytes);

        var credential = CredentialFactory
            .FromJson<ServiceAccountCredential>(jsonCredential)
            .ToGoogleCredential()
            .CreateScoped(Scopes);

        var appName =
            _configuration["GoogleSheets:ApplicationName"]
            ?? throw new InvalidOperationException(
                "GoogleSheets:ApplicationName configuration is missing."
            );

        return new SheetsService(
            new BaseClientService.Initializer
            {
                HttpClientInitializer = credential,
                ApplicationName = appName,
            }
        );
    }
}

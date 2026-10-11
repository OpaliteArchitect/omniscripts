namespace Omniscripts.Server.DTOs;

public record IssueScript(string Issue, string Script);

public record CategoryGroup(string Category, List<IssueScript> Items);

public record ScriptsDto(List<CategoryGroup> Categories);

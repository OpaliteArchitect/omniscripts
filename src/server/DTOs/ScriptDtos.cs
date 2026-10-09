namespace Omniscripts.Server.DTOs;

public record ProblemScript(string Problem, string Script);

public record CategoryGroup(string Category, List<ProblemScript> Items);

public record ScriptsDto(List<CategoryGroup> Categories);

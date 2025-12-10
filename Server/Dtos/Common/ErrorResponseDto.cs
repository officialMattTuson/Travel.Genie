namespace Travel.Genie.Dtos.Common;

public sealed record ErrorResponseDto
{
    public string Code { get; init; } = default!;
    public string Message { get; init; } = default!;
    public IReadOnlyDictionary<string, string[]>? ValidationErrors { get; init; }
}

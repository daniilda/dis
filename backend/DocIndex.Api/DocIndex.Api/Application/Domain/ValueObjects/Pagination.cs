namespace DocIndex.Api.Application.Domain.ValueObjects;

public sealed record Pagination
{
    public required int Limit { get; init; }
    
    public required int Offset { get; init; }
}
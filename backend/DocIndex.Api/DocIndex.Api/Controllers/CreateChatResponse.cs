namespace DocIndex.Api.Controllers;

public sealed record CreateChatResponse
{
    public required Guid SessionId { get; init; }
    
    public required Guid ChatId { get; init; }
    
    public required string Name { get; init; }
} 
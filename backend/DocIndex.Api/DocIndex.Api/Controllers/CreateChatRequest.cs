namespace DocIndex.Api.Controllers;

public sealed record CreateChatRequest
{
    public required Guid SessionId { get; init; }
    
    public required string Name { get; init; }
}
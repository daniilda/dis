namespace DocIndex.Api.Application.Domain.Entities;

public sealed class Chat(Guid id) : Entity<Guid>(id)
{
    public required Guid SessionId { get; init; }
    
    public required string Name { get; init; }
    
    public required DateTime CreatedAt { get; init; }
    
    public required DateTime LastUpdatedAt { get; init; }
    
    public required string? LatestMessage { get; init; }
    
    public required bool? IsLatestMessageFromBot { get; init; }
}
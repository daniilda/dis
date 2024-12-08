using DocIndex.Api.Application.Domain.Entities;

namespace DocIndex.Api.Application.Domain.ValueObjects;

public readonly record struct ChatMessage
{
    public required bool IsBot { get; init; }
    
    public required DateTime CreatedAt { get; init; }
    
    public required string Text { get; init; }
    
    public required Document? Document { get; init; }
    
    public required string? PictureFileId { get; init; }
}
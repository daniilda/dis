using DocIndex.Api.Application.Domain.ValueObjects;

namespace DocIndex.Api.Controllers;

public sealed record ListChatMessagesResponse
{
    public required IReadOnlyList<ChatMessage> Messages { get; init; }
    
    public required PaginationResponse PaginationResponse { get; init; }
}
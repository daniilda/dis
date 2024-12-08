using DocIndex.Api.Application.Domain.ValueObjects;

namespace DocIndex.Api.Controllers;

public sealed record CreateChatResponseResponse
{
    public required ChatMessage Message { get; init; }
}
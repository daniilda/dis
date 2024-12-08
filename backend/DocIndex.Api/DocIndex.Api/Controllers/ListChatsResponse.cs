using DocIndex.Api.Application.Domain.Entities;

namespace DocIndex.Api.Controllers;

public sealed record ListChatsResponse
{
    public required IReadOnlyList<Chat> Chats { get; init; }
}
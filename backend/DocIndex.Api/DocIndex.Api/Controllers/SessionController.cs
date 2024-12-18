using DocIndex.Api.Application.Domain.Entities;
using DocIndex.Api.Application.Domain.Enums;
using DocIndex.Api.Application.Domain.ValueObjects;
using DocIndex.Api.Infrastructure.Clients;
using DocIndex.Api.Infrastructure.DbAccess;
using DocIndex.Api.Infrastructure.DbAccess.Models;
using LinqToDB;
using Microsoft.AspNetCore.Mvc;

namespace DocIndex.Api.Controllers;

[ApiController]
[Route("api/v1/sessions")]
public sealed class SessionController(IDbContextFactory contextFactory, IMlClient mlClient) : ControllerBase
{
    private readonly IDbContextFactory _contextFactory = contextFactory;
    private readonly IMlClient _mlClient = mlClient;

    [HttpPost]
    public Task<Guid> CreateSession(CancellationToken cancellationToken)
        => Task.FromResult(Guid.NewGuid());

    [HttpGet("{sessionId:guid}/chats")]
    public async Task<ListChatsResponse> ListChats([FromRoute] Guid sessionId, CancellationToken cancellationToken)
    {
        await using var connection = _contextFactory.CreateConnection();
        var table = connection.GetTable<ChatDb>();
        var chats = await table.Where(db => db.SessionId == sessionId).ToArrayAsync(token: cancellationToken);
        return new ListChatsResponse
        {
            Chats = chats.Select(
                db => new Chat(db.Id)
                {
                    SessionId = db.SessionId,
                    Name = db.Name,
                    CreatedAt = db.CreatedAt,
                    LastUpdatedAt = db.LastUpdatedAt,
                    LatestMessage = db.LatestMessage,
                    IsLatestMessageFromBot = db.IsLatestMessageFromBot
                }).ToArray()
        };
    }

    [HttpPost("chat")]
    public async Task<CreateChatResponse> CreateChat(
        [FromBody] CreateChatRequest request,
        CancellationToken cancellationToken)
    {
        await using var connection = _contextFactory.CreateConnection();
        var chat = new ChatDb
        {
            Id = Guid.NewGuid(),
            SessionId = request.SessionId,
            Name = request.Name,
            CreatedAt = DateTime.UtcNow,
            LastUpdatedAt = DateTime.UtcNow,
            LatestMessage = null,
            IsLatestMessageFromBot = null,
        };
        await connection.InsertAsync(chat, token: cancellationToken);
        return new CreateChatResponse
        {
            SessionId = request.SessionId,
            ChatId = chat.Id,
            Name = request.Name
        };
    }

    [HttpGet("{sessionId:guid}/chats/{chatId:guid}")]
    public async Task<ListChatMessagesResponse> ListChatMessages(
        [FromQuery] Pagination pagination,
        [FromRoute] Guid sessionId,
        [FromRoute] Guid chatId,
        CancellationToken cancellationToken)
    {
        await using var connection = _contextFactory.CreateConnection();
        var table = connection.GetTable<UserQueryResponseDb>();
        var query = table
            .Where(db => db.SessionId == sessionId && db.ChatId == chatId)
            .OrderByDescending(db => db.CreatedAt);
        var total = await query.CountAsync(token: cancellationToken);
        var paginated = await query
            .Skip(pagination.Offset)
            .Take(pagination.Limit)
            .LoadWith(db => db.Document)
            .ToArrayAsync(token: cancellationToken);
        var mapped = paginated
            .Select(
                a => new UserQueryResponse
                {
                    CreatedAt = a.CreatedAt,
                    Query = a.Query,
                    ResponseText = a.ResponseText,
                    Document = a.Document is not null
                        ? new Document(a.Document.Id)
                        {
                            Name = a.Document.Name,
                            Format = (FileFormat)a.Document.FileFormat,
                            CreatedAt = a.CreatedAt,
                            State = (DocumentState)a.Document.State
                        }
                        : null,
                    PictureFileId = a.PictureFileId
                })
            .SelectMany(uqr => uqr.ToMessages());
        return new ListChatMessagesResponse
        {
            Messages = mapped.ToArray(),
            PaginationResponse = new PaginationResponse(total)
        };
    }

    [HttpPost("{sessionId:guid}/chats/{chatId:guid}/response")]
    public async Task<CreateChatResponseResponse> CreateChatResponse(
        [FromRoute] Guid sessionId,
        [FromRoute] Guid chatId,
        [FromBody] string query,
        CancellationToken cancellationToken)
    {
        await using var connection = _contextFactory.CreateConnection();
        var q = await _mlClient.QueryAsync(query, cancellationToken);
        var db = new UserQueryResponseDb
        {
            ChatId = chatId,
            SessionId = sessionId,
            CreatedAt = DateTime.UtcNow,
            Query = query,
            ResponseText = q.Text,
            DocumentId = q.Document?.Id ?? Guid.NewGuid(),
            PictureFileId = q.PictureFileId
        };
        await connection
            .InsertAsync(db, token: cancellationToken);

        return new CreateChatResponseResponse
        {
            Message = q
        };
    }

    [HttpDelete("{sessionId:guid}/chats/{chatId:guid}")]
    public async Task DeleteChat(
        Guid sessionId,
        Guid chatId,
        CancellationToken cancellationToken)
    {
        await using var connection = _contextFactory.CreateConnection();
        var table = connection.GetTable<ChatDb>();
        await table.Where(db => db.SessionId == sessionId && db.Id == chatId).DeleteAsync(token: cancellationToken);
    }
}
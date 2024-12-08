using DocIndex.Api.Application.Domain.Entities;

namespace DocIndex.Api.Application.Domain.ValueObjects;

public readonly record struct UserQueryResponse
{
    public required DateTime CreatedAt { get; init; }
    
    public required string Query { get; init; }
    
    public required string ResponseText { get; init; }
    
    public required Document? Document { get; init; }
    
    public required string? PictureFileId { get; init; }

    public IEnumerable<ChatMessage> ToMessages()
    {
        yield return new ChatMessage
        {
            IsBot = true, // Самое последнее сообщение должно быть ответом бота
            CreatedAt = CreatedAt,
            Text = ResponseText,
            Document = Document,
            PictureFileId = PictureFileId
        };
        yield return new ChatMessage
        {
            IsBot = false,
            CreatedAt = CreatedAt,
            Text = Query,
            Document = null,
            PictureFileId = null
        };
    }
}
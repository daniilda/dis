using LinqToDB.Mapping;

namespace DocIndex.Api.Infrastructure.DbAccess.Models;

[Table("query_response")]
public sealed record UserQueryResponseDb
{
    [Column("chat_id")]
    public required Guid ChatId { get; init; }
    
    [Column("session_id")]
    public required Guid SessionId { get; init; }
    
    [Column("created_at")]
    public required DateTime CreatedAt { get; init; }
    
    [Column("query")]
    public required string Query { get; init; }
    
    [Column("response_text")]
    public required string ResponseText { get; init; }
    
    [Column("document_id")]
    public required Guid DocumentId { get; init; }
    
    [Column("picture_file_id")]
    public required string? PictureFileId { get; init; }

    [Association(ThisKey = nameof(DocumentId), OtherKey = nameof(DocumentDb.Id))]
    public DocumentDb? Document { get; init; }
}
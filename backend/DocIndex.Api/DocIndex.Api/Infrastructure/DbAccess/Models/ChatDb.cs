using LinqToDB.Mapping;

namespace DocIndex.Api.Infrastructure.DbAccess.Models;

[Table("chat")]
public sealed record ChatDb
{
    [Column("id")]
    public required Guid Id { get; init; }
    
    [Column("session_id")]
    public required Guid SessionId { get; init; }
    
    [Column("name")]
    public required string Name { get; init; }
    
    [Column("created_at")]
    public required DateTime CreatedAt { get; init; }
    
    [Column("last_update_at")]
    public required DateTime LastUpdatedAt { get; init; }
    
    [Column("latest_message")]
    public required string? LatestMessage { get; init; }
    
    [Column("is_latest_message_from_bot")]
    public required bool? IsLatestMessageFromBot { get; init; }
};
using LinqToDB.Mapping;

namespace DocIndex.Api.Infrastructure.DbAccess.Models;

[Table("document")]
public sealed record DocumentDb
{
    [Column("id")]
    public required Guid Id { get; init; }
    
    [Column("name")]
    public required string Name { get; init; }

    [Column("file_format")]
    public required int FileFormat { get; init; }

    [Column("created_at")]
    public required DateTime CreatedAt { get; init; }

    [Column("state")]
    public required int State { get; init; }
}
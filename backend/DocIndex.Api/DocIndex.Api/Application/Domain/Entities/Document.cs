using DocIndex.Api.Application.Domain.Enums;

namespace DocIndex.Api.Application.Domain.Entities;

public sealed class Document(Guid id) : Entity<Guid>(id)
{
    public required string Name { get; init; }
    
    public required FileFormat Format { get; init; }
    
    public required DateTime CreatedAt { get; init; }
    
    public required DocumentState State { get; init; }
}
using DocIndex.Api.Application.Domain.Entities;
using DocIndex.Api.Application.Domain.ValueObjects;

namespace DocIndex.Api.Controllers;

public sealed record ListDocumentsResponse
{
    public required IReadOnlyList<Document> Documents { get; init; }
    
    public required PaginationResponse PaginationResponse { get; init; }
}
using DocIndex.Api.Application.Domain.ValueObjects;

namespace DocIndex.Api.Infrastructure.Clients;

public interface IMlClient
{
    Task IndexAsync(DocumentContent document, CancellationToken cancellationToken);

    Task<ChatMessage> QueryAsync(string query, CancellationToken cancellationToken);
    
    Task<Stream> GetFileAsync(string docId, int page, CancellationToken cancellationToken);
}
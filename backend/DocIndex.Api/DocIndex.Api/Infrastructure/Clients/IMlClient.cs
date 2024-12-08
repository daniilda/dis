using DocIndex.Api.Application.Domain.ValueObjects;

namespace DocIndex.Api.Infrastructure.Clients;

public interface IMlClient
{
    Task IndexAsync(DocumentContent document, CancellationToken cancellationToken);
    
    Task<Stream> GetFileAsync(string file, CancellationToken cancellationToken);
}
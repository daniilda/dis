using DocIndex.Api.Application.Domain.ValueObjects;

namespace DocIndex.Api.Infrastructure.Files;

public interface IFileStorage
{
    Task<Stream> GetFileAsync(string id, CancellationToken cancellationToken);
    
    Task DeleteFileAsync(string id, CancellationToken cancellationToken);

    Task UploadFileAsync(UploadingFile file, CancellationToken cancellationToken);
}
using DocIndex.Api.Application.Domain.ValueObjects;

namespace DocIndex.Api.Infrastructure.Files;

public sealed class FileStorage : IFileStorage
{
    public async Task<Stream> GetFileAsync(string id, CancellationToken cancellationToken)
    {
        var bytes = await File.ReadAllBytesAsync(id, cancellationToken: cancellationToken);
        var ms = new MemoryStream(bytes);
        return ms;
    }

    public Task DeleteFileAsync(string id, CancellationToken cancellationToken)
    {
        if (File.Exists(id))
            File.Delete(id);
        return Task.CompletedTask;
    }

    public async Task UploadFileAsync(UploadingFile file, CancellationToken cancellationToken)
    {
        await File.WriteAllBytesAsync(file.Path, file.Content.ToArray(), cancellationToken);
    }
}
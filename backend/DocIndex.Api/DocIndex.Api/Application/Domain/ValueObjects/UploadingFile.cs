namespace DocIndex.Api.Application.Domain.ValueObjects;

public sealed record UploadingFile : IAsyncDisposable, IDisposable
{
    public required MemoryStream Content { get; init; }
    
    public required string Path { get; init; }

    public void Dispose()
        => Content.Dispose();

    public async ValueTask DisposeAsync()
        => await Content.DisposeAsync();
}
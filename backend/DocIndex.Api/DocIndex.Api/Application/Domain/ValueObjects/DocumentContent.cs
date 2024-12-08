using DocIndex.Api.Application.Domain.Entities;

namespace DocIndex.Api.Application.Domain.ValueObjects;

public sealed record DocumentContent : IDisposable, IAsyncDisposable
{
    public required Document Document { get; init; }
    
    public required Stream Content { get; init; }

    public void Dispose()
        => Content.Dispose();

    public async ValueTask DisposeAsync()
        => await Content.DisposeAsync();
}
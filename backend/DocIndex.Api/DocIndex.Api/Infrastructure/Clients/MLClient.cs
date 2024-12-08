using DocIndex.Api.Application.Domain.ValueObjects;

namespace DocIndex.Api.Infrastructure.Clients;

public sealed class MlClient : IMlClient
{
    private readonly HttpClient _client;

    public MlClient(IHttpClientFactory factory)
    {
        _client = factory.CreateClient();
        _client.BaseAddress = new Uri(
            Environment.GetEnvironmentVariable("ML_API_URL") ?? "https://w720kyyjcnwe0j-8000.proxy.runpod.net");
    }

    public async Task IndexAsync(DocumentContent document, CancellationToken cancellationToken)
    {
        // await _client.PostAsync("/index", new FormUrlEncodedContent(), cancellationToken);
    }

    public Task<Stream> GetFileAsync(string file, CancellationToken cancellationToken)
        // await _client.PostAsync("/page", new FormUrlEncodedContent(), cancellationToken);
        => throw new NotImplementedException();
}
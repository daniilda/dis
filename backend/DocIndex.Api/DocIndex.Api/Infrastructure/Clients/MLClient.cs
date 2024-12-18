using System.Net.Http.Headers;
using System.Text.Json.Serialization;
using DocIndex.Api.Application.Domain.Entities;
using DocIndex.Api.Application.Domain.Enums;
using DocIndex.Api.Application.Domain.ValueObjects;
using DocIndex.Api.Infrastructure.DbAccess;
using DocIndex.Api.Infrastructure.DbAccess.Models;
using LinqToDB;

namespace DocIndex.Api.Infrastructure.Clients;

public sealed class MlClient : IMlClient
{
    private readonly HttpClient _client;
    private readonly IDbContextFactory _contextFactory;

    public MlClient(IHttpClientFactory factory, IDbContextFactory contextFactory)
    {
        _contextFactory = contextFactory;
        _client = factory.CreateClient();
        _client.BaseAddress = new Uri(
            Environment.GetEnvironmentVariable("ML_API_URL") ?? "https://w720kyyjcnwe0j-8000.proxy.runpod.net");
    }

    public async Task IndexAsync(DocumentContent document, CancellationToken cancellationToken)
    {
        using var multipartFormContent = new MultipartFormDataContent();
        var fileStreamContent = new StreamContent(document.Content);
        fileStreamContent.Headers.ContentType = new MediaTypeHeaderValue("application/pdf");
        multipartFormContent.Add(fileStreamContent, name: "file", fileName: $"{document.Document.Id}.pdf");
        var res = await _client.PostAsync($"/index?id={document.Document.Id}", multipartFormContent, cancellationToken);
        res.EnsureSuccessStatusCode();
    }

    public async Task<ChatMessage> QueryAsync(string query, CancellationToken cancellationToken)
    {
        var res = await _client.PostAsync($"/query?query={query}", null, cancellationToken);
        res.EnsureSuccessStatusCode();
        var json = await res.Content.ReadFromJsonAsync<Response>(cancellationToken: cancellationToken);
        Document? doc = null;
        if (Guid.TryParse(json.DocumentId, out var id))
        {
            await using var connection = _contextFactory.CreateConnection();
            var db = await connection.GetTable<DocumentDb>().FirstOrDefaultAsync(a => a.Id == id);
            if (db is not null)
                doc = new Document(db.Id)
                {
                    Name = db.Name,
                    Format = (FileFormat)db.FileFormat,
                    CreatedAt = db.CreatedAt,
                    State = (DocumentState)db.State
                };
        }

        return new ChatMessage
        {
            IsBot = true,
            CreatedAt = DateTime.UtcNow,
            Text = json.ResponseField,
            Document = doc,
            PictureFileId = $"{json.DocumentId}_{json.Page}"
        };
    }

    public async Task<Stream> GetFileAsync(string docId, int page, CancellationToken cancellationToken)
    {
        var res = await _client.GetAsync($"/page?doc_id={docId}?page={page}", cancellationToken);
        return await res.Content.ReadAsStreamAsync(cancellationToken);
    }

    record Response()
    {
        [JsonPropertyName("response")] public string? ResponseField { get; init; }

        [JsonPropertyName("document_id")] public string? DocumentId { get; init; }

        [JsonPropertyName("page")] public int Page { get; init; }
    }
}
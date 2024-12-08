using DocIndex.Api.Application.Domain.Entities;
using DocIndex.Api.Application.Domain.Enums;
using DocIndex.Api.Application.Domain.ValueObjects;
using DocIndex.Api.Infrastructure.Clients;
using DocIndex.Api.Infrastructure.DbAccess;
using DocIndex.Api.Infrastructure.DbAccess.Models;
using DocIndex.Api.Infrastructure.Files;
using LinqToDB;
using Microsoft.OpenApi.Models;

namespace DocIndex.Api.Infrastructure.Workers;

public sealed class IndexingWorker(IServiceScopeFactory serviceScopeFactory) : BackgroundService
{
    private readonly IServiceScopeFactory _serviceScopeFactory = serviceScopeFactory;

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        await Task.Yield();

        while (stoppingToken.IsCancellationRequested is false)
        {
            await Task.Delay(100, stoppingToken);
            {
                await using var scope = _serviceScopeFactory.CreateAsyncScope();
                var contextFactory = scope.ServiceProvider.GetRequiredService<IDbContextFactory>();
                var client = scope.ServiceProvider.GetRequiredService<IMlClient>();
                var fileStorage = scope.ServiceProvider.GetRequiredService<IFileStorage>();
                await using var connection = contextFactory.CreateConnection();
                var db = await connection
                    .GetTable<DocumentDb>()
                    .Where(a => a.State == (int)DocumentState.Created)
                    .OrderBy(a => a.CreatedAt)
                    .FirstOrDefaultAsync(token: stoppingToken);
                if (db is null)
                    continue;
                var a = await fileStorage.GetFileAsync(db.Id.ToString(), stoppingToken);
                var document = new DocumentContent
                {
                    Document = new Document(db.Id)
                    {
                        Name = db.Name,
                        Format = (FileFormat)db.FileFormat,
                        CreatedAt = db.CreatedAt,
                        State = (DocumentState)db.State
                    },
                    Content = a
                };
                await client.IndexAsync(document, stoppingToken);
                await connection
                    .GetTable<DocumentDb>()
                    .Where(d => d.Id == document.Document.Id)
                    .AsUpdatable()
                    .Set(q => q.State, (int)DocumentState.Indexed)
                    .UpdateAsync(token: stoppingToken);
            }
        }
    }
}
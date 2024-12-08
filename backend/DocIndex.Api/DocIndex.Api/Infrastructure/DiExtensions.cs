using DocIndex.Api.Infrastructure.Clients;
using DocIndex.Api.Infrastructure.DbAccess;
using DocIndex.Api.Infrastructure.Files;
using DocIndex.Api.Infrastructure.Workers;

namespace DocIndex.Api.Infrastructure;

public static class DiExtensions
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services)
        => services
            .AddHttpClient()
            .AddHostedService<IndexingWorker>()
            .AddScoped<IDbContextFactory, DbContextFactory>()
            .AddScoped<IFileStorage, FileStorage>()
            .AddScoped<IMlClient, MlClient>();
}
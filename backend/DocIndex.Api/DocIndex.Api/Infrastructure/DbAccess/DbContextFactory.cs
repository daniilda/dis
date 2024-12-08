using LinqToDB;
using LinqToDB.Data;
using LinqToDB.DataProvider.PostgreSQL;
using Npgsql;

namespace DocIndex.Api.Infrastructure.DbAccess;

public sealed class DbContextFactory : IDbContextFactory
{
    public DataConnection CreateConnection()
    {
        var connection = new NpgsqlConnection(Environment.GetEnvironmentVariable("PG_DB_CONNECTION_STRING") 
                                              ?? "server=localhost;port=5432;UserId=postgres;Password=123;Database=postgres;");
        connection.Open();
        var options = new DataOptions()
            .UseConnection(PostgreSQLTools.GetDataProvider(PostgreSQLVersion.v95), connection, true);
        return new DataConnection(options);
    }
}
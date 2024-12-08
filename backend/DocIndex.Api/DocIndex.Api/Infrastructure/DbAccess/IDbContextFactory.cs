using LinqToDB.Data;

namespace DocIndex.Api.Infrastructure.DbAccess;

public interface IDbContextFactory
{
    DataConnection CreateConnection();
}
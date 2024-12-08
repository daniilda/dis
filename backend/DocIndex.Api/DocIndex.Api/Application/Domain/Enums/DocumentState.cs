namespace DocIndex.Api.Application.Domain.Enums;

public enum DocumentState
{
    Unknown = 0,
    Created = 1,
    Preparing = 2,
    Indexing = 3,
    Indexed = 4
}
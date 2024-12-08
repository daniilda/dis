using Microsoft.AspNetCore.Mvc;

namespace DocIndex.Api.Controllers;

public sealed record CreateChatResponseRequest
{
    [FromRoute]
    public required Guid SessionId { get; init; }
    
    [FromRoute]
    public required Guid ChatId { get; init; }
    
    [FromBody]
    public required string Query { get; init; }
}
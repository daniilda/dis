using DocIndex.Api.Application.Domain.Enums;
using DocIndex.Api.Infrastructure.Clients;
using DocIndex.Api.Infrastructure.DbAccess;
using DocIndex.Api.Infrastructure.DbAccess.Models;
using DocIndex.Api.Infrastructure.Files;
using LinqToDB;
using Microsoft.AspNetCore.Mvc;

namespace DocIndex.Api.Controllers;

[ApiController]
[Route("api/v1/files")]
public sealed class FileController(IFileStorage fileStorage, IDbContextFactory contextFactory, IMlClient mlClient) : ControllerBase
{
    private readonly IDbContextFactory _contextFactory = contextFactory;
    private readonly IFileStorage _fileStorage = fileStorage;
    private readonly IMlClient _mlClient = mlClient;

    [HttpGet("documents/{fileId:guid}")]
    public async Task<IActionResult> GetDocumentFileById(Guid fileId, CancellationToken cancellationToken)
    {
        await using var connection = _contextFactory.CreateConnection();
        var doc = await connection.GetTable<DocumentDb>().FirstOrDefaultAsync(a => a.Id == fileId, token: cancellationToken);
        if (doc is null)
            return NotFound();
        
        var result = await _fileStorage.GetFileAsync(fileId.ToString(), cancellationToken);
        return File(result, ResolveContentType((FileFormat)doc.FileFormat), fileDownloadName: doc.Name);
    }
    
    [HttpGet("documents/pages/{documentId:guid}/{page:int}")]
    public async Task<IActionResult> GetDocumentPageFileById([FromRoute]Guid documentId, [FromRoute]int page, CancellationToken cancellationToken)
    {
        var result = await _mlClient.GetFileAsync(documentId.ToString(), cancellationToken);
        return File(result, "image/png", fileDownloadName: documentId.ToString() + ".png");
    }

    private string ResolveContentType(FileFormat format)
    {
        switch (format)
        {
            case FileFormat.Pdf:
                return "application/pdf";
            case FileFormat.Png:
                return "image/png";
            case FileFormat.Docx:
                return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
            default:
                throw new ArgumentOutOfRangeException(nameof(format), format, null);
        }
    }
    
    private string ResolveFileType(FileFormat format)
    {
        switch (format)
        {
            case FileFormat.Pdf:
                return ".pdf";
            case FileFormat.Png:
                return ".png";
            case FileFormat.Docx:
                return ".docx";
            default:
                throw new ArgumentOutOfRangeException(nameof(format), format, null);
        }
    }
}
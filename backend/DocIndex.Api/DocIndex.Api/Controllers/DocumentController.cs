using System.IO.Compression;
using DocIndex.Api.Application.Domain.Entities;
using DocIndex.Api.Application.Domain.Enums;
using DocIndex.Api.Application.Domain.ValueObjects;
using DocIndex.Api.Infrastructure.DbAccess;
using DocIndex.Api.Infrastructure.DbAccess.Models;
using DocIndex.Api.Infrastructure.Files;
using LinqToDB;
using LinqToDB.Data;
using Microsoft.AspNetCore.Mvc;

namespace DocIndex.Api.Controllers;

[ApiController]
[Route("api/v1/documents")]
public sealed class DocumentController(IDbContextFactory contextFactory, IFileStorage fileStorage) : ControllerBase
{
    private readonly IDbContextFactory _contextFactory = contextFactory;
    private readonly IFileStorage _fileStorage = fileStorage;

    [HttpGet]
    public async Task<ListDocumentsResponse> List(
        [FromQuery] Pagination pagination,
        CancellationToken cancellationToken)
    {
        await using var connection = _contextFactory.CreateConnection();
        var table = connection.GetTable<DocumentDb>();
        var total = await table.CountAsync(token: cancellationToken);
        var paginated = await table
            .OrderByDescending(db => db.CreatedAt)
            .Skip(pagination.Offset)
            .Take(pagination.Limit)
            .ToArrayAsync(token: cancellationToken);
        var mapped = paginated.Select(
            db => new Document(db.Id)
            {
                Name = db.Name,
                Format = (FileFormat)db.FileFormat,
                CreatedAt = db.CreatedAt,
                State = (DocumentState)db.State
            });

        return new ListDocumentsResponse
        {
            Documents = mapped.ToArray(),
            PaginationResponse = new PaginationResponse(total)
        };
    }

    [HttpDelete("{id:guid}")]
    public async Task Delete([FromRoute] Guid id, CancellationToken cancellationToken)
    {
        await using var connection = _contextFactory.CreateConnection();
        await using var transaction = await connection.BeginTransactionAsync(cancellationToken);
        await connection.GetTable<DocumentDb>().Where(a => a.Id == id).DeleteAsync(token: cancellationToken);
        await connection.GetTable<UserQueryResponseDb>()
            .Where(a => a.DocumentId == id)
            .DeleteAsync(token: cancellationToken);
        await _fileStorage.DeleteFileAsync(id.ToString(), cancellationToken);
        await transaction.CommitAsync(cancellationToken);
    }

    [HttpPost]
    [DisableRequestSizeLimit]
    public async Task Upload(IFormFileCollection collection, CancellationToken cancellationToken)
    {
        await using var connection = _contextFactory.CreateConnection();
        await using var transaction = await connection.BeginTransactionAsync(cancellationToken);
        foreach (var formFile in collection)
        {
            if (formFile.ContentType == "application/zip")
            {
                var filesFromZip = ResolveZip(formFile.OpenReadStream());
                await foreach (var file in filesFromZip)
                {
                    await ResolveFiles(connection, file.Item1, file.Item2, file.Item3, cancellationToken);
                }
            }

            // if (formFile.ContentType == "application/vnd.openxmlformats-officedocument.wordprocessingml.document")
            //     await ResolveFiles(
            //         connection,
            //         formFile.OpenReadStream(),
            //         FileFormat.Docx,
            //         formFile.FileName,
            //         cancellationToken);

            if (formFile.ContentType == "application/pdf")
                await ResolveFiles(
                    connection,
                    formFile.OpenReadStream(),
                    FileFormat.Pdf,
                    formFile.FileName,
                    cancellationToken);

            // if (formFile.ContentType == "image/png")
            //     await ResolveFiles(
            //         connection,
            //         formFile.OpenReadStream(),
            //         FileFormat.Png,
            //         formFile.FileName,
            //         cancellationToken);
        }

        await transaction.CommitAsync(cancellationToken);
    }

    private async Task ResolveFiles(
        DataConnection connection,
        Stream stream,
        FileFormat format,
        string name,
        CancellationToken cancellationToken)
    {
        var id = Guid.NewGuid();
        var ms = new MemoryStream();
        await stream.CopyToAsync(ms, cancellationToken: cancellationToken);
        ms.Position = 0;
        var doc = new DocumentDb
        {
            Id = id,
            Name = name,
            FileFormat = (int)format,
            CreatedAt = DateTime.UtcNow,
            State = (int)DocumentState.Created
        };
        await using var uploadFile = new UploadingFile
        {
            Content = ms,
            Path = id.ToString()
        };
        await _fileStorage.UploadFileAsync(uploadFile, cancellationToken);
        await connection.InsertAsync(doc, token: cancellationToken);
    }

    private async IAsyncEnumerable<(Stream, FileFormat, string)> ResolveZip(Stream zip)
    {
        using var zipFile = new ZipArchive(zip, ZipArchiveMode.Read);
        foreach (var zipArchiveEntry in zipFile.Entries)
        {
            if (zipArchiveEntry.Name.Contains(".zip"))
            {
                await foreach (var item in ResolveZip(zipArchiveEntry.Open()))
                {
                    yield return item;
                }
            }

            if (zipArchiveEntry.Name.Contains(".pdf"))
                yield return (zipArchiveEntry.Open(), FileFormat.Pdf, zipArchiveEntry.Name);
            // if (zipArchiveEntry.Name.Contains(".png"))
            //     yield return (zipArchiveEntry.Open(), FileFormat.Png, zipArchiveEntry.Name);
            // if (zipArchiveEntry.Name.Contains(".docx"))
            //     yield return (zipArchiveEntry.Open(), FileFormat.Docx, zipArchiveEntry.Name);
        }
    }
}
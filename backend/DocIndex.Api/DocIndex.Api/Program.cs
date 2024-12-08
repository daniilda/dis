using DocIndex.Api.Infrastructure;

var builder = WebApplication.CreateBuilder(args);


builder.Services.AddControllers();
builder.Services.AddOpenApi();
builder.Services.AddInfrastructure();

var app = builder.Build();

app.MapOpenApi();

app.UseSwaggerUI(a => a.SwaggerEndpoint("/openapi/v1.json", ""));

app.UseCors(a => a.AllowAnyHeader().AllowAnyMethod().AllowAnyOrigin());

app.UseAuthorization();

app.MapControllers();

app.Run();
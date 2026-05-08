using LibraryFlow.Application.Services;
using LibraryFlow.Infrastructure.Data;
using LibraryFlow.Infrastructure.Repositories;
using LibraryFlow.Application.Interfaces;
using LibraryFlow.API.Middleware;
using Microsoft.EntityFrameworkCore;
using Scalar.AspNetCore;

var builder = WebApplication.CreateBuilder(args);

// ── Base de datos ──────────────────────────────────────────────────────────
builder.Services.AddDbContext<LibraryFlowDbContext>(options =>
    options.UseNpgsql(
        builder.Configuration.GetConnectionString("DefaultConnection"),
        npgsqlOptions => npgsqlOptions.EnableRetryOnFailure(
            maxRetryCount: 3,
            maxRetryDelay: TimeSpan.FromSeconds(5),
            errorCodesToAdd: null)));

// ── Repositorios ───────────────────────────────────────────────────────────
builder.Services.AddScoped<IBookRepository, BookRepository>();
builder.Services.AddScoped<IReservationRepository, ReservationRepository>();

// ── Servicios ──────────────────────────────────────────────────────────────
builder.Services.AddScoped<BookService>();
builder.Services.AddScoped<ReservationService>();

// ── CORS ───────────────────────────────────────────────────────────────────
builder.Services.AddCors(options =>
{
    options.AddPolicy("FrontendPolicy", policy =>
    {
        policy
            .WithOrigins(
                "http://localhost:5173",
                "http://localhost:4173")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

// ── Controllers + OpenAPI ──────────────────────────────────────────────────
builder.Services.AddControllers();
builder.Services.AddOpenApi();

var app = builder.Build();

// ── Middleware global de errores (debe ir primero) ─────────────────────────
app.UseMiddleware<ErrorHandlingMiddleware>();

// ── OpenAPI + Scalar solo en desarrollo ───────────────────────────────────
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference(options =>
    {
        options.Title = "LibraryFlow API";
        options.Theme = ScalarTheme.DeepSpace;
    });
}

app.UseHttpsRedirection();
app.UseCors("FrontendPolicy");
app.MapControllers();

// ── Migración automática al arrancar ──────────────────────────────────────
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<LibraryFlowDbContext>();
    db.Database.Migrate();
}

app.Run();
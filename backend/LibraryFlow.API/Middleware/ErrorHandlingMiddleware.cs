using LibraryFlow.Application.DTOs;
using System.Net;
using System.Text.Json;

namespace LibraryFlow.API.Middleware;

public class ErrorHandlingMiddleware(RequestDelegate next, ILogger<ErrorHandlingMiddleware> logger)
{
    private readonly RequestDelegate _next = next;
    private readonly ILogger<ErrorHandlingMiddleware> _logger = logger;

    private static readonly JsonSerializerOptions _jsonOptions = new()
    {
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase
    };

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unhandled exception: {Message}", ex.Message);
            await HandleExceptionAsync(context, ex);
        }
    }

    private static async Task HandleExceptionAsync(HttpContext context, Exception ex)
    {
        var (status, title, detail) = ex switch
        {
            KeyNotFoundException => (
                HttpStatusCode.NotFound,
                "Recurso no encontrado",
                ex.Message),

            InvalidOperationException => (
                HttpStatusCode.Conflict,
                "Operación no permitida",
                ex.Message),

            ArgumentException => (
                HttpStatusCode.BadRequest,
                "Solicitud inválida",
                ex.Message),

            _ => (
                HttpStatusCode.InternalServerError,
                "Error interno del servidor",
                "Ocurrió un error inesperado.")
        };

        var response = new ErrorResponseDto
        {
            Title = title,
            Status = (int)status,
            Detail = detail
        };

        context.Response.ContentType = "application/json";
        context.Response.StatusCode = (int)status;

        await context.Response.WriteAsync(
            JsonSerializer.Serialize(response, _jsonOptions));
    }
}
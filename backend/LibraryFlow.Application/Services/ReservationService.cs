using LibraryFlow.Application.DTOs;
using LibraryFlow.Application.Interfaces;
using LibraryFlow.Domain.Entities;

namespace LibraryFlow.Application.Services;

public class ReservationService(
    IReservationRepository reservationRepository,
    IBookRepository bookRepository)
{
    private readonly IReservationRepository _reservationRepository = reservationRepository;
    private readonly IBookRepository _bookRepository = bookRepository;

    private const int MaxRetries = 3;

    public async Task<IEnumerable<ReservationDto>> GetAllAsync()
    {
        var reservations = await _reservationRepository.GetAllAsync();
        return reservations.Select(MapToDto);
    }

    public async Task<ReservationDto> CreateAsync(CreateReservationDto dto)
    {
        int attempt = 0;

        while (true)
        {
            attempt++;

            try
            {
                var book = await _bookRepository.GetByIdWithLockAsync(dto.BookId)
                    ?? throw new KeyNotFoundException($"Libro con Id {dto.BookId} no encontrado.");

                if (book.StockDisponible <= 0)
                    throw new InvalidOperationException(
                        $"El libro '{book.Title}' no tiene stock disponible.");

                book.StockDisponible--;

                await _bookRepository.UpdateAsync(book);

                var reservation = new Reservation
                {
                    BookId = dto.BookId,
                    UserName = dto.UserName.Trim(),
                    CreatedAt = DateTime.UtcNow
                };

                var created = await _reservationRepository.CreateAsync(reservation);
                return MapToDto(created);
            }
            catch (ConcurrencyException) when (attempt < MaxRetries)
            {
                // Backoff exponencial: 200ms, 400ms antes de reintentar
                int delayMs = (int)Math.Pow(2, attempt) * 100;
                await Task.Delay(delayMs);
            }
            catch (ConcurrencyException)
            {
                throw new InvalidOperationException(
                    "No se pudo completar la reserva por alta concurrencia. Intenta de nuevo.");
            }
        }
    }

    private static ReservationDto MapToDto(Reservation r) => new()
    {
        Id = r.Id,
        UserName = r.UserName,
        BookId = r.BookId,
        BookTitle = r.Book?.Title ?? string.Empty,
        BookAuthor = r.Book?.Author ?? string.Empty,
        CreatedAt = r.CreatedAt
    };
}
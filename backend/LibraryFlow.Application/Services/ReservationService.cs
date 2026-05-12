using LibraryFlow.Application.DTOs;
using LibraryFlow.Application.Interfaces;
using LibraryFlow.Domain.Entities;

namespace LibraryFlow.Application.Services;

public class ReservationService(
    IReservationRepository reservationRepository,
    IBookRepository bookRepository,
    IUnitOfWork unitOfWork)
{
    private readonly IReservationRepository _reservationRepository = reservationRepository;
    private readonly IBookRepository _bookRepository = bookRepository;
    private readonly IUnitOfWork _unitOfWork = unitOfWork;

    private const int MaxRetries = 3;
    private const int DueDays = 7;

    public async Task<IEnumerable<ReservationDto>> GetAllAsync()
    {
        var reservations = await _reservationRepository.GetAllAsync();
        return reservations.Select(MapToDto);
    }

    public async Task<IEnumerable<ReservationDto>> GetByUserIdAsync(int userId)
    {
        var reservations = await _reservationRepository.GetByUserIdAsync(userId);
        return reservations.Select(MapToDto);
    }

    public async Task<ReservationDto> CreateAsync(CreateReservationDto dto, int userId)
    {
        int attempt = 0;

        while (true)
        {
            attempt++;

            try
            {
                await _unitOfWork.BeginTransactionAsync();

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
                    UserId = userId,
                    Status = ReservationStatus.Activa,
                    CreatedAt = DateTime.UtcNow,
                    DueDate = DateTime.UtcNow.AddDays(DueDays)
                };

                var created = await _reservationRepository.CreateAsync(reservation);
                await _unitOfWork.CommitAsync();

                return MapToDto(created);
            }
            catch (ConcurrencyException) when (attempt < MaxRetries)
            {
                await _unitOfWork.RollbackAsync();
                int delayMs = (int)Math.Pow(2, attempt) * 100;
                await Task.Delay(delayMs);
            }
            catch (ConcurrencyException)
            {
                await _unitOfWork.RollbackAsync();
                throw new InvalidOperationException(
                    "No se pudo completar la reserva por alta concurrencia. Intenta de nuevo.");
            }
            catch
            {
                await _unitOfWork.RollbackAsync();
                throw;
            }
        }
    }

    public async Task<ReservationDto> ReturnAsync(int reservationId, int userId, bool isBibliotecario)
{
    var reservation = await _reservationRepository.GetByIdAsync(reservationId)
        ?? throw new KeyNotFoundException($"Reserva con Id {reservationId} no encontrada.");

    if (!isBibliotecario && reservation.UserId != userId)
        throw new InvalidOperationException("No tienes permiso para devolver esta reserva.");

    if (reservation.Status != ReservationStatus.Activa)
        throw new InvalidOperationException("Esta reserva ya fue devuelta o está vencida.");

    await _unitOfWork.BeginTransactionAsync();

    try
    {
        var book = await _bookRepository.GetByIdWithLockAsync(reservation.BookId)
            ?? throw new KeyNotFoundException("Libro no encontrado.");

        book.StockDisponible++;
        await _bookRepository.UpdateAsync(book);

        reservation.Status = ReservationStatus.Devuelta;
        reservation.ReturnedAt = DateTime.UtcNow;
        await _reservationRepository.UpdateAsync(reservation);

        await _unitOfWork.CommitAsync();

        return MapToDto(reservation);
    }
    catch
    {
        await _unitOfWork.RollbackAsync();
        throw;
    }
}

    private static ReservationDto MapToDto(Reservation r) => new()
    {
        Id = r.Id,
        UserId = r.UserId,
        UserFullName = r.User?.FullName ?? string.Empty,
        BookId = r.BookId,
        BookTitle = r.Book?.Title ?? string.Empty,
        BookAuthor = r.Book?.Author ?? string.Empty,
        Status = r.Status.ToString(),
        CreatedAt = r.CreatedAt,
        DueDate = r.DueDate,
        ReturnedAt = r.ReturnedAt
    };
}
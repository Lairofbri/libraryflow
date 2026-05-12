using LibraryFlow.Domain.Entities;

namespace LibraryFlow.Application.Interfaces;

public interface IReservationRepository
{
    Task<IEnumerable<Reservation>> GetAllAsync();
    Task<IEnumerable<Reservation>> GetByUserIdAsync(int userId);
    Task<Reservation?> GetByIdAsync(int id);
    Task<Reservation> CreateAsync(Reservation reservation);
    Task UpdateAsync(Reservation reservation);
}
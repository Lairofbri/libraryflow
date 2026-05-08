using LibraryFlow.Domain.Entities;

namespace LibraryFlow.Application.Interfaces;

public interface IReservationRepository
{
    Task<IEnumerable<Reservation>> GetAllAsync();
    Task<Reservation> CreateAsync(Reservation reservation);
}
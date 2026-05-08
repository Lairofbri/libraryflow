using LibraryFlow.Application.Interfaces;
using LibraryFlow.Domain.Entities;
using LibraryFlow.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace LibraryFlow.Infrastructure.Repositories;

public class ReservationRepository(LibraryFlowDbContext context) : IReservationRepository
{
    private readonly LibraryFlowDbContext _context = context;

    public async Task<IEnumerable<Reservation>> GetAllAsync()
    {
        return await _context.Reservations
            .AsNoTracking()
            .Include(r => r.Book)
            .OrderByDescending(r => r.CreatedAt)
            .ToListAsync();
    }

    public async Task<Reservation> CreateAsync(Reservation reservation)
    {
        _context.Reservations.Add(reservation);
        await _context.SaveChangesAsync();

        // Recargamos con el libro incluido para el mapeo en el servicio
        await _context.Entry(reservation)
            .Reference(r => r.Book)
            .LoadAsync();

        return reservation;
    }
}
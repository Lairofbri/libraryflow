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
            .Include(r => r.User)
            .OrderByDescending(r => r.CreatedAt)
            .ToListAsync();
    }

    public async Task<IEnumerable<Reservation>> GetByUserIdAsync(int userId)
    {
        return await _context.Reservations
            .AsNoTracking()
            .Include(r => r.Book)
            .Include(r => r.User)
            .Where(r => r.UserId == userId)
            .OrderByDescending(r => r.CreatedAt)
            .ToListAsync();
    }

    public async Task<Reservation?> GetByIdAsync(int id)
    {
        return await _context.Reservations
            .Include(r => r.Book)
            .Include(r => r.User)
            .FirstOrDefaultAsync(r => r.Id == id);
    }

    public async Task<Reservation> CreateAsync(Reservation reservation)
    {
        _context.Reservations.Add(reservation);
        await _context.SaveChangesAsync();

        await _context.Entry(reservation).Reference(r => r.Book).LoadAsync();
        await _context.Entry(reservation).Reference(r => r.User).LoadAsync();

        return reservation;
    }

    public async Task UpdateAsync(Reservation reservation)
    {
        _context.Reservations.Update(reservation);
        await _context.SaveChangesAsync();
    }
}
using LibraryFlow.Application.Interfaces;
using LibraryFlow.Domain.Entities;
using LibraryFlow.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace LibraryFlow.Infrastructure.Repositories;

public class BookRepository(LibraryFlowDbContext context) : IBookRepository
{
    private readonly LibraryFlowDbContext _context = context;

    public async Task<IEnumerable<Book>> GetAllAsync()
    {
        return await _context.Books
            .AsNoTracking()
            .OrderBy(b => b.Title)
            .ToListAsync();
    }

    public async Task<Book?> GetByIdAsync(int id)
    {
        return await _context.Books
            .AsNoTracking()
            .FirstOrDefaultAsync(b => b.Id == id);
    }

    public async Task<Book?> GetByIdWithLockAsync(int id)
    {
        // PostgreSQL: SELECT ... FOR UPDATE bloquea la fila
        // durante la transacción activa — equivalente al UPDLOCK de SQL Server
        return await _context.Books
            .FromSqlRaw("SELECT * FROM \"Books\" WHERE \"Id\" = {0} FOR UPDATE", id)
            .FirstOrDefaultAsync();
    }

    public async Task<Book> CreateAsync(Book book)
    {
        _context.Books.Add(book);
        await _context.SaveChangesAsync();
        return book;
    }

    public async Task UpdateAsync(Book book)
    {
        try
        {
            book.Version++;
            _context.Books.Update(book);
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException ex)
        {
            throw new ConcurrencyException(
                "El libro fue modificado por otra operación simultánea.", ex);
        }
    }
}
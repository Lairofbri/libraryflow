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
        // Pessimistic locking: bloquea la fila durante la transacción.
        // UPDLOCK evita deadlocks, ROWLOCK limita el bloqueo a la fila exacta.
        // Ninguna otra transacción puede leer ni modificar este registro
        // hasta que la transacción actual haga commit o rollback.
        return await _context.Books
            .FromSqlRaw(
                "SELECT * FROM Books WITH (UPDLOCK, ROWLOCK) WHERE Id = {0}",
                id)
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
            _context.Books.Update(book);
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException ex)
        {
            // Convertimos la excepción de EF Core a nuestra excepción de dominio.
            // Así Application no depende de EF Core.
            throw new ConcurrencyException(
                "El libro fue modificado por otra operación simultánea.", ex);
        }
    }
}
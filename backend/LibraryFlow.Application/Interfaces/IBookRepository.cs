using LibraryFlow.Domain.Entities;

namespace LibraryFlow.Application.Interfaces;

public interface IBookRepository
{
    Task<IEnumerable<Book>> GetAllAsync();
    Task<Book?> GetByIdAsync(int id);
    Task<Book?> GetByIdWithLockAsync(int id);
    Task<Book> CreateAsync(Book book);
    Task UpdateAsync(Book book);
    Task<Book> UpdateBookAsync(Book book);
}
using LibraryFlow.Application.DTOs;
using LibraryFlow.Application.Interfaces;
using LibraryFlow.Domain.Entities;

namespace LibraryFlow.Application.Services;

public class BookService(IBookRepository bookRepository)
{
    private readonly IBookRepository _bookRepository = bookRepository;

    public async Task<IEnumerable<BookDto>> GetAllAsync()
    {
        var books = await _bookRepository.GetAllAsync();
        return books.Select(MapToDto);
    }

    public async Task<BookDto> CreateAsync(CreateBookDto dto)
    {
        var book = new Book
        {
            Title = dto.Title.Trim(),
            Author = dto.Author.Trim(),
            ISBN = dto.ISBN.Trim(),
            Genre = dto.Genre.Trim(),
            Publisher = dto.Publisher.Trim(),
            Year = dto.Year,
            Description = dto.Description.Trim(),
            CoverUrl = dto.CoverUrl.Trim(),
            StockDisponible = dto.StockDisponible
        };

        var created = await _bookRepository.CreateAsync(book);
        return MapToDto(created);
    }

    private static BookDto MapToDto(Book b) => new()
    {
        Id = b.Id,
        Title = b.Title,
        Author = b.Author,
        ISBN = b.ISBN,
        Genre = b.Genre,
        Publisher = b.Publisher,
        Year = b.Year,
        Description = b.Description,
        CoverUrl = b.CoverUrl,
        StockDisponible = b.StockDisponible
    };
}
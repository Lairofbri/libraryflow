namespace LibraryFlow.Application.DTOs;

public class BookDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Author { get; set; } = string.Empty;
    public string ISBN { get; set; } = string.Empty;
    public string Genre { get; set; } = string.Empty;
    public string Publisher { get; set; } = string.Empty;
    public int Year { get; set; }
    public string Description { get; set; } = string.Empty;
    public string CoverUrl { get; set; } = string.Empty;
    public int StockDisponible { get; set; }
}
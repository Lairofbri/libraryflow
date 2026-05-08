using System.ComponentModel.DataAnnotations;

namespace LibraryFlow.Application.DTOs;

public class CreateBookDto
{
    [Required]
    [MinLength(1)]
    public string Title { get; set; } = string.Empty;

    [Required]
    [MinLength(1)]
    public string Author { get; set; } = string.Empty;

    [Range(0, int.MaxValue)]
    public int StockDisponible { get; set; }
}
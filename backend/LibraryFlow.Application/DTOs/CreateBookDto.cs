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

    [Required]
    [MinLength(10)]
    [MaxLength(13)]
    public string ISBN { get; set; } = string.Empty;

    [Required]
    public string Genre { get; set; } = string.Empty;

    [Required]
    public string Publisher { get; set; } = string.Empty;

    [Range(1000, 2100)]
    public int Year { get; set; }

    public string Description { get; set; } = string.Empty;
    public string CoverUrl { get; set; } = string.Empty;

    [Range(0, int.MaxValue)]
    public int StockDisponible { get; set; }
}
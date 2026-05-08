using System.ComponentModel.DataAnnotations;

namespace LibraryFlow.Application.DTOs;

public class CreateReservationDto
{
    [Required]
    [Range(1, int.MaxValue)]
    public int BookId { get; set; }

    [Required]
    [MinLength(1)]
    public string UserName { get; set; } = string.Empty;
}
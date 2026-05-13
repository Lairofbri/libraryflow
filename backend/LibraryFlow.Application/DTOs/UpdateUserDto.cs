using System.ComponentModel.DataAnnotations;

namespace LibraryFlow.Application.DTOs;

public class UpdateUserDto
{
    [Required]
    [MinLength(2)]
    public string FullName { get; set; } = string.Empty;

    public string? Password { get; set; }
}
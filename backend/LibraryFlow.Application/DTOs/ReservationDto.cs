namespace LibraryFlow.Application.DTOs;

public class ReservationDto
{
    public int Id { get; set; }
    public string UserName { get; set; } = string.Empty;
    public int BookId { get; set; }
    public string BookTitle { get; set; } = string.Empty;
    public string BookAuthor { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}
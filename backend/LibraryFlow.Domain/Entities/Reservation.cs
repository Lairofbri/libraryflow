namespace LibraryFlow.Domain.Entities;

public class Reservation
{
    public int Id { get; set; }
    public string UserName { get; set; } = string.Empty;
    public int BookId { get; set; }
    public DateTime CreatedAt { get; set; }

    // Propiedad de navegación — EF Core la usa para los JOINs
    public Book Book { get; set; } = null!;
}
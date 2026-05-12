namespace LibraryFlow.Domain.Entities;

public class Reservation
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public int BookId { get; set; }
    public ReservationStatus Status { get; set; } = ReservationStatus.Activa;
    public DateTime CreatedAt { get; set; }
    public DateTime DueDate { get; set; }
    public DateTime? ReturnedAt { get; set; }

    public User User { get; set; } = null!;
    public Book Book { get; set; } = null!;
}
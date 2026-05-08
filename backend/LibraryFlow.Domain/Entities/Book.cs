namespace LibraryFlow.Domain.Entities;

public class Book
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Author { get; set; } = string.Empty;
    public int StockDisponible { get; set; }

    // EF Core usa este campo para optimistic locking.
    // Se incrementa automáticamente en cada UPDATE en SQL Server.
    public byte[] RowVersion { get; set; } = [];

    public ICollection<Reservation> Reservations { get; set; } = [];
}
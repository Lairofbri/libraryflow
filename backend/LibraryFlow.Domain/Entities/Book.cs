namespace LibraryFlow.Domain.Entities;

public class Book
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Author { get; set; } = string.Empty;
    public int StockDisponible { get; set; }

     // Token de concurrencia optimista para PostgreSQL
    // Se incrementa manualmente en cada actualización
    public int Version { get; set; }

    // xmin es manejado internamente por PostgreSQL y Npgsql
    // No necesitamos declararlo explícitamente en la entidad
    public ICollection<Reservation> Reservations { get; set; } = [];

}
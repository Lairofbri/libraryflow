namespace LibraryFlow.Domain.Entities;

public class User
{
    public int Id { get; set; }
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public Role Role { get; set; } = Role.Cliente;
    public DateTime CreatedAt { get; set; }

    public ICollection<Reservation> Reservations { get; set; } = [];
}
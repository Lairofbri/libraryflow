using LibraryFlow.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace LibraryFlow.Infrastructure.Data;

public class LibraryFlowDbContext(DbContextOptions<LibraryFlowDbContext> options)
    : DbContext(options)
{
    public DbSet<Book> Books => Set<Book>();
    public DbSet<Reservation> Reservations => Set<Reservation>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Book>(entity =>
        {
            entity.HasKey(b => b.Id);

            entity.Property(b => b.Title)
                .IsRequired()
                .HasMaxLength(300);

            entity.Property(b => b.Author)
                .IsRequired()
                .HasMaxLength(200);

            entity.Property(b => b.StockDisponible)
                .IsRequired()
                .HasDefaultValue(0);

            // RowVersion: SQL Server lo gestiona automáticamente.
            // EF Core lo usa para detectar conflictos de concurrencia.
            entity.Property(b => b.RowVersion)
                .IsRowVersion()
                .IsConcurrencyToken();
        });

        modelBuilder.Entity<Reservation>(entity =>
        {
            entity.HasKey(r => r.Id);

            entity.Property(r => r.UserName)
                .IsRequired()
                .HasMaxLength(100);

            entity.Property(r => r.CreatedAt)
                .IsRequired();

            // Relación: una reserva pertenece a un libro
            entity.HasOne(r => r.Book)
                .WithMany(b => b.Reservations)
                .HasForeignKey(r => r.BookId)
                .OnDelete(DeleteBehavior.Restrict);
        });
    }
}
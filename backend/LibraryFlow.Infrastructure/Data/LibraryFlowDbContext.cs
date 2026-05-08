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

            // PostgreSQL: usamos Version como concurrency token manual
            entity.Property(b => b.Version)
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

            entity.HasOne(r => r.Book)
                .WithMany(b => b.Reservations)
                .HasForeignKey(r => r.BookId)
                .OnDelete(DeleteBehavior.Restrict);
        });
    }
}
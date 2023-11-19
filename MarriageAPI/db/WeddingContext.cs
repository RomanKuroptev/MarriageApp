// WeddingContext.cs
using Microsoft.EntityFrameworkCore;

public class WeddingContext : DbContext
{
    public WeddingContext(DbContextOptions<WeddingContext> options)
        : base(options)
    {
    }

    public DbSet<Guest> Guests { get; set; }
    public DbSet<Wedding> Weddings { get; set; }
}
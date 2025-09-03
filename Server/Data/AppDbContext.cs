using Microsoft.EntityFrameworkCore;
using Server.Models.Authentication;
using Server.Models.Trips;

namespace Server.Data
{
  public class AppDbContext : DbContext
  {
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<User> Users { get; set; }
    public DbSet<TripDetails> TripDetails { get; set; }
    public DbSet<Booking> Bookings { get; set; }
  public DbSet<TransportType> TransportTypes { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
      // Configure relationships, keys, and enum conversions here
    // Many-to-many TripDetails <-> TransportType
    modelBuilder.Entity<TripDetails>()
      .HasMany(td => td.TransportTypes)
      .WithMany(tt => tt.TripDetails)
      .UsingEntity(j => j.ToTable("TripDetails_TransportType"));

      // Add more configuration as needed
    }
  }
}
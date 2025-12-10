using Microsoft.EntityFrameworkCore;
using Travel.Genie.Models.Authentication;
using Travel.Genie.Models.Trips;
using Travel.Genie.Models.AI;

namespace Travel.Genie.Data
{
  public class AppDbContext : DbContext
  {
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<User> Users { get; set; }

    public DbSet<Trip> Trips { get; set; }
    public DbSet<Destination> Destinations { get; set; }
    public DbSet<TravelCompanion> TravelCompanions { get; set; }
    public DbSet<TripBudget> TripBudgets { get; set; }

    public DbSet<ItineraryDay> ItineraryDays { get; set; }
    public DbSet<ItineraryItem> ItineraryItems { get; set; }
    public DbSet<Place> Places { get; set; }
    public DbSet<Cost> Costs { get; set; }
    public DbSet<TransportInfo> TransportInfos { get; set; }
    public DbSet<AccommodationInfo> AccommodationInfos { get; set; }

    public DbSet<AiChatMessage> AiChatMessages { get; set; }

    public DbSet<TripDetails> TripDetails { get; set; }
    public DbSet<Booking> Bookings { get; set; }
    public DbSet<TransportType> TransportTypes { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
      base.OnModelCreating(modelBuilder);

      modelBuilder.ApplyConfigurationsFromAssembly(typeof(AppDbContext).Assembly);

      modelBuilder.Entity<TripDetails>()
        .HasMany(td => td.TransportTypes)
        .WithMany(tt => tt.TripDetails)
        .UsingEntity(j => j.ToTable("TripDetails_TransportType"));
    }
  }
}
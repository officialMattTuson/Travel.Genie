using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Travel.Genie.Models.Trips;

namespace Travel.Genie.Data.Configurations
{
    public class TripConfiguration : IEntityTypeConfiguration<Trip>
    {
        public void Configure(EntityTypeBuilder<Trip> builder)
        {
            builder.HasKey(t => t.Id);

            builder.Property(t => t.Name)
                .IsRequired()
                .HasMaxLength(256);

            builder.Property(t => t.Status)
                .IsRequired()
                .HasMaxLength(50)
                .HasDefaultValue("Draft");

            builder.Property(t => t.StartDate)
                .IsRequired();

            builder.Property(t => t.EndDate)
                .IsRequired();

            builder.HasOne(t => t.PrimaryDestination)
                .WithMany(d => d.Trips)
                .HasForeignKey(t => t.PrimaryDestinationId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasMany(t => t.Destinations)
                .WithMany(d => d.Trips)
                .UsingEntity(j => j.ToTable("TripDestinations"));

            builder.HasMany(t => t.Companions)
                .WithOne(c => c.Trip)
                .HasForeignKey(c => c.TripId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasMany(t => t.ItineraryDays)
                .WithOne(d => d.Trip)
                .HasForeignKey(d => d.TripId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(t => t.Budget)
                .WithOne(b => b.Trip)
                .HasForeignKey<TripBudget>(b => b.TripId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasIndex(t => t.UserId);
            builder.HasIndex(t => t.Status);
            builder.HasIndex(t => new { t.UserId, t.Status });
        }
    }
}

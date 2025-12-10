using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Travel.Genie.Models.Trips;

namespace Travel.Genie.Data.Configurations
{
    public class ItineraryDayConfiguration : IEntityTypeConfiguration<ItineraryDay>
    {
        public void Configure(EntityTypeBuilder<ItineraryDay> builder)
        {
            builder.HasKey(d => d.Id);

            builder.Property(d => d.Date)
                .IsRequired();

            builder.Property(d => d.DayNumber)
                .IsRequired();

            builder.Property(d => d.Summary)
                .HasMaxLength(1000);

            builder.HasMany(d => d.Items)
                .WithOne(i => i.ItineraryDay)
                .HasForeignKey(i => i.ItineraryDayId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasIndex(d => d.TripId);
            builder.HasIndex(d => new { d.TripId, d.Date });
        }
    }
}

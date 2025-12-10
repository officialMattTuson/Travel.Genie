using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Travel.Genie.Models.Trips;

namespace Travel.Genie.Data.Configurations
{
    public class ItineraryItemConfiguration : IEntityTypeConfiguration<ItineraryItem>
    {
        public void Configure(EntityTypeBuilder<ItineraryItem> builder)
        {
            builder.HasKey(i => i.Id);

            builder.Property(i => i.Type)
                .IsRequired()
                .HasMaxLength(50);

            builder.Property(i => i.Title)
                .IsRequired()
                .HasMaxLength(256);

            builder.Property(i => i.Description)
                .HasMaxLength(2000);

            builder.HasOne(i => i.Place)
                .WithMany(p => p.ItineraryItems)
                .HasForeignKey(i => i.PlaceId)
                .OnDelete(DeleteBehavior.SetNull);

            builder.HasOne(i => i.Cost)
                .WithOne(c => c.ItineraryItem)
                .HasForeignKey<Cost>(c => c.ItineraryItemId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(i => i.Transport)
                .WithOne(t => t.ItineraryItem)
                .HasForeignKey<TransportInfo>(t => t.ItineraryItemId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(i => i.Accommodation)
                .WithOne(a => a.ItineraryItem)
                .HasForeignKey<AccommodationInfo>(a => a.ItineraryItemId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasIndex(i => i.ItineraryDayId);
            builder.HasIndex(i => i.Type);
        }
    }
}

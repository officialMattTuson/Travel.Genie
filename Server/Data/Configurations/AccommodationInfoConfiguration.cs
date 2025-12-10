using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Travel.Genie.Models.Trips;

namespace Travel.Genie.Data.Configurations
{
    public class AccommodationInfoConfiguration : IEntityTypeConfiguration<AccommodationInfo>
    {
        public void Configure(EntityTypeBuilder<AccommodationInfo> builder)
        {
            builder.HasKey(a => a.Id);

            builder.Property(a => a.ProviderName)
                .IsRequired()
                .HasMaxLength(256);

            builder.Property(a => a.ProviderType)
                .HasMaxLength(100);

            builder.Property(a => a.CheckInDate)
                .IsRequired();

            builder.Property(a => a.CheckOutDate)
                .IsRequired();

            builder.Property(a => a.BookingReference)
                .HasMaxLength(256);

            builder.Property(a => a.BookingPlatform)
                .HasMaxLength(100);

            builder.HasOne(a => a.Location)
                .WithMany()
                .HasForeignKey(a => a.LocationId)
                .OnDelete(DeleteBehavior.SetNull);

            builder.HasIndex(a => a.ItineraryItemId)
                .IsUnique();
        }
    }
}

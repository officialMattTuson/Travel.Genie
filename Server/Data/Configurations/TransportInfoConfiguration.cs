using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Travel.Genie.Models.Trips;

namespace Travel.Genie.Data.Configurations
{
    public class TransportInfoConfiguration : IEntityTypeConfiguration<TransportInfo>
    {
        public void Configure(EntityTypeBuilder<TransportInfo> builder)
        {
            builder.HasKey(t => t.Id);

            builder.Property(t => t.Mode)
                .IsRequired()
                .HasMaxLength(50);

            builder.Property(t => t.BookingReference)
                .HasMaxLength(256);

            builder.Property(t => t.CarrierName)
                .HasMaxLength(256);

            builder.Property(t => t.TransportNumber)
                .HasMaxLength(50);

            builder.HasOne(t => t.FromPlace)
                .WithMany()
                .HasForeignKey(t => t.FromPlaceId)
                .OnDelete(DeleteBehavior.NoAction);

            builder.HasOne(t => t.ToPlace)
                .WithMany()
                .HasForeignKey(t => t.ToPlaceId)
                .OnDelete(DeleteBehavior.NoAction);

            builder.HasIndex(t => t.ItineraryItemId)
                .IsUnique();
        }
    }
}

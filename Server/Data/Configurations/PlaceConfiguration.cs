using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Travel.Genie.Models.Trips;

namespace Travel.Genie.Data.Configurations
{
    public class PlaceConfiguration : IEntityTypeConfiguration<Place>
    {
        public void Configure(EntityTypeBuilder<Place> builder)
        {
            builder.HasKey(p => p.Id);

            builder.Property(p => p.Name)
                .IsRequired()
                .HasMaxLength(256);

            builder.Property(p => p.Address)
                .HasMaxLength(500);

            builder.Property(p => p.GooglePlaceId)
                .HasMaxLength(256);

            builder.HasIndex(p => p.GooglePlaceId);
            builder.HasIndex(p => p.Name);
        }
    }
}

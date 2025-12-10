using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Travel.Genie.Models.Trips;

namespace Travel.Genie.Data.Configurations
{
    public class DestinationConfiguration : IEntityTypeConfiguration<Destination>
    {
        public void Configure(EntityTypeBuilder<Destination> builder)
        {
            builder.HasKey(d => d.Id);

            builder.Property(d => d.Name)
                .IsRequired()
                .HasMaxLength(256);

            builder.Property(d => d.CountryCode)
                .IsRequired()
                .HasMaxLength(2); // ISO 2-letter code

            builder.Property(d => d.TimeZoneId)
                .HasMaxLength(128);

            builder.HasMany(d => d.Places)
                .WithOne(p => p.Destination)
                .HasForeignKey(p => p.DestinationId)
                .OnDelete(DeleteBehavior.SetNull);

            builder.HasIndex(d => d.CountryCode);
            builder.HasIndex(d => d.Name);
        }
    }
}

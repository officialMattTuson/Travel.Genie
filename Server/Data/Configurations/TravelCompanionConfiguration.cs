using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Travel.Genie.Models.Trips;

namespace Travel.Genie.Data.Configurations
{
    public class TravelCompanionConfiguration : IEntityTypeConfiguration<TravelCompanion>
    {
        public void Configure(EntityTypeBuilder<TravelCompanion> builder)
        {
            builder.HasKey(c => c.Id);

            builder.Property(c => c.Name)
                .IsRequired()
                .HasMaxLength(256);

            builder.HasIndex(c => c.TripId);
        }
    }
}

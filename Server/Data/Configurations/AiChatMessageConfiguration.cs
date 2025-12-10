using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Travel.Genie.Models.AI;

namespace Travel.Genie.Data.Configurations
{
    public class AiChatMessageConfiguration : IEntityTypeConfiguration<AiChatMessage>
    {
        public void Configure(EntityTypeBuilder<AiChatMessage> builder)
        {
            builder.HasKey(m => m.Id);

            builder.Property(m => m.Sender)
                .IsRequired()
                .HasMaxLength(50);

            builder.Property(m => m.Message)
                .IsRequired()
                .HasMaxLength(4000);

            builder.Property(m => m.CreatedAt)
                .IsRequired()
                .ValueGeneratedOnAdd();

            builder.HasOne(m => m.Trip)
                .WithMany()
                .HasForeignKey(m => m.TripId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasIndex(m => m.TripId);
            builder.HasIndex(m => new { m.TripId, m.CreatedAt });
        }
    }
}

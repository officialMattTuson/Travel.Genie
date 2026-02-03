using Xunit;
using Microsoft.EntityFrameworkCore;
using Travel.Genie.Data;
using Travel.Genie.Models.Trips;
using Travel.Genie.Repositories;

namespace Travel.Genie.Repositories.Tests;

public class TripRepositoryTests
{
    private DbContextOptions<AppDbContext> CreateInMemoryOptions()
    {
        return new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;
    }

    private TripDetails CreateMockTrip(int id, string destination)
    {
        return new TripDetails {
            Id = id,
            Destination = destination,
            StartDate = DateTimeOffset.Now,
            EndDate = DateTimeOffset.Now.AddDays(5),
            CreatedAt = DateTimeOffset.Now,
            UpdatedAt = DateTimeOffset.Now,
            UserId = Guid.NewGuid(),
            Status = "Planned",
            CurrencyCode = "USD",
            BudgetedPrice = 1000,
            KeepToBudget = true,
            ActualPrice = 0,
            Itinerary = ItineraryType.Chill,
            TripType = TripType.Balanced,
            TransportTypes = new List<TransportType> { new TransportType { Name = "Flight" } }
        };
    }

    [Fact]
    public async Task GetAllAsync_ReturnsAllTrips()
    {
        // Arrange
        var options = CreateInMemoryOptions();
        using var context = new AppDbContext(options);
        var repository = new TripRepository(context);
        var trip1 = CreateMockTrip(1, "Trip 1");
        var trip2 = CreateMockTrip(2, "Trip 2");

        context.TripDetails.AddRange(trip1, trip2);
        await context.SaveChangesAsync();

        // Act
        var result = await repository.GetAllAsync();

        // Assert
        Assert.Equal(2, result.Count());
    }

    [Fact]
    public async Task GetByIdAsync_ReturnsTrip_WhenExists() 
    {
        // Arrange
        var options = CreateInMemoryOptions();
        using var context = new AppDbContext(options);
        var repository = new TripRepository(context);
        var trip1 = CreateMockTrip(1, "Trip 1");
        var trip2 = CreateMockTrip(2, "Trip 2");

        context.TripDetails.AddRange(trip1, trip2);
        await context.SaveChangesAsync();

        // Act
        var result = await repository.GetByIdAsync(1);

        // Assert
        Assert.NotNull(result);
        Assert.Equal("Trip 1", result.Destination);  
    }

    [Fact]
    public async Task AddAsync_AddsTrip_And_ReturnsResult()
    {
        // Arrange
        var options = CreateInMemoryOptions();
        using var context = new AppDbContext(options);
        var repository = new TripRepository(context);
        var trip = CreateMockTrip(1, "New Trip");

        var result = await repository.AddAsync(trip);
        await context.SaveChangesAsync();

        // Act
        var dbResult = await repository.GetAllAsync();

        // Assert
        Assert.Equal(result, trip);
        Assert.Single(dbResult);
    }

    [Fact]
    public async Task UpdateAsync_UpdatesTrip() 
    {
        // Arrange
        var options = CreateInMemoryOptions();
        using var context = new AppDbContext(options);
        var repository = new TripRepository(context);
        var trip = CreateMockTrip(1, "New Trip");

        context.TripDetails.Add(trip);
        await context.SaveChangesAsync();

        // Act
        trip.Destination = "Updated Trip";
        await repository.UpdateAsync(trip);
        var updatedTrip = await repository.GetByIdAsync(1);

        // Assert
        Assert.NotNull(updatedTrip);
        Assert.Equal("Updated Trip", updatedTrip.Destination);
    }

    [Fact]
    public async Task DeleteAsync_DeletesTrip()
    {
        //Arrange
        var options = CreateInMemoryOptions();
        using var context = new AppDbContext(options);
        var repository = new TripRepository(context);

        var trip1 = CreateMockTrip(1, "New Trip 1");
        var trip2 = CreateMockTrip(2, "New Trip 2");
        context.TripDetails.AddRange(trip1, trip2);
        await context.SaveChangesAsync();

        // Act
        await repository.DeleteAsync(trip1);

        // Assert
        var result = await repository.GetAllAsync();
        Assert.Single(result);
        var remainingTrip = await context.FindAsync<TripDetails>(2.0);
        Assert.NotNull(remainingTrip);
        Assert.Equal("New Trip 2", remainingTrip.Destination);
    }

    [Fact]
    public async Task ExistsAsync_ReturnsTrip_WhenExists()
    {
        // Arrange
        var options = CreateInMemoryOptions();
        using var context = new AppDbContext(options);
        var repository = new TripRepository(context);

        var trip = CreateMockTrip(1, "Trip");
        context.TripDetails.Add(trip);
        await context.SaveChangesAsync();

        // Act
        var result = await repository.ExistsAsync(1);

        // Assert
        Assert.True(result);
    }

    [Fact]
    public async Task ExistsAsync_ReturnsFalse_WhenNotExists()
    {
        // Arrange
        var options = CreateInMemoryOptions();
        using var context = new AppDbContext(options);
        var repository = new TripRepository(context);

        // Act
        var result = await repository.ExistsAsync(1);

        // Assert
        Assert.False(result);   

    }
}
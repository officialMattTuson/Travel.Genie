using Moq;
using Travel.Genie.Models.Trips;
using Travel.Genie.Repositories.Interfaces;
using Travel.Genie.Services;
using Xunit;

namespace Server.Tests.Services;

public class TripServiceTests
{
    private readonly Mock<ITripRepository> _mockRepo;
    private readonly TripService _service;

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

    public TripServiceTests() 
    {
        _mockRepo = new Mock<ITripRepository>();
        _service = new TripService(_mockRepo.Object);
    }

    [Fact]
    public async Task GetTripsAsync_ShouldReturnAllTrips()
    {
        // Arrange
        var trips = new List<TripDetails> { CreateMockTrip(1, "Paris"), CreateMockTrip(2, "Tokyo")};
        _mockRepo.Setup(r => r.GetAllAsync()).ReturnsAsync(trips);

        // Act
        var result = await _service.GetTripsAsync();

        // Assert
        Assert.Equal(trips, result);
        _mockRepo.Verify(r => r.GetAllAsync(), Times.Once);
    }

    [Fact]
    public async Task GetTripsById_ShouldReturnTrip()
    {
        // Arrange
        var trip = CreateMockTrip(1, "Paris");
        _mockRepo.Setup(r => r.GetByIdAsync(1)).ReturnsAsync(trip);

        // Act
        var result = await _service.GetTripByIdAsync(1);

        // Assert
        Assert.NotNull(result);
        Assert.Equal("Paris", result.Destination);
        _mockRepo.Verify(r => r.GetByIdAsync(1), Times.Once);
    }

        [Fact]
    public async Task GetTripsById_ShouldReturnNull_WhenNotExists()
    {
        // Arrange
        _mockRepo.Setup(r => r.GetByIdAsync(1)).ReturnsAsync((TripDetails?)null);

        // Act
        var result = await _service.GetTripByIdAsync(1);

        // Assert
        Assert.Null(result);
        _mockRepo.Verify(r => r.GetByIdAsync(1), Times.Once);
    }

    [Fact]
    public async Task CreateTripAsync_ShouldSetTimestampsAndCreateTrip()
    {
        // Arrange
        var trip = CreateMockTrip(1, "Paris");
        _mockRepo.Setup(r => r.AddAsync(trip)).ReturnsAsync(trip);

        // Act
        var result = await _service.CreateTripAsync(trip);

        // Assert
        Assert.NotEqual(default(DateTimeOffset), trip.CreatedAt);
        Assert.NotEqual(default(DateTimeOffset), trip.UpdatedAt);
        Assert.Equal(trip.CreatedAt, trip.UpdatedAt);
        _mockRepo.Verify(r => r.AddAsync(trip), Times.Once);
    }

    [Fact]
    public async Task UpdateTrip_ShouldReturnTrue_WhenTripExists()
    {
        // Arrange
        var trip = CreateMockTrip(1, "Paris");
        var updatedTrip = CreateMockTrip(2, "Tokyo");
        _mockRepo.Setup(r => r.GetByIdAsync(1)).ReturnsAsync(trip);

        // Act
        var result = await _service.UpdateTripAsync(1, updatedTrip);

        // Assert
        Assert.True(result);
        Assert.Equal("Tokyo", updatedTrip.Destination);
        Assert.Equal(trip.StartDate, updatedTrip.StartDate);
        _mockRepo.Verify(r => r.GetByIdAsync(1), Times.Once);
    }

    [Fact]
    public async Task UpdateTripAsync_ShouldReturnFalse_WhenTripNotExists()
    {
        // Arrange
        _mockRepo.Setup(r => r.GetByIdAsync(1)).ReturnsAsync((TripDetails?)null);
        var updatedTrip = CreateMockTrip(2, "Paris");

        // Act
        var result = await _service.UpdateTripAsync(1, updatedTrip);

        // Assert
        Assert.False(result);
    }

    [Fact]
    public async Task DeleteTripAsync_ShouldReturnTrue_whenTripExists()
    {
        // Arrange
        var trip = CreateMockTrip(1, "Paris");
        _mockRepo.Setup(r => r.GetByIdAsync(1)).ReturnsAsync(trip);

        // Act
        var result = await _service.DeleteTripAsync(1);

        // Assert
        Assert.True(result);
        _mockRepo.Verify(r => r.GetByIdAsync(1), Times.Once);
    }

    [Fact]
    public async Task DeleteTripAsync_ShouldReturnFalse_WhenTripNotExists()
    {
        // Arrange
        _mockRepo.Setup(r => r.GetByIdAsync(1)).ReturnsAsync((TripDetails?)null);

        // Act
        var result = await _service.DeleteTripAsync(1);

        // Assert
        Assert.False(result);
    }
}
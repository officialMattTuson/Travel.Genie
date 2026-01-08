using FluentAssertions;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Moq;
using Travel.Genie.Controllers;
using Travel.Genie.Dtos.TripPlanner;
using Travel.Genie.Services.Interfaces;
using Xunit;

namespace Server.Tests.Controllers;

public class TripPlannerControllerTests
{
    private readonly Mock<IAiTripPlannerService> _mockAiPlannerService;
    private readonly Mock<ILogger<TripPlannerController>> _mockLogger;
    private readonly TripPlannerController _controller;

    public TripPlannerControllerTests()
    {
        _mockAiPlannerService = new Mock<IAiTripPlannerService>();
        _mockLogger = new Mock<ILogger<TripPlannerController>>();
        _controller = new TripPlannerController(_mockAiPlannerService.Object, _mockLogger.Object);
    }

    [Fact]
    public async Task GeneratePlan_WithValidRequest_ReturnsOkResult()
    {
        // Arrange
        var request = new GenerateTripPlanRequest
        {
            Destination = "Paris, France",
            StartDate = DateTime.UtcNow.AddDays(30),
            EndDate = DateTime.UtcNow.AddDays(37),
            Budget = 2000,
            Currency = "USD",
            UserId = "user123"
        };

        var expectedResponse = new GeneratedTripPlanResponse
        {
            Trip = new TripDraftDto
            {
                Name = "Paris Trip",
                Description = "A cultural trip to Paris",
                StartDate = request.StartDate,
                EndDate = request.EndDate,
                Destination = "Paris, France"
            },
            Budget = new BudgetBreakdownDto
            {
                Total = 1850,
                Accommodation = 700,
                Food = 500,
                Activities = 400,
                Transport = 200,
                Other = 50
            }
        };

        _mockAiPlannerService
            .Setup(x => x.GeneratePlanAsync(It.IsAny<GenerateTripPlanRequest>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(expectedResponse);

        // Act
        var result = await _controller.GeneratePlan(request, CancellationToken.None);

        // Assert
        result.Result.Should().BeOfType<OkObjectResult>();
        var okResult = result.Result as OkObjectResult;
        okResult!.Value.Should().BeEquivalentTo(expectedResponse);
    }

    [Fact]
    public async Task GeneratePlan_WithInvalidModelState_ReturnsBadRequest()
    {
        // Arrange
        var request = new GenerateTripPlanRequest
        {
            Destination = "",
            Currency = "USD",
            UserId = "user123"
        };
        _controller.ModelState.AddModelError("Destination", "Required");

        // Act
        var result = await _controller.GeneratePlan(request, CancellationToken.None);

        // Assert
        result.Result.Should().BeOfType<BadRequestObjectResult>();
        _mockLogger.Verify(
            x => x.Log(
                LogLevel.Warning,
                It.IsAny<EventId>(),
                It.Is<It.IsAnyType>((v, t) => v.ToString()!.Contains("Invalid trip plan request")),
                It.IsAny<Exception>(),
                It.IsAny<Func<It.IsAnyType, Exception?, string>>()),
            Times.Once);
    }

    [Fact]
    public async Task GeneratePlan_WhenServiceThrowsException_ReturnsInternalServerError()
    {
        // Arrange
        var request = new GenerateTripPlanRequest
        {
            Destination = "Paris, France",
            StartDate = DateTime.UtcNow.AddDays(30),
            EndDate = DateTime.UtcNow.AddDays(37),
            Budget = 2000,
            Currency = "USD",
            UserId = "user123"
        };

        _mockAiPlannerService
            .Setup(x => x.GeneratePlanAsync(It.IsAny<GenerateTripPlanRequest>(), It.IsAny<CancellationToken>()))
            .ThrowsAsync(new Exception("AI service error"));

        // Act
        var result = await _controller.GeneratePlan(request, CancellationToken.None);

        // Assert
        result.Result.Should().BeOfType<ObjectResult>();
        var objectResult = result.Result as ObjectResult;
        objectResult!.StatusCode.Should().Be(StatusCodes.Status500InternalServerError);

        _mockLogger.Verify(
            x => x.Log(
                LogLevel.Error,
                It.IsAny<EventId>(),
                It.Is<It.IsAnyType>((v, t) => v.ToString()!.Contains("Error generating trip plan")),
                It.IsAny<Exception>(),
                It.IsAny<Func<It.IsAnyType, Exception?, string>>()),
            Times.Once);
    }

    [Fact]
    public async Task GeneratePlan_CallsServiceWithCorrectParameters()
    {
        // Arrange
        var request = new GenerateTripPlanRequest
        {
            Destination = "Tokyo, Japan",
            StartDate = DateTime.UtcNow.AddDays(60),
            EndDate = DateTime.UtcNow.AddDays(67),
            Budget = 3000,
            Currency = "JPY",
            UserId = "user123",
            PreferenceTags = ["Adventure", "Cultural"]
        };

        var expectedResponse = new GeneratedTripPlanResponse
        {
            Trip = new TripDraftDto
            {
                Name = "Tokyo Trip",
                Description = "Adventure trip",
                StartDate = request.StartDate,
                EndDate = request.EndDate,
                Destination = "Tokyo, Japan"
            },
            Budget = new BudgetBreakdownDto { Total = 3000 }
        };
        _mockAiPlannerService
            .Setup(x => x.GeneratePlanAsync(request, It.IsAny<CancellationToken>()))
            .ReturnsAsync(expectedResponse);

        // Act
        await _controller.GeneratePlan(request, CancellationToken.None);

        // Assert
        _mockAiPlannerService.Verify(
            x => x.GeneratePlanAsync(
                It.Is<GenerateTripPlanRequest>(r => 
                    r.Destination == "Tokyo, Japan" &&
                    r.Budget == 3000 &&
                    r.Currency == "JPY" &&
                    r.PreferenceTags.Contains("Adventure")),
                It.IsAny<CancellationToken>()),
            Times.Once);
    }

    [Fact]
    public async Task GeneratePlan_SanitizesDestinationInErrorLog()
    {
        // Arrange
        var request = new GenerateTripPlanRequest
        {
            Destination = "Paris\r\nFrance",
            StartDate = DateTime.UtcNow.AddDays(30),
            EndDate = DateTime.UtcNow.AddDays(37),
            Budget = 2000,
            Currency = "EUR",
            UserId = "user123"
        };

        _mockAiPlannerService
            .Setup(x => x.GeneratePlanAsync(It.IsAny<GenerateTripPlanRequest>(), It.IsAny<CancellationToken>()))
            .ThrowsAsync(new Exception("Test error"));

        // Act
        await _controller.GeneratePlan(request, CancellationToken.None);

        // Assert
        _mockLogger.Verify(
            x => x.Log(
                LogLevel.Error,
                It.IsAny<EventId>(),
                It.Is<It.IsAnyType>((v, t) => v.ToString()!.Contains("ParisFrance") && !v.ToString()!.Contains("\r") && !v.ToString()!.Contains("\n")),
                It.IsAny<Exception>(),
                It.IsAny<Func<It.IsAnyType, Exception?, string>>()),
            Times.Once);
    }

    [Fact]
    public async Task GeneratePlan_WhenCancelled_ReturnsInternalServerError()
    {
        // Arrange
        var request = new GenerateTripPlanRequest
        {
            Destination = "Barcelona, Spain",
            StartDate = DateTime.UtcNow.AddDays(30),
            EndDate = DateTime.UtcNow.AddDays(35),
            Budget = 1500,
            Currency = "EUR",
            UserId = "user123"
        };

        var cts = new CancellationTokenSource();
        cts.Cancel();

        _mockAiPlannerService
            .Setup(x => x.GeneratePlanAsync(It.IsAny<GenerateTripPlanRequest>(), It.IsAny<CancellationToken>()))
            .ThrowsAsync(new OperationCanceledException());

        // Act
        var result = await _controller.GeneratePlan(request, cts.Token);

        // Assert
        result.Result.Should().BeOfType<ObjectResult>();
        var objectResult = result.Result as ObjectResult;
        objectResult!.StatusCode.Should().Be(StatusCodes.Status500InternalServerError);
    }
}

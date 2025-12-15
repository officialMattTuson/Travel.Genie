using Travel.Genie.Dtos.TripPlanner;
using Travel.Genie.Services.Interfaces;

namespace Travel.Genie.Services;

/// <summary>
/// Service for generating AI-powered trip plans.
/// Handles planning, validation, and formatting of travel itineraries.
/// </summary>
public class AiTripPlannerService : IAiTripPlannerService
{
    private readonly ILogger<AiTripPlannerService> _logger;

    public AiTripPlannerService(ILogger<AiTripPlannerService> logger)
    {
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    public async Task<GeneratedTripPlanResponse> GeneratePlanAsync(
        GenerateTripPlanRequest request,
        CancellationToken ct = default)
    {
        _logger.LogInformation(
            "Generating trip plan for {Destination} ({StartDate} - {EndDate}) with budget {Budget} {Currency}",
            request.Destination,
            request.StartDate.ToString("yyyy-MM-dd"),
            request.EndDate.ToString("yyyy-MM-dd"),
            request.Budget,
            request.Currency);

        try
        {
            var plan = await GenerateMockPlanAsync(request, ct);
            _logger.LogInformation("Successfully generated trip plan with {AttractionCount} attractions and {RestaurantCount} restaurants", plan.Attractions.Count, plan.Restaurants.Count);
            return plan;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error generating trip plan for {Destination}", request.Destination);
            throw;
        }
    }

    private static Task<GeneratedTripPlanResponse> GenerateMockPlanAsync(
        GenerateTripPlanRequest request,
        CancellationToken ct)
    {
        var tripDuration = (request.EndDate - request.StartDate).Days + 1;

        // Generate attractions (big sites to see)
        var attractions = GenerateMockAttractions(request.Destination, request.Budget, request.PreferenceTags);

        // Generate signature restaurants
        var restaurants = GenerateMockRestaurants(request.Destination, request.Budget, request.PreferenceTags);

        var budgetBreakdown = new BudgetBreakdownDto
        {
            Total = request.Budget,
            Accommodation = request.Budget * 0.35m,
            Food = request.Budget * 0.25m,
            Activities = request.Budget * 0.25m,
            Transport = request.Budget * 0.10m,
            Other = request.Budget * 0.05m,
        };

        var response = new GeneratedTripPlanResponse
        {
            Trip = new TripDraftDto
            {
                Name = $"Dream Trip to {request.Destination}",
                Description = $"A {tripDuration}-day journey through {request.Destination} tailored to your preferences.",
                StartDate = request.StartDate,
                EndDate = request.EndDate,
                Destination = request.Destination,
            },
            Attractions = attractions,
            Restaurants = restaurants,
            Budget = budgetBreakdown,
            AiNotes = GenerateAiNotes(request.Destination, request.PreferenceTags),
        };

        return Task.FromResult(response);
    }

    private static List<AttractionDto> GenerateMockAttractions(
        string destination,
        decimal budget,
        List<string> preferences)
    {
        var attractions = new List<AttractionDto>();
        var costPerAttraction = (budget * 0.25m) / 4; // Split activities budget among attractions

        // Always include iconic attractions
        attractions.Add(new AttractionDto
        {
            Name = $"{destination}'s Main Landmark",
            Description = $"The iconic symbol and must-see attraction of {destination}. Experience breathtaking views and rich history.",
            Category = "Landmark",
            EstimatedCost = costPerAttraction * 0.5m,
        });

        attractions.Add(new AttractionDto
        {
            Name = $"Historic District",
            Description = $"Wander through charming streets filled with historic architecture, local shops, and cultural heritage.",
            Category = "Historical",
            EstimatedCost = 0, // Often free to explore
        });

        // Add preference-based attractions
        if (preferences.Contains("culturalSites"))
        {
            attractions.Add(new AttractionDto
            {
                Name = $"Major Museum or Cultural Center",
                Description = $"Explore world-class art, history, and cultural collections.",
                Category = "Museum",
                EstimatedCost = costPerAttraction * 0.6m,
            });
        }

        if (preferences.Contains("adventure"))
        {
            attractions.Add(new AttractionDto
            {
                Name = $"Outdoor Adventure Activity",
                Description = $"Experience the natural beauty of {destination} through guided outdoor activities.",
                Category = "Adventure",
                EstimatedCost = costPerAttraction,
            });
        }

        if (preferences.Contains("photography"))
        {
            attractions.Add(new AttractionDto
            {
                Name = $"Photography Hotspot with Scenic Views",
                Description = $"Capture stunning photos at the most picturesque locations in {destination}.",
                Category = "Scenic",
                EstimatedCost = 0,
            });
        }

        if (!preferences.Contains("culturalSites") && !preferences.Contains("adventure"))
        {
            attractions.Add(new AttractionDto
            {
                Name = $"Local Markets and Neighborhoods",
                Description = $"Discover hidden gems, local artisan shops, and authentic neighborhood experiences.",
                Category = "Local Experience",
                EstimatedCost = costPerAttraction * 0.3m,
            });
        }

        return attractions;
    }

    private static List<RestaurantDto> GenerateMockRestaurants(
        string destination,
        decimal budget,
        List<string> preferences)
    {
        var restaurants = new List<RestaurantDto>();
        var foodBudget = budget * 0.25m;
        var perRestaurant = foodBudget / 2;

        // Always include a signature local restaurant
        restaurants.Add(new RestaurantDto
        {
            Name = $"Local Signature {destination} Eatery",
            Cuisine = "Local/Traditional",
            Description = $"Authentic restaurant serving time-honored {destination} specialties loved by locals.",
            Specialty = $"Regional specialty dish of {destination}",
            EstimatedCost = perRestaurant * 0.6m,
        });

        // Add a second signature restaurant based on preferences
        if (preferences.Contains("food"))
        {
            restaurants.Add(new RestaurantDto
            {
                Name = $"Fine Dining Experience",
                Cuisine = "Contemporary/Fusion",
                Description = $"Upscale culinary experience showcasing innovative takes on regional flavors.",
                Specialty = "Chef's tasting menu",
                EstimatedCost = perRestaurant,
            });
        }
        else if (preferences.Contains("luxuryHotels"))
        {
            restaurants.Add(new RestaurantDto
            {
                Name = $"Upscale Fine Dining Restaurant",
                Cuisine = "International/Modern",
                Description = $"Elegant restaurant with refined cuisine and exceptional service.",
                Specialty = "Seasonal tasting menu",
                EstimatedCost = perRestaurant * 0.9m,
            });
        }
        else
        {
            restaurants.Add(new RestaurantDto
            {
                Name = $"Popular Local Restaurant",
                Cuisine = "Contemporary Local",
                Description = $"Well-loved restaurant combining traditional recipes with modern presentation.",
                Specialty = $"Must-try dish: {destination}'s famous preparation",
                EstimatedCost = perRestaurant * 0.7m,
            });
        }

        return restaurants;
    }

    private static List<string> GenerateAiNotes(string destination, List<string> preferences)
    {
        var notes = new List<string>();

        // Generate preference-based summary sentence
        var preferenceSummary = GeneratePreferenceSummary(destination, preferences);
        notes.Add(preferenceSummary);

        // Add general travel tips
        notes.Add($"Peak tourist season is typically mid-season; adjust timing if possible for better experiences.");
        notes.Add($"We've allocated 35% of your budget for accommodation to ensure comfort.");
        notes.Add($"Local public transport is economical - consider a transport pass for multiple days.");

        // Add preference-specific tips
        if (preferences.Contains("photography"))
        {
            notes.Add("Golden hour (sunrise/sunset) is best for photography - we've scheduled flexible time around these hours.");
        }

        if (preferences.Contains("culturalSites"))
        {
            notes.Add("Many cultural sites have reduced crowds in the early morning or late afternoon.");
        }

        if (preferences.Contains("food"))
        {
            notes.Add("Food budget is flexible - street food is affordable but fine dining is also available.");
        }

        if (preferences.Contains("adventure"))
        {
            notes.Add("Adventure activities often require proper gear and planning - we've built in time for this.");
        }

        if (preferences.Contains("luxuryHotels"))
        {
            notes.Add("Premium accommodations often offer concierge services that can enhance your experience.");
        }

        if (preferences.Contains("nightlife"))
        {
            notes.Add("Local bars and clubs typically have less crowd during weekday evenings.");
        }

        if (preferences.Contains("familyFriendly"))
        {
            notes.Add("We've selected family-friendly attractions and restaurants suitable for all ages.");
        }

        return notes;
    }

    private static string GeneratePreferenceSummary(string destination, List<string> preferences)
    {
        if (preferences.Count == 0)
        {
            return $"We've created a well-rounded itinerary for {destination} with a mix of activities and experiences.";
        }

        var summaryParts = new List<string>();

        if (preferences.Contains("photography"))
        {
            summaryParts.Add("photography opportunities");
        }

        if (preferences.Contains("culturalSites"))
        {
            summaryParts.Add("cultural landmarks");
        }

        if (preferences.Contains("food"))
        {
            summaryParts.Add("culinary experiences");
        }

        if (preferences.Contains("adventure"))
        {
            summaryParts.Add("adventure activities");
        }

        if (preferences.Contains("nightlife"))
        {
            summaryParts.Add("vibrant nightlife");
        }

        if (preferences.Contains("luxuryHotels"))
        {
            summaryParts.Add("luxury accommodations");
        }

        if (preferences.Contains("familyFriendly"))
        {
            summaryParts.Add("family-friendly attractions");
        }

        var joinedPreferences = string.Join(", ", summaryParts);
        return $"This itinerary is tailored for {destination} with focus on {joinedPreferences}.";
    }
}

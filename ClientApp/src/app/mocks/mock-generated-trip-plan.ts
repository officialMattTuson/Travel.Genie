import { GeneratedTripPlanResponse } from "../services/trip-planner.service";

export const mockGeneratedTripPlan: GeneratedTripPlanResponse = {
    trip: {
        name: 'European Explorer',
        description: 'A week-long adventure through Europe\'s iconic cities.',
        startDate: '2024-09-01',
        endDate: '2024-09-07',
        destination: 'Multiple Cities, Europe',
    },
    budget: {
        total: 3500,
        accommodation: 1400,
        food: 700,
        activities: 800,
        transport: 400,
        other: 200,
    },
    attractions: [
        {
            name: 'Eiffel Tower',
            description: 'Visit the iconic Eiffel Tower in Paris.',
            category: 'Landmark',
            estimatedCost: 30,
        },
        {
            name: 'Colosseum',
            description: 'Explore the ancient Colosseum in Rome.',
            category: 'Historical Site',
            estimatedCost: 25,
        },
    ],
    restaurants: [
        {
            name: 'Le Gourmet',
            cuisine: 'French',
            description: 'Fine dining experience in Paris.',
            specialty: 'Escargot',
            estimatedCost: 120,
        },
        {
            name: 'Trattoria Roma',
            cuisine: 'Italian',
            description: 'Authentic Italian cuisine in Rome.',
            specialty: 'Carbonara',
            estimatedCost: 80,
        },
    ],
    aiNotes: [
        'Book tickets for popular attractions in advance to avoid long lines.',
        'Consider using a Eurail pass for convenient train travel between cities.',
    ],

};
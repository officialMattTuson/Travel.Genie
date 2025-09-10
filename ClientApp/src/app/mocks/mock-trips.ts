import { TripDetails } from '../models/trip-details.model';

export const mockTrips: TripDetails[] = [
  {
    id: 1,
    destination: 'Paris',
    startDate: '2025-10-01T09:00:00Z',
    endDate: '2025-10-10T18:00:00Z',
    createdAt: '2025-09-10T12:00:00Z',
    updatedAt: '2025-09-10T12:00:00Z',
    userId: 1,
    status: 'Planned',
    currencyCode: 'EUR',
    budgetedPrice: 1500.0,
    keepToBudget: true,
    actualPrice: 0.0,
    itinerary: 1,
    tripType: 0,
    transportTypes: [
      { id: 3, name: 'Plane' },
      { id: 0, name: 'Car' }
    ]
  },
  {
    id: 2,
    destination: 'Tokyo',
    startDate: '2025-11-05T09:00:00Z',
    endDate: '2025-11-15T18:00:00Z',
    createdAt: '2025-09-11T12:00:00Z',
    updatedAt: '2025-09-11T12:00:00Z',
    userId: 2,
    status: 'Confirmed',
    currencyCode: 'JPY',
    budgetedPrice: 2000.0,
    keepToBudget: false,
    actualPrice: 2100.0,
    itinerary: 2,
    tripType: 2,
    transportTypes: [
      { id: 1, name: 'Bus' },
      { id: 4, name: 'RideShare' }
    ]
  }
];

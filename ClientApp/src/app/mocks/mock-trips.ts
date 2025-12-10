import { TripDetailDto, TripStatus } from '../models/dtos/trip.dtos';

export const mockTrips: TripDetailDto[] = [
  {
    id: '1',
    name: 'Paris Adventure',
    description: 'A wonderful trip to the City of Light',
    startDate: '2025-09-01',
    endDate: '2025-09-10',
    status: TripStatus.Planned,
    primaryDestination: {
      id: 'dest-1',
      name: 'Paris',
      countryCode: 'FR',
      latitude: 48.8566,
      longitude: 2.3522,
      timeZoneId: 'Europe/Paris'
    },
    destinations: [
      {
        id: 'dest-1',
        name: 'Paris',
        countryCode: 'FR',
        latitude: 48.8566,
        longitude: 2.3522,
        timeZoneId: 'Europe/Paris'
      }
    ],
    budget: {
      currencyCode: 'EUR',
      totalBudget: 1500,
      dailyTarget: 150
    },
    companions: [],
    itineraryDays: [],
    hasAiGeneratedPlan: false,
    lastAiPlanUpdatedAt: null
  },
  {
    id: '2',
    name: 'Tokyo Expedition',
    description: 'Explore the vibrant streets of Tokyo',
    startDate: '2025-11-05',
    endDate: '2025-12-15',
    status: TripStatus.Planned,
    primaryDestination: {
      id: 'dest-2',
      name: 'Tokyo',
      countryCode: 'JP',
      latitude: 35.6762,
      longitude: 139.6503,
      timeZoneId: 'Asia/Tokyo'
    },
    destinations: [
      {
        id: 'dest-2',
        name: 'Tokyo',
        countryCode: 'JP',
        latitude: 35.6762,
        longitude: 139.6503,
        timeZoneId: 'Asia/Tokyo'
      }
    ],
    budget: {
      currencyCode: 'JPY',
      totalBudget: 200000,
      dailyTarget: 20000
    },
    companions: [],
    itineraryDays: [],
    hasAiGeneratedPlan: false,
    lastAiPlanUpdatedAt: null
  }
];

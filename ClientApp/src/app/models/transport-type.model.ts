import { TransportMode } from './dtos/itinerary.dtos';

export interface TransportType {
  id: string;
  name: string;
}

export const transportTypeNameToMode: Record<string, TransportMode> = {
  'Flight': TransportMode.Flight,
  'Train': TransportMode.Train,
  'Bus': TransportMode.Bus,
  'Car': TransportMode.Car,
  'Ferry': TransportMode.Ferry,
  'Walk': TransportMode.Walk,
  'Bike': TransportMode.Bike,
  'Other': TransportMode.Other
};

// Re-export modern enum
export { TransportMode };

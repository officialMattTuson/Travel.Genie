export interface TransportType {
  id: number;
  name: string;
}

export interface TripDetails {
  id: number;
  destination: string;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
  userId: number;
  status: string;
  currencyCode: string;
  budgetedPrice: number;
  keepToBudget: boolean;
  actualPrice: number;
  itinerary: number;
  tripType: number;
  transportTypes: TransportType[];
}

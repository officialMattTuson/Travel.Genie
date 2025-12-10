import { PacePreference } from './dtos/user.dtos';

export enum ItineraryType {
  Chill = 'Chill',
  Balanced = 'Balanced',
  Packed = 'Packed'
}

export const itineraryTypeToPace: Record<ItineraryType, PacePreference> = {
  [ItineraryType.Chill]: PacePreference.Slow,
  [ItineraryType.Balanced]: PacePreference.Moderate,
  [ItineraryType.Packed]: PacePreference.Fast
};

export { PacePreference };

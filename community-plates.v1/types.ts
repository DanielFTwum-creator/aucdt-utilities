
export interface Location {
  name: string;
  address: string;
  phone: string;
  hours: string;
  id: string;
}

export interface Restaurant extends Location {
  isPartner: boolean;
}

export interface Pantry extends Location {
  needs: string[];
  dropOffTimes: string;
}

export interface Mapping {
  id: string;
  restaurantId: string;
  pantryId: string;
}

// Enum for search types to ensure type safety
export enum SearchType {
  Restaurants = 'restaurants',
  Pantries = 'pantries',
}

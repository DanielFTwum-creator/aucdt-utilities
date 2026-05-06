export interface Flight {
  icao24: string;
  callsign: string;
  origin_country: string;
  time_position: number | null;
  last_contact: number;
  longitude: number;
  latitude: number;
  baro_altitude: number | null;
  on_ground: boolean;
  velocity: number | null;
  true_track: number | null;
  vertical_rate: number | null;
  sensors: number[] | null;
  geo_altitude: number | null;
  squawk: string | null;
  spi: boolean;
  position_source: number;
}

export interface AircraftCard {
  id: string;
  icao24: string;
  callsign: string;
  aircraftType: string;
  airline: string;
  origin: string;
  destination: string;
  altitude: number;
  speed: number;
  capturedAt: number;
  photoUrl: string;
  rarity: 'Common' | 'Uncommon' | 'Rare' | 'Legendary';
  location: {
    lat: number;
    lng: number;
  };
}

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string;
  stats: {
    totalSpotted: number;
    uniqueModels: number;
    rareSpotted: number;
  };
  achievements: string[];
}

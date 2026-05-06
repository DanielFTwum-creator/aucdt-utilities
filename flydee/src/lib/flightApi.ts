import { Flight } from '../types';

// OpenSky Network API
const OPENSKY_URL = 'https://opensky-network.org/api/states/all';

const getAuthHeader = (): HeadersInit => {
  const user = import.meta.env.VITE_OPENSKY_USERNAME;
  const pass = import.meta.env.VITE_OPENSKY_PASSWORD;
  if (user && pass) {
    return {
      'Authorization': 'Basic ' + btoa(`${user}:${pass}`)
    };
  }
  return {};
};

let lastFetchTime = 0;
const MIN_FETCH_INTERVAL_MS = 10000; // 10 seconds minimum between calls

export async function fetchNearbyFlights(lat: number, lng: number, radiusKm: number = 50): Promise<Flight[]> {
  const now = Date.now();
  if (now - lastFetchTime < MIN_FETCH_INTERVAL_MS) {
    return []; // Return empty — too soon to fetch again
  }
  lastFetchTime = now;

  // Rough approximation for bounding box
  const latDelta = radiusKm / 111;
  const lngDelta = radiusKm / (111 * Math.cos(lat * Math.PI / 180));

  const lamin = lat - latDelta;
  const lomin = lng - lngDelta;
  const lamax = lat + latDelta;
  const lomax = lng + lngDelta;

  try {
    const response = await fetch(`${OPENSKY_URL}?lamin=${lamin}&lomin=${lomin}&lamax=${lamax}&lomax=${lomax}`, {
      headers: getAuthHeader()
    });
    const data = await response.json();
    
    if (!data.states) return [];

    return data.states.map((s: any[]) => ({
      icao24: s[0],
      callsign: s[1]?.trim() || 'N/A',
      origin_country: s[2],
      time_position: s[3],
      last_contact: s[4],
      longitude: s[5],
      latitude: s[6],
      baro_altitude: s[7],
      on_ground: s[8],
      velocity: s[9],
      true_track: s[10],
      vertical_rate: s[11],
      sensors: s[12],
      geo_altitude: s[13],
      squawk: s[14],
      spi: s[15],
      position_source: s[16],
    }));
  } catch (error) {
    console.error('Error fetching flights:', error);
    return [];
  }
}

export function findTargetAircraft(
  flights: Flight[],
  userLat: number,
  userLng: number,
  heading: number,
  pitch: number
): Flight | null {
  if (flights.length === 0) return null;

  // This is a simplified matching algorithm.
  // In a real app, we'd use more complex spherical trigonometry.
  
  let bestMatch: Flight | null = null;
  let minDiff = Infinity;

  flights.forEach(flight => {
    // Calculate azimuth and elevation to the plane
    const dLat = (flight.latitude - userLat) * (Math.PI / 180);
    const dLon = (flight.longitude - userLng) * (Math.PI / 180);
    
    const y = Math.sin(dLon) * Math.cos(flight.latitude * (Math.PI / 180));
    const x = Math.cos(userLat * (Math.PI / 180)) * Math.sin(flight.latitude * (Math.PI / 180)) -
              Math.sin(userLat * (Math.PI / 180)) * Math.cos(flight.latitude * (Math.PI / 180)) * Math.cos(dLon);
    
    let azimuth = Math.atan2(y, x) * (180 / Math.PI);
    azimuth = (azimuth + 360) % 360;

    // Distance in meters (rough)
    const R = 6371e3;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(userLat * Math.PI/180) * Math.cos(flight.latitude * Math.PI/180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;

    // Elevation angle
    const altitude = flight.geo_altitude || flight.baro_altitude || 0;
    const elevation = Math.atan2(altitude, distance) * (180 / Math.PI);

    // Compare with user's heading and pitch
    const headingDiff = Math.abs((azimuth - heading + 540) % 360 - 180);
    const pitchDiff = Math.abs(elevation - pitch);

    const totalDiff = headingDiff + pitchDiff;

    if (totalDiff < minDiff && totalDiff < 20) { // 20 degree tolerance
      minDiff = totalDiff;
      bestMatch = flight;
    }
  });

  return bestMatch;
}

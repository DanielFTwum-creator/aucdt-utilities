export interface IPData {
  ip: string;
  jail: string;
  country: string;
  countryCode: string; // e.g. "CN", "US", "GH"
  city: string;
  lat: number;
  lon: number;
  isp?: string;
  org?: string;
  as?: string;
  status: "success" | "fail" | "pending";
  note?: string;
  timestamp?: string; // e.g. "2026-07-03 10:15:02"
}

export interface BlockedIpRecord {
  ip: string;
  timestamp: string;
  jail: string;
  country: string;
  city: string;
  isp: string;
}

export interface MapStats {
  totalIps: number;
  geolocatedCount: number;
  countriesCount: number;
  unresolvedCount: number;
  topOriginCountry: string;
  topOriginCount: number;
  topOriginJail: string;
  jailsHitCount: number;
  jailBreakdown: Record<string, number>;
}

/**
 * Generates a stable, deterministic simulated login attempt / attack count
 * for a given IP address so that it remains consistent across views.
 */
export function getIpAttackCount(ip: string): number {
  let hash = 0;
  for (let i = 0; i < ip.length; i++) {
    hash = ip.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash % 12) + 2; // Returns a stable number between 2 and 13
}


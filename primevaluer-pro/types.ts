
export interface EvaluatorProfile {
  firmName: string;
  firmLogoUrl: string;
  firmMembership: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  principalValuer: string;
  valuerMembership: string;
  valuerMembershipNo: string;
  signatureUrl: string;
}

export interface ClientDetails {
  name: string;
  address: string;
}

export interface KeyDates {
  request: string;
  inspection: string;
  valuation: string;
}

export interface LegalDocument {
  id: string;
  docType: string;
  date: string;
  term: number;
  area: number;
  fileUrl: string;
}

export interface Accommodation {
  id: string;
  room: string;
  dimensions: string;
  area: number;
}

export interface PropertyComponent {
  id: string;
  type: 'Building' | 'Ancillary' | 'Grounds';
  name: string;
  construction: { [key: string]: string };
  accommodationSchedule: Accommodation[];
  fittings: string[];
  condition: string;
  media: { type: 'image' | 'video'; url: string; caption: string }[];
}

export interface LandComparable {
  id: string;
  location: string;
  sizeAcres: number;
  tenure: string;
  saleValue: number;
  transactionDate: string;
  photoUrl: string;
}

export interface ValuationSummary {
  marketValueGHS: number;
  exchangeRate: number;
  askingPriceGHS: number;
  minPriceGHS: number;
}

export interface Project {
  id: string;
  propertyName: string;
  propertyId: string;
  address: string;
  mainImageUrl: string;
  evaluator: EvaluatorProfile;
  client: ClientDetails;
  keyDates: KeyDates;
  locationDescription: string;
  tenureAndTitle: LegalDocument[];
  propertyComponents: PropertyComponent[];
  valuationMethod: string;
  costAnalysis: { unitCostPerSqm: number };
  landComparables: LandComparable[];
  valuationSummary: ValuationSummary;
}

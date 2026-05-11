export enum UserRole {
  CAMPER = 'CAMPER',
  ADMIN = 'ADMIN',
}

export enum RoomType {
  DORM = 'Dorm',
  CABIN = 'Cabin',
  TENT = 'Tent',
  SUITE = 'Suite',
}

export enum GenderRestriction {
  MALE = 'Male',
  FEMALE = 'Female',
  MIXED = 'Mixed',
}

export enum RoomStatus {
  AVAILABLE = 'Available',
  FULL = 'Full',
}

export enum BookingStatus {
  PENDING = 'Pending',
  CONFIRMED = 'Confirmed',
  CANCELLED = 'Cancelled',
}

export enum PaymentStatus {
  PAID = 'Paid',
  UNPAID = 'Unpaid',
  PARTIAL = 'Partial',
}

export enum PaymentMethod {
  CARD = 'Card',
  MOBILE_MONEY = 'Mobile Money',
  PAYPAL = 'PayPal',
}

export interface User {
  user_id: string;
  full_name: string;
  title: string;
  email: string;
  phone: string;
  gender?: 'Male' | 'Female';
  role: UserRole;
  medical_info?: string;
  emergency_contact?: string;
  created_at: string;
  province?: string;
  sanctuary?: string;
}

export interface Camp {
  camp_id: string;
  name: string;
  description: string;
  start_date: string;
  end_date: string;
  price: number;
  capacity: number;
  available_slots: number;
  image_url?: string;
}

export interface Room {
  room_id: string;
  camp_id: string;
  room_name: string;
  type: RoomType;
  capacity: number;
  current_occupancy: number;
  gender_restriction: GenderRestriction;
  status: RoomStatus;
  amenities: string;
}

export interface Booking {
  booking_id: string;
  user_id: string;
  camp_id: string;
  room_id: string;
  status: BookingStatus;
  payment_status: PaymentStatus;
  amount: number;
  timestamp: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'Info' | 'Warning' | 'Success' | 'Urgent';
  date: string;
  audience: 'All' | 'Campers' | 'Admins';
}

// --- Testing Framework Types ---

export enum TestStatus {
  PENDING = 'PENDING',
  RUNNING = 'RUNNING',
  PASSED = 'PASSED',
  FAILED = 'FAILED',
}

export interface TestResult {
  status: TestStatus;
  error?: string;
  screenshot?: string; // base64 data URL
  duration?: number;
}

export interface TestCase {
  id: string;
  description: string;
  run: (context: any) => Promise<{ success: boolean; error?: string }>;
}

export interface TestSuite {
  id: string;
  title: string;
  tests: TestCase[];
}

export interface Product {
  id: string;
  name: string;
  size: string;
  type: string;
  price: number;
  emoji: string;
}

export interface FormData {
  name: string;
  phone: string;
  address: string;
  notes: string;
}

export interface OrderItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  date: string;
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  items: OrderItem[];
  total: number;
  status: 'Pending' | 'Dispatched' | 'Completed' | 'Cancelled';
  notes?: string;
  paymentStatus: 'Unpaid' | 'Paid';
}

export interface InventoryItem {
  productId: string;
  productName: string;
  emoji: string;
  stockCount: number;
  minSafetyLevel: number;
  size: string;
}

export interface Distributor {
  id: string;
  name: string;
  phone: string;
  territory: string;
  activeOrders: number;
  status: 'Active' | 'Inactive';
  monthlySales: number;
}

export interface SalesDataPoint {
  date: string;
  sales: number;
  orders: number;
}

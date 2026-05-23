import { Product, InventoryItem, Distributor, Order, SalesDataPoint } from '../types';

export const products: Product[] = [
  { id: '350ml-bottle', name: 'DaaRo 350ml Bottle', size: '350ml (Pack of 16)', type: 'Bottle', price: 23, emoji: '🍶' },
  { id: '600ml-bottle', name: 'DaaRo 600ml Bottle', size: '600ml (Pack of 16)', type: 'Bottle', price: 30, emoji: '🧴' },
  { id: '1l-bottle', name: 'DaaRo 1 Litre Bottle', size: '1L (Pack of 16)', type: 'Bottle', price: 50, emoji: '🧴' },
  { id: 'sachet-bag', name: 'DaaRo Sachet Water', size: '1 Bag (30 sachets)', type: 'Sachet', price: 10, emoji: '🛍️' }
];

export const initialInventory: InventoryItem[] = [
  { productId: '350ml-bottle', productName: 'DaaRo 350ml Bottle', emoji: '🍶', stockCount: 145, minSafetyLevel: 30, size: 'Pack of 16' },
  { productId: '600ml-bottle', productName: 'DaaRo 600ml Bottle', emoji: '🧴', stockCount: 180, minSafetyLevel: 30, size: 'Pack of 16' },
  { productId: '1l-bottle', productName: 'DaaRo 1 Litre Bottle', emoji: '🧴', stockCount: 95, minSafetyLevel: 20, size: 'Pack of 16' },
  { productId: 'sachet-bag', productName: 'DaaRo Sachet Water', emoji: '🛍️', stockCount: 650, minSafetyLevel: 100, size: 'Bag' }
];

export const initialDistributors: Distributor[] = [
  { id: 'dist-1', name: 'Stephanie Addo', phone: '233545111245', territory: 'Legon & East Legon', activeOrders: 3, status: 'Active', monthlySales: 15400 },
  { id: 'dist-2', name: 'Kofi Mensah', phone: '233244123456', territory: 'Oyibi, Dodowa & Valley View', activeOrders: 1, status: 'Active', monthlySales: 9800 },
  { id: 'dist-3', name: 'Ama Serwaa', phone: '233201987654', territory: 'Madina, Adenta & Ritz', activeOrders: 4, status: 'Active', monthlySales: 18200 },
  { id: 'dist-4', name: 'Kwame Owusu', phone: '233277654321', territory: 'Tema Motorway & Spintex', activeOrders: 0, status: 'Inactive', monthlySales: 4500 }
];

export const initialOrders: Order[] = [
  {
    id: 'ORD-2026-001',
    date: '2026-05-20',
    customerName: 'Abena Osei',
    customerPhone: '0244112233',
    deliveryAddress: 'East Legon, near ANC Mall',
    items: [
      { product: products[0], quantity: 10 }, // 350ml Pack (23 * 10 = 230)
      { product: products[3], quantity: 25 }  // Sachet bags (10 * 25 = 250)
    ],
    total: 480,
    status: 'Completed',
    notes: 'Please drop at the front desk of ANC office complex block A.',
    paymentStatus: 'Paid'
  },
  {
    id: 'ORD-2026-002',
    date: '2026-05-21',
    customerName: 'Kojo Boateng',
    customerPhone: '0551234567',
    deliveryAddress: 'Oyibi, opposite Valley View University Gate',
    items: [
      { product: products[1], quantity: 10 }, // 600ml Pack (30 * 10 = 300)
      { product: products[3], quantity: 60 }  // Sachet bags (10 * 60 = 600)
    ],
    total: 900,
    status: 'Dispatched',
    notes: 'Deliver before 4:00 PM. Call my assistant upon arrival.',
    paymentStatus: 'Paid'
  },
  {
    id: 'ORD-2026-003',
    date: '2026-05-22',
    customerName: 'Esi Ampofo',
    customerPhone: '0208119900',
    deliveryAddress: 'Madina, Zongo Junction',
    items: [
      { product: products[0], quantity: 5 },  // 350ml Pack (23 * 5 = 115)
      { product: products[1], quantity: 5 },  // 600ml Pack (30 * 5 = 150)
      { product: products[2], quantity: 4 }   // 1L Pack (50 * 4 = 200)
    ],
    total: 465,
    status: 'Pending',
    notes: 'Deliver to my provision shop. Red building beside the pharmacy.',
    paymentStatus: 'Unpaid'
  },
  {
    id: 'ORD-2026-004',
    date: '2026-05-23',
    customerName: 'Yaw Mensah',
    customerPhone: '0243557788',
    deliveryAddress: 'Adenta, Frafraha Estate',
    items: [
      { product: products[3], quantity: 100 } // Sachet bags (10 * 100 = 1000)
    ],
    total: 1000,
    status: 'Pending',
    notes: 'Urgent delivery for a funeral gathering this afternoon.',
    paymentStatus: 'Unpaid'
  }
];

export const salesTrends: SalesDataPoint[] = [
  { date: '17 May', sales: 2450, orders: 8 },
  { date: '18 May', sales: 3100, orders: 11 },
  { date: '19 May', sales: 1800, orders: 6 },
  { date: '20 May', sales: 4200, orders: 15 },
  { date: '21 May', sales: 2900, orders: 9 },
  { date: '22 May', sales: 3800, orders: 13 },
  { date: '23 May', sales: 5120, orders: 18 }
];

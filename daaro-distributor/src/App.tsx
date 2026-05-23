import React, { useState, useEffect } from 'react';
import {
  MessageCircle,
  ChevronDown,
  Check,
  X,
  ShieldAlert,
  BarChart3,
  Package,
  ShoppingCart,
  MapPin,
  RefreshCw,
  LogOut,
  CheckCircle2,
  Lock,
  Eye,
  Trash2,
  Calendar,
  FileText,
  TrendingUp,
  Plus,
  Minus,
  DollarSign,
  Users
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  Legend,
  Cell,
  PieChart,
  Pie
} from 'recharts';

import { products as defaultProducts, initialInventory, initialOrders, salesTrends } from './data/mockData';
import { Product, Order, InventoryItem, Distributor, OrderItem } from './types';

const STEPHANIE_WHATSAPP = '233545111245';
const ADMIN_PASSCODE = 'TUC-ICT-2026';

interface ProductGraphicProps {
  productId: string;
  size?: 'sm' | 'md' | 'lg';
}

const ProductGraphic: React.FC<ProductGraphicProps> = ({ productId, size = 'md' }) => {
  const isSm = size === 'sm';
  const isLg = size === 'lg';

  if (productId === '350ml-bottle') {
    return (
      <div className={`flex items-end justify-center ${isSm ? 'h-8 w-8' : isLg ? 'h-36 w-36' : 'h-28 w-full pb-2'}`}>
        <img
          src="https://daarowater.com/wp-content/uploads/2025/02/daarowater-bottle.webp"
          alt="DaaRo 350ml"
          style={{ height: isSm ? '22px' : isLg ? '120px' : '78px' }}
          className="object-contain drop-shadow-sm filter transition-all duration-300 group-hover:scale-105"
        />
      </div>
    );
  }

  if (productId === '600ml-bottle') {
    return (
      <div className={`flex items-end justify-center ${isSm ? 'h-8 w-8' : isLg ? 'h-36 w-36' : 'h-28 w-full pb-2'}`}>
        <img
          src="https://daarowater.com/wp-content/uploads/2025/02/daarowater-bottle.webp"
          alt="DaaRo 600ml"
          style={{ height: isSm ? '28px' : isLg ? '135px' : '100px' }}
          className="object-contain drop-shadow-md filter transition-all duration-300 group-hover:scale-105"
        />
      </div>
    );
  }

  if (productId === '1l-bottle') {
    return (
      <div className={`flex items-end justify-center ${isSm ? 'h-8 w-8' : isLg ? 'h-36 w-36' : 'h-28 w-full pb-2'}`}>
        <img
          src="https://daarowater.com/wp-content/uploads/2025/02/daarowater-bottle.webp"
          alt="DaaRo 1L"
          style={{ height: isSm ? '32px' : isLg ? '144px' : '112px' }}
          className="object-contain drop-shadow-lg filter transition-all duration-300 group-hover:scale-105"
        />
      </div>
    );
  }

  if (productId === 'sachet-bag') {
    return (
      <div className={`flex items-end justify-center ${isSm ? 'h-8 w-8 animate-pulse-gentle' : isLg ? 'h-36 w-36' : 'h-28 w-full pb-2'}`}>
        <svg
          viewBox="0 0 100 100"
          className={`${isSm ? 'h-7 w-7' : isLg ? 'h-32 w-32' : 'h-24 w-24'} drop-shadow-md transition-all duration-300 group-hover:scale-105`}
        >
          <defs>
            <linearGradient id="sachetGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#1d4ed8" />
            </linearGradient>
            <linearGradient id="bagGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(255, 255, 255, 0.75)" />
              <stop offset="100%" stopColor="rgba(186, 230, 253, 0.4)" />
            </linearGradient>
          </defs>
          
          {/* Sachets inside */}
          <rect
            x="20"
            y="40"
            width="32"
            height="44"
            rx="4"
            transform="rotate(-20 36 62)"
            fill="url(#sachetGrad)"
            stroke="#2563eb"
            strokeWidth="0.5"
          />
          <line x1="24" y1="50" x2="48" y2="41" stroke="rgba(255, 255, 255, 0.8)" strokeWidth="3" transform="rotate(-20 36 62)" />
          <line x1="24" y1="70" x2="48" y2="61" stroke="rgba(255, 255, 255, 0.8)" strokeWidth="2" transform="rotate(-20 36 62)" />
          <circle cx="36" cy="62" r="3" fill="#ef4444" transform="rotate(-20 36 62)" />

          <rect
            x="48"
            y="35"
            width="32"
            height="44"
            rx="4"
            transform="rotate(15 64 57)"
            fill="url(#sachetGrad)"
            stroke="#2563eb"
            strokeWidth="0.5"
          />
          <line x1="52" y1="45" x2="76" y2="51" stroke="rgba(255, 255, 255, 0.8)" strokeWidth="3" transform="rotate(15 64 57)" />
          <line x1="52" y1="65" x2="76" y2="71" stroke="rgba(255, 255, 255, 0.8)" strokeWidth="2" transform="rotate(15 64 57)" />
          <circle cx="64" cy="57" r="3" fill="#ef4444" transform="rotate(15 64 57)" />

          <rect
            x="32"
            y="48"
            width="34"
            height="44"
            rx="4"
            transform="rotate(5 49 70)"
            fill="url(#sachetGrad)"
            stroke="#1d4ed8"
            strokeWidth="0.75"
          />
          <line x1="36" y1="58" x2="62" y2="60" stroke="rgba(255, 255, 255, 0.9)" strokeWidth="3.5" transform="rotate(5 49 70)" />
          <line x1="36" y1="78" x2="62" y2="80" stroke="rgba(255, 255, 255, 0.9)" strokeWidth="2" transform="rotate(5 49 70)" />
          <circle cx="49" cy="70" r="3.5" fill="#ef4444" transform="rotate(5 49 70)" />
          
          {/* Outer Translucent Bag */}
          <path
            d="M 18,32 C 18,22 82,22 82,32 C 86,60 84,90 76,95 C 66,98 34,98 24,95 C 16,90 14,60 18,32 Z"
            fill="url(#bagGrad)"
            stroke="rgba(186, 230, 253, 0.9)"
            strokeWidth="2"
          />
          
          {/* Gathered top tie */}
          <path
            d="M 42,22 C 45,26 55,26 58,22 L 53,16 L 47,16 Z"
            fill="rgba(186, 230, 253, 0.9)"
            stroke="rgba(37, 99, 235, 0.4)"
            strokeWidth="1"
          />
          <rect x="45" y="21" width="10" height="3" rx="1.5" fill="#2563eb" />
          
          {/* Shiny plastic reflections */}
          <path
            d="M 23,40 C 21,60 21,80 28,90"
            stroke="rgba(255, 255, 255, 0.5)"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M 77,40 C 79,55 79,75 75,85"
            stroke="rgba(255, 255, 255, 0.3)"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
          />
        </svg>
      </div>
    );
  }

  // Fallback
  return <div className={isSm ? 'text-xl' : 'text-5xl'}>💧</div>;
};

const App: React.FC = () => {
  // Navigation & View states
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminTab, setAdminTab] = useState<'overview' | 'orders' | 'inventory' | 'map' | 'settings'>('overview');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [loginError, setLoginError] = useState('');
  const [scrolled, setScrolled] = useState(false);

  // Core App Data (Persisted in LocalStorage)
  const [products] = useState<Product[]>(defaultProducts);
  const [orders, setOrders] = useState<Order[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [distributors, setDistributors] = useState<Distributor[]>([]);

  // Customer Form state
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    notes: '',
  });

  const [quantities, setQuantities] = useState<{ [key: string]: number }>(
    defaultProducts.reduce((acc, p) => ({ ...acc, [p.id]: 0 }), {})
  );

  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [successBanner, setSuccessBanner] = useState(false);

  // Admin selected items state
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [editingInventoryId, setEditingInventoryId] = useState<string | null>(null);
  const [editingStockVal, setEditingStockVal] = useState<number>(0);
  const [selectedMapZone, setSelectedMapZone] = useState<string | null>(null);

  // Initialize and Load Data
  useEffect(() => {
    const savedOrders = localStorage.getItem('daaro_orders');
    const savedInventory = localStorage.getItem('daaro_inventory');
    const savedDistributors = localStorage.getItem('daaro_distributors');

    if (savedOrders) {
      setOrders(JSON.parse(savedOrders));
    } else {
      setOrders(initialOrders);
      localStorage.setItem('daaro_orders', JSON.stringify(initialOrders));
    }

    if (savedInventory) {
      setInventory(JSON.parse(savedInventory));
    } else {
      setInventory(initialInventory);
      localStorage.setItem('daaro_inventory', JSON.stringify(initialInventory));
    }

    // Initialize distributors
    const initialDists: Distributor[] = [
      { id: 'dist-1', name: 'Stephanie Addo', phone: '233545111245', territory: 'Legon & East Legon', activeOrders: 3, status: 'Active', monthlySales: 15400 },
      { id: 'dist-2', name: 'Kofi Mensah', phone: '233244123456', territory: 'Oyibi, Dodowa & Valley View', activeOrders: 1, status: 'Active', monthlySales: 9800 },
      { id: 'dist-3', name: 'Ama Serwaa', phone: '233201987654', territory: 'Madina, Adenta & Ritz', activeOrders: 4, status: 'Active', monthlySales: 18200 },
      { id: 'dist-4', name: 'Kwame Owusu', phone: '233277654321', territory: 'Tema Motorway & Spintex', activeOrders: 0, status: 'Inactive', monthlySales: 4500 }
    ];
    if (savedDistributors) {
      setDistributors(JSON.parse(savedDistributors));
    } else {
      setDistributors(initialDists);
      localStorage.setItem('daaro_distributors', JSON.stringify(initialDists));
    }
  }, []);

  // Handle Scroll listener
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Calculate Order Total
  const customerTotal = products.reduce((sum, p) => sum + (quantities[p.id] || 0) * p.price, 0);

  // Customer Form Changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    if (formErrors[id]) {
      setFormErrors((prev) => ({ ...prev, [id]: '' }));
    }
  };

  // Customer Quantity Changes
  const changeQty = (id: string, delta: number) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: Math.max(0, (prev[id] || 0) + delta),
    }));
    if (formErrors.qty) {
      setFormErrors((prev) => ({ ...prev, qty: '' }));
    }
  };

  // Submit Customer Order
  const submitCustomerOrder = () => {
    const errors: { [key: string]: string } = {};
    if (!formData.name.trim()) errors.name = 'Please enter your name';
    if (!formData.phone.trim()) errors.phone = 'Please enter your phone number';
    if (!formData.address.trim()) errors.address = 'Please enter your delivery address';

    const orderedItems = products
      .filter((p) => (quantities[p.id] || 0) > 0)
      .map((p) => ({ product: p, quantity: quantities[p.id] }));

    if (orderedItems.length === 0) errors.qty = 'Please add at least one water item to your order';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    // Save order in local state & localStorage to simulate database storage
    const newOrder: Order = {
      id: `ORD-2026-${String(orders.length + 1).padStart(3, '0')}`,
      date: new Date().toISOString().split('T')[0],
      customerName: formData.name,
      customerPhone: formData.phone,
      deliveryAddress: formData.address,
      items: orderedItems,
      total: customerTotal,
      status: 'Pending',
      notes: formData.notes,
      paymentStatus: 'Unpaid'
    };

    const updatedOrders = [newOrder, ...orders];
    setOrders(updatedOrders);
    localStorage.setItem('daaro_orders', JSON.stringify(updatedOrders));

    // Update inventory counts (deduct stock)
    const updatedInventory = inventory.map((inv) => {
      const match = orderedItems.find((oi) => oi.product.id === inv.productId);
      if (match) {
        return {
          ...inv,
          stockCount: Math.max(0, inv.stockCount - match.quantity)
        };
      }
      return inv;
    });
    setInventory(updatedInventory);
    localStorage.setItem('daaro_inventory', JSON.stringify(updatedInventory));

    // Build WhatsApp message content
    const dateStr = new Date().toLocaleDateString('en-GH', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });

    const itemLines = orderedItems
      .map((item) => `  ${item.product.emoji} ${item.product.name} × ${item.quantity} = GHS ${(item.quantity * item.product.price).toLocaleString()}`)
      .join('\n');

    const msg = `🛒 *NEW ORDER — DaaRo Water*
📅 ${dateStr}
*Customer Details*
👤 Name: ${formData.name}
📞 Phone: ${formData.phone}
📍 Delivery Address: ${formData.address}

*Order Items*
${itemLines}

💰 *Total: GHS ${customerTotal.toLocaleString()}*
${formData.notes ? '\n📝 Notes: ' + formData.notes : ''}

---
_Sent via Stephanie's DaaRo Water website_`;

    const encoded = encodeURIComponent(msg);
    const url = `https://wa.me/${STEPHANIE_WHATSAPP}?text=${encoded}`;

    // Reset Form
    setFormData({ name: '', phone: '', address: '', notes: '' });
    setQuantities(products.reduce((acc, p) => ({ ...acc, [p.id]: 0 }), {}));
    setSuccessBanner(true);

    // Open WhatsApp
    window.open(url, '_blank');
  };

  // Admin Passcode Check
  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === ADMIN_PASSCODE) {
      setIsAdmin(true);
      setShowLoginModal(false);
      setPasscode('');
      setLoginError('');
    } else {
      setLoginError('Invalid Administrator Passcode. Please try again.');
    }
  };

  // Update Order Status
  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    const updated: Order[] = orders.map((o) => {
      if (o.id === orderId) {
        return { ...o, status };
      }
      return o;
    });
    setOrders(updated);
    localStorage.setItem('daaro_orders', JSON.stringify(updated));
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status });
    }
  };

  // Update Order Payment Status
  const toggleOrderPayment = (orderId: string) => {
    const updated: Order[] = orders.map((o) => {
      if (o.id === orderId) {
        return { ...o, paymentStatus: o.paymentStatus === 'Paid' ? 'Unpaid' : 'Paid' };
      }
      return o;
    });
    setOrders(updated);
    localStorage.setItem('daaro_orders', JSON.stringify(updated));
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({
        ...selectedOrder,
        paymentStatus: selectedOrder.paymentStatus === 'Paid' ? 'Unpaid' : 'Paid'
      });
    }
  };

  // Delete Order
  const deleteOrder = (orderId: string) => {
    if (window.confirm(`Are you sure you want to delete order ${orderId}?`)) {
      const updated = orders.filter((o) => o.id !== orderId);
      setOrders(updated);
      localStorage.setItem('daaro_orders', JSON.stringify(updated));
      setSelectedOrder(null);
    }
  };

  // Update Inventory Stock Count
  const saveInventoryStock = (productId: string) => {
    const updated = inventory.map((inv) => {
      if (inv.productId === productId) {
        return { ...inv, stockCount: editingStockVal };
      }
      return inv;
    });
    setInventory(updated);
    localStorage.setItem('daaro_inventory', JSON.stringify(updated));
    setEditingInventoryId(null);
  };

  // Export Database
  const exportData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({ orders, inventory, distributors }, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `daaro_water_db_export_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Reset Database
  const resetToDefaults = () => {
    if (window.confirm("Are you sure you want to reset the system database back to initial defaults? All custom client orders will be overwritten.")) {
      setOrders(initialOrders);
      localStorage.setItem('daaro_orders', JSON.stringify(initialOrders));
      setInventory(initialInventory);
      localStorage.setItem('daaro_inventory', JSON.stringify(initialInventory));
      localStorage.removeItem('daaro_distributors');
      // reload page to reset
      window.location.reload();
    }
  };

  // Metrics calculation
  const totalRevenue = orders
    .filter((o) => o.status === 'Completed' || o.status === 'Dispatched')
    .reduce((sum, o) => sum + o.total, 0);

  const pendingOrdersCount = orders.filter((o) => o.status === 'Pending').length;
  const totalBottlesSold = orders
    .filter((o) => o.status === 'Completed')
    .reduce((sum, o) => sum + o.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0);

  const safetyAlertsCount = inventory.filter((inv) => inv.stockCount < inv.minSafetyLevel).length;

  // Pie chart mapping
  const pieData = products.map((prod) => {
    const totalSold = orders
      .filter((o) => o.status === 'Completed')
      .reduce((sum, o) => {
        const match = o.items.find((item) => item.product.id === prod.id);
        return sum + (match ? match.quantity : 0);
      }, 0);
    return { id: prod.id, name: prod.name, value: totalSold, emoji: prod.emoji };
  }).filter((d) => d.value > 0);

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  // Zone specific metrics for SVG Map
  const zoneStats = {
    'east-legon': { name: 'East Legon', active: orders.filter((o) => o.deliveryAddress.toLowerCase().includes('east legon') && o.status !== 'Completed' && o.status !== 'Cancelled').length, completed: orders.filter((o) => o.deliveryAddress.toLowerCase().includes('east legon') && o.status === 'Completed').length },
    'legon': { name: 'Legon Campus', active: orders.filter((o) => o.deliveryAddress.toLowerCase().includes('legon') && !o.deliveryAddress.toLowerCase().includes('east legon') && o.status !== 'Completed' && o.status !== 'Cancelled').length, completed: orders.filter((o) => o.deliveryAddress.toLowerCase().includes('legon') && !o.deliveryAddress.toLowerCase().includes('east legon') && o.status === 'Completed').length },
    'madina': { name: 'Madina / Adenta', active: orders.filter((o) => (o.deliveryAddress.toLowerCase().includes('madina') || o.deliveryAddress.toLowerCase().includes('adenta')) && o.status !== 'Completed' && o.status !== 'Cancelled').length, completed: orders.filter((o) => (o.deliveryAddress.toLowerCase().includes('madina') || o.deliveryAddress.toLowerCase().includes('adenta')) && o.status === 'Completed').length },
    'oyibi': { name: 'Oyibi / Dodowa', active: orders.filter((o) => (o.deliveryAddress.toLowerCase().includes('oyibi') || o.deliveryAddress.toLowerCase().includes('dodowa')) && o.status !== 'Completed' && o.status !== 'Cancelled').length, completed: orders.filter((o) => (o.deliveryAddress.toLowerCase().includes('oyibi') || o.deliveryAddress.toLowerCase().includes('dodowa')) && o.status === 'Completed').length },
  };

  return (
    <div className="bg-[#fafbfd] text-slate-900 min-h-screen flex flex-col font-['Nunito',sans-serif]">
      {/* HEADER BAR */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-4 bg-white/80 backdrop-blur-md border-b border-blue-900/5 transition-all duration-300 ${
          scrolled ? 'shadow-lg py-3' : 'shadow-sm'
        }`}
      >
        <a href="/" className="flex items-center gap-2.5 text-xl md:text-2xl font-extrabold text-blue-950 font-['Plus_Jakarta_Sans',sans-serif]">
          <span className="text-2xl animate-pulse-gentle">💧</span>
          <span>
            Stephanie's <span className="font-light italic text-blue-600">DaaRo</span>
          </span>
        </a>

        <div className="flex items-center gap-3">
          {isAdmin ? (
            <button
              onClick={() => setIsAdmin(false)}
              className="border border-red-200 text-red-600 px-4 py-2 rounded-lg font-semibold text-xs md:text-sm flex items-center gap-1.5 hover:bg-red-50 hover:border-red-300 transition-all cursor-pointer"
            >
              <LogOut size={16} />
              Exit Admin Portal
            </button>
          ) : (
            <>
              <button
                onClick={() => setShowLoginModal(true)}
                className="border border-blue-200 text-blue-950 px-4 py-2 rounded-lg font-semibold text-xs md:text-sm flex items-center gap-1.5 hover:bg-blue-50/50 hover:border-blue-300 transition-all cursor-pointer"
              >
                <Lock size={15} />
                Portal Access
              </button>
              <a
                href={`https://wa.me/${STEPHANIE_WHATSAPP}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-emerald-500 text-white px-4 py-2 rounded-lg font-bold text-xs md:text-sm flex items-center gap-1.5 hover:bg-emerald-600 hover:shadow-md transition-all active:translate-y-0.5 cursor-pointer"
              >
                <MessageCircle size={16} />
                WhatsApp Direct
              </a>
            </>
          )}
        </div>
      </nav>

      {/* CUSTOMER PORTAL INTERACTION VIEW */}
      {!isAdmin ? (
        <main className="flex-1 pt-18">
          {/* HERO PANEL */}
          <section
            className="relative min-h-[90vh] flex items-center px-6 md:px-16 py-12 md:py-20 overflow-hidden"
            style={{
              background: 'linear-gradient(165deg, #e0f2fe 0%, #f0fdf4 60%, #eff6ff 100%)',
            }}
          >
            {/* Visual background gradient bubbles */}
            <div className="absolute -bottom-20 -right-20 w-96 h-96 rounded-full bg-blue-400/10 blur-3xl pointer-events-none" />
            <div className="absolute top-10 left-10 w-72 h-72 rounded-full bg-emerald-400/10 blur-3xl pointer-events-none" />

            <div className="max-w-4xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center z-10">
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-flex items-center gap-2 bg-blue-900/5 text-blue-950 text-xs font-extrabold tracking-wider uppercase px-4 py-2 rounded-full border border-blue-900/5 shadow-xs">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
                  Begoro Mountain Aquifers source
                </div>

                <h1 className="text-4xl md:text-6xl font-black text-blue-950 leading-tight tracking-tight font-['Plus_Jakarta_Sans',sans-serif]">
                  Purity from Begoro,<br />
                  delivered to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-600">your doorstep.</span>
                </h1>

                <p className="text-base md:text-lg text-slate-600 max-w-xl leading-relaxed">
                  Stephanie's DaaRo Water distributes Ghana's premium natural mineral water. Sourced directly from the high mountain reserves of Begoro, bottled under extreme sanitary controls. Refreshing, crisp, and pure.
                </p>

                <div className="flex gap-4 flex-wrap">
                  <a
                    href="#order-form"
                    className="bg-blue-950 text-white px-6 py-3.5 rounded-xl font-bold text-base hover:bg-blue-900 hover:shadow-lg transition-all hover:-translate-y-0.5 active:translate-y-0"
                  >
                    Place an Order Now
                  </a>
                  <a
                    href="#products-list"
                    className="border border-blue-950/20 text-blue-950 px-6 py-3.5 rounded-xl font-semibold text-base hover:bg-slate-100 hover:border-blue-950/40 transition-all hover:-translate-y-0.5 active:translate-y-0"
                  >
                    Explore Products
                  </a>
                </div>

                <div className="grid grid-cols-3 gap-6 pt-6 border-t border-slate-200 max-w-lg">
                  <div>
                    <div className="text-2xl md:text-3xl font-extrabold text-blue-950 font-['Plus_Jakarta_Sans',sans-serif]">5</div>
                    <div className="text-xs md:text-sm text-slate-500 font-semibold mt-1">Water Packages</div>
                  </div>
                  <div>
                    <div className="text-2xl md:text-3xl font-extrabold text-blue-950 font-['Plus_Jakarta_Sans',sans-serif]">100%</div>
                    <div className="text-xs md:text-sm text-slate-500 font-semibold mt-1">Natural Springs</div>
                  </div>
                  <div>
                    <div className="text-2xl md:text-3xl font-extrabold text-blue-950 font-['Plus_Jakarta_Sans',sans-serif]">Fast</div>
                    <div className="text-xs md:text-sm text-slate-500 font-semibold mt-1">Local Shipping</div>
                  </div>
                </div>
              </div>

              {/* Water bottle mock illustration */}
              <div className="lg:col-span-5 hidden lg:flex justify-center items-center relative">
                {/* SVG clip-path template */}
                <svg width="0" height="0" className="absolute">
                  <defs>
                    <clipPath id="bottle-clip" clipPathUnits="objectBoundingBox">
                      <path d="M 0.43,0.01 L 0.57,0.01 L 0.57,0.08 L 0.58,0.08 L 0.58,0.11 L 0.56,0.11 L 0.56,0.16 L 0.74,0.28 L 0.74,0.56 Q 0.74,0.64 0.68,0.72 Q 0.68,0.80 0.74,0.88 L 0.72,0.96 Q 0.68,1.0 0.60,0.98 Q 0.50,1.0 0.40,0.98 Q 0.32,1.0 0.28,0.96 L 0.26,0.88 Q 0.32,0.80 0.32,0.72 Q 0.26,0.64 0.26,0.56 L 0.26,0.28 L 0.44,0.16 L 0.44,0.11 L 0.42,0.11 L 0.42,0.08 L 0.43,0.08 L 0.43,0.01 Z" />
                    </clipPath>
                  </defs>
                </svg>

                {/* Glowing background */}
                <div className="w-80 h-80 rounded-full bg-radial from-blue-300/40 to-transparent absolute -z-10 animate-pulse-gentle" />
                
                {/* Cutout container with floating animation */}
                <div className="w-64 h-[380px] relative select-none animate-float">
                  
                  {/* Clipped background and bottle content */}
                  <div 
                    className="absolute inset-0 w-full h-full overflow-hidden bg-gradient-to-b from-sky-100/30 to-blue-200/50"
                    style={{ clipPath: 'url(#bottle-clip)', WebkitClipPath: 'url(#bottle-clip)' }}
                  >
                    {/* Solid Blue Screw Cap Overlay with vertical ridges pattern */}
                    <div 
                      className="absolute top-0 left-0 w-full h-[8%] border-b border-blue-800/60 z-10"
                      style={{
                        background: 'repeating-linear-gradient(90deg, #2563eb, #2563eb 2px, #1d4ed8 2px, #1d4ed8 4px)'
                      }}
                    />

                    {/* Animated water waves inside the cutout */}
                    <div className="absolute inset-x-0 bottom-0 h-44 overflow-hidden pointer-events-none opacity-60">
                      <svg viewBox="0 0 120 28" className="absolute bottom-0 w-[200%] h-16 fill-blue-400/50 animate-wave" preserveAspectRatio="none">
                        <path d="M0,15 C30,5 10,0 60,15 C90,25 90,5 120,15 L120,30 L0,30 Z" />
                      </svg>
                      <svg viewBox="0 0 120 28" className="absolute bottom-0 w-[200%] h-12 fill-blue-500/40 animate-wave" style={{ animationDelay: '-3s', animationDuration: '8s' }} preserveAspectRatio="none">
                        <path d="M0,15 C30,25 20,5 60,15 C90,25 100,5 120,15 L120,30 L0,30 Z" />
                      </svg>
                    </div>

                    {/* DaaRo Bottle image animating inside */}
                    <img
                      src="https://daarowater.com/wp-content/uploads/2025/02/daarowater-bottle.webp"
                      alt="DaaRo Water Bottle"
                      className="absolute inset-0 w-full h-full object-contain p-6 scale-95 hover:scale-100 transition-all duration-700"
                    />

                    {/* Light shine/shimmer effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent w-[50%] h-full skew-x-12 translate-x-[-150%] animate-shimmer pointer-events-none" />
                  </div>

                  {/* Glass Highlight / Bottle Stroke Overlay */}
                  <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full pointer-events-none drop-shadow-md" preserveAspectRatio="none">
                    <path
                      d="M 43,1 L 57,1 L 57,8 L 58,8 L 58,11 L 56,11 L 56,16 L 74,28 L 74,56 Q 74,64 68,72 Q 68,80 74,88 L 72,96 Q 68,100 60,98 Q 50,100 40,98 Q 32,100 28,96 L 26,88 Q 32,80 32,72 Q 26,64 26,56 L 26,28 L 44,16 L 44,11 L 42,11 L 42,8 L 43,8 L 43,1 Z"
                      fill="none"
                      stroke="rgba(59, 130, 246, 0.25)"
                      strokeWidth="1.5"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </section>

          {/* SUCCESS BANNER OVERLAY */}
          {successBanner && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-950 px-6 py-5 rounded-2xl max-w-2xl mx-auto mt-8 shadow-md flex items-start gap-4 animate-fadeUp">
              <div className="bg-emerald-500 text-white rounded-full p-1.5 mt-0.5">
                <Check size={20} />
              </div>
              <div className="flex-1">
                <h4 className="font-extrabold text-lg text-emerald-900">Order successfully sent to WhatsApp!</h4>
                <p className="text-sm text-emerald-800/90 mt-1">
                  We have saved your order requirements in our local distributor database. You can close the WhatsApp tab once your message has been sent. Stephanie will review the coordinates and finalize shipping details.
                </p>
                <button
                  onClick={() => setSuccessBanner(false)}
                  className="text-xs font-bold text-emerald-900 underline mt-3 hover:text-emerald-950 cursor-pointer"
                >
                  Dismiss Notification
                </button>
              </div>
            </div>
          )}

          {/* PRODUCTS CATALOG SECTION */}
          <section id="products-list" className="py-20 px-6 md:px-12 bg-white border-y border-slate-100">
            <div className="max-w-4xl mx-auto">
              <div className="text-blue-600 text-xs font-extrabold tracking-wider uppercase mb-2">Aquifer Bottling</div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-blue-950 tracking-tight font-['Plus_Jakarta_Sans',sans-serif] mb-4">Choose Your DaaRo</h2>
              <p className="text-slate-500 text-base md:text-lg max-w-2xl mb-12">
                Naturally filtered through deep, volcanic rock layers in the high mountains of Begoro. Choose your preferred bottle or sachet counts.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className={`bg-slate-50/50 rounded-2xl p-6 border-2 transition-all duration-300 relative group flex flex-col justify-between ${
                      (quantities[product.id] || 0) > 0
                        ? 'border-blue-500 bg-blue-50/10 shadow-md translate-y-[-4px]'
                        : 'border-transparent hover:border-slate-200 hover:shadow-xs'
                    }`}
                  >
                    <div>
                      <div className="mb-4 select-none">
                        <ProductGraphic productId={product.id} size="md" />
                      </div>
                      <h3 className="font-extrabold text-lg text-blue-950 mb-1">{product.name}</h3>
                      <p className="text-slate-500 text-xs font-semibold mb-3">{product.size}</p>
                      <span className="inline-block bg-blue-900/5 text-blue-900 text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider mb-6">
                        {product.type}
                      </span>
                    </div>

                    <div className="flex justify-between items-end border-t border-slate-150 pt-4">
                      <div>
                        <span className="text-slate-400 text-xs font-bold block mb-0.5">Price</span>
                        <span className="text-xl font-extrabold text-blue-950">GHS {product.price}</span>
                      </div>

                      <button
                        onClick={() => {
                          const element = document.getElementById('order-form');
                          if (element) {
                            element.scrollIntoView({ behavior: 'smooth' });
                            changeQty(product.id, 1);
                          }
                        }}
                        className="bg-blue-950 text-white text-xs font-bold px-3 py-2 rounded-lg hover:bg-blue-900 transition-all cursor-pointer"
                      >
                        Add to Order
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ORDERING INPUT BOARD */}
          <section id="order-form" className="py-20 px-6 md:px-12 bg-slate-50/50">
            <div className="max-w-2xl mx-auto">
              <div className="text-blue-600 text-xs font-extrabold tracking-wider uppercase mb-2">Order Dispatcher</div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-blue-950 tracking-tight font-['Plus_Jakarta_Sans',sans-serif] mb-4">Request Delivery</h2>
              <p className="text-slate-500 text-base max-w-xl mb-10">
                Log your details and set item quantities. We will generate the billing metrics and launch your order request directly onto WhatsApp.
              </p>

              <div className="bg-white rounded-3xl p-8 md:p-10 border border-slate-200/60 shadow-lg">
                <h3 className="font-extrabold text-xl text-blue-950 mb-6 flex items-center gap-2">
                  <span>🛒</span> Order Request Form
                </h3>

                <div className="space-y-6">
                  {/* Customer inputs */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        placeholder="e.g. Abena Boateng"
                        value={formData.name}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:bg-white focus:outline-none focus:border-blue-500 transition-all ${
                          formErrors.name ? 'border-red-400 focus:border-red-500' : ''
                        }`}
                      />
                      {formErrors.name && <span className="text-xs text-red-500 font-bold mt-1.5 block">{formErrors.name}</span>}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                        WhatsApp Contact *
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        placeholder="e.g. 0244123456"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:bg-white focus:outline-none focus:border-blue-500 transition-all ${
                          formErrors.phone ? 'border-red-400 focus:border-red-500' : ''
                        }`}
                      />
                      {formErrors.phone && <span className="text-xs text-red-500 font-bold mt-1.5 block">{formErrors.phone}</span>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                      Delivery Address &amp; Landmarks *
                    </label>
                    <input
                      type="text"
                      id="address"
                      placeholder="e.g. East Legon, opposite ANC Mall, behind the pharmacy"
                      value={formData.address}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:bg-white focus:outline-none focus:border-blue-500 transition-all ${
                        formErrors.address ? 'border-red-400 focus:border-red-500' : ''
                      }`}
                    />
                    {formErrors.address && <span className="text-xs text-red-500 font-bold mt-1.5 block">{formErrors.address}</span>}
                  </div>

                  {/* Quantities Selection */}
                  <div className="border-t border-slate-100 pt-6">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                      Select Quantities &amp; Stock items *
                    </label>

                    <div className="space-y-3">
                      {products.map((product) => (
                        <div key={product.id} className="flex items-center justify-between px-4 py-3 bg-slate-50/70 border border-slate-150 rounded-xl">
                          <div className="flex items-center gap-3">
                            <ProductGraphic productId={product.id} size="sm" />
                            <div>
                              <span className="font-extrabold text-sm md:text-base text-blue-950 block">{product.name}</span>
                              <span className="text-slate-400 text-xs font-bold">GHS {product.price} each</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <button
                              type="button"
                              onClick={() => changeQty(product.id, -1)}
                              className="w-8 h-8 rounded-full bg-white border border-slate-200 text-slate-800 font-bold flex items-center justify-center hover:bg-slate-100 hover:border-slate-350 transition-all cursor-pointer"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="w-8 text-center font-extrabold text-sm md:text-base text-blue-950">
                              {quantities[product.id] || 0}
                            </span>
                            <button
                              type="button"
                              onClick={() => changeQty(product.id, 1)}
                              className="w-8 h-8 rounded-full bg-white border border-slate-200 text-slate-800 font-bold flex items-center justify-center hover:bg-slate-100 hover:border-slate-350 transition-all cursor-pointer"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                    {formErrors.qty && <span className="text-xs text-red-500 font-bold mt-2.5 block">{formErrors.qty}</span>}
                  </div>

                  {/* Special Instructions */}
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                      Special Delivery Instructions (optional)
                    </label>
                    <textarea
                      id="notes"
                      rows={3}
                      placeholder="e.g. Please call before driving over, deliver after 2:00 PM..."
                      value={formData.notes}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:bg-white focus:outline-none focus:border-blue-500 transition-all resize-none"
                    />
                  </div>

                  {/* Order Total Display */}
                  {customerTotal > 0 && (
                    <div className="bg-blue-50/30 border border-blue-100 rounded-2xl p-4 flex justify-between items-center animate-fadeUp">
                      <span className="font-extrabold text-blue-950 text-sm">Billing Total</span>
                      <span className="text-2xl font-black text-blue-950">GHS {customerTotal.toLocaleString()}</span>
                    </div>
                  )}

                  {/* WhatsApp send button */}
                  <button
                    type="button"
                    onClick={submitCustomerOrder}
                    className="w-full bg-emerald-500 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-emerald-600 hover:shadow-lg transition-all active:translate-y-0.5 cursor-pointer text-base md:text-lg"
                  >
                    <MessageCircle size={22} />
                    Confirm &amp; Order on WhatsApp
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* VALUES & ABOUT BANNER */}
          <section className="py-20 px-6 md:px-12 bg-blue-950 text-white">
            <div className="max-w-4xl mx-auto">
              <div className="text-blue-400 text-xs font-extrabold tracking-wider uppercase mb-2">Our Standards</div>
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4 font-['Plus_Jakarta_Sans',sans-serif]">Natural Springs Sourced Responsibly</h2>
              <p className="text-blue-100/70 text-base md:text-lg max-w-xl mb-12">
                Processed with state-of-the-art multi-stage filter systems, maintaining natural mineral content and optimal pH levels.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all">
                  <span className="text-3xl block mb-3">🏔️</span>
                  <h4 className="font-extrabold text-lg mb-2">Begoro Mountain Source</h4>
                  <p className="text-blue-100/60 text-xs md:text-sm leading-relaxed">
                    Sourced from premium, protected aquifers under Begoro's mountain ridges. Free from agricultural and city runoff.
                  </p>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all">
                  <span className="text-3xl block mb-3">🔬</span>
                  <h4 className="font-extrabold text-lg mb-2">Purification Rigour</h4>
                  <p className="text-blue-100/60 text-xs md:text-sm leading-relaxed">
                    Undergoes microfiltration, sand active carbon sweeps, reverse osmosis, UV exposure, and ozone injection.
                  </p>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all">
                  <span className="text-3xl block mb-3">🛍️</span>
                  <h4 className="font-extrabold text-lg mb-2">Sachet &amp; Bottles Supply</h4>
                  <p className="text-blue-100/60 text-xs md:text-sm leading-relaxed">
                    From highly convenient 600ml bottles to our high-demand sachet bags, we cater to retail outlets, gatherings, and homes.
                  </p>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all">
                  <span className="text-3xl block mb-3">📦</span>
                  <h4 className="font-extrabold text-lg mb-2">Fast Logistics</h4>
                  <p className="text-blue-100/60 text-xs md:text-sm leading-relaxed">
                    Distributing through regional hubs to dispatch orders quickly within Accra, Madina, Adenta, Legon, and Oyibi.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </main>
      ) : (
        /* ADMINISTRATOR SYSTEM VIEW */
        <main className="flex-1 pt-20 flex flex-col md:flex-row bg-[#f8fafc]">
          {/* SIDEBAR TABS */}
          <aside className="w-full md:w-64 bg-white border-b md:border-b-0 md:border-r border-slate-200 px-4 py-6 md:min-h-[90vh]">
            <div className="px-3 mb-6">
              <span className="text-[10px] font-extrabold text-slate-400 tracking-widest uppercase">Navigation Menu</span>
              <div className="flex items-center gap-3 mt-2">
                <div className="w-9 h-9 rounded-full bg-blue-900 text-white flex items-center justify-center font-bold">
                  SA
                </div>
                <div>
                  <h5 className="text-sm font-extrabold text-blue-950">Stephanie Addo</h5>
                  <span className="text-[10px] text-emerald-500 font-extrabold uppercase">Distributor Admin</span>
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <button
                onClick={() => setAdminTab('overview')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-extrabold transition-all cursor-pointer ${
                  adminTab === 'overview'
                    ? 'bg-blue-50 text-blue-900'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <BarChart3 size={18} />
                Overview Stats
              </button>

              <button
                onClick={() => setAdminTab('orders')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-extrabold transition-all cursor-pointer ${
                  adminTab === 'orders'
                    ? 'bg-blue-50 text-blue-900'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <ShoppingCart size={18} />
                Orders Ledger
                {pendingOrdersCount > 0 && (
                  <span className="ml-auto w-5 h-5 bg-blue-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                    {pendingOrdersCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => setAdminTab('inventory')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-extrabold transition-all cursor-pointer ${
                  adminTab === 'inventory'
                    ? 'bg-blue-50 text-blue-900'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Package size={18} />
                Inventory Board
                {safetyAlertsCount > 0 && (
                  <span className="ml-auto w-5 h-5 bg-amber-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {safetyAlertsCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => setAdminTab('map')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-extrabold transition-all cursor-pointer ${
                  adminTab === 'map'
                    ? 'bg-blue-50 text-blue-900'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <MapPin size={18} />
                Delivery Routes
              </button>

              <button
                onClick={() => setAdminTab('settings')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-extrabold transition-all cursor-pointer ${
                  adminTab === 'settings'
                    ? 'bg-blue-50 text-blue-900'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <RefreshCw size={18} />
                System Maintenance
              </button>
            </div>
          </aside>

          {/* MAIN ADMIN WORKSPACE */}
          <section className="flex-1 p-6 md:p-8 max-w-6xl mx-auto w-full">
            {/* OVERVIEW STATS TAB */}
            {adminTab === 'overview' && (
              <div className="space-y-8 animate-fadeUp">
                {/* Header */}
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-black text-blue-950 tracking-tight font-['Plus_Jakarta_Sans',sans-serif]">Distributor Performance</h2>
                    <p className="text-xs md:text-sm text-slate-500">Live operational intelligence for Stephanie's distribution center.</p>
                  </div>

                  <span className="bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
                    Live Operations
                  </span>
                </div>

                {/* KPI Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white rounded-2xl p-5 border border-slate-200/60 shadow-xs">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-slate-400 text-xs font-extrabold uppercase">Total Revenue</span>
                      <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                        <DollarSign size={18} />
                      </div>
                    </div>
                    <div className="text-2xl font-extrabold text-slate-900">GHS {totalRevenue.toLocaleString()}</div>
                    <span className="text-[10px] text-slate-400 font-semibold mt-1 block">Active sales pipeline</span>
                  </div>

                  <div className="bg-white rounded-2xl p-5 border border-slate-200/60 shadow-xs">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-slate-400 text-xs font-extrabold uppercase">Completed Orders</span>
                      <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                        <CheckCircle2 size={18} />
                      </div>
                    </div>
                    <div className="text-2xl font-extrabold text-slate-900">
                      {orders.filter((o) => o.status === 'Completed').length}
                    </div>
                    <span className="text-[10px] text-slate-400 font-semibold mt-1 block">Successfully dispatched</span>
                  </div>

                  <div className="bg-white rounded-2xl p-5 border border-slate-200/60 shadow-xs">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-slate-400 text-xs font-extrabold uppercase">Total Bottles Sold</span>
                      <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                        <Package size={18} />
                      </div>
                    </div>
                    <div className="text-2xl font-extrabold text-slate-900">{totalBottlesSold}</div>
                    <span className="text-[10px] text-slate-400 font-semibold mt-1 block">DaaRo Water distributed</span>
                  </div>

                  <div className="bg-white rounded-2xl p-5 border border-slate-200/60 shadow-xs">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-slate-400 text-xs font-extrabold uppercase">Critical Stock Warnings</span>
                      <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                        <ShieldAlert size={18} />
                      </div>
                    </div>
                    <div className="text-2xl font-extrabold text-slate-900">{safetyAlertsCount}</div>
                    <span className="text-[10px] text-slate-400 font-semibold mt-1 block">Items below safety limits</span>
                  </div>
                </div>

                {/* Recharts Analytics */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Revenue Line Chart */}
                  <div className="bg-white rounded-2xl p-5 border border-slate-200/60 shadow-xs lg:col-span-8">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="font-extrabold text-base text-blue-950 flex items-center gap-2">
                        <TrendingUp size={18} className="text-blue-600" />
                        Sales Trend Metrics (GHS)
                      </h4>
                    </div>

                    <div className="h-64 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={salesTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                          <defs>
                            <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                          <XAxis dataKey="date" stroke="#94a3b8" fontSize={10} fontWeight="bold" />
                          <YAxis stroke="#94a3b8" fontSize={10} fontWeight="bold" />
                          <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }} />
                          <Area type="monotone" dataKey="sales" name="Revenue (GHS)" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Product Pie Chart */}
                  <div className="bg-white rounded-2xl p-5 border border-slate-200/60 shadow-xs lg:col-span-4">
                    <h4 className="font-extrabold text-base text-blue-950 mb-4">Water Volume Mix</h4>
                    {pieData.length > 0 ? (
                      <div className="flex flex-col items-center">
                        <div className="h-44 w-full relative flex justify-center">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={pieData}
                                cx="50%"
                                cy="50%"
                                innerRadius={45}
                                outerRadius={65}
                                paddingAngle={3}
                                dataKey="value"
                              >
                                {pieData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                              </Pie>
                              <Tooltip contentStyle={{ borderRadius: '12px', fontSize: '11px' }} />
                            </PieChart>
                          </ResponsiveContainer>
                          {/* Center info */}
                          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                            <span className="text-[10px] text-slate-400 font-extrabold uppercase">Sold</span>
                            <span className="text-lg font-black text-slate-900 block">{totalBottlesSold}</span>
                          </div>
                        </div>

                        {/* Legend */}
                        <div className="space-y-1.5 w-full mt-2">
                          {pieData.map((d, index) => (
                            <div key={d.name} className="flex items-center justify-between text-xs font-bold text-slate-600">
                              <div className="flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                                <ProductGraphic productId={d.id} size="sm" />
                                <span>{d.name.split(' DaaRo ')[1] || d.name}</span>
                              </div>
                              <span className="text-slate-900">{d.value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="h-48 flex items-center justify-center text-center text-slate-400 font-semibold text-sm">
                        No completed sales recorded<br />for chart rendering yet.
                      </div>
                    )}
                  </div>
                </div>

                {/* Sub-Distributors Overview */}
                <div className="bg-white rounded-2xl p-5 border border-slate-200/60 shadow-xs">
                  <h4 className="font-extrabold text-base text-blue-950 mb-4 flex items-center gap-2">
                    <Users size={18} className="text-blue-600" />
                    Monitored Territory Distributors
                  </h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs font-semibold">
                      <thead>
                        <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                          <th className="pb-3">Name</th>
                          <th className="pb-3">Territory</th>
                          <th className="pb-3">Contact</th>
                          <th className="pb-3 text-center">Pending Dropoffs</th>
                          <th className="pb-3">Monthly Volume</th>
                          <th className="pb-3 text-right">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {distributors.map((dist) => (
                          <tr key={dist.id} className="text-slate-700">
                            <td className="py-3 font-extrabold text-blue-950">{dist.name}</td>
                            <td className="py-3 text-slate-600">{dist.territory}</td>
                            <td className="py-3 font-mono">{dist.phone}</td>
                            <td className="py-3 text-center font-bold text-blue-600">{dist.activeOrders}</td>
                            <td className="py-3 font-bold text-slate-900">GHS {dist.monthlySales.toLocaleString()}</td>
                            <td className="py-3 text-right">
                              <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                                dist.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'
                              }`}>
                                {dist.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ORDERS LEDGER TAB */}
            {adminTab === 'orders' && (
              <div className="space-y-6 animate-fadeUp">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <h2 className="text-2xl font-black text-blue-950 tracking-tight font-['Plus_Jakarta_Sans',sans-serif]">Orders Ledger</h2>
                    <p className="text-xs md:text-sm text-slate-500">Track and dispatch customer orders requested via WhatsApp.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Orders Table */}
                  <div className="bg-white rounded-2xl border border-slate-200/60 shadow-xs lg:col-span-8 overflow-hidden">
                    <div className="p-4 bg-slate-50/50 border-b border-slate-150 flex justify-between items-center">
                      <span className="text-xs font-bold text-slate-500 uppercase">Registered Requests</span>
                      <span className="text-xs font-extrabold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">{orders.length} Total</span>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs font-semibold">
                        <thead>
                          <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider bg-slate-50/20">
                            <th className="p-4">Order ID</th>
                            <th className="p-4">Customer</th>
                            <th className="p-4">Date</th>
                            <th className="p-4">Total Billing</th>
                            <th className="p-4">Status</th>
                            <th className="p-4 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                          {orders.map((o) => (
                            <tr
                              key={o.id}
                              onClick={() => setSelectedOrder(o)}
                              className={`cursor-pointer hover:bg-slate-50/70 transition-all ${
                                selectedOrder && selectedOrder.id === o.id ? 'bg-blue-50/30' : ''
                              }`}
                            >
                              <td className="p-4 font-mono font-bold text-blue-950">{o.id}</td>
                              <td className="p-4">
                                <span className="font-extrabold text-blue-950 block">{o.customerName}</span>
                                <span className="text-slate-400 text-[10px] block">{o.customerPhone}</span>
                              </td>
                              <td className="p-4 text-slate-500">{o.date}</td>
                              <td className="p-4 font-bold text-slate-900">GHS {o.total.toLocaleString()}</td>
                              <td className="p-4">
                                <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                                  o.status === 'Pending' ? 'bg-amber-50 text-amber-600 border border-amber-250' :
                                  o.status === 'Dispatched' ? 'bg-blue-50 text-blue-600 border border-blue-200' :
                                  o.status === 'Completed' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' :
                                  'bg-red-50 text-red-600 border border-red-200'
                                }`}>
                                  {o.status}
                                </span>
                              </td>
                              <td className="p-4 text-right" onClick={(e) => e.stopPropagation()}>
                                <div className="flex gap-2 justify-end">
                                  <button
                                    onClick={() => setSelectedOrder(o)}
                                    className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-all"
                                    title="View Details"
                                  >
                                    <Eye size={14} />
                                  </button>
                                  <button
                                    onClick={() => deleteOrder(o.id)}
                                    className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-all"
                                    title="Delete Order"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Selected Order Detail Panel */}
                  <div className="lg:col-span-4 space-y-4">
                    {selectedOrder ? (
                      <div className="bg-white rounded-2xl border border-slate-200/60 p-5 shadow-sm space-y-5 animate-fadeUp">
                        <div className="flex justify-between items-start border-b border-slate-100 pb-4">
                          <div>
                            <span className="text-[10px] text-slate-400 font-extrabold uppercase">Selected Request</span>
                            <h3 className="font-extrabold text-lg text-blue-950 font-mono mt-0.5">{selectedOrder.id}</h3>
                          </div>
                          <button
                            onClick={() => setSelectedOrder(null)}
                            className="text-slate-400 hover:text-slate-600 cursor-pointer"
                          >
                            <X size={18} />
                          </button>
                        </div>

                        {/* Customer Info Card */}
                        <div className="space-y-3 text-xs font-semibold">
                          <div className="flex gap-2">
                            <span className="text-slate-400 w-16">Customer:</span>
                            <span className="text-blue-950 font-extrabold">{selectedOrder.customerName}</span>
                          </div>
                          <div className="flex gap-2">
                            <span className="text-slate-400 w-16">Phone:</span>
                            <a href={`tel:${selectedOrder.customerPhone}`} className="text-blue-600 underline font-mono">
                              {selectedOrder.customerPhone}
                            </a>
                          </div>
                          <div className="flex gap-2">
                            <span className="text-slate-400 w-16">Address:</span>
                            <span className="text-slate-700 flex-1">{selectedOrder.deliveryAddress}</span>
                          </div>
                          {selectedOrder.notes && (
                            <div className="p-3 bg-slate-50 border border-slate-150 rounded-xl mt-2 text-slate-600 leading-relaxed text-[11px]">
                              <strong>Instruction:</strong> {selectedOrder.notes}
                            </div>
                          )}
                        </div>

                        {/* Items listed */}
                        <div className="border-y border-slate-100 py-4 space-y-2">
                          <span className="text-[10px] text-slate-400 font-extrabold uppercase block mb-1">Items list</span>
                          {selectedOrder.items.map((item, idx) => (
                            <div key={idx} className="flex justify-between items-center text-xs font-bold text-slate-700">
                              <span className="flex items-center gap-1.5">
                                <ProductGraphic productId={item.product.id} size="sm" />
                                <span>{item.product.name} × {item.quantity}</span>
                              </span>
                              <span className="text-slate-900">GHS {item.quantity * item.product.price}</span>
                            </div>
                          ))}
                          <div className="flex justify-between items-center text-sm font-extrabold text-blue-950 pt-2 border-t border-slate-50">
                            <span>Total Billing</span>
                            <span>GHS {selectedOrder.total}</span>
                          </div>
                        </div>

                        {/* Order status controls */}
                        <div className="space-y-3">
                          <span className="text-[10px] text-slate-400 font-extrabold uppercase block">Status Transitions</span>

                          <div className="grid grid-cols-2 gap-2">
                            <button
                              onClick={() => toggleOrderPayment(selectedOrder.id)}
                              className={`py-2 rounded-xl text-[10px] font-extrabold uppercase border transition-all cursor-pointer ${
                                selectedOrder.paymentStatus === 'Paid'
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-250'
                                  : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'
                              }`}
                            >
                              💵 {selectedOrder.paymentStatus === 'Paid' ? 'Payment: Paid' : 'Payment: Unpaid'}
                            </button>

                            <button
                              onClick={() => {
                                const phoneNum = selectedOrder.customerPhone.startsWith('0')
                                  ? '233' + selectedOrder.customerPhone.slice(1)
                                  : selectedOrder.customerPhone;
                                const text = encodeURIComponent(`Hi ${selectedOrder.customerName}, this is Stephanie from DaaRo Water. Confirming dispatch of your water order (GHS ${selectedOrder.total}). Our rider is on the way.`);
                                window.open(`https://wa.me/${phoneNum}?text=${text}`, '_blank');
                              }}
                              className="bg-emerald-500 hover:bg-emerald-600 text-white py-2 rounded-xl text-[10px] font-extrabold uppercase flex items-center justify-center gap-1.5 cursor-pointer"
                            >
                              <MessageCircle size={12} /> Contact Client
                            </button>
                          </div>

                          <div className="space-y-1 pt-1.5 border-t border-slate-50">
                            <div className="grid grid-cols-3 gap-1">
                              <button
                                onClick={() => updateOrderStatus(selectedOrder.id, 'Pending')}
                                className={`py-1.5 rounded-lg text-[9px] font-extrabold uppercase cursor-pointer ${
                                  selectedOrder.status === 'Pending'
                                    ? 'bg-amber-100 text-amber-800 font-black'
                                    : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                                }`}
                              >
                                Pending
                              </button>
                              <button
                                onClick={() => updateOrderStatus(selectedOrder.id, 'Dispatched')}
                                className={`py-1.5 rounded-lg text-[9px] font-extrabold uppercase cursor-pointer ${
                                  selectedOrder.status === 'Dispatched'
                                    ? 'bg-blue-100 text-blue-800 font-black'
                                    : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                                }`}
                              >
                                Dispatch
                              </button>
                              <button
                                onClick={() => updateOrderStatus(selectedOrder.id, 'Completed')}
                                className={`py-1.5 rounded-lg text-[9px] font-extrabold uppercase cursor-pointer ${
                                  selectedOrder.status === 'Completed'
                                    ? 'bg-emerald-100 text-emerald-800 font-black'
                                    : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                                }`}
                              >
                                Complete
                              </button>
                            </div>
                            <button
                              onClick={() => updateOrderStatus(selectedOrder.id, 'Cancelled')}
                              className={`w-full py-1.5 rounded-lg text-[9px] font-extrabold uppercase cursor-pointer ${
                                selectedOrder.status === 'Cancelled'
                                  ? 'bg-red-100 text-red-800 font-black'
                                  : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                              }`}
                            >
                              Cancel Order Request
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-white rounded-2xl border border-slate-200/60 p-8 shadow-sm text-center text-slate-400 font-semibold text-sm">
                        Select an order from the ledger table to access details and manage dispatch stages.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* INVENTORY BOARD TAB */}
            {adminTab === 'inventory' && (
              <div className="space-y-6 animate-fadeUp">
                <div>
                  <h2 className="text-2xl font-black text-blue-950 tracking-tight font-['Plus_Jakarta_Sans',sans-serif]">Inventory Control</h2>
                  <p className="text-xs md:text-sm text-slate-500">Manage available stocks of DaaRo water varieties and trigger restock thresholds.</p>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200/60 shadow-xs overflow-hidden">
                  <div className="p-4 bg-slate-50/50 border-b border-slate-150 flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-500 uppercase">Stock Levels Status</span>
                    <span className="text-xs font-extrabold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                      {inventory.length} Product Classes
                    </span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs font-semibold">
                      <thead>
                        <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider bg-slate-50/20">
                          <th className="p-4">Water Package</th>
                          <th className="p-4">Package Unit Size</th>
                          <th className="p-4">Current Stock</th>
                          <th className="p-4">Minimum Safety level</th>
                          <th className="p-4 text-center">Status</th>
                          <th className="p-4 text-right">Edit Stock</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {inventory.map((inv) => {
                          const isLow = inv.stockCount < inv.minSafetyLevel;
                          return (
                            <tr key={inv.productId} className="text-slate-700">
                              <td className="p-4 flex items-center gap-3">
                                <ProductGraphic productId={inv.productId} size="sm" />
                                <div>
                                  <span className="font-extrabold text-blue-950 block">{inv.productName}</span>
                                  <span className="text-[10px] text-slate-400 block">{inv.productId}</span>
                                </div>
                              </td>
                              <td className="p-4 text-slate-500 font-bold">{inv.size}</td>
                              <td className="p-4 font-extrabold">
                                {editingInventoryId === inv.productId ? (
                                  <input
                                    type="number"
                                    value={editingStockVal}
                                    onChange={(e) => setEditingStockVal(Number(e.target.value))}
                                    className="w-20 px-2 py-1 border-2 border-blue-400 rounded-md focus:outline-none"
                                  />
                                ) : (
                                  <span className={`text-sm ${isLow ? 'text-red-600 font-black' : 'text-slate-900'}`}>
                                    {inv.stockCount} units
                                  </span>
                                )}
                              </td>
                              <td className="p-4 font-mono font-bold text-slate-500">{inv.minSafetyLevel} units</td>
                              <td className="p-4 text-center">
                                {isLow ? (
                                  <span className="bg-red-50 text-red-600 border border-red-200 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase">
                                    Low Stock Warning
                                  </span>
                                ) : (
                                  <span className="bg-emerald-50 text-emerald-600 border border-emerald-250 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase">
                                    Healthy Supply
                                  </span>
                                )}
                              </td>
                              <td className="p-4 text-right">
                                {editingInventoryId === inv.productId ? (
                                  <div className="flex gap-1.5 justify-end">
                                    <button
                                      onClick={() => saveInventoryStock(inv.productId)}
                                      className="bg-blue-600 text-white px-2.5 py-1 rounded-lg hover:bg-blue-700 transition-all font-bold text-[11px] cursor-pointer"
                                    >
                                      Save
                                    </button>
                                    <button
                                      onClick={() => setEditingInventoryId(null)}
                                      className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1 rounded-lg transition-all font-bold text-[11px] cursor-pointer"
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                ) : (
                                  <button
                                    onClick={() => {
                                      setEditingInventoryId(inv.productId);
                                      setEditingStockVal(inv.stockCount);
                                    }}
                                    className="bg-slate-100 hover:bg-slate-200 text-blue-950 px-3 py-1.5 rounded-lg transition-all font-bold text-[11px] cursor-pointer border border-slate-200"
                                  >
                                    Modify Level
                                  </button>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ROUTING MAP TAB */}
            {adminTab === 'map' && (
              <div className="space-y-6 animate-fadeUp">
                <div>
                  <h2 className="text-2xl font-black text-blue-950 tracking-tight font-['Plus_Jakarta_Sans',sans-serif]">Greater Accra Distribution Routes</h2>
                  <p className="text-xs md:text-sm text-slate-500">Interactive geographic visualization of active delivery areas and counts.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                  {/* Interactive SVG Map */}
                  <div className="bg-white rounded-2xl border border-slate-200/60 p-5 shadow-xs md:col-span-8 flex flex-col items-center">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-4 self-start">Interactive Region Map</span>

                    {/* SVG graphic */}
                    <div className="w-full max-w-lg aspect-square bg-blue-50/10 border border-slate-100 rounded-xl p-4 flex items-center justify-center">
                      <svg viewBox="0 0 400 400" className="w-full h-full select-none">
                        {/* Map Grid background lines */}
                        <line x1="50" y1="0" x2="50" y2="400" stroke="#f1f5f9" strokeWidth="1" />
                        <line x1="150" y1="0" x2="150" y2="400" stroke="#f1f5f9" strokeWidth="1" />
                        <line x1="250" y1="0" x2="250" y2="400" stroke="#f1f5f9" strokeWidth="1" />
                        <line x1="350" y1="0" x2="350" y2="400" stroke="#f1f5f9" strokeWidth="1" />
                        <line x1="0" y1="50" x2="400" y2="50" stroke="#f1f5f9" strokeWidth="1" />
                        <line x1="0" y1="150" x2="400" y2="150" stroke="#f1f5f9" strokeWidth="1" />
                        <line x1="0" y1="250" x2="400" y2="250" stroke="#f1f5f9" strokeWidth="1" />
                        <line x1="0" y1="350" x2="400" y2="350" stroke="#f1f5f9" strokeWidth="1" />

                        {/* Main routes lines */}
                        <path d="M 200 400 Q 180 200 350 50" fill="none" stroke="#cbd5e1" strokeWidth="6" strokeLinecap="round" strokeDasharray="5,5" />
                        <text x="320" y="40" fontSize="10" fontWeight="bold" fill="#64748b" textAnchor="middle">Dodowa / Begoro Hwy</text>

                        {/* Zone 1: Oyibi/Dodowa */}
                        <g
                          onClick={() => setSelectedMapZone(selectedMapZone === 'oyibi' ? null : 'oyibi')}
                          className="cursor-pointer group"
                        >
                          <circle
                            cx="280"
                            cy="120"
                            r={selectedMapZone === 'oyibi' ? '40' : '32'}
                            fill={zoneStats.oyibi.active > 0 ? 'rgba(245,158,11,.15)' : 'rgba(148,163,184,.1)'}
                            stroke={selectedMapZone === 'oyibi' ? '#f59e0b' : '#cbd5e1'}
                            strokeWidth={selectedMapZone === 'oyibi' ? '3' : '1.5'}
                            className="transition-all duration-300 group-hover:scale-105"
                          />
                          <circle cx="280" cy="120" r="6" fill={zoneStats.oyibi.active > 0 ? '#f59e0b' : '#94a3b8'} />
                          <text x="280" y="150" fontSize="11" fontWeight="bold" fill="#1e3a8a" textAnchor="middle">Oyibi &amp; Dodowa</text>
                        </g>

                        {/* Zone 2: Madina/Adenta */}
                        <g
                          onClick={() => setSelectedMapZone(selectedMapZone === 'madina' ? null : 'madina')}
                          className="cursor-pointer group"
                        >
                          <circle
                            cx="190"
                            cy="190"
                            r={selectedMapZone === 'madina' ? '40' : '32'}
                            fill={zoneStats.madina.active > 0 ? 'rgba(245,158,11,.15)' : 'rgba(148,163,184,.1)'}
                            stroke={selectedMapZone === 'madina' ? '#f59e0b' : '#cbd5e1'}
                            strokeWidth={selectedMapZone === 'madina' ? '3' : '1.5'}
                            className="transition-all duration-300 group-hover:scale-105"
                          />
                          <circle cx="190" cy="190" r="6" fill={zoneStats.madina.active > 0 ? '#f59e0b' : '#94a3b8'} />
                          <text x="190" y="222" fontSize="11" fontWeight="bold" fill="#1e3a8a" textAnchor="middle">Madina / Adenta</text>
                        </g>

                        {/* Zone 3: East Legon */}
                        <g
                          onClick={() => setSelectedMapZone(selectedMapZone === 'east-legon' ? null : 'east-legon')}
                          className="cursor-pointer group"
                        >
                          <circle
                            cx="230"
                            cy="290"
                            r={selectedMapZone === 'east-legon' ? '40' : '32'}
                            fill={zoneStats['east-legon'].active > 0 ? 'rgba(245,158,11,.15)' : 'rgba(148,163,184,.1)'}
                            stroke={selectedMapZone === 'east-legon' ? '#f59e0b' : '#cbd5e1'}
                            strokeWidth={selectedMapZone === 'east-legon' ? '3' : '1.5'}
                            className="transition-all duration-300 group-hover:scale-105"
                          />
                          <circle cx="230" cy="290" r="6" fill={zoneStats['east-legon'].active > 0 ? '#f59e0b' : '#94a3b8'} />
                          <text x="230" y="322" fontSize="11" fontWeight="bold" fill="#1e3a8a" textAnchor="middle">East Legon</text>
                        </g>

                        {/* Zone 4: Legon Campus */}
                        <g
                          onClick={() => setSelectedMapZone(selectedMapZone === 'legon' ? null : 'legon')}
                          className="cursor-pointer group"
                        >
                          <circle
                            cx="130"
                            cy="270"
                            r={selectedMapZone === 'legon' ? '40' : '32'}
                            fill={zoneStats.legon.active > 0 ? 'rgba(245,158,11,.15)' : 'rgba(148,163,184,.1)'}
                            stroke={selectedMapZone === 'legon' ? '#f59e0b' : '#cbd5e1'}
                            strokeWidth={selectedMapZone === 'legon' ? '3' : '1.5'}
                            className="transition-all duration-300 group-hover:scale-105"
                          />
                          <circle cx="130" cy="270" r="6" fill={zoneStats.legon.active > 0 ? '#f59e0b' : '#94a3b8'} />
                          <text x="130" y="302" fontSize="11" fontWeight="bold" fill="#1e3a8a" textAnchor="middle">Legon Campus</text>
                        </g>
                      </svg>
                    </div>
                  </div>

                  {/* Route Status Summary */}
                  <div className="md:col-span-4 space-y-4">
                    {selectedMapZone ? (
                      <div className="bg-white rounded-2xl border border-slate-200/60 p-5 shadow-xs space-y-4 animate-fadeUp">
                        <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                          <h4 className="font-extrabold text-base text-blue-950">
                            📍 {zoneStats[selectedMapZone as keyof typeof zoneStats].name}
                          </h4>
                          <button
                            onClick={() => setSelectedMapZone(null)}
                            className="text-slate-400 hover:text-slate-600 cursor-pointer"
                          >
                            <X size={16} />
                          </button>
                        </div>

                        <div className="space-y-3 text-xs font-semibold">
                          <div className="flex justify-between bg-amber-50/50 p-2.5 rounded-xl border border-amber-100">
                            <span className="text-slate-500">Active Shipments:</span>
                            <span className="text-amber-700 font-extrabold">
                              {zoneStats[selectedMapZone as keyof typeof zoneStats].active} orders
                            </span>
                          </div>

                          <div className="flex justify-between bg-emerald-50/30 p-2.5 rounded-xl border border-emerald-100">
                            <span className="text-slate-500">Completed Orders:</span>
                            <span className="text-emerald-700 font-extrabold">
                              {zoneStats[selectedMapZone as keyof typeof zoneStats].completed} orders
                            </span>
                          </div>
                        </div>

                        {/* Listed Orders in this Zone */}
                        <div className="space-y-2 border-t border-slate-100 pt-4">
                          <span className="text-[10px] font-extrabold text-slate-400 uppercase block">Local Client Deliveries</span>

                          <div className="space-y-1.5 max-h-40 overflow-y-auto">
                            {orders.filter((o) => {
                              const zoneMatches = {
                                'east-legon': o.deliveryAddress.toLowerCase().includes('east legon'),
                                'legon': o.deliveryAddress.toLowerCase().includes('legon') && !o.deliveryAddress.toLowerCase().includes('east legon'),
                                'madina': o.deliveryAddress.toLowerCase().includes('madina') || o.deliveryAddress.toLowerCase().includes('adenta'),
                                'oyibi': o.deliveryAddress.toLowerCase().includes('oyibi') || o.deliveryAddress.toLowerCase().includes('dodowa'),
                              };
                              return zoneMatches[selectedMapZone as keyof typeof zoneMatches];
                            }).map((o) => (
                              <div
                                key={o.id}
                                onClick={() => {
                                  setAdminTab('orders');
                                  setSelectedOrder(o);
                                }}
                                className="p-2 border border-slate-100 hover:border-blue-200 bg-slate-50/50 rounded-lg flex justify-between items-center cursor-pointer transition-all"
                              >
                                <div className="text-[10px]">
                                  <span className="font-bold text-blue-950 block">{o.customerName}</span>
                                  <span className="text-slate-400 font-mono text-[9px]">{o.id}</span>
                                </div>
                                <span className={`px-2 py-0.5 rounded-full text-[8px] font-extrabold uppercase ${
                                  o.status === 'Completed' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                                }`}>
                                  {o.status}
                                </span>
                              </div>
                            ))}

                            {orders.filter((o) => {
                              const zoneMatches = {
                                'east-legon': o.deliveryAddress.toLowerCase().includes('east legon'),
                                'legon': o.deliveryAddress.toLowerCase().includes('legon') && !o.deliveryAddress.toLowerCase().includes('east legon'),
                                'madina': o.deliveryAddress.toLowerCase().includes('madina') || o.deliveryAddress.toLowerCase().includes('adenta'),
                                'oyibi': o.deliveryAddress.toLowerCase().includes('oyibi') || o.deliveryAddress.toLowerCase().includes('dodowa'),
                              };
                              return zoneMatches[selectedMapZone as keyof typeof zoneMatches];
                            }).length === 0 && (
                              <span className="text-[10px] text-slate-400 font-semibold block italic text-center py-4">No active or historical orders logged.</span>
                            )}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-white rounded-2xl border border-slate-200/60 p-8 shadow-sm text-center text-slate-400 font-semibold text-sm">
                        Click on any region node on the map to review active drop-offs and dispatch metrics.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* SETTINGS / SYSTEM MAINTENANCE TAB */}
            {adminTab === 'settings' && (
              <div className="space-y-6 animate-fadeUp">
                <div>
                  <h2 className="text-2xl font-black text-blue-950 tracking-tight font-['Plus_Jakarta_Sans',sans-serif]">System Maintenance</h2>
                  <p className="text-xs md:text-sm text-slate-500">Configure portal database backups, wipe client files, and maintain local diagnostics.</p>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200/60 p-6 shadow-xs space-y-6">
                  {/* DB Exports */}
                  <div className="border-b border-slate-100 pb-5">
                    <h4 className="font-extrabold text-sm text-blue-950 mb-1 flex items-center gap-1.5">
                      📥 JSON Database Export
                    </h4>
                    <p className="text-xs text-slate-500 max-w-xl mb-4 leading-relaxed">
                      Download the complete offline client logs, sachet &amp; bottle sales histories, and local distributor rosters in a raw JSON file for backup.
                    </p>
                    <button
                      onClick={exportData}
                      className="bg-blue-950 hover:bg-blue-900 text-white text-xs font-bold px-4 py-2.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      Export Database JSON
                    </button>
                  </div>

                  {/* Reset Defaults */}
                  <div>
                    <h4 className="font-extrabold text-sm text-red-700 mb-1 flex items-center gap-1.5">
                      ⚠️ Reset Database state
                    </h4>
                    <p className="text-xs text-slate-500 max-w-xl mb-4 leading-relaxed">
                      Wipes all custom orders submitted on this browser, restores the factory mock orders and initial inventory counts back to defaults. This action is irreversible.
                    </p>
                    <button
                      onClick={resetToDefaults}
                      className="bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 text-xs font-bold px-4 py-2.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      Reset Local Database
                    </button>
                  </div>
                </div>
              </div>
            )}
          </section>
        </main>
      )}

      {/* FOOTER */}
      <footer className="bg-slate-900 text-slate-400 text-center py-10 px-6 border-t border-slate-800 text-xs font-semibold mt-auto space-y-3 z-10">
        <p className="text-white font-extrabold text-sm">Stephanie's DaaRo Water Distribution Network</p>
        <p className="max-w-md mx-auto leading-relaxed">
          Authorized local logistics agent distributing{' '}
          <a href="https://daarowater.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-white underline font-bold">
            DaaRo Natural Mineral Springs
          </a>{' '}
          bottled by DAA and Sons Ltd.
        </p>
        <div className="flex gap-4 justify-center items-center font-bold text-blue-400 pt-2">
          <a href="tel:+233545111245" className="hover:text-white transition-colors">📞 Call Dispatch</a>
          <span>|</span>
          <a href={`https://wa.me/${STEPHANIE_WHATSAPP}`} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">💬 WhatsApp Stephanie</a>
        </div>
        <p className="text-[10px] opacity-40 pt-4">© 2026 Stephanie's DaaRo Water. All rights reserved.</p>
      </footer>

      {/* FLOATING ACTION BUTTON */}
      {!isAdmin && (
        <a
          href="#order-form"
          className="fixed bottom-6 right-6 w-14 h-14 bg-emerald-500 text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-transform z-50 cursor-pointer hover:shadow-xl"
          title="Place Water Order"
        >
          <MessageCircle size={26} />
        </a>
      )}

      {/* ADMIN PORTAL LOGIN MODAL */}
      {showLoginModal && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full border border-slate-200 shadow-2xl relative space-y-6">
            <button
              onClick={() => {
                setShowLoginModal(false);
                setPasscode('');
                setLoginError('');
              }}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X size={18} />
            </button>

            <div className="text-center space-y-2">
              <span className="text-3xl">🔑</span>
              <h4 className="font-extrabold text-xl text-blue-950 font-['Plus_Jakarta_Sans',sans-serif]">Portal Login</h4>
              <p className="text-xs text-slate-500">Provide the administrator credentials to access sachet &amp; bottle shipment boards.</p>
            </div>

            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  System Passcode
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-center text-slate-800 tracking-widest focus:bg-white focus:outline-none focus:border-blue-500 transition-all"
                  autoFocus
                />
                {loginError && <span className="text-xs text-red-500 font-bold mt-2 block text-center">{loginError}</span>}
              </div>

              <button
                type="submit"
                className="w-full bg-blue-950 text-white font-bold py-3.5 rounded-xl hover:bg-blue-900 transition-all active:translate-y-0.5 cursor-pointer text-sm"
              >
                Access Admin Workspace
              </button>
            </form>
            <p className="text-center text-[10px] text-slate-400 font-semibold leading-relaxed">
              Default standard passcode for university portal deployment checks is <strong>{ADMIN_PASSCODE}</strong>.
            </p>
          </div>
        </div>
      )}

      {/* Embedded Animations styles */}
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        @keyframes wave {
          0% { transform: translateX(0); }
          50% { transform: translateX(-25%); }
          100% { transform: translateX(-50%); }
        }
        @keyframes shimmer {
          0% { transform: translateX(-150%) skewX(-12deg); }
          50%, 100% { transform: translateX(250%) skewX(-12deg); }
        }
        .animate-fadeUp {
          animation: fadeUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease both;
        }
        .animate-float {
          animation: float 4s infinite ease-in-out;
        }
        .animate-wave {
          animation: wave 12s infinite linear;
        }
        .animate-shimmer {
          animation: shimmer 4.5s infinite ease-in-out;
        }
        .z-50 { z-index: 50; }
        .z-100 { z-index: 100; }
        .pt-18 { padding-top: 4.5rem; }
      `}</style>
    </div>
  );
};

export default App;

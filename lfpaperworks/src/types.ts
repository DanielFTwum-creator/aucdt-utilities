export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  basePrice: number;
  images: string[];
  category: string;
  variants?: ProductVariant[];
  requiresCustomInput: boolean;
  customInputLabel?: string;
  dimensions?: string;
  material?: string;
  estimatedShipping?: string;
  featured?: boolean;
}

export interface ProductVariant {
  id: string;
  label: string;
  value: string | number;
  priceOverride?: number;
}

export interface CartItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  selectedVariant?: ProductVariant;
  customText?: string;
  imageUrl: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  action: string;
  actor: string;
  resource: string;
  ipAddress?: string;
}

export interface Testimonial {
  id: string;
  quote: string;
  customerName: string;
  productPurchased: string;
  date?: string;
}

export interface Exhibition {
  id: string;
  title: string;
  year: string;
  date?: string;
  venue: string;
  description: string;
}

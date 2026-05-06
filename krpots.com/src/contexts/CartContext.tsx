import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  ReactNode,
} from "react";
import type { Piece } from "../data/pieces";

const PRICES_STORAGE_KEY = "krpots_prices";

/**
 * Returns the effective price (in cents) for a piece.
 * Checks localStorage `krpots_prices[piece.sku]` first,
 * then falls back to `piece.price`, then to 5000 cents ($50.00).
 */
export function getPiecePrice(piece: Piece): number {
  try {
    const raw = localStorage.getItem(PRICES_STORAGE_KEY);
    if (raw) {
      const stored = JSON.parse(raw) as Record<string, number>;
      if (typeof stored[piece.sku] === "number") {
        return stored[piece.sku];
      }
    }
  } catch {
    // ignore parse errors
  }
  return piece.price ?? 5000;
}

export interface CartItem {
  piece: Piece;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (piece: Piece) => void;
  removeItem: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  clearCart: () => void;
  total: number;
  count: number;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  checkout: () => Promise<void>;
  checkoutLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const STORAGE_KEY = "krpots_cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? (JSON.parse(saved) as CartItem[]) : [];
    } catch {
      return [];
    }
  });
  const [isOpen, setIsOpen] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  // Persist to localStorage whenever items change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = useCallback((piece: Piece) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.piece.id === piece.id);
      if (existing) {
        return prev.map((i) =>
          i.piece.id === piece.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { piece, quantity: 1 }];
    });
    setIsOpen(true);
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.piece.id !== id));
  }, []);

  const updateQty = useCallback((id: string, qty: number) => {
    if (qty <= 0) {
      setItems((prev) => prev.filter((i) => i.piece.id !== id));
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i.piece.id === id ? { ...i, quantity: qty } : i))
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  const total = useMemo(
    () =>
      items.reduce(
        (sum, item) => sum + getPiecePrice(item.piece) * item.quantity,
        0
      ),
    [items]
  );

  const count = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

  const checkout = useCallback(async () => {
    setCheckoutLoading(true);
    try {
      // Build line items with effective prices (localStorage overrides take precedence)
      const lineItems = items.map((item) => ({
        pieceId: item.piece.id,
        sku: item.piece.sku,
        title: item.piece.title,
        priceInCents: getPiecePrice(item.piece),
        quantity: item.quantity,
      }));
      const res = await fetch("/api/checkout/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: lineItems }),
      });
      if (!res.ok) {
        const err = await res.text();
        throw new Error(err || "Checkout failed");
      }
      const data = (await res.json()) as { url: string };
      window.location.href = data.url;
    } finally {
      setCheckoutLoading(false);
    }
  }, [items]);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQty,
        clearCart,
        total,
        count,
        isOpen,
        openCart,
        closeCart,
        checkout,
        checkoutLoading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCartContext() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCartContext must be used within CartProvider");
  return ctx;
}

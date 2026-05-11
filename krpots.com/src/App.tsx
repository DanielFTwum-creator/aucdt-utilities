import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Collection from "./pages/Collection";
import Timeline from "./pages/Timeline";
import Artist from "./pages/Artist";
import Contact from "./pages/Contact";
import Admin from "./pages/Admin";
import CheckoutSuccess from "./pages/CheckoutSuccess";
import CheckoutCancel from "./pages/CheckoutCancel";
import { CartProvider } from "./contexts/CartContext";

export default function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col bg-theme-bg text-theme-text font-cormorant relative shadow-[0_30px_60px_rgba(0,0,0,0.9)] overflow-x-hidden transition-colors duration-300">
          {/* Top Gold Accent Bar */}
          <div className="h-1 w-full bg-gold shrink-0 fixed top-0 z-50" aria-hidden="true" />

          {/* Ghost Watermark */}
          <div
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[850px] font-playfair font-black text-transparent pointer-events-none select-none z-0"
            style={{ WebkitTextStroke: '2px rgba(200,168,75,0.08)', lineHeight: 0.8 }}
            aria-hidden="true"
          >
            K
          </div>

          <Navbar />

          <main className="flex-1 relative z-10 flex flex-col" id="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/collection" element={<Collection />} />
              <Route path="/timeline" element={<Timeline />} />
              <Route path="/artist" element={<Artist />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/admin/*" element={<Admin />} />
              <Route path="/checkout/success" element={<CheckoutSuccess />} />
              <Route path="/checkout/cancel" element={<CheckoutCancel />} />
            </Routes>
          </main>

          <Footer />
        </div>
      </BrowserRouter>
    </CartProvider>
  );
}

import React, { useState, useMemo } from 'react';
import { products } from '../data/products';
import { CheckCircle, Phone, Plus, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { useCart } from '../context/CartContext';

const colorDots: Record<string, string> = {
  'Black':      '#1a1a1a',
  'Gold':       '#C9A84C',
  'Green':      '#2E7D32',
  'Red':        '#C0392B',
  'Customised': 'linear-gradient(135deg,#C0392B,#C9941A,#2E7D32)',
};

export function Shop() {
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [addedId, setAddedId]               = useState<string | null>(null);
  const { addToCart }                        = useCart();

  const handleAddToCart = (product: typeof products[0]) => {
    addToCart(product);
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1500);
  };

  const colors = useMemo(() => Array.from(new Set(products.flatMap(p => p.colors))).sort(), []);

  const filteredProducts = useMemo(() =>
    products.filter(p =>
      selectedColors.length === 0 || p.colors.some(c => selectedColors.includes(c))
    ), [selectedColors]);

  const toggle = (value: string) =>
    setSelectedColors(prev =>
      prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]
    );

  return (
    <div>

      {/* ── HERO ─────────────────────────────────────────── */}
      <section
        className="hero-grain relative overflow-hidden"
        style={{ background: '#3d4a35', paddingTop: '64px' }}
      >
        <div
          style={{
            maxWidth: '1400px',
            margin: '0 auto',
            padding: 'clamp(3.5rem, 7vw, 6rem) clamp(1.5rem, 5vw, 4rem) clamp(2.5rem, 5vw, 4rem)',
            position: 'relative',
            zIndex: 1,
          }}
        >
          <div className="flex items-center gap-2 mb-4">
            <div style={{ width: '24px', height: '2px', background: '#E87722', flexShrink: 0 }} />
            <span className="font-sans text-[11px] font-medium uppercase tracking-[0.16em]" style={{ color: '#E87722' }}>
              Handcrafted in Ghana
            </span>
          </div>

          <h1
            className="font-serif font-black text-white leading-[1.0]"
            style={{ fontSize: 'clamp(2.8rem, 6vw, 5rem)', letterSpacing: '-0.02em', maxWidth: '700px' }}
          >
            Our <em style={{ fontStyle: 'italic', color: '#E87722' }}>Collections</em>
          </h1>

          <p
            className="font-sans mt-5"
            style={{
              fontSize: 'clamp(14px, 1.4vw, 16px)',
              fontWeight: 300,
              color: 'rgba(255,255,255,0.65)',
              maxWidth: '520px',
              lineHeight: 1.7,
            }}
          >
            Premium customised kente stoles — tailored to your colours, logo, and story.
            Every piece is designed to embody achievement, identity, and cultural pride.
          </p>
        </div>
        <div className="kente-strip" style={{ position: 'relative', zIndex: 1 }} />
      </section>

      {/* ── MAIN CONTENT ─────────────────────────────────── */}
      <section style={{ background: '#F5F0E8', padding: 'clamp(3rem, 6vw, 5rem) clamp(1.5rem, 5vw, 4rem)' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', gap: '3rem', alignItems: 'flex-start' }} className="shop-layout">

          {/* ── SIDEBAR ──────────────────────────────────── */}
          <aside style={{ width: '240px', flexShrink: 0 }} className="shop-sidebar">

            {/* Filter panel */}
            <div
              style={{
                background: '#ffffff',
                border: '1px solid rgba(61,74,53,0.12)',
                borderRadius: '4px',
                padding: '1.5rem',
                marginBottom: '1.5rem',
              }}
            >
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-serif font-bold" style={{ color: '#1a1a1a', fontSize: '1rem' }}>Filter</h3>
                {selectedColors.length > 0 && (
                  <button
                    onClick={() => setSelectedColors([])}
                    className="flex items-center gap-1 font-sans text-xs transition-colors"
                    style={{ color: '#C0392B' }}
                    onMouseEnter={e => (e.currentTarget.style.opacity = '0.7')}
                    onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
                  >
                    <X className="w-3 h-3" /> Clear
                  </button>
                )}
              </div>

              <p className="font-sans text-[11px] font-medium uppercase tracking-[0.14em] mb-3" style={{ color: 'rgba(26,26,26,0.4)' }}>
                Colour Accent
              </p>

              <div className="flex flex-wrap gap-2">
                {colors.map(color => {
                  const isActive = selectedColors.includes(color);
                  return (
                    <button
                      key={color}
                      title={color}
                      onClick={() => toggle(color)}
                      className="relative group"
                      style={{
                        width: '32px', height: '32px',
                        borderRadius: '50%',
                        border: isActive ? '2px solid #3d4a35' : '2px solid transparent',
                        outline: isActive ? 'none' : '1px solid rgba(61,74,53,0.2)',
                        outlineOffset: '1px',
                        background: colorDots[color] ?? '#ccc',
                        transform: isActive ? 'scale(1.15)' : 'scale(1)',
                        transition: 'transform 0.15s ease, border-color 0.15s ease',
                        cursor: 'pointer',
                        flexShrink: 0,
                      }}
                    >
                      {isActive && (
                        <span style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <CheckCircle className="w-4 h-4 text-white drop-shadow" />
                        </span>
                      )}
                      {/* Tooltip */}
                      <span
                        className="font-sans text-[10px] font-medium pointer-events-none"
                        style={{
                          position: 'absolute', bottom: 'calc(100% + 6px)', left: '50%',
                          transform: 'translateX(-50%)',
                          background: '#1a1a1a', color: '#fff',
                          padding: '3px 8px', borderRadius: '2px',
                          whiteSpace: 'nowrap',
                          opacity: 0,
                          transition: 'opacity 0.15s',
                        }}
                        onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
                      >
                        {color}
                      </span>
                    </button>
                  );
                })}
              </div>

              {selectedColors.length > 0 && (
                <p className="font-sans text-[11px] mt-4" style={{ color: 'rgba(26,26,26,0.45)' }}>
                  {filteredProducts.length} design{filteredProducts.length !== 1 ? 's' : ''} match
                </p>
              )}
            </div>

            {/* How to Order mini-panel */}
            <div
              style={{
                background: '#3d4a35',
                borderRadius: '4px',
                padding: '1.5rem',
                marginBottom: '1.5rem',
              }}
            >
              <div className="flex items-center gap-2 mb-4">
                <div style={{ width: '16px', height: '2px', background: '#E87722' }} />
                <span className="font-sans text-[10px] font-medium uppercase tracking-[0.14em]" style={{ color: '#E87722' }}>
                  How to Order
                </span>
              </div>

              <ol className="space-y-3">
                {[
                  'Settle on the design you prefer and share',
                  'Send inscription details per preference',
                  'Make 70% payment and confirm',
                  'Confirm mock up design',
                  'Wait for product to be ready',
                  'Make balance payment of 30% and confirm',
                ].map((step, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span
                      className="font-sans font-bold text-[10px] flex-shrink-0 flex items-center justify-center rounded-full"
                      style={{
                        width: '18px', height: '18px',
                        background: '#E87722', color: '#1a1a1a',
                        marginTop: '1px',
                      }}
                    >
                      {i + 1}
                    </span>
                    <span className="font-sans text-[12px] leading-snug" style={{ color: 'rgba(255,255,255,0.7)', fontWeight: 300 }}>
                      {step}
                    </span>
                  </li>
                ))}
              </ol>

              <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)', margin: '1.25rem 0' }} />

              <a
                href="tel:0247139986"
                className="flex items-center gap-2 font-sans text-xs font-medium transition-colors"
                style={{ color: '#E87722' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                onMouseLeave={e => (e.currentTarget.style.color = '#E87722')}
              >
                <Phone className="w-3.5 h-3.5" /> 0247 139 986
              </a>
            </div>

            {/* NB note */}
            <p className="font-sans text-[11px] italic" style={{ color: 'rgba(26,26,26,0.5)', lineHeight: 1.6 }}>
              NB: Product Completion takes Minimum a week.
            </p>
          </aside>

          {/* ── PRODUCT GRID ─────────────────────────────── */}
          <div style={{ flex: 1, minWidth: 0 }}>

            {/* Count bar */}
            <div className="flex items-center justify-between mb-8">
              <p className="font-sans text-sm" style={{ color: 'rgba(26,26,26,0.45)', fontWeight: 400 }}>
                Showing <strong style={{ color: '#1a1a1a' }}>{filteredProducts.length}</strong> design{filteredProducts.length !== 1 ? 's' : ''}
              </p>
              {selectedColors.length > 0 && (
                <button
                  onClick={() => setSelectedColors([])}
                  className="font-sans text-xs flex items-center gap-1 transition-colors"
                  style={{ color: '#C0392B' }}
                >
                  <X className="w-3 h-3" /> Clear filters
                </button>
              )}
            </div>

            {filteredProducts.length === 0 ? (
              <div
                className="text-center py-20 font-sans"
                style={{ border: '1px dashed rgba(61,74,53,0.25)', borderRadius: '4px' }}
              >
                <p style={{ color: 'rgba(26,26,26,0.45)' }}>No products match your filters.</p>
                <button
                  onClick={() => setSelectedColors([])}
                  className="mt-4 font-medium text-sm transition-colors"
                  style={{ color: '#3d4a35' }}
                >
                  Clear filters
                </button>
              </div>
            ) : (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                  gap: '1.25rem',
                }}
              >
                <AnimatePresence>
                  {filteredProducts.map((product, idx) => (
                    <motion.div
                      key={product.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.97 }}
                      transition={{ delay: Math.min(idx, 5) * 0.07, ease: [0.16, 1, 0.3, 1] }}
                      className="group"
                      style={{
                        background: '#ffffff',
                        border: '1px solid rgba(61,74,53,0.14)',
                        borderRadius: '4px',
                        overflow: 'hidden',
                        display: 'flex',
                        flexDirection: 'column',
                        cursor: 'default',
                        transition: 'transform 0.35s cubic-bezier(0.16,1,0.3,1), box-shadow 0.35s cubic-bezier(0.16,1,0.3,1), border-color 0.2s',
                      }}
                      onMouseEnter={e => {
                        const el = e.currentTarget as HTMLElement;
                        el.style.transform = 'translateY(-5px)';
                        el.style.boxShadow = '0 16px 48px rgba(61,74,53,0.14)';
                        el.style.borderColor = 'rgba(61,74,53,0.32)';
                      }}
                      onMouseLeave={e => {
                        const el = e.currentTarget as HTMLElement;
                        el.style.transform = '';
                        el.style.boxShadow = '';
                        el.style.borderColor = 'rgba(61,74,53,0.14)';
                      }}
                    >
                      {/* Image */}
                      <div style={{ aspectRatio: '4/3', overflow: 'hidden', background: '#e8e3da', position: 'relative' }}>
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover"
                          style={{ transition: 'transform 0.45s cubic-bezier(0.16,1,0.3,1)' }}
                          onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.05)')}
                          onMouseLeave={e => (e.currentTarget.style.transform = '')}
                          referrerPolicy="no-referrer"
                        />
                        {/* Category badge */}
                        <div
                          className="font-sans font-bold text-[9px] uppercase tracking-[0.1em]"
                          style={{
                            position: 'absolute', top: '10px', left: '10px',
                            background: '#3d4a35', color: '#E87722',
                            padding: '3px 9px', borderRadius: '2px',
                          }}
                        >
                          {product.category}
                        </div>
                      </div>

                      {/* Body */}
                      <div style={{ padding: '1.25rem 1.25rem 1.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                        <h3
                          className="font-serif font-bold leading-tight mb-1"
                          style={{ fontSize: 'clamp(16px, 1.8vw, 19px)', color: '#1a1a1a', letterSpacing: '-0.01em' }}
                        >
                          {product.name}
                        </h3>

                        <p
                          className="font-sans italic mb-3"
                          style={{ fontSize: '13px', color: 'rgba(26,26,26,0.45)', fontWeight: 300 }}
                        >
                          {product.tagline}
                        </p>

                        <p
                          className="font-sans leading-relaxed mb-4"
                          style={{ fontSize: '13px', fontWeight: 300, color: 'rgba(26,26,26,0.6)', lineHeight: 1.6 }}
                        >
                          {product.description}
                        </p>

                        {/* Features */}
                        <ul className="space-y-1.5 mb-5">
                          {product.features.map((f, i) => (
                            <li key={i} className="flex items-center gap-2">
                              <CheckCircle className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#E87722' }} />
                              <span className="font-sans text-xs" style={{ color: 'rgba(26,26,26,0.6)', fontWeight: 300 }}>{f}</span>
                            </li>
                          ))}
                        </ul>

                        {/* Footer */}
                        <div
                          className="mt-auto flex items-center justify-between pt-4"
                          style={{ borderTop: '1px solid rgba(61,74,53,0.1)' }}
                        >
                          <span className="font-serif font-bold" style={{ fontSize: '1.5rem', color: '#E87722', letterSpacing: '-0.01em' }}>
                            ₵{product.price}
                          </span>
                          <button
                            onClick={() => handleAddToCart(product)}
                            className={cn(
                              'flex items-center gap-2 font-sans font-medium text-[13px] uppercase tracking-[0.06em] transition-all',
                              addedId === product.id ? '' : ''
                            )}
                            style={{
                              padding: '9px 18px',
                              borderRadius: '3px',
                              background: addedId === product.id ? '#E87722' : '#3d4a35',
                              color: '#ffffff',
                              border: 'none',
                              cursor: 'pointer',
                              transform: addedId === product.id ? 'scale(0.95)' : 'scale(1)',
                              transition: 'background 0.2s, transform 0.15s',
                            }}
                            onMouseEnter={e => {
                              if (addedId !== product.id)
                                (e.currentTarget as HTMLButtonElement).style.background = '#2c3828';
                            }}
                            onMouseLeave={e => {
                              if (addedId !== product.id)
                                (e.currentTarget as HTMLButtonElement).style.background = '#3d4a35';
                            }}
                          >
                            {addedId === product.id ? (
                              <><CheckCircle className="w-4 h-4" /> Added!</>
                            ) : (
                              <><Plus className="w-4 h-4" /> Order</>
                            )}
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── PAYMENT BANNER ───────────────────────────────── */}
      <section style={{ background: '#1a1a1a', padding: 'clamp(3.5rem, 7vw, 6rem) clamp(1.5rem, 5vw, 4rem)' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>

          <div className="flex items-center justify-center gap-2 mb-5">
            <div style={{ width: '24px', height: '2px', background: '#E87722' }} />
            <span className="font-sans text-[11px] font-medium uppercase tracking-[0.16em]" style={{ color: '#E87722' }}>
              Payment Options
            </span>
            <div style={{ width: '24px', height: '2px', background: '#E87722' }} />
          </div>

          <h2
            className="font-serif font-bold text-white mb-3"
            style={{ fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', letterSpacing: '-0.02em' }}
          >
            We Make Paying <em style={{ fontStyle: 'italic', color: '#E87722' }}>Easy</em>
          </h2>

          <p className="font-sans mb-8" style={{ fontSize: '15px', fontWeight: 300, color: 'rgba(255,255,255,0.55)' }}>
            MTN Mobile Money · Vodafone Cash · GTBank Transfer · Cheque
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1px',
              background: 'rgba(255,255,255,0.07)',
              borderRadius: '4px',
              overflow: 'hidden',
              marginBottom: '2rem',
            }}
          >
            {[
              { label: 'MoMo Numbers', value: '0555 043 118\n0501 589 811' },
              { label: 'Account Name', value: 'Sharon Akua Begah' },
              { label: 'Account Number', value: '226103621140' },
              { label: 'Branch', value: 'Ashaley Botwe' },
            ].map(({ label, value }) => (
              <div key={label} style={{ background: '#252525', padding: '1.5rem' }}>
                <p className="font-sans text-[10px] font-medium uppercase tracking-[0.14em] mb-2" style={{ color: 'rgba(255,255,255,0.35)' }}>
                  {label}
                </p>
                <p className="font-sans font-medium" style={{ color: '#ffffff', fontSize: '14px', whiteSpace: 'pre-line', lineHeight: 1.6 }}>
                  {value}
                </p>
              </div>
            ))}
          </div>

          <p className="font-sans text-xs italic" style={{ color: 'rgba(232,119,34,0.8)' }}>
            All cheques should be written in the name of SASHMADE
          </p>
          <p className="font-sans text-xs mt-2 uppercase tracking-[0.06em]" style={{ color: 'rgba(255,255,255,0.3)' }}>
            NB: Kindly notify us before and after payment. Product Completion takes Minimum a week.
          </p>
        </div>
      </section>

    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';

const heroMedia = [
  '/images/p7_54.png',
  '/images/p7_53.png',
  '/images/p7_51.png',
  '/images/p7_49.png',
];

export function Home() {
  const [shuffledMedia, setShuffledMedia] = useState(heroMedia);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    // Randomize the media order on mount
    setShuffledMedia([...heroMedia].sort(() => Math.random() - 0.5));
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % shuffledMedia.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [shuffledMedia.length]);

  return (
    <div className="pb-20">
      {/* Hero Section */}
      <section className="hero-grain relative min-h-[92vh] overflow-hidden py-10 md:py-16" style={{ background: '#3d4a35' }}>
        <div
          className="hero-main-grid relative z-10 mx-auto grid max-w-7xl items-center gap-10 px-6 md:px-10 lg:px-16"
          style={{ gridTemplateColumns: 'minmax(0, 1.02fr) minmax(320px, 0.98fr)' }}
        >
          <div className="max-w-2xl text-white">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="mb-8 flex items-center gap-3"
            >
              <div style={{ width: '40px', height: '2px', background: '#E87722' }} />
              <span className="font-sans text-[11px] font-medium uppercase tracking-[0.28em]" style={{ color: '#E87722' }}>
                Graduate in Style
              </span>
            </motion.div>

            <h1 className="font-serif font-black leading-[0.92] tracking-[-0.04em]" style={{ fontSize: 'clamp(3.8rem, 9vw, 7.4rem)' }}>
              <motion.span
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.62, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
                className="block"
              >
                Your <span style={{ color: '#E87722', fontStyle: 'italic' }}>Journey.</span>
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.62, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                className="block"
              >
                Your Style.
              </motion.span>
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.34 }}
              className="mt-8 max-w-xl font-sans text-lg leading-relaxed md:text-[1.35rem]"
              style={{ color: 'rgba(255,255,255,0.74)', fontWeight: 300 }}
            >
              Custom kente stoles crafted for graduations, institutions, and milestone moments across Africa. Wear heritage with presence, precision, and pride.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.46 }}
              className="mt-10 flex flex-wrap items-center gap-4"
            >
              <Link
                to="/shop"
                className="inline-flex items-center gap-2.5 rounded-[4px] px-7 py-4 font-sans text-sm font-bold uppercase tracking-[0.14em] text-[#1a1a1a] transition-colors"
                style={{ background: '#E87722' }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#c96010')}
                onMouseLeave={(e) => (e.currentTarget.style.background = '#E87722')}
              >
                Shop Collections <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/about"
                className="inline-flex items-center gap-2 border-b pb-1 font-sans text-sm font-semibold tracking-[0.02em] transition-colors"
                style={{ color: 'rgba(255,255,255,0.72)', borderColor: 'rgba(255,255,255,0.2)' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.72)')}
              >
                Meet SashMade <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.58 }}
              className="mt-10 flex flex-wrap gap-8 border-t pt-6"
              style={{ borderColor: 'rgba(255,255,255,0.12)' }}
            >
              {[
                ['500+', 'Custom designs'],
                ['70%', 'Deposit to begin'],
                ['1 week', 'Minimum turnaround'],
              ].map(([value, label]) => (
                <div key={label}>
                  <div className="font-serif text-3xl font-bold leading-none" style={{ color: '#E87722' }}>{value}</div>
                  <div className="mt-1 font-sans text-[11px] uppercase tracking-[0.16em]" style={{ color: 'rgba(255,255,255,0.46)' }}>{label}</div>
                </div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="mt-12 hidden items-center gap-2 text-xs uppercase tracking-[0.18em] text-white/40 md:flex"
            >
              <ChevronDown className="scroll-cue h-4 w-4 text-[#E87722]" />
              <span>Scroll to explore</span>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96, x: 14 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.75, delay: 0.24, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full"
          >
            <div
              className="relative ml-auto grid max-w-[580px] gap-3"
              style={{ gridTemplateColumns: '1.1fr 0.9fr', gridTemplateRows: '1.1fr 0.82fr', minHeight: '620px' }}
            >
              <div
                className="absolute -left-6 -top-6 h-28 w-28 rounded-full border"
                style={{ borderColor: 'rgba(232,119,34,0.14)' }}
              />
              <div
                className="absolute -bottom-8 right-10 h-24 w-24 rounded-full border"
                style={{ borderColor: 'rgba(255,255,255,0.08)' }}
              />

              <div className="overflow-hidden rounded-[20px] shadow-2xl" style={{ gridColumn: '1 / 2', gridRow: '1 / 3' }}>
                <img
                  src={shuffledMedia[currentImageIndex]}
                  alt="SashMade featured editorial"
                  className="h-full w-full object-cover transition-transform duration-700"
                  style={{ objectPosition: 'center top' }}
                />
              </div>

              <div className="overflow-hidden rounded-[20px] border border-white/10 bg-[#2e3728] p-4 shadow-xl" style={{ gridColumn: '2 / 3', gridRow: '1 / 2' }}>
                <img
                  src="/images/p7_56.png"
                  alt="Packaged SashMade collections"
                  className="h-full w-full rounded-[14px] object-cover"
                />
              </div>

              <div
                className="rounded-[20px] border border-white/10 p-6 shadow-xl"
                style={{
                  gridColumn: '2 / 3',
                  gridRow: '2 / 3',
                  background: 'linear-gradient(180deg, rgba(14,18,12,0.92) 0%, rgba(31,38,26,0.98) 100%)',
                }}
              >
                <div className="font-sans text-[11px] uppercase tracking-[0.18em]" style={{ color: '#E87722' }}>
                  Why SashMade
                </div>
                <h2 className="mt-3 font-serif text-3xl font-bold leading-tight text-white">
                  Kente stoles with cultural weight.
                </h2>
                <p className="mt-4 font-sans text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.68)' }}>
                  Designed around your class, logo, inscription, and colors so the final piece feels earned, not generic.
                </p>
                <div className="mt-6 space-y-3">
                  {['School logo integration', 'Preferred inscription', 'Pan-African color options'].map((item) => (
                    <div key={item} className="flex items-center gap-3">
                      <span className="h-2 w-2 rounded-full" style={{ background: '#E87722' }} />
                      <span className="font-sans text-sm" style={{ color: 'rgba(255,255,255,0.84)' }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Kente strip at bottom */}
        <div className="kente-strip absolute bottom-0 left-0 right-0 z-10" />
      </section>

      {/* Mood Board */}
      <section className="py-12 px-4 md:px-10 lg:px-16" style={{ background: '#3d4a35' }}>
        <div className="max-w-7xl mx-auto">
          {/*
            Target grid (7 cells):
            [man-suit: col1 rows1-2] [heading: col2 row1] [woman-white: col3 row1] [man-blazer: col4 rows1-2]
                                     [kente-lay: col2 row2] [bags: col2b row2] [stacked: col3 row2]  [woman-blue: col4 rows1-2]

            Simplified as 12-col grid:
            col 1-3: tall portrait (2 rows)
            col 4-5: heading top / kente bottom
            col 6: bags bottom
            col 7-9: woman-white top / stacked bottom
            col 10-12: man-blazer top + woman-blue bottom (each 1 row)
          */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(12, 1fr)',
            gridTemplateRows: '1fr 1fr',
            gap: '10px',
            height: '420px',
          }}>

            {/* Man in suit — tall left */}
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }} whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }} transition={{ delay: 0.05 }}
              className="overflow-hidden rounded-lg"
              style={{ gridColumn: '1 / 4', gridRow: '1 / 3' }}
            >
              <img src="/images/p7_49.png" alt="Graduate in suit"
                className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-500" />
            </motion.div>

            {/* Heading — center top */}
            <motion.div
              initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: 0.08 }}
              className="flex flex-col justify-center pl-4"
              style={{ gridColumn: '4 / 7', gridRow: '1 / 2' }}
            >
              <h2 className="font-serif font-black text-white leading-[0.95]" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 3rem)' }}>
                MOOD-<br/>BOARD
              </h2>
              <p className="font-sans text-[11px] tracking-[0.28em] uppercase mt-3" style={{ color: '#E87722' }}>
                @ SASHMADE2024
              </p>
            </motion.div>

            {/* Woman in white dress — center-right top */}
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }} whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }} transition={{ delay: 0.1 }}
              className="overflow-hidden rounded-lg"
              style={{ gridColumn: '7 / 10', gridRow: '1 / 2' }}
            >
              <img src="/images/p7_54.png" alt="Graduate in white dress"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                style={{ objectPosition: '50% 30%' }} />
            </motion.div>

            {/* Man in blazer — far right top */}
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }} whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }} transition={{ delay: 0.12 }}
              className="overflow-hidden rounded-lg"
              style={{ gridColumn: '10 / 13', gridRow: '1 / 2' }}
            >
              <img src="/images/p7_53.png" alt="Graduate in blazer"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                style={{ objectPosition: '50% 25%' }} />
            </motion.div>

            {/* Kente flat-lay — bottom left-center */}
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }} whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }} transition={{ delay: 0.16 }}
              className="overflow-hidden rounded-lg"
              style={{ gridColumn: '4 / 6', gridRow: '2 / 3' }}
            >
              <img src="/images/p7_50.png" alt="Kente stoles on grass"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
            </motion.div>

            {/* Packaged bags — bottom center */}
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }} whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }} transition={{ delay: 0.19 }}
              className="overflow-hidden rounded-lg"
              style={{ gridColumn: '6 / 8', gridRow: '2 / 3' }}
            >
              <img src="/images/p7_56.png" alt="Packaged stoles"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
            </motion.div>

            {/* Stacked stoles — bottom center-right */}
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }} whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }} transition={{ delay: 0.22 }}
              className="overflow-hidden rounded-lg"
              style={{ gridColumn: '8 / 10', gridRow: '2 / 3' }}
            >
              <img src="/images/p7_52.png" alt="Stacked kente stoles"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
            </motion.div>

            {/* Woman in blue dress — far right bottom */}
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }} whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }} transition={{ delay: 0.25 }}
              className="overflow-hidden rounded-lg"
              style={{ gridColumn: '10 / 13', gridRow: '2 / 3' }}
            >
              <img src="/images/p7_51.png" alt="Graduate in blue dress"
                className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-500" />
            </motion.div>

          </div>
        </div>
      </section>

      {/* Marquee strip */}
      <div className="overflow-hidden py-3.5" style={{ background: '#1a1a1a', borderTop: '1px solid rgba(255,255,255,0.06)' }} aria-hidden="true">
        <div style={{ display: 'flex', width: 'max-content', animation: 'marqueeScroll 28s linear infinite' }}>
          {[...Array(4)].flatMap(() => [
            'Graduate in Style', 'Your Journey', 'Your Style',
            'Stoles That Tell Your Story', 'Pan-African Pride',
            'Handcrafted in Ghana', 'Wear Your Story', 'Class of 2025',
          ]).map((text, i) => (
            <span
              key={i}
              className="font-sans text-[11px] font-medium uppercase tracking-[0.14em] px-8 whitespace-nowrap flex items-center gap-4"
              style={{ color: 'rgba(255,255,255,0.4)' }}
            >
              <span
                className="inline-block w-[5px] h-[5px] rounded-full flex-shrink-0"
                style={{ background: ['#C0392B','#C9941A','#2E7D32'][i % 3] }}
              />
              {text}
            </span>
          ))}
        </div>
      </div>

      {/* How to Order */}
      <section style={{ background: '#1a1a1a', position: 'relative' }}>
        <div
          style={{
            padding: 'clamp(4rem, 8vw, 7rem) clamp(1.5rem, 5vw, 4rem)',
            maxWidth: '1400px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 'clamp(3rem, 6vw, 6rem)',
            alignItems: 'center',
          }}
          className="how-to-order-grid"
        >
          {/* Left — visual panel */}
          <motion.div
            initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            {/* Decorative ring */}
            <div style={{
              position: 'absolute', inset: '-16px',
              border: '1px solid rgba(232,119,34,0.12)',
              borderRadius: '8px',
              pointerEvents: 'none',
            }} />
            <div className="overflow-hidden rounded-lg shadow-2xl" style={{ aspectRatio: '4/5' }}>
              <img
                src="/images/about_flyer.png"
                alt="Get Your Kente Stole at an Affordable Price"
                className="w-full h-full object-cover"
                style={{ objectPosition: '50% 20%' }}
              />
            </div>

            {/* Floating stat badge */}
            <div style={{
              position: 'absolute', bottom: '24px', right: '-16px',
              background: '#252525',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '6px',
              padding: '12px 18px',
            }}>
              <div className="font-serif font-bold text-xl" style={{ color: '#E87722', lineHeight: 1 }}>500+</div>
              <div className="font-sans text-[10px] font-medium uppercase tracking-[0.1em] mt-1" style={{ color: 'rgba(255,255,255,0.45)' }}>Designs</div>
            </div>
          </motion.div>

          {/* Right — steps */}
          <motion.div
            initial={{ opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.65, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Eyebrow */}
            <div className="flex items-center gap-2 mb-5">
              <div style={{ width: '24px', height: '2px', background: '#E87722', flexShrink: 0 }} />
              <span className="font-sans text-[11px] font-medium uppercase tracking-[0.16em]" style={{ color: '#E87722' }}>
                The Process
              </span>
            </div>

            <h2
              className="font-serif font-black text-white leading-[1.05] mb-10"
              style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', letterSpacing: '-0.02em' }}
            >
              HOW TO PLACE<br />AN ORDER
            </h2>

            <ol className="space-y-5">
              {[
                'Settle on the design you prefer and share',
                'Send inscription details per preference',
                'Make 70% payment and confirm',
                'Confirm mock up design',
                'Kindly wait for product to be ready',
                'Make balance payment of 30% and confirm',
              ].map((step, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: 16 }} whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }} transition={{ delay: 0.18 + i * 0.09, ease: [0.16, 1, 0.3, 1] }}
                  className="flex items-start gap-4 font-sans leading-snug"
                  style={{ color: 'rgba(255,255,255,0.82)', fontSize: 'clamp(14px, 1.4vw, 16px)', fontWeight: 300 }}
                >
                  <span
                    className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold mt-0.5"
                    style={{ background: '#E87722', color: '#1a1a1a', fontFamily: 'var(--font-sans)' }}
                  >
                    {i + 1}
                  </span>
                  {step}
                </motion.li>
              ))}
            </ol>

            {/* NB note */}
            <p
              className="font-sans text-sm italic mt-8 pl-11"
              style={{ color: 'rgba(232,119,34,0.8)' }}
            >
              NB: Product Completion takes Minimum a week
            </p>

            {/* Divider */}
            <div style={{ height: '1px', background: 'rgba(255,255,255,0.08)', margin: '2rem 0' }} />

            {/* CTA row */}
            <div className="flex items-center gap-5 flex-wrap">
              <a
                href="https://wa.me/233555043118"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 font-sans font-medium text-[13px] uppercase tracking-[0.08em] transition-all"
                style={{
                  background: '#E87722', color: '#1a1a1a',
                  padding: '13px 26px', borderRadius: '3px',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = '#c96010'; (e.currentTarget as HTMLAnchorElement).style.letterSpacing = '0.12em'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = '#E87722'; (e.currentTarget as HTMLAnchorElement).style.letterSpacing = '0.08em'; }}
              >
                {/* WhatsApp icon */}
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.108.549 4.089 1.508 5.817L0 24l6.348-1.487A11.953 11.953 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.002-1.374l-.359-.214-3.724.873.93-3.613-.234-.37A9.818 9.818 0 1112 21.818z"/>
                </svg>
                Order via WhatsApp
              </a>
              <div>
                <p className="font-sans text-sm font-medium text-white">055 504 3118</p>
                <p className="font-sans text-[11px] uppercase tracking-[0.1em]" style={{ color: 'rgba(255,255,255,0.35)' }}>Follow us @ SASHMADE</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Kente strip at bottom */}
        <div className="kente-strip" />
      </section>

      {/* Collection Teaser */}
      <section className="py-24" style={{ background: '#F5F0E8' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="font-sans text-xs font-semibold uppercase tracking-[0.25em] mb-4" style={{ color: '#E87722' }}>
            Handcrafted in Ghana
          </p>
          <h2 className="font-serif text-4xl md:text-5xl font-bold mb-6" style={{ color: '#3d4a35' }}>
            Our Custom Stole Models
          </h2>
          <p className="font-sans text-stone-600 max-w-2xl mx-auto mb-12 text-lg leading-relaxed">
            Choose from our premium graduation stole models: Adehye Style, Nyonyo, Sophie, Daisy, and My Becoming. Let your stole speak of your success and the cultural legacy you proudly embrace.
          </p>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-8 py-4 font-sans font-bold rounded-full transition-colors text-white"
            style={{ background: '#3d4a35' }}
            onMouseEnter={e => (e.currentTarget.style.background = '#2c3828')}
            onMouseLeave={e => (e.currentTarget.style.background = '#3d4a35')}
          >
            View All Designs <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}

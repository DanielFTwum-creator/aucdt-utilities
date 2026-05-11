import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Map as MapIcon, Plane, MapPin, Navigation } from 'lucide-react';
import { db, auth } from '../firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { AircraftCard } from '../types';

function projectToScreen(
  cardLat: number,
  cardLng: number,
  centerLat: number,
  centerLng: number,
  rangeKm: number = 100,
  seed: number = 0
): { left: string; top: string; outOfRange: boolean } {
  const latRange = rangeKm / 111;
  const lngRange = rangeKm / (111 * Math.cos(centerLat * Math.PI / 180));
  const x = 50 + ((cardLng - centerLng) / lngRange) * 50;
  const y = 50 - ((cardLat - centerLat) / latRange) * 50;
  const outOfRange = x < 5 || x > 95 || y < 5 || y > 95;
  if (outOfRange) {
    // Place out-of-range dots in a ring around center so they're always visible
    const angle = (seed * 137.5) % 360;
    const r = 25 + (seed % 5) * 3;
    return {
      left: `${50 + r * Math.cos(angle * Math.PI / 180)}%`,
      top: `${50 + r * Math.sin(angle * Math.PI / 180)}%`,
      outOfRange: true,
    };
  }
  return { left: `${x}%`, top: `${y}%`, outOfRange: false };
}

export default function Map() {
  const [cards, setCards] = useState<AircraftCard[]>([]);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((pos) => {
      setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
    });

    if (!auth.currentUser) return;

    const q = query(
      collection(db, 'cards'),
      where('userId', '==', auth.currentUser.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as AircraftCard));
      setCards(docs);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="flex flex-col flex-1 min-h-0 bg-zinc-950 text-white p-6 font-mono relative overflow-hidden">
      <header className="mb-8 relative z-10">
        <h1 className="text-4xl font-black tracking-tighter mb-2">GLOBAL RADAR</h1>
        <div className="text-zinc-500 text-xs uppercase tracking-widest">
          SIGHTINGS LOGGED GLOBALLY
        </div>
      </header>

      {/* Map Background — dot grid + cross-hatch */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff18_1px,transparent_1px)] [background-size:40px_40px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] [background-size:100px_100px]" />
      </div>

      <div className="flex-1 relative border border-zinc-800 rounded-2xl bg-zinc-900/50 backdrop-blur-sm overflow-hidden">
        {/* Concentric range rings */}
        {[25, 50, 75].map(r => (
          <div
            key={r}
            className="absolute rounded-full pointer-events-none"
            style={{
              width: `${r}%`,
              height: `${r}%`,
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              border: '1px solid rgba(74,222,128,0.12)',
            }}
          />
        ))}
        {/* Cross-hair lines */}
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: 'linear-gradient(rgba(74,222,128,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(74,222,128,0.07) 1px, transparent 1px)',
          backgroundSize: '50% 50%',
          backgroundPosition: '50% 50%',
        }} />

        {/* Radar Sweeper */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] aspect-square origin-center"
          style={{
            background: 'conic-gradient(from 0deg, rgba(74,222,128,0.28) 0deg, rgba(74,222,128,0.08) 40deg, transparent 80deg)',
          }}
        />

        {/* User Location */}
        {userLocation && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
            <div className="relative flex items-center justify-center">
              {/* Outer pulse ring */}
              <div className="absolute w-10 h-10 rounded-full border border-blue-400/40 animate-ping" />
              {/* Mid ring */}
              <div className="absolute w-7 h-7 rounded-full border border-blue-400/30" />
              {/* Core dot */}
              <div className="w-4 h-4 bg-blue-400 rounded-full" style={{ boxShadow: '0 0 12px 4px rgba(96,165,250,0.7)' }} />
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[9px] text-blue-300 font-black tracking-widest whitespace-nowrap">YOU</div>
            </div>
          </div>
        )}

        {/* Spotted Planes */}
        {cards.map((card, i) => {
          const pos = userLocation
            ? projectToScreen(
                card.location.lat,
                card.location.lng,
                userLocation.lat,
                userLocation.lng,
                100,
                i
              )
            : { left: `${45 + (i % 3) * 5}%`, top: `${45 + Math.floor(i / 3) * 5}%`, outOfRange: false };

          // Always use rarity colour — distant cards are dimmed but still coloured
          const rarityColor =
            card.rarity === 'Legendary' ? '#f59e0b' :
            card.rarity === 'Rare'      ? '#a78bfa' :
            card.rarity === 'Uncommon'  ? '#38bdf8' :
                                          '#4ade80';

          const alpha = pos.outOfRange ? '99' : 'ff';  // dim distant, full for in-range
          const glowStrength = pos.outOfRange ? '0 0 10px 3px' : '0 0 16px 5px';
          const glowAlpha = pos.outOfRange ? 0.35 : 0.65;

          const rarityGlow =
            card.rarity === 'Legendary' ? `${glowStrength} rgba(245,158,11,${glowAlpha})` :
            card.rarity === 'Rare'      ? `${glowStrength} rgba(167,139,250,${glowAlpha})` :
            card.rarity === 'Uncommon'  ? `${glowStrength} rgba(56,189,248,${glowAlpha})` :
                                          `${glowStrength} rgba(74,222,128,${glowAlpha})`;

          return (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              style={{ position: 'absolute', left: pos.left, top: pos.top }}
              className="group cursor-pointer -translate-x-1/2 -translate-y-1/2 z-10"
            >
              <div className="relative flex flex-col items-center gap-1">
                {/* Plane icon with glow ring */}
                <div
                  className="relative flex items-center justify-center rounded-full transition-transform duration-200 group-hover:scale-125"
                  style={{
                    width: 40,
                    height: 40,
                    background: `${rarityColor}22`,
                    border: `2px solid ${rarityColor}${alpha}`,
                    boxShadow: rarityGlow,
                  }}
                >
                  <Plane
                    style={{ color: `${rarityColor}${alpha}` }}
                    className="w-5 h-5 rotate-45"
                  />
                </div>

                {/* Always-visible callsign label */}
                <div
                  className="px-2 py-0.5 rounded text-[10px] font-bold tracking-wider whitespace-nowrap leading-none"
                  style={{
                    background: 'rgba(0,0,0,0.85)',
                    border: `1px solid ${rarityColor}${pos.outOfRange ? '55' : '99'}`,
                    color: `${rarityColor}${alpha}`,
                  }}
                >
                  {card.callsign}{pos.outOfRange ? ' ↗' : ''}
                </div>

                {/* Hover tooltip — rich detail card */}
                <div
                  className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-150 scale-95 group-hover:scale-100 z-30"
                  style={{ minWidth: 160 }}
                >
                  <div
                    className="rounded-lg p-3 font-mono"
                    style={{
                      background: 'rgba(0,0,0,0.92)',
                      border: `1px solid ${rarityColor}88`,
                      boxShadow: `0 4px 24px rgba(0,0,0,0.8), 0 0 0 1px ${rarityColor}22`,
                    }}
                  >
                    {/* Callsign + rarity */}
                    <div className="flex items-center justify-between gap-3 mb-2">
                      <span className="text-white font-black text-sm tracking-tight">{card.callsign}</span>
                      <span
                        className="text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded"
                        style={{ background: `${rarityColor}22`, color: rarityColor }}
                      >
                        {card.rarity}
                      </span>
                    </div>
                    {/* Divider */}
                    <div style={{ height: 1, background: `${rarityColor}33`, marginBottom: 8 }} />
                    {/* Stats */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px]">
                        <span className="text-zinc-500 uppercase tracking-wider">Aircraft</span>
                        <span className="text-zinc-200 font-semibold">{card.aircraftType || '—'}</span>
                      </div>
                      <div className="flex justify-between text-[10px]">
                        <span className="text-zinc-500 uppercase tracking-wider">Altitude</span>
                        <span className="text-zinc-200 font-semibold">{card.altitude ? `${Math.round(card.altitude).toLocaleString()} m` : '—'}</span>
                      </div>
                      <div className="flex justify-between text-[10px]">
                        <span className="text-zinc-500 uppercase tracking-wider">Speed</span>
                        <span className="text-zinc-200 font-semibold">{card.speed ? `${Math.round(card.speed)} kts` : '—'}</span>
                      </div>
                      <div className="flex justify-between text-[10px]">
                        <span className="text-zinc-500 uppercase tracking-wider">Captured</span>
                        <span className="text-zinc-200 font-semibold">{new Date(card.capturedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    {pos.outOfRange && (
                      <div className="mt-2 text-[9px] text-zinc-600 uppercase tracking-wider">Outside radar range</div>
                    )}
                  </div>
                  {/* Arrow */}
                  <div
                    className="absolute left-1/2 -translate-x-1/2 top-full"
                    style={{
                      width: 0, height: 0,
                      borderLeft: '6px solid transparent',
                      borderRight: '6px solid transparent',
                      borderTop: `6px solid ${rarityColor}88`,
                    }}
                  />
                </div>
              </div>
            </motion.div>
          );
        })}

        {/* Map Stats */}
        <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-[10px] text-zinc-500">
              <Navigation className="w-3 h-3" />
              <span>ACTIVE SCANNING...</span>
            </div>
            <div className="text-xs font-bold text-zinc-400">
              {cards.length} SIGHTINGS RECORDED
            </div>
          </div>
          <div className="w-24 h-24 border border-zinc-800 rounded bg-black/40 p-2">
            <div className="text-[8px] text-zinc-600 mb-1">SIGNAL STRENGTH</div>
            <div className="flex items-end gap-0.5 h-12">
              {Array.from({ length: 12 }).map((_, i) => (
                <div 
                  key={i} 
                  className="flex-1 bg-green-500/40" 
                  style={{ height: `${Math.random() * 100}%` }} 
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

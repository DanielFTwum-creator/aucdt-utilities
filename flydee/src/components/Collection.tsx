import React, { useEffect, useState } from 'react';
import { Tooltip } from './ui/tooltip';
import { motion } from 'motion/react';
import { Search, Plane } from 'lucide-react';
import { db, auth } from '../firebase';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { AircraftCard } from '../types';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from './ui/dialog';

// Planespotters thumbnail API — real aircraft photos by ICAO24 hex
// v3 — bust any stale Wikimedia entries from previous sessions
const photoCache = new Map<string, string>();
const CACHE_VERSION = 'v3';

// Aviation-themed fallbacks from Unsplash (CORS-safe, reliable)
// Base path for public assets — works in both dev (/) and prod (/flydee/)
const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');

// Callsign-prefix → specific aircraft photo (local public assets)
const CALLSIGN_PHOTOS: Record<string, string> = {
  BAW: `${BASE}/images/aircraft-777-front.png`,
  DAL: `${BASE}/images/aircraft-767-delta.png`,
  EZY: `${BASE}/images/aircraft-a320-easyjet.png`,
};

// General fallback pool — all local assets, no external CORS dependency
const AVIATION_FALLBACKS = [
  `${BASE}/images/aircraft-777-front.png`,
  `${BASE}/images/aircraft-777-front2.png`,
  `${BASE}/images/aircraft-767-delta.png`,
  `${BASE}/images/aircraft-a320-easyjet.png`,
  `${BASE}/images/aircraft-a320-approach.png`,
];

function hashStr(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

function fallbackForCard(callsign: string, cardId: string) {
  // First try callsign prefix match
  const prefix = callsign.slice(0, 3).toUpperCase();
  if (CALLSIGN_PHOTOS[prefix]) return CALLSIGN_PHOTOS[prefix];
  // Otherwise spread across pool by cardId hash
  return AVIATION_FALLBACKS[hashStr(cardId) % AVIATION_FALLBACKS.length];
}

async function fetchAircraftPhoto(icao24: string, callsign: string, cardId: string): Promise<string> {
  const key = `${CACHE_VERSION}:${cardId}`;
  if (photoCache.has(key)) return photoCache.get(key)!;
  const fallback = fallbackForCard(callsign, cardId);
  try {
    const res = await fetch(`https://api.planespotters.net/pub/photos/hex/${icao24}`, {
      headers: { Accept: 'application/json' },
    });
    if (!res.ok) throw new Error('not ok');
    const data = await res.json();
    const url =
      data?.photos?.[0]?.thumbnail_large?.src ||
      data?.photos?.[0]?.thumbnail?.src ||
      '';
    const result = url || fallback;
    photoCache.set(key, result);
    return result;
  } catch {
    photoCache.set(key, fallback);
    return fallback;
  }
}

const BAD_URL = (u: string) =>
  !u || u.includes('picsum') || u.includes('PNG_transparency') || u.includes('placeholder');

function useAircraftPhoto(card: AircraftCard) {
  const [src, setSrc] = useState<string>(BAD_URL(card.photoUrl) ? '' : card.photoUrl);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!BAD_URL(card.photoUrl) && !failed) return;
    fetchAircraftPhoto(card.icao24, card.callsign, card.id).then(setSrc);
  }, [card.id, card.icao24, card.callsign, card.photoUrl, failed]);

  const handleError = () => {
    setFailed(true);
    setSrc(fallbackForCard(card.callsign, card.id));
  };

  return { src, handleError };
}

const rarityColor = (r: AircraftCard['rarity']) =>
  r === 'Legendary' ? '#f59e0b' :
  r === 'Rare'      ? '#a78bfa' :
  r === 'Uncommon'  ? '#38bdf8' : '#71717a';

function AircraftCardTile({ card, onClick }: { card: AircraftCard; onClick: () => void }) {
  const { src: photo, handleError } = useAircraftPhoto(card);
  const color = rarityColor(card.rarity);

  return (
    <Tooltip
      text={`${card.callsign} · ${card.rarity} · ${Math.round(card.altitude).toLocaleString()}m`}
      position="top"
      block
    >
      <motion.div
        key={card.id}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        onClick={onClick}
        className="group relative rounded-xl overflow-hidden cursor-pointer w-full"
        style={{ height: 160, border: `1.5px solid ${color}55` }}
      >
        {/* Photo or skeleton */}
        {photo ? (
          <img
            src={photo}
            alt={card.callsign}
            onError={handleError}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            style={{ objectPosition: 'center 65%', fontSize: 0 }}
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center" style={{ background: `${color}0a` }}>
            <div className="flex flex-col items-center gap-2 animate-pulse">
              <Plane className="w-8 h-8" style={{ color: `${color}60` }} />
              <span className="text-[9px] tracking-widest uppercase" style={{ color: `${color}60` }}>Loading…</span>
            </div>
          </div>
        )}

        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

        {/* Top-right rarity badge */}
        <div
          className="absolute top-2.5 right-2.5 z-10 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider"
          style={{ background: `${color}33`, border: `1px solid ${color}cc`, color }}
        >
          {card.rarity}
        </div>

        {/* Bottom info */}
        <div className="absolute bottom-0 left-0 right-0 z-10 px-3 pb-3 pt-6">
          <div className="text-base font-black leading-none tracking-tight text-white drop-shadow-lg">{card.callsign}</div>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[9px] uppercase tracking-wider truncate" style={{ color }}>{card.aircraftType}</span>
            <span className="text-zinc-500 text-[9px]">·</span>
            <span className="text-[9px] text-zinc-400">{card.altitude ? `${Math.round(card.altitude / 100) * 100}m` : ''}</span>
          </div>
        </div>
      </motion.div>
    </Tooltip>
  );
}

function DialogPhoto({ card }: { card: AircraftCard }) {
  const { src: photo, handleError } = useAircraftPhoto(card);
  if (!photo) return (
    <div className="w-full h-56 rounded-xl animate-pulse flex items-center justify-center" style={{ background: `${rarityColor(card.rarity)}0a`, border: `1px solid ${rarityColor(card.rarity)}33` }}>
      <Plane className="w-10 h-10 text-zinc-700" />
    </div>
  );
  return (
    <img
      src={photo}
      alt={card.callsign}
      onError={handleError}
      className="w-full h-56 object-cover rounded-xl"
      referrerPolicy="no-referrer"
    />
  );
}

export default function Collection() {
  const [cards, setCards] = useState<AircraftCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [rarityFilter, setRarityFilter] = useState<string>('All');
  const rarities = ['All', 'Common', 'Uncommon', 'Rare', 'Legendary'];
  const [selectedCard, setSelectedCard] = useState<AircraftCard | null>(null);

  useEffect(() => {
    // Wait for auth to resolve before querying — avoids race on cold load
    const unsubAuth = onAuthStateChanged(auth, (user) => {
      if (!user) { setLoading(false); return; }

      const q = query(
        collection(db, 'cards'),
        where('userId', '==', user.uid),
        orderBy('capturedAt', 'desc')
      );

      const unsubSnap = onSnapshot(q, (snapshot) => {
        const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as AircraftCard));
        setCards(docs);
        setLoading(false);
      });

      return unsubSnap;
    });

    return () => unsubAuth();
  }, []);

  const filteredCards = cards.filter(c => {
    const matchesSearch =
      c.callsign.toLowerCase().includes(search.toLowerCase()) ||
      c.aircraftType.toLowerCase().includes(search.toLowerCase());
    const matchesRarity =
      rarityFilter === 'All' || c.rarity === rarityFilter;
    return matchesSearch && matchesRarity;
  });

  return (
    <div className="flex flex-col flex-1 min-h-0 bg-zinc-950 text-white px-6 pt-6 font-mono overflow-x-hidden">
      <header className="mb-4">
        <h1 className="text-4xl font-black tracking-tighter mb-2">FLIGHT BINDER</h1>
        <div className="flex items-center gap-4 text-zinc-500 text-xs uppercase tracking-widest">
          <span>Total: {cards.length}</span>
          <span>•</span>
          <span>Unique: {new Set(cards.map(c => c.icao24)).size}</span>
        </div>
      </header>

      <div className="relative mb-3">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
        <Input 
          placeholder="SEARCH COLLECTION..." 
          className="pl-10 bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-600 focus:ring-zinc-700"
          value={search}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
        />
      </div>

      <div className="flex gap-2 mb-3 overflow-x-auto pb-1 no-scrollbar px-1 -mx-1">
        {rarities.map(r => (
          <Tooltip
            key={r}
            position="top"
            text={
              r === 'All' ? 'Show all aircraft' :
              r === 'Common' ? 'Frequently spotted aircraft' :
              r === 'Uncommon' ? 'Less frequently spotted' :
              r === 'Rare' ? 'Hard to find aircraft' :
              'Extremely rare catches'
            }
          >
            <button
              onClick={() => setRarityFilter(r)}
              className="px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border whitespace-nowrap transition-all flex-shrink-0"
              style={rarityFilter === r
                ? { background: '#ffffff', color: '#000000', borderColor: '#ffffff' }
                : { background: '#3f3f46', color: '#f4f4f5', borderColor: '#71717a' }
              }
            >
              {r}
            </button>
          </Tooltip>
        ))}
      </div>

      <ScrollArea className="flex-1 -mx-2 px-2">
        <div className="grid grid-cols-2 gap-4 pb-4">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-xl bg-zinc-900 animate-pulse" style={{ height: 160 }} />
            ))
          ) : filteredCards.length > 0 ? (
            filteredCards.map((card) => (
              <AircraftCardTile key={card.id} card={card} onClick={() => setSelectedCard(card)} />
            ))
          ) : (
            <div className="col-span-2 py-20 text-center">
              <Plane className="w-12 h-12 text-zinc-800 mx-auto mb-4" />
              <div className="text-zinc-600 uppercase text-sm tracking-widest">No aircraft found</div>
            </div>
          )}
        </div>
      </ScrollArea>

      <Dialog open={!!selectedCard} onOpenChange={() => setSelectedCard(null)}>
        <DialogContent className="font-mono text-white p-0 overflow-hidden max-w-sm"
          style={{ background: '#0a0a0a', border: `1.5px solid ${rarityColor(selectedCard?.rarity ?? 'Common')}55` }}>
          {/* Hero photo */}
          {selectedCard && <DialogPhoto card={selectedCard} />}

          <div className="px-5 pb-5 pt-3">
            {/* Callsign + rarity */}
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <DialogTitle className="text-2xl font-black tracking-tight text-white leading-none">
                  {selectedCard?.callsign}
                </DialogTitle>
                <DialogDescription className="text-zinc-500 text-[10px] uppercase tracking-widest mt-1">
                  {selectedCard?.aircraftType}
                </DialogDescription>
              </div>
              <span
                className="shrink-0 mt-0.5 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider"
                style={{
                  background: `${rarityColor(selectedCard?.rarity ?? 'Common')}22`,
                  border: `1px solid ${rarityColor(selectedCard?.rarity ?? 'Common')}88`,
                  color: rarityColor(selectedCard?.rarity ?? 'Common'),
                }}
              >
                {selectedCard?.rarity}
              </span>
            </div>

            {/* Divider */}
            <div className="h-px bg-zinc-800 mb-3" />

            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-3">
              {[
                { label: 'Origin',      value: selectedCard?.origin || '—' },
                { label: 'Destination', value: selectedCard?.destination || '—' },
                { label: 'Altitude',    value: selectedCard?.altitude ? `${Math.round(selectedCard.altitude).toLocaleString()} m` : '—' },
                { label: 'Speed',       value: selectedCard?.speed ? `${Math.round(selectedCard.speed)} kts` : '—' },
                { label: 'Captured',    value: new Date(selectedCard?.capturedAt || 0).toLocaleDateString() },
                { label: 'ICAO24',      value: selectedCard?.icao24?.toUpperCase() || '—' },
              ].map(({ label, value }) => (
                <div key={label}>
                  <div className="text-[9px] text-zinc-600 uppercase tracking-wider mb-0.5">{label}</div>
                  <div className="text-sm font-bold text-zinc-200">{value}</div>
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, Target, Loader2, Info, Share2, Trophy } from 'lucide-react';
import { useSensors } from '../lib/sensors';
import { fetchNearbyFlights, findTargetAircraft } from '../lib/flightApi';
import { Flight, AircraftCard } from '../types';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { db, auth } from '../firebase';
import { Tooltip } from './ui/tooltip';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function Viewfinder() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { heading, pitch, location, error: sensorError, orientationReady, startOrientation } = useSensors();
  const [isCapturing, setIsCapturing] = useState(false);
  const [target, setTarget] = useState<Flight | null>(null);
  const [lastCaptured, setLastCaptured] = useState<AircraftCard | null>(null);
  const [scanning, setScanning] = useState(false);
  const [shareToast, setShareToast] = useState(false);

  // Real ICAO24 hex codes for Boeing 737s with known Planespotters photos
  const MOCK_FLIGHTS: Flight[] = [
    { icao24: '400f6d', callsign: 'BAW292', origin_country: 'United Kingdom', time_position: Date.now(), last_contact: Date.now(), longitude: -0.1278, latitude: 51.5074, baro_altitude: 10500, on_ground: false, velocity: 245, true_track: 135, vertical_rate: 0, sensors: null, geo_altitude: 10500, squawk: '1234', spi: false, position_source: 0 },
    { icao24: 'a4d449', callsign: 'DAL401', origin_country: 'United States', time_position: Date.now(), last_contact: Date.now(), longitude: -0.4543, latitude: 51.4775, baro_altitude: 8200, on_ground: false, velocity: 220, true_track: 270, vertical_rate: -5, sensors: null, geo_altitude: 8200, squawk: '5678', spi: false, position_source: 0 },
    { icao24: '738067', callsign: 'EZY1234', origin_country: 'United Kingdom', time_position: Date.now(), last_contact: Date.now(), longitude: -0.2411, latitude: 51.6523, baro_altitude: 3500, on_ground: false, velocity: 180, true_track: 45, vertical_rate: 10, sensors: null, geo_altitude: 3500, squawk: '9012', spi: false, position_source: 0 },
  ];

  const fetchAircraftPhoto = async (icao24: string): Promise<string> => {
    const FALLBACK = 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/PNG_transparency_demonstration_1.png/280px-PNG_transparency_demonstration_1.png';
    try {
      const res = await fetch(`https://api.planespotters.net/pub/photos/hex/${icao24}`);
      if (!res.ok) return FALLBACK;
      const data = await res.json();
      return data?.photos?.[0]?.thumbnail_large?.src || data?.photos?.[0]?.thumbnail?.src || FALLBACK;
    } catch {
      return FALLBACK;
    }
  };

  const handleSimulateCapture = async () => {
    if (!auth.currentUser) return;
    setIsCapturing(true);
    const flight = MOCK_FLIGHTS[Math.floor(Math.random() * MOCK_FLIGHTS.length)];
    const rarities: AircraftCard['rarity'][] = ['Common', 'Uncommon', 'Rare', 'Legendary'];
    const rarity = rarities[Math.floor(Math.random() * rarities.length)];
    // Use user's actual location if available, otherwise default to Accra
    const userPos = location || { lat: 5.6037, lng: -0.1870 };
    const mockLocation = {
      lat: userPos.lat + (Math.random() - 0.5) * 0.2,
      lng: userPos.lng + (Math.random() - 0.5) * 0.2,
    };
    const photoUrl = await fetchAircraftPhoto(flight.icao24);
    const newCard: Omit<AircraftCard, 'id'> = {
      icao24: flight.icao24,
      callsign: flight.callsign,
      aircraftType: 'Boeing 737-800',
      airline: flight.callsign.substring(0, 3),
      origin: 'LHR',
      destination: 'JFK',
      altitude: flight.geo_altitude || 0,
      speed: flight.velocity ? Math.round(flight.velocity * 3.6) : 0,
      capturedAt: Date.now(),
      photoUrl,
      rarity,
      location: mockLocation,
    };
    try {
      const docRef = await addDoc(collection(db, 'cards'), {
        ...newCard,
        userId: auth.currentUser.uid,
        createdAt: serverTimestamp(),
      });
      setLastCaptured({ ...newCard, id: docRef.id });
    } catch (err) {
      console.error('Simulate capture error:', err);
    } finally {
      setIsCapturing(false);
    }
  };

  const handleShare = async (card: AircraftCard) => {
    const shareText = `✈️ Just spotted ${card.callsign} at ${card.altitude}m altitude — ${card.rarity} catch! #Flydee #PlaneSpotting`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'FLYDEE — Aircraft Spotted!',
          text: shareText,
          url: window.location.href,
        });
      } catch {
        // User cancelled — silent
      }
    } else {
      await navigator.clipboard.writeText(shareText);
      setShareToast(true);
      setTimeout(() => setShareToast(false), 2500);
    }
  };

  useEffect(() => {
    if (!orientationReady) {
      // Maybe show a button to start orientation?
    }
  }, [orientationReady]);

  useEffect(() => {
    async function setupCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'environment' },
          audio: false 
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error('Camera error:', err);
      }
    }
    setupCamera();
  }, []);

  // Periodic scanning for planes in view
  useEffect(() => {
    if (!location || heading === null || pitch === null || isCapturing) return;

    const interval = setInterval(async () => {
      setScanning(true);
      const flights = await fetchNearbyFlights(location.lat, location.lng);
      const found = findTargetAircraft(flights, location.lat, location.lng, heading, pitch);
      setTarget(found);
      setScanning(false);
    }, 10000);

    return () => clearInterval(interval);
  }, [location, heading, pitch, isCapturing]);

  const handleCapture = async () => {
    if (!target || !location || !auth.currentUser) return;

    setIsCapturing(true);

    // Simulate photo capture (in real app, we'd grab a frame from the video)
    const photoUrl = `https://picsum.photos/seed/${target.icao24}/800/1200`;

    const rarities: AircraftCard['rarity'][] = ['Common', 'Uncommon', 'Rare', 'Legendary'];
    const rarity = rarities[Math.floor(Math.random() * rarities.length)];

    const newCard: Omit<AircraftCard, 'id'> = {
      icao24: target.icao24,
      callsign: target.callsign,
      aircraftType: 'Boeing 737-800', // Mocked, OpenSky doesn't give type easily without another DB
      airline: target.callsign.substring(0, 3), // Mocked
      origin: 'LHR',
      destination: 'JFK',
      altitude: target.geo_altitude || 0,
      speed: target.velocity ? Math.round(target.velocity * 3.6) : 0,
      capturedAt: Date.now(),
      photoUrl,
      rarity,
      location: { ...location }
    };

    try {
      const docRef = await addDoc(collection(db, 'cards'), {
        ...newCard,
        userId: auth.currentUser.uid,
        createdAt: serverTimestamp()
      });
      setLastCaptured({ ...newCard, id: docRef.id });
    } catch (err) {
      console.error('Error saving card:', err);
    } finally {
      setIsCapturing(false);
    }
  };

  return (
    <div className="relative w-full h-full bg-black overflow-hidden font-mono">
      {/* Camera Feed */}
      <video 
        ref={videoRef} 
        autoPlay 
        playsInline 
        muted 
        className="absolute inset-0 w-full h-full object-cover opacity-60"
      />

      {/* HUD Overlay */}
      <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-6">
        {/* Top Bar */}
        <div className="flex justify-between items-start">
          <div className="bg-black/40 backdrop-blur-md border border-white/20 p-3 rounded-lg">
            <div className="text-[10px] text-white/50 uppercase tracking-widest mb-1">Position</div>
            <div className="text-xs text-white">
              {location 
                ? `${Math.abs(location.lat).toFixed(4)}°${location.lat >= 0 ? 'N' : 'S'} ${Math.abs(location.lng).toFixed(4)}°${location.lng >= 0 ? 'E' : 'W'}`
                : 'LOCATING...'
              }
            </div>
          </div>
          <div className="bg-black/40 backdrop-blur-md border border-white/20 p-3 rounded-lg text-right">
            <div className="text-[10px] text-white/50 uppercase tracking-widest mb-1">Orientation</div>
            <div className="text-xs text-white">
              HDG: {heading?.toFixed(0)}° | TILT: {pitch?.toFixed(0)}°
            </div>
          </div>
        </div>

        {/* Reticle */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-64 h-64">
            {/* Corner Brackets */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-white/40" />
            <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-white/40" />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-white/40" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-white/40" />
            
            {/* Center Dot */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className={`w-1 h-1 rounded-full ${target ? 'bg-red-500 animate-ping' : 'bg-white/20'}`} />
            </div>

            {/* Target Info */}
            <AnimatePresence>
              {target && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute -bottom-24 left-1/2 -translate-x-1/2 w-48 bg-red-500/90 text-white p-2 text-center rounded border border-red-400 shadow-lg shadow-red-500/20"
                >
                  <div className="text-[10px] uppercase font-bold tracking-tighter">Target Locked</div>
                  <div className="text-lg font-black leading-none">{target.callsign}</div>
                  <div className="text-[10px] opacity-80">ALT: {target.geo_altitude?.toFixed(0)}m</div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Bottom Controls */}
        <div className="flex justify-center items-end pointer-events-auto pb-12">
          <Button 
            size="lg"
            disabled={!target || isCapturing}
            onClick={handleCapture}
            className={`w-20 h-20 rounded-full border-4 transition-all duration-300 ${
              target 
                ? 'bg-red-600 border-red-400 hover:bg-red-700 scale-110 shadow-2xl shadow-red-500/50' 
                : 'bg-white/10 border-white/20'
            }`}
          >
            {isCapturing ? (
              <Loader2 className="w-8 h-8 animate-spin" />
            ) : (
              <Target className="w-8 h-8" />
            )}
          </Button>
        </div>
      </div>

      {/* Simulate Capture */}
      {auth.currentUser && (
        <div className="absolute bottom-36 right-6 z-30 pointer-events-auto">
          <Tooltip text="Simulate a random aircraft capture" position="top">
            <button
              onClick={handleSimulateCapture}
              disabled={isCapturing}
              className="bg-yellow-500/20 border border-yellow-500/40 text-yellow-400 text-[10px] uppercase tracking-widest px-3 py-2 rounded-full hover:bg-yellow-500/30 disabled:opacity-50"
            >
              {isCapturing ? '...' : '✦ Simulate'}
            </button>
          </Tooltip>
        </div>
      )}

      {/* Scanning Indicator */}
      {scanning && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full border border-white/10">
          <Loader2 className="w-3 h-3 animate-spin text-white/50" />
          <span className="text-[10px] text-white/50 uppercase tracking-widest">Scanning Airspace</span>
        </div>
      )}

      {/* Sensor Error Banner */}
      {sensorError && (
        <div className="absolute top-32 left-1/2 -translate-x-1/2 w-72 
          bg-red-900/80 border border-red-500/40 backdrop-blur-sm 
          px-4 py-2 rounded-lg text-center z-30">
          <div className="text-[10px] text-red-300 uppercase tracking-widest mb-1">
            Sensor Warning
          </div>
          <div className="text-xs text-red-200">{sensorError}</div>
        </div>
      )}

      {/* Compass Enable Button */}
      {heading === null && !sensorError && (
        <button
          onClick={startOrientation}
          className="absolute bottom-40 left-1/2 -translate-x-1/2 
            bg-white/10 border border-white/20 backdrop-blur-sm 
            px-6 py-3 rounded-full text-white text-xs uppercase 
            tracking-widest pointer-events-auto z-30"
        >
          ✦ TAP TO ENABLE COMPASS
        </button>
      )}

      {/* Capture Success Modal */}
      <AnimatePresence>
        {lastCaptured && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-black/90 flex items-center justify-center p-6 backdrop-blur-xl"
          >
            <div className="max-w-sm w-full">
              <Card className="bg-zinc-900 border-zinc-800 overflow-hidden shadow-2xl">
                <div className="relative aspect-[3/4]">
                  <img 
                    src={lastCaptured.photoUrl} 
                    alt="Captured Aircraft" 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent" />
                  
                  <div className="absolute top-4 right-4">
                    <Badge variant="outline" className={`
                      ${lastCaptured.rarity === 'Legendary' ? 'bg-yellow-500 text-black border-yellow-400' : ''}
                      ${lastCaptured.rarity === 'Rare' ? 'bg-purple-500 text-white border-purple-400' : ''}
                      ${lastCaptured.rarity === 'Uncommon' ? 'bg-blue-500 text-white border-blue-400' : ''}
                      ${lastCaptured.rarity === 'Common' ? 'bg-zinc-500 text-white border-zinc-400' : ''}
                    `}>
                      {lastCaptured.rarity}
                    </Badge>
                  </div>

                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="text-4xl font-black text-white tracking-tighter leading-none mb-1">
                      {lastCaptured.callsign}
                    </div>
                    <div className="text-sm text-white/60 uppercase tracking-widest">
                      {lastCaptured.aircraftType}
                    </div>
                  </div>
                </div>
                <CardContent className="p-6 grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-[10px] text-zinc-500 uppercase">Altitude</div>
                    <div className="text-xl font-bold text-white">{lastCaptured.altitude.toFixed(0)}m</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-zinc-500 uppercase">Speed</div>
                    <div className="text-xl font-bold text-white">{lastCaptured.speed.toFixed(0)}km/h</div>
                  </div>
                  <div className="col-span-2 pt-4 flex gap-2">
                    <Button className="flex-1 bg-white text-black hover:bg-zinc-200" onClick={() => setLastCaptured(null)}>
                      COLLECT
                    </Button>
                    <Button variant="outline" className="border-zinc-700 text-white" onClick={() => lastCaptured && handleShare(lastCaptured)}>
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              {shareToast && (
                <div className="mt-4 text-center text-xs text-zinc-400 
                  uppercase tracking-widest animate-pulse">
                  ✓ Copied to clipboard
                </div>
              )}

              <div className="mt-8 text-center">
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', delay: 0.5 }}
                  className="inline-flex items-center gap-2 bg-yellow-500/20 text-yellow-500 px-4 py-2 rounded-full border border-yellow-500/30"
                >
                  <Trophy className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase">New Collection Entry!</span>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

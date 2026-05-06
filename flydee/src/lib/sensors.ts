import { useState, useEffect } from 'react';

export async function requestOrientationPermission(): Promise<boolean> {
  if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
    try {
      const permission = await (DeviceOrientationEvent as any).requestPermission();
      return permission === 'granted';
    } catch {
      return false;
    }
  }
  // Non-iOS — permission not required
  return true;
}

export function useSensors() {
  const [heading, setHeading] = useState<number | null>(null);
  const [pitch, setPitch] = useState<number | null>(null);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [orientationReady, setOrientationReady] = useState(false);

  useEffect(() => {
    // Geolocation
    if ('geolocation' in navigator) {
      const watchId = navigator.geolocation.watchPosition(
        (pos) => {
          setLocation({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
        },
        (err) => setError(`Geolocation error: ${err.message}`),
        { enableHighAccuracy: true }
      );
      return () => navigator.geolocation.clearWatch(watchId);
    } else {
      setError('Geolocation not supported');
    }
  }, []);

  const startOrientation = async () => {
    const granted = await requestOrientationPermission();
    if (granted) {
      setOrientationReady(true);
      const handleOrientation = (event: DeviceOrientationEvent) => {
        let h = (event as any).webkitCompassHeading || event.alpha;
        if (h !== null) setHeading(h);
        if (event.beta !== null) setPitch(event.beta);
      };
      window.addEventListener('deviceorientation', handleOrientation, true);
    } else {
      setError('Orientation permission denied');
    }
  };

  return { heading, pitch, location, error, orientationReady, startOrientation };
}

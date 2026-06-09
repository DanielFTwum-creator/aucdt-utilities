import React, { useEffect, useRef } from 'react';

export function WaveformBackground() {
  const ref = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const bars = ref.current?.querySelectorAll('.wave-bar');
    if (!bars) return;
    bars.forEach((bar, i) => {
      const dur = 0.8 + Math.random() * 1.4;
      const delay = (i / bars.length) * -2;
      (bar as HTMLElement).style.animationDuration = `${dur}s`;
      (bar as HTMLElement).style.animationDelay = `${delay}s`;
    });
  }, []);

  const COUNT = 72;
  return (
    <div ref={ref} className="waveform-bg" aria-hidden="true">
      {Array.from({ length: COUNT }, (_, i) => (
        <div
          key={i}
          className="wave-bar"
          style={{ height: `${20 + Math.sin(i * 0.4) * 50 + Math.random() * 30}%` }}
        />
      ))}
    </div>
  );
}

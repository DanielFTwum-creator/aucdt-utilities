import React, { useEffect, useRef } from 'react';

interface EqualizerProps {
  speed?: 'S' | 'M' | 'F';
}

/**
 * Equalizer Component
 * 
 * Animation timing is calculated using the formula:
 * Divisor = 60,000 / (2 * PI * BPM)
 * 
 * Note: All speeds have been reduced by 50% per user request.
 */
const Equalizer: React.FC<EqualizerProps> = ({ speed = 'M' }) => {
  const barsRef = useRef<(HTMLDivElement | null)[]>([]);
  const requestRef = useRef<number | null>(null);

  useEffect(() => {
    const animate = () => {
      const now = Date.now();
      
      /**
       * BPM Mapping (Post 50% Reduction):
       * S (Slow): 40 BPM (Roots) -> Divisor ~238
       * M (Medium): 57.5 BPM (Riddim) -> Divisor ~166
       * F (Fast/Variable): 70-90 BPM -> Divisor ~136 to ~106
       */
      let divisor = 166; // Default M
      
      if (speed === 'S') {
        divisor = 238; // Half-speed of 80 BPM
      } else if (speed === 'F') {
        // Fluctuates rhythmically between 70 and 90 BPM (Half-speed of 140-180 BPM)
        const bpmVariance = 80 + Math.sin(now / 1500) * 10;
        divisor = 9549 / bpmVariance;
      }

      barsRef.current.forEach((bar, index) => {
        if (!bar) return;
        
        // Create a traveling wave pattern across the 32 channels
        const phase = now / divisor + index / 3;
        const wave = Math.sin(phase) * 0.5 + 0.5;
        
        // Add transient "audio spikes" (percussive noise)
        const transients = Math.random() * 0.12;
        
        // Apply secondary modulation to simulate complex riddim layers
        const subMod = Math.sin(phase * 0.5) * 0.1;
        
        // Scale to final percentage (Min 8%, Max 95%)
        const heightPercentage = Math.max(8, (wave + transients + subMod) * 82 + 5);
        
        bar.style.height = `${heightPercentage}%`;
      });
      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [speed]);

  return (
    <div className="equalizer-container" aria-hidden="true" style={{ display: 'flex', alignItems: 'flex-end' }}>
      {Array.from({ length: 32 }).map((_, i) => (
        <div
          key={i}
          // Fix: Wrap assignment in a block to ensure the ref callback returns void, 
          // avoiding the TypeScript error where it implicitly returns the HTMLDivElement.
          ref={(el) => { barsRef.current[i] = el; }}
          className="equalizer-bar"
          style={{ height: '10%' }}
        />
      ))}
    </div>
  );
};

export default Equalizer;
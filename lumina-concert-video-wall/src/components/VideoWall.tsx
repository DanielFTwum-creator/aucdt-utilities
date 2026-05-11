import React, { useEffect, useRef } from 'react';

interface VisualConfig {
  gridSize: number;
  decay: number;
  colorPrimary: string;
  colorSecondary: string;
  sensitivity: number;
  mode: 'ripple' | 'matrix' | 'plasma' | 'wave' | 'silhouette';
  activeShape: 'africa' | 'world';
  silhouetteSize: number;
  activeVideo: string;
  useVideoBackground: boolean;
}

const SHAPES = {
  // Simplified Africa path
  africa: "M 420 100 L 550 100 L 600 180 L 650 250 L 620 350 L 550 450 L 480 550 L 400 450 L 350 350 L 300 250 L 320 180 L 380 120 Z", 
  // Very rough World Map approximation (just a placeholder for the concept)
  world: "M 100 100 H 900 V 500 H 100 Z" 
};

// More detailed Africa path with Madagascar
const AFRICA_PATH = "M 360 110 L 420 100 L 480 105 L 520 120 L 540 140 L 560 200 L 630 245 L 600 300 L 580 400 L 550 500 L 480 630 L 420 560 L 390 480 L 400 400 L 300 350 L 220 260 L 250 180 L 300 140 Z M 610 450 L 650 460 L 640 550 L 600 530 Z";

const VideoWall: React.FC<{ config: VisualConfig }> = ({ config }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const timeRef = useRef(0);
  const animationRef = useRef<number>(0);
  const failedSourcesRef = useRef<Set<string>>(new Set());

  // Grid state for ripple effect
  const gridRef = useRef<Float32Array>(new Float32Array(0));
  const prevGridRef = useRef<Float32Array>(new Float32Array(0));

  // Offscreen canvas for shape sampling
  const shapeCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Handle video playback
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (!config.useVideoBackground) {
        video.pause();
        return;
    }

    const fallbackUrl = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";
    const targetUrl = config.activeVideo;
    
    // Determine which URL to use: Target or Fallback
    const urlToUse = failedSourcesRef.current.has(targetUrl) ? fallbackUrl : targetUrl;

    const attemptPlay = async () => {
        try {
            await video.play();
        } catch (err) {
            console.warn("Playback failed, attempting mute:", err);
            if (!video.muted) {
                video.muted = true;
                try {
                    await video.play();
                } catch (err2) {
                    console.error("Retry playback failed:", err2);
                }
            }
        }
    };

    video.onerror = () => {
        console.error(`Video error for source: ${video.src}`);
        // Mark the requested video as failed
        failedSourcesRef.current.add(targetUrl);
        
        // If we aren't already on the fallback, switch to it
        if (video.src !== fallbackUrl && urlToUse !== fallbackUrl) {
            console.log("Switching to fallback video...");
            video.src = fallbackUrl;
            video.load();
            attemptPlay();
        }
    };

    // Only load if the source is different
    if (video.src !== urlToUse) {
        video.src = urlToUse;
        video.load();
        attemptPlay();
    } else {
        // If already loaded but paused, play
        if (video.paused) {
            attemptPlay();
        }
    }
  }, [config.useVideoBackground, config.activeVideo]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas) return;
    
    // We use alpha: false for performance, as we handle all drawing manually
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;
    
    // Initialize grid
    const cols = Math.ceil(width / config.gridSize);
    const rows = Math.ceil(height / config.gridSize);
    const numCells = cols * rows;
    
    if (gridRef.current.length !== numCells) {
      gridRef.current = new Float32Array(numCells);
      prevGridRef.current = new Float32Array(numCells);
    }

    // Initialize shape canvas
    if (!shapeCanvasRef.current) {
        shapeCanvasRef.current = document.createElement('canvas');
    }
    const shapeCtx = shapeCanvasRef.current.getContext('2d');
    if (shapeCtx) {
        shapeCanvasRef.current.width = width;
        shapeCanvasRef.current.height = height;
    }

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      
      if (shapeCanvasRef.current) {
          shapeCanvasRef.current.width = width;
          shapeCanvasRef.current.height = height;
      }

      const newCols = Math.ceil(width / config.gridSize);
      const newRows = Math.ceil(height / config.gridSize);
      gridRef.current = new Float32Array(newCols * newRows);
      prevGridRef.current = new Float32Array(newCols * newRows);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);

    const render = () => {
      timeRef.current += 0.01;
      
      // 1. Clear background to black
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, width, height);

      const cols = Math.ceil(width / config.gridSize);
      const rows = Math.ceil(height / config.gridSize);

      // Mouse interaction
      const mx = Math.floor(mouseRef.current.x / config.gridSize);
      const my = Math.floor(mouseRef.current.y / config.gridSize);
      
      if (mx >= 0 && mx < cols && my >= 0 && my < rows) {
        const index = my * cols + mx;
        prevGridRef.current[index] = config.sensitivity * 255;
      }

      // Update physics/simulation
      if (config.mode === 'ripple') {
        for (let y = 1; y < rows - 1; y++) {
          for (let x = 1; x < cols - 1; x++) {
            const i = y * cols + x;
            const val = (
              prevGridRef.current[i - 1] +
              prevGridRef.current[i + 1] +
              prevGridRef.current[i - cols] +
              prevGridRef.current[i + cols]
            ) / 2 - gridRef.current[i];
            
            gridRef.current[i] = val * config.decay;
          }
        }
        const temp = prevGridRef.current;
        prevGridRef.current = gridRef.current;
        gridRef.current = temp;
      }

      // Prepare shape context if in silhouette mode
      if (config.mode === 'silhouette' && shapeCtx) {
          shapeCtx.clearRect(0, 0, width, height);
          shapeCtx.fillStyle = '#FFFFFF';
          shapeCtx.save();
          shapeCtx.translate(width / 2, height / 2);
          const baseScale = Math.min(width, height) / 800;
          const scale = baseScale * config.silhouetteSize;
          shapeCtx.scale(scale, scale);
          shapeCtx.translate(-450, -300);
          const path = new Path2D(config.activeShape === 'africa' ? AFRICA_PATH : SHAPES.world);
          shapeCtx.fill(path);
          shapeCtx.restore();
      }

      // 2. Render Video Background (if active)
      if (config.useVideoBackground && video && video.readyState >= 2) {
          // Draw video full screen
          ctx.drawImage(video, 0, 0, width, height);
          
          // Use destination-in to keep video ONLY where we draw the LEDs
          ctx.globalCompositeOperation = 'destination-in';
          ctx.fillStyle = '#FFFFFF';
          ctx.beginPath();
          for (let y = 0; y < rows; y++) {
            for (let x = 0; x < cols; x++) {
                const cx = x * config.gridSize;
                const cy = y * config.gridSize;
                const pad = 1;
                ctx.rect(cx + pad, cy + pad, config.gridSize - pad*2, config.gridSize - pad*2);
            }
          }
          ctx.fill();
          
          // Fill the rest with black (where video was removed)
          ctx.globalCompositeOperation = 'destination-over';
          ctx.fillStyle = '#000000';
          ctx.fillRect(0, 0, width, height);
          
          // Reset for subsequent drawing
          ctx.globalCompositeOperation = 'source-over';
      }

      // 3. Draw Interactive Effects (Light up LEDs on top)
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const i = y * cols + x;
          const cx = x * config.gridSize;
          const cy = y * config.gridSize;
          const pad = 1;

          let intensity = 0;

          if (config.mode === 'ripple') {
             intensity = Math.abs(gridRef.current[i]);
          } else if (config.mode === 'plasma') {
             const v = Math.sin(x * 0.1 + timeRef.current) + Math.sin(y * 0.1 + timeRef.current) + Math.sin((x + y) * 0.1 + timeRef.current);
             const dx = cx - mouseRef.current.x;
             const dy = cy - mouseRef.current.y;
             const dist = Math.sqrt(dx*dx + dy*dy);
             const mouseFactor = Math.max(0, 1 - dist / 300);
             intensity = (v + 3) * 20 + (mouseFactor * config.sensitivity * 100);
          } else if (config.mode === 'matrix') {
             if (Math.random() > 0.99) gridRef.current[i] = 255;
             gridRef.current[i] *= 0.95;
             const dx = cx - mouseRef.current.x;
             const dy = cy - mouseRef.current.y;
             if (Math.sqrt(dx*dx + dy*dy) < 100) gridRef.current[i] = 255;
             intensity = gridRef.current[i];
          } else if (config.mode === 'wave') {
             const dist = Math.sqrt(Math.pow(cx - mouseRef.current.x, 2) + Math.pow(cy - mouseRef.current.y, 2));
             intensity = Math.sin(dist * 0.05 - timeRef.current * 5) * 100 + 100;
             intensity *= Math.max(0, 1 - dist / 800);
          } else if (config.mode === 'silhouette' && shapeCtx) {
             const path = new Path2D(config.activeShape === 'africa' ? AFRICA_PATH : SHAPES.world);
             
             shapeCtx.save();
             shapeCtx.translate(width / 2, height / 2);
             const baseScale = Math.min(width, height) / 800;
             const scale = baseScale * config.silhouetteSize;
             shapeCtx.scale(scale, scale);
             shapeCtx.translate(-450, -300);
             const isInside = shapeCtx.isPointInPath(path, cx + config.gridSize/2, cy + config.gridSize/2);
             shapeCtx.restore();

             if (isInside) {
                 const noise = Math.random() * 50;
                 const pulse = Math.sin(timeRef.current * 2 + x * 0.1) * 50 + 50;
                 intensity = 100 + pulse + noise;
                 
                 const dx = cx - mouseRef.current.x;
                 const dy = cy - mouseRef.current.y;
                 const dist = Math.sqrt(dx*dx + dy*dy);
                 if (dist < 200) {
                     intensity += (1 - dist/200) * 155;
                 }
             }
          }

          if (intensity > 5) {
            const r = parseInt(config.colorPrimary.slice(1, 3), 16);
            const g = parseInt(config.colorPrimary.slice(3, 5), 16);
            const b = parseInt(config.colorPrimary.slice(5, 7), 16);
            
            const r2 = parseInt(config.colorSecondary.slice(1, 3), 16);
            const g2 = parseInt(config.colorSecondary.slice(3, 5), 16);
            const b2 = parseInt(config.colorSecondary.slice(5, 7), 16);

            const ratio = Math.min(1, intensity / 255);
            const finalR = Math.floor(r * ratio + r2 * (1 - ratio));
            const finalG = Math.floor(g * ratio + g2 * (1 - ratio));
            const finalB = Math.floor(b * ratio + b2 * (1 - ratio));

            // Additive blending for light effects
            ctx.fillStyle = `rgba(${finalR}, ${finalG}, ${finalB}, ${Math.min(1, intensity/255)})`;
            ctx.fillRect(cx + pad, cy + pad, config.gridSize - pad*2, config.gridSize - pad*2);
          }
        }
      }
      
      animationRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationRef.current);
    };
  }, [config]);

  return (
    <div className="fixed inset-0 w-full h-full bg-black">
      {/* Video element is hidden but used as source */}
      <video 
        ref={videoRef}
        className="hidden"
        loop
        muted
        autoPlay
        playsInline
      />
      <canvas 
        ref={canvasRef}
        className="absolute inset-0 w-full h-full block" 
      />
    </div>
  );
};

export default VideoWall;

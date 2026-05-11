import React, { useEffect, useRef, useState } from 'react';

export interface VisualConfig {
  gridSize: number;
  decay: number;
  colorPrimary: string;
  colorSecondary: string;
  sensitivity: number;
  mode: 'ripple' | 'matrix' | 'plasma' | 'wave' | 'silhouette';
  activeShape: 'africa' | 'world';
  silhouetteSize: number;
  activeVideo: string | string[];
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
  const [videoIndex, setVideoIndex] = useState(0);
  const mouseRef = useRef({ x: 0, y: 0 });
  const timeRef = useRef(0);
  const animationRef = useRef<number>(0);

  // Grid state for ripple effect
  const gridRef = useRef<Float32Array>(new Float32Array(0));
  const prevGridRef = useRef<Float32Array>(new Float32Array(0));

  // Offscreen canvas for shape sampling
  const shapeCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Handle video playback
  const currentVideo = Array.isArray(config.activeVideo) ? config.activeVideo[videoIndex] : config.activeVideo;

  useEffect(() => {
    if (videoRef.current) {
      if (config.useVideoBackground && currentVideo) {
        videoRef.current.src = currentVideo;
        videoRef.current.play().catch(e => console.log("Autoplay prevented", e));
      } else {
        videoRef.current.pause();
      }
    }
  }, [config.useVideoBackground, currentVideo]);

  const handleVideoEnded = () => {
    if (Array.isArray(config.activeVideo) && config.activeVideo.length > 1) {
      setVideoIndex((prev) => {
        let nextIndex;
        do {
          nextIndex = Math.floor(Math.random() * config.activeVideo.length);
        } while (nextIndex === prev); // Ensure we don't play the same video twice in a row
        return nextIndex;
      });
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
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
      
      // Clear background
      ctx.clearRect(0, 0, width, height);

      // Draw background
      if (config.useVideoBackground) {
        // Draw black mask with holes for video
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.fillRect(0, 0, width, height);
        
        ctx.globalCompositeOperation = 'destination-out';
        
        // Draw all grid cells to punch holes
        const cols = Math.ceil(width / config.gridSize);
        const rows = Math.ceil(height / config.gridSize);
        
        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < cols; x++) {
                const cx = x * config.gridSize;
                const cy = y * config.gridSize;
                const pad = 1;
                ctx.fillRect(cx + pad, cy + pad, config.gridSize - pad*2, config.gridSize - pad*2);
            }
        }
        
        ctx.globalCompositeOperation = 'source-over';
      }
      // Removed the solid black background fallback so it's transparent

      const cols = Math.ceil(width / config.gridSize);
      const rows = Math.ceil(height / config.gridSize);

      // Mouse interaction
      const mx = Math.floor(mouseRef.current.x / config.gridSize);
      const my = Math.floor(mouseRef.current.y / config.gridSize);
      
      if (mx >= 0 && mx < cols && my >= 0 && my < rows) {
        const index = my * cols + mx;
        prevGridRef.current[index] = config.sensitivity * 255;
      }

      // Update physics/simulation based on mode
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

      // Draw Effects
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
             shapeCtx.save();
             shapeCtx.translate(width / 2, height / 2);
             const baseScale = Math.min(width, height) / 800;
             const scale = baseScale * config.silhouetteSize;
             shapeCtx.scale(scale, scale);
             shapeCtx.translate(-450, -300);
             const path = new Path2D(config.activeShape === 'africa' ? AFRICA_PATH : SHAPES.world);
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
             } else {
                 intensity = 0;
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

            // If video background is active, we might want to blend differently
            // For now, standard blending (source-over) works well to "light up" the LEDs over the video
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
    <div className="absolute inset-0 w-full h-full z-0 pointer-events-none">
      <video 
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover opacity-80 mix-blend-screen"
        loop={!Array.isArray(config.activeVideo)}
        muted
        playsInline
        onEnded={handleVideoEnded}
        style={{ display: config.useVideoBackground ? 'block' : 'none' }}
      />
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full block z-10" 
      />
    </div>
  );
};

export default VideoWall;

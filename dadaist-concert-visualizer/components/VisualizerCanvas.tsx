import React, { useRef, useEffect, useMemo } from 'react';
import { AudioData, VisualizerSettings, Shard, Particle, ShapeType } from '../types';

interface Props {
  audioData: AudioData;
  settings: VisualizerSettings;
}

const COLORS = {
  original: ['#E8BC50', '#F5F5F5', '#1A1A1A', '#050505', '#D4AF37'],
  neon: ['#FF00FF', '#00FFFF', '#FFFF00', '#110033', '#FFFFFF'],
  monochrome: ['#FFFFFF', '#DDDDDD', '#999999', '#333333', '#000000'],
  red: ['#D32F2F', '#FF5252', '#B71C1C', '#FFCDD2', '#212121'],
  green: ['#388E3C', '#69F0AE', '#1B5E20', '#C8E6C9', '#212121'],
  blue: ['#1565C0', '#2196F3', '#64B5F6', '#BBDEFB', '#0D47A1'],
  orange: ['#E65100', '#EF6C00', '#FFA726', '#FFCC80', '#BF360C'],
  purple: ['#6A1B9A', '#8E24AA', '#AB47BC', '#E1BEE7', '#4A148C'],
  mixed: ['#D32F2F', '#388E3C', '#1976D2', '#FBC02D', '#E65100', '#7B1FA2', '#FFFFFF', '#1A1A1A']
};

const IRIS_THEMES: Record<string, { base: string, accents: string[], line: string }> = {
  default: { base: '#555555', accents: ['#880000', '#FF3333', '#008800', '#33FF33'], line: '#333333' },
  blue: { base: '#0D47A1', accents: ['#4FC3F7', '#29B6F6', '#039BE5', '#0288D1'], line: '#002171' },
  purple: { base: '#4A148C', accents: ['#E1BEE7', '#BA68C8', '#9C27B0', '#7B1FA2'], line: '#38006b' },
  green: { base: '#1B5E20', accents: ['#66BB6A', '#43A047', '#2E7D32', '#1B5E20'], line: '#003300' },
  red: { base: '#B71C1C', accents: ['#EF5350', '#F44336', '#E53935', '#D32F2F'], line: '#7f0000' },
  gold: { base: '#E65100', accents: ['#FFCA28', '#FFC107', '#FFB300', '#FFA000'], line: '#BF360C' },
  teal: { base: '#004D40', accents: ['#80CBC4', '#4DB6AC', '#26A69A', '#009688'], line: '#00251A' },
  orange: { base: '#BF360C', accents: ['#FFCCBC', '#FFAB91', '#FF8A65', '#FF7043'], line: '#3E2723' },
  pink: { base: '#880E4F', accents: ['#F8BBD0', '#F48FB1', '#F06292', '#EC407A'], line: '#311B92' },
};

const SHAPE_TYPES: ShapeType[] = ['triangle', 'polygon', 'organic', 'circle', 'square', 'pentagon', 'hexagon', 'star', 'diamond', 'cross', 'cube', 'pyramid', 'cylinder', 'cone', 'prism', 'sponge', 'africa', 'torus', 'dodecahedron'];

// Helper to invert hex colors
const invertColor = (hex: string) => {
  if (hex.indexOf('#') === 0) hex = hex.slice(1);
  if (hex.length === 3) hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  if (hex.length !== 6) return '#FFFFFF';
  const r = (255 - parseInt(hex.slice(0, 2), 16)).toString(16).padStart(2, '0');
  const g = (255 - parseInt(hex.slice(2, 4), 16)).toString(16).padStart(2, '0');
  const b = (255 - parseInt(hex.slice(4, 6), 16)).toString(16).padStart(2, '0');
  return '#' + r + g + b;
};

export const VisualizerCanvas: React.FC<Props> = ({ audioData, settings }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const shardsRef = useRef<Shard[]>([]);
  const frameCountRef = useRef(0);
  
  // Initialize Shards
  useEffect(() => {
    const initShards = () => {
      const newShards: Shard[] = [];
      const numShards = 150;
      const scheme = COLORS[settings.colorScheme];

      for (let i = 0; i < numShards; i++) {
        let type: ShapeType;
        if (settings.selectedShape !== 'random') {
            type = settings.selectedShape;
        } else {
            type = SHAPE_TYPES[Math.floor(Math.random() * SHAPE_TYPES.length)];
        }

        newShards.push({
          x: 0, 
          y: 0,
          angle: Math.random() * Math.PI * 2,
          distance: 100 + Math.random() * 800,
          size: 20 + Math.random() * 150,
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.02,
          color: scheme[Math.floor(Math.random() * scheme.length)],
          colorSeed: Math.random(), 
          type: type,
          layer: Math.floor(Math.random() * 3),
          particles: [],
          morphOffsets: Array.from({ length: 8 }, () => Math.random() * Math.PI * 2)
        });
      }
      
      newShards.sort((a, b) => a.layer - b.layer);
      shardsRef.current = newShards;
    };

    initShards();
  }, [settings.colorScheme, settings.selectedShape]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;

    const render = () => {
      frameCountRef.current++;
      
      if (canvas.width !== window.innerWidth || canvas.height !== window.innerHeight) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }

      const { width, height } = canvas;
      const cx = width / 2;
      const cy = height / 2;

      const bassFactor = (audioData.bass / 255) * settings.sensitivity;
      const midFactor = (audioData.mid / 255) * settings.sensitivity;
      const trebleFactor = (audioData.treble / 255) * settings.sensitivity;
      const volFactor = audioData.volume * settings.sensitivity;

      let bgColor = '#050505';
      if (settings.strobeEnabled && bassFactor > 0.8 && frameCountRef.current % 4 === 0) {
        bgColor = '#222';
      }
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, width, height);

      const currentScheme = COLORS[settings.colorScheme];
      const isHighTreble = trebleFactor > 0.6;

      const drawPolygon = (ctx: CanvasRenderingContext2D, sides: number, radius: number) => {
        const step = (Math.PI * 2) / sides;
        const startAngle = -Math.PI / 2;
        ctx.moveTo(Math.cos(startAngle) * radius, Math.sin(startAngle) * radius);
        for (let i = 1; i < sides; i++) {
          const angle = startAngle + step * i;
          ctx.lineTo(Math.cos(angle) * radius, Math.sin(angle) * radius);
        }
      };

      const drawStar = (ctx: CanvasRenderingContext2D, points: number, outer: number, inner: number) => {
        const step = (Math.PI * 2) / points;
        const halfStep = step / 2;
        const startAngle = -Math.PI / 2;

        for (let i = 0; i < points; i++) {
          const angle = startAngle + step * i;
          const xOuter = Math.cos(angle) * outer;
          const yOuter = Math.sin(angle) * outer;
          if (i === 0) ctx.moveTo(xOuter, yOuter);
          else ctx.lineTo(xOuter, yOuter);

          const angleInner = angle + halfStep;
          const xInner = Math.cos(angleInner) * inner;
          const yInner = Math.sin(angleInner) * inner;
          ctx.lineTo(xInner, yInner);
        }
      };

      const drawShape = (shard: Shard, size: number) => {
        ctx.beginPath();
        const r = size / 2;

        switch (shard.type) {
            case 'organic':
                const points = shard.morphOffsets.length;
                const radiusBase = size / 2;
                const vertices = shard.morphOffsets.map((offset, i) => {
                    const angle = (i / points) * Math.PI * 2;
                    const time = frameCountRef.current * 0.05;
                    const distortion = Math.sin(time + offset) * 0.2 + (bassFactor * 0.25 * Math.cos(time * 2 + i));
                    const r = radiusBase * (0.8 + distortion);
                    return { x: Math.cos(angle) * r, y: Math.sin(angle) * r };
                });
                const mid = (p1: {x:number, y:number}, p2: {x:number, y:number}) => ({ x: (p1.x + p2.x)/2, y: (p1.y + p2.y)/2 });
                const start = mid(vertices[vertices.length-1], vertices[0]);
                ctx.moveTo(start.x, start.y);
                for(let i=0; i<vertices.length; i++) {
                    const p1 = vertices[i];
                    const p2 = vertices[(i+1)%vertices.length];
                    const m = mid(p1, p2);
                    ctx.quadraticCurveTo(p1.x, p1.y, m.x, m.y);
                }
                break;
            case 'circle': ctx.arc(0, 0, r, 0, Math.PI * 2); break;
            case 'square': ctx.rect(-r, -r, size, size); break;
            case 'triangle': drawPolygon(ctx, 3, r); break;
            case 'pentagon': drawPolygon(ctx, 5, r); break;
            case 'hexagon': drawPolygon(ctx, 6, r); break;
            case 'star': drawStar(ctx, 5, r, r * 0.5); break;
            case 'diamond':
                ctx.moveTo(0, -r); ctx.lineTo(r * 0.7, 0); ctx.lineTo(0, r); ctx.lineTo(-r * 0.7, 0);
                break;
            case 'cross':
                 const w = r * 0.35;
                 ctx.moveTo(-w, -r); ctx.lineTo(w, -r); ctx.lineTo(w, -w); ctx.lineTo(r, -w);
                 ctx.lineTo(r, w); ctx.lineTo(w, w); ctx.lineTo(w, r); ctx.lineTo(-w, r);
                 ctx.lineTo(-w, w); ctx.lineTo(-r, w); ctx.lineTo(-r, -w); ctx.lineTo(-w, -w);
                 break;
            case 'cube':
                 const hexR = r * 0.9;
                 for(let i=0; i<6; i++) {
                    const angle = Math.PI/6 + i * Math.PI/3;
                    const px = Math.cos(angle) * hexR;
                    const py = Math.sin(angle) * hexR;
                    if(i===0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
                 }
                 break;
            case 'cylinder':
                 const cylW = r * 0.7; const cylH = r;
                 ctx.ellipse(0, -cylH * 0.5, cylW, cylW * 0.3, 0, Math.PI, 0);
                 ctx.lineTo(cylW, cylH * 0.5);
                 ctx.ellipse(0, cylH * 0.5, cylW, cylW * 0.3, 0, 0, Math.PI);
                 ctx.lineTo(-cylW, -cylH * 0.5);
                 break;
            case 'cone':
                 const coneW = r * 0.8; const coneH = r;
                 ctx.moveTo(coneW, coneH * 0.5);
                 ctx.ellipse(0, coneH * 0.5, coneW, coneW * 0.3, 0, 0, Math.PI);
                 ctx.lineTo(0, -coneH); ctx.lineTo(coneW, coneH * 0.5);
                 break;
            case 'pyramid':
                 ctx.moveTo(0, -r); ctx.lineTo(r * 0.7, r * 0.7); ctx.lineTo(0, r * 0.9); ctx.lineTo(-r * 0.7, r * 0.7);
                 break;
            case 'prism':
                 ctx.moveTo(0, -r); ctx.lineTo(-r, r*0.5); ctx.lineTo(r*0.5, r*0.5); ctx.lineTo(r, -r*0.5);
                 break;
            case 'sponge':
                 const segments = 24;
                 for (let i = 0; i <= segments; i++) {
                    const theta = (i / segments) * Math.PI * 2;
                    const noise = Math.sin(theta * 10 + frameCountRef.current * 0.1) * 0.1 + (Math.random() - 0.5) * 0.3;
                    const rad = r * (0.85 + noise);
                    const px = Math.cos(theta) * rad;
                    const py = Math.sin(theta) * rad;
                    if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
                 }
                 break;
            case 'africa':
                 // Refined silhouette
                 ctx.moveTo(-0.3 * r, -0.95 * r); // North point (Tunisia area)
                 ctx.lineTo(0.1 * r, -0.9 * r);
                 ctx.lineTo(0.6 * r, -0.8 * r); // Egypt area
                 ctx.lineTo(0.7 * r, -0.5 * r); // Red Sea coast
                 ctx.lineTo(1.0 * r, -0.1 * r); // Horn of Africa
                 ctx.lineTo(0.6 * r, 0.5 * r); // East coast
                 ctx.lineTo(0.2 * r, 1.0 * r); // South point
                 ctx.lineTo(-0.3 * r, 0.4 * r); // Southwest
                 ctx.lineTo(-0.1 * r, 0.1 * r); // Gulf of Guinea
                 ctx.lineTo(-1.0 * r, -0.2 * r); // West bulge
                 ctx.lineTo(-0.7 * r, -0.7 * r); // Northwest coast
                 ctx.lineTo(-0.3 * r, -0.95 * r);
                 break;
            case 'torus':
                 ctx.arc(0, 0, r, 0, Math.PI * 2, false);
                 ctx.moveTo(r * 0.5, 0);
                 ctx.arc(0, 0, r * 0.5, 0, Math.PI * 2, true);
                 break;
            case 'dodecahedron':
                 drawPolygon(ctx, 10, r);
                 break;
            case 'polygon':
            default:
                ctx.moveTo(-size / 2, -size / 2); ctx.lineTo(size / 2, -size / 3);
                ctx.lineTo(size / 3, size / 2); ctx.lineTo(-size / 2, size / 2);
                break;
        }

        ctx.closePath();
        if (!settings.wireframeMode) {
            ctx.fill();
        }
        ctx.stroke(); 

        ctx.beginPath();
        switch(shard.type) {
            case 'cube':
                const cubeHexR = r * 0.9;
                ctx.moveTo(0, 0); ctx.lineTo(Math.cos(Math.PI/6) * cubeHexR, Math.sin(Math.PI/6) * cubeHexR);
                ctx.moveTo(0, 0); ctx.lineTo(Math.cos(Math.PI/6 + 2*Math.PI/3) * cubeHexR, Math.sin(Math.PI/6 + 2*Math.PI/3) * cubeHexR);
                ctx.moveTo(0, 0); ctx.lineTo(Math.cos(Math.PI/6 + 4*Math.PI/3) * cubeHexR, Math.sin(Math.PI/6 + 4*Math.PI/3) * cubeHexR);
                break;
            case 'cylinder':
                const internalCylW = r * 0.7; const internalCylH = r;
                ctx.moveTo(internalCylW, -internalCylH * 0.5);
                ctx.ellipse(0, -internalCylH * 0.5, internalCylW, internalCylW * 0.3, 0, 0, Math.PI * 2);
                break;
            case 'pyramid': ctx.moveTo(0, -r); ctx.lineTo(0, r * 0.9); break;
            case 'prism': ctx.moveTo(0, -r); ctx.lineTo(r*0.5, r*0.5); break;
            case 'sponge':
                const holes = 6;
                for(let i=0; i<holes; i++) {
                    const ang = Math.random() * Math.PI * 2;
                    const dist = Math.random() * r * 0.6;
                    const holeX = Math.cos(ang) * dist;
                    const holeY = Math.sin(ang) * dist;
                    const holeR = r * (0.05 + Math.random() * 0.15);
                    ctx.moveTo(holeX + holeR, holeY); ctx.arc(holeX, holeY, holeR, 0, Math.PI * 2);
                }
                break;
            case 'africa':
                // Refined Internal Details with mid-frequency thickness
                ctx.save();
                ctx.lineWidth = 0.5 + (midFactor * 3.5);
                
                // 1. More complex Great Rift Valley
                ctx.moveTo(0.45 * r, -0.4 * r);
                ctx.lineTo(0.52 * r, -0.1 * r);
                ctx.lineTo(0.48 * r, 0.2 * r);
                ctx.lineTo(0.4 * r, 0.5 * r);
                ctx.lineTo(0.3 * r, 0.8 * r);

                // 2. Comprehensive Great Lakes
                // Lake Victoria
                ctx.moveTo(0.56 * r, -0.05 * r);
                ctx.ellipse(0.48 * r, -0.05 * r, 0.08 * r, 0.06 * r, 0, 0, Math.PI * 2);
                // Lake Tanganyika
                ctx.moveTo(0.46 * r, 0.25 * r);
                ctx.ellipse(0.43 * r, 0.25 * r, 0.03 * r, 0.12 * r, 0.2, 0, Math.PI * 2);
                // Lake Malawi
                ctx.moveTo(0.47 * r, 0.55 * r);
                ctx.ellipse(0.45 * r, 0.55 * r, 0.02 * r, 0.09 * r, -0.1, 0, Math.PI * 2);
                
                // 3. Atlas Mountains (NW jagged lines)
                ctx.moveTo(-0.8 * r, -0.55 * r);
                ctx.lineTo(-0.7 * r, -0.65 * r);
                ctx.lineTo(-0.6 * r, -0.58 * r);
                ctx.lineTo(-0.5 * r, -0.68 * r);

                // 4. Ethiopian Highlands
                ctx.moveTo(0.35 * r, -0.55 * r);
                ctx.lineTo(0.5 * r, -0.45 * r);
                ctx.lineTo(0.65 * r, -0.5 * r);

                // 5. Drakensberg
                ctx.moveTo(0.15 * r, 0.65 * r);
                ctx.lineTo(0.3 * r, 0.75 * r);
                ctx.lineTo(0.2 * r, 0.85 * r);

                // 6. Major Rivers (Nile, Congo, Niger)
                // Nile
                ctx.moveTo(0.48 * r, -0.1 * r);
                ctx.quadraticCurveTo(0.35 * r, -0.5 * r, 0.55 * r, -0.9 * r);
                // Congo
                ctx.moveTo(0.3 * r, 0.2 * r);
                ctx.bezierCurveTo(0.1 * r, 0.1 * r, -0.2 * r, 0.3 * r, -0.1 * r, 0.45 * r);
                // Niger
                ctx.moveTo(-0.3 * r, -0.2 * r);
                ctx.bezierCurveTo(-0.5 * r, -0.1 * r, -0.8 * r, -0.3 * r, -0.7 * r, -0.5 * r);

                // 7. Madagascar
                const mX = 0.88 * r; const mY = 0.62 * r;
                ctx.moveTo(mX, mY - 0.2 * r);
                ctx.lineTo(mX + 0.1 * r, mY + 0.1 * r);
                ctx.lineTo(mX - 0.05 * r, mY + 0.22 * r);
                ctx.closePath();
                
                ctx.restore();
                break;
            case 'dodecahedron':
                const dInnerR = r * 0.55;
                drawPolygon(ctx, 5, dInnerR);
                for (let i = 0; i < 5; i++) {
                  const pAng = -Math.PI / 2 + (i * Math.PI * 2) / 5;
                  const dAng = -Math.PI / 2 + (i * 2 * Math.PI * 2) / 10;
                  ctx.moveTo(Math.cos(pAng) * dInnerR, Math.sin(pAng) * dInnerR);
                  ctx.lineTo(Math.cos(dAng) * r, Math.sin(dAng) * r);
                }
                break;
        }
        ctx.stroke();
      };

      shardsRef.current.forEach((shard, i) => {
        const orbitSpeed = settings.rotationSpeed * 0.002 * (1 + bassFactor);
        shard.angle += shard.rotationSpeed + (i % 2 === 0 ? orbitSpeed : -orbitSpeed);
        shard.rotation += shard.rotationSpeed * (1 + midFactor * 2);

        const pulseDist = 1 + (bassFactor * 0.2);
        const currentDist = shard.distance * pulseDist;
        
        const baseX = cx + Math.cos(shard.angle) * currentDist;
        const baseY = cy + Math.sin(shard.angle) * currentDist;

        if (baseX < -200 || baseX > width + 200 || baseY < -200 || baseY > height + 200) return;

        let drawX = baseX;
        let drawY = baseY;
        let drawRotation = shard.rotation;
        let scaleMult = 1;
        
        const paletteBase = Math.floor(shard.colorSeed * 100);
        const colorIndex = Math.floor(paletteBase + (bassFactor * 10) + (midFactor * 5)) % currentScheme.length;
        let drawColor = currentScheme[colorIndex];
        let strokeColor = currentScheme[(colorIndex + 2) % currentScheme.length];

        // Wireframe Pulse Logic
        if (settings.wireframeMode) {
          // A bright pulsing wireframe color
          const hue = 180; // Cyan base
          const brightness = 50 + (midFactor * 40);
          strokeColor = `hsl(${hue}, 100%, ${brightness}%)`;
          drawColor = 'transparent';
        }

        let isGlitchingShard = false;
        let blendMode: GlobalCompositeOperation = 'source-over';
        let shadowBlur = 0;
        let shadowColor = 'rgba(0,0,0,0)';
        let isColorInverted = false;

        if (isHighTreble && Math.random() < (trebleFactor * 0.7)) {
            isGlitchingShard = true;
            const offsetRange = 200 * trebleFactor;
            drawX += (Math.random() - 0.5) * offsetRange;
            drawY += (Math.random() - 0.5) * offsetRange;
            drawRotation += (Math.random() * Math.PI * 2);
            scaleMult = 0.3 + Math.random() * 2.5; 

            if (!settings.wireframeMode) {
              if (Math.random() < 0.3 * trebleFactor) {
                  isColorInverted = true;
                  drawColor = invertColor(drawColor);
                  strokeColor = invertColor(strokeColor);
              } else {
                  drawColor = Math.random() > 0.4 ? '#FFFFFF' : currentScheme[Math.floor(Math.random() * currentScheme.length)];
                  strokeColor = Math.random() > 0.5 ? '#000000' : '#FFFFFF';
              }
            } else {
              // Glitch wireframe colors
              strokeColor = Math.random() > 0.5 ? '#FFFFFF' : '#00FFFF';
            }

            const modes: GlobalCompositeOperation[] = ['screen', 'overlay', 'color-dodge', 'hard-light', 'difference', 'xor'];
            blendMode = modes[Math.floor(Math.random() * modes.length)];

            shadowColor = strokeColor;
            shadowBlur = 30 * trebleFactor;
        } else {
            shadowColor = 'rgba(0,0,0,0.5)';
            shadowBlur = 4 + (shard.layer * 2);
        }
        
        const layerScale = 0.8 + (shard.layer * 0.2); 
        const audioScale = 1 + (midFactor * 0.3) + (bassFactor * 0.35); // Pulse size linked to bass
        const finalScale = layerScale * audioScale * scaleMult;

        // --- PARTICLE TRAILS ---
        const emissionThreshold = 0.9 - (Math.min(volFactor, 0.8)); 
        if (Math.random() > emissionThreshold && settings.trailLength > 0) {
            const count = 2 + Math.floor(trebleFactor * 4) + Math.floor(settings.trailLength / 5);
            for(let k=0; k<count; k++) {
                const speed = (1.0 + bassFactor * 3) * (settings.rotationSpeed || 1) * (0.5 + Math.random());
                const angle = Math.random() * Math.PI * 2;
                const baseDecay = 0.02 + (Math.random() * 0.03);
                const decayModifier = 1 + (settings.trailLength * 0.1); 
                const decay = baseDecay / decayModifier;
                const layerSizeMod = 1 + (shard.layer * 0.2); 
                const audioSizeMod = 1 + (bassFactor * 0.4);
                const particleSize = (Math.random() * 3 + 2) * layerSizeMod * audioSizeMod;
                
                // Particle Spin set at birth as a base seed value
                const particleSpinSeed = (Math.random() - 0.5) * 0.12;

                shard.particles.push({
                    x: drawX + (Math.random() - 0.5) * shard.size * 0.5,
                    y: drawY + (Math.random() - 0.5) * shard.size * 0.5,
                    vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed,
                    life: 1.0, decay: decay, size: particleSize, color: settings.wireframeMode ? strokeColor : drawColor,
                    rotation: Math.random() * Math.PI * 2, 
                    spin: particleSpinSeed
                });
            }
        }

        if (settings.trailOpacity > 0.01) {
            ctx.save();
            const layerOpacityMult = 0.3 + (shard.layer * 0.35); 
            for (let pIndex = shard.particles.length - 1; pIndex >= 0; pIndex--) {
                const p = shard.particles[pIndex];
                
                // Update rotation using p.spin as a base, influenced real-time by mid frequencies
                p.rotation += p.spin * (1 + midFactor * 6);
                
                p.x += p.vx; p.y += p.vy; p.life -= p.decay;
                
                if (p.life > 0) {
                    const alpha = p.life * settings.trailOpacity * layerOpacityMult;
                    const currentSize = p.size * p.life * (1 + (bassFactor * 0.1));
                    ctx.save();
                    ctx.globalAlpha = alpha;
                    ctx.translate(p.x, p.y); 
                    ctx.rotate(p.rotation);
                    ctx.fillStyle = p.color; 
                    if (settings.wireframeMode) {
                      ctx.strokeStyle = p.color;
                      ctx.strokeRect(-currentSize/2, -currentSize/2, currentSize, currentSize);
                    } else {
                      ctx.fillRect(-currentSize/2, -currentSize/2, currentSize, currentSize);
                    }
                    ctx.restore();
                } else { shard.particles.splice(pIndex, 1); }
            }
            ctx.restore();
        } else { shard.particles = []; }

        // --- DRAW CURRENT SHARD ---
        ctx.save();
        ctx.translate(drawX, drawY);
        ctx.rotate(drawRotation);
        ctx.scale(finalScale, finalScale);
        
        // Pulse opacity linked to bass
        const baseAlpha = 0.6 + (shard.layer * 0.1);
        ctx.globalAlpha = Math.min(1.0, baseAlpha + (bassFactor * 0.4));
        
        ctx.globalCompositeOperation = blendMode;
        
        ctx.fillStyle = drawColor;
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = settings.wireframeMode ? (1 + midFactor * 5) : (1 + midFactor * 3); 
        ctx.shadowColor = shadowColor;
        ctx.shadowBlur = shadowBlur;
        ctx.shadowOffsetX = isGlitchingShard ? (Math.random()-0.5)*15 : 2 + shard.layer;
        ctx.shadowOffsetY = isGlitchingShard ? (Math.random()-0.5)*15 : 2 + shard.layer;

        drawShape(shard, shard.size);

        if (isGlitchingShard) {
            ctx.save();
            ctx.globalCompositeOperation = 'multiply';
            ctx.fillStyle = 'rgba(0,0,0,0.4)';
            const scanlineCount = Math.floor(4 + Math.random() * 6);
            for(let s=0; s<scanlineCount; s++) {
                const sy = -shard.size + (Math.random() * shard.size * 2);
                ctx.fillRect(-shard.size, sy, shard.size * 2, 2);
            }
            ctx.restore();

            // TREBLE-REACTIVE SCANLINE ARTIFACTS
            ctx.save();
            ctx.globalAlpha = 0.5 * trebleFactor;
            ctx.strokeStyle = settings.wireframeMode ? strokeColor : '#FFFFFF';
            ctx.lineWidth = 0.5;
            for (let sl = -shard.size; sl < shard.size; sl += 6) {
                ctx.beginPath();
                ctx.moveTo(-shard.size, sl);
                ctx.lineTo(shard.size, sl);
                ctx.stroke();
            }
            ctx.restore();

            if (Math.random() < 0.5) {
                ctx.save();
                ctx.globalAlpha = 0.6;
                const streakCount = 8;
                for(let st=0; st<streakCount; st++) {
                    const sty = -shard.size/2 + (Math.random() * shard.size);
                    const stw = shard.size * (1 + Math.random() * 2 * trebleFactor);
                    const sth = 1 + Math.random() * 4;
                    const stx = (Math.random() > 0.5 ? -shard.size : 0) + (Math.random() - 0.5) * 20;
                    if (settings.wireframeMode) {
                        ctx.strokeStyle = strokeColor;
                        ctx.strokeRect(stx, sty, stw, sth);
                    } else {
                        ctx.fillRect(stx, sty, stw, sth);
                    }
                }
                ctx.restore();
            }
        } else if (!settings.wireframeMode) {
            ctx.globalCompositeOperation = 'source-atop';
            ctx.fillStyle = 'rgba(255,255,255,0.05)';
            ctx.fillRect(-shard.size, -shard.size, shard.size * 2, shard.size * 2);
        }

        ctx.restore();
      });

      if (settings.showEye) {
        ctx.save();
        ctx.translate(cx, cy);
        const eyeScale = 1 + (bassFactor * 0.3);
        ctx.scale(eyeScale, eyeScale);
        if (volFactor > 0.6) {
            ctx.translate((Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10);
        }
        ctx.beginPath();
        ctx.moveTo(-150, 0); ctx.quadraticCurveTo(0, -100, 150, 0); ctx.quadraticCurveTo(0, 100, -150, 0);
        ctx.closePath();
        const stress = Math.min(1, (bassFactor * 0.5) + (trebleFactor * 0.5));
        const rSclera = Math.floor(240 + (stress * 15));
        const gSclera = Math.floor(240 - (stress * 40));
        const bSclera = Math.floor(240 - (stress * 40));
        
        if (settings.wireframeMode) {
          ctx.strokeStyle = `hsl(180, 100%, ${60 + midFactor * 40}%)`;
          ctx.lineWidth = 2;
          ctx.stroke();
        } else {
          ctx.fillStyle = `rgb(${rSclera}, ${gSclera}, ${bSclera})`;
          ctx.fill();
        }
        
        ctx.save(); ctx.clip(); 
        ctx.fillStyle = 'rgba(0,0,0,0.03)';
        for(let j=0; j<20; j++) ctx.fillRect(Math.random()*300 - 150, Math.random()*200-100, 2, 2);
        ctx.shadowColor = 'rgba(0,0,0,0.2)'; ctx.shadowBlur = 10; ctx.stroke(); ctx.shadowColor = 'transparent';
        
        const t = frameCountRef.current;
        const lookX = (
          Math.sin(t * 0.006) * 0.5 + 
          Math.sin(t * 0.013) * 0.3 + 
          Math.sin(t * 0.027) * 0.2
        ) * 35;
        
        const lookY = (
          Math.cos(t * 0.005) * 0.5 + 
          Math.cos(t * 0.016) * 0.3 + 
          Math.cos(t * 0.033) * 0.2
        ) * 15;
        
        const irisTheme = IRIS_THEMES[settings.irisColor] || IRIS_THEMES.default;
        ctx.beginPath(); ctx.arc(lookX, lookY, 60, 0, Math.PI * 2); 
        if (!settings.wireframeMode) {
          ctx.fillStyle = irisTheme.base; ctx.fill();
        } else {
          ctx.strokeStyle = irisTheme.base; ctx.stroke();
        }
        
        ctx.save(); ctx.beginPath();
        const textureCount = 36;
        for(let k=0; k<textureCount; k++) {
            const ang = (k / textureCount) * Math.PI * 2 + (frameCountRef.current * 0.003);
            const rIn = 22 + Math.random() * 5; const rOut = 58 - Math.random() * 5;
            ctx.moveTo(lookX + Math.cos(ang) * rIn, lookY + Math.sin(ang) * rIn);
            ctx.lineTo(lookX + Math.cos(ang) * rOut, lookY + Math.sin(ang) * rOut);
        }
        ctx.strokeStyle = 'rgba(0,0,0,0.2)'; ctx.lineWidth = 1.5; ctx.stroke(); ctx.restore();
        ctx.lineWidth = 1.5;
        for(let r=10; r<60; r+=5) {
            ctx.beginPath(); ctx.arc(lookX, lookY, r, 0, Math.PI * 2);
            if (r === 50) ctx.strokeStyle = irisTheme.accents[0];
            else if (r === 30) ctx.strokeStyle = irisTheme.accents[1];
            else if (r === 40) ctx.strokeStyle = irisTheme.accents[2];
            else if (r === 20) ctx.strokeStyle = irisTheme.accents[3];
            else ctx.strokeStyle = irisTheme.line;
            ctx.stroke();
        }
        const pupilSize = 20 + (trebleFactor * 25);
        ctx.beginPath(); ctx.arc(lookX, lookY, pupilSize, 0, Math.PI * 2); 
        if (!settings.wireframeMode) {
          ctx.fillStyle = '#000'; ctx.fill();
        } else {
          ctx.strokeStyle = '#FFFFFF'; ctx.stroke();
        }
        
        ctx.beginPath(); ctx.arc(lookX + 15, lookY - 15, 8, 0, Math.PI * 2); 
        if (!settings.wireframeMode) {
          ctx.fillStyle = 'rgba(255,255,255,0.8)'; ctx.fill();
        } else {
          ctx.strokeStyle = '#FFFFFF'; ctx.stroke();
        }

        const time = Date.now();
        const blinkCycle = 4000;
        const tInCycle = time % blinkCycle;
        const blinkDuration = 300;
        let blinkOpenness = 1.0;
        if (tInCycle < blinkDuration) {
           const phase = tInCycle / blinkDuration; 
           if (phase < 0.5) blinkOpenness = 1 - (phase * 2); else blinkOpenness = (phase - 0.5) * 2;
        }
        const squint = Math.min(0.6, bassFactor * 0.6); 
        let topLidOpenness = Math.max(0, Math.min(1, blinkOpenness - (squint * 0.3)));
        const bottomLidUp = squint * 0.4;
        const lidColor = settings.colorScheme === 'original' ? '#E8BC50' : currentScheme[1];
        ctx.fillStyle = lidColor;
        ctx.strokeStyle = lidColor;
        const topControlY = 100 - (200 * topLidOpenness);
        ctx.beginPath(); ctx.moveTo(-150, 0); ctx.quadraticCurveTo(0, topControlY, 150, 0);
        ctx.lineTo(150, -200); ctx.lineTo(-150, -200); ctx.closePath(); 
        if (!settings.wireframeMode) ctx.fill(); else ctx.stroke();

        if (topLidOpenness > 0.1) {
            const creaseYOffset = topControlY - 30 - (50 * topLidOpenness);
            ctx.beginPath(); ctx.moveTo(-120, creaseYOffset + 20); ctx.quadraticCurveTo(0, creaseYOffset, 120, creaseYOffset + 20);
            ctx.strokeStyle = 'rgba(0,0,0,0.15)'; ctx.lineWidth = 3; ctx.stroke();
        }
        ctx.beginPath(); ctx.moveTo(-150, 0); ctx.quadraticCurveTo(0, topControlY, 150, 0);
        ctx.strokeStyle = settings.wireframeMode ? '#FFFFFF' : '#000'; ctx.lineWidth = 4; ctx.stroke();
        
        if (bottomLidUp > 0.05) {
            const bottomControlY = 100 - (150 * bottomLidUp);
            ctx.beginPath(); ctx.moveTo(-150, 0); ctx.quadraticCurveTo(0, bottomControlY, 150, 0);
            ctx.lineTo(150, 200); ctx.lineTo(-150, 200); ctx.closePath(); 
            if (!settings.wireframeMode) ctx.fill(); else ctx.stroke();
            ctx.beginPath(); ctx.moveTo(-150, 0); ctx.quadraticCurveTo(0, bottomControlY, 150, 0);
            ctx.strokeStyle = settings.wireframeMode ? '#FFFFFF' : '#000'; ctx.lineWidth = 3; ctx.stroke();
        }
        ctx.restore(); 
        ctx.beginPath(); ctx.moveTo(-150, 0); ctx.quadraticCurveTo(0, -100, 150, 0); ctx.quadraticCurveTo(0, 100, -150, 0);
        ctx.strokeStyle = settings.eyeOutlineStyle.color; ctx.lineWidth = settings.eyeOutlineStyle.width;
        ctx.shadowColor = settings.eyeOutlineStyle.shadowBlur > 0 ? settings.eyeOutlineStyle.color : 'transparent';
        ctx.shadowBlur = settings.eyeOutlineStyle.shadowBlur; ctx.stroke();
        ctx.shadowBlur = 0; ctx.shadowColor = 'transparent';
        ctx.restore();
      } else {
          ctx.beginPath(); ctx.arc(cx, cy, 50 * (1+bassFactor), 0, Math.PI*2);
          if (settings.wireframeMode) {
            ctx.strokeStyle = `hsl(180, 100%, ${50 + midFactor * 50}%)`;
            ctx.stroke();
          } else {
            ctx.fillStyle = currentScheme[0]; ctx.fill();
          }
      }

      if (settings.showBeam) {
        ctx.save();
        const beamSpeed = 15 * (Math.max(0.2, settings.rotationSpeed)) + 2;
        const beamWidth = 200;
        const beamLimit = width + beamWidth * 2;
        const beamTick = frameCountRef.current * beamSpeed;
        const xPos = (beamTick % beamLimit) - beamWidth;
        ctx.globalCompositeOperation = 'screen'; 
        const gradient = ctx.createLinearGradient(xPos, 0, xPos + beamWidth, 0);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0)');
        gradient.addColorStop(0.2, 'rgba(255, 255, 255, 0.05)'); 
        gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.2)');
        gradient.addColorStop(0.8, 'rgba(255, 255, 255, 0.05)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = gradient; ctx.fillRect(xPos, 0, beamWidth, height);
        ctx.shadowColor = '#FFFFFF'; ctx.shadowBlur = 20;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)'; ctx.fillRect(xPos + beamWidth/2 - 2, 0, 4, height);
        ctx.restore();
      }

      animationId = requestAnimationFrame(render);
    };

    render();
    return () => { cancelAnimationFrame(animationId); };
  }, [audioData, settings]);

  return <canvas ref={canvasRef} className="fixed inset-0 w-full h-full z-0" />;
};
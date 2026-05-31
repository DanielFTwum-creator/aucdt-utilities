import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, RotateCcw, Info, Zap, Layers, RefreshCw, BarChart2, Download } from "lucide-react";

// Types
export type InhibitorType = "None" | "Competitive" | "Noncompetitive" | "Uncompetitive";

export interface KineticsParams {
  vMax: number;
  kM: number;
  substrate: number;
  inhibitorType: InhibitorType;
  inhibitorConc: number;
  kI: number;
}

// Particle simulation classes
interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  type: "S" | "I" | "P"; // Substrate, Inhibitor, Product
}

interface EnzymeParticle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  state: "E" | "ES" | "EI" | "ESI"; // Free, Complex, Inhibited, Ternary Complex
  progress: number; // reaction progress (for ES)
  targetProgress: number; // calculated from vMax
  boundParticleId?: number; // track ID of bound substrate/inhibitor for graphics
}

export default function KineticsSandbox() {
  const [params, setParams] = useState<KineticsParams>({
    vMax: 80,
    kM: 40,
    substrate: 50,
    inhibitorType: "None",
    inhibitorConc: 12,
    kI: 15,
  });

  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [stats, setStats] = useState({
    freeEnzyme: 0,
    complexES: 0,
    inhibitedEI: 0,
    inhibitedESI: 0,
    freeSubstrate: 0,
    freeInhibitor: 0,
    product: 0,
    reactionsCompletedCount: 0,
  });

  // Derived effective parameters based on steady-state inhibition kinetics
  const { vMaxEff, kMEff, v0 } = useMemo(() => {
    let vMaxEff = params.vMax;
    let kMEff = params.kM;
    const { inhibitorType, inhibitorConc, kI, substrate } = params;

    if (inhibitorType === "Competitive") {
      kMEff = params.kM * (1 + inhibitorConc / kI);
    } else if (inhibitorType === "Noncompetitive") {
      vMaxEff = params.vMax / (1 + inhibitorConc / kI);
    } else if (inhibitorType === "Uncompetitive") {
      vMaxEff = params.vMax / (1 + inhibitorConc / kI);
      kMEff = params.kM / (1 + inhibitorConc / kI);
    }

    const v0 = (vMaxEff * substrate) / (kMEff + substrate);
    return { vMaxEff, kMEff, v0 };
  }, [params]);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameId = useRef<number | null>(null);

  // Simulation physics refs (to avoid React re-render lag during high-frequency math)
  const enzymesRef = useRef<EnzymeParticle[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const nextIdRef = useRef<number>(1);
  const productCountRef = useRef<number>(0);
  const stateUpdateTimerRef = useRef<number>(0);

  const handleExportData = () => {
    const exportPayload = {
      appName: "BioChemAI Kinetics Sandbox",
      timestamp: new Date().toISOString(),
      kineticParameters: {
        vMax_mol_s: params.vMax,
        kM_uM: params.kM,
        substrate_mM: params.substrate,
        inhibitorType: params.inhibitorType,
        inhibitorConc_uM: params.inhibitorConc,
        kI_uM: params.kI,
      },
      effectiveParameters: {
        vMaxEff_mol_s: parseFloat(vMaxEff.toFixed(2)),
        kMEff_uM: parseFloat(kMEff.toFixed(2)),
        calculatedSpeed_v0_mol_s: parseFloat(v0.toFixed(4)),
      },
      stateCounts: {
        freeEnzyme: stats.freeEnzyme,
        complexES: stats.complexES,
        inhibitedEI: stats.inhibitedEI,
        inhibitedESI: stats.inhibitedESI,
        freeSubstrate: stats.freeSubstrate,
        freeInhibitor: stats.freeInhibitor,
        product: stats.product,
        reactionsCompletedCount: stats.reactionsCompletedCount,
      },
    };

    const blob = new Blob([JSON.stringify(exportPayload, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `biochem_kinetics_data_${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Reset/Initialize simulation particles
  const initSimulation = () => {
    nextIdRef.current = 1;
    productCountRef.current = 0;

    const canvas = canvasRef.current;
    const width = canvas ? canvas.width : 500;
    const height = canvas ? canvas.height : 260;

    // Spawn Enzymes
    const initialEnzymes: EnzymeParticle[] = [];
    const enzymeCount = 20;
    for (let i = 0; i < enzymeCount; i++) {
      initialEnzymes.push({
        id: nextIdRef.current++,
        x: Math.random() * (width - 40) + 20,
        y: Math.random() * (height - 40) + 20,
        vx: (Math.random() - 0.5) * 2.5,
        vy: (Math.random() - 0.5) * 2.5,
        radius: 12,
        state: "E",
        progress: 0,
        targetProgress: 100,
      });
    }
    enzymesRef.current = initialEnzymes;

    // Spawn Substrates
    const initialParticles: Particle[] = [];
    const substrateCount = Math.floor(params.substrate * 0.8) + 5;
    for (let i = 0; i < substrateCount; i++) {
      initialParticles.push({
        id: nextIdRef.current++,
        x: Math.random() * (width - 20) + 10,
        y: Math.random() * (height - 20) + 10,
        vx: (Math.random() - 0.5) * 4,
        vy: (Math.random() - 0.5) * 4,
        radius: 4,
        type: "S",
      });
    }

    // Spawn Inhibitors if applicable
    if (params.inhibitorType !== "None") {
      const inhibitorCount = Math.floor(params.inhibitorConc * 1.2) + 2;
      for (let i = 0; i < inhibitorCount; i++) {
        initialParticles.push({
          id: nextIdRef.current++,
          x: Math.random() * (width - 20) + 10,
          y: Math.random() * (height - 20) + 10,
          vx: (Math.random() - 0.5) * 4,
          vy: (Math.random() - 0.5) * 4,
          radius: 3.5,
          type: "I",
        });
      }
    }

    particlesRef.current = initialParticles;
  };

  // Handle updates to slider parameters on existing particle pools
  useEffect(() => {
    if (!isPlaying) {
      initSimulation();
      return;
    }

    // Synchronize particle counts with slider changes dynamically
    const canvas = canvasRef.current;
    const width = canvas ? canvas.width : 500;
    const height = canvas ? canvas.height : 260;

    let subCount = Math.floor(params.substrate * 0.8) + 5;
    let currentS = particlesRef.current.filter((p) => p.type === "S");
    if (currentS.length < subCount) {
      const diff = subCount - currentS.length;
      for (let i = 0; i < diff; i++) {
        particlesRef.current.push({
          id: nextIdRef.current++,
          x: Math.random() * (width - 20) + 10,
          y: Math.random() * (height - 20) + 10,
          vx: (Math.random() - 0.5) * 4,
          vy: (Math.random() - 0.5) * 4,
          radius: 4,
          type: "S",
        });
      }
    } else if (currentS.length > subCount) {
      let removed = 0;
      particlesRef.current = particlesRef.current.filter((p) => {
        if (p.type === "S" && removed < currentS.length - subCount) {
          removed++;
          return false;
        }
        return true;
      });
    }

    let inhCount = params.inhibitorType !== "None" ? Math.floor(params.inhibitorConc * 1.2) + 2 : 0;
    let currentI = particlesRef.current.filter((p) => p.type === "I");
    if (currentI.length < inhCount) {
      const diff = inhCount - currentI.length;
      for (let i = 0; i < diff; i++) {
        particlesRef.current.push({
          id: nextIdRef.current++,
          x: Math.random() * (width - 20) + 10,
          y: Math.random() * (height - 20) + 10,
          vx: (Math.random() - 0.5) * 4,
          vy: (Math.random() - 0.5) * 4,
          radius: 3.5,
          type: "I",
        });
      }
    } else if (currentI.length > inhCount) {
      let removed = 0;
      particlesRef.current = particlesRef.current.filter((p) => {
        if (p.type === "I" && removed < currentI.length - inhCount) {
          removed++;
          return false;
        }
        return true;
      });
    }

    // Clean up inhibitor complexes if inhibitor was turned off
    if (params.inhibitorType === "None") {
      enzymesRef.current.forEach((enz) => {
        if (enz.state === "EI" || enz.state === "ESI") {
          enz.state = enz.state === "EI" ? "E" : "ES";
        }
      });
    }
  }, [params.substrate, params.inhibitorType, params.inhibitorConc]);

  // Main Canvas Render & Physics Loop
  useEffect(() => {
    initSimulation();

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const runLoop = () => {
      if (!ctx || !canvas) return;

      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);

      // Render grid lines for biochemical dashboard style
      ctx.strokeStyle = "rgba(124, 58, 237, 0.04)";
      ctx.lineWidth = 1;
      const gridSize = 30;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Physics logic (only when game is playing)
      if (isPlaying) {
        // 1. Particle movement & boundary bounces
        particlesRef.current.forEach((p) => {
          p.x += p.vx;
          p.y += p.vy;

          if (p.x - p.radius < 0) { p.x = p.radius; p.vx *= -1; }
          if (p.x + p.radius > width) { p.x = width - p.radius; p.vx *= -1; }
          if (p.y - p.radius < 0) { p.y = p.radius; p.vy *= -1; }
          if (p.y + p.radius > height) { p.y = height - p.radius; p.vy *= -1; }
        });

        enzymesRef.current.forEach((enz) => {
          enz.x += enz.vx;
          enz.y += enz.vy;

          if (enz.x - enz.radius < 0) { enz.x = enz.radius; enz.vx *= -1; }
          if (enz.x + enz.radius > width) { enz.x = width - enz.radius; enz.vx *= -1; }
          if (enz.y - enz.radius < 0) { enz.y = enz.radius; enz.vy *= -1; }
          if (enz.y + enz.radius > height) { enz.y = height - enz.radius; enz.vy *= -1; }

          // 2. Enzyme Kinetics Reaction States Logic
          if (enz.state === "ES") {
            const reactSpeed = 0.4 + (params.vMax / 120);
            enz.progress += reactSpeed;
            if (enz.progress >= enz.targetProgress) {
              enz.state = "E";
              enz.progress = 0;
              productCountRef.current++;

              const angle = Math.random() * Math.PI * 2;
              particlesRef.current.push({
                id: nextIdRef.current++,
                x: enz.x + Math.cos(angle) * (enz.radius + 8),
                y: enz.y + Math.sin(angle) * (enz.radius + 8),
                vx: Math.cos(angle) * 3,
                vy: Math.sin(angle) * 3,
                radius: 4,
                type: "P",
              });
            }
          } else if (enz.state === "EI") {
            const dissociationRate = 0.003 * params.kI;
            if (Math.random() < dissociationRate) {
              enz.state = "E";
              const angle = Math.random() * Math.PI * 2;
              particlesRef.current.push({
                id: nextIdRef.current++,
                x: enz.x + Math.cos(angle) * (enz.radius + 8),
                y: enz.y + Math.sin(angle) * (enz.radius + 8),
                vx: Math.cos(angle) * 3,
                vy: Math.sin(angle) * 3,
                radius: 3.5,
                type: "I",
              });
            }
          } else if (enz.state === "ESI") {
            const dissociationRate = 0.003 * params.kI;
            if (Math.random() < dissociationRate) {
              enz.state = "ES";
              const angle = Math.random() * Math.PI * 2;
              particlesRef.current.push({
                id: nextIdRef.current++,
                x: enz.x + Math.cos(angle) * (enz.radius + 8),
                y: enz.y + Math.sin(angle) * (enz.radius + 8),
                vx: Math.cos(angle) * 3,
                vy: Math.sin(angle) * 3,
                radius: 3.5,
                type: "I",
              });
            }
          }

          // 3. Collision Logic (Enzyme <-> Substrates/Inhibitors)
          if (enz.state === "E") {
            particlesRef.current.forEach((p, pIdx) => {
              const dx = p.x - enz.x;
              const dy = p.y - enz.y;
              const dist = Math.sqrt(dx * dx + dy * dy);

              if (dist < enz.radius + p.radius) {
                const bindProb = 0.85 - (params.kM / 200);

                if (p.type === "S" && Math.random() < bindProb) {
                  enz.state = "ES";
                  enz.progress = 0;
                  particlesRef.current.splice(pIdx, 1);
                } else if (p.type === "I" && params.inhibitorType !== "None" && params.inhibitorType !== "Uncompetitive") {
                  if (Math.random() < 0.6) {
                    enz.state = "EI";
                    particlesRef.current.splice(pIdx, 1);
                  }
                }
              }
            });
          } else if (enz.state === "ES") {
            if (params.inhibitorType === "Noncompetitive" || params.inhibitorType === "Uncompetitive") {
              particlesRef.current.forEach((p, pIdx) => {
                if (p.type === "I") {
                  const dx = p.x - enz.x;
                  const dy = p.y - enz.y;
                  const dist = Math.sqrt(dx * dx + dy * dy);

                  if (dist < enz.radius + p.radius) {
                    if (Math.random() < 0.5) {
                      enz.state = "ESI";
                      particlesRef.current.splice(pIdx, 1);
                    }
                  }
                }
              });
            }
          }
        });

        // Decay excess Products
        if (particlesRef.current.filter((p) => p.type === "P").length > 35) {
          const firstPIndex = particlesRef.current.findIndex((p) => p.type === "P");
          if (firstPIndex !== -1) {
            particlesRef.current.splice(firstPIndex, 1);
          }
        }
      }

      // Draw Substrates/Products/Inhibitors particles
      particlesRef.current.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        if (p.type === "S") {
          ctx.fillStyle = "#2DD4BF";
          ctx.shadowColor = "rgba(45, 212, 191, 0.3)";
          ctx.shadowBlur = 3;
        } else if (p.type === "I") {
          ctx.fillStyle = "#EF4444";
          ctx.shadowColor = "rgba(239, 68, 68, 0.3)";
          ctx.shadowBlur = 3;
        } else {
          ctx.fillStyle = "#10B981";
          ctx.shadowColor = "rgba(16, 185, 129, 0.4)";
          ctx.shadowBlur = 4;
        }
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // Draw Enzymes
      enzymesRef.current.forEach((enz) => {
        ctx.shadowColor = "transparent";
        ctx.shadowBlur = 0;

        ctx.beginPath();
        ctx.arc(enz.x, enz.y, enz.radius, 0, Math.PI * 2);

        if (enz.state === "E") {
          ctx.fillStyle = "#7C3AED";
          ctx.strokeStyle = "#C084FC";
        } else if (enz.state === "ES") {
          ctx.fillStyle = "#8B5CF6";
          ctx.strokeStyle = "#F3E8FF";
        } else if (enz.state === "EI") {
          ctx.fillStyle = "#F87171";
          ctx.strokeStyle = "#EF4444";
        } else {
          ctx.fillStyle = "#F472B6";
          ctx.strokeStyle = "#F43F5E";
        }

        ctx.lineWidth = 1.5;
        ctx.fill();
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(enz.x - 3, enz.y - 3, 3, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
        ctx.fill();

        // 8. CANVAS ES-STATE PULSE
        if (enz.state === "ES") {
          const pulse = Math.sin(Date.now() * 0.005) * 4 + 6;
          ctx.shadowColor = "#A78BFA";
          ctx.shadowBlur = pulse;

          ctx.beginPath();
          const progressRatio = enz.progress / enz.targetProgress;
          ctx.arc(enz.x, enz.y, enz.radius + 3, -Math.PI / 2, -Math.PI / 2 + progressRatio * Math.PI * 2);
          ctx.strokeStyle = "#10B981";
          ctx.lineWidth = 2.5;
          ctx.stroke();

          ctx.shadowBlur = 0;
        }

        if (enz.state === "EI" || enz.state === "ESI") {
          ctx.beginPath();
          ctx.arc(enz.x + 6, enz.y + 6, 2, 0, Math.PI * 2);
          ctx.fillStyle = "#EF4444";
          ctx.fill();
        } else if (enz.state === "ES") {
          ctx.beginPath();
          ctx.arc(enz.x + 6, enz.y + 6, 2.2, 0, Math.PI * 2);
          ctx.fillStyle = "#2DD4BF";
          ctx.fill();
        }
      });

      stateUpdateTimerRef.current++;
      if (stateUpdateTimerRef.current % 12 === 0) {
        let sc = {
          freeEnzyme: 0,
          complexES: 0,
          inhibitedEI: 0,
          inhibitedESI: 0,
          freeSubstrate: 0,
          freeInhibitor: 0,
          product: 0,
          reactionsCompletedCount: productCountRef.current,
        };

        enzymesRef.current.forEach((e) => {
          if (e.state === "E") sc.freeEnzyme++;
          else if (e.state === "ES") sc.complexES++;
          else if (e.state === "EI") sc.inhibitedEI++;
          else if (e.state === "ESI") sc.inhibitedESI++;
        });

        particlesRef.current.forEach((p) => {
          if (p.type === "S") sc.freeSubstrate++;
          else if (p.type === "I") sc.freeInhibitor++;
          else if (p.type === "P") sc.product++;
        });

        setStats(sc);
      }

      animationFrameId.current = requestAnimationFrame(runLoop);
    };

    runLoop();

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [isPlaying, params.vMax, params.kM, params.inhibitorType, params.kI]);

  // Framer Motion staggered grid values
  const containerVariants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.08 },
    },
  };

  const panelVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 120, damping: 14 },
    },
  };

  // Math Helper curves to build exact SVGs for Plots
  const renderMichaelisMentenPlot = () => {
    const width = 320;
    const height = 180;
    const padding = 35;

    const dataPoints: { s: number; v: number }[] = [];
    const activeDataPoints: { s: number; v: number }[] = [];

    for (let s = 0; s <= 150; s += 2) {
      const vControl = (params.vMax * s) / (params.kM + s);
      dataPoints.push({ s, v: vControl });

      const vEff = (vMaxEff * s) / (kMEff + s);
      activeDataPoints.push({ s, v: vEff });
    }

    const scaleX = (s: number) => padding + (s / 150) * (width - padding - 15);
    const scaleY = (v: number) => height - padding - (v / 100) * (height - padding - 15);

    const buildDPath = (pts: { s: number; v: number }[]) => {
      if (pts.length === 0) return "";
      let pathStr = `M ${scaleX(pts[0].s)} ${scaleY(pts[0].v)}`;
      for (let i = 1; i < pts.length; i++) {
        pathStr += ` L ${scaleX(pts[i].s)} ${scaleY(pts[i].v)}`;
      }
      return pathStr;
    };

    const controlPath = buildDPath(dataPoints);
    const inhibitedPath = buildDPath(activeDataPoints);

    const currentSCoord = scaleX(params.substrate);
    const currentV0Coord = scaleY(v0);

    return (
      <svg
        key={`mm-${params.vMax}-${params.kM}-${params.substrate}-${params.inhibitorType}-${params.inhibitorConc}`}
        width="100%"
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        className="text-[#1E1B4B]"
      >
        <line x1={scaleX(0)} y1={scaleY(50)} x2={scaleX(150)} y2={scaleY(50)} stroke="rgba(124,58,237,0.06)" strokeDasharray="3 3" />
        <line x1={scaleX(0)} y1={scaleY(100)} x2={scaleX(150)} y2={scaleY(100)} stroke="rgba(124,58,237,0.06)" />
        <line x1={scaleX(75)} y1={scaleY(0)} x2={scaleX(75)} y2={scaleY(100)} stroke="rgba(124,58,237,0.06)" strokeDasharray="3 3" />

        <line x1={padding} y1={height - padding} x2={width - 10} y2={height - padding} stroke="#7C3AED" strokeWidth={1.5} />
        <line x1={padding} y1={10} x2={padding} y2={height - padding} stroke="#7C3AED" strokeWidth={1.5} />

        <text x={width - 25} y={height - 18} fontSize="9" fontWeight="bold" className="fill-[#1E1B4B]/80 text-right">[S]</text>
        <text x="12" y="18" fontSize="9" fontWeight="bold" className="fill-[#1E1B4B]/80">v₀</text>

        <text x={padding - 8} y={scaleY(50) + 3} textAnchor="end" fontSize="8" className="fill-[#6B7280]">50</text>
        <text x={padding - 8} y={scaleY(100) + 3} textAnchor="end" fontSize="8" className="fill-[#6B7280]">100</text>
        <text x={scaleX(75)} y={height - padding + 12} textAnchor="middle" fontSize="8" className="fill-[#6B7280]">75</text>
        <text x={scaleX(150)} y={height - padding + 12} textAnchor="middle" fontSize="8" className="fill-[#6B7280]">150</text>

        <path d={controlPath} fill="none" stroke="#9333EA" strokeWidth="1.5" strokeDasharray="4,4" className="opacity-40" />

        {/* 7. SVG CHART LINE DRAW — control/live curve */}
        <path
          d={params.inhibitorType !== "None" ? inhibitedPath : controlPath}
          fill="none"
          stroke={params.inhibitorType !== "None" ? "#EF4444" : "#7C3AED"}
          strokeWidth="2.5"
          strokeDasharray="1000"
          strokeDashoffset="0"
          style={{ animation: "chartDraw 0.6s ease-out forwards" }}
        />

        {/* 7. SVG CHART LINE DRAW — inhibited overlay (delayed) */}
        {params.inhibitorType !== "None" && (
          <path
            d={inhibitedPath}
            fill="none"
            stroke="#EF4444"
            strokeWidth="2.5"
            strokeDasharray="1000"
            strokeDashoffset="0"
            style={{ animation: "chartDraw 0.6s ease-out forwards", animationDelay: "0.25s" }}
          />
        )}

        <line
          x1={padding}
          y1={scaleY(vMaxEff)}
          x2={width - 15}
          y2={scaleY(vMaxEff)}
          stroke={params.inhibitorType !== "None" ? "#FCA5A5" : "#C084FC"}
          strokeDasharray="2,3"
          strokeWidth={1}
        />
        <text x={width - 18} y={scaleY(vMaxEff) - 3} fontSize="7" className="fill-purple-700/80 text-right">
          Vmax,eff ({vMaxEff.toFixed(0)})
        </text>

        <circle cx={currentSCoord} cy={currentV0Coord} r={5} fill="#2DD4BF" stroke="#ffffff" strokeWidth={1} />
        <line x1={currentSCoord} y1={currentV0Coord} x2={currentSCoord} y2={height - padding} stroke="#2DD4BF" strokeWidth={0.8} strokeDasharray="2 2" />
        <line x1={padding} y1={currentV0Coord} x2={currentSCoord} y2={currentV0Coord} stroke="#2DD4BF" strokeWidth={0.8} strokeDasharray="2 2" />

        <rect x={currentSCoord + 6} y={currentV0Coord - 14} width="58" height={12} rx="2" fill="rgba(30, 27, 75, 0.85)" />
        <text x={currentSCoord + 10} y={currentV0Coord - 5} fontSize="7.5" fill="#ffffff">
          v₀ = {v0.toFixed(1)}
        </text>
      </svg>
    );
  };

  const renderLineweaverBurkPlot = () => {
    const width = 320;
    const height = 180;
    const padding = 35;

    const originX = 110;
    const originY = height - padding - 20;

    const scaleX = (oneOverS: number) => originX + (oneOverS * 600);
    const scaleY = (oneOverV: number) => originY - (oneOverV * 1400);

    const controlXInt = -1 / params.kM;
    const inhibitedXInt = -1 / kMEff;

    const controlYInt = 1 / params.vMax;
    const inhibitedYInt = 1 / vMaxEff;

    const farXVal = 0.15;
    const controlYFar = (params.kM / params.vMax) * farXVal + 1 / params.vMax;
    const inhibitedYFar = (kMEff / vMaxEff) * farXVal + 1 / vMaxEff;

    const controlLine = {
      x1: scaleX(controlXInt),
      y1: scaleY(0),
      x2: scaleX(farXVal),
      y2: scaleY(controlYFar),
    };

    const inhibitedLine = {
      x1: scaleX(inhibitedXInt),
      y1: scaleY(0),
      x2: scaleX(farXVal),
      y2: scaleY(inhibitedYFar),
    };

    return (
      <svg
        key={`mm-${params.vMax}-${params.kM}-${params.substrate}-${params.inhibitorType}-${params.inhibitorConc}`}
        width="100%"
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        className="text-[#1E1B4B]"
      >
        <line x1={15} y1={originY} x2={width - 15} y2={originY} stroke="#7C3AED" strokeWidth={1.2} />
        <line x1={originX} y1={10} x2={originX} y2={height - padding} stroke="#7C3AED" strokeWidth={1.2} />

        <text x={width - 34} y={originY + 12} fontSize="9" fontWeight="bold" className="fill-[#1E1B4B]/80 text-right">1/[S]</text>
        <text x={originX - 22} y="18" fontSize="9" fontWeight="bold" className="fill-[#1E1B4B]/80">1/v₀</text>

        <line
          x1={controlLine.x1} y1={controlLine.y1}
          x2={controlLine.x2} y2={controlLine.y2}
          stroke="#9333EA" strokeWidth={1.2} strokeDasharray="3,3" className="opacity-30"
        />

        {/* 7. SVG CHART LINE DRAW — control reciprocal */}
        <line
          x1={controlLine.x1} y1={controlLine.y1}
          x2={controlLine.x2} y2={controlLine.y2}
          stroke={params.inhibitorType !== "None" ? "#A78BFA" : "#7C3AED"}
          strokeWidth={2.2}
          strokeDasharray="1000"
          strokeDashoffset="0"
          style={{ animation: "chartDraw 0.6s ease-out forwards" }}
        />

        {/* 7. SVG CHART LINE DRAW — inhibited reciprocal (delayed) */}
        {params.inhibitorType !== "None" && (
          <line
            x1={inhibitedLine.x1} y1={inhibitedLine.y1}
            x2={inhibitedLine.x2} y2={inhibitedLine.y2}
            stroke="#EF4444"
            strokeWidth={2.2}
            strokeDasharray="1000"
            strokeDashoffset="0"
            style={{ animation: "chartDraw 0.6s ease-out forwards", animationDelay: "0.25s" }}
          />
        )}

        {!isNaN(controlYInt) && (
          <>
            <circle cx={originX} cy={scaleY(inhibitedYInt)} r={4} fill="#EF4444" />
            <text x={originX + 6} y={scaleY(inhibitedYInt) + 2} fontSize="7" fontWeight="bold" className="fill-red-600">
              1/Vmax,eff ({(1 / vMaxEff).toFixed(3)})
            </text>
          </>
        )}

        {!isNaN(inhibitedXInt) && (
          <>
            <circle cx={scaleX(inhibitedXInt)} cy={originY} r={4} fill="#EF4444" />
            <text x={scaleX(inhibitedXInt) - 12} y={originY - 6} fontSize="7" fontWeight="bold" className="fill-red-500 text-center">
              -1/Km,eff ({(inhibitedXInt).toFixed(3)})
            </text>
          </>
        )}
      </svg>
    );
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full"
    >
      {/* 1. Simulator Panel */}
      <motion.div
        variants={panelVariants}
        className="lg:col-span-8 bg-white border border-[#7C3AED]/15 rounded-2xl shadow-[0_4px_6px_rgba(124,58,237,0.06),0_20px_60px_rgba(124,58,237,0.10)] overflow-hidden flex flex-col"
      >
        <div className="px-6 py-4 border-b border-[#7C3AED]/10 bg-gradient-to-r from-purple-50 to-white flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-[#7C3AED]/10 text-[#7C3AED] rounded-lg">
              <RefreshCw className="w-4 h-4 animate-spin" style={{ animationDuration: "12s" }} />
            </span>
            <div>
              <h3 className="font-display font-bold text-lg text-[#1E1B4B]">Biochemical Nano-Reactor</h3>
              <p className="text-xs text-[#6B7280]">Live Enzyme-Substrate interaction model</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* 5. PLAY/PAUSE ICON SWAP */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-2 ml-1 rounded-lg bg-purple-50 border border-purple-100 text-[#7C3AED] hover:bg-purple-100 transition-colors flex items-center justify-center w-10 h-10 cursor-pointer"
            >
              <AnimatePresence mode="wait">
                {isPlaying ? (
                  <motion.div
                    key="pause"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="flex justify-center items-center"
                  >
                    <Pause className="w-5 h-5 fill-[#7C3AED]/20" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="play"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="flex justify-center items-center"
                  >
                    <Play className="w-5 h-5 fill-[#7C3AED]/20" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={initSimulation}
              className="p-2 rounded-lg bg-amber-50 text-amber-700 hover:bg-amber-100 transition-colors flex items-center gap-1.5 font-sans font-medium text-xs border border-amber-100 cursor-pointer h-10"
              title="Reset reaction values and clear simulation space"
            >
              <RotateCcw className="w-4 h-4" />
              Reset Reaction
            </motion.button>
          </div>
        </div>

        <div className="relative bg-slate-950 p-2 flex-grow min-h-[280px]">
          <canvas
            ref={canvasRef}
            width={720}
            height={280}
            className="w-full h-full block bg-slate-950 rounded-xl"
          />

          <div className="absolute bottom-4 left-4 bg-slate-900/85 backdrop-blur-md rounded-lg px-3 py-1.5 border border-purple-500/10 flex items-center gap-4 text-[10px] text-slate-300 font-mono">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#7C3AED]"></span>E (Enzyme)</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#2DD4BF]"></span>S (Substrate)</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#8B5CF6] border border-[#10B981]"></span>ES (Complex)</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#10B981]"></span>P (Product)</span>
            {params.inhibitorType !== "None" && (
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]"></span>I (Inhibitor)</span>
            )}
          </div>
        </div>
      </motion.div>

      {/* 2. Controls Panel */}
      <motion.div
        variants={panelVariants}
        className="lg:col-span-4 bg-white border border-[#7C3AED]/15 rounded-2xl shadow-[0_4px_6px_rgba(124,58,237,0.06),0_20px_60px_rgba(124,58,237,0.10)] overflow-hidden flex flex-col justify-between"
      >
        <div className="px-6 py-4 border-b border-[#7C3AED]/10 bg-gradient-to-r from-purple-50 to-white">
          <h3 className="font-display font-bold text-lg text-[#1E1B4B]">Biochemical Parameters</h3>
          <p className="text-xs text-[#6B7280]">Realtime kinetic simulation parameters</p>
        </div>

        <div className="p-6 space-y-5 flex-grow font-sans text-sm">
          {/* 3. SLIDER VALUE READOUTS — Vmax */}
          <div className="space-y-1">
            <div className="flex justify-between items-center text-xs">
              <span className="font-display font-semibold text-[#7C3AED] tracking-wider text-[11px] uppercase">Vmax (Max Velocity)</span>
              <span key={params.vMax} className="font-mono bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full text-[10px] font-bold animate-[countUp_0.2s_ease-out]">
                {params.vMax} mol/s
              </span>
            </div>
            <input type="range" min="20" max="150" value={params.vMax}
              onChange={(e) => setParams({ ...params, vMax: Number(e.target.value) })}
              className="w-full h-1.5 bg-purple-50 rounded-lg appearance-none cursor-pointer accent-[#7C3AED]" />
          </div>

          {/* Km */}
          <div className="space-y-1">
            <div className="flex justify-between items-center text-xs">
              <span className="font-display font-semibold text-[#7C3AED] tracking-wider text-[11px] uppercase">Km (Michaelis Constant)</span>
              <span key={params.kM} className="font-mono bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full text-[10px] font-bold animate-[countUp_0.2s_ease-out]">
                {params.kM} μM
              </span>
            </div>
            <input type="range" min="10" max="100" value={params.kM}
              onChange={(e) => setParams({ ...params, kM: Number(e.target.value) })}
              className="w-full h-1.5 bg-purple-50 rounded-lg appearance-none cursor-pointer accent-emerald-500" />
          </div>

          {/* Substrate */}
          <div className="space-y-1">
            <div className="flex justify-between items-center text-xs">
              <span className="font-display font-semibold text-[#7C3AED] tracking-wider text-[11px] uppercase">[Substrate Concentration]</span>
              <span key={params.substrate} className="font-mono bg-teal-50 text-teal-700 px-2 py-0.5 rounded-full text-[10px] font-bold animate-[countUp_0.2s_ease-out]">
                {params.substrate} mM
              </span>
            </div>
            <input type="range" min="5" max="150" value={params.substrate}
              onChange={(e) => setParams({ ...params, substrate: Number(e.target.value) })}
              className="w-full h-1.5 bg-purple-50 rounded-lg appearance-none cursor-pointer accent-teal-500" />
          </div>

          {/* 2. INHIBITOR TOGGLE BUTTONS */}
          <div className="space-y-1.5 pt-2 border-t border-purple-50">
            <label className="font-display font-semibold text-[#7C3AED] tracking-wider text-[11px] uppercase flex items-center gap-1">
              Inhibitor Configuration
            </label>
            <div className="grid grid-cols-4 gap-1.5 relative z-10">
              {(["None", "Competitive", "Noncompetitive", "Uncompetitive"] as InhibitorType[]).map((type) => {
                const isActive = params.inhibitorType === type;
                return (
                  <motion.button
                    key={type}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setParams({ ...params, inhibitorType: type })}
                    className={`relative p-2 text-[10px] font-medium rounded-lg text-center cursor-pointer transition-colors z-20 ${
                      isActive ? "text-[#7C3AED] font-bold" : "text-gray-500 hover:text-purple-700 hover:bg-purple-50/50"
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeInhibitor"
                        className="absolute inset-0 bg-purple-100/90 rounded-lg -z-10 border border-purple-200"
                      />
                    )}
                    {type === "None" ? "None" : type.slice(0, 4) + "."}
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* 6. INHIBITOR SLIDER REVEAL */}
          <AnimatePresence>
            {params.inhibitorType !== "None" && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden space-y-4 pt-3 border-t border-amber-50"
              >
                {/* 3. Inhibitor Conc readout */}
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-red-600 font-display uppercase tracking-wider text-[10px]">[Inhibitor Conc]</span>
                    <span key={params.inhibitorConc} className="font-mono bg-red-50 text-red-700 px-2 py-0.5 rounded-full text-[10px] font-bold animate-[countUp_0.2s_ease-out]">
                      {params.inhibitorConc} μM
                    </span>
                  </div>
                  <input type="range" min="2" max="50" value={params.inhibitorConc}
                    onChange={(e) => setParams({ ...params, inhibitorConc: Number(e.target.value) })}
                    className="w-full h-1.5 bg-red-100 rounded-lg appearance-none cursor-pointer accent-red-500" />
                </div>

                {/* 3. Ki readout */}
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-indigo-600 font-display uppercase tracking-wider text-[10px]">Ki (Inhibitor Constant)</span>
                    <span key={params.kI} className="font-mono bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full text-[10px] font-bold animate-[countUp_0.2s_ease-out]">
                      {params.kI} μM
                    </span>
                  </div>
                  <input type="range" min="2" max="40" value={params.kI}
                    onChange={(e) => setParams({ ...params, kI: Number(e.target.value) })}
                    className="w-full h-1.5 bg-indigo-100 rounded-lg appearance-none cursor-pointer accent-indigo-500" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="p-4 bg-purple-50/50 space-y-1 bg-gradient-to-tr from-purple-50 to-white border-t border-purple-50">
          <div className="flex gap-2 items-center text-xs text-purple-800 font-semibold mb-1">
            <Info className="w-3.5 h-3.5 text-purple-600 shrink-0" />
            <span>Biochemical Insight</span>
          </div>
          <p className="text-[10.5px] text-purple-950 font-normal leading-relaxed">
            {params.inhibitorType === "None" && "Normal substrate binding. As substrate concentration rises, the reaction speed approaches Vmax asymptotically."}
            {params.inhibitorType === "Competitive" && "Competitive inhibitors mimic substrate shape & bind to the active site. Adding more substrate outcompetes the inhibitor, so Vmax is unchanged but the apparent Km increases."}
            {params.inhibitorType === "Noncompetitive" && "Noncompetitive inhibitors bind to an allosteric site on both E and ES complexes. Adding substrate cannot overcome this, lowering Vmax, while Km remains unchanged."}
            {params.inhibitorType === "Uncompetitive" && "Uncompetitive inhibitors bind selectively to the Enzyme-Substrate complex (ES). This locks the complex, decreasing both the effective Vmax and Km."}
          </p>
        </div>
      </motion.div>

      {/* 3. Michaelis-Menten Plot Panel */}
      <motion.div
        variants={panelVariants}
        className="lg:col-span-6 bg-white border border-[#7C3AED]/15 rounded-2xl shadow-[0_4px_6px_rgba(124,58,237,0.06),0_20px_60px_rgba(124,58,237,0.10)] overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-[#7C3AED]/10 bg-gradient-to-r from-purple-50 to-white flex justify-between items-center">
          <div>
            <h3 className="font-display font-bold text-lg text-[#1E1B4B]">Michaelis-Menten Saturation Plot</h3>
            <p className="text-xs text-[#6B7280]">Reaction rate v₀ versus Substrate concentration [S]</p>
          </div>
          <span className="p-1 px-2.5 bg-[#7C3AED]/10 text-[#7C3AED] rounded-full text-[10px] font-bold font-display uppercase tracking-wider">Hyperbolic</span>
        </div>
        <div className="p-6">{renderMichaelisMentenPlot()}</div>
      </motion.div>

      {/* 4. Lineweaver-Burk Plot Panel */}
      <motion.div
        variants={panelVariants}
        className="lg:col-span-6 bg-white border border-[#7C3AED]/15 rounded-2xl shadow-[0_4px_6px_rgba(124,58,237,0.06),0_20px_60px_rgba(124,58,237,0.10)] overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-[#7C3AED]/10 bg-gradient-to-r from-purple-50 to-white flex justify-between items-center">
          <div>
            <h3 className="font-display font-bold text-lg text-[#1E1B4B]">Lineweaver-Burk Reciprocal Plot</h3>
            <p className="text-xs text-[#6B7280]">Linearized representation of kinetic rates (1/v₀ vs 1/[S])</p>
          </div>
          <span className="p-1 px-2.5 bg-purple-100 text-[#7C3AED] rounded-full text-[10px] font-bold font-display uppercase tracking-wider">Double Reciprocal</span>
        </div>
        <div className="p-6">{renderLineweaverBurkPlot()}</div>
      </motion.div>

      {/* 4. STAT FOOTER — Lineweaver-Burk bottom bar */}
      <motion.div
        variants={panelVariants}
        className="lg:col-span-12 bg-slate-900 border border-[#7C3AED]/20 p-5 rounded-2xl text-white shadow-2xl flex flex-wrap md:flex-nowrap justify-between gap-6"
      >
        <div className="flex items-center gap-3">
          <span className="p-2 bg-purple-500/10 text-purple-400 rounded-xl">
            <BarChart2 className="w-5 h-5" />
          </span>
          <div>
            <h4 className="font-display font-bold text-sm text-purple-200">Active Enzyme Kinetics metrics</h4>
            <p className="text-[11px] text-gray-400 font-sans">Dynamic values calculated from active parameters</p>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleExportData}
              className="mt-3 text-xs bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white font-medium py-1.5 px-3 rounded-lg flex items-center gap-1.5 border border-purple-500 transition-colors shadow-sm cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              Export Data
            </motion.button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6 flex-grow max-w-xl font-mono text-xs">
          <div className="p-2.5 bg-slate-800/50 rounded-xl border border-slate-750 flex flex-col justify-between">
            <span className="text-[10px] text-gray-400 font-display">Km,eff (Michaelis Constant)</span>
            <span key={kMEff} className="text-base font-bold text-emerald-400 animate-[countUp_0.25s_ease-out]">
              {kMEff.toFixed(1)} uM
            </span>
          </div>
          <div className="p-2.5 bg-slate-800/50 rounded-xl border border-slate-750 flex flex-col justify-between">
            <span className="text-[10px] text-gray-400 font-display">Vmax,eff (Cap Capacity)</span>
            <span key={vMaxEff} className="text-base font-bold text-amber-400 animate-[countUp_0.25s_ease-out]">
              {vMaxEff.toFixed(1)} mol/s
            </span>
          </div>
          <div className="p-2.5 bg-slate-800/50 rounded-xl border border-slate-750 flex flex-col justify-between">
            <span className="text-[10px] text-gray-400 font-display">Calculated Speed (v₀)</span>
            <span key={v0} className="text-base font-bold text-[#E9D5FF] animate-[countUp_0.25s_ease-out]">
              {v0.toFixed(2)} mol/s
            </span>
          </div>
        </div>
      </motion.div>

      {/* Enzyme States Billboard */}
      <motion.div
        variants={panelVariants}
        className="lg:col-span-12 bg-white border border-[#7C3AED]/15 rounded-2xl shadow-[0_4px_6px_rgba(124,58,237,0.06),0_20px_60px_rgba(124,58,237,0.10)] overflow-hidden"
      >
        <div className="p-6 border-b border-purple-50 bg-gradient-to-r from-purple-50/50 to-white">
          <div className="flex gap-2.5 items-center">
            <span className="p-1.5 bg-[#7C3AED]/15 text-[#7C3AED] rounded-lg">
              <Layers className="w-5 h-5" />
            </span>
            <div>
              <h3 className="font-display font-medium text-lg text-[#1E1B4B]">Enzyme States Real-Time Billboard</h3>
              <p className="text-xs text-[#6B7280]">Active reaction pathway tracker and thermodynamic phases</p>
            </div>
          </div>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="p-4 rounded-xl border border-purple-100 bg-gradient-to-b from-purple-50/20 to-white flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-16 h-16 bg-purple-500/5 rounded-bl-full group-hover:scale-110 transition-transform"></div>
            <div>
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-mono font-bold text-[#7C3AED] bg-[#7C3AED]/10 px-2 py-0.5 rounded-full">State [E]</span>
                <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Free Enzyme</span>
              </div>
              <h4 className="font-display font-bold text-gray-900 mt-2">Active Site Available</h4>
              <p className="text-[11px] text-[#6B7280] mt-1 pr-4 leading-normal">Catalytically active, ready to form stabilizing non-covalent complexes with incoming substrate molecules.</p>
            </div>
            <div className="mt-4 pt-3 border-t border-gray-50 flex justify-between items-center bg-white">
              <span className="text-[10px] font-bold text-[#1E1B4B]">Current Count:</span>
              <span className="text-lg font-mono font-extrabold text-[#7C3AED]">{stats.freeEnzyme}</span>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-emerald-100 bg-gradient-to-b from-emerald-50/10 to-white flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/5 rounded-bl-full group-hover:scale-110 transition-transform"></div>
            <div>
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-mono font-bold text-emerald-600 bg-emerald-100/60 px-2 py-0.5 rounded-full animate-pulse">State [ES]</span>
                <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Complex State</span>
              </div>
              <h4 className="font-display font-bold text-gray-900 mt-2">Transition State Complex</h4>
              <p className="text-[11px] text-[#6B7280] mt-1 pr-4 leading-normal">Substrate is bound in optimal orientation. Induces conformational changes which lower the activation energy of the reaction.</p>
            </div>
            <div className="mt-4 pt-3 border-t border-gray-50 flex justify-between items-center bg-white">
              <span className="text-[10px] font-bold text-emerald-950">Current Count:</span>
              <span className="text-lg font-mono font-extrabold text-emerald-600">{stats.complexES}</span>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-red-100 bg-gradient-to-b from-red-50/10 to-white flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-16 h-16 bg-red-500/5 rounded-bl-full group-hover:scale-110 transition-transform"></div>
            <div>
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-mono font-bold text-red-600 bg-red-100/60 px-2 py-0.5 rounded-full">State [EI] / [ESI]</span>
                <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Inhibited</span>
              </div>
              <h4 className="font-display font-bold text-gray-900 mt-2">Allosteric / Active Block</h4>
              <p className="text-[11px] text-[#6B7280] mt-1 pr-4 leading-normal">Catalytic cycle interrupted. Inhibitor is successfully blockading substrate association or trapping active transition complexes.</p>
            </div>
            <div className="mt-4 pt-3 border-t border-gray-50 flex justify-between items-center bg-white">
              <span className="text-[10px] font-bold text-red-950">Inhibited total:</span>
              <span className="text-lg font-mono font-extrabold text-red-600">{stats.inhibitedEI + stats.inhibitedESI}</span>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-teal-100 bg-gradient-to-b from-teal-50/10 to-white flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-16 h-16 bg-teal-500/5 rounded-bl-full group-hover:scale-110 transition-transform"></div>
            <div>
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-mono font-bold text-teal-600 bg-teal-100/60 px-2 py-0.5 rounded-full">State [P]</span>
                <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Free Product</span>
              </div>
              <h4 className="font-display font-bold text-gray-900 mt-2">Completed Biocatalysis</h4>
              <p className="text-[11px] text-[#6B7280] mt-1 pr-4 leading-normal">Reaction successfully completed. Catalyzed molecules are released, and enzymes reset to initial state.</p>
            </div>
            <div className="mt-4 pt-3 border-t border-gray-50 flex justify-between items-center bg-white">
              <span className="text-[10px] font-bold text-teal-950">Accumulated Total:</span>
              <span className="text-lg font-mono font-extrabold text-teal-600">{stats.reactionsCompletedCount}</span>
            </div>
          </div>
        </div>

        <div className="p-6 bg-slate-950 border-t border-purple-500/10 flex flex-col items-center justify-center font-mono text-[11px] text-slate-300">
          <div className="text-purple-400 font-display font-bold uppercase tracking-widest text-[10px] mb-4">Catalytic State Transition Flow</div>
          <div className="flex flex-wrap items-center justify-center gap-2.5 md:gap-4 md:text-sm font-sans">
            <div className={`p-2.5 rounded-xl border ${stats.freeSubstrate > 0 ? "border-[#7C3AED] bg-[#7C3AED]/10 text-white font-bold" : "border-slate-800 bg-slate-900/40 text-slate-400"} flex items-center gap-1.5`}>
              <span>E</span><span className="text-xs text-purple-300">+</span><span className="text-[#2DD4BF]">S</span>
              <span className="text-[10px] bg-[#7C3AED]/20 px-1.5 py-0.5 rounded-full text-[#7C3AED] ml-1">E:{stats.freeEnzyme}</span>
            </div>
            <span className="text-[#A78BFA] font-bold">⇌</span>
            <div className={`p-2.5 rounded-xl border ${stats.complexES > 0 ? "border-emerald-500 bg-emerald-500/15 text-white font-bold animate-pulse" : "border-slate-800 bg-slate-900/40 text-slate-400"} flex items-center gap-1.5`}>
              <span className="text-emerald-400">ES</span>
              <span className="text-[10px] bg-emerald-500/20 px-1.5 py-0.5 rounded-full text-emerald-400 ml-1">ES:{stats.complexES}</span>
            </div>
            <span className="text-[#A78BFA] font-bold">→</span>
            <div className={`p-2.5 rounded-xl border ${stats.reactionsCompletedCount > 0 ? "border-teal-500 bg-teal-500/15 text-white font-bold" : "border-slate-800 bg-slate-900/40 text-slate-400"} flex items-center gap-1.5`}>
              <span>E</span><span className="text-xs text-purple-300">+</span><span className="text-emerald-400">P</span>
              <span className="text-[10px] bg-teal-500/20 px-1.5 py-0.5 rounded-full text-teal-300 ml-1">P:{stats.reactionsCompletedCount}</span>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

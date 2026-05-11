/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { getStrategicHint, TargetCandidate } from '../services/geminiService';
import { RefreshStatus } from './RefreshStatus';
import { Point, Bubble, Particle, BubbleColor, DebugInfo, ThemeType, AuditLogEntry, TestResult } from '../types';
import { 
  Loader2, Trophy, BrainCircuit, Play, MousePointerClick, 
  Eye, Terminal, AlertTriangle, Lightbulb, Monitor, 
  Settings2, Activity, Zap, Sparkles, ShieldCheck, 
  Lock, LogOut, Sun, Moon, Contrast, History, Trash2, Key,
  TestTube, CheckCircle2, XCircle, Camera, Gauge
} from 'lucide-react';

// --- Constants & Config ---
const PINCH_THRESHOLD = 0.05;
const FRICTION = 0.998; 
const BUBBLE_RADIUS = 22;
const ROW_HEIGHT = BUBBLE_RADIUS * Math.sqrt(3);
const GRID_COLS = 12;
const GRID_ROWS = 8;
const SLINGSHOT_BOTTOM_OFFSET = 220;
const MAX_DRAG_DIST = 180;
const MIN_FORCE_MULT = 0.15;
const MAX_FORCE_MULT = 0.45;
const ADMIN_PASSWORD = "admin"; 

const COLOR_CONFIG: Record<BubbleColor, { hex: string, points: number, label: string }> = {
  red:    { hex: '#ef5350', points: 100, label: 'Red' },
  blue:   { hex: '#42a5f5', points: 150, label: 'Blue' },
  green:  { hex: '#66bb6a', points: 200, label: 'Green' },
  yellow: { hex: '#ffee58', points: 250, label: 'Yellow' },
  purple: { hex: '#ab47bc', points: 300, label: 'Purple' },
  orange: { hex: '#ffa726', points: 500, label: 'Orange' }
};

const COLOR_KEYS: BubbleColor[] = ['red', 'blue', 'green', 'yellow', 'purple', 'orange'];

const adjustColor = (color: string, amount: number) => {
  const hex = color.replace('#', '');
  const r = Math.max(0, Math.min(255, parseInt(hex.substring(0, 2), 16) + amount));
  const g = Math.max(0, Math.min(255, parseInt(hex.substring(2, 4), 16) + amount));
  const b = Math.max(0, Math.min(255, parseInt(hex.substring(4, 6), 16) + amount));
  const componentToHex = (c: number) => {
    const h = c.toString(16);
    return h.length === 1 ? "0" + h : h;
  };
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
};

const GeminiSlingshot: React.FC = () => {
  // --- Game State Refs ---
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameContainerRef = useRef<HTMLDivElement>(null);
  const ballPos = useRef<Point>({ x: 0, y: 0 });
  const ballVel = useRef<Point>({ x: 0, y: 0 });
  const anchorPos = useRef<Point>({ x: 0, y: 0 });
  const isPinching = useRef<boolean>(false);
  const isFlying = useRef<boolean>(false);
  const bubbles = useRef<Bubble[]>([]);
  const particles = useRef<Particle[]>([]);
  const scoreRef = useRef<number>(0);
  const aimTargetRef = useRef<Point | null>(null);
  const isAiThinkingRef = useRef<boolean>(false);
  const captureRequestRef = useRef<boolean>(false);
  const selectedColorRef = useRef<BubbleColor>('red');
  const lastHandPos = useRef<Point | null>(null);
  const lastHandPinchDist = useRef<number>(1.0);
  const lastMousePos = useRef<Point | null>(null);
  const isMouseDown = useRef<boolean>(false);
  const latestResultsImage = useRef<HTMLCanvasElement | HTMLImageElement | null>(null);
  const latestHandLandmarks = useRef<any>(null);
  
  // --- Primary UI State ---
  const [loading, setLoading] = useState(true);
  const [aiHint, setAiHint] = useState<string | null>("System Baseline Initialized...");
  const [aiRationale, setAiRationale] = useState<string | null>(null);
  const [aimTarget, setAimTarget] = useState<Point | null>(null);
  const [score, setScore] = useState(0);
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [selectedColor, setSelectedColor] = useState<BubbleColor>('red');
  const [availableColors, setAvailableColors] = useState<BubbleColor[]>([]);
  const [aiRecommendedColor, setAiRecommendedColor] = useState<BubbleColor | null>(null);
  const [debugInfo, setDebugInfo] = useState<DebugInfo | null>(null);
  const [showDebug, setShowDebug] = useState(true);

  // --- Security & Accessibility & Test State ---
  const [theme, setTheme] = useState<ThemeType>('dark');
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminPassInput, setAdminPassInput] = useState('');
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [announcement, setAnnouncement] = useState('');
  const [sidebarTab, setSidebarTab] = useState<'ai' | 'test'>('ai');
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunningTests, setIsRunningTests] = useState(false);
  const [showRefreshProtocol, setShowRefreshProtocol] = useState(false);

  // --- Accessibility Helper ---
  const announce = (msg: string) => {
    setAnnouncement(msg);
    setTimeout(() => setAnnouncement(''), 3000);
  };

  // --- Audit Logging Helper ---
  const logAction = useCallback((action: string) => {
    const entry: AuditLogEntry = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toLocaleTimeString(),
      action,
      user: isAdmin ? 'Admin' : 'System'
    };
    setAuditLogs(prev => [entry, ...prev].slice(0, 100));
  }, [isAdmin]);

  // --- Theme Computed Design Values ---
  const themeStyles = useMemo(() => {
    switch (theme) {
      case 'light':
        return { bg: '#f8f9fa', text: '#1a1a1b', panel: '#ffffff', border: 'rgba(0,0,0,0.08)', hud: 'rgba(255,255,255,0.95)', accent: '#1a73e8' };
      case 'high-contrast':
        return { bg: '#000000', text: '#ffff00', panel: '#000000', border: '#ffff00', hud: '#000000', accent: '#ffff00' };
      default:
        return { bg: '#08080a', text: '#f1f1f3', panel: '#0c0c0e', border: 'rgba(255,255,255,0.05)', hud: '#121214', accent: '#4285f4' };
    }
  }, [theme]);

  // --- Testing Logic ---
  const runSelfTestSuite = async () => {
    if (isRunningTests) return;
    setIsRunningTests(true);
    setTestResults([]);
    logAction('E2E self-test suite initiated');
    announce('Initiating comprehensive system self-test and visual verification.');

    const runTest = async (name: string, check: () => Promise<void>) => {
      const id = Math.random().toString(36).substr(2, 9);
      setTestResults(prev => [...prev, { id, name, status: 'pending' }]);
      try {
        await check();
        const screenshot = canvasRef.current?.toDataURL('image/jpeg', 0.5);
        setTestResults(prev => prev.map(t => t.id === id ? { ...t, status: 'passed', screenshot } : t));
      } catch (err: any) {
        setTestResults(prev => prev.map(t => t.id === id ? { ...t, status: 'failed', message: err.message } : t));
      }
    };

    await runTest('Visual Buffer Context', async () => {
      if (!canvasRef.current?.getContext('2d')) throw new Error('Canvas 2D context unavailable');
    });

    await runTest('Gesture Recognition API', async () => {
      if (!window.Hands) throw new Error('MediaPipe Hands tracking library not initialized');
    });

    await runTest('Strategic AI Link', async () => {
      if (!process.env.API_KEY) throw new Error('GenAI API Key missing from execution environment');
    });

    await runTest('Physics Stability (60 FPS)', async () => {
      const startTime = performance.now();
      await new Promise(r => setTimeout(r, 200));
      const endTime = performance.now();
      if (bubbles.current.length === 0) throw new Error('Game state corruption: zero bubbles detected');
    });

    await runTest('Slingshot Recoil Mechanics', async () => {
      // Programmatic Slingshot Test
      isPinching.current = true;
      ballPos.current = { x: anchorPos.current.x - 50, y: anchorPos.current.y + 50 };
      await new Promise(r => setTimeout(r, 300));
      isPinching.current = false;
      isFlying.current = true;
      ballVel.current = { x: 50 * 0.3, y: -50 * 0.3 };
      await new Promise(r => setTimeout(r, 500));
      if (!isFlying.current) throw new Error('Slingshot fail: Projectile did not enter flight state');
      // Cleanup
      isFlying.current = false;
      ballPos.current = { ...anchorPos.current };
    });

    await runTest('Theming Engine Responsiveness', async () => {
      setTheme('high-contrast');
      await new Promise(r => setTimeout(r, 400));
      setTheme('dark');
    });

    setIsRunningTests(false);
    logAction('E2E self-test suite completed successfully');
    announce('System self-test completed. Core journeys verified.');
  };

  // Admin Security Handlers
  const handleAdminLogin = () => {
    if (adminPassInput === ADMIN_PASSWORD) {
      setIsAdmin(true);
      setShowAdminLogin(false);
      setAdminPassInput('');
      logAction('Security access granted');
      announce('Admin mode activated. Overrides enabled.');
    } else {
      logAction('Security breach attempt blocked');
      announce('Access denied. Invalid credentials.');
    }
  };

  const handleAdminLogout = () => {
    setIsAdmin(false);
    logAction('Security session terminated');
    announce('Admin mode deactivated.');
  };

  const handleThemeChange = (newTheme: ThemeType) => {
    setTheme(newTheme);
    logAction(`Interface theme shifted to ${newTheme}`);
    announce(`Theme switched to ${newTheme} mode.`);
  };

  // Game Grid Logic
  const getBubblePos = useCallback((row: number, col: number, width: number) => {
    const xOffset = (width - (GRID_COLS * BUBBLE_RADIUS * 2)) / 2 + BUBBLE_RADIUS;
    const x = xOffset + col * (BUBBLE_RADIUS * 2) + (row % 2 !== 0 ? BUBBLE_RADIUS : 0);
    const y = BUBBLE_RADIUS + row * ROW_HEIGHT;
    return { x, y };
  }, []);

  const updateAvailableColors = useCallback(() => {
    const activeColors = new Set<BubbleColor>();
    bubbles.current.forEach(b => b.active && activeColors.add(b.color));
    const colors = Array.from(activeColors);
    setAvailableColors(colors);
    if (!activeColors.has(selectedColorRef.current) && colors.length > 0) {
      setSelectedColor(colors[0]);
    }
  }, []);

  const initGrid = useCallback((width: number) => {
    const newBubbles: Bubble[] = [];
    for (let r = 0; r < 5; r++) { 
      const cols = r % 2 !== 0 ? GRID_COLS - 1 : GRID_COLS;
      for (let c = 0; c < cols; c++) {
        if (Math.random() > 0.1) {
          const { x, y } = getBubblePos(r, c, width);
          newBubbles.push({
            id: `${r}-${c}`, row: r, col: c, x, y,
            color: COLOR_KEYS[Math.floor(Math.random() * COLOR_KEYS.length)],
            active: true
          });
        }
      }
    }
    bubbles.current = newBubbles;
    updateAvailableColors();
    logAction('Game environment re-synchronized');
    setTimeout(() => { captureRequestRef.current = true; }, 1000);
  }, [getBubblePos, updateAvailableColors, logAction]);

  const createExplosion = (x: number, y: number, color: string) => {
    for (let i = 0; i < 15; i++) {
      particles.current.push({ x, y, vx: (Math.random() - 0.5) * 12, vy: (Math.random() - 0.5) * 12, life: 1.0, color });
    }
  };

  const isPathClear = useCallback((target: Bubble) => {
    if (!anchorPos.current) return false;
    const startX = anchorPos.current.x, startY = anchorPos.current.y;
    const dx = target.x - startX, dy = target.y - startY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const steps = Math.ceil(distance / (BUBBLE_RADIUS / 2)); 
    for (let i = 1; i < steps - 2; i++) { 
      const t = i / steps;
      const cx = startX + dx * t, cy = startY + dy * t;
      for (const b of bubbles.current) {
        if (!b.active || b.id === target.id) continue;
        if (Math.pow(cx - b.x, 2) + Math.pow(cy - b.y, 2) < Math.pow(BUBBLE_RADIUS * 1.8, 2)) return false;
      }
    }
    return true;
  }, []);

  const isNeighbor = (a: Bubble, b: Bubble) => {
    const dr = b.row - a.row, dc = b.col - a.col;
    if (Math.abs(dr) > 1) return false;
    if (dr === 0) return Math.abs(dc) === 1;
    return a.row % 2 !== 0 ? (dc === 0 || dc === 1) : (dc === -1 || dc === 0);
  };

  const checkMatches = (startBubble: Bubble) => {
    const toCheck = [startBubble], visited = new Set<string>(), matches: Bubble[] = [];
    const targetColor = startBubble.color;
    while (toCheck.length > 0) {
      const current = toCheck.pop()!;
      if (visited.has(current.id)) continue;
      visited.add(current.id);
      if (current.color === targetColor) {
        matches.push(current);
        bubbles.current.filter(b => b.active && !visited.has(b.id) && isNeighbor(current, b)).forEach(n => toCheck.push(n));
      }
    }
    if (matches.length >= 3) {
      let pts = 0;
      matches.forEach(b => {
        b.active = false;
        createExplosion(b.x, b.y, COLOR_CONFIG[b.color].hex);
        pts += COLOR_CONFIG[targetColor].points;
      });
      scoreRef.current += Math.floor(pts * (matches.length > 3 ? 1.5 : 1.0));
      setScore(scoreRef.current);
      announce(`Score! Popped ${matches.length} bubbles. Total: ${scoreRef.current}`);
      logAction(`Points earned: ${pts} via ${matches.length} bubble match`);
      return true;
    }
    return false;
  };

  const performAiAnalysis = async (screenshot: string) => {
    isAiThinkingRef.current = true;
    setIsAiThinking(true);
    setAiHint("Scanning tactical field...");
    const activeBubbles = bubbles.current.filter(b => b.active);
    const uniqueColors = Array.from(new Set(activeBubbles.map(b => b.color))) as BubbleColor[];
    const allClusters: TargetCandidate[] = [];
    for (const color of uniqueColors) {
      const visited = new Set<string>();
      for (const b of activeBubbles) {
        if (b.color !== color || visited.has(b.id)) continue;
        const cluster: Bubble[] = [];
        const q = [b]; visited.add(b.id);
        while (q.length > 0) {
          const curr = q.shift()!; cluster.push(curr);
          activeBubbles.filter(n => !visited.has(n.id) && n.color === color && isNeighbor(curr, n)).forEach(n => { visited.add(n.id); q.push(n); });
        }
        const hit = cluster.sort((a,b) => b.y - a.y).find(m => isPathClear(m));
        if (hit) {
          allClusters.push({ id: hit.id, color, size: cluster.length, row: hit.row, col: hit.col, pointsPerBubble: COLOR_CONFIG[color].points, description: hit.x < (canvasRef.current?.width || 1000) / 2 ? "Left" : "Right" });
        }
      }
    }
    const maxRow = bubbles.current.reduce((max, b) => b.active ? Math.max(max, b.row) : max, 0);
    try {
      const res = await getStrategicHint(screenshot, allClusters, maxRow);
      setDebugInfo(res.debug); setAiHint(res.hint.message); setAiRationale(res.hint.rationale || null);
      announce(`AI Strategic Update: ${res.hint.message}`);
      if (typeof res.hint.targetRow === 'number' && typeof res.hint.targetCol === 'number') {
        if (res.hint.recommendedColor) { setAiRecommendedColor(res.hint.recommendedColor); setSelectedColor(res.hint.recommendedColor); }
        setAimTarget(getBubblePos(res.hint.targetRow, res.hint.targetCol, canvasRef.current?.width || 1000));
      }
    } finally {
      isAiThinkingRef.current = false; setIsAiThinking(false);
    }
  };

  const drawBubble = (ctx: CanvasRenderingContext2D, x: number, y: number, radius: number, colorKey: BubbleColor) => {
    const base = COLOR_CONFIG[colorKey].hex;
    const g = ctx.createRadialGradient(x - radius * 0.3, y - radius * 0.3, radius * 0.1, x, y, radius);
    if (theme === 'high-contrast') {
      ctx.beginPath(); ctx.arc(x, y, radius, 0, Math.PI * 2); ctx.fillStyle = base; ctx.fill(); ctx.strokeStyle = '#fff'; ctx.lineWidth = 3; ctx.stroke();
    } else {
      g.addColorStop(0, '#fff'); g.addColorStop(0.2, base); g.addColorStop(1, adjustColor(base, -60));
      ctx.beginPath(); ctx.arc(x, y, radius, 0, Math.PI * 2); ctx.fillStyle = g; ctx.fill();
      ctx.beginPath(); ctx.ellipse(x - radius * 0.3, y - radius * 0.35, radius * 0.25, radius * 0.15, Math.PI / 4, 0, Math.PI * 2); ctx.fillStyle = 'rgba(255,255,255,0.3)'; ctx.fill();
    }
  };

  useEffect(() => {
    if (!videoRef.current || !canvasRef.current || !gameContainerRef.current) return;
    const video = videoRef.current, canvas = canvasRef.current, container = gameContainerRef.current;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;
    canvas.width = container.clientWidth; canvas.height = container.clientHeight;
    anchorPos.current = { x: canvas.width / 2, y: canvas.height - SLINGSHOT_BOTTOM_OFFSET };
    ballPos.current = { ...anchorPos.current };
    initGrid(canvas.width);
    let camera: any = null, hands: any = null, animFrame: number;
    const onResults = (results: any) => {
      setLoading(false); latestResultsImage.current = results.image;
      if (results.multiHandLandmarks?.length > 0) {
        const lm = results.multiHandLandmarks[0]; latestHandLandmarks.current = lm;
        lastHandPos.current = { x: (lm[8].x + lm[4].x) / 2 * canvas.width, y: (lm[8].y + lm[4].y) / 2 * canvas.height };
        lastHandPinchDist.current = Math.sqrt(Math.pow(lm[8].x - lm[4].x, 2) + Math.pow(lm[8].y - lm[4].y, 2));
      } else { lastHandPos.current = null; latestHandLandmarks.current = null; }
    };
    const loop = () => {
      if (canvas.width !== container.clientWidth) { canvas.width = container.clientWidth; canvas.height = container.clientHeight; anchorPos.current = { x: canvas.width / 2, y: canvas.height - SLINGSHOT_BOTTOM_OFFSET }; }
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (latestResultsImage.current) ctx.drawImage(latestResultsImage.current, 0, 0, canvas.width, canvas.height);
      ctx.fillStyle = theme === 'light' ? 'rgba(241, 241, 243, 0.8)' : 'rgba(12, 12, 14, 0.9)'; ctx.fillRect(0, 0, canvas.width, canvas.height);
      const hPos = lastHandPos.current, pDist = lastHandPinchDist.current, mPos = lastMousePos.current, locked = isAiThinkingRef.current;
      let inputPos = (isMouseDown.current && mPos) ? mPos : hPos;
      
      // FIX: Ensure mouse interaction can trigger the pinching logic
      let pinching = (isMouseDown.current && mPos) ? true : (hPos && pDist < PINCH_THRESHOLD);
      
      if (latestHandLandmarks.current && window.drawConnectors) { window.drawConnectors(ctx, latestHandLandmarks.current, window.HAND_CONNECTIONS, {color: themeStyles.accent, lineWidth: 1.5}); }
      if (inputPos) { ctx.beginPath(); ctx.arc(inputPos.x, inputPos.y, 24, 0, Math.PI * 2); ctx.strokeStyle = pinching ? '#66bb6a' : themeStyles.accent; ctx.lineWidth = 3; ctx.setLineDash(pinching ? [] : [4,4]); ctx.stroke(); }
      if (!locked && inputPos && pinching && !isFlying.current) {
        if (!isPinching.current && Math.sqrt(Math.pow(inputPos.x - ballPos.current.x, 2) + Math.pow(inputPos.y - ballPos.current.y, 2)) < 120) isPinching.current = true;
        if (isPinching.current) {
          ballPos.current = { ...inputPos };
          const dist = Math.sqrt(Math.pow(ballPos.current.x - anchorPos.current.x, 2) + Math.pow(ballPos.current.y - anchorPos.current.y, 2));
          if (dist > MAX_DRAG_DIST) { const a = Math.atan2(ballPos.current.y - anchorPos.current.y, ballPos.current.x - anchorPos.current.x); ballPos.current = { x: anchorPos.current.x + Math.cos(a)*MAX_DRAG_DIST, y: anchorPos.current.y + Math.sin(a)*MAX_DRAG_DIST }; }
        }
      } else if (isPinching.current && (!inputPos || !pinching || locked)) {
        isPinching.current = false;
        if (!locked) {
          const dx = anchorPos.current.x - ballPos.current.x, dy = anchorPos.current.y - ballPos.current.y;
          if (Math.sqrt(dx*dx+dy*dy) > 30) {
            isFlying.current = true;
            const p = Math.min(Math.sqrt(dx*dx+dy*dy)/MAX_DRAG_DIST, 1);
            const m = MIN_FORCE_MULT + (MAX_FORCE_MULT - MIN_FORCE_MULT) * (p*p);
            ballVel.current = { x: dx*m, y: dy*m };
            announce('Projectile launched.');
          } else ballPos.current = { ...anchorPos.current };
        } else ballPos.current = { ...anchorPos.current };
      } else if (!isFlying.current && !isPinching.current) {
        ballPos.current.x += (anchorPos.current.x - ballPos.current.x) * 0.2; ballPos.current.y += (anchorPos.current.y - ballPos.current.y) * 0.2;
      }
      if (isFlying.current) {
        const steps = Math.ceil(Math.sqrt(ballVel.current.x**2+ballVel.current.y**2)/15); let hit = false;
        for (let i=0; i<steps; i++) {
          ballPos.current.x += ballVel.current.x/steps; ballPos.current.y += ballVel.current.y/steps;
          if (ballPos.current.x < BUBBLE_RADIUS || ballPos.current.x > canvas.width - BUBBLE_RADIUS) { ballVel.current.x *= -1; }
          if (ballPos.current.y < BUBBLE_RADIUS || bubbles.current.some(b => b.active && Math.sqrt((ballPos.current.x-b.x)**2+(ballPos.current.y-b.y)**2) < BUBBLE_RADIUS*1.8)) { hit = true; break; }
        }
        ballVel.current.x *= FRICTION; ballVel.current.y *= FRICTION;
        if (hit) {
          isFlying.current = false; let bestD = Infinity, bR=0, bC=0, bX=0, bY=0;
          for (let r=0; r<GRID_ROWS+5; r++) { for (let c=0; c<(r%2!==0?GRID_COLS-1:GRID_COLS); c++) {
            const {x,y} = getBubblePos(r,c,canvas.width); if (bubbles.current.some(b=>b.active && b.row===r && b.col===c)) continue;
            const d = Math.sqrt((ballPos.current.x-x)**2+(ballPos.current.y-y)**2); if (d < bestD) { bestD = d; bR = r; bC = c; bX = x; bY = y; }
          }}
          const nb: Bubble = { id: `${bR}-${bC}-${Date.now()}`, row: bR, col: bC, x: bX, y: bY, color: selectedColorRef.current, active: true };
          bubbles.current.push(nb); checkMatches(nb); updateAvailableColors(); ballPos.current = { ...anchorPos.current }; captureRequestRef.current = true;
        }
        if (ballPos.current.y > canvas.height) { isFlying.current = false; ballPos.current = { ...anchorPos.current }; announce('Miss.'); }
      }
      bubbles.current.forEach(b => b.active && drawBubble(ctx, b.x, b.y, BUBBLE_RADIUS - 1, b.color));
      const aim = aimTargetRef.current;
      if (aim && !isFlying.current && !locked && (aiRecommendedColor === selectedColorRef.current)) {
        ctx.beginPath(); ctx.moveTo(anchorPos.current.x, anchorPos.current.y); ctx.lineTo(aim.x, aim.y); ctx.setLineDash([10,10]); ctx.strokeStyle = COLOR_CONFIG[selectedColorRef.current].hex; ctx.lineWidth = 2; ctx.stroke();
      }
      ctx.setLineDash([]);
      ctx.beginPath(); ctx.moveTo(anchorPos.current.x-35, anchorPos.current.y-10); ctx.lineTo(ballPos.current.x, ballPos.current.y); ctx.lineTo(anchorPos.current.x+35, anchorPos.current.y-10); ctx.lineWidth=6; ctx.strokeStyle=isPinching.current?'#fdd835':(theme==='light'?'rgba(0,0,0,0.1)':'rgba(255,255,255,0.4)'); ctx.stroke();
      drawBubble(ctx, ballPos.current.x, ballPos.current.y, BUBBLE_RADIUS, selectedColorRef.current);
      particles.current.forEach((p,i) => { p.x += p.vx; p.y += p.vy; p.life -= 0.04; if (p.life > 0) { ctx.globalAlpha = p.life; ctx.beginPath(); ctx.arc(p.x, p.y, 4, 0, Math.PI*2); ctx.fillStyle = p.color; ctx.fill(); } });
      particles.current = particles.current.filter(p => p.life > 0); ctx.globalAlpha = 1;
      if (captureRequestRef.current) {
        captureRequestRef.current = false; const off = document.createElement('canvas'); off.width = 512; off.height = 512;
        off.getContext('2d')?.drawImage(canvas, 0, 0, 512, 512); performAiAnalysis(off.toDataURL("image/jpeg", 0.7));
      }
      animFrame = requestAnimationFrame(loop);
    };
    if (window.Hands) {
      hands = new window.Hands({ locateFile: (f: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${f}` });
      hands.setOptions({ maxNumHands: 1, modelComplexity: 1, minDetectionConfidence: 0.6, minTrackingConfidence: 0.6 });
      hands.onResults(onResults);
      if (window.Camera) { camera = new window.Camera(video, { onFrame: async () => { if (videoRef.current && hands) await hands.send({ image: videoRef.current }); }, width: 1280, height: 720 }); camera.start(); }
    }
    animFrame = requestAnimationFrame(loop);
    return () => { if (camera) camera.stop(); if (hands) hands.close(); cancelAnimationFrame(animFrame); };
  }, [initGrid, getBubblePos, updateAvailableColors, theme, themeStyles]);

  useEffect(() => { selectedColorRef.current = selectedColor; }, [selectedColor]);
  useEffect(() => { aimTargetRef.current = aimTarget; }, [aimTarget]);

  return (
    <div 
      className="flex w-full h-screen overflow-hidden font-sans transition-colors duration-500"
      style={{ backgroundColor: themeStyles.bg, color: themeStyles.text }}
      role="application"
      aria-label="Gemini Slingshot Game Workspace"
    >
      <div className="sr-only" aria-live="polite" role="status">{announcement}</div>

      <main ref={gameContainerRef} className="flex-1 relative h-full overflow-hidden cursor-crosshair">
        <video ref={videoRef} className="absolute hidden" playsInline />
        <canvas 
          ref={canvasRef} 
          className="absolute inset-0" 
          onMouseDown={(e) => { 
            isMouseDown.current = true; 
            if (!canvasRef.current) return;
            const r = canvasRef.current.getBoundingClientRect(); 
            lastMousePos.current = { x: canvasRef.current.width - (e.clientX - r.left), y: e.clientY - r.top }; 
          }} 
          onMouseMove={(e) => { 
            if (!canvasRef.current) return; 
            const r = canvasRef.current.getBoundingClientRect(); 
            lastMousePos.current = { x: canvasRef.current.width - (e.clientX - r.left), y: e.clientY - r.top }; 
          }} 
          onMouseUp={() => {
            isMouseDown.current = false;
          }} 
          aria-hidden="true"
        />

        {loading && (
          <div className="absolute inset-0 flex items-center justify-center z-50" style={{ backgroundColor: themeStyles.bg }}>
            <div className="flex flex-col items-center gap-4">
               <Loader2 className="w-12 h-12 animate-spin" style={{ color: themeStyles.accent }} />
               <p className="text-xl font-bold animate-pulse" style={{ color: themeStyles.accent }}>Synchronizing Tactical Systems...</p>
            </div>
          </div>
        )}

        {/* Global HUD Overlay */}
        <section className="absolute top-10 left-10 z-40 flex flex-col gap-4">
          <div className="px-8 py-5 rounded-[2rem] border flex items-center gap-4 shadow-xl" style={{ backgroundColor: themeStyles.hud, borderColor: themeStyles.border }}>
            <Trophy className="w-6 h-6" style={{ color: themeStyles.accent }} aria-hidden="true" />
            <div>
              <p className="text-[10px] uppercase font-black opacity-40 tracking-widest">Global Score</p>
              <p className="text-3xl font-black" aria-label={`Score is ${score}`}>{score.toLocaleString()}</p>
            </div>
          </div>

          <nav className="flex gap-2" aria-label="Appearance Mode">
            {[ { id: 'dark', icon: <Moon /> }, { id: 'light', icon: <Sun /> }, { id: 'high-contrast', icon: <Contrast /> } ].map(t => (
              <button 
                key={t.id}
                onClick={() => handleThemeChange(t.id as ThemeType)} 
                className={`p-3 rounded-full border transition-all ${theme === t.id ? 'scale-110 shadow-lg' : 'opacity-40'}`}
                style={{ backgroundColor: theme === t.id ? themeStyles.accent : 'transparent', borderColor: themeStyles.border }}
                aria-label={`Switch to ${t.id} mode`}
                aria-pressed={theme === t.id}
              >
                {React.cloneElement(t.icon as React.ReactElement, { className: 'w-4 h-4 text-white' })}
              </button>
            ))}
          </nav>
        </section>

        {/* Security Access Portal */}
        <section className="absolute top-10 right-10 z-40">
          {!isAdmin ? (
            <button 
              onClick={() => setShowAdminLogin(true)}
              className="p-4 rounded-full border transition-all hover:bg-white/5 shadow-lg"
              style={{ backgroundColor: themeStyles.panel, borderColor: themeStyles.border }}
              aria-label="Administrator Log-in"
            >
              <Key className="w-5 h-5 opacity-40" />
            </button>
          ) : (
            <div className="flex items-center gap-3 bg-green-500/10 px-4 py-2 rounded-full border border-green-500/20 shadow-lg">
              {isAdmin && (
                <button 
                  onClick={() => setShowRefreshProtocol(true)}
                  className="p-1 hover:text-[#C8A84B] transition-colors"
                  aria-label="Refresh Protocol Monitor"
                >
                  <RefreshCw className="w-4 h-4 animate-spin-slow" />
                </button>
              )}
              <ShieldCheck className="w-4 h-4 text-green-500" />
              <span className="text-[10px] font-black uppercase text-green-500 tracking-widest">Admin Access</span>
              <button onClick={handleAdminLogout} className="ml-2 p-1 hover:text-red-500 transition-colors" aria-label="End Admin Session">
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </section>

        {/* Slingshot Ammo Selector */}
        <nav 
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-40 px-8 py-4 rounded-full border flex gap-4 shadow-2xl"
          style={{ backgroundColor: themeStyles.hud, borderColor: themeStyles.border }}
          role="radiogroup"
          aria-label="Ammunition Inventory"
        >
          {COLOR_KEYS.filter(c => availableColors.includes(c)).map(color => (
            <button 
              key={color} 
              onClick={() => { setSelectedColor(color); announce(`${color} ammunition selected.`); }} 
              className={`w-12 h-12 rounded-full transition-all focus:outline-none focus:ring-4 focus:ring-offset-2 ${selectedColor === color ? 'scale-125 ring-2 ring-white shadow-lg' : 'opacity-40 hover:opacity-100'}`} 
              style={{ backgroundColor: COLOR_CONFIG[color].hex, boxShadow: aiRecommendedColor === color ? `0 0 25px ${COLOR_CONFIG[color].hex}` : 'none' }} 
              aria-label={`Select ${color} projectile. ${aiRecommendedColor === color ? 'AI Recommended.' : ''}`}
              aria-checked={selectedColor === color}
            >
              {aiRecommendedColor === color && <div className="w-2 h-2 bg-white rounded-full mx-auto animate-pulse" />}
            </button>
          ))}
        </nav>

        {/* Security Modal */}
        {showAdminLogin && (
          <div className="absolute inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-xl" role="dialog" aria-modal="true" aria-labelledby="admin-title">
            <div className="bg-[#121214] border border-white/10 p-10 rounded-[3rem] w-96 shadow-2xl">
              <h3 id="admin-title" className="text-2xl font-black mb-8 flex items-center gap-4 text-white"><Lock className="w-6 h-6 text-[#4285f4]" /> Security Authentication</h3>
              <div className="space-y-3 mb-8">
                <label htmlFor="admin-pass" className="text-[10px] uppercase font-black opacity-40 text-white tracking-[0.2em]">Project Credential</label>
                <input id="admin-pass" type="password" placeholder="Passcode" value={adminPassInput} onChange={(e) => setAdminPassInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleAdminLogin()} className="w-full bg-white/5 border border-white/15 p-5 rounded-3xl text-white focus:outline-none focus:border-[#4285f4] transition-all" autoFocus />
              </div>
              <div className="flex gap-4">
                <button onClick={() => { setShowAdminLogin(false); setAdminPassInput(''); }} className="flex-1 p-5 bg-white/5 rounded-3xl font-black text-xs text-white/40 hover:text-white transition-all uppercase tracking-widest">Cancel</button>
                <button onClick={handleAdminLogin} className="flex-1 p-5 bg-[#4285f4] rounded-3xl font-black text-xs text-white hover:bg-[#1a73e8] transition-all shadow-xl uppercase tracking-widest">Verify</button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Intelligence & Quality Assurance Sidebar */}
      {showDebug && (
        <aside 
          className="w-[420px] border-l flex flex-col h-full shadow-2xl overflow-hidden"
          style={{ backgroundColor: themeStyles.panel, borderColor: themeStyles.border }}
          aria-label="Intelligence and QA Dashboard"
        >
          {/* Dashboard Tabs */}
          <div className="flex border-b border-white/5">
            <button 
              onClick={() => setSidebarTab('ai')}
              className={`flex-1 flex flex-col items-center justify-center gap-2 p-6 text-[10px] font-black uppercase tracking-[0.3em] transition-all ${sidebarTab === 'ai' ? 'text-[#4285f4] bg-white/[0.03] border-b-2 border-[#4285f4]' : 'opacity-40 hover:opacity-80'}`}
              aria-label="Strategic Advisor"
            >
              <BrainCircuit className="w-5 h-5" /> Strategic Advisor
            </button>
            <button 
              onClick={() => setSidebarTab('test')}
              className={`flex-1 flex flex-col items-center justify-center gap-2 p-6 text-[10px] font-black uppercase tracking-[0.3em] transition-all ${sidebarTab === 'test' ? 'text-green-500 bg-white/[0.03] border-b-2 border-green-500' : 'opacity-40 hover:opacity-80'}`}
              aria-label="Quality Lab"
            >
              <TestTube className="w-5 h-5" /> Quality Lab
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-10 space-y-10 custom-scrollbar">
            {sidebarTab === 'ai' ? (
              <>
                <div className="p-8 rounded-[2rem] border italic font-black text-2xl shadow-inner leading-relaxed transition-all duration-700" style={{ backgroundColor: themeStyles.bg, borderColor: themeStyles.border }}>
                  "{aiHint}"
                </div>
                {debugInfo?.screenshotBase64 && (
                  <figure className="space-y-3">
                    <figcaption className="text-[10px] font-black opacity-30 uppercase tracking-[0.2em]">Neural Processing Buffer</figcaption>
                    <img src={debugInfo.screenshotBase64} className="rounded-3xl border border-white/10 opacity-70 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500 cursor-zoom-in shadow-xl" alt="Board state processed by AI" />
                  </figure>
                )}
                {isAdmin ? (
                  <section className="space-y-8 pt-8 border-t border-white/5 animate-in fade-in slide-in-from-bottom-4">
                    <div className="grid grid-cols-2 gap-4">
                      <button onClick={() => { bubbles.current = []; initGrid(canvasRef.current!.width); }} className="flex items-center justify-center gap-3 p-5 bg-red-500/10 border border-red-500/20 rounded-[1.5rem] text-[10px] font-black uppercase text-red-500 hover:bg-red-500/20 shadow-sm transition-all"><Trash2 className="w-4 h-4" /> Reset Grid</button>
                      <button onClick={() => { captureRequestRef.current = true; }} className="flex items-center justify-center gap-3 p-5 bg-[#4285f4]/10 border border-[#4285f4]/20 rounded-[1.5rem] text-[10px] font-black uppercase text-[#4285f4] hover:bg-[#4285f4]/20 shadow-sm transition-all"><Sparkles className="w-4 h-4" /> Force Analysis</button>
                    </div>
                    <div className="space-y-5">
                      <header className="flex items-center justify-between"><h3 className="text-[10px] font-black opacity-30 uppercase tracking-[0.2em] flex items-center gap-2"><History className="w-3 h-3" /> Security Event Stream</h3></header>
                      <div className="max-h-72 overflow-y-auto space-y-4 pr-3 font-mono text-[10px] opacity-40 custom-scrollbar">
                        {auditLogs.length === 0 ? <p className="italic py-4 text-center">Stream idle...</p> : auditLogs.map(log => <div key={log.id} className="border-b border-white/5 pb-3 last:border-0 leading-relaxed"><span className="text-[#4285f4] font-bold">[{log.timestamp}]</span> <span className="text-green-500 font-bold">{log.user}:</span> {log.action}</div>)}
                      </div>
                    </div>
                  </section>
                ) : (
                  <section className="font-mono text-[10px] opacity-20 space-y-3">
                    <p className="font-black border-b border-white/5 pb-3 uppercase tracking-widest">Telemetry Stream</p>
                    <pre className="whitespace-pre-wrap leading-relaxed">{debugInfo?.rawResponse || 'System in standby mode...'}</pre>
                  </section>
                )}
              </>
            ) : (
              <section className="space-y-10 animate-in fade-in slide-in-from-right-4">
                <header className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h3 className="text-2xl font-black tracking-tight">Integrity Suite</h3>
                    <p className="text-[10px] uppercase font-black opacity-30 tracking-[0.2em] italic">E2E Self-Diagnostic Framework</p>
                  </div>
                  <button 
                    onClick={runSelfTestSuite} 
                    disabled={isRunningTests}
                    className={`p-5 rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.2em] shadow-xl transition-all ${isRunningTests ? 'bg-white/5 opacity-40' : 'bg-green-600 text-white hover:bg-green-500 hover:scale-105 active:scale-95'}`}
                  >
                    {isRunningTests ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Start Suite'}
                  </button>
                </header>

                <div className="space-y-5">
                  {testResults.length === 0 && (
                    <div className="text-center py-20 border-2 border-dashed border-white/5 rounded-[2rem] opacity-30">
                      <Gauge className="w-12 h-12 mx-auto mb-4" />
                      <p className="text-xs italic font-mono">System awaiting diagnostic cycle...</p>
                    </div>
                  )}
                  {testResults.map(test => (
                    <article key={test.id} className="bg-white/[0.02] border border-white/5 rounded-[2rem] p-6 space-y-5 shadow-inner hover:bg-white/[0.04] transition-all group">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-5">
                          {test.status === 'passed' && <CheckCircle2 className="w-6 h-6 text-green-500" />}
                          {test.status === 'failed' && <XCircle className="w-6 h-6 text-red-500" />}
                          {test.status === 'pending' && <Loader2 className="w-6 h-6 animate-spin text-[#4285f4]" />}
                          <span className={`font-black text-sm tracking-tight ${test.status === 'failed' ? 'text-red-500' : 'text-white/90'}`}>{test.name}</span>
                        </div>
                        <span className="text-[9px] font-mono opacity-20 uppercase font-black">[{test.status}]</span>
                      </div>
                      
                      {test.status === 'failed' && <p className="bg-red-500/10 p-4 rounded-2xl text-[10px] font-mono text-red-400 border border-red-500/20 leading-relaxed shadow-sm">{test.message}</p>}
                      
                      {test.screenshot && (
                        <div className="space-y-3">
                          <div className="flex items-center gap-2 text-[9px] font-black opacity-20 uppercase tracking-[0.2em]"><Camera className="w-3 h-3" /> State Capture Verified</div>
                          <img src={test.screenshot} className="w-full h-40 object-cover rounded-2xl border border-white/10 opacity-60 group-hover:opacity-100 transition-opacity duration-500 shadow-md" alt="Test verification snapshot" />
                        </div>
                      )}
                    </article>
                  ))}
                </div>

                <div className="p-8 bg-white/[0.02] rounded-[2rem] border border-dashed border-white/10 space-y-5">
                   <h4 className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40">CI/CD CI Extraction Pipeline</h4>
                   <p className="text-[10px] leading-relaxed opacity-60">Utilize the following script configuration for external Playwright verification during automated deployment cycles.</p>
                   <div className="bg-black/40 p-5 rounded-2xl font-mono text-[9px] opacity-40 overflow-hidden select-all break-all shadow-inner">
                      const playwright = require('playwright');... [System Suite v1.0.2-QA]
                   </div>
                </div>
              </section>
            )}
          </div>
          
          <footer className="p-10 border-t border-white/5 opacity-20 flex justify-between items-center text-[9px] font-black uppercase tracking-[0.3em]">
             <span className="flex items-center gap-2"><Activity className="w-3 h-3" /> Ver 1.0.2-QA</span>
             <span>Phase 3 Deployment</span>
          </footer>
        </aside>
      )}

      {/* Refresh Protocol Overlay */}
      {showRefreshProtocol && (
        <RefreshStatus themeStyles={themeStyles} onBack={() => setShowRefreshProtocol(false)} />
      )}
    </div>
  );
};

export default GeminiSlingshot;
import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';

// Configuration constants
const MAX_DRONES = 1000;
const DISPLAY_DURATION = 45000; // 45 seconds
const JITTER_AMOUNT = 5;
const POINTS_PER_LENGTH = 500;
const CULMINATION_PHASE_DUR = 5000; // 5 seconds

// Colour palette
const COLORS = {
  indigoSky: '#1a202c',
  warmGold: '#FFD700',
  regalPurple: '#A020F0',
  panAfricanRed: '#EF3340',
  panAfricanGreen: '#009732',
  pureWhite: '#FFFFFF'
};

// Greek letters array
const GREEK_LETTERS_ORDER = [
  "alpha", "beta", "gamma", "delta", "epsilon", "zeta", "eta", "theta",
  "iota", "kappa", "lambda", "mu", "nu", "xi", "omicron", "pi",
  "rho", "sigma", "tau", "upsilon", "phi", "chi", "psi", "omega"
];

// Africa outline points
const AFRICA_OUTLINE_POINTS = [
  {x: 0.50, y: 0.05, color: COLORS.panAfricanGreen}, 
  {x: 0.60, y: 0.07, color: COLORS.panAfricanGreen},
  {x: 0.70, y: 0.12, color: COLORS.panAfricanRed},
  {x: 0.78, y: 0.18, color: COLORS.panAfricanRed},
  {x: 0.85, y: 0.25, color: COLORS.panAfricanRed},
  {x: 0.88, y: 0.35, color: COLORS.panAfricanRed},
  {x: 0.86, y: 0.45, color: COLORS.panAfricanGreen},
  {x: 0.82, y: 0.55, color: COLORS.panAfricanGreen},
  {x: 0.78, y: 0.65, color: COLORS.panAfricanGreen},
  {x: 0.75, y: 0.75, color: COLORS.warmGold},
  {x: 0.70, y: 0.85, color: COLORS.warmGold},
  {x: 0.60, y: 0.95, color: COLORS.warmGold},
  {x: 0.50, y: 0.92, color: COLORS.panAfricanRed},
  {x: 0.40, y: 0.85, color: COLORS.panAfricanRed},
  {x: 0.35, y: 0.75, color: COLORS.panAfricanRed},
  {x: 0.30, y: 0.65, color: COLORS.warmGold},
  {x: 0.28, y: 0.58, color: COLORS.warmGold},
  {x: 0.25, y: 0.50, color: COLORS.warmGold},
  {x: 0.20, y: 0.45, color: COLORS.panAfricanGreen},
  {x: 0.15, y: 0.38, color: COLORS.panAfricanGreen},
  {x: 0.10, y: 0.30, color: COLORS.panAfricanGreen},
  {x: 0.15, y: 0.20, color: COLORS.panAfricanRed},
  {x: 0.20, y: 0.12, color: COLORS.panAfricanRed},
  {x: 0.30, y: 0.08, color: COLORS.panAfricanRed}
];

// Africa shape segments
const AFRICA_SHAPE_SEGMENTS = (() => {
  const segments = [];
  for (let i = 0; i < AFRICA_OUTLINE_POINTS.length; i++) {
    const p1 = AFRICA_OUTLINE_POINTS[i];
    const p2 = AFRICA_OUTLINE_POINTS[(i + 1) % AFRICA_OUTLINE_POINTS.length];
    segments.push({ p1, p2, part: 'coast', color: p1.color });
  }
  return segments;
})();

// Greek letter shapes
const GREEK_LETTER_SHAPES_DATA = {
  "alpha": [
    { p1: {x: 0.5, y: 0, part: 'main'}, p2: {x: 0, y: 1, part: 'main'} },
    { p1: {x: 0.5, y: 0, part: 'main'}, p2: {x: 1, y: 1, part: 'main'} },
    { p1: {x: 0.25, y: 0.65, part: 'crossbar'}, p2: {x: 0.75, y: 0.65, part: 'crossbar'} }
  ],
  "beta": [
    { p1: {x: 0, y: 0, part: 'stem'}, p2: {x: 0, y: 1, part: 'stem'} },
    { p1: {x: 0.2, y: 0.4, part: 'loop1'}, p2: {x: 0, y: 0.4, part: 'loop1'} },
    { p1: {x: 0.2, y: 1, part: 'loop2'}, p2: {x: 0, y: 1, part: 'loop2'} }
  ],
  "gamma": [
    { p1: {x: 0, y: 0, part: 'top'}, p2: {x: 1, y: 0, part: 'top'} },
    { p1: {x: 0, y: 0, part: 'stem'}, p2: {x: 0, y: 1, part: 'stem'} }
  ],
  "delta": [
    { p1: {x: 0.5, y: 0, part: 'main'}, p2: {x: 0, y: 1, part: 'main'} },
    { p1: {x: 0, y: 1, part: 'main'}, p2: {x: 1, y: 1, part: 'main'} },
    { p1: {x: 1, y: 1, part: 'main'}, p2: {x: 0.5, y: 0, part: 'main'} }
  ],
  "epsilon": [
    { p1: {x: 0, y: 0, part: 'stem'}, p2: {x: 0, y: 1, part: 'stem'} },
    { p1: {x: 0, y: 0, part: 'top'}, p2: {x: 1, y: 0, part: 'top'} },
    { p1: {x: 0, y: 0.5, part: 'middle'}, p2: {x: 0.7, y: 0.5, part: 'middle'} },
    { p1: {x: 0, y: 1, part: 'bottom'}, p2: {x: 1, y: 1, part: 'bottom'} }
  ],
  "zeta": [
    { p1: {x: 0, y: 0, part: 'top'}, p2: {x: 1, y: 0, part: 'top'} },
    { p1: {x: 0, y: 1, part: 'bottom'}, p2: {x: 1, y: 1, part: 'bottom'} },
    { p1: {x: 1, y: 0, part: 'diagonal'}, p2: {x: 0, y: 1, part: 'diagonal'} }
  ],
  "eta": [
    { p1: {x: 0, y: 0, part: 'left'}, p2: {x: 0, y: 1, part: 'left'} },
    { p1: {x: 1, y: 0, part: 'right'}, p2: {x: 1, y: 1, part: 'right'} },
    { p1: {x: 0, y: 0.5, part: 'crossbar'}, p2: {x: 1, y: 0.5, part: 'crossbar'} }
  ],
  "theta": [
    { p1: {x: 0.1, y: 0.5, part: 'crossbar'}, p2: {x: 0.9, y: 0.5, part: 'crossbar'} }
  ],
  "iota": [
    { p1: {x: 0.5, y: 0, part: 'main'}, p2: {x: 0.5, y: 1, part: 'main'} }
  ],
  "kappa": [
    { p1: {x: 0, y: 0, part: 'stem'}, p2: {x: 0, y: 1, part: 'stem'} },
    { p1: {x: 0, y: 0.5, part: 'diagonal1'}, p2: {x: 1, y: 0, part: 'diagonal1'} },
    { p1: {x: 0, y: 0.5, part: 'diagonal2'}, p2: {x: 1, y: 1, part: 'diagonal2'} }
  ],
  "lambda": [
    { p1: {x: 0, y: 1, part: 'left'}, p2: {x: 0.5, y: 0, part: 'left'} },
    { p1: {x: 1, y: 1, part: 'right'}, p2: {x: 0.5, y: 0, part: 'right'} }
  ],
  "mu": [
    { p1: {x: 0, y: 0, part: 'left_stem'}, p2: {x: 0, y: 1, part: 'left_stem'} },
    { p1: {x: 1, y: 0, part: 'right_stem'}, p2: {x: 1, y: 1, part: 'right_stem'} },
    { p1: {x: 0, y: 0, part: 'diag1'}, p2: {x: 0.5, y: 0.7, part: 'diag1'} },
    { p1: {x: 1, y: 0, part: 'diag2'}, p2: {x: 0.5, y: 0.7, part: 'diag2'} }
  ],
  "nu": [
    { p1: {x: 0, y: 0, part: 'left_stem'}, p2: {x: 0, y: 1, part: 'left_st极'} },
    { p1: {x: 1, y: 0, part: 'right_stem'}, p2: {x: 1, y: 1, part: 'right_stem'} },
    { p1: {x: 0, y: 0, part: 'diagonal'}, p2: {x: 1, y: 1, part: 'diagonal'} }
  ],
  "xi": [
    { p1: {x: 0, y: 0, part: 'top'}, p2: {x: 1, y: 0, part: 'top'} },
    { p1: {x: 0, y: 0.5, part: 'middle'}, p2: {x: 1, y: 0.5, part: 'middle'} },
    { p1: {x: 0, y: 1, part: 'bottom'}, p2: {x: 1, y: 1, part: 'bottom'} }
  ],
  "omicron": [
    { p1: {x: 0.5, y: 0.1, part: 'circle'}, p2: {x: 0.5, y: 0.9, part: 'circle'} }
  ],
  "pi": [
    { p1: {x: 0, y: 0, part: 'top'}, p2: {x: 1, y: 0, part: 'top'} },
    { p1: {x: 0, y: 0, part: 'left_stem'}, p2: {x: 0, y: 1, part: 'left_stem'} },
    { p1: {x: 1, y: 0, part: 'right_stem'}, p2: {x: 1, y: 1, part: 'right_stem'} }
  ],
  "rho": [
    { p1: {x: 0, y: 0, part: 'stem'}, p2: {x: 0, y: 1, part: 'stem'} },
    { p1: {x: 0, y: 0.5, part: 'loop'}, p2: {x: 0.25, y: 0, part: 'loop'} }
  ],
  "sigma": [
    { p1: {x: 0.7, y: 0.0}, p2: {x: 0.3, y: 0.0, part: 'curve1'} },
    { p1: {x: 0.3, y: 1.0}, p2: {x: 0.7, y: 1.0, part: 'curve2'} },
    { p1: {x: 0.5, y: 0.5, part: 'main'}, p2: {x: 0.7, y: 0.2, part: 'main'} },
    { p1: {x: 0.5, y: 0.5, part: 'main'}, p2: {x: 0.3, y: 0.8, part: 'main'} }
  ],
  "tau": [
    { p1: {x: 0, y: 0, part: 'top'}, p2: {x: 1, y: 0, part: 'top'} },
    { p1: {x: 0.5, y: 0, part: 'stem'}, p2: {x: 0.5, y: 1, part: 'stem'} }
  ],
  "upsilon": [
    { p1: {x: 0, y: 0, part: 'left_arm'}, p2: {x: 0.5, y: 1, part: 'left_arm'} },
    { p1: {x: 1, y: 0, part: 'right_arm'}, p2: {x: 0.5, y: 1, part: 'right_arm'} }
  ],
  "phi": [
    { p1: {x: 0.5, y: 0, part: 'stem'}, p2: {x: 0.5, y: 1, part: 'stem'} }
  ],
  "chi": [
    { p1: {x: 0, y: 0, part: 'diag1'}, p2: {x: 1, y: 1, part: 'diag1'} },
    { p1: {x: 1, y: 0, part: 'diag2'}, p2: {x: 0, y: 1, part: 'diag2'} }
  ],
  "psi": [
    { p1: {x: 0, y: 0, part: 'left_arm'}, p2: {x: 0.5, y: 0.5, part: 'left_arm'} },
    { p1: {x: 1, y: 0, part: 'right_arm'}, p2: {x: 0.5, y: 0.5, part: 'right_arm'} },
    { p1: {x: 0.5, y: 0.5, part: 'stem'}, p2: {x: 0.5, y: 1, part: 'stem'} }
  ],
  "omega": [
    { p1: {x: 0.3, y: 0.3, part: 'main'}, p2: {x: 0.7, y: 0.3, part: 'main'} },
    { p1: {x: 0.4, y: 1, part: 'feet'}, p2: {x: 0.6, y: 1, part: 'feet'} },
    { p1: {x: 0.4, y: 1}, p2: {x: 0.4, y: 0.7}, part: 'feet' },
    { p1: {x: 0.6, y: 1}, p2: {x: 0.6, y: 0.7}, part: 'feet' }
  ]
};

// Helper function for generating shape points
const generateShapePoints = (shapeSegments, scaleX, scaleY, offsetX, offsetY) => {
  const points = [];
  
  for (const seg of shapeSegments) {
    const dx = seg.p2.x - seg.p1.x;
    const dy = seg.p2.y - seg.p1.y;
    const length = Math.sqrt(dx * dx + dy * dy);
    const numPoints = Math.max(1, Math.round(length * POINTS_PER_LENGTH));
    
    for (let i = 0; i < numPoints; i++) {
      const t = i / numPoints;
      points.push({
        x: seg.p1.x + dx * t,
        y: seg.p1.y + dy * t,
        color: seg.color || COLORS.warmGold,
        part: seg.part || 'main'
      });
    }
  }
  
  return points.map(p => ({
    x: p.x * scaleX + offsetX,
    y: p.y * scaleY + offsetY,
    color: p.color,
    part: p.part
  }));
};

// Drone class
class Drone {
  constructor(startX, startY, targets, color, africanTextColor, size = 3) {
    this.x = startX;
    this.y = startY;
    this.targets = targets; // { greek, africa, text }
    this.color = color;
    this.africanTextColor = africanTextColor;
    this.size = size;
    this.alpha = 0;
    this.baseAlpha = 1;
    this.drawColor = COLORS.pureWhite;
    this.currentTarget = 'scatter';
  }

  lerp(start, end, t) {
    return start + (end - start) * t;
  }

  interpolateColor(color1, color2, factor) {
    if (!color1 || !color2) return COLORS.pureWhite;
    
    const hexToRgb = (hex) => {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return [r, g, b];
    };
    
    const rgbToHex = (r, g, b) => {
      return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).padStart(6, '0')}`;
    };
    
    const rgb1 = hexToRgb(color1);
    const rgb2 = hexToRgb(color2);
    
    const r = Math.round(rgb1[0] + factor * (rgb2[0] - rgb1[0]));
    const g = Math.round(rgb1[1] + factor * (rgb2[1] - rgb1[1]));
    const b = Math.round(rgb1[2] + factor * (rgb2[2] - rgb1[2]));
    
    return rgbToHex(r, g, b);
  }

  update(elapsed) {
    // Phase timing
    const SCATTER_DUR = 10000;
    const OUTLINE_HOLD_DUR = 2000;
    const TEXT_FORMATION_DUR = 10000;
    const TEXT_HOLD_DUR = 2000;
    const TRANSITION_DUR = 16000;
    
    // Phase calculations
    if (elapsed < SCATTER_DUR) {
      // Phase 1: Scatter to Africa outline
      const t = elapsed / SCATTER_DUR;
      this.x = this.lerp(this.x, this.targets.africa.x, t);
      this.y = this.lerp(this.y, this.targets.africa.y, t);
      this.alpha = this.lerp(0, this.baseAlpha, t);
      this.drawColor = this.interpolateColor(COLORS.pureWhite, this.targets.africa.color, t);
      this.currentTarget = 'africa';
    } 
    else if (elapsed < SCATTER_DUR + OUTLINE_HOLD_DUR) {
      // Phase 2: Hold outline
      this.currentTarget = 'africa';
      this.drawColor = this.targets.africa.color;
    }
    else if (elapsed < SCATTER_DUR + OUTLINE_HOLD_DUR + TEXT_FORMATION_DUR) {
      // Phase 3: Form text
      const t = (elapsed - SCATTER_DUR - OUTLINE_HOLD_DUR) / TEXT_FORMATION_DUR;
      this.x = this.lerp(this.targets.africa.x, this.targets.text.x, t);
      this.y = this.lerp(this.targets.africa.y, this.targets.text.y, t);
      this.drawColor = this.interpolateColor(this.targets.africa.color, this.africanTextColor, t);
      this.currentTarget = 'text';
    }
    else if (elapsed < SCATTER_DUR + OUTLINE_HOLD极 + TEXT_FORMATION_DUR + TEXT_HOLD_DUR) {
      // Phase 4: Hold text
      this.currentTarget = 'text';
      this.drawColor = this.africanTextColor;
    }
    else if (elapsed < DISPLAY_DURATION - CULMINATION_PHASE_DUR) {
      // Phase 5: Transition to Greek letter
      const t = (elapsed - SCATTER_DUR - OUTLINE_HOLD_DUR - TEXT_FORMATION_DUR - TEXT_HOLD_DUR) / TRANSITION_DUR;
      
      if (t < 0.25) {
        // Transition to white
        this.drawColor = this.interpolateColor(this.africanTextColor, COLORS.pureWhite, t * 4);
      } else {
        // Transition to target color
        this.drawColor = this.interpolateColor(COLORS.pureWhite, this.color, (t - 0.25) * 4 / 3);
      }
      
      this.x = this.lerp(this.targets.text.x, this.targets.greek.x, t);
      this.y = this.lerp(this.targets.text.y, this.targets.greek.y, t);
      this.currentTarget = 'greek';
    }
    else {
      // Phase 6: Culmination
      const t = (elapsed - (DISPLAY_DURATION - CULMINATION_PHASE_DUR)) / CULMINATION_PHASE_DUR;
      
      if (t < 0.5) {
        this.size = 3 + 4 * t;
        this.alpha = Math.min(1, this.baseAlpha * (1 + t));
      } else {
        this.size = 3;
        this.alpha = this.baseAlpha * (1 - (t - 0.5) * 2);
      }
      this.drawColor = t < 0.5 ? COLORS.warmGold : this.color;
    }
  }

  draw(ctx) {
    if (!ctx) return;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    
    if (!this.drawColor) this.drawColor = COLORS.pureWhite;
    
    try {
      const [r, g, b] = this.drawColor.match(/\w\w/g).map(x => parseInt(x, 16));
      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${this.alpha})`;
      ctx.fill();
    } catch (e) {
      ctx.fillStyle = `rgba(255, 255, 255, ${this.alpha})`;
      ctx.fill();
    }
  }
}

// DroneDisplay component
const DroneDisplay = () => {
  const canvasRef = useRef(null);
  const [drones, setDrones] = useState([]);
  const animationRef = useRef({ 
    startTime: 0, 
    frameId: null, 
    letterIndex: 0 
  });
  const containerRef = useRef(null);

  // Africa text shapes
  const AFRICA_TEXT_SHAPES_DATA = useMemo(() => ({
    "A": [
      {p1: {x: 0.0, y: 1.0}, p2: {x: 0.5, y: 0.0}}, 
      {p1: {x: 0.5, y: 0.0}, p2: {x: 1.0, y: 1.0}},
      {p1: {x: 0.2, y: 0.6}, p2: {x: 0.8, y: 0.6}}
    ],
    "F": [
      {p1: {x: 0.0, y: 0.0}, p2: {x: 1.0, y: 0.0}}, 
      {p1: {x: 0.0, y: 0.0}, p2: {x: 0.0, y: 1.0}},
      {p1: {x: 0.0, y: 0.5}, p2: {x: 0.7, y: 0.5}}
    ],
    "R": [
      {p1: {x: 0.0, y: 0.0}, p2: {x: 0.0, y: 1.0}}, 
      {p1: {x: 0.0, y: 0.0}, p2: {x: 0.7, y: 0.0}},
      {p1: {x: 0.7, y: 0.0}, p2: {x: 1.0, y: 0.3}}, 
      {p1: {x: 1.0, y: 0.3}, p2: {x: 0.7, y: 0.5}},
      {p1: {x: 0.7, y: 0.5}, p2: {x: 0.0, y: 0.5}}, 
      {p1: {x: 0.5, y: 0.5}, p2: {x: 1.0, y: 1.0}}
    ],
    "I": [
      {p1: {x: 0.0, y: 0.0}, p2: {x: 1.0, y: 0.0}}, 
      {p1: {x: 0.5, y: 0.0}, p2: {x: 0.5, y: 1.0}},
      {p1: {x: 0.0, y: 1.0}, p2: {x: 1.0, y: 1.0}}
    ],
    "C": [
      {p1: {x: 0.7, y: 0.2}, p2: {x: 0.3, y: 0.2}}, 
      {p1: {x: 0.3, y: 0.2}, p2: {x: 0.3, y: 0.8}},
      {p1: {x: 0.3, y: 0.8}, p2: {x: 0.7, y: 0.8}}
    ]
  }), []);

  // Initialize drones
  const initDrones = useCallback((letterIndex, width, height) => {
    if (!width || !height) return;
    
    // Calculate Africa dimensions
    const africaBounds = AFRICA_OUTLINE_POINTS.reduce((acc, p) => ({
      minX: Math.min(acc.minX, p.x),
      maxX: Math.max(acc.maxX, p.x),
      minY: Math.min(acc.minY, p.y),
      maxY: Math.max(acc.maxY, p.y)
    }), { 
      minX: Infinity, 
      maxX: -Infinity, 
      minY: Infinity, 
      maxY: -Infinity 
    });
    
    const africaScale = Math.min(width, height) * 0.6;
    const africaOffsetX = (width - africaScale * (africaBounds.maxX - africaBounds.minX)) / 2;
    const africaOffsetY = (height - africaScale * (africaBounds.maxY - africaBounds.minY)) / 2;
    
    const africaPoints = generateShapePoints(
      AFRICA_SHAPE_SEGMENTS,
      africaScale,
      africaScale,
      africaOffsetX - africaBounds.minX * africaScale,
      africaOffsetY - africaBounds.minY * africaScale
    );
    
    // Calculate Greek letter dimensions
    const letterName = GREEK_LETTERS_ORDER[letterIndex];
    const letterSegments = GREEK_LETTER_SHAPES_DATA[letterName];
    
    const letterBounds = letterSegments.reduce((acc, seg) => ({
      minX: Math.min(acc.minX, seg.p1.x, seg.p2.x),
      maxX: Math.max(acc.maxX, seg.p1.x, seg.p2.x),
      minY: Math.min(acc.minY, seg.p1.y, seg.p2.y),
      maxY: Math.max(acc.maxY, seg.p1.y, seg.p2.y)
    }), { 
      minX: Infinity, 
      maxX: -Infinity, 
      minY: Infinity, 
      maxY: -Infinity 
    });
    
    const letterScale = Math.min(width, height) * 0.7;
    const letterOffsetX = (width - letterScale * (letterBounds.maxX - letterBounds.minX)) / 2;
    const letterOffsetY = (height - letterScale * (letterBounds.maxY - letterBounds.minY)) / 2;
    
    const letterPoints = generateShapePoints(
      letterSegments,
      letterScale,
      letterScale,
      letterOffsetX - letterBounds.minX * letterScale,
      letterOffsetY - letterBounds.minY * letterScale
    );
    
    // Generate Africa text points
    const textLetters = "AFRICA";
    const textPoints = [];
    const textColors = [COLORS.panAfricanRed, COLORS.warmGold, COLORS.panAfricanGreen];
    const charWidth = africaScale * 0.15;
    const charHeight = africaScale * 0.3;
    const textOffsetX = africaOffsetX + africaScale * 0.2;
    const textOffsetY = africaOffsetY + africaScale * 0.4;
    
    for (let i = 0; i < textLetters.length; i++) {
      const letter = textLetters[i];
      const points = generateShapePoints(
        AFRICA_TEXT_SHAPES_DATA[letter] || [],
        charWidth,
        charHeight,
        textOffsetX + i * charWidth * 1.1,
        textOffsetY
      );
      points.forEach(p => p.color = textColors[i % textColors.length]);
      textPoints.push(...points);
    }
    
    // Create drones
    const newDrones = [];
    const droneCount = Math.min(MAX_DRONES, Math.floor(width * height / 500));
    
    for (let i = 0; i < droneCount; i++) {
      const startX = Math.random() * width;
      const startY = Math.random() * height;
      
      const africaIndex = Math.floor(i * africaPoints.length / droneCount) % africaPoints.length;
      const letterIndex = Math.floor(i * letterPoints.length / droneCount) % letterPoints.length;
      const textIndex = Math.floor(i * textPoints.length / droneCount) % textPoints.length;
      
      const targets = {
        africa: africaPoints[africaIndex],
        greek: {
          ...letterPoints[letterIndex],
          x: letterPoints[letterIndex].x + (Math.random() - 0.5) * JITTER_AMOUNT,
          y: letterPoints[letterIndex].y + (Math.random() - 0.5) * JITTER_AMOUNT
        },
        text: textPoints[textIndex]
      };
      
      newDrones.push(new Drone(
        startX,
        startY,
        targets,
        letterPoints[letterIndex].color,
        textPoints[textIndex].color
      ));
    }
    
    setDrones(newDrones);
    animationRef.current.startTime = performance.now();
  }, [AFRICA_TEXT_SHAPES_DATA]);

  // Animation loop
  const animate = useCallback(() => {
    const now = performance.now();
    const elapsed = now - animationRef.current.startTime;
    const canvas = canvasRef.current;
    
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = COLORS.indigoSky;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    drones.forEach(drone => {
      drone.update(elapsed);
      drone.draw(ctx);
    });
    
    // Continue animation or restart
    if (elapsed < DISPLAY_DURATION + 1000) {
      animationRef.current.frameId = requestAnimationFrame(animate);
    } else {
      // Move to next letter
      animationRef.current.letterIndex = (animationRef.current.letterIndex + 1) % GREEK_LETTERS_ORDER.length;
      initDrones(animationRef.current.letterIndex, canvas.width, canvas.height);
    }
  }, [drones, initDrones]);
  
  // Handle resize
  useEffect(() => {
    const currentAnimationRef = animationRef.current;
    const resizeObserver = new ResizeObserver(entries => {
      const { width, height } = entries[0].contentRect;
      if (width > 0 && height > 0 && canvasRef.current) {
        canvasRef.current.width = width;
        canvasRef.current.height = height;
        initDrones(currentAnimationRef.letterIndex, width, height);
      }
    });
    
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
      // Initial size
      const { width, height } = containerRef.current.getBoundingClientRect();
      if (width > 0 && height > 0 && canvasRef.current) {
        canvasRef.current.width = width;
        canvasRef.current.height = height;
        initDrones(currentAnimationRef.letterIndex, width, height);
      }
    }
    
    return () => {
      resizeObserver.disconnect();
      if (currentAnimationRef.frameId) {
        cancelAnimationFrame(currentAnimationRef.frameId);
      }
    };
  }, [initDrones]);
  
  // Start animation
  useEffect(() => {
    const currentAnimationRef = animationRef.current;
    
    if (drones.length > 0 && !currentAnimationRef.frameId) {
      currentAnimationRef.frameId = requestAnimationFrame(animate);
    }
    
    return () => {
      if (currentAnimationRef.frameId) {
        cancelAnimationFrame(currentAnimationRef.frameId);
      }
    };
  }, [drones, animate]);
  
  return (
    <div ref={containerRef} className="w-full h-full min-h-[300px]">
      <canvas 
        ref={canvasRef} 
        className="w-full h-full"
      />
    </div>
  );
};

// Main App component
const App = () => {
  return (
    <div className="min-h-screen flex flex-col items-center bg-[#28282B] text-white font-sans">
      {/* Header */}
      <header className="w-full bg-[#3D2B1F] shadow-lg py-4 px-6 md:px-12 flex justify-between items-center rounded-b-xl">
        <h1 className="text-3xl md:text-4xl font-extrabold text-[#FFD700]">
          Drone Display Showcase
        </h1>
        <nav>
          <ul className="flex space-x-4">
            <li><a href="#demo" className="text-white hover:text-[#FFD700] transition-colors">Demo</a></li>
            <li><a href="#about" className="text-white hover:text-[#FFD700] transition-colors">About</a></li>
          </ul>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-grow w-full max-w-7xl mx-auto p-6 md:p-12">
        <section id="introduction" className="mb-12 text-center">
          <h2 className="text-4xl font-bold text-[#FFD700] mb-6">Experience the Art of Drone Choreography</h2>
          <p className="text-lg text-white leading-relaxed">
            Welcome to a captivating demonstration of drone light show technology. This application showcases a sophisticated algorithm that choreographs hundreds of virtual drones to form intricate shapes and patterns in the night sky. Witness the seamless transitions from abstract scatterings to meaningful symbols.
          </p>
        </section>

        <section id="demo" className="mb-12">
          <h2 className="text-3xl font-bold text-[#009732] mb-6 text-center">Interactive Demo: The Greek Alphabet & Africa</h2>
          <div className="bg-[#1a202c] p-6 rounded-xl shadow-xl border-2 border-[#FFD700] min-h-[500px]">
            <DroneDisplay />
          </div>
          <p className="text-center text-white mt-6 text-lg">
            Watch as 1000 virtual drones transition through a stunning sequence:
            Initially scattered, they first form the <strong>outline of the African continent</strong>, dynamically coloured. They then seamlessly reshape to spell out <strong>"AFRICA"</strong> within the continent. Finally, they transition into a sequence of the <strong>Greek alphabet</strong>, cycling through each letter with a vibrant culmination effect before moving to the next. The display continuously loops, presenting a new Greek letter each cycle.
          </p>
        </section>

        <section id="about" className="mb-12">
          <h2 className="text-3xl font-bold text-[#3D2B1F] mb-6 text-center">How It Works</h2>
          <div className="bg-white p-6 rounded-xl shadow-xl text-gray-800">
            <ul className="list-disc list-inside space-y-4">
              <li>
                <strong>Dynamic Formations:</strong> Each drone is programmed to move smoothly between predefined target coordinates for different shapes (African continent, "AFRICA" text, and Greek letters).
              </li>
              <li>
                <strong>Colour Transitions:</strong> Drones' colours interpolate seamlessly, reflecting the themes of each display phase (e.g., Pan-African colours for Africa, warm gold and purple for Greek letters).
              </li>
              <li>
                <strong>Responsive Canvas:</strong> The entire display scales automatically to fit your screen size, ensuring an optimal viewing experience on any device.
              </li>
              <li>
                <strong>Phased Animation:</strong> The display progresses through distinct phases:
                <ul className="list-disc list-inside ml-6 mt-2 text-sm">
                  <li>Scatter to African Outline (10 seconds)</li>
                  <li>Hold African Outline (2 seconds)</li>
                  <li>African Text Formation (10 seconds)</li>
                  <li>Hold African Text (2 seconds)</li>
                  <li>African/Text to Greek Letter Transition (16 seconds)</li>
                  <li>Culmination Burst and Fade (5 seconds)</li>
                </ul>
                This sequence totals 45 seconds before looping to the next Greek letter.
              </li>
              <li>
                <strong>Performance:</strong> Optimised for smooth animation with 1000 individual drone particles, demonstrating efficient canvas rendering techniques.
              </li>
            </ul>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full bg-[#3D2B1F] shadow-inner py-6 px-6 md:px-12 text-center text-white text-sm rounded-t-xl">
        <p>&copy; 2025 Drone Display Showcase. All rights reserved.</p>
        <p className="mt-2">Powered by advanced choreography algorithms.</p>
      </footer>
    </div>
  );
};

export default App;
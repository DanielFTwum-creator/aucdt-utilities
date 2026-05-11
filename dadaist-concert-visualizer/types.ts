export interface AudioData {
  frequencyData: Uint8Array;
  bass: number; // 0-255 average
  mid: number;  // 0-255 average
  treble: number; // 0-255 average
  volume: number; // 0-1 overall volume
}

export type IrisColor = 'default' | 'blue' | 'purple' | 'green' | 'red' | 'gold' | 'teal' | 'orange' | 'pink';

export interface EyeOutlineStyle {
  color: string;
  width: number;
  shadowBlur: number;
}

export type ShapeType = 'triangle' | 'polygon' | 'organic' | 'circle' | 'square' | 'pentagon' | 'hexagon' | 'star' | 'diamond' | 'cross' | 'cube' | 'pyramid' | 'cylinder' | 'cone' | 'prism' | 'sponge' | 'africa' | 'torus' | 'dodecahedron';

export interface VisualizerSettings {
  sensitivity: number;
  rotationSpeed: number;
  colorScheme: 'original' | 'neon' | 'monochrome' | 'red' | 'green' | 'blue' | 'orange' | 'purple' | 'mixed';
  showEye: boolean;
  strobeEnabled: boolean;
  showBeam: boolean;
  trailLength: number;
  trailOpacity: number;
  irisColor: IrisColor;
  eyeOutlineStyle: EyeOutlineStyle;
  selectedShape: ShapeType | 'random';
  wireframeMode: boolean;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  decay: number;
  size: number;
  color: string;
  rotation: number;
  spin: number;
}

export interface Shard {
  x: number;
  y: number;
  angle: number;
  distance: number;
  size: number;
  rotation: number;
  rotationSpeed: number;
  color: string;
  colorSeed: number; // Added for randomized palette picking
  type: ShapeType;
  layer: number;
  particles: Particle[];
  morphOffsets: number[]; // Random offsets for organic morphing
}
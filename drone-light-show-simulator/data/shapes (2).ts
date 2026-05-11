import { COLORS } from './constants';

export type ShapeSegment = {
    type: 'line' | 'arc';
    points?: { x: number; y: number }[];
    center?: { x: number; y: number };
    radius?: number;
    startAngle?: number;
    endAngle?: number;
    anticlockwise?: boolean;
    color?: string;
};

export const GREEK_LETTERS_ORDER: string[] = [
    'Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon', 'Zeta', 'Eta', 'Theta',
    'Iota', 'Kappa', 'Lambda', 'Mu', 'Nu', 'Xi', 'Omicron', 'Pi',
    'Rho', 'Sigma', 'Tau', 'Upsilon', 'Phi', 'Chi', 'Psi', 'Omega'
];

export const AFRICA_OUTLINE_POINTS = [
    { x: 0.44, y: 0.99, color: COLORS.panAfricanGreen }, { x: 0.49, y: 0.96, color: COLORS.panAfricanGreen },
    { x: 0.52, y: 0.9, color: COLORS.panAfricanGreen }, { x: 0.53, y: 0.84, color: COLORS.warmGold },
    { x: 0.54, y: 0.77, color: COLORS.warmGold }, { x: 0.56, y: 0.71, color: COLORS.warmGold },
    { x: 0.59, y: 0.65, color: COLORS.warmGold }, { x: 0.64, y: 0.6, color: COLORS.panAfricanRed },
    { x: 0.69, y: 0.58, color: COLORS.panAfricanRed }, { x: 0.75, y: 0.58, color: COLORS.panAfricanRed },
    { x: 0.81, y: 0.6, color: COLORS.panAfricanRed }, { x: 0.85, y: 0.63, color: COLORS.panAfricanRed },
    { x: 0.89, y: 0.6, color: COLORS.panAfricanRed }, { x: 0.93, y: 0.55, color: COLORS.panAfricanRed },
    { x: 0.97, y: 0.5, color: COLORS.panAfricanRed }, { x: 0.99, y: 0.45, color: COLORS.panAfricanRed },
    { x: 0.97, y: 0.4, color: COLORS.panAfricanRed }, { x: 0.92, y: 0.38, color: COLORS.warmGold },
    { x: 0.87, y: 0.38, color: COLORS.warmGold }, { x: 0.82, y: 0.39, color: COLORS.warmGold },
    { x: 0.76, y: 0.4, color: COLORS.warmGold }, { x: 0.7, y: 0.4, color: COLORS.panAfricanGreen },
    { x: 0.65, y: 0.38, color: COLORS.panAfricanGreen }, { x: 0.6, y: 0.35, color: COLORS.panAfricanGreen },
    { x: 0.56, y: 0.3, color: COLORS.panAfricanGreen }, { x: 0.55, y: 0.25, color: COLORS.panAfricanGreen },
    { x: 0.56, y: 0.2, color: COLORS.panAfricanGreen }, { x: 0.6, y: 0.15, color: COLORS.panAfricanGreen },
    { x: 0.62, y: 0.1, color: COLORS.panAfricanGreen }, { x: 0.6, y: 0.05, color: COLORS.panAfricanGreen },
    { x: 0.55, y: 0.01, color: COLORS.warmGold }, { x: 0.5, y: 0.01, color: COLORS.warmGold },
    { x: 0.45, y: 0.02, color: COLORS.warmGold }, { x: 0.4, y: 0.05, color: COLORS.warmGold },
    { x: 0.35, y: 0.1, color: COLORS.panAfricanRed }, { x: 0.3, y: 0.15, color: COLORS.panAfricanRed },
    { x: 0.27, y: 0.2, color: COLORS.panAfricanRed }, { x: 0.25, y: 0.25, color: COLORS.panAfricanRed },
    { x: 0.24, y: 0.3, color: COLORS.panAfricanRed }, { x: 0.23, y: 0.35, color: COLORS.panAfricanRed },
    { x: 0.21, y: 0.4, color: COLORS.panAfricanRed }, { x: 0.18, y: 0.45, color: COLORS.panAfricanRed },
    { x: 0.15, y: 0.5, color: COLORS.warmGold }, { x: 0.12, y: 0.55, color: COLORS.warmGold },
    { x: 0.11, y: 0.6, color: COLORS.warmGold }, { x: 0.12, y: 0.65, color: COLORS.warmGold },
    { x: 0.15, y: 0.7, color: COLORS.panAfricanGreen }, { x: 0.2, y: 0.75, color: COLORS.panAfricanGreen },
    { x: 0.25, y: 0.8, color: COLORS.panAfricanGreen }, { x: 0.3, y: 0.85, color: COLORS.panAfricanGreen },
    { x: 0.35, y: 0.9, color: COLORS.panAfricanGreen }, { x: 0.4, y: 0.95, color: COLORS.panAfricanGreen }
];

export const AFRICA_SHAPE_SEGMENTS: ShapeSegment[] = AFRICA_OUTLINE_POINTS.map((point, index, arr) => ({
    type: 'line',
    points: [point, arr[(index + 1) % arr.length]]
}));


export const AFRICA_TEXT_SHAPES_DATA: ShapeSegment[] = [
    // A
    { type: 'line', points: [{x: 0.2, y: 0.65}, {x: 0.25, y: 0.55}], color: COLORS.panAfricanRed },
    { type: 'line', points: [{x: 0.25, y: 0.55}, {x: 0.3, y: 0.65}], color: COLORS.panAfricanRed },
    { type: 'line', points: [{x: 0.22, y: 0.61}, {x: 0.28, y: 0.61}], color: COLORS.panAfricanRed },
    // F
    { type: 'line', points: [{x: 0.33, y: 0.65}, {x: 0.33, y: 0.55}], color: COLORS.warmGold },
    { type: 'line', points: [{x: 0.33, y: 0.55}, {x: 0.39, y: 0.55}], color: COLORS.warmGold },
    { type: 'line', points: [{x: 0.33, y: 0.6}, {x: 0.37, y: 0.6}], color: COLORS.warmGold },
    // R
    { type: 'line', points: [{x: 0.42, y: 0.65}, {x: 0.42, y: 0.55}], color: COLORS.panAfricanGreen },
    { type: 'arc', center: {x: 0.45, y: 0.575}, radius: 0.025, startAngle: -Math.PI / 2, endAngle: Math.PI / 2, color: COLORS.panAfricanGreen },
    { type: 'line', points: [{x: 0.42, y: 0.6}, {x: 0.46, y: 0.65}], color: COLORS.panAfricanGreen },
    // I
    { type: 'line', points: [{x: 0.51, y: 0.65}, {x: 0.51, y: 0.55}], color: COLORS.panAfricanRed },
    // C
    { type: 'arc', center: {x: 0.58, y: 0.6}, radius: 0.05, startAngle: Math.PI * 0.4, endAngle: Math.PI * 1.6, color: COLORS.warmGold },
    // A
    { type: 'line', points: [{x: 0.66, y: 0.65}, {x: 0.71, y: 0.55}], color: COLORS.panAfricanGreen },
    { type: 'line', points: [{x: 0.71, y: 0.55}, {x: 0.76, y: 0.65}], color: COLORS.panAfricanGreen },
    { type: 'line', points: [{x: 0.68, y: 0.61}, {x: 0.74, y: 0.61}], color: COLORS.panAfricanGreen },
];


export const GREEK_LETTER_SHAPES_DATA: { [key: string]: { segments: ShapeSegment[]; color: string } } = {
    Alpha: { color: COLORS.warmGold, segments: [{ type: 'line', points: [{ x: 0, y: 1 }, { x: 0.5, y: 0 }] }, { type: 'line', points: [{ x: 0.5, y: 0 }, { x: 1, y: 1 }] }, { type: 'line', points: [{ x: 0.25, y: 0.5 }, { x: 0.75, y: 0.5 }] }] },
    Beta: { color: COLORS.regalPurple, segments: [{ type: 'line', points: [{ x: 0.1, y: 0 }, { x: 0.1, y: 1 }] }, { type: 'arc', center: { x: 0.1, y: 0.25 }, radius: 0.25, startAngle: -Math.PI / 2, endAngle: Math.PI / 2 }, { type: 'arc', center: { x: 0.1, y: 0.75 }, radius: 0.25, startAngle: -Math.PI / 2, endAngle: Math.PI / 2 }] },
    Gamma: { color: COLORS.warmGold, segments: [{ type: 'line', points: [{ x: 0, y: 0 }, { x: 1, y: 0 }] }, { type: 'line', points: [{ x: 0.5, y: 0 }, { x: 0.5, y: 1 }] }] },
    Delta: { color: COLORS.regalPurple, segments: [{ type: 'line', points: [{ x: 0, y: 1 }, { x: 0.5, y: 0 }] }, { type: 'line', points: [{ x: 0.5, y: 0 }, { x: 1, y: 1 }] }, { type: 'line', points: [{ x: 1, y: 1 }, { x: 0, y: 1 }] }] },
    Epsilon: { color: COLORS.warmGold, segments: [{ type: 'line', points: [{ x: 1, y: 0 }, { x: 0, y: 0 }] }, { type: 'line', points: [{ x: 0, y: 0 }, { x: 0, y: 1 }] }, { type: 'line', points: [{ x: 0, y: 1 }, { x: 1, y: 1 }] }, { type: 'line', points: [{ x: 0, y: 0.5 }, { x: 0.75, y: 0.5 }] }] },
    Zeta: { color: COLORS.regalPurple, segments: [{ type: 'line', points: [{ x: 0, y: 0 }, { x: 1, y: 0 }] }, { type: 'line', points: [{ x: 1, y: 0 }, { x: 0, y: 1 }] }, { type: 'line', points: [{ x: 0, y: 1 }, { x: 1, y: 1 }] }] },
    Eta: { color: COLORS.warmGold, segments: [{ type: 'line', points: [{ x: 0, y: 0 }, { x: 0, y: 1 }] }, { type: 'line', points: [{ x: 1, y: 0 }, { x: 1, y: 1 }] }, { type: 'line', points: [{ x: 0, y: 0.5 }, { x: 1, y: 0.5 }] }] },
    Theta: { color: COLORS.regalPurple, segments: [{ type: 'arc', center: { x: 0.5, y: 0.5 }, radius: 0.5, startAngle: 0, endAngle: 2 * Math.PI }, { type: 'line', points: [{ x: 0.1, y: 0.5 }, { x: 0.9, y: 0.5 }] }] },
    Iota: { color: COLORS.warmGold, segments: [{ type: 'line', points: [{ x: 0.5, y: 0 }, { x: 0.5, y: 1 }] }] },
    Kappa: { color: COLORS.regalPurple, segments: [{ type: 'line', points: [{ x: 0, y: 0 }, { x: 0, y: 1 }] }, { type: 'line', points: [{ x: 1, y: 0 }, { x: 0, y: 0.5 }] }, { type: 'line', points: [{ x: 0, y: 0.5 }, { x: 1, y: 1 }] }] },
    Lambda: { color: COLORS.warmGold, segments: [{ type: 'line', points: [{ x: 0, y: 1 }, { x: 0.5, y: 0 }] }, { type: 'line', points: [{ x: 0.5, y: 0 }, { x: 1, y: 1 }] }] },
    Mu: { color: COLORS.regalPurple, segments: [{ type: 'line', points: [{ x: 0, y: 1 }, { x: 0, y: 0 }] }, { type: 'line', points: [{ x: 0, y: 0 }, { x: 0.5, y: 0.5 }] }, { type: 'line', points: [{ x: 0.5, y: 0.5 }, { x: 1, y: 0 }] }, { type: 'line', points: [{ x: 1, y: 0 }, { x: 1, y: 1 }] }] },
    Nu: { color: COLORS.warmGold, segments: [{ type: 'line', points: [{ x: 0, y: 1 }, { x: 0, y: 0 }] }, { type: 'line', points: [{ x: 0, y: 0 }, { x: 1, y: 1 }] }, { type: 'line', points: [{ x: 1, y: 1 }, { x: 1, y: 0 }] }] },
    Xi: { color: COLORS.regalPurple, segments: [{ type: 'line', points: [{ x: 0, y: 0 }, { x: 1, y: 0 }] }, { type: 'line', points: [{ x: 0, y: 0.5 }, { x: 1, y: 0.5 }] }, { type: 'line', points: [{ x: 0, y: 1 }, { x: 1, y: 1 }] }] },
    Omicron: { color: COLORS.warmGold, segments: [{ type: 'arc', center: { x: 0.5, y: 0.5 }, radius: 0.5, startAngle: 0, endAngle: 2 * Math.PI }] },
    Pi: { color: COLORS.regalPurple, segments: [{ type: 'line', points: [{ x: 0, y: 0 }, { x: 1, y: 0 }] }, { type: 'line', points: [{ x: 0.25, y: 0 }, { x: 0.25, y: 1 }] }, { type: 'line', points: [{ x: 0.75, y: 0 }, { x: 0.75, y: 1 }] }] },
    Rho: { color: COLORS.warmGold, segments: [{ type: 'line', points: [{ x: 0.1, y: 0 }, { x: 0.1, y: 1 }] }, { type: 'arc', center: { x: 0.1, y: 0.25 }, radius: 0.25, startAngle: -Math.PI / 2, endAngle: Math.PI / 2 }] },
    Sigma: { color: COLORS.regalPurple, segments: [{ type: 'line', points: [{ x: 1, y: 0 }, { x: 0, y: 0.5 }] }, { type: 'line', points: [{ x: 0, y: 0.5 }, { x: 1, y: 1 }] }] },
    Tau: { color: COLORS.warmGold, segments: [{ type: 'line', points: [{ x: 0, y: 0 }, { x: 1, y: 0 }] }, { type: 'line', points: [{ x: 0.5, y: 0 }, { x: 0.5, y: 1 }] }] },
    Upsilon: { color: COLORS.regalPurple, segments: [{ type: 'line', points: [{ x: 0, y: 0 }, { x: 0.5, y: 0.5 }] }, { type: 'line', points: [{ x: 1, y: 0 }, { x: 0.5, y: 0.5 }] }, { type: 'line', points: [{ x: 0.5, y: 0.5 }, { x: 0.5, y: 1 }] }] },
    Phi: { color: COLORS.warmGold, segments: [{ type: 'arc', center: { x: 0.5, y: 0.5 }, radius: 0.5, startAngle: 0, endAngle: 2 * Math.PI }, { type: 'line', points: [{ x: 0.5, y: 0 }, { x: 0.5, y: 1 }] }] },
    Chi: { color: COLORS.regalPurple, segments: [{ type: 'line', points: [{ x: 0, y: 0 }, { x: 1, y: 1 }] }, { type: 'line', points: [{ x: 1, y: 0 }, { x: 0, y: 1 }] }] },
    Psi: { color: COLORS.warmGold, segments: [{ type: 'line', points: [{ x: 0, y: 0 }, { x: 0.5, y: 0.5 }] }, { type: 'line', points: [{ x: 1, y: 0 }, { x: 0.5, y: 0.5 }] }, { type: 'line', points: [{ x: 0.5, y: 0.5 }, { x: 0.5, y: 1 }] }] },
    Omega: { color: COLORS.regalPurple, segments: [{ type: 'arc', center: { x: 0.5, y: 0.5 }, radius: 0.4, startAngle: Math.PI * 1.2, endAngle: Math.PI * -0.2, anticlockwise: false }, { type: 'line', points: [{ x: 0.1, y: 0.8 }, { x: 0.3, y: 0.8 }] }, { type: 'line', points: [{ x: 0.7, y: 0.8 }, { x: 0.9, y: 0.8 }] }] }
};
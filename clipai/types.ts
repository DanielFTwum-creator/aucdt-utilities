// Fix: Add React import for React.RefObject type.
import React from 'react';

export type ShapeId = 'custom' | 'circle' | 'square' | 'heart' | 'star' | 'hexagon' | 'diamond' | 'pentagon' | 'triangle' | 'arrow' | 'cross' | 'droplet' | 'bubble' | 'cloud' | 'flag' | 'sun' | 'moon' | 'camera' | 'coffee' | 'car' | 'music' | 'more';

export interface ShapeConfig {
  id: ShapeId;
  name: string;
}

export type InputType = 'upload' | 'url' | 'svg';
export type CustomShapeSource = 'ai' | 'paste' | 'library' | 'upload';

export interface IconData {
  name: string;
  path: string;
}

export type ClippingMode = 'fill' | 'outline';
export type OutlineStyle = 'solid' | 'texture';

export type Theme = 'light' | 'dark' | 'high-contrast';

// Fix: Add Page type definition.
export type Page = 'main' | 'adminLogin' | 'adminPanel' | 'testPanel';

export interface AuditLogEntry {
  timestamp: string;
  action: string;
}

export type MediaSource = HTMLImageElement | HTMLVideoElement;

// Types for Self-Testing Framework
export type TestStatus = 'idle' | 'running' | 'pass' | 'fail' | 'skipped';

export interface TestResult {
    status: TestStatus;
    message: string;
    screenshot?: string;
    duration: number;
}

export interface TestContext {
    // State setters
    setMediaSource: (media: MediaSource | null) => void;
    setShape: (shape: ShapeId) => void;
    setClippingMode: (mode: ClippingMode) => void;
    setCustomSvgPath: (path: string | null) => void;
    // Refs
    canvasRef: React.RefObject<HTMLCanvasElement>;
    // Helpers
    takeScreenshot: () => string | undefined;
    waitForRender: (delay?: number) => Promise<void>;
    getCanvasPixelData: () => Uint8ClampedArray | undefined;
    // New additions for Phase 3
    runAiEdit: (prompt: string) => Promise<void>;
    isDownloadDisabled: () => boolean;
    panCanvas: (dx: number, dy: number) => void;
}

export interface Test {
    name: string;
    description: string;
    run: (context: TestContext) => Promise<Omit<TestResult, 'status' | 'duration'>>;
}
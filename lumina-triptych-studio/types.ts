export interface TriptychVariation {
  variation: number;
  triptych_shape: string;
  prompt: string;
  style: string;
  camera: string;
  lighting: string;
  mood: string;
}

export enum AspectRatio {
  SQUARE = "1:1",
  PORTRAIT = "3:4",
  LANDSCAPE = "4:3",
  TALL = "9:16",
  WIDE = "16:9",
}

export enum ImageResolution {
  RES_1K = "1K",
  RES_2K = "2K",
  RES_4K = "4K",
}

export interface GeneratedImage {
  url: string;
  promptUsed: string;
  aspectRatio: AspectRatio;
  timestamp: number;
}

export interface GenerationConfig {
  aspectRatio: AspectRatio;
  resolution: ImageResolution;
}
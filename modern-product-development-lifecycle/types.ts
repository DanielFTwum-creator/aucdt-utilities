import { FC, SVGProps } from 'react';

export interface StagePoint {
  title: string;
  description: string;
  details: string;
}

export interface Stage {
  id: number;
  icon: FC<SVGProps<SVGSVGElement>>;
  title: string;
  subtitle: string;
  content: {
    description: string;
    points: StagePoint[];
  };
  imageUrl: string;
}

// New types for hands-on interaction
export interface PointProgress {
  checked: boolean;
  notes: string;
}

export interface StageProgress {
  [pointIndex: number]: PointProgress;
}

export interface ProjectProgress {
  [stageId: number]: StageProgress;
}

// New type for self-testing framework
export interface TestResult {
    name: string;
    status: 'pending' | 'running' | 'pass' | 'fail';
    duration?: number;
    error?: string;
    screenshot?: string; // base64 data URI
}

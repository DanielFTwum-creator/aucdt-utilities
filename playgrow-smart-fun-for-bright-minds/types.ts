import React from 'react';

export enum ZoneID {
  Cognitive = 'cognitive',
  Creativity = 'creativity',
  Language = 'language',
  Movement = 'movement',
  Social = 'social',
  Exploration = 'exploration',
  Rest = 'rest',
}

export interface MiniGame {
  id: string;
  title: string;
  description: string;
  Icon: React.FC<React.SVGProps<SVGSVGElement>>;
}

export interface Zone {
  id: ZoneID;
  title: string;
  subtitle: string;
  Icon: React.FC<React.SVGProps<SVGSVGElement>>;
  color: string;
  bgColor: string;
  pathColor: string;
  miniGames: MiniGame[];
}


export enum RewardType {
  Star = 'star',
  Sticker = 'sticker',
  Medal = 'medal',
  Badge = 'badge',
}

export interface Reward {
  type: RewardType;
  description: string;
  Icon: React.FC<React.SVGProps<SVGSVGElement>>;
}

// Self-Testing Framework Types
export type TestStatus = 'pending' | 'running' | 'passed' | 'failed';

export interface TestStep {
  description: string;
  duration: number; // ms
  screenshot: string; // data URI
  shouldFail?: boolean;
}

export interface TestSuite {
  id: string;
  title: string;
  description: string;
  steps: TestStep[];
}

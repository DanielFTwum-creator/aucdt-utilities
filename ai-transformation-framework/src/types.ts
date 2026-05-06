export interface Stage {
  name: string;
  description: string;
}

export interface ChartItem {
  label: string;
  value: number;
}

export interface Chart {
  title: string;
  data: ChartItem[];
}

export interface Stat {
  value: string;
  description: string;
}

export interface ChapterData {
  id: string;
  number: string;
  title: string;
  headline: string;
  whyMatters: string;
  stages: Stage[];
  stat: Stat;
  chart?: Chart;
}

export interface Content {
  hero: {
    title: string;
    subtitle: string;
    description: string;
  };
  chapters: ChapterData[];
}

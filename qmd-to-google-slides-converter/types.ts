
export interface BoxContent {
  type: 'box';
  style: 'blue' | 'burgundy' | 'yellow';
  data: string[];
}

export interface ColumnData {
  heading?: string;
  items: string[];
}

export interface ColumnsContent {
  type: 'columns';
  data: ColumnData[];
}

export type ContentItem = BoxContent | ColumnsContent;

export interface Slide {
  title: string;
  content: ContentItem[];
}

export interface SlidesData {
  title: string;
  subtitle: string;
  author: string;
  slides: Slide[];
}

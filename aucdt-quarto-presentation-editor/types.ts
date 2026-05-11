export interface Frontmatter {
  title?: string;
  subtitle?: string;
  author?: string;
}

export interface Slide {
  id: string;
  content: string;
}

export interface PresentationData {
  frontmatter: Frontmatter;
  slides: Slide[];
}
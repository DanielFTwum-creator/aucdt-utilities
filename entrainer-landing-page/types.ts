
export interface Feature {
  iconUrl: string;
  title: string;
  description: string;
}

export interface Screenshot {
  url: string;
  alt: string;
}

export interface Testimonial {
  quote: string;
  author: string;
}

export interface FeatureDetailContent {
  title: string;
  paragraphs: string[];
  imageUrl: string;
  imageAlt: string;
  buttonText: string;
  buttonUrl: string;
}

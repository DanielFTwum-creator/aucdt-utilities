
export enum AspectRatio {
  SQUARE = '1:1',
  LANDSCAPE = '4:3',
  PORTRAIT = '3:4',
  CINEMA = '16:9',
  STORY = '9:16'
}

export interface PosterData {
  urgencyText: string;
  eyebrow: string;
  headlineLine1: string;
  headlineLine2: string;
  headlineLine3: string;
  headlineLine4: string;
  ctaText: string;
  ctaUrl: string;
  stat1Value: string;
  stat1Label: string;
  stat2Value: string;
  stat2Label: string;
  stat3Value: string;
  stat3Label: string;
  logoUrl: string;
  brandName: string;
  domainUrl: string;
  videoUrl?: string;
  showVideo?: boolean;
  aspectRatio: AspectRatio;
}

export const defaultPosterData: PosterData = {
  urgencyText: "JULY 2026 ADMISSIONS OPEN",
  eyebrow: "Limited intake · July 26 cohort",
  headlineLine1: "Apply now.",
  headlineLine2: "Launch your",
  headlineLine3: "tech career.",
  headlineLine4: "",
  ctaText: "APPLY NOW →",
  ctaUrl: "https://admissions.techbridge.edu.gh",
  stat1Value: "July 26",
  stat1Label: "Cohort starts",
  stat2Value: "100%",
  stat2Label: "Hands-on training",
  stat3Value: "Ghana",
  stat3Label: "Based in Ghana",
  logoUrl: "https://images.weserv.nl/?url=https://techbridge.edu.gh/static/TUC_LOGO_1.png",
  brandName: "Techbridge University College",
  domainUrl: "techbridge.edu.gh",
  videoUrl: "https://techbridge.edu.gh/static/campus_tour.mp4",
  showVideo: false,
  aspectRatio: AspectRatio.LANDSCAPE
};

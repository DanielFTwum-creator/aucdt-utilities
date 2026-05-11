import type { FlyerData } from './types';

export const flyerData: FlyerData = {
  prompt: "A dynamic, high-contrast hero image of a confident, successful-looking Ghanaian university student, a product designer, in their creative workspace. They are actively engaged, holding a 3D-printed prototype, with digital sketches visible on a screen behind them. The studio has a modern, professional feel. The lighting is dramatic, and the overall mood is aspirational and culturally relevant. The focus is on the empowered creator and the tangible results of their work.",
  text_elements: [
    {
      type: "headline",
      text: "Your Future is By Design.",
      color: "primaryText",
      position: "top-right",
      size: "large",
      weight: "bold"
    },
    {
      type: "subheading",
      text: "Turn Your Passion for Creativity into a Thriving Career at AsanSka University College of Design & Technology.",
      color: "primaryText",
      position: "below-headline",
      size: "medium",
      weight: "normal",
      line_spacing: "loose"
    },
    {
      type: "bullet",
      number: 1,
      text: "Launch Your Own Brand",
      icon: "checkmark-circle",
      spacing_below: "generous"
    },
    {
      type: "bullet",
      number: 2,
      text: "Master Industry-Standard Technology",
      icon: "checkmark-circle",
      spacing_below: "generous"
    },
    {
      type: "bullet",
      number: 3,
      text: "Graduate with a Portfolio that Gets You Hired",
      icon: "checkmark-circle",
      spacing_below: "generous"
    },
    {
      type: "bullet",
      number: 4,
      text: "Learn from Ghana's Top Design Professionals",
      icon: "checkmark-circle",
      spacing_below: "generous"
    },
    {
      type: "divider"
    },
    {
      type: "social_links",
      text: "Connect With Us",
      links: [
        { platform: 'instagram', handle: '@aucdt.ghana' },
        { platform: 'x', handle: '@AUCDT_Ghana' },
        { platform: 'linkedin', handle: 'school/aucdt' }
      ]
    },
    {
      type: "button",
      style: "primary",
      text: "APPLY NOW",
      color: "burgundyPrimary",
      position: "bottom-left",
      width: "45%"
    },
    {
      type: "button",
      style: "secondary",
      text: "SEE OUR STUDENTS' WORK",
      color: "goldAccent",
      position: "bottom-right",
      width: "45%"
    }
  ],
  layout: "two-column asymmetric",
  column_widths: {
    left: "40%",
    right: "60%"
  },
  color_palette: {
    primary: "burgundyPrimary",
    secondary: "goldAccent",
    text: "primaryText",
    background: "white",
  },
  spacing: {
    between_bullets: "generous",
    between_buttons: "medium",
    margin_right: "large"
  },
  typography: {
    headline: "bold, large",
    body: "normal weight, medium size",
    bullets: "normal weight, medium size",
    font_family: "'Poppins', sans-serif"
  },
  visual_elements: {
    neon_shapes: "none",
    neon_lines: "none",
    lighting: "dramatic",
    floor: "modern studio"
  },
  format: "vertical flyer, print design",
  aspect_ratio: "9:16",
  quality: "high definition, print-ready",
  critical_instruction: "RENDER TEXT EXACTLY AS PROVIDED. DO NOT MODIFY. Use generous vertical spacing between bullet points. Position buttons side-by-side at bottom."
};
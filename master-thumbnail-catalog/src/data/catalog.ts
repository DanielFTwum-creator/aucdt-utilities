
export type VariationStyle = 'Golden Glow' | 'Thick Outline' | 'Red Glow' | 'Clean Shadow';

export interface ThumbnailVariation {
  id: string;
  style: VariationStyle;
  filename: string;
  fileSize: string;
  visualStyle: {
    description: string[];
    fontSize: string;
    lineSpacing?: string;
    accent?: string;
  };
  bestFor: string[];
  performance: {
    desktop: number;
    mobile: number;
    tablet: number;
  };
}

export interface ThumbnailSection {
  id: string;
  title: string;
  theme: string;
  message: string;
  bestFor: string;
  variations: ThumbnailVariation[];
}

export const CATALOG_DATA: ThumbnailSection[] = [
  {
    id: 'section-1',
    title: 'African Lioness - Strength & Soul Mix',
    theme: 'Powerful African woman in military uniform, Ghanaian flag background',
    message: 'Strength, resilience, empowerment',
    bestFor: 'Afrobeat fusion, empowerment anthems, strong vocal tracks',
    variations: [
      {
        id: 'al-v1',
        style: 'Golden Glow',
        filename: 'African_Lioness_v1_golden_glow.png',
        fileSize: '951.4 KB',
        visualStyle: {
          description: ['Multi-layer golden glow effect', 'Top-positioned text (12% from top)', 'Warm, inviting aesthetic'],
          fontSize: '95px',
          lineSpacing: '15px'
        },
        bestFor: ['Maximum visual warmth', 'Spiritual/soulful content', 'Showcasing reggae roots connection', 'General-purpose professional use'],
        performance: { desktop: 5, mobile: 5, tablet: 5 }
      },
      {
        id: 'al-v2',
        style: 'Thick Outline',
        filename: 'African_Lioness_v2_thick_outline.png',
        fileSize: '922.6 KB',
        visualStyle: {
          description: ['Bold 8px black outline', 'Centre-positioned text', 'Maximum contrast'],
          fontSize: '100px',
          lineSpacing: '20px'
        },
        bestFor: ['Mobile-first strategy', 'High-contrast feeds', 'Standing out in crowded thumbnails', 'Text readability priority'],
        performance: { desktop: 4, mobile: 5, tablet: 5 }
      },
      {
        id: 'al-v3',
        style: 'Red Glow',
        filename: 'African_Lioness_v3_red_glow.png',
        fileSize: '950.1 KB',
        visualStyle: {
          description: ['Reggae-themed red glow', 'Top-positioned text', 'Energetic, vibrant feel'],
          fontSize: '95px',
          accent: 'RGB(255, 80, 80)'
        },
        bestFor: ['Reggae/dancehall content', 'High-energy tracks', 'Standing out with unique colors', 'Passion/power themes'],
        performance: { desktop: 5, mobile: 4, tablet: 5 }
      },
      {
        id: 'al-v4',
        style: 'Clean Shadow',
        filename: 'African_Lioness_v4_clean_shadow.png',
        fileSize: '998.0 KB',
        visualStyle: {
          description: ['Subtle drop shadow (6px offset)', 'Centre-positioned text', 'Clean, professional aesthetic'],
          fontSize: '105px'
        },
        bestFor: ['Professional/corporate playlists', 'Clean aesthetic preference', 'Complementing busy backgrounds', 'Traditional broadcast feel'],
        performance: { desktop: 5, mobile: 4, tablet: 5 }
      }
    ]
  },
  {
    id: 'section-2',
    title: 'Spirit of Resistance - Ghana Reggae Dub',
    theme: 'Defiant warrior spirit, Ghanaian pride, resistance culture',
    message: 'Standing strong, cultural identity, revolutionary spirit',
    bestFor: 'Conscious reggae, political commentary, cultural pride tracks',
    variations: [
      {
        id: 'sr-v1',
        style: 'Golden Glow',
        filename: 'Spirit_Resistance_v1_golden_glow.png',
        fileSize: '930.8 KB',
        visualStyle: {
            description: ['Multi-layer golden glow effect', 'Top-positioned text', 'Warm aesthetic'],
            fontSize: '95px'
        },
        bestFor: ['Maximum visual warmth', 'Spiritual content'],
        performance: { desktop: 5, mobile: 5, tablet: 5 }
      },
      {
        id: 'sr-v2',
        style: 'Thick Outline',
        filename: 'Spirit_Resistance_v2_thick_outline.png',
        fileSize: '886.1 KB',
        visualStyle: {
            description: ['Bold 8px black outline', 'Centre-positioned text'],
            fontSize: '100px'
        },
        bestFor: ['Mobile-first', 'High contrast'],
        performance: { desktop: 4, mobile: 5, tablet: 5 }
      },
      {
        id: 'sr-v3',
        style: 'Red Glow',
        filename: 'Spirit_Resistance_v3_red_glow.png',
        fileSize: '929.9 KB',
        visualStyle: {
            description: ['Reggae-themed red glow', 'Top-positioned text'],
            fontSize: '95px',
            accent: 'RGB(255, 80, 80)'
        },
        bestFor: ['Reggae/dancehall', 'High energy'],
        performance: { desktop: 5, mobile: 4, tablet: 5 }
      },
      {
        id: 'sr-v4',
        style: 'Clean Shadow',
        filename: 'Spirit_Resistance_v4_clean_shadow.png',
        fileSize: '970.9 KB',
        visualStyle: {
            description: ['Subtle drop shadow', 'Centre-positioned text'],
            fontSize: '105px'
        },
        bestFor: ['Professional', 'Clean aesthetic'],
        performance: { desktop: 5, mobile: 4, tablet: 5 }
      }
    ]
  },
  {
    id: 'section-3',
    title: "Warrior's Lament - African Spirit Dub",
    theme: 'Reflective warrior, emotional depth, spiritual connection',
    message: 'Contemplation, ancestral wisdom, inner strength',
    bestFor: 'Deep dub, meditation music, introspective tracks',
    variations: [
      {
        id: 'wl-v1',
        style: 'Golden Glow',
        filename: 'Warriors_Lament_v1_golden_glow.png',
        fileSize: '926.2 KB',
        visualStyle: { description: ['Golden glow', 'Top text'], fontSize: '95px' },
        bestFor: ['Warmth', 'Spirituality'],
        performance: { desktop: 5, mobile: 5, tablet: 5 }
      },
      {
        id: 'wl-v2',
        style: 'Thick Outline',
        filename: 'Warriors_Lament_v2_thick_outline.png',
        fileSize: '877.5 KB',
        visualStyle: { description: ['Thick outline', 'Centre text'], fontSize: '100px' },
        bestFor: ['Mobile', 'Contrast'],
        performance: { desktop: 4, mobile: 5, tablet: 5 }
      },
      {
        id: 'wl-v3',
        style: 'Red Glow',
        filename: 'Warriors_Lament_v3_red_glow.png',
        fileSize: '924.9 KB',
        visualStyle: { description: ['Red glow', 'Top text'], fontSize: '95px', accent: 'RGB(255, 80, 80)' },
        bestFor: ['Energy', 'Reggae'],
        performance: { desktop: 5, mobile: 4, tablet: 5 }
      },
      {
        id: 'wl-v4',
        style: 'Clean Shadow',
        filename: 'Warriors_Lament_v4_clean_shadow.png',
        fileSize: '953.3 KB',
        visualStyle: { description: ['Clean shadow', 'Centre text'], fontSize: '105px' },
        bestFor: ['Professional', 'Clean'],
        performance: { desktop: 5, mobile: 4, tablet: 5 }
      }
    ]
  },
  {
    id: 'section-4',
    title: 'Earthly Sorrows Heaviest - Russian Mystic Dub',
    theme: 'Heavy emotions, mystical journey, cross-cultural fusion',
    message: 'Depth, spiritual weight, transcendent sorrow',
    bestFor: 'Deep dub, experimental fusion, mystical atmosphere',
    variations: [
      {
        id: 'es-v1',
        style: 'Golden Glow',
        filename: 'Earthly_Sorrows_v1_golden_glow.png',
        fileSize: '925.1 KB',
        visualStyle: { description: ['Golden glow', 'Top text'], fontSize: '95px' },
        bestFor: ['Warmth', 'Spirituality'],
        performance: { desktop: 5, mobile: 5, tablet: 5 }
      },
      {
        id: 'es-v2',
        style: 'Thick Outline',
        filename: 'Earthly_Sorrows_v2_thick_outline.png',
        fileSize: '869.7 KB',
        visualStyle: { description: ['Thick outline', 'Centre text'], fontSize: '100px' },
        bestFor: ['Mobile', 'Contrast'],
        performance: { desktop: 4, mobile: 5, tablet: 5 }
      },
      {
        id: 'es-v3',
        style: 'Red Glow',
        filename: 'Earthly_Sorrows_v3_red_glow.png',
        fileSize: '923.6 KB',
        visualStyle: { description: ['Red glow', 'Top text'], fontSize: '95px', accent: 'RGB(255, 80, 80)' },
        bestFor: ['Energy', 'Reggae'],
        performance: { desktop: 5, mobile: 4, tablet: 5 }
      },
      {
        id: 'es-v4',
        style: 'Clean Shadow',
        filename: 'Earthly_Sorrows_v4_clean_shadow.png',
        fileSize: '960.0 KB',
        visualStyle: { description: ['Clean shadow', 'Centre text'], fontSize: '105px' },
        bestFor: ['Professional', 'Clean'],
        performance: { desktop: 5, mobile: 4, tablet: 5 }
      }
    ]
  },
  {
    id: 'section-5',
    title: 'Studio Producer Sessions',
    theme: 'Behind the scenes, creator at work, authentic studio vibes',
    message: 'Authenticity, creation, process',
    bestFor: 'Production vlogs, "making of" content, producer showcases',
    variations: [
      // Set A
      {
        id: 'sp-a-v1',
        style: 'Golden Glow',
        filename: 'Studio_Producer_v1_golden_glow.png',
        fileSize: '862.1 KB',
        visualStyle: { description: ['Golden glow', 'Top text'], fontSize: '95px' },
        bestFor: ['Warmth'],
        performance: { desktop: 5, mobile: 5, tablet: 5 }
      },
      {
        id: 'sp-a-v2',
        style: 'Thick Outline',
        filename: 'Studio_Producer_v2_thick_outline.png',
        fileSize: '831.6 KB',
        visualStyle: { description: ['Thick outline', 'Centre text'], fontSize: '100px' },
        bestFor: ['Mobile'],
        performance: { desktop: 4, mobile: 5, tablet: 5 }
      },
      {
        id: 'sp-a-v3',
        style: 'Red Glow',
        filename: 'Studio_Producer_v3_red_glow.png',
        fileSize: '860.8 KB',
        visualStyle: { description: ['Red glow', 'Top text'], fontSize: '95px', accent: 'RGB(255, 80, 80)' },
        bestFor: ['Energy'],
        performance: { desktop: 5, mobile: 4, tablet: 5 }
      },
      {
        id: 'sp-a-v4',
        style: 'Clean Shadow',
        filename: 'Studio_Producer_v4_clean_shadow.png',
        fileSize: '900.5 KB',
        visualStyle: { description: ['Clean shadow', 'Centre text'], fontSize: '105px' },
        bestFor: ['Professional'],
        performance: { desktop: 5, mobile: 4, tablet: 5 }
      },
      // Set B
      {
        id: 'sp-b-v1',
        style: 'Golden Glow',
        filename: 'Studio_Original_v1_golden_glow.png',
        fileSize: '877.3 KB',
        visualStyle: { description: ['Golden glow', 'Top text'], fontSize: '95px' },
        bestFor: ['Warmth'],
        performance: { desktop: 5, mobile: 5, tablet: 5 }
      },
      {
        id: 'sp-b-v2',
        style: 'Thick Outline',
        filename: 'Studio_Original_v2_thick_outline.png',
        fileSize: '851.8 KB',
        visualStyle: { description: ['Thick outline', 'Centre text'], fontSize: '100px' },
        bestFor: ['Mobile'],
        performance: { desktop: 4, mobile: 5, tablet: 5 }
      },
      {
        id: 'sp-b-v3',
        style: 'Red Glow',
        filename: 'Studio_Original_v3_red_glow.png',
        fileSize: '876.0 KB',
        visualStyle: { description: ['Red glow', 'Top text'], fontSize: '95px', accent: 'RGB(255, 80, 80)' },
        bestFor: ['Energy'],
        performance: { desktop: 5, mobile: 4, tablet: 5 }
      },
      {
        id: 'sp-b-v4',
        style: 'Clean Shadow',
        filename: 'Studio_Original_v4_clean_shadow.png',
        fileSize: '909.9 KB',
        visualStyle: { description: ['Clean shadow', 'Centre text'], fontSize: '105px' },
        bestFor: ['Professional'],
        performance: { desktop: 5, mobile: 4, tablet: 5 }
      }
    ]
  }
];

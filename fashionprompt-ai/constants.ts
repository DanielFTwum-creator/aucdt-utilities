import { OptionItem, CheckboxItem } from './types';

export const GARMENT_OPTIONS: OptionItem[] = [
  { value: 'dress', label: 'Dress' },
  { value: 'gown', label: 'Evening Gown' },
  { value: 'suit', label: 'Suit' },
  { value: 'jumpsuit', label: 'Jumpsuit' },
  { value: 'coat', label: 'Coat/Jacket' },
  { value: 'skirt', label: 'Skirt' },
  { value: 'pants', label: 'Pants/Trousers' },
  { value: 'top', label: 'Top/Blouse' },
  { value: 'streetwear', label: 'Streetwear Outfit' },
  { value: 'sportswear', label: 'Sportswear' },
];

export const STYLE_OPTIONS: OptionItem[] = [
  { value: 'haute couture', label: 'Haute Couture' },
  { value: 'minimalist', label: 'Minimalist' },
  { value: 'avant-garde', label: 'Avant-Garde' },
  { value: 'bohemian', label: 'Bohemian' },
  { value: 'streetwear', label: 'Streetwear' },
  { value: 'vintage', label: 'Vintage' },
  { value: 'futuristic', label: 'Futuristic' },
  { value: 'romantic', label: 'Romantic' },
  { value: 'androgynous', label: 'Androgynous' },
  { value: 'sustainable', label: 'Sustainable Fashion' },
];

export const COLOR_OPTIONS: OptionItem[] = [
  { value: 'vibrant yellow and gold tones', label: 'Vibrant Yellow/Gold' },
  { value: 'monochromatic black', label: 'Monochromatic Black' },
  { value: 'pastel tones', label: 'Soft Pastels' },
  { value: 'jewel tones', label: 'Rich Jewel Tones' },
  { value: 'earth tones', label: 'Natural Earth Tones' },
  { value: 'neon and electric colors', label: 'Neon/Electric' },
  { value: 'neutral minimalist palette', label: 'Neutral Minimalist' },
  { value: 'bold primary colors', label: 'Bold Primary Colors' },
  { value: 'metallic silver and chrome', label: 'Metallic/Chrome' },
];

export const FABRIC_OPTIONS: OptionItem[] = [
  { value: 'flowing silk', label: 'Flowing Silk' },
  { value: 'structured cotton', label: 'Structured Cotton' },
  { value: 'luxurious velvet', label: 'Luxurious Velvet' },
  { value: 'sheer organza', label: 'Sheer Organza' },
  { value: 'leather', label: 'Leather' },
  { value: 'denim', label: 'Denim' },
  { value: 'knit wool', label: 'Knit Wool' },
  { value: 'metallic fabric', label: 'Metallic Fabric' },
  { value: 'sustainable recycled materials', label: 'Sustainable/Recycled' },
];

export const DETAIL_OPTIONS: OptionItem[] = [
  { value: 'tiered ruffles', label: 'Tiered Ruffles' },
  { value: 'pleating', label: 'Pleating' },
  { value: 'draping', label: 'Draping' },
  { value: 'embroidery', label: 'Embroidery' },
  { value: 'asymmetric cut', label: 'Asymmetric Cut' },
  { value: 'geometric patterns', label: 'Geometric Patterns' },
  { value: 'cutouts', label: 'Cutouts' },
  { value: 'layering', label: 'Layering' },
  { value: 'oversized silhouette', label: 'Oversized Silhouette' },
];

export const SETTING_OPTIONS: OptionItem[] = [
  { value: 'professional runway', label: 'Runway' },
  { value: 'studio photography with white backdrop', label: 'Studio (White Backdrop)' },
  { value: 'urban street setting', label: 'Urban Street' },
  { value: 'natural outdoor setting', label: 'Natural Outdoor' },
  { value: 'architectural modern interior', label: 'Modern Interior' },
  { value: 'editorial magazine photoshoot', label: 'Editorial/Magazine' },
];

export const LIGHTING_OPTIONS: OptionItem[] = [
  { value: 'soft studio lighting', label: 'Soft Studio' },
  { value: 'dramatic spotlight', label: 'Dramatic Spotlight' },
  { value: 'golden hour sunlight', label: 'Golden Hour' },
  { value: 'cinematic lighting', label: 'Cinematic' },
  { value: 'neon cyberpunk lighting', label: 'Neon/Cyberpunk' },
  { value: 'natural daylight', label: 'Natural Day' },
  { value: 'dark and moody lighting', label: 'Dark & Moody' },
  { value: 'ethereal rim lighting', label: 'Backlit/Rim' },
];

export const MOOD_OPTIONS: OptionItem[] = [
  { value: 'elegant and sophisticated', label: 'Elegant' },
  { value: 'mysterious and enigmatic', label: 'Mysterious' },
  { value: 'playful and energetic', label: 'Playful' },
  { value: 'ethereal and dreamlike', label: 'Ethereal' },
  { value: 'bold and confident', label: 'Bold' },
  { value: 'romantic and soft', label: 'Romantic' },
  { value: 'melancholic and somber', label: 'Melancholic' },
  { value: 'serene and calm', label: 'Serene' },
];

export const ETHNICITY_OPTIONS: CheckboxItem[] = [
  { id: 'african', label: 'African', value: 'African' },
  { id: 'asian', label: 'East Asian', value: 'East Asian' },
  { id: 'hispanic', label: 'Hispanic/Latina', value: 'Hispanic/Latina' },
  { id: 'middleeastern', label: 'Middle Eastern', value: 'Middle Eastern' },
  { id: 'southasian', label: 'South Asian', value: 'South Asian' },
  { id: 'indigenous', label: 'Indigenous', value: 'Indigenous' },
  { id: 'mixed', label: 'Mixed Ethnicity', value: 'Mixed ethnicity' },
  { id: 'pacific', label: 'Pacific Islander', value: 'Pacific Islander' },
];

export const INITIAL_STATE: Record<string, string> = {
  garment: 'dress',
  style: 'haute couture',
  color: 'vibrant yellow and gold tones',
  fabric: 'flowing silk',
  detail: 'tiered ruffles',
  setting: 'professional runway',
  lighting: 'soft studio lighting',
  mood: 'elegant and sophisticated',
};

export const INITIAL_ETHNICITIES: Record<string, boolean> = {
  african: true,
  asian: true,
  hispanic: true,
  middleeastern: true,
  southasian: true,
  indigenous: true,
  mixed: true,
  pacific: true,
};
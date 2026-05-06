import { DesignElement, KenteColor } from './types';

export const SILHOUETTES: DesignElement[] = [
  { id: 'structured-bodice', name: 'Structured Bodice', description: 'A fitted, structured upper part, offering a sophisticated and modern look.' },
  { id: 'off-shoulder', name: 'Off-Shoulder Style', description: 'Exposing the shoulders for an elegant and contemporary feel.' },
  { id: 'a-line-gown', name: 'A-line Gown', description: 'A classic, flattering silhouette that is fitted at the bodice and flares out gracefully to the hem.' },
  { id: 'jumpsuit', name: 'Jumpsuit', description: 'A stylish one-piece garment, blending comfort with high fashion.' },
  { id: 'blazer', name: 'Blazer', description: 'A tailored jacket, perfect for a sharp, powerful, and versatile statement.' },
  { id: 'peplum-top', name: 'Peplum Top', description: 'A top with a short, flared ruffle around the waist, adding a chic and feminine touch.' },
  { id: 'infinity-dress', name: 'Infinity Dress', description: 'A versatile dress that can be styled in numerous ways, offering adaptability.' },
];

export const KENTE_PLACEMENTS: DesignElement[] = [
  { id: 'statement-panel', name: 'Statement Panel', description: 'A prominent section of Kente cloth integrated into the garment, drawing attention.' },
  { id: 'dramatic-sleeve', name: 'Dramatic Sleeve', description: 'Voluminous or uniquely shaped sleeves made with Kente, creating a focal point.' },
  { id: 'peplum-detail', name: 'Peplum Detail', description: 'Kente cloth used for the peplum, adding a vibrant and textured flare.' },
  { id: 'oversized-bow', name: 'Oversized Bow', description: 'A large, decorative bow made from Kente, offering a playful yet elegant accent.' },
  { id: 'collar-cuff', name: 'Collar & Cuff Accents', description: 'Subtle Kente detailing on collars and cuffs for a refined touch.' },
];

export const MATERIAL_FUSIONS: DesignElement[] = [
  { id: 'tulle-skirt', name: 'Tulle Skirt', description: 'Kente bodice paired with a light, flowing tulle skirt for contrast and elegance.' },
  { id: 'denim-base', name: 'Denim Base', description: 'Kente accents over a casual denim garment, blending traditional with urban style.' },
  { id: 'ankara-base', name: 'Ankara Base', description: 'Kente incorporated into an Ankara fabric outfit, a fusion of African prints.' },
  { id: 'plain-silk', name: 'Plain Silk', description: 'Kente combined with luxurious plain silk for a sophisticated and smooth contrast.' },
];

export const KENTE_COLORS: KenteColor[] = [
  { id: 'Gold', name: 'Gold', hex: '#FFD700', symbolism: 'Royalty, wealth, high status, glory, spiritual purity' },
  { id: 'Blue', name: 'Blue', hex: '#0000FF', symbolism: 'Peace, harmony, love, patience, tenderness' },
  { id: 'Green', name: 'Green', hex: '#008000', symbolism: 'Growth, harvest, renewal, good health, spiritual growth' },
  { id: 'Red', name: 'Red', hex: '#FF0000', symbolism: 'Passion, strength, political power, blood, sacrifice' },
  { id: 'Black', name: 'Black', hex: '#000000', symbolism: 'Maturity, spirituality, ancestors, mourning, strong spiritual energy' },
  { id: 'White', name: 'White', hex: '#FFFFFF', symbolism: 'Purity, cleansing, festive occasions, innocence' },
  { id: 'Yellow', name: 'Yellow', hex: '#FFFF00', symbolism: 'Preciousness, royalty, wealth, fertility' },
];

export const ACCESSORIES: DesignElement[] = [
  { id: 'minimalist-heels', name: 'Minimalist Heels', description: 'Sleek, simple heels that complement without distracting.' },
  { id: 'statement-gold-jewelry', name: 'Statement Gold Jewelry', description: 'Bold gold pieces that enhance the royal feel of Kente.' },
  { id: 'coordinated-headwrap', name: 'Coordinated Headwrap', description: 'A headwrap matching or complementing the Kente pattern.' },
  { id: 'chic-clutch', name: 'Chic Clutch', description: 'A stylish, small handbag for elegance and functionality.' },
  { id: 'geometric-earrings', name: 'Geometric Earrings', description: 'Modern earrings with sharp lines to contrast traditional patterns.' },
];

export const VERSATILITY_OPTIONS: DesignElement[] = [
  { id: 'jumpsuit-multi', name: 'Jumpsuit (Multi-wear)', description: 'A versatile jumpsuit that can be dressed up or down for various occasions.' },
  { id: 'two-piece-set', name: 'Two-Piece Set', description: 'Separate top and bottom that can be worn together or mixed and matched.' },
  { id: 'adaptable-dress', name: 'Adaptable Dress', description: 'A dress (like an infinity dress) with changeable styling options.' },
];

export const DESIGN_CATEGORIES = [
    { id: 'silhouette', name: 'Contemporary Silhouettes', options: SILHOUETTES, type: 'single' },
    { id: 'kentePlacement', name: 'Strategic Kente Placement', options: KENTE_PLACEMENTS, type: 'single' },
    { id: 'materialFusion', name: 'Fusion with Other Materials', options: MATERIAL_FUSIONS, type: 'single' },
    { id: 'kenteColors', name: 'Colour Play & Symbolism', options: KENTE_COLORS, type: 'multiple' },
    { id: 'accessories', name: 'Accessorizing for Impact', options: ACCESSORIES, type: 'multiple' },
    { id: 'versatility', name: 'Versatility in Design', options: VERSATILITY_OPTIONS, type: 'single' },
];
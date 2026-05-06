export interface Product {
  id: string;
  name: string;
  tagline: string;
  price: number;
  image: string;
  category: 'Kente Stole' | 'Kente Fabric' | 'Gift Package';
  origin: string;
  patternType: string;
  colors: string[];
  features: string[];
  inStock: boolean;
  description: string;
}

export const products: Product[] = [
  {
    id: 'adehye-style',
    name: 'Adehye Style',
    tagline: 'Elevate your graduation with a touch of Ghanaian royal heritage.',
    price: 100,
    image: '/images/p2_28.png',
    category: 'Kente Stole',
    origin: 'Ghana',
    patternType: 'Kente',
    colors: ['Black', 'Gold', 'Green', 'Red'],
    features: ['Adinkra Symbol of Choice', 'Basic Ghanaian Colors', 'Preferred Inscription'],
    inStock: true,
    description:
      'Elevate your graduation with our "Adehye Style" stole, featuring an exquisite Adinkra symbol cherished by Ghanaians for its deep cultural significance. This stole showcases your connection to Ghana\'s rich heritage.',
  },
  {
    id: 'nyonyo',
    name: 'Nyonyo',
    tagline: 'Wear your school pride with bold Ghanaian colors.',
    price: 115,
    image: '/images/p3_32.png',
    category: 'Kente Stole',
    origin: 'Ghana',
    patternType: 'Kente',
    colors: ['Black', 'Gold', 'Green', 'Red'],
    features: ['School Logo', 'Basic Ghanaian Colors', 'Preferred Inscription'],
    inStock: true,
    description:
      'Elevate your graduation with a touch of school pride. Our Nyonyo Kente stole is customised with your school logo, a personal inscription, and the iconic Ghanaian colors.',
  },
  {
    id: 'sophie',
    name: 'Sophie',
    tagline: 'Unleash your creativity — colors that reflect your journey.',
    price: 115,
    image: '/images/p4_36.png',
    category: 'Kente Stole',
    origin: 'Ghana',
    patternType: 'Kente',
    colors: ['Black', 'Customised'],
    features: ['School Logo', 'Customised Colors', 'Preferred Inscription'],
    inStock: true,
    description:
      'Unleash your creativity for graduation day! Tailor your Sophie stole with your school logo, a personal inscription, and a color palette that reflects your unique journey and personality.',
  },
  {
    id: 'daisy',
    name: 'Daisy',
    tagline: 'Celebrate your achievement in the most regal way.',
    price: 105,
    image: '/images/p5_40.png',
    category: 'Kente Stole',
    origin: 'Ghana',
    patternType: 'Kente',
    colors: ['Black', 'Customised'],
    features: ['Adinkra Symbol', 'Customised Colors', 'Preferred Inscription'],
    inStock: true,
    description:
      'Celebrate your achievement in the most regal way. Let your Daisy stole speak of your success and the cultural legacy you proudly embrace.',
  },
  {
    id: 'my-becoming',
    name: 'My Becoming',
    tagline: 'A longer, fully bespoke stole tailored precisely to your needs.',
    price: 135,
    image: '/images/p6_44.png',
    category: 'Kente Stole',
    origin: 'Ghana',
    patternType: 'Kente',
    colors: ['Black', 'Gold', 'Green', 'Red', 'Customised'],
    features: [
      'Adinkra Symbol or School Logo',
      'Customised Colors',
      'Preferred Inscription',
      'Preferred Base Design',
    ],
    inStock: true,
    description:
      'Pause for a moment to consider how you want to style your stole. My Becoming is a longer model tailored just to your needs. Feel free to blend your colors in a way that relates to your journey.',
  },
];

import { Product, Testimonial, Exhibition } from '../types';

export const products: Product[] = [
  {
    id: '1',
    name: 'Personalized Name Fold',
    slug: 'personalized-name-fold',
    description: 'A bespoke handcrafted book sculpture featuring a name or word of your choice. Each page is meticulously folded to create a stunning 3D effect.',
    basePrice: 100,
    images: [
      'https://picsum.photos/seed/book1/800/1200',
      'https://picsum.photos/seed/book2/800/1200'
    ],
    category: 'Custom Art',
    requiresCustomInput: true,
    customInputLabel: 'What word or name would you like me to fold?',
    dimensions: 'Approx. 9" x 6" x 4"',
    material: 'Vintage Hardcover Book',
    estimatedShipping: '2-3 weeks',
    featured: true,
    variants: [
      { id: 'v1', label: '4 Letters', value: 4, priceOverride: 100 },
      { id: 'v2', label: '5 Letters', value: 5, priceOverride: 125 },
      { id: 'v3', label: '6 Letters', value: 6, priceOverride: 150 },
      { id: 'v4', label: '7 Letters', value: 7, priceOverride: 175 },
      { id: 'v5', label: '8 Letters', value: 8, priceOverride: 200 },
      { id: 'v6', label: '9 Letters', value: 9, priceOverride: 225 },
    ]
  },
  {
    id: '2',
    name: 'Geometric Heart Sculpture',
    slug: 'geometric-heart',
    description: 'A beautiful geometric heart folded into a vintage book. Perfect for weddings, anniversaries, or as a unique home decor piece.',
    basePrice: 85,
    images: [
      'https://picsum.photos/seed/heart1/800/1200',
      'https://picsum.photos/seed/heart2/800/1200'
    ],
    category: 'Ready to Ship',
    requiresCustomInput: false,
    dimensions: 'Approx. 8" x 5" x 3"',
    material: 'Repurposed Classic Novel',
    estimatedShipping: '3-5 business days',
    featured: true
  },
  {
    id: '3',
    name: 'Custom Date Anniversary Book',
    slug: 'custom-date-book',
    description: 'Commemorate a special date with this custom folded book. Ideal for anniversaries, birthdays, or significant milestones.',
    basePrice: 110,
    images: [
      'https://picsum.photos/seed/date1/800/1200'
    ],
    category: 'Custom Art',
    requiresCustomInput: true,
    customInputLabel: 'Enter the date (DD.MM.YY)',
    dimensions: 'Approx. 9" x 6" x 4"',
    material: 'Vintage Hardcover Book',
    estimatedShipping: '2-3 weeks',
    featured: false
  },
  {
    id: '4',
    name: 'Infinity Symbol Fold',
    slug: 'infinity-symbol',
    description: 'The symbol of eternal love and connection, beautifully rendered in paper. A timeless gift for weddings or close friendships.',
    basePrice: 95,
    images: [
      'https://picsum.photos/seed/infinity1/800/1200'
    ],
    category: 'Ready to Ship',
    requiresCustomInput: false,
    dimensions: 'Approx. 8" x 5" x 3"',
    material: 'Vintage Poetry Book',
    estimatedShipping: '3-5 business days',
    featured: false
  },
  {
    id: '5',
    name: 'Custom Initials & Heart',
    slug: 'custom-initials-heart',
    description: 'Two initials connected by a delicate heart. A perfect wedding or engagement gift that celebrates a unique union.',
    basePrice: 130,
    images: [
      'https://picsum.photos/seed/initials1/800/1200'
    ],
    category: 'Custom Art',
    requiresCustomInput: true,
    customInputLabel: 'Enter the two initials (e.g., A & B)',
    dimensions: 'Approx. 9.5" x 6.5" x 4.5"',
    material: 'Vintage Hardcover Book',
    estimatedShipping: '3-4 weeks',
    featured: true
  }
];

export const testimonials: Testimonial[] = [
  {
    id: '1',
    quote: "The personalized book was the highlight of our anniversary. Luciana's attention to detail is incredible.",
    customerName: "Sarah M.",
    productPurchased: "Personalized Name Fold",
    date: "October 2025"
  },
  {
    id: '2',
    quote: "A truly unique piece of art. It sits proudly on our mantle and everyone asks about it.",
    customerName: "James R.",
    productPurchased: "Geometric Heart Sculpture",
    date: "December 2024"
  }
];

export const exhibitions: Exhibition[] = [
  {
    id: '1',
    title: "Paper Narratives",
    year: "2025",
    date: "May 12 — June 30, 2025",
    venue: "Lebanon Arts Center, NH",
    description: "A solo exhibition showcasing the evolution of book folding as a medium for storytelling."
  },
  {
    id: '2',
    title: "Crafting the Future",
    year: "2024",
    date: "Sept 15 — Oct 2, 2024",
    venue: "New England Craft Fair",
    description: "Group exhibition featuring contemporary artisans from across the Northeast."
  }
];

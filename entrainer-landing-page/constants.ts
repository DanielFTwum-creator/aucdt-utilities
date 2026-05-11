
import { Feature, Screenshot, Testimonial, FeatureDetailContent } from './types';

export const features: Feature[] = [
  {
    iconUrl: 'https://www.entrainme.com/wp-content/uploads/2025/01/runner_BG_BlurRed-150x150-1.png',
    title: 'HABIT FORMING',
    description: 'Entrainment, in the biomusicological sense, refers to the synchronization of organisms to an external rhythm, usually produced by other organisms with whom they interact socially.',
  },
  {
    iconUrl: 'https://www.entrainme.com/wp-content/uploads/2025/01/runner_BG_BlurGreen-150x150-1.png',
    title: 'RUN GROOVE',
    description: 'Grab some Bluetooth earbuds and experience Musical Movement! enTrainer will match your music’s tempo to your walking or running cadence.',
  },
  {
    iconUrl: 'https://www.entrainme.com/wp-content/uploads/2025/01/runner_BG_BlurOrange-150x150-1.png',
    title: 'ABOUT ENTRAINER',
    description: 'It’s actually two apps-in-one: an Apple Music player, where you select songs and set your target tempo. And a run Tracker that keeps track of your route and running stats.',
  },
];

export const screenshots: Screenshot[] = [
  { url: 'https://www.entrainme.com/wp-content/uploads/2015/12/iPhone6_Flat_2-1.png', alt: 'enTrainer App Screenshot 1' },
  { url: 'https://www.entrainme.com/wp-content/uploads/2015/12/DarkiPhones.png', alt: 'enTrainer App Screenshot 2' },
  { url: 'https://www.entrainme.com/wp-content/uploads/2015/12/slide2_entrain-2.png', alt: 'enTrainer App Screenshot 3' },
  { url: 'https://www.entrainme.com/wp-content/uploads/2015/12/slide1_entrain-2.png', alt: 'enTrainer App Screenshot 4' },
  { url: 'https://www.entrainme.com/wp-content/uploads/2015/12/DarkiPhones2.png', alt: 'enTrainer App Screenshot 5' },
  { url: 'https://www.entrainme.com/wp-content/uploads/2014/03/slide3_entrain-3.png', alt: 'enTrainer App Screenshot 6' },
  { url: 'https://www.entrainme.com/wp-content/uploads/2014/03/DarkiPhones2-1.png', alt: 'enTrainer App Screenshot 7' },
];

export const testimonials: Testimonial[] = [
  {
    quote: "The cherry pitter did not in fact change my life, but enTrainer will. I'd like to see some custom presets so that I can set my own cadence.",
    author: 'Stephen in Montreal, QC',
  },
  {
    quote: 'A perfect running companion! The way it syncs music to my pace is pure magic. My workouts have never been more enjoyable or effective.',
    author: 'Hill Runner in Portland, ME',
  },
  {
    quote: 'I was skeptical at first, but this app is a game-changer. It pushes me to keep a consistent cadence without even thinking about it.',
    author: 'Ken in Burlington, VT',
  },
];

export const featureDetails: FeatureDetailContent[] = [
  {
    title: 'Your Music At Your Pace',
    paragraphs: [
      'Be completely in sync with your music. enTrainer precisely synchronizes your iTunes music playlist to your running cadence.',
      'Two apps in one: an adjustable music player where you select songs and set your target cadence, and a pace tracker with pedometer features to measure your cadence and record your workout stats. The song\'s BPM matches your steps per minute.'
    ],
    imageUrl: 'https://www.entrainme.com/wp-content/uploads/2025/01/Playlist.png',
    imageAlt: 'App playlist screen',
    buttonText: 'Learn More',
    buttonUrl: '#',
  },
  {
    title: 'Tracks Your Trail',
    paragraphs: [
      'Press the Track button and start moving. After a minute or so, your measured cadence will be displayed. This is usually a good initial setting for your target cadence in the Music Player.',
      'Experiment a bit to find what feels best for you. Enjoy the Run!'
    ],
    imageUrl: 'https://www.entrainme.com/wp-content/uploads/2014/03/NorwichWalk1_320.png',
    imageAlt: 'App tracking a route on a map',
    buttonText: 'Learn More',
    buttonUrl: '#',
  }
];

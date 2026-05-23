export interface CompanionProfile {
  emoji: string;
  name: string;
  title: string;
  themeColor: string;
  greeting: string;
  encouragement: string[];
  helperTips: string[];
}

export const COMPANIONS: Record<string, CompanionProfile> = {
  '🦊': {
    emoji: '🦊',
    name: 'Aero the Solar Fox',
    title: 'Fast-paced Math Explorer',
    themeColor: 'from-orange-500 to-amber-500',
    greeting: 'Hi there, adventurer! Let us run through equations with fiery speeds!',
    encouragement: [
      'Incredible velocity! Feel the keys beneath your paws!',
      'Your calculation accuracy is reaching light speed!',
      'Unstoppable typing, partner! Let us race to the next island stone!',
    ],
    helperTips: [
      'Rest your left hand fingers on A-S-D-F and right hand on J-K-L-;!',
      'Type without peek-looking down to boost your typing muscle memory!',
    ]
  },
  '🦄': {
    emoji: '🦄',
    name: 'Glimmer the Magic Unicorn',
    title: 'Dreamy Math Encourager',
    themeColor: 'from-pink-500 to-purple-500',
    greeting: 'Hello, dear friend! Let us turn mathematical symbols into rainbow magic!',
    encouragement: [
      'Sparkle magic! Every keypress is a glittering step!',
      'Your beautiful typing is lighting up the mathematical stars!',
      'A true magical equation master! I am so proud of you!',
    ],
    helperTips: [
      'Numbers are just magical patterns of groups! Count them in your mind.',
      'Take a deep gentle breath. Math is a journey of discovery!',
    ]
  },
  '🦖': {
    emoji: '🦖',
    name: 'Rexy the Math Dino',
    title: 'Energetic Equation Fighter',
    themeColor: 'from-emerald-500 to-teal-500',
    greeting: 'ROAR! Let us stomp on these equations and build gigantic scores!',
    encouragement: [
      'Colossal calculation! Dino-sized combo streak!',
      'Uncompromising power! Stomp those keys perfectly!',
      'You have giant prehistoric mathematical confidence! Keep roaring!',
    ],
    helperTips: [
      'Fractions are just slicing big cookies or pizzas into dinosaur portion sizes!',
      'A Ten-Frame has space for exactly ten. Find what makes ten first!',
    ]
  },
  '👽': {
    emoji: '👽',
    name: 'Zog the Cosmic Martian',
    title: 'Inquisitive Alien Analyst',
    themeColor: 'from-violet-500 to-indigo-500',
    greeting: 'Interstellar greetings, Earth offspring. Let us analyze alien numeral formulas!',
    encouragement: [
      'Galactic mastery unlocked! Alien telemetry confirms excellence.',
      'Equation verified. Your biomechanical keypress timing is perfect!',
      'Your mental computing capabilities exceed normal expectations!',
    ],
    helperTips: [
      'Multiplication is repetitive addition across grid coordinates. Easy coordinates!',
      'The on-screen keyboard guides highlight your finger trajectory vectors.',
    ]
  },
  '🐱': {
    emoji: '🐱',
    name: 'Coach Tabby',
    title: 'Warm Math Tutor',
    themeColor: 'from-yellow-500 to-orange-400',
    greeting: 'Purr-fect! Let’s practice math touch typing together today!',
    encouragement: [
      'Stellar math calculations, kid!',
      'Fabulous equations typing! Purr-fect!',
      'Calculations locked and loaded! Keep going!',
    ],
    helperTips: [
      'Look at the pulsing green key on the on-screen keyboard guide!',
      'Type the exact arithmetic formulas to complete the challenge.',
    ]
  }
};

export function getCompanion(emoji: string): CompanionProfile {
  return COMPANIONS[emoji] || COMPANIONS['🐱'];
}

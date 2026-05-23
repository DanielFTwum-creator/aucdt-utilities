import { LevelConfig, MathQuestion } from '../types';

export const ALL_BADGES = [
  {
    id: 'badge-novice',
    title: 'Touch Typing Cadet',
    description: 'Began the standard typing quest!',
    icon: '⌨️',
    cost: 5,
    unlocked: true,
    category: 'typing',
  },
  {
    id: 'badge-counter',
    title: 'Master Counter',
    description: 'Sorted and counted 25 Castle gems accurately.',
    icon: '💎',
    cost: 15,
    unlocked: false,
    category: 'math',
  },
  {
    id: 'badge-addition',
    title: 'Addition Gladiator',
    description: 'Filled interactive Ten-Frames successfully.',
    icon: '➕',
    cost: 15,
    unlocked: false,
    category: 'math',
  },
  {
    id: 'badge-subtraction',
    title: 'Bubble Buster',
    description: 'Beat custom subtraction submarine mines.',
    icon: '🫧',
    cost: 20,
    unlocked: false,
    category: 'math',
  },
  {
    id: 'badge-multiplication',
    title: 'Grid Optimizer',
    description: 'Mastered standard star rows multiplication multiplication multipliers.',
    icon: '⭐',
    cost: 25,
    unlocked: false,
    category: 'math',
  },
  {
    id: 'badge-baker',
    title: 'Gourmet Baker',
    description: 'Cut pizza fractions with supreme symmetry.',
    icon: '🍕',
    cost: 30,
    unlocked: false,
    category: 'math',
  },
  {
    id: 'badge-cosmic',
    title: 'Cosmic Navigator',
    description: 'Survived the intense math asteroid speed blitz.',
    icon: '🚀',
    cost: 40,
    unlocked: false,
    category: 'cosmic',
  },
  {
    id: 'sticker-cat',
    title: 'Tabby’s Gold Medal',
    description: 'Cute Tabby sticker to put in your backpack!',
    icon: '🏅',
    cost: 10,
    unlocked: false,
    category: 'sticker',
  },
  {
    id: 'sticker-cookie',
    title: 'Giga Cookie Coin',
    description: 'A giant visual chocolate chip cookie sticker.',
    icon: '🍪',
    cost: 15,
    unlocked: false,
    category: 'sticker',
  },
  {
    id: 'sticker-crown',
    title: 'Golden Crown',
    description: 'Earned the ultimate status symbol of typing!',
    icon: '👑',
    cost: 50,
    unlocked: false,
    category: 'sticker',
  },
  {
    id: 'companion-unicorn',
    title: 'Unlocks Magic Glimmer Companion',
    description: 'Unlocks magical Glimmer Unicorn companion support and custom dialogue!',
    icon: '🦄',
    cost: 20,
    unlocked: false,
    category: 'companion',
  },
  {
    id: 'companion-dino',
    title: 'Unlocks Dino Rexe Companion',
    description: 'Unlocks energetic Rexy the dinosaur coaching tips support and roar encouragement!',
    icon: '🦖',
    cost: 25,
    unlocked: false,
    category: 'companion',
  },
  {
    id: 'companion-alien',
    title: 'Unlocks Alien Zog Companion',
    description: 'Unlocks curious Zog the alien guidance advice and vector math coordinates!',
    icon: '👽',
    cost: 30,
    unlocked: false,
    category: 'companion',
  }
];

export const INITIAL_LEVELS: LevelConfig[] = [
  {
    id: 1,
    zone: 'counting',
    zoneTitle: 'The Counting Castle',
    levelNumber: 1,
    title: 'Gem Castle Counting',
    description: 'Count the glowing visual castle gems and practice numeric coordinates (1 to 5).',
    starsRequired: 0,
    unlocked: true,
    practices: [
      {
        id: 'c1-1',
        type: 'count',
        prompt: 'Look at the sparkling gems! Count them, and type:',
        visualType: 'blocks',
        visualData: { color: 'bg-indigo-500', count: 3 },
        equation: '3',
        answer: '3',
        helperTip: 'Use your left hand pointers & middle finger to press keys like 3! Keep your eyes on Coach Tabby!'
      },
      {
        id: 'c1-2',
        type: 'count',
        prompt: 'Count the emerald blocks and type:',
        visualType: 'blocks',
        visualData: { color: 'bg-emerald-500', count: 5 },
        equation: '5',
        answer: '5',
        helperTip: 'Key 5 is typed using your left pointer finger. You can do it!'
      },
      {
        id: 'c1-3',
        type: 'count',
        prompt: 'Count the gold coins and type:',
        visualType: 'blocks',
        visualData: { color: 'bg-yellow-400', count: 2 },
        equation: '2',
        answer: '2',
        helperTip: 'Look for Key 2 with your left ring finger. Take your time.'
      }
    ]
  },
  {
    id: 2,
    zone: 'addition',
    zoneTitle: 'Addition Arcade',
    levelNumber: 2,
    title: 'Interactive Ten-Frames',
    description: 'Build equations. Type equations using numeric keys (1..9), +, and =.',
    starsRequired: 2,
    unlocked: false,
    practices: [
      {
        id: 'add-1',
        type: 'addition',
        prompt: 'Type this addition equation to sum the purple and gold chips:',
        visualType: 'ten-frame',
        visualData: { partA: 3, partB: 2, colorA: 'bg-purple-500', colorB: 'bg-yellow-400' },
        equation: '3+2=5',
        answer: '3+2=5',
        helperTip: 'Hold the Shift key and press "=" on the upper-right row to type the "+" symbol!'
      },
      {
        id: 'add-2',
        type: 'addition',
        prompt: 'Fill the ten-frame! Type the equation:',
        visualType: 'ten-frame',
        visualData: { partA: 5, partB: 4, colorA: 'bg-teal-500', colorB: 'bg-orange-500' },
        equation: '5+4=9',
        answer: '5+4=9',
        helperTip: 'Addition is just joining two groups. Keep standard fingers curved over the keys.'
      },
      {
        id: 'add-3',
        type: 'addition',
        prompt: 'Let us add up to a full frame! Type:',
        visualType: 'ten-frame',
        visualData: { partA: 6, partB: 4, colorA: 'bg-pink-500', colorB: 'bg-blue-400' },
        equation: '6+4=10',
        answer: '6+4=10',
        helperTip: 'Ten in a frame means a full set of base-10 block keys. Super typing!'
      }
    ]
  },
  {
    id: 3,
    zone: 'subtraction',
    zoneTitle: 'Subtraction Submarine',
    levelNumber: 3,
    title: 'Bubble Buster Subtraction',
    description: 'Pop floating bubble barriers by subtracting blocks. Master numeric dash minus symbol (-).',
    starsRequired: 5,
    unlocked: false,
    practices: [
      {
        id: 'sub-1',
        type: 'subtraction',
        prompt: 'Subtract the faded chips! Type this equation:',
        visualType: 'balloon-pop',
        visualData: { total: 5, remove: 2, color: 'bg-rose-500' },
        equation: '5-2=3',
        answer: '3',
        helperTip: 'The minus (-) symbol is next to the key 0 on the top number row. Use your right pinky!'
      },
      {
        id: 'sub-2',
        type: 'subtraction',
        prompt: 'Pop the submarine mines! Type:',
        visualType: 'balloon-pop',
        visualData: { total: 8, remove: 3, color: 'bg-cyan-500' },
        equation: '8-3=5',
        answer: '5',
        helperTip: 'Subtraction is counting backwards. Stretch your fingers lightly to reach Row 1!'
      },
      {
        id: 'sub-3',
        type: 'subtraction',
        prompt: 'Solve the remaining pop-challenges:',
        visualType: 'balloon-pop',
        visualData: { total: 10, remove: 6, color: 'bg-emerald-500' },
        equation: '10-6=4',
        answer: '4',
        helperTip: 'Your right pinky handles both "-" and "="! You can do hard things!'
      }
    ]
  },
  {
    id: 4,
    zone: 'multiplication',
    zoneTitle: 'Multiplication Meadows',
    levelNumber: 4,
    title: 'Spatial Rows Arrays',
    description: 'Type multiplication facts symbolized by rows/columns. Master asterisks (*).',
    starsRequired: 8,
    unlocked: false,
    practices: [
      {
        id: 'mul-1',
        type: 'multiplication',
        prompt: 'Look at the rows of stars! 3 rows of 4 stars. Type:',
        visualType: 'star-grid',
        visualData: { rows: 3, cols: 4, color: 'bg-amber-400' },
        equation: '3*4=12',
        answer: '12',
        helperTip: 'Hold Shift and tab key 8 to type "*", which stands for multiply!'
      },
      {
        id: 'mul-2',
        type: 'multiplication',
        prompt: '2 rows of 5 stars total up what? Type:',
        visualType: 'star-grid',
        visualData: { rows: 2, cols: 5, color: 'bg-fuchsia-400' },
        equation: '2*5=10',
        answer: '10',
        helperTip: 'Multiplication means adding equal groups! Type each character precisely.'
      },
      {
        id: 'mul-3',
        type: 'multiplication',
        prompt: '4 rows of 3 gold shields. Correctly type:',
        visualType: 'star-grid',
        visualData: { rows: 4, cols: 3, color: 'bg-yellow-500' },
        equation: '4*3=12',
        answer: '12',
        helperTip: 'Spacebar resets your balance. Keep your posture tall!'
      }
    ]
  },
  {
    id: 5,
    zone: 'fractions',
    zoneTitle: 'Bakery Fractions',
    levelNumber: 5,
    title: 'Fraction Pizza Baker',
    description: 'Cut pies and serve slice ratios. Master keying forward slash (/).',
    starsRequired: 11,
    unlocked: false,
    practices: [
      {
        id: 'frac-1',
        type: 'fraction',
        prompt: 'We baked a delicious pie cut in 4. Serve 3 slices! Type:',
        visualType: 'pizza',
        visualData: { totalSlices: 4, selectedSlices: 3, label: 'Order: 3 quarters of pizza' },
        equation: '3/4',
        answer: '3/4',
        helperTip: 'The slash key (/) is typed with your right hand pinky finger on the lower row of keys!'
      },
      {
        id: 'frac-2',
        type: 'fraction',
        prompt: 'Serve half of this cherry pie! Type:',
        visualType: 'pizza',
        visualData: { totalSlices: 2, selectedSlices: 1, label: 'Order: 1/2 of pie' },
        equation: '1/2',
        answer: '1/2',
        helperTip: 'Fractions show sharing. Top number is what we get, bottom is the total count!'
      },
      {
        id: 'frac-3',
        type: 'fraction',
        prompt: 'A chocolate cake with 8 pieces. Serve 5 slices! Type:',
        visualType: 'pizza',
        visualData: { totalSlices: 8, selectedSlices: 5, label: 'Order: 5 eighths' },
        equation: '5/8',
        answer: '5/8',
        helperTip: 'Feel the rhythm of your keys. You are officially high-speed typing math formulas!'
      }
    ]
  },
  {
    id: 6,
    zone: 'cosmic',
    zoneTitle: 'Cosmic Blitz',
    levelNumber: 6,
    title: 'Asteroid Bridge Blaster',
    description: 'Blast falling meteoroid items using numerical formulas in real time!',
    starsRequired: 14,
    unlocked: false,
    practices: [
      {
        id: 'cos-1',
        type: 'blitz',
        prompt: 'Type the sum to blow up the incoming asteroid!',
        visualType: 'asteroid',
        visualData: { questionText: '5 + 5 = ?', fullText: '5+5=10' },
        equation: '5+5=10',
        answer: '10',
        helperTip: 'Blast asteroids in orbit by keys! Rest on home row, stretch up fast!'
      },
      {
        id: 'cos-2',
        type: 'blitz',
        prompt: 'Solve fast! Subtraction asteroid block heading this way!',
        visualType: 'asteroid',
        visualData: { questionText: '10 - 7 = ?', fullText: '10-7=3' },
        equation: '10-7=3',
        answer: '3',
        helperTip: 'You have become exceptionally fast. Tabby believes in you!'
      },
      {
        id: 'cos-3',
        type: 'blitz',
        prompt: 'Final boss coordinate: Multiplication anomaly!',
        visualType: 'asteroid',
        visualData: { questionText: '5 * 3 = ?', fullText: '5*3=15' },
        equation: '5*3=15',
        answer: '15',
        helperTip: 'Hold shift for *, type fast! You are the champion of TabQuest!'
      }
    ]
  }
];

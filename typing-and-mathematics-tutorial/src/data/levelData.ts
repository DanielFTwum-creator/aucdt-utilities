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
    description: 'Mastered standard star rows multiplication multipliers.',
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
    title: 'Tabby\'s Gold Medal',
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
    description: 'Count the glowing visual castle gems and practice numeric coordinates (1 to 9).',
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
        helperTip: 'Use your left middle finger to press key 3! Keep your eyes on the screen.'
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
      },
      {
        id: 'c1-4',
        type: 'count',
        prompt: 'One shining ruby appears! Type what you see:',
        visualType: 'blocks',
        visualData: { color: 'bg-red-500', count: 1 },
        equation: '1',
        answer: '1',
        helperTip: 'Key 1 lives at the far left of the number row — use your left pinky!'
      },
      {
        id: 'c1-5',
        type: 'count',
        prompt: 'Count the sapphire diamonds carefully:',
        visualType: 'blocks',
        visualData: { color: 'bg-blue-500', count: 4 },
        equation: '4',
        answer: '4',
        helperTip: 'Key 4 is pressed with your left pointer finger, one step to the left of 5.'
      },
      {
        id: 'c1-6',
        type: 'count',
        prompt: 'Seven amber stars are shining. Type the count:',
        visualType: 'blocks',
        visualData: { color: 'bg-amber-400', count: 7 },
        equation: '7',
        answer: '7',
        helperTip: 'Key 7 is on the right side — use your right pointer finger to reach it!'
      },
      {
        id: 'c1-7',
        type: 'count',
        prompt: 'Count the purple crystals in the castle:',
        visualType: 'blocks',
        visualData: { color: 'bg-purple-500', count: 6 },
        equation: '6',
        answer: '6',
        helperTip: 'Key 6 sits between 5 and 7 — your right pointer finger can reach it!'
      },
      {
        id: 'c1-8',
        type: 'count',
        prompt: 'Eight pink hearts are glowing. Type:',
        visualType: 'blocks',
        visualData: { color: 'bg-pink-500', count: 8 },
        equation: '8',
        answer: '8',
        helperTip: 'Key 8 — right middle finger. You are flying through this level!'
      },
      {
        id: 'c1-9',
        type: 'count',
        prompt: 'Nine teal gems — the highest count! Type it:',
        visualType: 'blocks',
        visualData: { color: 'bg-teal-500', count: 9 },
        equation: '9',
        answer: '9',
        helperTip: 'Key 9 is pressed with your right ring finger. The full number row mastered!'
      }
    ]
  },
  {
    id: 2,
    zone: 'addition',
    zoneTitle: 'Addition Arcade',
    levelNumber: 2,
    title: 'Interactive Ten-Frames',
    description: 'Build equations. Type addition equations using numeric keys (1..9), +, and =.',
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
        helperTip: 'Hold Shift + "=" to type "+"! Then press "=" alone after the sum.'
      },
      {
        id: 'add-2',
        type: 'addition',
        prompt: 'Fill the ten-frame! Type the equation:',
        visualType: 'ten-frame',
        visualData: { partA: 5, partB: 4, colorA: 'bg-teal-500', colorB: 'bg-orange-500' },
        equation: '5+4=9',
        answer: '5+4=9',
        helperTip: 'Addition is just joining two groups. Keep fingers curved over the home row!'
      },
      {
        id: 'add-3',
        type: 'addition',
        prompt: 'Add up to a full frame! Type:',
        visualType: 'ten-frame',
        visualData: { partA: 6, partB: 4, colorA: 'bg-pink-500', colorB: 'bg-blue-400' },
        equation: '6+4=10',
        answer: '6+4=10',
        helperTip: 'Ten fills a frame perfectly — the base-10 system in action!'
      },
      {
        id: 'add-4',
        type: 'addition',
        prompt: 'One blue chip plus seven red chips. Type:',
        visualType: 'ten-frame',
        visualData: { partA: 1, partB: 7, colorA: 'bg-blue-600', colorB: 'bg-red-500' },
        equation: '1+7=8',
        answer: '1+7=8',
        helperTip: 'Small numbers still need the same careful typing rhythm!'
      },
      {
        id: 'add-5',
        type: 'addition',
        prompt: 'Four green plus three amber chips:',
        visualType: 'ten-frame',
        visualData: { partA: 4, partB: 3, colorA: 'bg-green-500', colorB: 'bg-amber-400' },
        equation: '4+3=7',
        answer: '4+3=7',
        helperTip: 'Seven! Your fingers should feel the rhythm now — left side, right side.'
      },
      {
        id: 'add-6',
        type: 'addition',
        prompt: 'Two violet plus six cyan chips. Type:',
        visualType: 'ten-frame',
        visualData: { partA: 2, partB: 6, colorA: 'bg-violet-500', colorB: 'bg-cyan-400' },
        equation: '2+6=8',
        answer: '2+6=8',
        helperTip: 'Eight again — but typed from a different equation. Variety builds mastery!'
      }
    ]
  },
  {
    id: 3,
    zone: 'subtraction',
    zoneTitle: 'Subtraction Submarine',
    levelNumber: 3,
    title: 'Bubble Buster Subtraction',
    description: 'Pop floating bubble barriers by subtracting blocks. Master the numeric dash minus symbol (-).',
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
        helperTip: 'The minus (-) key is next to 0 on the top row. Right pinky reaches it!'
      },
      {
        id: 'sub-2',
        type: 'subtraction',
        prompt: 'Pop the submarine mines! Type:',
        visualType: 'balloon-pop',
        visualData: { total: 8, remove: 3, color: 'bg-cyan-500' },
        equation: '8-3=5',
        answer: '5',
        helperTip: 'Subtraction counts backwards. Stretch right pinky to the minus key!'
      },
      {
        id: 'sub-3',
        type: 'subtraction',
        prompt: 'Solve the remaining pop-challenges:',
        visualType: 'balloon-pop',
        visualData: { total: 10, remove: 6, color: 'bg-emerald-500' },
        equation: '10-6=4',
        answer: '4',
        helperTip: 'Right pinky handles both "-" and "=". You can do hard things!'
      },
      {
        id: 'sub-4',
        type: 'subtraction',
        prompt: 'Seven bubbles pop — four remain. Type:',
        visualType: 'balloon-pop',
        visualData: { total: 7, remove: 3, color: 'bg-fuchsia-500' },
        equation: '7-3=4',
        answer: '4',
        helperTip: 'Same answer as before — different equation. Patterns in maths are everywhere!'
      },
      {
        id: 'sub-5',
        type: 'subtraction',
        prompt: 'Nine minus five. Type the equation:',
        visualType: 'balloon-pop',
        visualData: { total: 9, remove: 5, color: 'bg-indigo-500' },
        equation: '9-5=4',
        answer: '4',
        helperTip: 'Your typing speed is growing. Keep those fingers relaxed and curved!'
      },
      {
        id: 'sub-6',
        type: 'subtraction',
        prompt: 'Six golden spheres — take away two. Type:',
        visualType: 'balloon-pop',
        visualData: { total: 6, remove: 2, color: 'bg-yellow-500' },
        equation: '6-2=4',
        answer: '4',
        helperTip: 'Final subtraction! You have mastered the minus key like a pro!'
      }
    ]
  },
  {
    id: 4,
    zone: 'multiplication',
    zoneTitle: 'Multiplication Meadows',
    levelNumber: 4,
    title: 'Spatial Rows Arrays',
    description: 'Type multiplication facts symbolised by rows/columns. Master the asterisk (*) symbol.',
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
        helperTip: 'Hold Shift + key 8 to type "*" — the multiply symbol!'
      },
      {
        id: 'mul-2',
        type: 'multiplication',
        prompt: '2 rows of 5 stars total up to what? Type:',
        visualType: 'star-grid',
        visualData: { rows: 2, cols: 5, color: 'bg-fuchsia-400' },
        equation: '2*5=10',
        answer: '10',
        helperTip: 'Multiplication means adding equal groups. Type each character precisely!'
      },
      {
        id: 'mul-3',
        type: 'multiplication',
        prompt: '4 rows of 3 gold shields. Correctly type:',
        visualType: 'star-grid',
        visualData: { rows: 4, cols: 3, color: 'bg-yellow-500' },
        equation: '4*3=12',
        answer: '12',
        helperTip: 'Same answer as 3×4! The commutative property — maths is cool.'
      },
      {
        id: 'mul-4',
        type: 'multiplication',
        prompt: '2 rows of 3 blue gems. Type the equation:',
        visualType: 'star-grid',
        visualData: { rows: 2, cols: 3, color: 'bg-blue-500' },
        equation: '2*3=6',
        answer: '6',
        helperTip: 'Smaller grids, faster answers. Your typing pace should be picking up!'
      },
      {
        id: 'mul-5',
        type: 'multiplication',
        prompt: '5 rows of 2 purple diamonds. Type:',
        visualType: 'star-grid',
        visualData: { rows: 5, cols: 2, color: 'bg-purple-500' },
        equation: '5*2=10',
        answer: '10',
        helperTip: '5 groups of 2 equals 10. The asterisk key — Shift+8 — every time!'
      },
      {
        id: 'mul-6',
        type: 'multiplication',
        prompt: '3 rows of 3 teal stars. A perfect square! Type:',
        visualType: 'star-grid',
        visualData: { rows: 3, cols: 3, color: 'bg-teal-500' },
        equation: '3*3=9',
        answer: '9',
        helperTip: '3×3 is a square number. You have conquered Multiplication Meadows!'
      }
    ]
  },
  {
    id: 5,
    zone: 'fractions',
    zoneTitle: 'Bakery Fractions',
    levelNumber: 5,
    title: 'Fraction Pizza Baker',
    description: 'Cut pies and serve slice ratios. Master the forward slash (/) key.',
    starsRequired: 11,
    unlocked: false,
    practices: [
      {
        id: 'frac-1',
        type: 'fraction',
        prompt: 'We baked a delicious pie cut in 4. Serve 3 slices! Type:',
        visualType: 'pizza',
        visualData: { totalSlices: 4, selectedSlices: 3, label: 'Order: 3 quarters' },
        equation: '3/4',
        answer: '3/4',
        helperTip: 'The slash (/) is on the lower right — right pinky finger reaches it!'
      },
      {
        id: 'frac-2',
        type: 'fraction',
        prompt: 'Serve half of this cherry pie! Type:',
        visualType: 'pizza',
        visualData: { totalSlices: 2, selectedSlices: 1, label: 'Order: 1/2 of pie' },
        equation: '1/2',
        answer: '1/2',
        helperTip: 'Fractions show sharing — top is what we get, bottom is the total!'
      },
      {
        id: 'frac-3',
        type: 'fraction',
        prompt: 'A chocolate cake with 8 pieces. Serve 5 slices! Type:',
        visualType: 'pizza',
        visualData: { totalSlices: 8, selectedSlices: 5, label: 'Order: 5 eighths' },
        equation: '5/8',
        answer: '5/8',
        helperTip: 'Feel the typing rhythm. You are officially typing maths formulas at speed!'
      },
      {
        id: 'frac-4',
        type: 'fraction',
        prompt: 'A banana cake cut in 3. Serve 2 slices! Type:',
        visualType: 'pizza',
        visualData: { totalSlices: 3, selectedSlices: 2, label: 'Order: 2 thirds' },
        equation: '2/3',
        answer: '2/3',
        helperTip: 'Two thirds! A very common fraction in everyday life. Type it confidently!'
      },
      {
        id: 'frac-5',
        type: 'fraction',
        prompt: 'A lemon tart cut in 4. Serve just 1 slice! Type:',
        visualType: 'pizza',
        visualData: { totalSlices: 4, selectedSlices: 1, label: 'Order: 1 quarter' },
        equation: '1/4',
        answer: '1/4',
        helperTip: 'One quarter — the tiniest slice. Your slash key technique is excellent!'
      },
      {
        id: 'frac-6',
        type: 'fraction',
        prompt: 'A coconut cake in 8 pieces. Serve 7! Type:',
        visualType: 'pizza',
        visualData: { totalSlices: 8, selectedSlices: 7, label: 'Order: 7 eighths' },
        equation: '7/8',
        answer: '7/8',
        helperTip: 'Almost the whole cake! Fraction Baker badge is within reach now!'
      }
    ]
  },
  {
    id: 6,
    zone: 'cosmic',
    zoneTitle: 'Cosmic Blitz',
    levelNumber: 6,
    title: 'Asteroid Bridge Blaster',
    description: 'Blast falling meteoroids using numerical formulas in real time! All operations combined.',
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
        helperTip: 'Rest on home row, stretch up fast! Blast that asteroid!'
      },
      {
        id: 'cos-2',
        type: 'blitz',
        prompt: 'Solve fast! Subtraction asteroid block heading this way!',
        visualType: 'asteroid',
        visualData: { questionText: '10 - 7 = ?', fullText: '10-7=3' },
        equation: '10-7=3',
        answer: '3',
        helperTip: 'Subtraction asteroid incoming — type fast and accurate!'
      },
      {
        id: 'cos-3',
        type: 'blitz',
        prompt: 'Final boss coordinate: Multiplication anomaly!',
        visualType: 'asteroid',
        visualData: { questionText: '5 * 3 = ?', fullText: '5*3=15' },
        equation: '5*3=15',
        answer: '15',
        helperTip: 'Hold Shift for *! You are the champion of TabQuest!'
      },
      {
        id: 'cos-4',
        type: 'blitz',
        prompt: 'Mixed-operations asteroid wave incoming! Type:',
        visualType: 'asteroid',
        visualData: { questionText: '8 + 4 = ?', fullText: '8+4=12' },
        equation: '8+4=12',
        answer: '12',
        helperTip: 'Twelve! Two-digit sums in blitz mode — your speed is superb!'
      },
      {
        id: 'cos-5',
        type: 'blitz',
        prompt: 'Rapid subtraction strike — dodge and type!',
        visualType: 'asteroid',
        visualData: { questionText: '9 - 4 = ?', fullText: '9-4=5' },
        equation: '9-4=5',
        answer: '5',
        helperTip: 'Nine minus four equals five. Keep those fingers loose and ready!'
      },
      {
        id: 'cos-6',
        type: 'blitz',
        prompt: 'FINAL BOSS — multiplication mega-asteroid! Type:',
        visualType: 'asteroid',
        visualData: { questionText: '4 * 4 = ?', fullText: '4*4=16' },
        equation: '4*4=16',
        answer: '16',
        helperTip: 'Four squared equals sixteen. You have conquered the Cosmic Blitz — LEGEND!'
      }
    ]
  }
];

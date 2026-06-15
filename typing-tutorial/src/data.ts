import { Lesson } from "./types";

export const LESSONS: Lesson[] = [
  {
    id: 1,
    title: "Home Row - Left Hand (A S D F)",
    description: "Connect your muscle memory with your left hand's primary anchor row targets: A, S, D, and F.",
    keys: "asdf",
    icon: "🏠",
    practices: [
      "asdf asdf asdf asdf",
      "sad dad fasf dads",
      "asa sda faf sads",
      "dff ass sdd saff ddf"
    ]
  },
  {
    id: 2,
    title: "Home Row - Right Hand (J K L ;)",
    description: "Align your right hand on J, K, L, and semicolon. Always rest your right index finger on J.",
    keys: "jkl;",
    icon: "🏠",
    practices: [
      "jkl; jkl; jkl; jkl;",
      "jak jal kal; jalk",
      "jaj kdk lfl ;s;",
      "lass kals jass kaff"
    ]
  },
  {
    id: 3,
    title: "Home Row - Comprehensive Mastery",
    description: "Saturate home row coordinates. Master both hands typing together across the absolute center row.",
    keys: "asdfjkl;",
    icon: "⚡",
    practices: [
      "ask jak sad fads",
      "shall flash flask flaks",
      "salsa halls falls jals",
      "flask salad jads kals"
    ]
  },
  {
    id: 4,
    title: "Top Row - Left Hand Expansion (Q W E R T)",
    description: "Reach upwards from anchor row keys. Learn target structures for Q, W, E, R, and T.",
    keys: "qwert",
    icon: "🚀",
    practices: [
      "were wet wet tree were",
      "red tare rate wafer",
      "raw straw sweat tread",
      "water treats state safe"
    ]
  },
  {
    id: 5,
    title: "Top Row - Right Hand Expansion (Y U I O P)",
    description: "Reach upward with your right fingers to strike Y, U, I, O, and P accurately.",
    keys: "yuiop",
    icon: "🚀",
    practices: [
      "you you your output",
      "pour prior loyalty",
      "utility plot youth",
      "propitory trial write"
    ]
  },
  {
    id: 6,
    title: "Numeric Left Hand Sequence (1 2 3 4 5)",
    description: "Master keyboard numbers. Press 1 through 5 using progressive reaches from Home Row.",
    keys: "12345",
    icon: "🔢",
    practices: [
      "1 2 3 4 5 12345",
      "54321 15243 32541",
      "12 34 55 43 21 5",
      "15 sad 24 dad 35 fas"
    ]
  },
  {
    id: 7,
    title: "Numeric Right Hand Sequence (6 7 8 9 0)",
    description: "Type top right digits 6, 7, 8, 9, and 0 cleanly without looking down.",
    keys: "67890",
    icon: "🔢",
    practices: [
      "6 7 8 9 0 67890",
      "09876 68790 98076",
      "66 77 88 99 00 6",
      "jalk 678 lads 90 ;s"
    ]
  },
  {
    id: 8,
    title: "Bottom Row - Left Hand Pivot (Z X C V)",
    description: "Curl left hand fingers downward to learn bottom row mechanics: Z, X, C, and V.",
    keys: "zxcv",
    icon: "💪",
    practices: [
      "zap vex cat vet car",
      "zeal crest cave exact",
      "vext crack vest wax",
      "zapped active vertex caw"
    ]
  },
  {
    id: 9,
    title: "Bottom Row - Right Hand Pivot (B N M , .)",
    description: "Master bottom row keys B, N, M, comma, and period with clean finger targets.",
    keys: "bnm,.",
    icon: "💪",
    practices: [
      "ban numb bomb main man",
      "born norm corn barn bank",
      "name map coma comma dot.",
      "men back normal comma."
    ]
  },
  {
    id: 10,
    title: "Full Keyboard Championship Drill",
    description: "Strike all characters continuously across the keyboard and finalize your TUC qualification.",
    keys: "abcdefghijklmnopqrstuvwxyz",
    icon: "👑",
    practices: [
      "The quick brown fox jumps over the lazy dog.",
      "Pack my box with five dozen liquor jugs.",
      "All the world is a stage and all people play parts.",
      "Typing smoothly minimizes mistakes and maximizes speed."
    ]
  },
  {
    id: 11,
    title: "Numeric Keypad - Fast Data Entry (AI Era)",
    description: "Master the dedicated numeric keypad with the right hand for rapid IDs, prices, and dates - essential for fast data entry into AI tools and spreadsheets.",
    keys: "0123456789.-",
    icon: "🖩",
    inputMode: "numpad",
    practices: [
      "456 789 123 0.0",
      "2026-06-15 2025-12-31",
      "199.99 45.50 1000.00",
      "10293-84756 30219-58473"
    ]
  }
];

export const GAME_WORDS = [
  "hello", "world", "typing", "master", "keyboard", "practice", "champion", "awesome",
  "wonderful", "fantastic", "incredible", "amazing", "brilliant", "excellent", "perfect",
  "computer", "program", "code", "function", "variable", "library", "database", "server",
  "techbridge", "university", "ghana", "oyibi", "daniel", "twum", "ict", "system"
];

export const REFERENCE_SPEEDTEXTS = [
  "Techbridge University College in Oyibi, Ghana, excels in providing robust technical certifications. Under the leadership of Daniel Twum, Head of ICT, the college is pioneering interactive student interfaces to build professional computer typing speeds. Practice remains the ultimate catalyst for muscle memory development.",
  "Computer keyboard mastery forms the fundamental bedrock of modern engineering productivity. When preparing educational builds, standard software compliance requires complete specifications under UK English conventions. Striking the character keys smoothly secures higher WPM indexes.",
  "Responsive web apps render inside accessible frames. For typing tasks, this means tracking character indexes in real time, validating errors seamlessly, and offering dark or high-contrast styles for low-vision students. Always align your index fingers on the home keys f and j.",
  "Capacitor bridges the web development ecosystem with native mobile distributions. Building iOS and Android packages can be completed via npx cap sync commands. Once archived via Android Studio or Xcode, developers upload release bundles to official App Stores for academic distribution."
];

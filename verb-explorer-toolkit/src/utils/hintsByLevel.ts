export type ClassLevel = 'class-1-3' | 'class-4-6' | 'class-7-9';

export interface StepHints {
  title: string;
  tips: string[];
  tip_title: string;
}

export const getHintsByLevel = (step: number, level: ClassLevel): StepHints => {
  const hints: Record<number, Record<ClassLevel, StepHints>> = {
    1: {
      'class-1-3': {
        title: '💡 Choose a Fun Verb!',
        tips: [
          'Click on any word you like!',
          'Or type a verb you know',
          'Click the dice 🎲 for a surprise',
        ],
        tip_title: 'Pick a word that\'s fun to say! Try "Jump" or "Dance"',
      },
      'class-4-6': {
        title: '💡 Demo Hint: Choose a Verb',
        tips: [
          'Click on any verb in the categories',
          'Type your own verb in the text box',
          'Click the dice 🎲 to pick a random verb',
        ],
        tip_title: 'Try choosing "Discover" to see how the app works!',
      },
      'class-7-9': {
        title: '💡 Verb Selection Strategy',
        tips: [
          'Browse thematic categories (Action, Everyday, Interesting)',
          'Enter any verb you want to research',
          'Use the randomizer for unexpected discoveries',
          'Consider choosing verbs with multiple meanings for deeper analysis',
        ],
        tip_title: 'Pro tip: Choose verbs with interesting etymology or multiple meanings for a richer project!',
      },
    },
    2: {
      'class-1-3': {
        title: '💡 Learn About Your Word',
        tips: [
          'What does it mean? Write it simply',
          'Where did it come from? Ask your teacher',
          'Write 2 sentences using your word',
          'Tell a fun fact about it',
        ],
        tip_title: 'Example: "Jump means to go up in the air and come back down!"',
      },
      'class-4-6': {
        title: '💡 Demo Hint: Research Your Verb',
        tips: [
          'Fill in the definition in your own words',
          'Find where the word comes from (origin)',
          'Write 2 sentences using the verb',
          'Share interesting facts or synonyms',
        ],
        tip_title: 'Example: "Discover" means to find something new!',
      },
      'class-7-9': {
        title: '💡 Research Deep Dive',
        tips: [
          'Provide a detailed definition with contextual usage',
          'Research the etymological origin and language evolution',
          'Create sentences demonstrating different word forms (tense, mood)',
          'Analyze synonyms, antonyms, and semantic nuances',
        ],
        tip_title: 'Challenge: Compare your verb to similar verbs and explain the subtle differences!',
      },
    },
    3: {
      'class-1-3': {
        title: '💡 Make Your Card',
        tips: [
          'Write your name and class',
          'Pick your favorite colour',
          'Click Print to see your card',
          'Show it to your teacher!',
        ],
        tip_title: 'Your card will look so cool when you print it!',
      },
      'class-4-6': {
        title: '💡 Demo Hint: Create Your Card',
        tips: [
          'Enter your name and class (e.g., "Demo - Class 4")',
          'Pick a card colour (yellow, blue, pink, or green)',
          'Click the Print button to see your card',
        ],
        tip_title: 'Your profile card displays all your research beautifully!',
      },
      'class-7-9': {
        title: '💡 Professional Profile Card Design',
        tips: [
          'Enter your full name and class designation',
          'Select a colour that matches your verb\'s meaning or mood',
          'Review the layout before printing',
          'Print on quality paper for best presentation',
        ],
        tip_title: 'Tip: Choose colours strategically—blue for calm verbs, red for action verbs!',
      },
    },
    4: {
      'class-1-3': {
        title: '💡 Practice Speaking',
        tips: [
          'Press Start to begin the timer',
          'Talk about your word for 2-3 minutes',
          'Speak loud and clear so everyone hears',
          'Tell your class about what you learned!',
        ],
        tip_title: 'Remember: Slow down, speak clearly, and smile!',
      },
      'class-4-6': {
        title: '💡 Demo Hint: Practice Presentation',
        tips: [
          'Click Start to begin the 2-3 minute timer',
          'Practice explaining your verb to the class',
          'Use the checklist to make sure you\'re ready',
          'When done, present to your actual class!',
        ],
        tip_title: 'Speak clearly and with confidence!',
      },
      'class-7-9': {
        title: '💡 Professional Presentation Preparation',
        tips: [
          'Use the timer to practice a 2-3 minute presentation',
          'Prepare a compelling narrative about your verb discovery',
          'Practice delivery with emphasis and natural pacing',
          'Anticipate questions from your classmates',
        ],
        tip_title: 'Challenge: Prepare a brief story or example that brings your verb to life!',
      },
    },
  };

  return hints[step]?.[level] || hints[step]?.['class-4-6'] || {
    title: '💡 Hint',
    tips: ['Continue with the current step'],
    tip_title: 'Keep going!',
  };
};

export const getClassLevelLabel = (level: ClassLevel): string => {
  const labels: Record<ClassLevel, string> = {
    'class-1-3': 'Class 1-3',
    'class-4-6': 'Class 4-6',
    'class-7-9': 'JHS (Class 7-9)',
  };
  return labels[level];
};

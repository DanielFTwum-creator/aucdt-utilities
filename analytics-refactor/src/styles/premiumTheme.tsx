/**
 * Premium Theme Configuration
 * Magazine-Quality Design System
 * 
 * Professional color palette, typography, and styling
 * following editorial and Hollywood magazine standards
 */

export const premiumTheme = {
  // Colour Palette - Sophisticated & Professional
  colors: {
    // Primary - Elegant Purple/Indigo
    primary: {
      DEFAULT: '#6366f1',
      light: '#818cf8',
      dark: '#4f46e5',
      50: '#eef2ff',
      100: '#e0e7ff',
      500: '#6366f1',
      600: '#4f46e5',
      700: '#4338ca',
      900: '#312e81',
    },
    
    // Accent - Refined Amber/Gold (not orange)
    accent: {
      DEFAULT: '#f59e0b',
      light: '#fbbf24',
      dark: '#d97706',
      50: '#fffbeb',
      100: '#fef3c7',
      400: '#fbbf24',
      500: '#f59e0b',
      600: '#d97706',
      700: '#b45309',
    },
    
    // Secondary - Sophisticated Rose
    secondary: {
      DEFAULT: '#ec4899',
      light: '#f472b6',
      dark: '#db2777',
    },
    
    // Neutrals - Premium Grays
    neutral: {
      50: '#f8fafc',
      100: '#f1f5f9',
      200: '#e2e8f0',
      300: '#cbd5e1',
      400: '#94a3b8',
      500: '#64748b',
      600: '#475569',
      700: '#334155',
      800: '#1e293b',
      900: '#0f172a',
    },
    
    // Background
    background: {
      dark: '#0f172a',
      darker: '#020617',
      card: 'rgba(255, 255, 255, 0.05)',
      cardHover: 'rgba(255, 255, 255, 0.08)',
    },
    
    // Text
    text: {
      primary: '#f8fafc',
      secondary: 'rgba(248, 250, 252, 0.7)',
      tertiary: 'rgba(248, 250, 252, 0.5)',
      accent: '#fbbf24',
    },
    
    // Status Colors
    status: {
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#3b82f6',
    },
  },
  
  // Gradients - Premium & Sophisticated
  gradients: {
    primary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    secondary: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    accent: 'linear-gradient(135deg, rgba(251, 146, 60, 0.9) 0%, rgba(249, 115, 22, 0.85) 100%)',
    gold: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
    purple: 'linear-gradient(135deg, #818cf8 0%, #6366f1 100%)',
    rose: 'linear-gradient(135deg, #f472b6 0%, #ec4899 100%)',
    dark: 'linear-gradient(180deg, #1e293b 0%, #0f172a 100%)',
  },
  
  // Typography - Editorial Quality
  typography: {
    // Font Families
    fontFamily: {
      display: '"Playfair Display", Georgia, serif',
      sans: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      mono: '"JetBrains Mono", "SF Mono", Consolas, monospace',
    },
    
    // Font Sizes - Harmonious Scale
    fontSize: {
      xs: '0.75rem',      // 12px
      sm: '0.875rem',     // 14px
      base: '1rem',       // 16px
      lg: '1.125rem',     // 18px
      xl: '1.25rem',      // 20px
      '2xl': '1.5rem',    // 24px
      '3xl': '1.875rem',  // 30px
      '4xl': '2.25rem',   // 36px
      '5xl': '3rem',      // 48px
      '6xl': '3.75rem',   // 60px
      '7xl': '4.5rem',    // 72px
    },
    
    // Font Weights
    fontWeight: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
      black: 900,
    },
    
    // Line Heights
    lineHeight: {
      tight: 1.1,
      snug: 1.25,
      normal: 1.5,
      relaxed: 1.75,
    },
    
    // Letter Spacing
    letterSpacing: {
      tighter: '-0.05em',
      tight: '-0.02em',
      normal: '0',
      wide: '0.02em',
      wider: '0.05em',
      widest: '0.1em',
    },
  },
  
  // Spacing - Generous & Breathable
  spacing: {
    xs: '0.5rem',    // 8px
    sm: '0.75rem',   // 12px
    md: '1rem',      // 16px
    lg: '1.5rem',    // 24px
    xl: '2rem',      // 32px
    '2xl': '3rem',   // 48px
    '3xl': '4rem',   // 64px
    '4xl': '6rem',   // 96px
  },
  
  // Border Radius - Modern & Smooth
  borderRadius: {
    sm: '0.5rem',    // 8px
    md: '0.75rem',   // 12px
    lg: '1rem',      // 16px
    xl: '1.5rem',    // 24px
    '2xl': '2rem',   // 32px
    '3xl': '3rem',   // 48px
    full: '9999px',
  },
  
  // Shadows - Depth & Elevation
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    '3xl': '0 35px 60px -15px rgba(0, 0, 0, 0.3)',
    inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
    glow: '0 0 20px rgba(99, 102, 241, 0.4)',
    glowAccent: '0 0 30px rgba(251, 191, 36, 0.3)',
  },
  
  // Transitions - Smooth & Professional
  transitions: {
    fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
    base: '200ms cubic-bezier(0.4, 0, 0.2, 1)',
    slow: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
    slower: '500ms cubic-bezier(0.4, 0, 0.2, 1)',
  },
  
  // Z-Index Layers
  zIndex: {
    base: 1,
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    modalBackdrop: 1040,
    modal: 1050,
    popover: 1060,
    tooltip: 1070,
  },
};

// CSS Custom Properties Generator
export const generateCSSVariables = () => {
  return `
    :root {
      /* Colors - Primary */
      --color-primary: ${premiumTheme.colors.primary.DEFAULT};
      --color-primary-light: ${premiumTheme.colors.primary.light};
      --color-primary-dark: ${premiumTheme.colors.primary.dark};
      
      /* Colors - Accent */
      --color-accent: ${premiumTheme.colors.accent.DEFAULT};
      --color-accent-light: ${premiumTheme.colors.accent.light};
      --color-accent-dark: ${premiumTheme.colors.accent.dark};
      
      /* Colors - Text */
      --color-text-primary: ${premiumTheme.colors.text.primary};
      --color-text-secondary: ${premiumTheme.colors.text.secondary};
      --color-text-tertiary: ${premiumTheme.colors.text.tertiary};
      
      /* Colors - Background */
      --color-bg-dark: ${premiumTheme.colors.background.dark};
      --color-bg-darker: ${premiumTheme.colors.background.darker};
      --color-bg-card: ${premiumTheme.colors.background.card};
      
      /* Typography */
      --font-display: ${premiumTheme.typography.fontFamily.display};
      --font-sans: ${premiumTheme.typography.fontFamily.sans};
      --font-mono: ${premiumTheme.typography.fontFamily.mono};
      
      /* Spacing */
      --spacing-xs: ${premiumTheme.spacing.xs};
      --spacing-sm: ${premiumTheme.spacing.sm};
      --spacing-md: ${premiumTheme.spacing.md};
      --spacing-lg: ${premiumTheme.spacing.lg};
      --spacing-xl: ${premiumTheme.spacing.xl};
      
      /* Border Radius */
      --radius-sm: ${premiumTheme.borderRadius.sm};
      --radius-md: ${premiumTheme.borderRadius.md};
      --radius-lg: ${premiumTheme.borderRadius.lg};
      --radius-xl: ${premiumTheme.borderRadius.xl};
      
      /* Transitions */
      --transition-fast: ${premiumTheme.transitions.fast};
      --transition-base: ${premiumTheme.transitions.base};
      --transition-slow: ${premiumTheme.transitions.slow};
    }
  `;
};

// Utility Classes
export const premiumClasses = {
  // Cards
  card: {
    base: 'bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md border border-white/20 rounded-3xl shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 transition-all duration-300',
    premium: 'bg-gradient-to-br from-white/15 to-white/8 backdrop-blur-lg border-2 border-white/30 rounded-3xl shadow-3xl hover:shadow-[0_35px_60px_-15px_rgba(0,0,0,0.4)] transform hover:-translate-y-2 transition-all duration-500',
  },
  
  // Buttons
  button: {
    primary: 'group relative overflow-hidden bg-white/10 backdrop-blur-md border-2 border-white/30 rounded-2xl px-6 py-3 font-semibold text-sm tracking-wide hover:bg-white/20 hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl',
    secondary: 'bg-white/5 border border-white/20 rounded-xl px-5 py-2.5 font-medium text-sm hover:bg-white/10 hover:border-white/30 transition-all duration-200',
    ghost: 'hover:bg-white/10 rounded-lg px-4 py-2 transition-all duration-200',
  },
  
  // Text
  text: {
    display: 'font-display font-extrabold text-6xl leading-tight tracking-tighter',
    heading: 'font-display font-bold text-4xl leading-snug tracking-tight',
    subheading: 'font-sans font-semibold text-2xl leading-normal',
    body: 'font-sans font-normal text-base leading-relaxed',
    caption: 'font-sans font-medium text-sm leading-normal tracking-wide uppercase',
    stat: 'font-mono font-bold text-5xl leading-none',
  },
};

export default premiumTheme;

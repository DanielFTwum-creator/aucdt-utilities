import React, { useContext, useEffect } from 'react';

export const FONT_OPTIONS = [
  { label: 'Bebas Neue',        family: 'Bebas Neue',        weights: '400' },
  { label: 'Playfair Display',  family: 'Playfair Display',  weights: '700;900' },
  { label: 'Oswald',            family: 'Oswald',            weights: '600;700' },
  { label: 'Montserrat',        family: 'Montserrat',        weights: '700;900' },
  { label: 'Cormorant Garamond',family: 'Cormorant Garamond',weights: '700' },
  { label: 'Anton',             family: 'Anton',             weights: '400' },
  { label: 'Inter',             family: 'Inter',             weights: '700;900' },
  { label: 'Raleway',           family: 'Raleway',           weights: '700;900' },
];

function loadGoogleFont(family: string, weights: string) {
  const id = `gfont-${family.replace(/\s+/g, '-')}`;
  if (document.getElementById(id)) return;
  const link = document.createElement('link');
  link.id = id;
  link.rel = 'stylesheet';
  link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family)}:wght@${weights}&display=swap`;
  document.head.appendChild(link);
}

const DEFAULT_COLORS = {
  primary: '#C8A84B',
  secondary: '#0F0C07',
  accent: '#F2EBD9',
  textPrimary: '#0F0C07',
  textSecondary: '#FFFFFF',
};

const DEFAULT_FONTS = {
  heading: 'Bebas Neue',
  body: 'Inter',
};

const ColorContext = React.createContext({
  colors: DEFAULT_COLORS,
  fonts: DEFAULT_FONTS,
  updateColor: (_key: string, _value: string) => {},
  updateFont: (_key: string, _value: string) => {},
});

export const ColorProvider = ({ children }: { children: React.ReactNode }) => {
  const [colors, setColors] = React.useState(() => {
    const saved = localStorage.getItem('banner-colors');
    return saved ? JSON.parse(saved) : DEFAULT_COLORS;
  });

  const [fonts, setFonts] = React.useState(() => {
    const saved = localStorage.getItem('banner-fonts');
    return saved ? JSON.parse(saved) : DEFAULT_FONTS;
  });

  useEffect(() => {
    FONT_OPTIONS.forEach(f => loadGoogleFont(f.family, f.weights));
  }, []);

  const updateColor = (key: string, value: string) => {
    setColors(prev => {
      const next = { ...prev, [key]: value };
      localStorage.setItem('banner-colors', JSON.stringify(next));
      return next;
    });
  };

  const updateFont = (key: string, value: string) => {
    setFonts(prev => {
      const next = { ...prev, [key]: value };
      localStorage.setItem('banner-fonts', JSON.stringify(next));
      return next;
    });
  };

  return (
    <ColorContext.Provider value={{ colors, fonts, updateColor, updateFont }}>
      {children}
    </ColorContext.Provider>
  );
};

export const useBannerColors = () => useContext(ColorContext);

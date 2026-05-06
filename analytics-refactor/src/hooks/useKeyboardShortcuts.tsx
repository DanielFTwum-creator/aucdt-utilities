import { useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';

/**
 * Keyboard Shortcuts Hook
 *
 * Implements global keyboard shortcuts for accessibility features
 *
 * Shortcuts:
 * - Ctrl + P: Print dashboard
 * - Ctrl + E: Open export modal
 * - Shift + A: Toggle accessibility toolbar
 * - Shift + T: Cycle themes
 * - Shift + +: Increase font size
 * - Shift + -: Decrease font size
 * - Shift + 0: Reset font size
 * - Shift + M: Toggle reduced motion
 * - Shift + C: Toggle colorblind mode
 * - Shift + R: Reset all preferences
 * - Shift + ?: Show keyboard shortcuts help
 */

function useKeyboardShortcuts(dashboardHandlers = {}) {
  const {
    cycleTheme,
    increaseFontSize,
    decreaseFontSize,
    resetFontSize,
    toggleReducedMotion,
    toggleColorblindMode,
    resetPreferences,
    canIncreaseFontSize,
    canDecreaseFontSize
  } = useTheme();

  const { onPrint, onExport } = dashboardHandlers;

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ignore shortcuts when typing in input fields
      const activeElement = document.activeElement;
      const isInputField = activeElement && (
        activeElement.tagName === 'INPUT' ||
        activeElement.tagName === 'TEXTAREA' ||
        activeElement.isContentEditable
      );

      if (isInputField && !e.ctrlKey && !e.metaKey) return;

      let handled = false;
      let announcement = '';

      // Handle Ctrl/Cmd shortcuts (Print, Export)
      if (e.ctrlKey || e.metaKey) {
        switch (e.key.toLowerCase()) {
          case 'p':
            // Print dashboard
            if (onPrint) {
              e.preventDefault();
              onPrint();
              announcement = 'Printing dashboard';
              handled = true;
            }
            break;

          case 'e':
            // Open export modal
            if (onExport) {
              e.preventDefault();
              onExport();
              announcement = 'Export modal opened';
              handled = true;
            }
            break;

          default:
            break;
        }
      }

      // Handle Shift shortcuts (Accessibility features)
      else if (e.shiftKey) {
        switch (e.key.toLowerCase()) {
          case 'a':
            // Toggle accessibility toolbar
            const fabButton = document.querySelector('.accessibility-fab');
            if (fabButton) {
              fabButton.click();
              announcement = 'Accessibility toolbar toggled';
              handled = true;
            }
            break;

          case 't':
            // Cycle themes
            cycleTheme();
            announcement = 'Theme changed';
            handled = true;
            break;

          case '+':
          case '=':
            // Increase font size
            if (canIncreaseFontSize) {
              increaseFontSize();
              announcement = 'Font size increased';
              handled = true;
            }
            break;

          case '-':
          case '_':
            // Decrease font size
            if (canDecreaseFontSize) {
              decreaseFontSize();
              announcement = 'Font size decreased';
              handled = true;
            }
            break;

          case '0':
          case ')':
            // Reset font size
            resetFontSize();
            announcement = 'Font size reset';
            handled = true;
            break;

          case 'm':
            // Toggle reduced motion
            toggleReducedMotion();
            announcement = 'Reduced motion toggled';
            handled = true;
            break;

          case 'c':
            // Toggle colorblind mode
            toggleColorblindMode();
            announcement = 'Colorblind mode toggled';
            handled = true;
            break;

          case 'r':
            // Reset all preferences (with confirmation)
            if (window.confirm('Reset all accessibility preferences to defaults?')) {
              resetPreferences();
              announcement = 'All preferences reset';
              handled = true;
            }
            break;

          case '?':
          case '/':
            // Show keyboard shortcuts help
            showKeyboardShortcutsHelp();
            announcement = 'Keyboard shortcuts help displayed';
            handled = true;
            break;

          default:
            break;
        }
      }

      if (handled) {
        e.preventDefault();
        
        // Announce to screen readers
        if (announcement) {
          announceToScreenReader(announcement);
        }

        // Log for debugging
        console.log(`⌨️ Keyboard shortcut: Shift + ${e.key}`);
      }
    };

    // Add event listener
    document.addEventListener('keydown', handleKeyDown);

    // Log shortcuts on mount
    console.log('⌨️ Keyboard shortcuts enabled');
    console.log('   Ctrl + P: Print dashboard');
    console.log('   Ctrl + E: Open export modal');
    console.log('   Shift + A: Toggle accessibility toolbar');
    console.log('   Shift + T: Cycle themes');
    console.log('   Shift + +: Increase font size');
    console.log('   Shift + -: Decrease font size');
    console.log('   Shift + 0: Reset font size');
    console.log('   Shift + M: Toggle reduced motion');
    console.log('   Shift + C: Toggle colorblind mode');
    console.log('   Shift + R: Reset preferences');
    console.log('   Shift + ?: Show help');

    // Cleanup
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [
    cycleTheme,
    increaseFontSize,
    decreaseFontSize,
    resetFontSize,
    toggleReducedMotion,
    toggleColorblindMode,
    resetPreferences,
    canIncreaseFontSize,
    canDecreaseFontSize,
    onPrint,
    onExport
  ]);

  // Helper function to show keyboard shortcuts help
  const showKeyboardShortcutsHelp = () => {
    const message = `
KEYBOARD SHORTCUTS

Dashboard Actions:
• Ctrl + P - Print dashboard
• Ctrl + E - Open export modal

Accessibility:
• Shift + A - Toggle accessibility toolbar
• Shift + ? - Show this help

Themes:
• Shift + T - Cycle themes (Light/Dark/High-Contrast)

Font Size:
• Shift + + - Increase font size
• Shift + - - Decrease font size
• Shift + 0 - Reset font size

Preferences:
• Shift + M - Toggle reduced motion
• Shift + C - Toggle colorblind mode
• Shift + R - Reset all preferences

Navigation:
• Tab - Next interactive element
• Shift + Tab - Previous interactive element
• Enter - Activate button/link
• Space - Toggle checkbox/button
• Esc - Close dialogs/modals
    `.trim();

    alert(message);
  };

  // Helper function to announce to screen readers
  const announceToScreenReader = (message) => {
    const announcement = document.getElementById('keyboard-shortcuts-announcer');
    if (announcement) {
      announcement.textContent = message;
      // Clear after announcement
      setTimeout(() => {
        announcement.textContent = '';
      }, 2000);
    }
  };
}

// Screen reader announcer component to include in app
export function KeyboardShortcutsAnnouncer() {
  return (
    <div
      id="keyboard-shortcuts-announcer"
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className="sr-only"
    />
  );
}

export default useKeyboardShortcuts;

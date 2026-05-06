export type ShortcutCategory = 'docs' | 'slides' | 'sheets' | 'chrome';

export interface Shortcut {
  id: string;
  action: string;
  keys: string[];
  description: string;
  category: ShortcutCategory;
}

export const shortcuts: Shortcut[] = [
  // Google Docs
  { id: 'docs-1', action: 'Copy', keys: ['Ctrl', 'C'], description: 'Copy selected text or objects.', category: 'docs' },
  { id: 'docs-2', action: 'Paste', keys: ['Ctrl', 'V'], description: 'Paste copied text or objects.', category: 'docs' },
  { id: 'docs-3', action: 'Undo', keys: ['Ctrl', 'Z'], description: 'Undo your last action.', category: 'docs' },
  { id: 'docs-4', action: 'Bold', keys: ['Ctrl', 'B'], description: 'Make text bold.', category: 'docs' },
  { id: 'docs-5', action: 'Italic', keys: ['Ctrl', 'I'], description: 'Make text italic.', category: 'docs' },
  { id: 'docs-6', action: 'Underline', keys: ['Ctrl', 'U'], description: 'Underline text.', category: 'docs' },
  
  // Google Slides
  { id: 'slides-1', action: 'New Slide', keys: ['Ctrl', 'M'], description: 'Add a new slide to your presentation.', category: 'slides' },
  { id: 'slides-2', action: 'Present', keys: ['Ctrl', 'Enter'], description: 'Start presenting from the current slide.', category: 'slides' },
  { id: 'slides-3', action: 'Duplicate', keys: ['Ctrl', 'D'], description: 'Duplicate the selected object or slide.', category: 'slides' },
  
  // Google Sheets
  { id: 'sheets-1', action: 'Select All', keys: ['Ctrl', 'A'], description: 'Select all cells in the sheet.', category: 'sheets' },
  { id: 'sheets-2', action: 'Fill Down', keys: ['Ctrl', 'D'], description: 'Fill the selected cells with the content of the top cell.', category: 'sheets' },
  { id: 'sheets-3', action: 'Find', keys: ['Ctrl', 'F'], description: 'Find text within the sheet.', category: 'sheets' },
  
  // Chrome / General
  { id: 'chrome-1', action: 'New Tab', keys: ['Ctrl', 'T'], description: 'Open a new browser tab.', category: 'chrome' },
  { id: 'chrome-2', action: 'Close Tab', keys: ['Ctrl', 'W'], description: 'Close the current tab.', category: 'chrome' },
  { id: 'chrome-3', action: 'Reopen Tab', keys: ['Ctrl', 'Shift', 'T'], description: 'Reopen the last closed tab.', category: 'chrome' },
];

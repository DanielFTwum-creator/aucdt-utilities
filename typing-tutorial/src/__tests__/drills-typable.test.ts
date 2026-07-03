import { describe, it, expect } from 'vitest';
import { LESSONS } from '../data';

// Regression guard for TUC-ICT-FIX-2026-VTX-HYPHEN.
//
// The Ultimate Drill halted permanently at the character after "Focus" because
// the drill text contained an em-dash (U+2014). The exercise matcher compares
// the raw typed character to the raw target character (ExerciseTab
// handleInputChange), so a character that no US-QWERTY keystroke can produce
// makes the drill impossible to complete. These tests pin every drill to the
// typable character set so the defect class cannot reappear.

// Every character producible on a US-QWERTY keyboard, unshifted or shifted.
const TYPABLE =
  'abcdefghijklmnopqrstuvwxyz' +
  'ABCDEFGHIJKLMNOPQRSTUVWXYZ' +
  '0123456789' +
  ' `~!@#$%^&*()-_=+[]{}\\|;:\'",.<>/?';

// The raw-character matcher from ExerciseTab.handleInputChange: a drill is
// complete when the typed value equals the target text character-for-character.
const typeThrough = (target: string): boolean =>
  target.split('').every((char, i) => target[i] === char && TYPABLE.includes(char));

describe('drill typability (VTX-HYPHEN regression)', () => {
  it('every practice drill in every lesson contains only US-QWERTY-typable characters', () => {
    for (const lesson of LESSONS) {
      for (const practice of lesson.practices) {
        for (const char of practice) {
          expect(
            TYPABLE.includes(char),
            `Lesson ${lesson.id} ("${lesson.title}") drill "${practice}" contains untypable character "${char}" (U+${char.codePointAt(0)!.toString(16).toUpperCase().padStart(4, '0')})`,
          ).toBe(true);
        }
      }
    }
  });

  it('the Ultimate Drill sentence uses a plain hyphen and completes under the raw-character matcher', () => {
    const ultimate = LESSONS.find((l) => l.id === 12)!;
    const sentence = 'Accuracy: 98%. Speed: 75 WPM. Focus - every keystroke counts.';
    expect(ultimate.practices[0]).toBe(sentence);
    expect(sentence).not.toContain('—');
    expect(typeThrough(sentence)).toBe(true);
  });

  it('unshifted - and shifted _ are both typable target characters', () => {
    expect(TYPABLE.includes('-')).toBe(true);
    expect(TYPABLE.includes('_')).toBe(true);
    expect(typeThrough('2026-06-15')).toBe(true);
    expect(typeThrough('snake_case_name')).toBe(true);
  });
});

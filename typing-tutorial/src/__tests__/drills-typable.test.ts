import { describe, it, expect } from 'vitest';
import { LESSONS, GAME_WORDS, REFERENCE_SPEEDTEXTS } from '../data';

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
  it('every practice drill in every lesson and difficulty pool contains only typable characters', () => {
    for (const lesson of LESSONS) {
      // Lessons with an inputMap extend the typable set with the mapped outputs
      // (e.g. Ghanaian-language characters produced via 3 / ) / q).
      const mapped = Object.values(lesson.inputMap ?? {});
      const pools = {
        beginner: lesson.practices,
        intermediate: lesson.practicesIntermediate ?? [],
        advanced: lesson.practicesAdvanced ?? [],
      };
      for (const [pool, drills] of Object.entries(pools)) {
        for (const practice of drills) {
          for (const char of practice) {
            expect(
              TYPABLE.includes(char) || mapped.includes(char),
              `Lesson ${lesson.id} ("${lesson.title}") ${pool} drill "${practice}" contains untypable character "${char}" (U+${char.codePointAt(0)!.toString(16).toUpperCase().padStart(4, '0')})`,
            ).toBe(true);
          }
        }
      }
    }
  });

  it('Ghanaian Extra Honours lesson maps every special character to a US-QWERTY source key', () => {
    const ghana = LESSONS.find((l) => l.id === 13)!;
    expect(ghana.inputMap).toBeDefined();
    // Every source key must itself be typable on a US keyboard.
    for (const key of Object.keys(ghana.inputMap!)) {
      expect(TYPABLE.includes(key), `inputMap source "${key}" is not typable`).toBe(true);
    }
    // The map covers exactly the Ghanaian characters used by the drills.
    expect(ghana.inputMap).toEqual({ '3': '\u025b', ')': '\u0254', 'q': '\u014b' });
    const allDrills = [...ghana.practices, ...(ghana.practicesIntermediate ?? []), ...(ghana.practicesAdvanced ?? [])];
    const specials = new Set<string>();
    for (const drill of allDrills) for (const c of drill) if (!TYPABLE.includes(c)) specials.add(c);
    for (const c of specials) {
      expect(Object.values(ghana.inputMap!).includes(c), `Drill character "${c}" has no inputMap source`).toBe(true);
    }
    // Source keys must not appear literally in the drills (they would be transformed away).
    for (const drill of allDrills) {
      for (const key of Object.keys(ghana.inputMap!)) {
        expect(drill.includes(key), `Drill "${drill}" contains raw source key "${key}"`).toBe(false);
      }
    }
  });

  it('every lesson offers all three difficulty pools with four drills each', () => {
    for (const lesson of LESSONS) {
      expect(lesson.practices.length, `Lesson ${lesson.id} beginner pool`).toBe(4);
      expect(lesson.practicesIntermediate?.length, `Lesson ${lesson.id} intermediate pool`).toBe(4);
      expect(lesson.practicesAdvanced?.length, `Lesson ${lesson.id} advanced pool`).toBe(4);
    }
  });

  it('the game word bank is lowercase a-z, duplicate-free, and typable', () => {
    const seen = new Set<string>();
    for (const word of GAME_WORDS) {
      expect(/^[a-z]+$/.test(word), `GAME_WORDS entry "${word}" is not lowercase a-z`).toBe(true);
      expect(seen.has(word), `GAME_WORDS entry "${word}" is duplicated`).toBe(false);
      seen.add(word);
    }
  });

  it('every speed-test reference text is typable', () => {
    for (const text of REFERENCE_SPEEDTEXTS) {
      for (const char of text) {
        expect(
          TYPABLE.includes(char),
          `Speed text "${text.slice(0, 40)}..." contains untypable character "${char}"`,
        ).toBe(true);
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

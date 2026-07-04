# Lesson 13 (Ghanaian Languages, Extra Honours): Native-Speaker Review Sheet

> For a Twi (Asante) speaker, plus one Ewe item set. Drills were authored for
> typing practice, not by a native speaker. Please correct spelling, word choice
> and naturalness. All drills are deliberately lowercase; tones are unmarked,
> which follows common informal practice. Special letters used: ɛ, ɔ, ŋ.
>
> Source of truth: `typing-tutorial/src/data.ts`, lesson id 13. Any correction
> must keep to these characters: a-z, space, comma, full stop, semicolon, ɛ ɔ ŋ.

## Beginner drills (single words)

| # | Drill | Intended meaning |
|---|---|---|
| 1 | ɛyɛ ɔdɔ aane daabi | it is good / love / yes / no |
| 2 | nsuo aduane ɔman papa | water / food / nation / good |
| 3 | akwaaba medaase ɔhene | welcome / thank you / chief |
| 4 | ɛnnɛ ɔkyena ɔbaa kɛseɛ | today / tomorrow / woman / big |

## Intermediate drills (short phrases)

| # | Drill | Intended meaning |
|---|---|---|
| 1 | ɛte sɛn; me ho yɛ | how is it?; I am fine |
| 2 | me dɔ wo; mepa wo kyɛw | I love you; please |
| 3 | nante yie; yɛbɛhyia bio | walk well (goodbye); we shall meet again |
| 4 | woezɔ; ŋdi nyuie; akpe | (Ewe) welcome; good morning; thank you |

## Advanced drills (sentences)

| # | Drill | Intended meaning |
|---|---|---|
| 1 | mepa wo kyɛw, ma me nsuo ne aduane. | please, give me water and food. |
| 2 | ɛnnɛ yɛ ɛda pa; me ho yɛ, meda wo ase. | today is a good day; I am fine, thank you. |
| 3 | ɔhene ne ɔhemmaa bɛba dwabɔ no ase ɔkyena. | the chief and the queen mother will come to the durbar grounds tomorrow. |
| 4 | woezɔ loo; ŋdi nyuie; yɛbɛhyia bio, nante yie. | (Ewe + Twi) welcome; good morning; we shall meet again, goodbye. |

## Questions for the reviewer

1. Spelling per standard Akan orthography: kɛseɛ (Asante) or kɛse? ɛnnɛ for
   "today"? meda wo ase vs medaase spacing?
2. Advanced drill 3: is "dwabɔ no ase" the right way to say the durbar
   grounds, and is the sentence natural?
3. Ewe items: woezɔ, ŋdi nyuie, akpe, and the emphatic woezɔ loo. Correct
   spelling with ɛ/ɔ/ŋ as printed?
4. Is mixing Twi and Ewe inside one drill acceptable for a typing exercise,
   or should Ewe get its own drill line only?
5. The game word bank (`GAME_WORDS` in the same file) added Akan day names
   (kwame, akosua, ...) and culture words (kenkey, fontomfrom, hogbetsotso,
   ...). A skim for misspellings would be valuable.

## How to apply corrections

Edit the drills in `typing-tutorial/src/data.ts` (lesson id 13). The test
suite pins the character set automatically: run
`pnpm exec vitest run` inside `C:\Development\github\aucdt-utilities\typing-tutorial`
after editing; the typability tests fail on any character outside the allowed
set, so corrections cannot silently break the lesson.

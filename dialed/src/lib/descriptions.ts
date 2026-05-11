export const roundScoreDescriptions = [
  { max: 0.0, text: ["Did you even look at the screen?", "Zero. Literally zero. That takes talent."] },
  { max: 2.0, text: ["Your recall has the precision of a sneeze.", "Two seconds of looking. Zero seconds of remembering."] },
  { max: 4.0, text: ["Violently average.", "Peak mediocrity. You’ve arrived."] },
  { max: 6.0, text: ["Getting somewhere. Don’t get excited — slowly.", "Six out of ten. The gentleman’s C of color."] },
  { max: 8.0, text: ["Be honest. Did you cheat?", "Your visual cortex just flexed."] },
  { max: 9.5, text: ["Were you even blinking? Blink. Please blink.", "You stared at that color like you were trying to absorb it. It worked."] },
  { max: 10.0, text: ["Perfect. Literally perfect. We have questions.", "Are you a Pantone swatch in human form? Seek help."] },
];

export const totalScoreDescriptions = [
  { max: 10, text: ["You didn’t play the game. The game played you.", "Ten points. That’s two per round. Think about that."] },
  { max: 25, text: ["Painfully average. The human beige of performance.", "Halfway to perfect. Which means halfway to zero."] },
  { max: 40, text: ["Okay, you’re not terrible. Don’t let it go to your head.", "Competent. The most boring compliment in the English language."] },
  { max: 48, text: ["Alright, we see you. Don’t make it weird.", "Your color memory is annoyingly sharp."] },
  { max: 50, text: ["Perfect score. You’ve peaked. It’s all downhill from here.", "Fifty out of fifty. Either you’re inhuman or you cheated."] },
];

export function getRoundDescription(score: number): string {
  const desc = roundScoreDescriptions.find(d => score <= d.max) || roundScoreDescriptions[roundScoreDescriptions.length - 1];
  return desc.text[Math.floor(Math.random() * desc.text.length)];
}

export function getTotalDescription(score: number, maxScore: number): string {
  const normalized = (score / maxScore) * 50;
  const desc = totalScoreDescriptions.find(d => normalized <= d.max) || totalScoreDescriptions[totalScoreDescriptions.length - 1];
  return desc.text[Math.floor(Math.random() * desc.text.length)];
}

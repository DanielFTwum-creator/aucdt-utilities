
/**
 * Generates all combinations of the input array elements.
 * Equivalent to Python's itertools.combinations for all lengths from 1 to N.
 */
export function generateCombinations<T>(items: T[]): T[][] {
  const results: T[][] = [];

  // Helper function to generate combinations of a specific length k
  function combine(start: number, k: number, current: T[]) {
    if (current.length === k) {
      results.push([...current]);
      return;
    }

    for (let i = start; i < items.length; i++) {
      current.push(items[i]);
      combine(i + 1, k, current);
      current.pop();
    }
  }

  // Generate combinations for all lengths from 1 to items.length
  for (let k = 1; k <= items.length; k++) {
    combine(0, k, []);
  }

  return results;
}

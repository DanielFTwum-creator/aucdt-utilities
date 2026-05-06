// Returns hours behind UTC for Eastern Time (4 = EDT, 5 = EST)
function etOffsetHours(): number {
  const now = new Date();
  const y = now.getFullYear();
  // DST start: second Sunday in March
  const mar1 = new Date(y, 2, 1);
  const dstStart = new Date(y, 2, 1 + ((7 - mar1.getDay()) % 7) + 7);
  // DST end: first Sunday in November
  const nov1 = new Date(y, 10, 1);
  const dstEnd = new Date(y, 10, 1 + ((7 - nov1.getDay()) % 7));
  return now >= dstStart && now < dstEnd ? 4 : 5;
}

// Returns the UTC timestamp of the most recent NYSE market open (9:30 AM ET).
// Rolls back through weekends. No holiday calendar (MVP).
export function lastMarketOpen(): Date {
  const offset = etOffsetHours();
  const now = new Date();

  // Build today's 9:30 AM ET as UTC
  const candidate = new Date(Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate(),
    9 + offset,
    30,
    0,
    0,
  ));

  // If we haven't reached today's open yet, step back one day
  let d = now >= candidate ? candidate : new Date(candidate.getTime() - 86_400_000);

  // Roll back through Sat (6) and Sun (0)
  let guard = 0;
  while ((d.getUTCDay() === 0 || d.getUTCDay() === 6) && guard < 7) {
    d = new Date(d.getTime() - 86_400_000);
    guard++;
  }

  return d;
}

// SQLite datetime('now') produces 'YYYY-MM-DD HH:MM:SS' (UTC, no indicator).
// Force UTC parsing so behaviour is consistent across environments.
// Handles undefined/null gracefully — returns epoch (always before last market open).
function parseCreatedAt(s: string | undefined | null): Date {
  if (!s) return new Date(0);
  return new Date(s.includes('T') ? s : s.replace(' ', 'T') + 'Z');
}

// Returns true if the position was created after the last market open,
// meaning day-gain data would mislead the user.
export function isAddedToday(createdAt: string): boolean {
  return parseCreatedAt(createdAt) >= lastMarketOpen();
}

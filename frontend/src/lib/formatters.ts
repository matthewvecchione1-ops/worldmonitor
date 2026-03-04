/**
 * Format a number with commas: 1847 → "1,847"
 */
export function formatNumber(n: number): string {
  return n.toLocaleString();
}

/**
 * Format a percentage change with sign: 12 → "+12", -2 → "-2"
 */
export function formatChange(n: number | null): string {
  if (n === null) return '';
  return n >= 0 ? `+${n}` : `${n}`;
}

/**
 * Format a price with 2 decimal places
 */
export function formatPrice(n: number): string {
  return n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

/**
 * Return a relative time label: "2h ago", "just now"
 */
export function timeAgo(isoString: string): string {
  const diff = Date.now() - new Date(isoString).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

/**
 * Format UTC clock time: "14:32:09 UTC"
 */
export function formatUTCClock(date: Date): string {
  return date.toUTCString().slice(17, 25) + ' UTC';
}

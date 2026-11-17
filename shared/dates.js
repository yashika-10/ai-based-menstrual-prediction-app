// Date helpers that operate on calendar dates ("YYYY-MM-DD") instead of
// timestamps, so daylight-saving shifts and time zones never change a day count.

const DAY_MS = 86400000;
const ISO_RE = /^\d{4}-\d{2}-\d{2}$/;

export function isISODate(value) {
  if (typeof value !== "string" || !ISO_RE.test(value)) return false;
  const [y, m, d] = value.split("-").map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  return date.getUTCFullYear() === y && date.getUTCMonth() === m - 1 && date.getUTCDate() === d;
}

export function toDayNumber(iso) {
  const [y, m, d] = iso.split("-").map(Number);
  return Math.round(Date.UTC(y, m - 1, d) / DAY_MS);
}

export function fromDayNumber(n) {
  return new Date(n * DAY_MS).toISOString().slice(0, 10);
}

export function addDays(iso, days) {
  return fromDayNumber(toDayNumber(iso) + days);
}

/** Whole days from a to b (b - a). */
export function diffDays(a, b) {
  return toDayNumber(b) - toDayNumber(a);
}

/** Today's date in the user's local time zone. */
export function todayISO(now = new Date()) {
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function inRange(iso, start, end) {
  return iso >= start && iso <= end;
}

export function monthKey(iso) {
  return iso.slice(0, 7);
}

/** ISO week start (Monday) for a date. */
export function weekStart(iso) {
  const n = toDayNumber(iso);
  const weekday = (new Date(n * DAY_MS).getUTCDay() + 6) % 7; // Monday = 0
  return fromDayNumber(n - weekday);
}

export function compareISO(a, b) {
  return a < b ? -1 : a > b ? 1 : 0;
}

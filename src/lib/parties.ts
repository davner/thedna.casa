export const newestFirst = <T extends { data: { year: number } }>(parties: readonly T[]): T[] =>
  [...parties].sort((a, b) => b.data.year - a.data.year);

// FNV-1a over the file name, so a photo keeps its outline when the folder moves or other photos come and go.
export const photoSeed = (path: string): number => {
  const name = path.split("/").at(-1) ?? path;
  let hash = 0x811c9dc5;
  for (const char of name) hash = Math.imul(hash ^ char.codePointAt(0)!, 0x01000193) >>> 0;
  return hash;
};

// A party file's bare date is midnight UTC, so formatting in UTC keeps the calendar day in every time zone.
const inUtc = (options: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat("en-US", { ...options, timeZone: "UTC" });
const long = inUtc({ weekday: "long", month: "long", day: "numeric", year: "numeric" });
const short = inUtc({ weekday: "short", month: "short", day: "numeric" });

export const partyDate = (date: Date) => ({
  datetime: date.toISOString().slice(0, 10),
  long: long.format(date),
  short: short.format(date),
});

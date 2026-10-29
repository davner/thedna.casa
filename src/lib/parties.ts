export const newestFirst = <T extends { data: { year: number } }>(parties: readonly T[]): T[] =>
  [...parties].sort((a, b) => b.data.year - a.data.year);

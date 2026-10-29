export const newestFirst = <T extends { data: { year: number } }>(parties: readonly T[]): T[] =>
  [...parties].sort((a, b) => b.data.year - a.data.year);

// FNV-1a over the file name, so a photo keeps its petal when the folder moves or other photos come and go.
export const petalSeed = (path: string): number => {
  const name = path.split("/").at(-1) ?? path;
  let hash = 0x811c9dc5;
  for (const char of name) hash = Math.imul(hash ^ char.codePointAt(0)!, 0x01000193) >>> 0;
  return hash;
};

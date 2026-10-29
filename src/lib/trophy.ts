type Winner = { names: string; costume: string };
type Party = { data: { year: number; contest?: { winners: Winner[] } } };
export type Plate = { year: number; names: string; costume: string };

// The real plates drop the "from ..." source and start with a capital, like "Queen of Hearts".
const engraved = (costume: string) => {
  const bare = costume.split(", from ")[0];
  return bare.charAt(0).toUpperCase() + bare.slice(1);
};

// There was no party in 2025, so the trophy gives the year to the only guest who showed up.
const skipped: Party[] = [
  { data: { year: 2025, contest: { winners: [{ names: "Life", costume: "The Party Pooper" }] } } },
];

export const plates = (parties: readonly Party[]): Plate[] =>
  [...parties, ...skipped.filter((s) => !parties.some((p) => p.data.year === s.data.year))]
    .sort((a, b) => a.data.year - b.data.year)
    .flatMap(({ data }) =>
      (data.contest?.winners ?? []).map((w) => ({
        year: data.year,
        names: w.names.toUpperCase(),
        costume: engraved(w.costume),
      })),
    );

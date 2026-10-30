// A 4:5 photo in a two-column row beside its words: 288px wide on phones and 448px from md. It ships at both widths
// and twice each, so a phone never downloads the 2x desktop file.
export const photoBesideWords = {
  width: 896,
  height: 1120,
  widths: [288, 448, 576, 896],
  sizes: "(max-width: 767px) 288px, 448px",
};

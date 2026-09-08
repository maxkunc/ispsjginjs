// The "LED Dots" font (led_counter-7.ttf) doesn't have glyphs for Czech
// caron letters - confirmed via its cmap: č ď ě ň ř ť ů (and uppercase) are
// missing, while á é í ó ú ý š ž are present. A missing glyph makes the
// browser fall back to a different font for just that character, breaking
// the dot-matrix look mid-word. Drop the diacritic on exactly the letters
// the font can't render instead, so text stays in one consistent font.
const DOT_FONT_FALLBACK = {
  č: 'c', ď: 'd', ě: 'e', ň: 'n', ř: 'r', ť: 't', ů: 'u',
  Č: 'C', Ď: 'D', Ě: 'E', Ň: 'N', Ř: 'R', Ť: 'T', Ů: 'U',
}

export function toDotFontSafe(text) {
  if (text === null || text === undefined) return text
  return String(text).replace(/[čďěňřťůČĎĚŇŘŤŮ]/g, (ch) => DOT_FONT_FALLBACK[ch])
}

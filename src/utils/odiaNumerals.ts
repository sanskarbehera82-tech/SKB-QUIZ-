/**
 * Odia Numerals and Label Helpers
 */

const ODIA_DIGITS = ['୦', '୧', '୨', '୩', '୪', '୫', '୬', '୭', '୮', '୯'];

export function toOdiaNumber(num: number | string): string {
  return String(num).replace(/[0-9]/g, (digit) => ODIA_DIGITS[parseInt(digit, 10)] || digit);
}

export const OPTION_PREFIXES = [
  { odia: 'କ', en: 'A' },
  { odia: 'ଖ', en: 'B' },
  { odia: 'ଗ', en: 'C' },
  { odia: 'ଘ', en: 'D' },
];

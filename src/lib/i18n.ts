/**
 * Thin wrapper around chrome.i18n.getMessage.
 * Usage: t('pickAColor')  →  "Pick a Color" / "Вибрати Колір" / etc.
 *
 * For strings with substitutions:
 *   t('percentMatch', '94')   →  "94% match"
 *   t('colorsFound', '12')    →  "12 colors found"
 */
export function t(key: string, ...substitutions: string[]): string {
  return chrome.i18n.getMessage(key, substitutions) || key;
}

/**
 * DETARA brand constants — SINGLE SOURCE OF TRUTH.
 *
 * If the logo file ever changes, update ONLY `LOGO_SRC` here.
 * Header, mobile menu, footer, favicon, OG image, and JSON-LD Organization
 * schema all reference these values.
 */

export const BRAND_NAME = 'DETARA';
export const BRAND_LEGAL_NAME = 'DETARA LTD';
export const BRAND_TAGLINE = 'European Diamond Jewellery';

// The canonical DETARA wordmark file. Update this ONE line to change the logo everywhere.
export const LOGO_SRC =
  '/assets/images/file_000000004f747208abb644f0cadec060-1773492339421.png';

// Native pixel dimensions of the wordmark — used by <Image> for aspect-ratio.
export const LOGO_NATIVE_WIDTH = 1600;
export const LOGO_NATIVE_HEIGHT = 550;

// Absolute URL builder for OG / JSON-LD (schemas want fully-qualified URLs).
export function absoluteLogoUrl(baseUrl: string): string {
  const trimmed = baseUrl.replace(/\/$/, '');
  return `${trimmed}${LOGO_SRC}`;
}

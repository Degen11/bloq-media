import type { IconName } from '@lib/icons';

// Single source for contact details, social profiles, and homepage sections,
// shared by the navbar, footer, contact form, legal pages, JSON-LD and API.

export const SITE_NAME = 'BLOQ Media';

/** Public inbox shown on the site and in structured data. */
export const CONTACT_EMAIL = 'hello@bloq.media';
/** Team inbox for privacy/legal requests; also CC'd on contact form submissions. */
export const TEAM_EMAIL = 'degen@bloq.media';

export const TWITTER_HANDLE = '@_BLOQMedia';

/** Brand colors for places that can't read the Tailwind theme (e.g. the OG image). Keep in sync with `@theme` in global.css. */
export const BRAND = {
  blue: '#29ABE2',
  navy: '#1A3C8F',
  dark: '#0F2260',
} as const;

export interface Social {
  label: string;
  href: string;
  icon: IconName;
}

export const MEDIUM_URL = 'https://medium.com/@bloqmedia';

export const socials: Social[] = [
  { label: 'X / Twitter', href: 'https://x.com/_BLOQMedia', icon: 'x' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/company/bloq-media/', icon: 'linkedin' },
  { label: 'Medium', href: MEDIUM_URL, icon: 'medium' },
];

export interface SiteSection {
  id: string;
  label: string;
}

/** Homepage sections linked from the navbar and footer, top to bottom. */
export const sections: SiteSection[] = [
  { id: 'about', label: 'About' },
  { id: 'why', label: 'Why BLOQ' },
  { id: 'services', label: 'Services' },
  { id: 'articles', label: 'Articles' },
  { id: 'clients', label: 'Clients' },
];

export const CONTACT_SECTION_ID = 'contact';

/**
 * Link to a homepage section. Section anchors only exist on `/`, so other
 * pages (privacy, terms, 404) need the "/" prefix or the link goes nowhere.
 */
export function sectionHref(id: string, pathname: string): string {
  return `${pathname === '/' ? '' : '/'}#${id}`;
}

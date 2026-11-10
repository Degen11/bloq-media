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

/**
 * Every homepage section anchor id. Section components set their `id` from
 * here and every `#anchor` link is built from it with `sectionHref()`, so a
 * rename can't leave a link or the scroll-spy pointing at nothing.
 */
export const SECTION_IDS = {
  about: 'about',
  why: 'why',
  services: 'services',
  articles: 'articles',
  clients: 'clients',
  contact: 'contact',
} as const;

export type SectionId = (typeof SECTION_IDS)[keyof typeof SECTION_IDS];

export interface SiteSection {
  id: SectionId;
  label: string;
}

/** Homepage sections linked from the navbar and footer, top to bottom. */
export const sections: SiteSection[] = [
  { id: SECTION_IDS.about, label: 'About' },
  { id: SECTION_IDS.why, label: 'Why BLOQ' },
  { id: SECTION_IDS.services, label: 'Services' },
  { id: SECTION_IDS.articles, label: 'Articles' },
  { id: SECTION_IDS.clients, label: 'Clients' },
];

export const CONTACT_SECTION_ID = SECTION_IDS.contact;

/**
 * Link to a homepage section. Section anchors only exist on `/`, so other
 * pages (privacy, terms, 404) need the "/" prefix or the link goes nowhere.
 */
export function sectionHref(id: string, pathname: string): string {
  return `${pathname === '/' ? '' : '/'}#${id}`;
}

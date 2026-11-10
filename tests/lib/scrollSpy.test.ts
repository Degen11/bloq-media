/**
 * Navbar scroll behavior: which section the scroll-spy highlights, when the
 * header gets its shadow, and when scrolling closes the mobile menu.
 */
import { describe, expect, it } from 'vitest';
import {
  getActiveSection,
  isHeaderScrolled,
  shouldCloseMenuOnScroll,
  SPY_BUFFER,
} from '@lib/scrollSpy';
import { CONTACT_SECTION_ID, SECTION_IDS } from '@lib/site';

const NAV = 72;

// Page order on /: Clients sits right under the hero, then About, Why BLOQ,
// Services, Articles and Contact. The nav lists Clients last.
const page = [
  { id: SECTION_IDS.about, top: 1100 },
  { id: SECTION_IDS.why, top: 1900 },
  { id: SECTION_IDS.services, top: 2700 },
  { id: SECTION_IDS.articles, top: 3500 },
  { id: SECTION_IDS.clients, top: 800 },
  { id: CONTACT_SECTION_ID, top: 4300 },
];

// scrollY at which a section's top lines up with the activation line
const reach = (top: number) => top - NAV - SPY_BUFFER;

describe('getActiveSection', () => {
  it('highlights nothing while the hero is on screen', () => {
    expect(getActiveSection(page, 0, NAV)).toBe('');
  });

  it('highlights Clients first even though it is listed last', () => {
    expect(getActiveSection(page, reach(800), NAV)).toBe(SECTION_IDS.clients);
  });

  it('activates a section exactly when its top reaches navbar bottom plus the buffer', () => {
    expect(getActiveSection(page, reach(1100) - 1, NAV)).toBe(SECTION_IDS.clients);
    expect(getActiveSection(page, reach(1100), NAV)).toBe(SECTION_IDS.about);
  });

  it('picks the lowest section that has crossed the line, not the first in the list', () => {
    expect(getActiveSection(page, reach(2700) + 200, NAV)).toBe(SECTION_IDS.services);
  });

  it('switches to contact over the form, so no nav link stays highlighted', () => {
    expect(getActiveSection(page, reach(4300), NAV)).toBe(CONTACT_SECTION_ID);
  });

  it('accounts for the taller desktop navbar', () => {
    const y = 1100 - 60 - SPY_BUFFER; // reaches About with a 60 px navbar…
    expect(getActiveSection(page, y, 60)).toBe(SECTION_IDS.about);
    expect(getActiveSection(page, y - 12, 72)).toBe(SECTION_IDS.about); // …and a 72 px one
    expect(getActiveSection(page, y - 13, 72)).toBe(SECTION_IDS.clients);
  });

  it('skips sections that are missing from the page', () => {
    expect(getActiveSection([], 5000, NAV)).toBe('');
  });
});

describe('isHeaderScrolled', () => {
  it('adds the shadow only after 10 px of scroll', () => {
    expect(isHeaderScrolled(0)).toBe(false);
    expect(isHeaderScrolled(10)).toBe(false);
    expect(isHeaderScrolled(11)).toBe(true);
  });
});

describe('shouldCloseMenuOnScroll', () => {
  it('ignores address-bar jitter of up to 40 px either way', () => {
    expect(shouldCloseMenuOnScroll(500, 540)).toBe(false);
    expect(shouldCloseMenuOnScroll(500, 460)).toBe(false);
  });

  it('closes the menu once the page scrolls further than 40 px from where it opened', () => {
    expect(shouldCloseMenuOnScroll(500, 541)).toBe(true);
    expect(shouldCloseMenuOnScroll(500, 459)).toBe(true);
  });
});

// Pure helpers behind the navbar's scroll behavior (Navbar.astro), kept out of
// the component so they can be unit-tested without a browser.

/** Extra buffer so a link activates just before its section reaches the navbar. */
export const SPY_BUFFER = 32;
/** Scroll distance after which the header gets its shadow. */
export const HEADER_SHADOW_AFTER = 10;
/** Scroll distance from where the mobile menu opened that closes it. */
export const MENU_CLOSE_SCROLL = 40;

export interface SectionTop {
  id: string;
  /** The section's top edge in page coordinates (not viewport). */
  top: number;
}

/**
 * The id of the lowest section whose top has crossed the navbar's bottom edge
 * (plus `SPY_BUFFER`), or '' above the first section. It compares page
 * positions rather than list order, because the nav order doesn't match the
 * page order (Clients sits right under the hero but is linked last).
 */
export function getActiveSection(
  sections: readonly SectionTop[],
  scrollY: number,
  navHeight: number,
): string {
  const line = scrollY + navHeight + SPY_BUFFER;
  let active = '';
  let activeTop = -Infinity;
  for (const { id, top } of sections) {
    if (top <= line && top > activeTop) {
      active = id;
      activeTop = top;
    }
  }
  return active;
}

export const isHeaderScrolled = (scrollY: number): boolean => scrollY > HEADER_SHADOW_AFTER;

/** Small threshold so mobile address-bar jitter doesn't close the menu. */
export const shouldCloseMenuOnScroll = (openedAtY: number, scrollY: number): boolean =>
  Math.abs(scrollY - openedAtY) > MENU_CLOSE_SCROLL;

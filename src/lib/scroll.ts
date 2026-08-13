import type Lenis from "lenis";

/**
 * Holds the app's single Lenis instance so non-layout code can drive scrolling
 * through it. Calling `window.scrollTo` directly while Lenis is running makes
 * the two fight — Lenis animates back toward its own target and the jump reads
 * as a stutter — so anything that needs to move the page should come here.
 */
let instance: Lenis | null = null;

export function setLenis(next: Lenis | null) {
  instance = next;
}

export function getLenis() {
  return instance;
}

/** Jump to the top, using Lenis when it's active and the native path otherwise. */
export function scrollToTop(immediate = false) {
  if (instance) {
    instance.scrollTo(0, { immediate });
    return;
  }
  window.scrollTo({ top: 0, behavior: immediate ? "auto" : "smooth" });
}

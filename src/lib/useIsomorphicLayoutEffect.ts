import { useEffect, useLayoutEffect } from "react";

/**
 * `useLayoutEffect` warns during SSR. GSAP setup must run before paint on the
 * client, so use the layout effect in the browser and a no-op-ish effect on the
 * server.
 */
export const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

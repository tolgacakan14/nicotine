"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/** Routes that render on ink instead of paper. */
const DARK_ROUTES = ["/club"];

/**
 * Puts `.theme-dark` on <html> for the routes that want it.
 *
 * It has to sit on the root element rather than on the page, because the nav,
 * the footer and the cart drawer all live in the layout — theming only the page
 * body would leave the chrome light while the content went black.
 *
 * Every colour token reads a CSS variable (see globals.css), so this class is
 * the entire mechanism: no component needs a dark variant.
 */
export default function ThemeByRoute() {
  const pathname = usePathname();

  useEffect(() => {
    const dark = DARK_ROUTES.some((route) => pathname === route || pathname.startsWith(`${route}/`));
    document.documentElement.classList.toggle("theme-dark", dark);
  }, [pathname]);

  return null;
}

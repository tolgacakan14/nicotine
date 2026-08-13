/** Active-drop photography is normalized into a common transparent catalogue canvas. */
export function catalogImage(src: string) {
  if (!src.startsWith("/products/") || src.includes("/products/catalog/")) return src;
  return src.replace("/products/", "/products/catalog/").replace(/\.png$/i, ".webp");
}

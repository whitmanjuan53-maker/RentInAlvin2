const MURAL_FILE = /(?:^|\/)mural-[^/]+\.(?:avif|gif|jpe?g|png|webp)(?:[?#].*)?$/i;

/**
 * Keep the gallery shipped with the site as the public baseline, then retain any
 * extra manager-uploaded photos from the database. Old mural files are dropped
 * so a database row cannot put a removed image back on the public site.
 */
export function mergePublicGallery(canonical: string[], database: string[]): string[] {
  const canonicalSet = new Set(canonical);
  const combined = [
    ...canonical,
    ...database.filter((src) => canonicalSet.has(src) || !MURAL_FILE.test(src)),
  ];

  return [...new Set(combined)];
}

export function resolvePropertyGallery(canonical: string[], database: string[], managerControlled: boolean): string[] {
  const managed = [...new Set(database.filter(Boolean))];
  if (managerControlled && managed.length > 0) return managed;
  return mergePublicGallery(canonical, database);
}

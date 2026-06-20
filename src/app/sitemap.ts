import type { MetadataRoute } from 'next';

const BASE = 'https://rentinalvin.com';

// Served automatically at https://rentinalvin.com/sitemap.xml
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const routes: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'] }[] = [
    { path: '/', priority: 1.0, changeFrequency: 'weekly' },
    { path: '/es', priority: 0.8, changeFrequency: 'weekly' },
    { path: '/living-in-alvin', priority: 0.7, changeFrequency: 'monthly' },
    { path: '/vivir-en-alvin', priority: 0.6, changeFrequency: 'monthly' },
    { path: '/privacy', priority: 0.2, changeFrequency: 'yearly' },
  ];

  return routes.map((r) => ({
    url: `${BASE}${r.path}`,
    lastModified: now,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));
}

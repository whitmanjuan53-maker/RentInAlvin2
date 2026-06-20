import type { MetadataRoute } from 'next';

// Served automatically at https://rentinalvin.com/robots.txt
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/'],
      },
    ],
    sitemap: 'https://rentinalvin.com/sitemap.xml',
    host: 'https://rentinalvin.com',
  };
}

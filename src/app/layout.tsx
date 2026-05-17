import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'RentInAlvin.com | Apartments & Townhomes for Rent in Alvin, TX',
  description:
    'Managed by Yellowstone Asset Management. 150+ apartments and townhomes across 6 properties in Alvin, Texas. Rents from $890. Local family-run team. Apply online today.',
  keywords:
    'apartments in Alvin TX, rentals in Alvin TX, rent in Alvin, Alvin Texas apartments, Yellowstone Management, Kings Haven, townhomes Alvin TX',
  authors: [{ name: 'Yellowstone Asset Management' }],
  robots: 'index, follow',
  alternates: {
    canonical: 'https://rentinalvin.com',
    languages: {
      'en-US': 'https://rentinalvin.com',
      'es-US': 'https://rentinalvin.com/es',
    },
  },
  openGraph: {
    type: 'website',
    url: 'https://rentinalvin.com',
    title: 'RentInAlvin.com | Apartments & Townhomes in Alvin, TX',
    description:
      '150+ apartments and townhomes across 6 properties in Alvin, Texas. Family-run, locally maintained, rents from $890.',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RentInAlvin.com | Apartments & Townhomes in Alvin, TX',
    description: '150+ apartments and townhomes across 6 properties in Alvin, Texas. Family-run, locally maintained.',
  },
  other: {
    'geo.region': 'US-TX',
    'geo.placename': 'Alvin',
    'geo.position': '29.4238;-95.2438',
    ICBM: '29.4238, -95.2438',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Serif+Display:ital@0;1&family=Playfair+Display:ital,wght@0,400;0,500;1,400&family=EB+Garamond:ital,wght@0,400;0,500;1,400&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'RealEstateAgent',
              name: 'Yellowstone Asset Management',
              alternateName: 'RentInAlvin.com',
              url: 'https://rentinalvin.com',
              telephone: '+1-832-210-3968',
              email: 'office@yellowstone-am.com',
              priceRange: '$890-$1650',
              address: {
                '@type': 'PostalAddress',
                streetAddress: '410 S 2nd St',
                addressLocality: 'Alvin',
                addressRegion: 'TX',
                postalCode: '77511',
                addressCountry: 'US',
              },
              geo: {
                '@type': 'GeoCoordinates',
                latitude: 29.4238,
                longitude: -95.2438,
              },
              openingHoursSpecification: [
                {
                  '@type': 'OpeningHoursSpecification',
                  dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
                  opens: '09:00',
                  closes: '17:00',
                },
                {
                  '@type': 'OpeningHoursSpecification',
                  dayOfWeek: 'Saturday',
                  opens: '10:00',
                  closes: '14:00',
                  description: 'By appointment',
                },
              ],
              areaServed: [
                { '@type': 'City', name: 'Alvin' },
                { '@type': 'City', name: 'Manvel' },
                { '@type': 'City', name: 'Pearland' },
              ],
            }),
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}

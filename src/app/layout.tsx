import type { Metadata } from 'next';
import './globals.css';
import { SAME_AS } from '@/lib/data';

export const metadata: Metadata = {
  metadataBase: new URL('https://rentinalvin.com'),
  title: 'Apartments for Rent in Alvin, TX | RentInAlvin.com',
  description:
    'Find apartments and townhomes for rent in Alvin, TX at RentInAlvin.com. View availability, floor plans, amenities, photos, and location details, then contact our local leasing team to schedule a tour or apply online.',
  keywords:
    'apartments for rent in Alvin TX, rentals in Alvin TX, rent in Alvin, RentInAlvin, Alvin Texas apartments, townhomes Alvin TX, Yellowstone Management, Kings Haven, Kings Manor',
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
    siteName: 'RentInAlvin.com',
    title: 'Apartments for Rent in Alvin, TX | RentInAlvin.com',
    description:
      'Apartments and townhomes for rent in Alvin, TX. View availability, floor plans, amenities, and photos, then schedule a tour or apply online.',
    locale: 'en_US',
    images: [{ url: '/images/kings-haven/01-001-cmup.jpg', width: 1200, height: 800, alt: 'Apartments for rent in Alvin, TX — RentInAlvin.com' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Apartments for Rent in Alvin, TX | RentInAlvin.com',
    description: 'Apartments and townhomes for rent in Alvin, TX. Availability, floor plans, amenities, and photos.',
    images: ['/images/kings-haven/01-001-cmup.jpg'],
  },
  other: {
    'geo.region': 'US-TX',
    'geo.placename': 'Alvin',
    'geo.position': '29.4208044;-95.2554917',
    ICBM: '29.4208044, -95.2554917',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head suppressHydrationWarning>
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
              '@type': ['RealEstateAgent', 'LocalBusiness'],
              '@id': 'https://rentinalvin.com/#business',
              name: 'Yellowstone Asset Management',
              alternateName: 'RentInAlvin.com',
              url: 'https://rentinalvin.com',
              telephone: '+1-832-210-3968',
              email: 'office@yellowstone-am.com',
              priceRange: '$850-$1650',
              image: 'https://rentinalvin.com/images/kings-haven/01-001-cmup.jpg',
              logo: 'https://rentinalvin.com/images/kings-haven/01-001-cmup.jpg',
              hasMap: 'https://maps.google.com/?q=410+S+2nd+St+Alvin+TX+77511',
              ...(SAME_AS.length ? { sameAs: SAME_AS } : {}),
              address: {
                '@type': 'PostalAddress',
                streetAddress: '410 S 2nd Street',
                addressLocality: 'Alvin',
                addressRegion: 'TX',
                postalCode: '77511',
                addressCountry: 'US',
              },
              geo: {
                '@type': 'GeoCoordinates',
                latitude: 29.4208044,
                longitude: -95.2554917,
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
      <body suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}

import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'RentInAlvin.com | Apartments & Townhomes for Rent in Alvin, TX',
  description:
    'Managed by Yellowstone Asset Management. 150+ apartments and townhomes across 6 communities in Alvin, Texas. Rents from $890. Local family-run team. Apply online today.',
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
      '150+ apartments and townhomes across 6 communities in Alvin, Texas. Family-run, locally maintained, rents from $890.',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RentInAlvin.com | Apartments & Townhomes in Alvin, TX',
    description: '150+ apartments and townhomes across 6 communities in Alvin, Texas. Family-run, locally maintained.',
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
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                var extRe = /^(__processed_|bis_)/;

                /* 1. Block extensions from adding attributes */
                var origSetAttribute = Element.prototype.setAttribute;
                Element.prototype.setAttribute = function(name, value) {
                  if (extRe.test(name)) return;
                  return origSetAttribute.call(this, name, value);
                };
                if (Element.prototype.setAttributeNS) {
                  var origSetAttributeNS = Element.prototype.setAttributeNS;
                  Element.prototype.setAttributeNS = function(ns, name, value) {
                    if (extRe.test(name)) return;
                    return origSetAttributeNS.call(this, ns, name, value);
                  };
                }

                /* 2. Strip any attributes already injected */
                function clean(el) {
                  if (!el || !el.attributes) return;
                  var attrs = el.attributes;
                  for (var i = attrs.length - 1; i >= 0; i--) {
                    if (extRe.test(attrs[i].name)) el.removeAttribute(attrs[i].name);
                  }
                }
                var all = document.getElementsByTagName('*');
                for (var i = 0; i < all.length; i++) clean(all[i]);
                if (typeof MutationObserver !== 'undefined') {
                  new MutationObserver(function(list) {
                    for (var i = 0; i < list.length; i++) {
                      var rec = list[i];
                      if (rec.type === 'attributes') clean(rec.target);
                      else if (rec.type === 'childList') {
                        for (var j = 0; j < rec.addedNodes.length; j++) {
                          var n = rec.addedNodes[j];
                          if (n.nodeType === 1) {
                            clean(n);
                            var c = n.getElementsByTagName ? n.getElementsByTagName('*') : [];
                            for (var k = 0; k < c.length; k++) clean(c[k]);
                          }
                        }
                      }
                    }
                  }).observe(document.documentElement, {
                    attributes: true,
                    childList: true,
                    subtree: true,
                  });
                }

                /* 3. Suppress extension-caused hydration console noise */
                var origError = console.error;
                console.error = function() {
                  var args = Array.prototype.slice.call(arguments);
                  var fullMsg = args.map(function(a) {
                    if (typeof a === 'string') return a;
                    if (a instanceof Error) return a.message || a.toString() || '';
                    try { return JSON.stringify(a); } catch(e) { return ''; }
                  }).join(' ');
                  if ((/hydrat|Hydrat|server rendered HTML|did not match|Tree.*hydrated/i).test(fullMsg) &&
                      (/bis_|__processed_|extension|inpage/i).test(fullMsg)) {
                    return;
                  }
                  origError.apply(console, args);
                };
              })();
            `,
          }}
        />
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
      <body>
        {children}
      </body>
    </html>
  );
}

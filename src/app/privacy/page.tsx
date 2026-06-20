import type { Metadata } from 'next';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import { PALETTES } from '@/lib/data';

const p = PALETTES.forest;
const displayFont = 'Instrument Serif';

export const metadata: Metadata = {
  title: 'Privacy Policy | RentInAlvin.com',
  description:
    'How RentInAlvin.com and Yellowstone Asset Management collect, use, and protect your information when you tour, apply for, or rent an apartment in Alvin, TX.',
  robots: 'index, follow',
  alternates: { canonical: 'https://rentinalvin.com/privacy' },
};

export default function PrivacyPage() {
  const h2: React.CSSProperties = {
    fontFamily: `'${displayFont}', serif`,
    fontSize: 28,
    color: p.ink,
    marginTop: 40,
    marginBottom: 12,
    fontWeight: 400,
  };
  const para: React.CSSProperties = { fontSize: 16, lineHeight: 1.7, color: p.inkSoft, marginBottom: 14 };

  return (
    <div style={{ background: p.bg, minHeight: '100vh' }}>
      <Nav p={p} locale="en" />
      <main style={{ maxWidth: 820, margin: '0 auto', padding: '160px var(--pad-x) 80px' }}>
        <h1 style={{ fontFamily: `'${displayFont}', serif`, fontSize: 'clamp(40px, 6vw, 64px)', lineHeight: 1.05, color: p.ink, fontWeight: 400, margin: 0 }}>
          Privacy Policy
        </h1>
        <p style={{ ...para, marginTop: 20 }}>
          Last updated: June 2026. This Privacy Policy explains how Yellowstone Asset Management
          (&ldquo;we,&rdquo; &ldquo;us&rdquo;), operator of RentInAlvin.com, handles information you
          provide when you tour, apply for, or rent an apartment or townhome in Alvin, Texas.
        </p>

        <h2 style={h2}>Information we collect</h2>
        <p style={para}>
          When you contact us, schedule a tour, submit a lead, or start a rental application, we may
          collect your name, email address, phone number, the property you are interested in, and the
          information you include in your message or application (such as income, employment, and
          rental history for applications). Our website may also collect standard technical data such
          as IP address and browser type through your visit.
        </p>

        <h2 style={h2}>How we use your information</h2>
        <p style={para}>
          We use your information to respond to inquiries, schedule tours, process rental
          applications, communicate about availability and leasing, and operate and improve our
          website. Rental applications are used to verify the information you provide, including
          credit, rental history, employment, and background checks as disclosed during the
          application process.
        </p>

        <h2 style={h2}>How we share information</h2>
        <p style={para}>
          We do not sell your personal information. We share information only with service providers
          who help us operate (for example, email delivery and screening providers) and where
          required by law. These providers are permitted to use your information only to perform
          services on our behalf.
        </p>

        <h2 style={h2}>Data retention &amp; security</h2>
        <p style={para}>
          We retain application and contact information for as long as necessary to provide our
          services and to meet legal and recordkeeping obligations, then dispose of it securely. We
          use reasonable administrative and technical measures to protect your information.
        </p>

        <h2 style={h2}>Your choices</h2>
        <p style={para}>
          You may request access to, correction of, or deletion of your personal information by
          contacting our office. To stop receiving messages from us, reply to any message or contact
          us directly.
        </p>

        <h2 style={h2}>Contact us</h2>
        <p style={para}>
          Yellowstone Asset Management — RentInAlvin.com
          <br />
          410 S 2nd Street, Alvin, TX 77511
          <br />
          Phone: <a href="tel:8322103968" style={{ color: p.primary, fontWeight: 600, textDecoration: 'none' }}>(832) 210-3968</a>
          <br />
          Email: <a href="mailto:office@yellowstone-am.com" style={{ color: p.primary, fontWeight: 600, textDecoration: 'none' }}>office@yellowstone-am.com</a>
        </p>
      </main>
      <Footer p={p} displayFont={displayFont} />
    </div>
  );
}

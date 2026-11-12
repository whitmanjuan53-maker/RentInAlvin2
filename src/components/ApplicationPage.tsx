import Logo from './Logo';
import RentalApplication from './RentalApplication';
import { PALETTES } from '@/lib/data';

export default function ApplicationPage({ es = false }: { es?: boolean }) {
  return <div className="application-page">
    <header className="application-page-header"><a href={es ? '/es' : '/'} aria-label="RentInAlvin home"><Logo p={PALETTES.forest} /></a><nav aria-label={es ? 'Ayuda para la solicitud' : 'Application help'}><a href={es ? '/es' : '/'}>{es ? 'Ver viviendas' : 'Browse homes'}</a><a href={es ? '/apply' : '/es/apply'} lang={es ? 'en' : 'es'}>{es ? 'English' : 'Español'}</a><a href="tel:8322103968">(832) 210 3968</a></nav></header>
    <main id="application-main"><div className="application-page-intro"><p className="application-eyebrow">Yellowstone Asset Management · Alvin, Texas</p><h1>{es ? 'Solicitud de renta' : 'Rental application'}</h1><p>{es ? 'Sus datos, su hogar y sus preferencias. Complete cada sección y revise todo antes de enviar.' : 'Your details, your household and your next home. Complete each section, then review everything before sending.'}</p><div className="application-preparation"><strong>{es ? 'Para comenzar' : 'Before you begin'}</strong><span>{es ? 'Tenga a mano sus datos de contacto, información de ingresos y su historial de renta, si corresponde.' : 'Have your contact details, income information and rental history ready, if applicable.'}</span></div></div><RentalApplication es={es} /></main>
    <footer className="application-page-footer">Yellowstone Asset Management · {es ? 'Igualdad de Oportunidades de Vivienda' : 'Equal Housing Opportunity'} · <a href="/privacy">{es ? 'Privacidad' : 'Privacy'}</a></footer>
  </div>;
}

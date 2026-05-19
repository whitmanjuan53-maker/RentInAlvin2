import type { Metadata } from 'next';
import VivirEnAlvinClient from './VivirEnAlvinClient';

export const metadata: Metadata = {
  title: 'Vivir en Alvin, TX — Guía del Vecindario | Yellowstone Asset Management',
  description:
    'Todo lo que necesita saber sobre mudarse a Alvin, Texas — escuelas, tiempos de viaje a Houston, NASA y Pearland, supermercados, parques, y cómo es realmente la vida en Alvin.',
  robots: 'index, follow',
  alternates: {
    canonical: 'https://rentinalvin.com/vivir-en-alvin',
    languages: {
      'en-US': 'https://rentinalvin.com/living-in-alvin',
      'es-US': 'https://rentinalvin.com/vivir-en-alvin',
    },
  },
  openGraph: {
    type: 'article',
    url: 'https://rentinalvin.com/vivir-en-alvin',
    title: 'Vivir en Alvin, TX — Guía del Vecindario',
    description:
      'Escuelas, viaje al trabajo, supermercados, parques — cómo es realmente la vida en Alvin, Texas.',
    locale: 'es_US',
  },
  other: {
    'geo.region': 'US-TX',
    'geo.placename': 'Alvin',
  },
};

export default function VivirEnAlvinPage() {
  return <VivirEnAlvinClient />;
}

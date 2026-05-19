import type { Metadata } from 'next';
import LivingInAlvinClient from './LivingInAlvinClient';

export const metadata: Metadata = {
  title: 'Living in Alvin, TX — Neighborhood Guide | Yellowstone Asset Management',
  description:
    'Everything you need to know about moving to Alvin, Texas — schools, commute times to Houston, NASA, and Pearland, grocery, parks, and what life in Alvin is actually like.',
  keywords:
    'moving to Alvin TX, Alvin Texas neighborhood guide, Alvin ISD schools, Alvin commute Houston, things to do Alvin Texas',
  robots: 'index, follow',
  alternates: {
    canonical: 'https://rentinalvin.com/living-in-alvin',
    languages: {
      'en-US': 'https://rentinalvin.com/living-in-alvin',
      'es-US': 'https://rentinalvin.com/vivir-en-alvin',
    },
  },
  openGraph: {
    type: 'article',
    url: 'https://rentinalvin.com/living-in-alvin',
    title: 'Living in Alvin, TX — A Neighborhood Guide',
    description:
      'Schools, commute, grocery, parks — what life in Alvin, Texas is really like.',
    locale: 'en_US',
  },
  other: {
    'geo.region': 'US-TX',
    'geo.placename': 'Alvin',
  },
};

export default function LivingInAlvinPage() {
  return <LivingInAlvinClient />;
}

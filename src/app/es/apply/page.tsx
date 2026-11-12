import type { Metadata } from 'next';
import ApplicationPage from '@/components/ApplicationPage';

export const metadata: Metadata = {
  title:'Solicitud de renta | RentInAlvin.com',
  description:'Solicite un townhome o apartamento en Alvin. Complete sus datos y revise su solicitud antes de enviarla a Yellowstone Asset Management.',
  alternates:{canonical:'https://rentinalvin.com/es/apply',languages:{'en-US':'https://rentinalvin.com/apply','es-US':'https://rentinalvin.com/es/apply'}},
};
export default function SpanishApplyPage(){return <ApplicationPage es />;}

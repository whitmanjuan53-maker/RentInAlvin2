import type { Metadata } from 'next';
import ApplicationPage from '@/components/ApplicationPage';

export const metadata: Metadata = {
  title:'Rental Application | RentInAlvin.com',
  description:'Apply for an Alvin townhome or apartment with Yellowstone Asset Management. Complete your details and review your application before submitting.',
  alternates:{canonical:'https://rentinalvin.com/apply',languages:{'en-US':'https://rentinalvin.com/apply','es-US':'https://rentinalvin.com/es/apply'}},
};
export default function ApplyPage(){return <ApplicationPage />;}

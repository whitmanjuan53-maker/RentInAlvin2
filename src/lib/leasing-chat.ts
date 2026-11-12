import { FAQS } from './data';
import { FAQS as SPANISH_FAQS } from './data.es';
import { cleanWebsiteText } from './website-copy';

export type ChatLocale = 'en' | 'es';
export interface ChatProperty { name: string; addr: string; price: string; units: string; }
export interface ChatAnswer { text: string; href?: string; label?: string; }

export function answerLeasingQuestion(question: string, locale: ChatLocale, properties: ChatProperty[]): ChatAnswer {
  const q = question.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/-/g, ' ').toLowerCase();
  const es = locale === 'es';
  const answer = (text: string, href?: string, label?: string): ChatAnswer => ({ text: cleanWebsiteText(text, locale), href, label });
  const contact = () => answer(es ? 'El equipo de arrendamiento puede confirmar eso. Llame al (832) 210 3968 o envíe una consulta.' : 'Our leasing team can confirm that for you. Call (832) 210 3968 or send an inquiry.', '/#contact', es ? 'Contactar al equipo' : 'Contact leasing');
  if (/\b(emergency|fire|danger|emergencia|incendio)\b/.test(q)) return answer(es ? 'Si hay peligro inmediato, llame al 911. Para mantenimiento urgente, llame al (832) 210 3968.' : 'For immediate danger, call 911. For urgent property maintenance, call (832) 210 3968.', 'tel:8322103968', es ? 'Llamar a la oficina' : 'Call the office');
  if (/\b(approve|approval|qualify|evict|felon|criminal|credit|disability|section 8|voucher|aprobacion|credito|antecedentes)\b/.test(q)) return contact();
  if (/\b(tour|visit|viewing|cita|visita|recorrido)\b/.test(q)) return answer(es ? 'Puede solicitar una visita en nuestro formulario. El equipo confirmará la fecha y la vivienda.' : 'Request a tour using our booking form. Our team will confirm the time and home with you.', es ? '/es#contacto' : '/#contact', es ? 'Solicitar visita' : 'Request a tour');
  if (/\b(hours|hour|open|office|address|location|located|horario|oficina|direccion|ubicacion)\b/.test(q) && !/\b(available|availability|disponible)\b/.test(q)) return answer(es ? 'La oficina está en 410 S 2nd Street, Alvin, TX 77511. Lunes a viernes de 9:00 a. m. a 5:00 p. m. Sábados con cita. Domingos cerrado.' : 'Our office is at 410 S 2nd Street, Alvin, TX 77511. Monday to Friday, 9 am to 5 pm Central. Saturday by appointment. Closed Sunday.', 'https://maps.google.com/?q=410+S+2nd+St+Alvin+TX+77511', es ? 'Ver dirección' : 'Get directions');
  const faqIndex = /\b(pet|pets|dog|dogs|cat|cats|mascota|mascotas|perro|gato)\b/.test(q) ? 1
    : /\b(utility|utilities|water|electric|included|servicios|agua|electricidad|incluido)\b/.test(q) ? 2
    : /\b(maintenance|repair|broken|mantenimiento|reparacion)\b/.test(q) ? 3
    : /\b(lease|leases|month to month|short term|contrato|plazo)\b/.test(q) ? 4
    : /\b(parking|park|car|estacionamiento|aparcar)\b/.test(q) ? 5
    : /\b(apply|application|applications|income|deposit|aplicar|solicitud|ingresos|deposito)\b/.test(q) ? 0 : -1;
  if (faqIndex >= 0) {
    if (/deposit|deposito/.test(q)) return contact();
    const faqs = es ? SPANISH_FAQS : FAQS;
    return answer(faqs[faqIndex].a, faqIndex === 0 ? (es ? '/es/apply' : '/apply') : '/#contact', faqIndex === 0 ? (es ? 'Ver solicitud' : 'View application') : (es ? 'Preguntar al equipo' : 'Ask leasing'));
  }
  if (/\b(rent|rents|price|prices|cost|bedroom|bedrooms|bed|beds|community|communities|townhome|townhomes|apartment|apartments|haven|manor|royal|french|white|renta|rentas|precio|precios|comunidad|comunidades|apartamento|apartamentos|habitacion|habitaciones)\b/.test(q)) {
    const matched = properties.filter(p => {
      const name = p.name.toLowerCase();
      return ['haven','manor','royal','french','white'].some(word => q.includes(word) && name.includes(word));
    });
    const listed = matched.length ? matched : properties;
    if (!listed.length) return answer(es ? 'Vea nuestras comunidades y rentas publicadas. Llame para confirmar precios y disponibilidad.' : 'View our communities and listed monthly rents. Call to confirm current pricing and availability.', '/communities', es ? 'Ver comunidades' : 'View communities');
    return answer(listed.map(p => `${p.name}, ${p.addr}: ${p.price}`).join('\n') + (es ? '\nRentas publicadas. Confirme precio y disponibilidad con el equipo.' : '\nListed monthly rents. Please confirm current pricing and availability with leasing.'), '/communities', es ? 'Ver detalles' : 'View community details');
  }
  if (/\b(available|availability|move|moving|vacancy|vacancies|disponible|disponibilidad|mudanza)\b/.test(q)) return answer(es ? 'Las viviendas disponibles cambian con frecuencia. Revise la lista y llame al (832) 210 3968 para confirmar su fecha de mudanza.' : 'Openings change often. Check our listings, then call (832) 210 3968 to confirm a home for your move date.', '/#availability', es ? 'Ver disponibilidad' : 'View availability');
  if (/\b(hello|hi|hey|hola|thanks|thank|gracias)\b/.test(q)) return answer(es ? '¡Hola! Puedo ayudar con rentas, mascotas, estacionamiento, solicitudes y visitas. ¿Qué le gustaría saber?' : 'Hi! I can help with rent, pets, parking, applications and tours. What would you like to know?');
  return contact();
}

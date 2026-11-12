import { FAQS, FLOORPLANS } from './data';
import { FAQS as SPANISH_FAQS } from './data.es';
import { cleanWebsiteText } from './website-copy';

export type ChatLocale = 'en' | 'es';
export interface ChatProperty {
  name: string; addr: string; price: string; units: string;
  note?: string; amenities?: string[]; availability?: string;
}
export interface ChatAnswer { text: string; href?: string; label?: string; }

const normalize = (text: string) => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
  .replace(/[’']/g, '').replace(/[-–—]/g, ' ').replace(/\s+/g, ' ').trim();

function bedrooms(question: string): number[] {
  const found = new Set<number>();
  const pattern = /\b(one|two|three|1|2|3|un|una|uno|dos|tres)\s*(?:bedrooms?|beds?|br|bdrms?|bd|habitacion(?:es)?|recamaras?|dormitorios?)\b/g;
  for (const match of question.matchAll(pattern)) {
    found.add(({ one: 1, two: 2, three: 3, un: 1, una: 1, uno: 1, dos: 2, tres: 3 } as Record<string, number>)[match[1]] || Number(match[1]));
  }
  // Support follow ups such as "What about a two?" after a bedroom question.
  return [...found];
}

function propertyMatches(question: string, properties: ChatProperty[]): ChatProperty[] {
  const group = properties.filter(property => {
    const name = normalize(property.name);
    return ['haven', 'manor', 'royal', 'french', 'white'].some(word => new RegExp(`\\b${word}\\b`).test(question) && name.includes(word))
      || question.includes(normalize(property.addr));
  });
  if (group.length > 1 && /\b(100|410)\b/.test(question)) {
    return group.filter(property => question.includes(property.addr.split(' ')[0]));
  }
  return group;
}

/** Answers only from published site content. History is kept in the open widget, never sent externally. */
export function answerLeasingQuestion(question: string, locale: ChatLocale, properties: ChatProperty[], history: string[] = []): ChatAnswer {
  const q = normalize(question);
  const es = locale === 'es';
  const contactHref = es ? '/es#contacto' : '/#contact';
  const applyHref = es ? '/es/apply' : '/apply';
  const answer = (text: string, href?: string, label?: string): ChatAnswer => ({ text: cleanWebsiteText(text, locale), href, label });
  const contact = () => answer(es
    ? 'No tengo información confirmada sobre eso. El equipo puede ayudarle: (832) 210 3968 o office@yellowstone-am.com. ¿Pregunta por una comunidad en particular?'
    : 'I don’t have confirmed information about that. Our leasing team can help at (832) 210 3968 or office@yellowstone-am.com. Is your question about a particular community?', contactHref, es ? 'Contactar al equipo' : 'Contact leasing');
  if (/\b(emergency|fire|danger|gas leak|emergencia|incendio)\b/.test(q)) return answer(es ? 'Si hay peligro inmediato, llame al 911. Para mantenimiento urgente, llame al (832) 210 3968.' : 'For immediate danger, call 911. For urgent property maintenance, call (832) 210 3968.', 'tel:8322103968', es ? 'Llamar a la oficina' : 'Call the office');
  if (/\b(approve|approved|approval|qualify|qualification|evict\w*|felon\w*|criminal|credit|disability|section 8|voucher|assistance animal|service (dog|animal)|emotional support|aprobacion|credito|antecedentes|discapacidad)\b/.test(q)) return contact();

  let selected = propertyMatches(q, properties);
  // A newly named community replaces the previous one; general questions reset scope.
  if (!selected.length && !/\b(all|any|every|other|communities|options|todas|otras|comunidades)\b/.test(q)) {
    for (const earlier of history.slice(-8).reverse()) {
      const previous = normalize(earlier);
      if (/\b(all|every|other|todas|otras)\b/.test(previous)) break;
      selected = propertyMatches(previous, properties);
      if (selected.length) break;
    }
  }
  let requestedBeds = bedrooms(q);
  if (!requestedBeds.length && /\b(what about|how about|y uno|y dos|y tres)\b/.test(q) && history.some(item => bedrooms(normalize(item)).length)) {
    const short = q.match(/\b(one|two|three|1|2|3|uno|dos|tres)\b/);
    if (short) requestedBeds = bedrooms(`${short[1]} bedrooms`);
  }
  const published = es ? 'Rentas publicadas por mes. Confirme la renta actual y la disponibilidad con el equipo.' : 'Published monthly rents. Please confirm current rent and availability with leasing.';
  const sections: string[] = [];
  let href = contactHref;
  let label = es ? 'Preguntar al equipo' : 'Ask leasing';
  const add = (text: string) => { if (!sections.includes(text)) sections.push(text); };

  const otherCost = /\b(deposit|fee|fees|deposito|cuota|income|ingresos|pet|pets|dog|cat|parking|mascota\w*|estacionamiento|utility|utilities|included|incluido\w*)\b/.test(q);
  const explicitRent = /\b(rents|prices|pricing|cheapest|affordable|budget|rentas|precios)\b/.test(q)
    || /\b(rent|renta|price|precio)\b/.test(q) && !/\b(included|include|includes|income|utilities|incluido\w*|ingresos)\b/.test(q);
  const rentQuestion = requestedBeds.length > 0 || explicitRent || !otherCost && /\b(cost|how much|cuanto cuesta)\b/.test(q);
  if (rentQuestion && !/\b(pay|payment|portal|pagar|pago)\b/.test(q)) {
    if (selected.length) {
      const matching = selected.filter(p => !requestedBeds.length || requestedBeds.some(bed => new RegExp(`\\b${bed}\\s*(?:BR|Bed)`, 'i').test(p.units)));
      if (matching.length) add(matching.map(p => `${p.name}, ${p.addr}: ${p.units}. ${p.price}`).join('\n') + '\n' + published + (requestedBeds.length ? (es ? '\nLa renta publicada de la comunidad no es una cotización para una unidad específica.' : '\nCommunity starting rents are not a quote for a particular floor plan.') : ''));
      else add(es ? 'La información publicada de esa comunidad no confirma esa cantidad de habitaciones. Consulte al equipo antes de elegir una vivienda.' : 'The published details for that community do not confirm that bedroom count. Ask leasing to confirm a matching home.');
    } else if (requestedBeds.length) {
      const plans = FLOORPLANS.filter(plan => requestedBeds.includes(Number(plan.type[0])));
      add(plans.map(plan => `${es ? plan.type.replace('Bed', 'habitaciones').replace('Bath', 'baños') : plan.type}: ${es ? plan.price.replace(' to ', ' a ') : plan.price}/${es ? 'mes' : 'month'}, ${plan.sqft}.`).join('\n') + '\n' + published);
    } else {
      add((selected.length ? selected : properties).map(p => `${p.name}, ${p.addr}: ${p.price}`).join('\n') + '\n' + published);
    }
    href = '/communities'; label = es ? 'Ver comunidades' : 'View communities';
  }

  const faqPatterns = [
    /\b(apply|application|applications|income|documents|id|requirements|aplicar|solicitud|ingresos|documentos|requisitos)\b/,
    /\b(pet|pets|dog|dogs|cat|cats|mascota\w*|perro\w*|gato\w*)\b/,
    /\b(utilit\w*|water|electric\w*|trash|sewer|included|internet|wifi|servicios|agua|basura|incluido\w*)\b/,
    /\b(maintenance|repair\w*|broken|mantenimiento|reparacion)\b/,
    /\b(lease|leases|month to month|short term|6 months|12 months|contrato|plazo)\b/,
    /\b(parking|park|car|driveway|guest parking|estacionamiento|aparcar|cochera)\b/,
  ];
  faqPatterns.forEach((pattern, index) => {
    if (!pattern.test(q)) return;
    // Fees and deposits need a current quote rather than a scripted dollar amount.
    if (index === 0) {
      add(es ? 'Puede completar la solicitud en línea. Prepare una identificación oficial y comprobante de ingresos. El sitio indica ingresos típicos de 3 veces la renta; el equipo confirma los requisitos y revisa cada solicitud.' : 'Complete the application online. Have a government issued ID and proof of income ready. The site lists typical income of 3 times monthly rent; leasing confirms requirements and reviews each application.');
      href = applyHref; label = es ? 'Ver solicitud' : 'View application';
    } else {
      let text = (es ? SPANISH_FAQS : FAQS)[index].a;
      if (index === 5) text = text.split(es ? ' Hay estacionamiento reservado' : ' Reserved parking')[0];
      add(text);
    }
  });
  if (/\b(deposit|deposits|fee|fees|move in cost|deposito|cuota\w*)\b/.test(q)) add(es ? 'El equipo debe confirmar los depósitos, los costos de mudanza y los términos para la vivienda elegida. Llame al (832) 210 3968 para una cotización actual.' : 'Leasing must confirm deposits, move in costs and terms for your selected home. Call (832) 210 3968 for a current quote.');
  if (/\b(tour|visit|viewing|see (a|an|the)|showing|cita|visita|recorrido)\b/.test(q)) {
    add(es ? 'Solicite una visita en el formulario de contacto. El equipo confirmará la fecha y la vivienda; el chat no reserva citas.' : 'Request a tour through our contact form. Leasing will confirm the time and home; this chat does not reserve appointments.');
    href = contactHref; label = es ? 'Solicitar visita' : 'Request a tour';
  }
  if (/\b(hours|hour|open|office|horario|oficina)\b/.test(q) && !/\b(available|availability|disponible)\b/.test(q)) add(es ? 'La oficina está en 410 S 2nd Street, Alvin, TX 77511. Lunes a viernes de 9:00 a. m. a 5:00 p. m. Sábados con cita. Domingos cerrado.' : 'Our office is at 410 S 2nd Street, Alvin, TX 77511. Monday to Friday, 9 am to 5 pm Central. Saturday by appointment. Closed Sunday.');
  if (/\b(phone|call|email|contact|number|telefono|correo|contacto)\b/.test(q)) add(es ? 'Llame al (832) 210 3968 o escriba a office@yellowstone-am.com.' : 'Call (832) 210 3968 or email office@yellowstone-am.com.');
  if (/\b(address|location|located|where|direccion|ubicacion|donde)\b/.test(q)) {
    add(selected.length ? selected.map(p => `${p.name}: ${p.addr}, Alvin, TX 77511.`).join('\n') : (es ? 'Nuestras comunidades están en Alvin, Texas. La oficina está en 410 S 2nd Street, Alvin, TX 77511.' : 'Our communities are in Alvin, Texas. The leasing office is at 410 S 2nd Street, Alvin, TX 77511.'));
  }
  if (/\b(available|availability|move|moving|vacancy|vacancies|ready|disponible\w*|disponibilidad|mudanza)\b/.test(q)) {
    add(es ? 'La disponibilidad cambia con frecuencia. Llame al (832) 210 3968 para confirmar la vivienda y su fecha de mudanza. El chat no puede reservar ni garantizar una unidad.' : 'Availability changes often. Call (832) 210 3968 to confirm a home for your move date. This chat cannot reserve or guarantee a unit.');
    if (sections.length === 1) { href = es ? '/es#disponibilidad' : '/#availability'; label = es ? 'Ver disponibilidad' : 'View availability'; }
  }
  if (/\b(amenit\w*|laundry|washers?|dryers?|pools?|furnished|appliances|dishwashers?|balcon\w*|yards?|fence\w*|sq\s*ft|square feet|size|bathroom\w*|lavadora|secadora|piscina|amueblado|banos|tamano)\b/.test(q)) {
    if (selected.length) add(selected.map(p => `${p.name}: ${p.units}${p.amenities?.length ? `. ${p.amenities.join(', ')}` : ''}.`).join('\n') + (es ? '\nEstas son las características publicadas. El equipo debe confirmar la característica específica para su vivienda.' : '\nThese are the published features. Ask leasing to confirm the specific feature for your home.'));
    else add(es ? 'Las características y los tamaños varían por comunidad y vivienda. ¿Qué comunidad le interesa? Puede preguntar por Kings Haven, Kings Manor, French Quarter, White House o Royal Oaks.' : 'Features and sizes vary by community and home. Which community interests you? You can ask about Kings Haven, Kings Manor, French Quarter, White House or Royal Oaks.');
  }
  if (/\b(pay|payment|portal|pagar|pago)\b/.test(q)) add(es ? 'El sitio indica un portal para pagos y mantenimiento. Solicite al equipo el enlace correcto para residentes. No ingrese datos de pago en este chat.' : 'The site lists a resident portal for rent payments and maintenance. Ask the office for the correct resident login link. Please do not enter payment details in this chat.');
  if (!sections.length && (/\b(community|communities|townhome\w*|apartment\w*|comunidad\w*|apartamento\w*)\b/.test(q) || propertyMatches(q, properties).length)) {
    add((selected.length ? selected : properties).map(p => `${p.name}, ${p.addr}: ${p.units}. ${p.price}`).join('\n') + '\n' + published);
    href = '/communities'; label = es ? 'Ver comunidades' : 'View communities';
  }
  if (sections.length) return answer(sections.join('\n\n'), href, label);
  if (/\b(hello|hi|hey|hola|thanks|thank|gracias|help|ayuda)\b/.test(q)) return answer(es ? '¡Hola! Pregunte por rentas de 1, 2 o 3 habitaciones, mascotas, servicios, estacionamiento, solicitudes o visitas. También puede indicar una comunidad.' : 'Hi! Ask about 1, 2 or 3 bedroom rents, pets, utilities, parking, applications or tours. You can also name a community.');
  return contact();
}

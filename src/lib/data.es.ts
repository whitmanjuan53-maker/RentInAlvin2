export const PALETTES = {
  forest: {
    bg: '#F4EEE4',
    paper: '#FBF7F0',
    ink: '#1A1815',
    inkSoft: '#5C5750',
    primary: '#1F3A2E',
    primarySoft: '#2A4A3C',
    accent: '#B5703D',
    line: 'rgba(26,24,21,0.12)',
  },
};

export type Palette = typeof PALETTES.forest;

export const COMMUNITIES = [
  {
    name: 'Kings Haven Apartments',
    addr: '410 S 2nd St',
    tag: 'Insignia · Oficina en sitio',
    units: '2 Rec · 1 Baño · 850 ft²',
    price: 'desde $890',
    note: 'Sede de Yellowstone Management. A pie del centro de Alvin.',
    img: 'exterior de apartamentos · ladrillo + jardinería',
  },
  {
    name: 'Kings Manor Townhomes',
    addr: '328 S 2nd St',
    tag: 'Townhome',
    units: '2 Rec · 2.5 Baño  ·  3 Rec · 2.5 Baño · 1,250 ft²',
    price: 'desde $1,250',
    note: 'Townhomes de dos pisos con entradas privadas y 2.5 baños.',
    img: 'fila de townhomes · dos pisos',
    gallery: [
      '/images/kings-manor/01-exterior-front.jpg',
      '/images/kings-manor/02-community-grounds.jpg',
      '/images/kings-manor/03-living-room-fireplace.jpg',
      '/images/kings-manor/04-living-room-entry.jpg',
      '/images/kings-manor/05-living-room-alt.jpg',
      '/images/kings-manor/06-kitchen-staged.jpg',
      '/images/kings-manor/07-kitchen-bar.jpg',
      '/images/kings-manor/08-kitchen-empty.jpg',
      '/images/kings-manor/09-dining-entry.jpg',
      '/images/kings-manor/10-bedroom-master.jpg',
      '/images/kings-manor/11-bedroom-window.jpg',
      '/images/kings-manor/12-bedroom-closets.jpg',
      '/images/kings-manor/13-bedroom-light.jpg',
      '/images/kings-manor/14-bathroom-vanity.jpg',
      '/images/kings-manor/15-bathroom-double.jpg',
      '/images/kings-manor/16-bathroom-tub.jpg',
      '/images/kings-manor/17-bathroom-tub-alt.jpg',
      '/images/kings-manor/18-powder-room.jpg',
      '/images/kings-manor/19-closet.jpg',
      '/images/kings-manor/20-laundry.jpg',
    ],
  },
  {
    name: 'Kings Haven Apartments',
    addr: '100 S 2nd St',
    tag: 'Apartamentos',
    units: '2 Rec · 1 Baño · 850 ft²',
    price: 'desde $850',
    note: 'Cuadra tranquila cerca de 100 S 2nd; interiores renovados.',
    img: 'apartamentos tipo jardín · sombra de roble',
  },
  {
    name: 'French Quarter Residency',
    addr: '2550 S Bypass 35',
    tag: 'Apartamentos',
    units: '2 Rec · 1 Baño · 850 ft²',
    price: 'desde $950',
    note: 'Comunidad más grande a lo largo de la autopista con amplio estacionamiento.',
    img: 'apartamentos con patio · hierro forjado',
  },
  {
    name: 'The White House Apartments',
    addr: '1606 W Sealy St',
    tag: 'Apartamentos',
    units: '2 Rec · 1 Baño · 850 ft²',
    price: 'desde $900',
    note: 'Apartamentos clásicos de revestimiento blanco en una calle residencial tranquila.',
    img: 'apartamentos de revestimiento blanco',
  },
  {
    name: 'The Royal Oaks Townhomes',
    addr: '418 S Jackson St',
    tag: 'Townhome',
    units: '2 Rec · 2 Baño · 1,150 ft²',
    price: 'desde $1,350',
    note: 'Townhomes espaciosos bajo dosel de robles maduros.',
    img: 'townhomes · dosel de roble',
    comingSoon: true,
  },
];

export const FLOORPLANS = [
  { type: '1 Rec · 1 Baño', sqft: '600 ft²', price: '$850 – $999', available: 2 },
  { type: '2 Rec · 1 Baño', sqft: '850 ft²', price: '$900 – $975', available: 4 },
  { type: '2 Rec · 2 Baños', sqft: '1,150 ft²', price: '$1,250 – $1,395', available: 3 },
  { type: '2 Rec · 2.5 Baños', sqft: '1,250 ft² (townhome)', price: '$1,295 – $1,450', available: 2 },
  { type: '3 Rec · 2.5 Baños', sqft: '1,250 ft² (townhome)', price: '$1,495 – $1,650', available: 1 },
];

export const MAP_PROPS = [
  { id: 0, name: 'Kings Haven', addr: '410 S 2nd St, Alvin, TX 77511', lat: 29.4208044, lng: -95.2554917, office: true },
  { id: 1, name: 'Kings Manor', addr: '328 S 2nd St, Alvin, TX 77511', lat: 29.4213292, lng: -95.2556986, office: false },
  { id: 2, name: 'Kings Haven (100)', addr: '100 S 2nd St, Alvin, TX 77511', lat: 29.4233620, lng: -95.2557670, office: false },
  { id: 3, name: 'French Quarter', addr: '2550 S Bypass 35, Alvin, TX 77511', lat: 29.40315, lng: -95.23971, office: false },
  { id: 4, name: 'White House', addr: '1606 W Sealy St, Alvin, TX 77511', lat: 29.4234731, lng: -95.2600658, office: false },
  { id: 5, name: 'Royal Oaks', addr: '418 S Jackson St, Alvin, TX 77511', lat: 29.4208186, lng: -95.2497543, office: false, comingSoon: true },
];

export const FAQS = [
  {
    q: '¿Qué se requiere para aplicar?',
    a: 'Una identificación oficial, comprobante de ingresos (típicamente 3× la renta mensual), y una cuota de aplicación de $40 por adulto. Realizamos verificaciones estándar de crédito e historial de renta. La mayoría de las aplicaciones se deciden en 48 horas.',
  },
  {
    q: '¿Se permiten mascotas?',
    a: 'Sí, la mayoría de las comunidades aceptan gatos y perros hasta 50 lbs con un depósito de mascota de $300 (único) y $25/mes de renta por mascota. Aplican restricciones de raza en algunos edificios. Pregunte cuando haga el tour.',
  },
  {
    q: '¿Qué está incluido en la renta?',
    a: 'El agua y la basura NO están incluidas en las seis comunidades. La electricidad e internet son pagados directamente por el residente.',
  },
  {
    q: '¿Cómo envío una solicitud de mantenimiento?',
    a: 'Llame a la oficina al (832) 210-3968 o envíe un correo a office@yellowstone-am.com. Las solicitudes de emergencia (fugas de agua, sin AC en verano, sin calefacción en invierno) se atienden dentro de 24 horas; las solicitudes estándar dentro de 48 horas hábiles. También ofrecemos acceso al portal en línea para solicitudes y pagos.',
  },
  {
    q: '¿Ofrecen contratos a corto plazo o mes a mes?',
    a: 'Los contratos estándar son de 12 meses. Podemos ofrecer contratos de 6 meses con una ligera prima y mes a mes para residentes existentes en renovación. Llámenos para discutir qué funciona para usted.',
  },
  {
    q: '¿El estacionamiento está incluido?',
    a: 'Sí, cada unidad viene con al menos un espacio asignado. Los townhomes (Kings Manor, Royal Oaks) incluyen cocheras privadas. El estacionamiento adicional/de visitas es gratuito por orden de llegada. Hay estacionamiento reservado disponible por una tarifa adicional.',
  },
];

export const AVAILABILITY = [
  { property: 'Kings Haven', addr: '410 S 2nd', type: '2 Rec · 1 Baño', sqft: 850, price: 925, ready: 'Disponible ahora', featured: true },
  { property: 'French Quarter', addr: '2550 S Bypass 35', type: '2 Rec · 1 Baño', sqft: 850, price: 950, ready: 'Disponible ahora', featured: true },
  { property: 'White House', addr: '1606 W Sealy', type: '2 Rec · 1 Baño', sqft: 850, price: 925, ready: 'Disponible ahora', featured: true },
  { property: 'Kings Manor', addr: '328 S 2nd', type: '3 Rec · 2.5 Baños', sqft: 1250, price: 1595, ready: 'Disponible ahora', featured: false },
  { property: 'Kings Haven (100)', addr: '100 S 2nd', type: '1 Rec · 1 Baño', sqft: 600, price: 850, ready: 'Disponible ahora', featured: false },
  { property: 'Royal Oaks', addr: '418 S Jackson', type: '2 Rec · 2 Baños', sqft: 1150, price: 1395, ready: 'Próximamente', featured: false },
];

export const BOOKING_PROPERTIES = [
  { id: 'kings-haven', name: 'Kings Haven', addr: '410 S 2nd St', bed: '2 Rec · 1 Baño', price: '$925' },
  { id: 'kings-manor', name: 'Kings Manor', addr: '328 S 2nd St', bed: '3 Rec · 2.5 Baños', price: '$1,595' },
  { id: 'kings-haven-100', name: 'Kings Haven (100)', addr: '100 S 2nd St', bed: '1 Rec · 1 Baño', price: '$850' },
  { id: 'french-quarter', name: 'French Quarter', addr: '2550 S Bypass 35', bed: '2 Rec · 1 Baño', price: '$950' },
  { id: 'white-house', name: 'White House', addr: '1606 W Sealy', bed: '2 Rec · 1 Baño', price: '$925' },
  { id: 'royal-oaks', name: 'Royal Oaks', addr: '418 S Jackson', bed: '2 Rec · 2 Baños', price: '$1,395' },
  { id: 'any', name: 'No estoy seguro todavía', addr: 'Le mostraremos algunas opciones', bed: 'Mixto', price: '—' },
];

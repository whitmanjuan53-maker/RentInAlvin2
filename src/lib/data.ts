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

// Canonical business identity — keep identical to Google Business Profile & all citations.
export const BUSINESS = {
  name: 'Yellowstone Asset Management',
  brand: 'RentInAlvin.com',
  street: '410 S 2nd Street',
  city: 'Alvin',
  region: 'TX',
  zip: '77511',
  phone: '(832) 210-3968',
  phoneE164: '+1-832-210-3968',
  email: 'office@yellowstone-am.com',
  url: 'https://rentinalvin.com',
  lat: 29.4208044,
  lng: -95.2554917,
};

// Public profiles for schema "sameAs". Add the real URLs as you create/claim them,
// then they are automatically included in the structured data. Leave blank to omit.
export const SAME_AS: string[] = [
  // 'https://www.google.com/maps/place/?q=place_id:YOUR_PLACE_ID',
  // 'https://www.facebook.com/yourpage',
  // 'https://www.instagram.com/yourpage',
  // 'https://www.apartments.com/your-listing',
  // 'https://www.zillow.com/your-listing',
];

export const COMMUNITIES = [
  {
    name: 'Kings Haven Apartments',
    addr: '410 S 2nd St',
    tag: 'Flagship · Office on-site',
    units: '2BR · 1BA · 850 sq ft',
    price: 'from $890',
    note: 'Headquarters of Yellowstone Management. Walkable to downtown Alvin.',
    img: 'apartment exterior · brick + landscaping',
    gallery: [
      '/images/kings-haven/01-001-cmup.jpg',
      '/images/kings-haven/02-001-dard.jpg',
      '/images/kings-haven/03-001-p00q.jpg',
      '/images/kings-haven/04-001-yf4i.jpg',
      '/images/kings-haven/05-001-yp1q.jpg',
      '/images/kings-haven/06-002-bzmx.jpg',
      '/images/kings-haven/07-002-twdh.jpg',
      '/images/kings-haven/08-003-83lx.jpg',
      '/images/kings-haven/09-003-btkm.jpg',
      '/images/kings-haven/10-004-c4qy.jpg',
      '/images/kings-haven/11-006-xrk5.jpg',
    ],
  },
  {
    name: 'Kings Manor Townhomes',
    addr: '328 S 2nd St',
    tag: 'Townhome',
    units: '2BR · 2.5BA  ·  3BR · 2.5BA · 1,250 sq ft',
    price: 'from $1,250',
    note: 'Two-story townhomes with private entries and 2.5 baths.',
    img: 'townhome row · two story',
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
    tag: 'Apartments',
    units: '2BR · 1BA · 850 sq ft',
    price: 'from $850',
    note: 'Quiet block near 100 S 2nd; renovated interiors.',
    img: 'garden apartments · oak shade',
  },
  {
    name: 'French Quarter Residency',
    addr: '2550 S Bypass 35',
    tag: 'Apartments',
    units: '2BR · 1BA · 850 sq ft',
    price: 'from $950',
    note: 'Larger community along the bypass with ample parking.',
    img: 'courtyard apartments · wrought iron',
    gallery: [
      '/images/french-quarter/01-exterior-front.png',
      '/images/french-quarter/02-exterior-street.png',
      '/images/french-quarter/03-kitchen-classic.jpg',
      '/images/french-quarter/04-kitchen-updated.jpg',
      '/images/french-quarter/05-bathroom.jpg',
      '/images/french-quarter/06-living-room.jpg',
      '/images/french-quarter/07-dining-kitchen.jpg',
      '/images/french-quarter/08-bedroom.jpg',
    ],
  },
  {
    name: 'The White House Apartments',
    addr: '1606 W Sealy St',
    tag: 'Apartments',
    units: '2BR · 1BA · 850 sq ft',
    price: 'from $900',
    note: 'Classic white-clad apartments on a quiet residential street.',
    img: 'white clapboard apartments',
  },
  {
    name: 'The Royal Oaks Townhomes',
    addr: '418 S Jackson St',
    tag: 'Townhome',
    units: '2BR · 2BA · 1,150 sq ft',
    price: 'from $1,350',
    note: 'Spacious townhomes under mature oak canopy.',
    img: 'townhomes · oak canopy',
    comingSoon: true,
  },
];

export const FLOORPLANS = [
  { type: '1 Bed · 1 Bath', sqft: '600 sq ft', price: '$850 – $999', available: 2 },
  { type: '2 Bed · 1 Bath', sqft: '850 sq ft', price: '$900 – $975', available: 4 },
  { type: '2 Bed · 2 Bath', sqft: '1,150 sq ft', price: '$1,250 – $1,395', available: 3 },
  { type: '2 Bed · 2.5 Bath', sqft: '1,250 sq ft (townhome)', price: '$1,295 – $1,450', available: 2 },
  { type: '3 Bed · 2.5 Bath', sqft: '1,250 sq ft (townhome)', price: '$1,495 – $1,650', available: 1 },
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
    q: "What's required to apply?",
    a: 'A government-issued ID, proof of income (typically 3× monthly rent), and a $40 application fee per adult. We run standard credit and rental-history checks. Most applications are decided within 48 hours.',
  },
  {
    q: 'Are pets allowed?',
    a: 'Yes, most communities accept cats and dogs under 50 lbs with a $300 pet deposit (one-time) and $25/month pet rent. Breed restrictions apply at some buildings. Just ask when you tour.',
  },
  {
    q: "What's included in rent?",
    a: 'Water and trash are not included at all six communities. Electric and internet are billed by the resident directly.',
  },
  {
    q: 'How do I submit a maintenance request?',
    a: 'Call the office at (832) 210-3968 or email office@yellowstone-am.com. Emergency requests (water leaks, no AC in summer, no heat in winter) are handled within 24 hours; standard requests within 48 hours during business days. We also allow online portal access for requests and online payments.',
  },
  {
    q: 'Do you offer short-term or month-to-month leases?',
    a: 'Standard leases are 12 months. We can offer 6-month leases at a slight premium and month-to-month for existing residents on lease renewal. Call to discuss what works.',
  },
  {
    q: 'Is parking included?',
    a: 'Yes, every unit comes with at least one assigned spot. Townhomes (Kings Manor, Royal Oaks) include private driveways. Additional/guest parking is free and on a first-come basis. Reserved parking is available for an additional fee.',
  },
];

export const AVAILABILITY = [
  { property: 'Kings Haven', addr: '410 S 2nd', type: '2 Bed · 1 Bath', sqft: 850, price: 925, ready: 'Available now', featured: true },
  { property: 'French Quarter', addr: '2550 S Bypass 35', type: '2 Bed · 1 Bath', sqft: 850, price: 950, ready: 'Available now', featured: true },
  { property: 'White House', addr: '1606 W Sealy', type: '2 Bed · 1 Bath', sqft: 850, price: 925, ready: 'Available now', featured: true },
  { property: 'Kings Manor', addr: '328 S 2nd', type: '3 Bed · 2.5 Bath', sqft: 1250, price: 1595, ready: 'Available now', featured: false },
  { property: 'Kings Haven (100)', addr: '100 S 2nd', type: '1 Bed · 1 Bath', sqft: 600, price: 850, ready: 'Available now', featured: false },
  { property: 'Royal Oaks', addr: '418 S Jackson', type: '2 Bed · 2 Bath', sqft: 1150, price: 1395, ready: 'Coming soon', featured: false },
];

export const BOOKING_PROPERTIES = [
  { id: 'kings-haven', name: 'Kings Haven', addr: '410 S 2nd St', bed: '2BR · 1BA', price: '$925' },
  { id: 'kings-manor', name: 'Kings Manor', addr: '328 S 2nd St', bed: '3BR · 2.5BA', price: '$1,595' },
  { id: 'kings-haven-100', name: 'Kings Haven (100)', addr: '100 S 2nd St', bed: '1BR · 1BA', price: '$850' },
  { id: 'french-quarter', name: 'French Quarter', addr: '2550 S Bypass 35', bed: '2BR · 1BA', price: '$950' },
  { id: 'white-house', name: 'White House', addr: '1606 W Sealy', bed: '2BR · 1BA', price: '$925' },
  { id: 'royal-oaks', name: 'Royal Oaks', addr: '418 S Jackson', bed: '2BR · 2BA', price: '$1,395' },
  { id: 'any', name: "I'm not sure yet", addr: "We'll show you a few options", bed: 'Mixed', price: '—' },
];

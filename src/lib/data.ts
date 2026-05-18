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
    tag: 'Flagship · Office on-site',
    units: '2BR · 1BA · 850 sq ft',
    price: 'from $890',
    note: 'Headquarters of Yellowstone Management. Walkable to downtown Alvin.',
    img: 'apartment exterior · brick + landscaping',
  },
  {
    name: 'Kings Manor Townhomes',
    addr: '328 S 2nd St',
    tag: 'Townhome',
    units: '2BR · 2.5BA  ·  3BR · 2.5BA · 1,250 sq ft',
    price: 'from $1,250',
    note: 'Two-story townhomes with private entries and 2.5 baths.',
    img: 'townhome row · two story',
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

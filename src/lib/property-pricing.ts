export interface PropertyPricing {
  propertyName: string;
  address: string;
  baseRent: number;
  monthlyFees: number;
  totalCharges: number;
  feeIncludes: string;
}

const FEE_INCLUDES = 'Water, trash, sewer, and pest control';

export const PROPERTY_PRICING: PropertyPricing[] = [
  {
    propertyName: 'Kings Haven Apartments',
    address: '410 S 2nd St',
    baseRent: 1050,
    monthlyFees: 160,
    totalCharges: 1210,
    feeIncludes: FEE_INCLUDES,
  },
  {
    propertyName: 'The Royal Oaks Townhomes',
    address: '418 S Jackson St',
    baseRent: 1350,
    monthlyFees: 160,
    totalCharges: 1510,
    feeIncludes: FEE_INCLUDES,
  },
  {
    propertyName: 'French Quarter Residency',
    address: '2550 S Bypass 35',
    baseRent: 1079,
    monthlyFees: 110,
    totalCharges: 1189,
    feeIncludes: FEE_INCLUDES,
  },
];

const NAME_ALIASES: Record<string, string> = {
  'Kings Haven': 'Kings Haven Apartments',
  'Royal Oaks': 'The Royal Oaks Townhomes',
  'RO 2BR/2BR Townhouse': 'The Royal Oaks Townhomes',
  'French Quarter': 'French Quarter Residency',
};

export function getPropertyPricing(property: { name?: string; property?: string; addr?: string }): PropertyPricing | undefined {
  const suppliedName = property.name || property.property || '';
  const name = NAME_ALIASES[suppliedName] || suppliedName;
  return PROPERTY_PRICING.find((pricing) => (
    pricing.propertyName === name && (!property.addr || pricing.address === property.addr)
  ));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatPricingSummary(pricing: PropertyPricing): string {
  return `${formatCurrency(pricing.baseRent)} base rent + ${formatCurrency(pricing.monthlyFees)} monthly fees · ${formatCurrency(pricing.totalCharges)} total listed charges`;
}

export function parsePricingSummary(summary: string): PropertyPricing | undefined {
  const match = summary.match(/^\$([\d,]+) base rent \+ \$([\d,]+) monthly fees · \$([\d,]+) total listed charges$/i);
  if (!match) return undefined;
  const [baseRent, monthlyFees, totalCharges] = match.slice(1).map((value) => Number(value.replace(/,/g, '')));
  if ([baseRent, monthlyFees, totalCharges].some((value) => !Number.isFinite(value))) return undefined;
  return {
    propertyName: '',
    address: '',
    baseRent,
    monthlyFees,
    totalCharges,
    feeIncludes: FEE_INCLUDES,
  };
}

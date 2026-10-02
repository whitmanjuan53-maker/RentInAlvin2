const COMMUNITY_DISPLAY_ORDER = [
  'Kings Manor Townhomes|328 S 2nd St',
  'The Royal Oaks Townhomes|418 S Jackson St',
  'Kings Haven Apartments|410 S 2nd St',
  'French Quarter Residency|2550 S Bypass 35',
  'The White House Apartments|1606 W Sealy St',
  'Kings Haven Apartments|100 S 2nd St',
] as const;

const displayRank = new Map(COMMUNITY_DISPLAY_ORDER.map((key, index) => [key, index]));

export function orderCommunities<T extends { name: string; addr: string }>(communities: T[]): T[] {
  return [...communities].sort((left, right) => {
    const leftRank = displayRank.get(`${left.name}|${left.addr}` as typeof COMMUNITY_DISPLAY_ORDER[number]);
    const rightRank = displayRank.get(`${right.name}|${right.addr}` as typeof COMMUNITY_DISPLAY_ORDER[number]);
    return (leftRank ?? Number.MAX_SAFE_INTEGER) - (rightRank ?? Number.MAX_SAFE_INTEGER);
  });
}

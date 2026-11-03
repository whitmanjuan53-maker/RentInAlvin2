export type AnnouncementType = 'open-house' | 'move-in-special';

export interface PropertyAnnouncement {
  id: string;
  title: string;
  message: string;
  type: AnnouncementType;
  propertySlugs: string[];
  startsAt?: string;
  endsAt?: string;
  dateLabel?: string;
  timeLabel?: string;
  locationName?: string;
  locationAddress?: string;
  locationHref?: string;
  ctaLabel?: string;
  ctaHref?: string;
  enabled: boolean;
  published: boolean;
  displayOrder: number;
}

// Centralized content keeps public display and manager previews aligned. The
// current backend has no announcement storage, so this is intentionally a
// frontend content source rather than a new table or API contract.
export const PROPERTY_ANNOUNCEMENTS: PropertyAnnouncement[] = [
  {
    id: 'royal-oaks-703-open-house',
    title: 'OPEN HOUSE',
    message: 'Join us at Royal Oaks 703 to tour an available home, meet our local leasing team, and ask questions.',
    type: 'open-house',
    propertySlugs: ['the-royal-oaks-townhomes'],
    endsAt: '2026-11-07T15:00:00-06:00',
    dateLabel: 'Saturday, November 7, 2026',
    timeLabel: '11:00 AM–3:00 PM',
    locationName: 'Royal Oaks 703',
    locationAddress: '703 W. Lang St., Alvin, TX 77511',
    locationHref: 'https://www.google.com/maps/search/703+W.+Lang+St.+Alvin,+Tx+77511?entry=gmail&source=g',
    ctaLabel: 'Come Tour Your New Home',
    ctaHref: '/#contact',
    enabled: true,
    published: true,
    displayOrder: 1,
  },
  {
    id: 'fall-2026-move-in-offer',
    title: "SPECIAL MOVE-IN OFFER: $300 DEPOSIT + $700 OFF SECOND MONTH'S RENT",
    message: 'Ask our leasing team for eligibility, offer details and complete lease terms.',
    type: 'move-in-special',
    propertySlugs: [
      'kings-haven-apartments',
      'the-royal-oaks-townhomes',
      'french-quarter-residency',
    ],
    ctaLabel: 'Ask About This Offer',
    ctaHref: '/#contact',
    enabled: true,
    published: true,
    displayOrder: 2,
  },
];

export function getAnnouncementsForProperty(slug: string): PropertyAnnouncement[] {
  return PROPERTY_ANNOUNCEMENTS
    .filter((announcement) => announcement.propertySlugs.includes(slug))
    .sort((a, b) => a.displayOrder - b.displayOrder);
}

export function isAnnouncementActive(announcement: PropertyAnnouncement, now = new Date()): boolean {
  if (!announcement.published || !announcement.enabled) return false;
  if (announcement.startsAt && now < new Date(announcement.startsAt)) return false;
  if (announcement.endsAt && now > new Date(announcement.endsAt)) return false;
  return true;
}

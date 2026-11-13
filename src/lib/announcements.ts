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
    id: 'fall-2026-move-in-offer',
    title: "SPECIAL MOVE IN OFFER: $300 DEPOSIT + $700 OFF SECOND MONTH'S RENT",
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

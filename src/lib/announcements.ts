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
    id: 'kings-haven-open-house-2026-10-24',
    title: 'OPEN HOUSE THIS SATURDAY',
    message: 'Stop by Kings Haven and meet our local leasing team. Tour an available home, ask questions, and see whether it feels like the right fit.',
    type: 'open-house',
    propertySlugs: ['kings-haven-apartments'],
    startsAt: '2026-10-01T00:00:00-05:00',
    endsAt: '2026-10-24T16:00:00-05:00',
    dateLabel: 'Saturday, October 24, 2026',
    timeLabel: '1:00 PM–4:00 PM',
    ctaLabel: 'Come Tour Your New Home',
    ctaHref: '/#contact',
    enabled: true,
    published: true,
    displayOrder: 1,
  },
  {
    id: 'fall-2026-move-in-offer',
    title: "SPECIAL MOVE-IN OFFER: $300 DEPOSIT + $700 OFF SECOND MONTH'S RENT",
    message: 'Ask our leasing team for eligibility and offer details. Standard monthly fees and other applicable charges remain due.',
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

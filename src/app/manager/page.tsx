import type { Metadata } from 'next';
import { isManagerAuthed } from '@/lib/manager-auth';
import { getAllPropertiesForAdmin, STATIC_PROPERTIES } from '@/lib/properties';
import ManagerLogin from './ManagerLogin';
import ManagerDashboard from './ManagerDashboard';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Property Manager',
  robots: 'noindex, nofollow',
};

export default async function ManagerPage() {
  const authed = await isManagerAuthed();
  if (!authed) return <ManagerLogin />;

  const properties = (await getAllPropertiesForAdmin()).map((property) => ({
    ...property,
    protectedGallery: STATIC_PROPERTIES.find((item) => item.slug === property.slug)?.gallery || [],
  }));
  const blobConfigured = !!process.env.BLOB_READ_WRITE_TOKEN;

  return <ManagerDashboard properties={properties} blobConfigured={blobConfigured} />;
}

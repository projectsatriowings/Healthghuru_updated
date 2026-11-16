import type { Metadata } from 'next';
import { sql } from '@/lib/db';
import { CampaignManagerPage } from './CampaignManagerPage';
import { AdSlotPricing } from '@/lib/types/advertisement';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Advertise With HealthGhuru',
  description: 'Promote your healthcare brand, hospital, or wellness product to millions of health-conscious readers.',
  alternates: {
    canonical: '/advertise',
  },
  openGraph: {
    title: 'Advertise With HealthGhuru',
    description: 'Promote your healthcare brand, hospital, or wellness product to millions of health-conscious readers.',
    url: 'https://healthghuru.com/advertise',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Advertise With HealthGhuru',
    description: 'Promote your healthcare brand, hospital, or wellness product to millions of health-conscious readers.',
  },
};

export default async function AdvertisePage() {
  // Fetch pricing from DB (fallback to defaults if table missing)
  let pricing: AdSlotPricing[] = [];
  try {
    const rows = await sql`SELECT * FROM ad_slot_pricing WHERE is_available = true ORDER BY price_per_week DESC`;
    pricing = rows as AdSlotPricing[];
  } catch {
    // Use defaults if table not yet created
  }

  return <CampaignManagerPage pricingSlots={pricing} />;
}

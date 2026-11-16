import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Premium Membership Plans',
  description: 'Access ad-free medical reading, full magazine editions, clinical research digests, and exclusive health tools.',
  alternates: {
    canonical: '/subscribe',
  },
  openGraph: {
    title: 'Premium Membership Plans',
    description: 'Access ad-free medical reading, full magazine editions, clinical research digests, and exclusive health tools.',
    url: 'https://healthghuru.com/subscribe',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Premium Membership Plans',
    description: 'Access ad-free medical reading, full magazine editions, clinical research digests, and exclusive health tools.',
  },
};

export default function SubscribeLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

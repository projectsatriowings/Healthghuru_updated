import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy & Data Protection',
  description: 'Understand how HealthGhuru protects your personal data, clinical privacy, and cookie preferences.',
  alternates: {
    canonical: '/privacy',
  },
  openGraph: {
    title: 'Privacy Policy & Data Protection',
    description: 'Understand how HealthGhuru protects your personal data, clinical privacy, and cookie preferences.',
    url: 'https://healthghuru.com/privacy',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Privacy Policy & Data Protection',
    description: 'Understand how HealthGhuru protects your personal data, clinical privacy, and cookie preferences.',
  },
};

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

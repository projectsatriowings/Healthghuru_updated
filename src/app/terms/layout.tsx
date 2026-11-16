import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service & Usage Agreement',
  description: 'Read the terms of service, acceptable usage guidelines, and intellectual property terms for HealthGhuru.',
  alternates: {
    canonical: '/terms',
  },
  openGraph: {
    title: 'Terms of Service & Usage Agreement',
    description: 'Read the terms of service, acceptable usage guidelines, and intellectual property terms for HealthGhuru.',
    url: 'https://healthghuru.com/terms',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Terms of Service & Usage Agreement',
    description: 'Read the terms of service, acceptable usage guidelines, and intellectual property terms for HealthGhuru.',
  },
};

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}


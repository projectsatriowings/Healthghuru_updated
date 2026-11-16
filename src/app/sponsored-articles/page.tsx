/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import type { Metadata } from 'next';
import { BreakingNewsTicker } from '@/components/media/BreakingNewsTicker';
import {
  getSponsoredArticles,
  getFeaturedSponsoredArticle,
  getTrendingHealthEditorial,
  getEditorialHealthArticles,
} from '@/lib/sponsored/db';
import { sql } from '@/lib/db';
import { SponsoredPageWrapper } from '@/components/sponsored/SponsoredPageWrapper';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Sponsored Healthcare Articles',
  description:
    'Promote your hospital, clinical milestones, and healthcare brand to millions of health-conscious readers.',
  alternates: {
    canonical: '/sponsored-articles',
  },
  openGraph: {
    title: 'Sponsored Healthcare Articles',
    description:
      'Promote your hospital, clinical milestones, and healthcare brand to millions of health-conscious readers.',
    url: 'https://healthghuru.com/sponsored-articles',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sponsored Healthcare Articles',
    description:
      'Promote your hospital, clinical milestones, and healthcare brand to millions of health-conscious readers.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function SponsoredArticlesPage() {
  // Fetch breaking news for global breaking news ticker
  let breakingItems: any[] = [];
  try {
    breakingItems = await sql`
      SELECT id, title, slug, category
      FROM content_items
      WHERE is_breaking = TRUE AND status = 'published' AND deleted_at IS NULL
      ORDER BY published_at DESC
      LIMIT 6
    `;
  } catch (err) {
    console.error('Failed to load breaking items:', err);
  }

  // Fetch sponsored content & editorial sidebar data concurrently
  const [featuredArticle, initialArticlesData, trendingItems, mostReadItems] = await Promise.all([
    getFeaturedSponsoredArticle(),
    getSponsoredArticles({ page: 1, limit: 9, sort: 'latest' }),
    getTrendingHealthEditorial(5),
    getEditorialHealthArticles(undefined, 5),
  ]);

  return (
    <div className="min-h-screen bg-[#F5FAF5]">
      {/* 1. Global Breaking News Ticker */}
      {breakingItems.length > 0 && <BreakingNewsTicker items={breakingItems} />}

      <main className="max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        <SponsoredPageWrapper
          featuredArticle={featuredArticle}
          initialArticles={initialArticlesData.articles}
          initialTotal={initialArticlesData.total}
          initialTotalPages={initialArticlesData.totalPages}
          trendingItems={trendingItems as any[]}
          mostReadItems={mostReadItems as any[]}
        />
      </main>
    </div>
  );
}

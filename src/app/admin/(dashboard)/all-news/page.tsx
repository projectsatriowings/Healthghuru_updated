/* eslint-disable @typescript-eslint/no-explicit-any */
import { requireAdmin } from '@/lib/auth/session';
import { sql } from '@/lib/db';
import { AllNewsClient } from './AllNewsClient';

export const dynamic = 'force-dynamic';
export const metadata = {
  title: 'All News - News Management | HealthGhuru CMS',
};

export default async function AllNewsPage({
  searchParams,
}: {
  searchParams?: { status?: string; filter?: string };
}) {
  await requireAdmin();

  let items: any[] = [];
  let totalCount = 0;

  // Fetch news articles from content_items including news-wise view_count with resilient fallback
  try {
    const [fetchedItems, countRes] = await Promise.all([
      sql`
        SELECT 
          id,
          title,
          slug,
          category,
          language,
          excerpt,
          description,
          image_url,
          published_at,
          is_breaking,
          is_featured,
          status,
          raw_metadata,
          COALESCE(view_count, 0) as view_count
        FROM content_items
        WHERE deleted_at IS NULL
        ORDER BY published_at DESC NULLS LAST
        LIMIT 120
      `,
      sql`
        SELECT count(*) as total
        FROM content_items
        WHERE deleted_at IS NULL
      `,
    ]);
    items = fetchedItems as any[];
    totalCount = parseInt(countRes[0]?.total || '0', 10);
  } catch (err) {
    console.warn('Initial fetch in AllNewsPage encountered an issue, retrying...', err);
    try {
      const [fetchedItems, countRes] = await Promise.all([
        sql`
          SELECT 
            id,
            title,
            slug,
            category,
            language,
            excerpt,
            description,
            image_url,
            published_at,
            is_breaking,
            is_featured,
            status,
            raw_metadata,
            COALESCE(view_count, 0) as view_count
          FROM content_items
          WHERE deleted_at IS NULL
          ORDER BY published_at DESC NULLS LAST
          LIMIT 120
        `,
        sql`
          SELECT count(*) as total
          FROM content_items
          WHERE deleted_at IS NULL
        `,
      ]);
      items = fetchedItems as any[];
      totalCount = parseInt(countRes[0]?.total || '0', 10);
    } catch (retryErr) {
      console.error('AllNewsPage retry also failed:', retryErr);
      items = [];
      totalCount = 0;
    }
  }

  return (
    <div className="py-2">
      <AllNewsClient initialNews={items} totalCount={totalCount} />
    </div>
  );
}

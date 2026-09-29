import 'dotenv/config';
import { sql } from '../src/lib/db';

async function check() {
  const slugs = [
    'new-research-early-cancer-detection-microrna',
    'who-releases-global-guidance-maternal-iron-postpartum',
    'cardiovascular-study-explores-novel-biomarkers-plaque',
    'neuroimaging-confirms-mindful-breathwork-cortisol-reduction'
  ];
  for (const s of slugs) {
    const c = await sql`SELECT id, slug FROM content_items WHERE slug = ${s}`;
    const a = await sql`SELECT id, slug FROM articles WHERE slug = ${s}`;
    console.log(s, 'content_items:', c.length, 'articles:', a.length);
  }

  // Also get some real published article slugs
  const realArticles = await sql`SELECT slug, title FROM content_items WHERE status = 'published' AND deleted_at IS NULL LIMIT 6`;
  console.log('\nReal articles in db:', realArticles);
}

check().catch(console.error);

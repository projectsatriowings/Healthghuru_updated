import 'dotenv/config';
import { sql } from '../src/lib/db';

const fallbackSlugs = [
  // Cancer
  'cancer-early-detection-microrna-blood-panels',
  'targeted-mrna-cancer-vaccines-phase-ii',
  'next-gen-liquid-biopsies-residual-disease',
  'car-t-therapy-innovations-cytokine-control',
  // Heart
  'coronary-artery-calcium-cac-scoring-silent-risk',
  'apob-vs-ldl-c-preventive-lipidology',
  // TopStoriesGrid
  'eat-well-live-better-simple-nutrition-changes'
];

async function check() {
  for (const s of fallbackSlugs) {
    const c = await sql`SELECT id, slug FROM content_items WHERE slug = ${s}`;
    const a = await sql`SELECT id, slug FROM articles WHERE slug = ${s}`;
    console.log(s, 'content_items:', c.length, 'articles:', a.length);
  }
}

check().catch(console.error);

import { neon, neonConfig } from '@neondatabase/serverless';

// Ensure Node.js prioritizes IPv4 to prevent Windows/ISP IPv6 routing hangs (TypeError: fetch failed)
if (typeof process !== 'undefined' && process.release?.name === 'node') {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const dns = require('dns');
    if (typeof dns.setDefaultResultOrder === 'function') {
      dns.setDefaultResultOrder('ipv4first');
    }
  } catch { }
}

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not defined');
}

/**
 * Neon HTTP Driver Optimization:
 * The @neondatabase/serverless HTTP driver (`neon()`) communicates via stateless HTTP POST queries.
 * Neon explicitly documents that neon() must use the direct (unpooled) endpoint.
 * Supplying a '-pooler' endpoint forces queries through PgBouncer connection pooling overhead,
 * adding 2,000ms - 2,400ms of latency per query.
 * We automatically strip '-pooler' for the HTTP driver to achieve instant ~300ms direct responses.
 */
const dbUrl = process.env.DATABASE_URL.includes('-pooler.')
  ? process.env.DATABASE_URL.replace('-pooler.', '.')
  : process.env.DATABASE_URL;

/**
 * Multi-Cell Neon Endpoint Fix:
 * In newer Neon multi-cell environments (e.g. *.c-2.us-east-2.aws.neon.tech),
 * the default fetchEndpoint in @neondatabase/serverless replaces the first subdomain with 'api.',
 * turning it into 'api.c-2.us-east-2.aws.neon.tech', which fails DNS resolution (getaddrinfo ENOTFOUND).
 * Setting fetchEndpoint directly to `https://${host}/sql` routes queries directly to the compute host.
 */
neonConfig.fetchEndpoint = (host) => `https://${host}/sql`;

// Create a singleton instance of the sql query function
export const sql = neon(dbUrl);

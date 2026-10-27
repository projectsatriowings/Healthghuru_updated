import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const MONTHS_FULL = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

/**
 * Formats a date deterministically using UTC to guarantee 100% identical output
 * between Server-Side Rendering (Node.js) and Client-Side Hydration (Browser)
 * regardless of the user's locale or timezone.
 * Example output: "Sep 9, 2026"
 */
export function formatDate(dateInput: string | Date | undefined | null): string {
  if (!dateInput) return '';
  const d = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  if (isNaN(d.getTime())) return '';
  return `${MONTHS_SHORT[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}`;
}

/**
 * Formats month and year deterministically using UTC.
 * Example output: "September 2026"
 */
export function formatMonthYear(dateInput: string | Date | undefined | null): string {
  if (!dateInput) return '';
  const d = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  if (isNaN(d.getTime())) return '';
  return `${MONTHS_FULL[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

/**
 * Formats a timestamp into an intuitive, real-time relative string:
 * - < 60 seconds: "Just now"
 * - < 60 minutes: "Xm ago"
 * - < 24 hours: "Xh ago"
 * - < 7 days: "Xd ago"
 * - Otherwise: formatted date
 */
export function formatTimeAgo(dateInput: string | Date | undefined | null): string {
  if (!dateInput) return 'Just now';
  const d = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  const time = d.getTime();
  if (isNaN(time)) return 'Just now';

  const diffSec = Math.floor((Date.now() - time) / 1000);
  if (diffSec < 60) return 'Just now';
  if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
  if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;
  if (diffSec < 604800) return `${Math.floor(diffSec / 86400)}d ago`;
  return formatDate(dateInput);
}

const CATEGORY_FALLBACK_IMAGES: Record<string, string> = {
  cancer: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1200&h=750&q=80',
  heart: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=1200&h=750&q=80',
  cardiology: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=1200&h=750&q=80',
  diabetes: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=1200&h=750&q=80',
  fitness: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1200&h=750&q=80',
  nutrition: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=1200&h=750&q=80',
  pediatrics: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=1200&h=750&q=80',
  mental: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&h=750&q=80',
  'mental health': 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&h=750&q=80',
  ayurveda: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1200&h=750&q=80',
  "women's health": 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=1200&h=750&q=80',
  'womens-health': 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=1200&h=750&q=80',
  medical: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=1200&h=750&q=80',
  research: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=1200&h=750&q=80',
  hospital: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=1200&h=750&q=80',
  magazine: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&h=800&q=80',
  short: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&h=1067&q=80',
  reels: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&h=1067&q=80',
};

const DEFAULT_EDITORIAL_FALLBACK = 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=1200&h=750&q=80';

/**
 * Sanitizes and validates image URLs. If the URL is empty, or is an expired/blocked
 * hotlinking Instagram/Facebook CDN link, it returns a verified health placeholder image
 * with a standardized 16:10 aspect ratio matching editorial layouts.
 */
export function getSafeImageUrl(
  url?: string | null,
  category?: string | null,
  defaultFallback: string = DEFAULT_EDITORIAL_FALLBACK
): string {
  if (!url || typeof url !== 'string' || url.trim() === '') {
    if (category) {
      const catKey = category.toLowerCase();
      if (CATEGORY_FALLBACK_IMAGES[catKey]) {
        return CATEGORY_FALLBACK_IMAGES[catKey];
      }
      for (const [key, fallbackUrl] of Object.entries(CATEGORY_FALLBACK_IMAGES)) {
        if (catKey.includes(key)) {
          return fallbackUrl;
        }
      }
    }
    return defaultFallback;
  }

  let trimmed = url.trim();

  // If a localhost or 127.0.0.1 absolute URL was saved in development, normalize to relative /uploads/...
  if (trimmed.includes('localhost:3000/uploads/')) {
    trimmed = trimmed.substring(trimmed.indexOf('/uploads/'));
  } else if (trimmed.includes('127.0.0.1:3000/uploads/')) {
    trimmed = trimmed.substring(trimmed.indexOf('/uploads/'));
  }

  // Handle blocked/expired Meta/Instagram CDN hotlinks
  if (
    trimmed.includes('cdninstagram.com') ||
    trimmed.includes('fbcdn.net') ||
    trimmed.includes('instagram.f')
  ) {
    if (category) {
      const catKey = category.toLowerCase();
      if (CATEGORY_FALLBACK_IMAGES[catKey]) {
        return CATEGORY_FALLBACK_IMAGES[catKey];
      }
      for (const [key, fallbackUrl] of Object.entries(CATEGORY_FALLBACK_IMAGES)) {
        if (catKey.includes(key)) {
          return fallbackUrl;
        }
      }
    }
    return defaultFallback;
  }

  // Auto-serve modern WebP for local legacy PNG/JPG assets in /images/
  if (trimmed.startsWith('/images/') && (trimmed.endsWith('.png') || trimmed.endsWith('.jpg')) && !trimmed.includes('logo')) {
    trimmed = trimmed.replace(/\.(png|jpg)$/, '.webp');
  }

  return trimmed;
}

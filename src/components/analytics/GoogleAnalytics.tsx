"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, Suspense } from "react";

interface GoogleAnalyticsRouteChangeProps {
  gaId: string;
}

function RouteChangeTracker({ gaId }: GoogleAnalyticsRouteChangeProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!pathname || typeof window === "undefined" || !("gtag" in window)) return;
    const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : "");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).gtag("config", gaId, {
      page_path: url,
    });
  }, [pathname, searchParams, gaId]);

  return null;
}

/**
 * Tracks client-side SPA route transitions in Next.js App Router for Google Analytics 4.
 * Wrapped in Suspense to satisfy Next.js static generation rules for useSearchParams.
 */
export function GoogleAnalyticsRouteChange({ gaId }: GoogleAnalyticsRouteChangeProps) {
  return (
    <Suspense fallback={null}>
      <RouteChangeTracker gaId={gaId} />
    </Suspense>
  );
}

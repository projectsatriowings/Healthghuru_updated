'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

export function UserVisitTracker() {
  const pathname = usePathname();
  const visitorIdRef = useRef<string>('');

  useEffect(() => {
    // Generate or retrieve persistent visitor ID in localStorage (1 real human visitor = 1 unique visitor count)
    try {
      let vid = localStorage.getItem('hg_real_visitor_id');
      if (!vid || vid.length < 8) {
        vid = 'vis_' + Math.random().toString(36).substring(2, 11) + '_' + Date.now().toString(36);
        localStorage.setItem('hg_real_visitor_id', vid);
      }
      visitorIdRef.current = vid;
    } catch {
      if (!visitorIdRef.current) {
        visitorIdRef.current = 'anon_' + Math.random().toString(36).substring(2, 11);
      }
    }

    const sendHeartbeat = () => {
      // Only ping if tab is active or page is visible to avoid ghost sessions
      if (typeof document !== 'undefined' && document.visibilityState === 'hidden') {
        return;
      }

      if (!visitorIdRef.current) return;

      const payload = JSON.stringify({
        visitorId: visitorIdRef.current,
        path: window.location.pathname || '/',
      });

      fetch('/api/analytics/heartbeat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: payload,
        keepalive: true,
      }).catch(() => {});
    };

    // Send immediately on page visit / route transition
    sendHeartbeat();

    // Responsive heartbeat interval every 15 seconds while actively browsing
    const interval = setInterval(sendHeartbeat, 15000);

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        sendHeartbeat();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [pathname]);

  return null;
}

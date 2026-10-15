'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Globe, Users, TrendingUp, Radio, ExternalLink, X, RefreshCw, Eye } from 'lucide-react';

interface LiveVisitorsData {
  activeViewers: number;
  realActiveSessions: number;
  todayUniqueVisits: number;
  activePages: Array<{ path: string; count: number }>;
  timestamp: number;
}

export function LiveViewersBadge() {
  const [data, setData] = useState<LiveVisitorsData>({
    activeViewers: 0,
    realActiveSessions: 0,
    todayUniqueVisits: 0,
    activePages: [],
    timestamp: Date.now(),
  });
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const popoverRef = useRef<HTMLDivElement | null>(null);

  // Fetch real live visitors stats
  const fetchLiveStats = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/admin/live-visitors', { cache: 'no-store' });
      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          setData(json);
        }
      }
    } catch {
      // Keep existing data without crashing
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveStats();
    // Poll every 6 seconds for genuine real-time active session updates
    const timer = setInterval(fetchLiveStats, 6000);
    return () => clearInterval(timer);
  }, []);

  // Close popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const count = data.activeViewers ?? 0;
  const formattedCount = new Intl.NumberFormat('en-US').format(count);
  const formattedToday = new Intl.NumberFormat('en-US').format(data.todayUniqueVisits ?? 0);
  const viewerLabel = count === 1 ? 'Viewer' : 'Viewers';

  return (
    <div className="relative inline-block text-left" ref={popoverRef}>
      {/* ── Main Pill matching NewsGhuru reference screenshot ── */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        title="Real active visitor count across HealthGhuru portal"
        className="group relative inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#a1400e]/90 hover:bg-[#92370c] active:scale-98 text-white border border-white/20 shadow-md shadow-orange-950/20 transition-all duration-200 cursor-pointer select-none"
      >
        {/* Pulsing Green Dot (active if >= 1) */}
        <span className="relative flex h-2.5 w-2.5 shrink-0">
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${count > 0 ? 'bg-[#4ade80] opacity-80' : 'bg-emerald-400 opacity-40'}`} />
          <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${count > 0 ? 'bg-[#22c55e] ring-2 ring-emerald-300/40' : 'bg-emerald-500'}`} />
        </span>

        {/* Cyan Globe Icon */}
        <span className="text-[#38bdf8] flex items-center justify-center leading-none text-sm">
          <Globe size={14} className="text-[#38bdf8] drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)]" />
        </span>

        {/* Real Viewers Counter Text */}
        <span className="font-heading font-extrabold text-xs sm:text-[13px] tracking-wide text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">
          {formattedCount} {viewerLabel}
        </span>
      </button>

      {/* ── Detailed Telemetry Popover / Dropdown ── */}
      {isOpen && (
        <div className="absolute right-0 mt-2.5 w-80 sm:w-96 rounded-2xl bg-white border border-slate-200 shadow-2xl p-5 z-50 text-dark animate-in fade-in slide-in-from-top-2 duration-150">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <h3 className="font-heading font-extrabold text-sm text-slate-900">
                Real-Time Visitor Telemetry
              </h3>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={fetchLiveStats}
                disabled={isLoading}
                className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors cursor-pointer"
                title="Refresh live counter"
              >
                <RefreshCw size={13} className={isLoading ? 'animate-spin text-emerald-600' : ''} />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X size={15} />
              </button>
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 gap-3 my-4">
            <div className="p-3.5 rounded-xl bg-gradient-to-br from-orange-50 to-amber-50/60 border border-orange-200/80">
              <div className="flex items-center gap-1.5 text-[11px] font-heading font-bold text-orange-700 uppercase tracking-wider mb-1">
                <Radio size={12} className="text-orange-600 animate-pulse" />
                <span>Real Active</span>
              </div>
              <div className="text-2xl font-heading font-black text-slate-900">
                {formattedCount}
              </div>
              <div className="text-[10px] text-orange-800/80 mt-0.5 font-medium">
                Browsing portal in past 2 mins
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50/60 border border-emerald-200/80">
              <div className="flex items-center gap-1.5 text-[11px] font-heading font-bold text-emerald-700 uppercase tracking-wider mb-1">
                <TrendingUp size={12} className="text-emerald-600" />
                <span>Today Unique</span>
              </div>
              <div className="text-2xl font-heading font-black text-slate-900">
                {formattedToday}
              </div>
              <div className="text-[10px] text-emerald-800/80 mt-0.5 font-medium">
                Unique visitors recorded today
              </div>
            </div>
          </div>

          {/* Real Active Section Breakdown */}
          <div className="space-y-2 pt-1">
            <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
              <span>Active Browsing Locations</span>
              <span>Sessions</span>
            </div>

            {data.activePages && data.activePages.length > 0 ? (
              <div className="space-y-1.5 text-xs text-slate-700 max-h-48 overflow-y-auto">
                {data.activePages.map((page, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
                    <span className="font-semibold truncate max-w-[220px]" title={page.path}>
                      {page.path === '/' ? '🏠 Homepage' : page.path}
                    </span>
                    <span className="font-mono font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full text-[11px]">
                      {page.count} active
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-center text-xs text-slate-500">
                <Eye size={16} className="mx-auto mb-1 text-slate-400" />
                <span>No active public visitors at this moment.</span>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  Open <span className="font-mono text-emerald-700 font-bold">http://localhost:3000</span> in another tab/device to see it increment live!
                </p>
              </div>
            )}
          </div>

          {/* Footer note */}
          <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-[10px] font-mono text-slate-400">
            <span>● 100% Real-Time DB Heartbeat</span>
            <span className="text-emerald-600 font-semibold">100% Real • 0 Fake Views</span>
          </div>
        </div>
      )}
    </div>
  );
}

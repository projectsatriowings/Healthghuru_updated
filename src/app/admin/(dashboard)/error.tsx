'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertCircle, RefreshCw, LogIn, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Admin Dashboard Error:', error);
  }, [error]);

  return (
    <div className="min-h-[70vh] bg-slate-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200 p-8 text-center shadow-lg space-y-6">
        <div className="w-14 h-14 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
          <AlertCircle size={32} />
        </div>

        <div className="space-y-2">
          <h2 className="font-heading font-extrabold text-2xl text-slate-900">
            Admin Error
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            {error?.message && !error.message.includes('fetch failed')
              ? error.message
              : 'Unable to load admin dashboard data. Please check database connectivity or sign in again.'}
          </p>
          {error?.digest && (
            <p className="text-[11px] font-mono text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg break-all">
              Digest: {error.digest}
            </p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Button
            variant="primary"
            size="sm"
            onClick={() => reset()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2"
          >
            <RefreshCw size={14} />
            <span>Try Again</span>
          </Button>
          <Link
            href="/admin/login"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <LogIn size={14} />
            <span>Admin Login</span>
          </Link>
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors"
          >
            <ArrowLeft size={14} />
            <span>Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}


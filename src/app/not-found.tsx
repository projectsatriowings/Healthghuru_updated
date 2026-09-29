import Link from 'next/link';
import {
  Home,
  Search,
  ArrowRight,
  Compass,
  FileQuestion,
  Activity,
  Heart,
  Stethoscope,
  Building2,
  Calculator
} from 'lucide-react';

export default function NotFound() {
  return (
    <div className="w-full min-h-[70vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-50/80 via-white to-emerald-50/20">
      <div className="max-w-2xl w-full text-center space-y-8">
        
        {/* Visual 404 Icon & Badge */}
        <div className="flex flex-col items-center justify-center">
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-tr from-emerald-100 via-emerald-50 to-orange-50 border border-emerald-500/20 shadow-md flex items-center justify-center mb-6">
            <span className="font-display font-black text-4xl sm:text-5xl bg-gradient-to-r from-[#16A34A] to-[#f06d2f] bg-clip-text text-transparent">
              404
            </span>
            <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-[#f06d2f] text-white flex items-center justify-center shadow-xs">
              <FileQuestion size={16} />
            </div>
          </div>

          <h1 className="font-display font-extrabold text-2xl sm:text-4xl text-slate-900 tracking-tight">
            Page Not Found
          </h1>
          <p className="mt-2.5 text-sm sm:text-base text-slate-500 max-w-md mx-auto leading-relaxed">
            The medical article, healthcare center, or page you are looking for doesn&apos;t exist or may have been relocated.
          </p>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-heading font-bold text-white px-6 py-3 rounded-full bg-gradient-to-r from-[#16A34A] to-[#22C55E] hover:from-emerald-700 hover:to-emerald-600 shadow-md shadow-emerald-600/20 transition-all hover:scale-[1.02]"
          >
            <Home size={16} />
            <span>Return to Homepage</span>
          </Link>

          <Link
            href="/search"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-heading font-bold text-slate-700 hover:text-[#16A34A] px-6 py-3 rounded-full bg-white border border-slate-200 shadow-xs hover:border-emerald-500/40 transition-all"
          >
            <Search size={16} />
            <span>Search Articles &amp; Topics</span>
          </Link>
        </div>

        {/* Helpful Health Hub Navigation Links */}
        <div className="pt-8 border-t border-slate-200/80">
          <p className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold mb-4">
            Explore Popular Health Categories &amp; Portals
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 max-w-xl mx-auto">
            <Link
              href="/category/cancer"
              className="p-3 rounded-xl bg-white border border-slate-200/70 hover:border-rose-300 hover:bg-rose-50/40 transition-all text-xs font-heading font-semibold text-slate-700 flex items-center justify-center gap-1.5 shadow-2xs"
            >
              <Activity size={14} className="text-rose-500" />
              <span>Cancer</span>
            </Link>
            <Link
              href="/category/heart"
              className="p-3 rounded-xl bg-white border border-slate-200/70 hover:border-red-300 hover:bg-red-50/40 transition-all text-xs font-heading font-semibold text-slate-700 flex items-center justify-center gap-1.5 shadow-2xs"
            >
              <Heart size={14} className="text-red-500" />
              <span>Heart Health</span>
            </Link>
            <Link
              href="/hospitals"
              className="p-3 rounded-xl bg-white border border-slate-200/70 hover:border-emerald-300 hover:bg-emerald-50/40 transition-all text-xs font-heading font-semibold text-slate-700 flex items-center justify-center gap-1.5 shadow-2xs"
            >
              <Building2 size={14} className="text-[#16A34A]" />
              <span>Hospitals</span>
            </Link>
            <Link
              href="/health-tools/bmi-calculator"
              className="p-3 rounded-xl bg-white border border-slate-200/70 hover:border-blue-300 hover:bg-blue-50/40 transition-all text-xs font-heading font-semibold text-slate-700 flex items-center justify-center gap-1.5 shadow-2xs"
            >
              <Calculator size={14} className="text-blue-500" />
              <span>Health Tools</span>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}

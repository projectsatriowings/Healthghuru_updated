/* eslint-disable @typescript-eslint/no-explicit-any */
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { sql } from '@/lib/db';
import Link from 'next/link';
import Image from 'next/image';
import {
  Building2,
  ShieldCheck,
  Phone,
  Globe,
  MapPin,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Stethoscope,
  Clock,
  Award,
  Video,
  Play,
  HeartPulse,
  Share2,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { getSafeImageUrl } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const cleanSlug = decodeURIComponent(params.slug || '').trim().toLowerCase();
  const items = await sql`
    SELECT name, about, city, state FROM hospitals 
    WHERE LOWER(slug) = ${cleanSlug} OR slug = ${params.slug} 
    LIMIT 1
  `;
  if (items.length > 0) {
    const hosp = items[0];
    return {
      title: `${hosp.name} — Accredited Medical Center | HealthGhuru`,
      description: hosp.about || `Explore medical specializations, key facilities, and verified doctors at ${hosp.name} in ${hosp.city}, ${hosp.state}.`,
      alternates: {
        canonical: `/hospitals/${cleanSlug}`,
      },
    };
  }
  return {
    title: 'Hospital Details | HealthGhuru',
    alternates: {
      canonical: `/hospitals/${cleanSlug}`,
    },
  };
}

export default async function HospitalDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const cleanSlug = decodeURIComponent(params.slug || '').trim().toLowerCase();

  // 1. Fetch Hospital Details
  let hospitals = await sql`
    SELECT * FROM hospitals 
    WHERE LOWER(slug) = ${cleanSlug} OR slug = ${params.slug} 
    LIMIT 1
  `;

  if (!hospitals || hospitals.length === 0) {
    const slugName = cleanSlug.replace(/-/g, ' ');
    hospitals = await sql`
      SELECT * FROM hospitals 
      WHERE LOWER(name) LIKE ${`%${slugName}%`}
      LIMIT 1
    `;
  }

  if (!hospitals || hospitals.length === 0) {
    const firstWord = cleanSlug.split('-')[0];
    if (firstWord && firstWord.length > 2) {
      hospitals = await sql`
        SELECT * FROM hospitals 
        WHERE LOWER(name) LIKE ${`%${firstWord}%`} OR LOWER(slug) LIKE ${`%${firstWord}%`}
        LIMIT 1
      `;
    }
  }

  if (!hospitals || hospitals.length === 0) {
    hospitals = await sql`
      SELECT * FROM hospitals 
      ORDER BY is_sponsored DESC, is_verified DESC 
      LIMIT 1
    `;
  }

  if (!hospitals || hospitals.length === 0) {
    notFound();
  }

  const hospital = hospitals[0];

  // 2. Fetch Doctors affiliated with this hospital
  const doctors = await sql`
    SELECT * FROM doctors 
    WHERE hospital_id = ${hospital.id} 
       OR LOWER(hospital_name) LIKE ${`%${hospital.name.toLowerCase()}%`}
    ORDER BY is_verified DESC, experience_years DESC
    LIMIT 6
  `;

  // 3. Fetch Doctor Interviews related to this hospital
  const interviews = await sql`
    SELECT di.*, d.name as doctor_name, d.photo_url as doctor_photo, d.specialization as doctor_specialization
    FROM doctor_interviews di
    LEFT JOIN doctors d ON di.doctor_id = d.id
    WHERE di.hospital_id = ${hospital.id}
    ORDER BY di.published_at DESC
    LIMIT 4
  `;

  // 4. Fetch Other Accredited Hospitals for the sidebar
  const otherHospitals = await sql`
    SELECT id, name, slug, city, state, cover_url, is_verified, is_sponsored 
    FROM hospitals 
    WHERE slug != ${params.slug}
    ORDER BY is_sponsored DESC, is_verified DESC
    LIMIT 3
  `;

  const coverImage = getSafeImageUrl(
    hospital.cover_url,
    'hospital',
    'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&w=1400&q=80'
  );

  return (
    <div className="w-full bg-slate-50/60 min-h-screen py-6 sm:py-10">
      <div className="max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-slate-500 font-heading mb-6 overflow-x-auto whitespace-nowrap">
          <Link href="/" className="hover:text-[#16A34A] transition-colors">Home</Link>
          <span className="text-slate-300">/</span>
          <Link href="/hospitals" className="hover:text-[#16A34A] transition-colors">Hospitals &amp; Medical Centers</Link>
          <span className="text-slate-300">/</span>
          <span className="text-[#16A34A] font-bold truncate max-w-sm">{hospital.name}</span>
        </nav>

        {/* Hero Section */}
        <div className="relative rounded-3xl overflow-hidden bg-white border border-slate-200/80 shadow-md mb-8">
          {/* Cover Image with Vignette & Gradient */}
          <div className="relative h-[240px] sm:h-[320px] lg:h-[380px] w-full bg-slate-900 overflow-hidden">
            <Image
              src={coverImage}
              alt={hospital.name}
              fill
              priority
              className="object-cover opacity-85"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-black/20" />

            {/* Badges Overlay */}
            <div className="absolute top-4 sm:top-6 left-4 sm:left-6 flex flex-wrap gap-2">
              {hospital.is_sponsored && (
                <span className="bg-[#f06d2f] text-white text-[10px] sm:text-xs font-mono font-bold px-3 py-1 rounded-full flex items-center gap-1.5 shadow-md">
                  <Sparkles size={12} />
                  <span>PREMIER SPONSORED PARTNER</span>
                </span>
              )}
              {hospital.is_verified && (
                <span className="bg-emerald-600 text-white text-[10px] sm:text-xs font-mono font-bold px-3 py-1 rounded-full flex items-center gap-1.5 shadow-md">
                  <ShieldCheck size={12} />
                  <span>NABH / JCI ACCREDITED</span>
                </span>
              )}
            </div>

            {/* Title & Location in Hero Image Bottom */}
            <div className="absolute bottom-4 sm:bottom-8 left-4 sm:left-8 right-4 sm:right-8 text-white">
              <div className="flex items-center gap-2 text-emerald-300 text-xs sm:text-sm font-semibold mb-1">
                <MapPin size={16} className="text-[#f06d2f] shrink-0" />
                <span>{hospital.city}{hospital.state ? `, ${hospital.state}` : ''}</span>
                <span className="text-slate-400">•</span>
                <span>Tertiary Care &amp; Clinical Research Center</span>
              </div>
              <h1 className="font-display font-extrabold text-2xl sm:text-4xl lg:text-5xl text-white tracking-tight drop-shadow-sm">
                {hospital.name}
              </h1>
            </div>
          </div>

          {/* Quick Action Bar under Hero */}
          <div className="p-4 sm:p-6 bg-white flex flex-wrap items-center justify-between gap-4 border-t border-slate-100">
            <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm font-medium text-slate-600">
              {hospital.phone && (
                <a
                  href={`tel:${hospital.phone}`}
                  className="flex items-center gap-2 text-[#16A34A] font-bold hover:underline"
                >
                  <div className="w-8 h-8 rounded-full bg-emerald-50 text-[#16A34A] flex items-center justify-center">
                    <Phone size={15} />
                  </div>
                  <span>{hospital.phone}</span>
                </a>
              )}
              {hospital.website_url && (
                <a
                  href={hospital.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-slate-700 hover:text-[#16A34A] transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center">
                    <Globe size={15} />
                  </div>
                  <span>Official Portal</span>
                </a>
              )}
            </div>

            <div className="flex items-center gap-3">
              <a
                href={hospital.phone ? `tel:${hospital.phone}` : '#contact'}
                className="inline-flex items-center gap-2 text-xs sm:text-sm font-heading font-bold text-white px-5 py-2.5 rounded-full bg-gradient-to-r from-[#16A34A] to-[#22C55E] hover:from-emerald-700 hover:to-emerald-600 shadow-md shadow-emerald-600/20 transition-all hover:scale-[1.02]"
              >
                <Calendar size={15} />
                <span>Book Consultation</span>
              </a>
            </div>
          </div>
        </div>

        {/* 2-Column Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Column (Cols 1-8) */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Overview & About */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-2.5 h-6 rounded-full bg-[#16A34A]" />
                <h2 className="font-heading font-extrabold text-xl sm:text-2xl text-slate-900 tracking-tight">
                  About {hospital.name}
                </h2>
              </div>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                {hospital.about || `${hospital.name} is a premier healthcare institution providing advanced diagnostic, surgical, and therapeutic medical treatments in ${hospital.city}.`}
              </p>
            </div>

            {/* Core Specializations */}
            {hospital.specializations && hospital.specializations.length > 0 && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
                <div className="flex items-center gap-3 mb-5">
                  <span className="w-2.5 h-6 rounded-full bg-[#f06d2f]" />
                  <h2 className="font-heading font-extrabold text-xl sm:text-2xl text-slate-900 tracking-tight">
                    Clinical Centers of Excellence
                  </h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {hospital.specializations.map((spec: string, idx: number) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-500/20 hover:border-emerald-500/40 transition-colors"
                    >
                      <div className="w-9 h-9 rounded-xl bg-white text-[#16A34A] flex items-center justify-center shrink-0 shadow-2xs">
                        <HeartPulse size={18} />
                      </div>
                      <div>
                        <h3 className="font-heading font-bold text-xs sm:text-sm text-slate-900">{spec}</h3>
                        <p className="text-[11px] text-emerald-800 font-medium">Department &amp; Inpatient Care</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Key Facilities & Medical Infrastructure */}
            {hospital.facilities && hospital.facilities.length > 0 && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
                <div className="flex items-center gap-3 mb-5">
                  <span className="w-2.5 h-6 rounded-full bg-[#16A34A]" />
                  <h2 className="font-heading font-extrabold text-xl sm:text-2xl text-slate-900 tracking-tight">
                    Advanced Infrastructure &amp; Facilities
                  </h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {hospital.facilities.map((fac: string, idx: number) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200/70"
                    >
                      <CheckCircle2 size={16} className="text-[#16A34A] shrink-0 mt-0.5" />
                      <span className="text-xs sm:text-sm font-semibold text-slate-800">{fac}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Affiliated Doctors Section */}
            {doctors && doctors.length > 0 && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
                <div className="flex items-center justify-between gap-4 mb-6">
                  <div className="flex items-center gap-3">
                    <span className="w-2.5 h-6 rounded-full bg-[#16A34A]" />
                    <h2 className="font-heading font-extrabold text-xl sm:text-2xl text-slate-900 tracking-tight">
                      Affiliated Specialists &amp; Consultants
                    </h2>
                  </div>
                  <Link
                    href="/doctors"
                    className="text-xs font-bold text-[#16A34A] hover:underline flex items-center gap-1"
                  >
                    <span>All Doctors</span>
                    <ArrowRight size={13} />
                  </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {doctors.map((doc: any) => (
                    <div
                      key={doc.id}
                      className="p-4 rounded-2xl border border-slate-200/70 bg-white hover:border-emerald-500/40 hover:shadow-md transition-all flex items-start gap-3.5 group"
                    >
                      <div className="relative w-14 h-14 rounded-full overflow-hidden shrink-0 border-2 border-emerald-500/30">
                        <Image
                          src={doc.photo_url || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=200&q=80'}
                          alt={doc.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1">
                          <h4 className="font-heading font-bold text-sm text-slate-900 truncate group-hover:text-[#16A34A] transition-colors">
                            {doc.name}
                          </h4>
                          {doc.is_verified && <ShieldCheck size={14} className="text-[#16A34A] shrink-0" />}
                        </div>
                        <p className="text-xs text-[#f06d2f] font-semibold">{doc.specialization}</p>
                        <p className="text-[11px] text-slate-400 font-mono mt-0.5">{doc.experience_years} yrs exp • {doc.qualifications}</p>
                        <div className="mt-2.5 flex items-center gap-2">
                          <Link
                            href={`/search?q=${encodeURIComponent(doc.name)}`}
                            className="text-[11px] font-bold text-[#16A34A] hover:underline"
                          >
                            View Articles &rarr;
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Clinical Interviews with Doctors from this Hospital */}
            {interviews && interviews.length > 0 && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
                <div className="flex items-center justify-between gap-4 mb-6">
                  <div className="flex items-center gap-3">
                    <span className="w-2.5 h-6 rounded-full bg-[#f06d2f]" />
                    <h2 className="font-heading font-extrabold text-xl sm:text-2xl text-slate-900 tracking-tight">
                      Clinical Perspectives &amp; Interviews
                    </h2>
                  </div>
                  <Link
                    href="/interviews"
                    className="text-xs font-bold text-[#16A34A] hover:underline flex items-center gap-1"
                  >
                    <span>All Interviews</span>
                    <ArrowRight size={13} />
                  </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {interviews.map((item: any) => (
                    <Link
                      key={item.id}
                      href={`/interviews/${item.slug}`}
                      className="group block rounded-2xl overflow-hidden border border-slate-200/80 hover:border-emerald-500/40 hover:shadow-md transition-all bg-white"
                    >
                      <div className="relative aspect-[16/9] w-full bg-slate-900 overflow-hidden">
                        <Image
                          src={item.cover_image_url || 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80'}
                          alt={item.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                          <div className="w-10 h-10 rounded-full bg-[#16A34A] text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                            <Play size={16} className="fill-white translate-x-0.5" />
                          </div>
                        </div>
                      </div>
                      <div className="p-4">
                        <h4 className="font-heading font-bold text-sm text-slate-900 group-hover:text-[#16A34A] transition-colors line-clamp-2">
                          {item.title}
                        </h4>
                        <p className="text-xs text-slate-500 line-clamp-2 mt-1.5">{item.summary}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Sidebar Column (Cols 9-12) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Quick Contact & Directions Card */}
            <div id="contact" className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-5">
              <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
                <Building2 size={20} className="text-[#16A34A]" />
                <h3 className="font-heading font-bold text-base text-slate-900">Hospital Contact &amp; Desk</h3>
              </div>

              <div className="space-y-3.5 text-xs text-slate-600">
                <div className="flex items-start gap-2.5">
                  <MapPin size={16} className="text-[#f06d2f] shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-slate-800">Address &amp; Campus</p>
                    <p>{hospital.name}</p>
                    <p>{hospital.city}{hospital.state ? `, ${hospital.state}` : ''}</p>
                  </div>
                </div>

                {hospital.phone && (
                  <div className="flex items-start gap-2.5">
                    <Phone size={16} className="text-[#16A34A] shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-slate-800">Emergency &amp; Appointments</p>
                      <a href={`tel:${hospital.phone}`} className="text-[#16A34A] font-bold hover:underline">
                        {hospital.phone}
                      </a>
                    </div>
                  </div>
                )}

                {hospital.website_url && (
                  <div className="flex items-start gap-2.5">
                    <Globe size={16} className="text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-slate-800">Hospital Web Portal</p>
                      <a
                        href={hospital.website_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline break-all"
                      >
                        {hospital.website_url}
                      </a>
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-2">
                <a
                  href={hospital.website_url || (hospital.phone ? `tel:${hospital.phone}` : '#')}
                  target={hospital.website_url ? "_blank" : undefined}
                  rel={hospital.website_url ? "noopener noreferrer" : undefined}
                  className="w-full text-center block text-xs font-heading font-bold bg-[#16A34A] hover:bg-[#15803d] text-white py-3 px-4 rounded-xl shadow-xs transition-colors"
                >
                  Visit Official Hospital Website
                </a>
              </div>
            </div>

            {/* Quality & Accreditation Callout */}
            <div className="rounded-3xl p-6 bg-gradient-to-br from-emerald-50 to-teal-50/60 border border-emerald-500/20 shadow-xs">
              <div className="flex items-center gap-2 mb-2 text-[#16A34A]">
                <ShieldCheck size={20} />
                <h4 className="font-heading font-bold text-sm text-slate-900">Quality Assured</h4>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed mb-3">
                This healthcare provider is verified through HealthGhuru&apos;s healthcare registry, maintaining clinical safety compliance and accredited specialist review.
              </p>
              <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold text-emerald-800 bg-white/80 px-3 py-1.5 rounded-lg border border-emerald-500/20">
                <span>NABH &bull; JCI COMPLIANT</span>
              </div>
            </div>

            {/* Other Accredited Hospitals */}
            {otherHospitals && otherHospitals.length > 0 && (
              <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h3 className="font-heading font-bold text-sm text-slate-900">Other Premier Centers</h3>
                  <Link href="/hospitals" className="text-xs text-[#16A34A] font-bold hover:underline">
                    View All
                  </Link>
                </div>

                <div className="space-y-3">
                  {otherHospitals.map((hosp: any) => (
                    <Link
                      key={hosp.id}
                      href={`/hospitals/${hosp.slug}`}
                      className="group flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-200"
                    >
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-slate-100 shrink-0">
                        <Image
                          src={getSafeImageUrl(hosp.cover_url, 'hospital', 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&w=200&q=80')}
                          alt={hosp.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="font-heading font-bold text-xs text-slate-900 truncate group-hover:text-[#16A34A] transition-colors">
                          {hosp.name}
                        </h4>
                        <p className="text-[11px] text-slate-400 font-medium truncate">{hosp.city}, {hosp.state}</p>
                      </div>
                      <ArrowRight size={14} className="text-slate-300 group-hover:text-[#16A34A] group-hover:translate-x-0.5 transition-all shrink-0" />
                    </Link>
                  ))}
                </div>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}

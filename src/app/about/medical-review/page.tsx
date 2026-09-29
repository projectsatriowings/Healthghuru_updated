import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import {
  ShieldCheck,
  CheckCircle2,
  Stethoscope,
  Award,
  BookOpen,
  ArrowRight,
  Sparkles,
  FileCheck2,
  Users,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { ScrollReveal } from '@/components/ui/ScrollReveal';

export const metadata: Metadata = {
  title: 'Editorial Medical Review Standards & Clinical Integrity | HealthGhuru',
  description:
    'Learn how HealthGhuru guarantees clinical precision, ethical medical journalism, and multi-tier physician review for all public health intelligence.',
};

const REVIEW_PILLARS = [
  {
    step: '01',
    title: 'Primary Source Grounding',
    desc: 'Every article, clinical summary, and health guide originates from peer-reviewed scientific journals (PubMed, NEJM, The Lancet, JAMA), health agency directives (WHO, CDC, FDA, ICMR), or accredited academic hospitals.',
    icon: BookOpen,
  },
  {
    step: '02',
    title: 'Multi-Tier Physician Review',
    desc: 'Board-certified medical specialists, senior clinical fellows, and licensed dietitians rigorously audit draft claims, drug interactions, contraindications, and statistical validity before public dissemination.',
    icon: Stethoscope,
  },
  {
    step: '03',
    title: 'Zero Conflict Policy',
    desc: 'Editorial content remains strictly insulated from commercial partnerships. Any sponsored content, clinical partner features, or institutional placements are clearly labeled and audited independently.',
    icon: ShieldCheck,
  },
  {
    step: '04',
    title: 'Continuous Protocol Updates',
    desc: 'Medical recommendations evolve. Our editorial and medical boards conduct quarterly audits to revise articles whenever new clinical trials, updated drug advisories, or revised clinical guidelines are published.',
    icon: FileCheck2,
  },
];

const ADVISORY_BOARD = [
  {
    name: 'Dr. Arvind Deshmukh',
    title: 'Chief Interventional Cardiologist',
    credential: 'MD, DM (Cardiology), FACC',
    institution: 'Apex Heart & Vascular Institute',
    photo: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80',
    specialty: 'Cardiovascular Risk Stratification & Lipidology',
  },
  {
    name: 'Dr. Rohini Sundaram',
    title: 'Senior Medical Oncologist & Clinical Geneticist',
    credential: 'MD, DNB (Medical Oncology), ESMO Certified',
    institution: 'National Cancer Research & Care Centre',
    photo: 'https://images.unsplash.com/photo-1594824813515-546059bf0d19?auto=format&fit=crop&w=400&q=80',
    specialty: 'Targeted Therapies & Liquid Biopsies',
  },
  {
    name: 'Dr. Alok Sen',
    title: 'Consultant Pediatric Pulmonologist',
    credential: 'MD (Pediatrics), Fellowship in Pediatric Allergy (UK)',
    institution: "St. Jude Children's Medical Pavilion",
    photo: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=400&q=80',
    specialty: 'Pediatric Immunity & Respiratory Health',
  },
  {
    name: 'Dr. Ananya Roy',
    title: 'Consultant Endocrinologist & Diabetologist',
    credential: 'MBBS, MD, DM (Endocrinology)',
    institution: 'Max Healthcare Institute',
    photo: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80',
    specialty: 'Metabolic Disorders & Continuous Glucose Monitoring',
  },
];

export default function MedicalReviewPage() {
  return (
    <div className="w-full bg-[#f8faf8] min-h-screen py-8 sm:py-12">
      <div className="max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-slate-500 font-heading mb-6 overflow-x-auto whitespace-nowrap">
          <Link href="/" className="hover:text-[#16A34A] transition-colors">
            Home
          </Link>
          <span className="text-slate-300">/</span>
          <Link href="/about" className="hover:text-[#16A34A] transition-colors">
            About Us
          </Link>
          <span className="text-slate-300">/</span>
          <span className="text-[#16A34A] font-bold">Medical Review Process</span>
        </nav>

        {/* Hero Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 lg:p-12 border border-emerald-500/20 shadow-xs mb-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-emerald-100/40 via-teal-50/30 to-transparent rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-500/30 text-[#16A34A] text-xs font-mono font-bold uppercase tracking-wider mb-4">
              <ShieldCheck size={14} className="text-[#16A34A]" />
              <span>CLINICAL EXCELLENCE &amp; TRUST PROTOCOL</span>
            </div>

            <h1 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl text-slate-900 tracking-tight leading-tight">
              Medical Review Process &amp; Clinical Integrity
            </h1>

            <p className="mt-4 text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
              At HealthGhuru, every headline, patient guide, and scientific breakdown is vetted through a rigorous, multi-tier clinical verification model led by board-certified physicians, academic researchers, and medical editors.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3 text-xs font-heading font-bold">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-100/70 text-emerald-900 border border-emerald-200">
                <CheckCircle2 size={13} className="text-[#16A34A]" />
                100% Peer-Reviewed Sources
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 text-slate-800 border border-slate-200">
                <Users size={13} className="text-slate-600" />
                Board-Certified Reviewers
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-50 text-[#ea580c] border border-orange-200">
                <Award size={13} className="text-[#f06d2f]" />
                Strict Editorial Independence
              </span>
            </div>
          </div>
        </div>

        {/* 4 Pillars of Clinical Integrity */}
        <div className="mb-14">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-mono uppercase tracking-widest text-[#f06d2f] font-bold">
              OUR 4-STEP MEDICAL PROTOCOL
            </span>
            <h2 className="font-heading font-black text-2xl sm:text-3xl text-slate-900 mt-1">
              How Every Article Is Verified
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {REVIEW_PILLARS.map((pillar) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={pillar.step}
                  className="bg-white rounded-2xl p-6 border border-slate-200/80 hover:border-emerald-500/40 hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-mono font-black text-2xl text-emerald-600/40">
                        {pillar.step}
                      </span>
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#16A34A] flex items-center justify-center">
                        <Icon size={20} />
                      </div>
                    </div>
                    <h3 className="font-heading font-bold text-base text-slate-900 mb-2">
                      {pillar.title}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {pillar.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Medical Advisory Board Showcase */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-xs mb-14">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-8 border-b border-slate-100">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-[#16A34A] font-bold">
                CLINICAL GOVERNANCE
              </span>
              <h2 className="font-heading font-black text-2xl sm:text-3xl text-slate-900 mt-1">
                Medical Advisory Board
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Distinguished specialists ensuring clinical fidelity across our healthcare coverage
              </p>
            </div>
            <Link
              href="/doctors"
              className="inline-flex items-center gap-1.5 text-xs font-heading font-bold text-white bg-[#16A34A] hover:bg-[#15803d] px-4 py-2.5 rounded-xl transition-all shadow-xs shrink-0 self-start sm:self-auto"
            >
              <span>Explore All Doctors</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {ADVISORY_BOARD.map((doctor) => (
              <div
                key={doctor.name}
                className="p-5 rounded-2xl bg-[#F5FAF5] border border-emerald-500/20 flex flex-col justify-between"
              >
                <div>
                  <div className="relative w-16 h-16 rounded-2xl overflow-hidden mb-3.5 border-2 border-emerald-500/30">
                    <Image
                      src={doctor.photo}
                      alt={doctor.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex items-center gap-1">
                    <h3 className="font-heading font-bold text-sm text-slate-900">
                      {doctor.name}
                    </h3>
                    <ShieldCheck size={14} className="text-[#16A34A] shrink-0" />
                  </div>
                  <p className="text-xs text-[#f06d2f] font-semibold mt-0.5">
                    {doctor.title}
                  </p>
                  <p className="text-[11px] text-slate-500 font-mono mt-1">
                    {doctor.credential}
                  </p>
                  <p className="text-[11px] text-slate-600 mt-2 font-medium">
                    {doctor.institution}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-emerald-500/10 text-[10.5px] text-emerald-800 font-mono">
                  Focus: {doctor.specialty}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Medical Disclaimer & Corrections Policy */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-3">
            <div className="flex items-center gap-2.5 text-[#16A34A]">
              <AlertCircle size={20} />
              <h3 className="font-heading font-bold text-base text-slate-900">
                Medical Disclaimer Notice
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              HealthGhuru content is created for informational, educational, and journalistic purposes only. It is not intended as a substitute for professional medical diagnosis, advice, or treatment. Always consult a qualified physician or certified healthcare provider with any medical questions.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-3">
            <div className="flex items-center gap-2.5 text-[#f06d2f]">
              <HelpCircle size={20} />
              <h3 className="font-heading font-bold text-base text-slate-900">
                Corrections &amp; Editorial Inquiries
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              We hold ourselves to transparent accountability. If you identify a factual discrepancy, outdated clinical trial reference, or formatting error, please notify our medical editorial desk at{' '}
              <a href="mailto:editorial@healthghuru.com" className="text-[#16A34A] font-bold hover:underline">
                editorial@healthghuru.com
              </a>
              . Corrections are investigated and updated promptly.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}

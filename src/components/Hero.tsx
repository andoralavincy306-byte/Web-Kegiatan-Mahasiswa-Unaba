import React from 'react';
import { PageType } from '../types';
import { Calendar, ArrowRight, Award, Sparkles, AlertCircle, User } from 'lucide-react';

interface HeroProps {
  onNavigate: (page: PageType) => void;
  title: string;
  subtitle: string;
}

export default function Hero({ onNavigate, title, subtitle }: HeroProps) {
  // Reference the generated image paths
  const bannerImgSrc = '/src/assets/images/campus_hero_banner_1781855904460.jpg';
  const logoImgSrc = '/src/assets/images/campus_logo_1781855920012.jpg';

  return (
    <div id="hero-section" className="relative overflow-hidden bg-univ-blue-900 text-white py-16 sm:py-20 lg:py-24">
      {/* Background Graphic Pattern and Overlay */}
      <div className="absolute inset-0 z-0 opacity-20 bg-[radial-gradient(#ff7f3f_1.5px,transparent_1.5px)] [background-size:24px_24px]"></div>
      
      {/* Background Banner with elegant gradient overlay */}
      <div className="absolute inset-0 z-0 select-none">
        <img
          src={bannerImgSrc}
          alt="Universitas Anak Bangsa Campus Activity"
          className="h-full w-full object-cover object-center opacity-30"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-univ-blue-900 via-univ-blue-900/90 to-transparent"></div>
      </div>

      <div className="relative z-20 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Main Hero Content */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center space-x-2 rounded-full bg-univ-orange-500/15 border border-univ-orange-500/30 px-3.5 py-1 text-xs font-semibold text-univ-orange-100 uppercase tracking-widest animate-bounce">
              <Sparkles className="h-3.5 w-3.5 text-univ-orange-500" />
              <span>Sistem Informasi Kegiatan & Seminar Kampus</span>
            </div>

            <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl md:text-5xl leading-tight">
              {title} <br className="hidden md:inline" />
              <span className="text-univ-orange-500">Wadah Kreativitas & Edukasi</span> Mahasiswa!
            </h2>

            <p className="max-w-2xl text-base text-gray-300 md:text-lg">
              {subtitle} Temukan agenda pelatihan, talkshow ilmiah, seminar inspiratif, bakti sosial, dan turnamen olahraga terbaik untuk mengasah soft skill serta mendapatkan sertifikat resmi keikutsertaan.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <button
                id="hero-explore-btn"
                onClick={() => onNavigate('ACTIVITIES')}
                className="flex items-center justify-center space-x-2 rounded-xl bg-univ-orange-500 px-6 py-3.5 text-sm font-bold text-white shadow-lg transition-all duration-300 hover:bg-univ-orange-600 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-univ-orange-500/50"
              >
                <Calendar className="h-4.5 w-4.5" />
                <span>Jelajahi Kegiatan Baru</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              <button
                id="hero-profile-btn"
                onClick={() => onNavigate('PROFILE')}
                className="flex items-center justify-center space-x-2 rounded-xl border-2 border-white/20 bg-white/5 px-6 py-3.5 text-sm font-bold text-white transition-all duration-300 hover:bg-white/10 hover:border-white/40 focus:outline-none"
              >
                <User className="h-4.5 w-4.5 text-univ-orange-500" />
                <span>Lihat Pendaftaran Saya</span>
              </button>
            </div>

            <div className="flex items-center space-x-2.5 text-xs text-gray-400">
              <AlertCircle className="h-4 w-4 text-univ-orange-500" />
              <span>Gunakan akun portal mahasiswa resmi Anda untuk mendaftar dan mengklaim sertifikat kegiatan.</span>
            </div>
          </div>

          {/* Highlights / Micro-stats Banner */}
          <div className="lg:col-span-5 grid grid-cols-1 gap-4 lg:pl-6">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm transition-all hover:bg-white/10">
              <span className="text-3xl sm:text-4xl font-extrabold text-univ-orange-500 block font-mono">100%</span>
              <span className="text-sm font-bold text-white uppercase tracking-wider mt-1 block">E-Sertifikat</span>
              <p className="text-xs text-gray-400 mt-2">Dapatkan sertifikat keikutsertaan elektronik resmi setelah merampungkan gelaran seminar.</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

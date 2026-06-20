import React from 'react';
import { PageType } from '../types';
import { GraduationCap, MapPin, Phone, Mail, Clock, ExternalLink } from 'lucide-react';

interface FooterProps {
  onNavigate: (page: PageType) => void;
  contactPhone?: string;
  contactEmail?: string;
  secretariatAddress?: string;
}

export default function Footer({ 
  onNavigate, 
  contactPhone = '0812-3456-7890',
  contactEmail = 'kemahasiswaan@unaba.ac.id',
  secretariatAddress = 'Gedung Rektorat Lt. 2, Jalan Jenderal Sudirman Kav. 21, Karet Semanggi, Jakarta Selatan'
}: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="campus-footer" className="mt-16 border-t border-univ-blue-100 bg-univ-blue-900 text-slate-300 text-left">
      {/* Decorative top strip accent */}
      <div className="h-1.5 w-full bg-gradient-to-r from-univ-blue-800 via-univ-orange-500 to-univ-blue-700"></div>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Column 1: Campus Identity (wd: 4 cols) */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-univ-blue-800 text-univ-orange-500 border border-univ-blue-700 shadow-md">
                <GraduationCap className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-white">UNIVERSITAS ANAK BANGSA</h3>
                <p className="text-[10px] font-semibold text-univ-orange-500 uppercase tracking-wider">Biro Kemahasiswaan & Layanan Alumni</p>
              </div>
            </div>
            
            <p className="text-xs text-slate-400 leading-relaxed text-justify">
              Biro Kemahasiswaan & Layanan Alumni (BKA) Universitas Anak Bangsa berkomitmen menyediakan pelayanan terintegrasi prima guna menyalurkan, mengukur, serta mengembangkan bakat kepemimpinan, kepribadian Pancasila, keahlian riset ilmiah, dan dedikasi pengabdian sosial mahasiswa.
            </p>

            <div className="text-xs text-slate-400 space-y-1.5">
              <div className="flex items-center space-x-2 text-[11px] font-mono">
                <Clock className="h-3.5 w-3.5 text-univ-orange-500" />
                <span>Hari Kerja: Senin - Jumat (08:00 - 16:00 WIB)</span>
              </div>
            </div>
          </div>

          {/* Column 2: Quick Links (wd: 3 cols) */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="text-sm font-extrabold text-white uppercase tracking-wider border-b border-white/10 pb-2">Navigasi Utama</h4>
            <ul className="space-y-2.5 text-xs font-semibold">
              <li>
                <button 
                  onClick={() => onNavigate('HOME')}
                  className="hover:text-univ-orange-500 transition-colors hover:underline text-left block w-full"
                >
                  Beranda Portal
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('ACTIVITIES')}
                  className="hover:text-univ-orange-500 transition-colors hover:underline text-left block w-full"
                >
                  Katalog Kegiatan Mahasiswa
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('PROFILE')}
                  className="hover:text-univ-orange-500 transition-colors hover:underline text-left block w-full"
                >
                  Pendaftaran Saya
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('ADMIN')}
                  className="hover:text-univ-orange-500 transition-colors hover:underline text-left block w-full"
                >
                  Masuk Pengelola (Admin BKA)
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact & Address Details (wd: 4 cols) */}
          <div className="md:col-span-4 space-y-4">
            <h4 className="text-sm font-extrabold text-white uppercase tracking-wider border-b border-white/10 pb-2">Kontak & Sekretariat</h4>
            <div className="space-y-3.5 text-xs text-slate-400 font-medium">
              <div className="flex items-start space-x-2.5">
                <MapPin className="h-4 w-4 text-univ-orange-500 shrink-0 mt-0.5" />
                <span>
                  <strong>Kampus BKA:</strong> {secretariatAddress}
                </span>
              </div>

              <div className="flex items-start space-x-2.5">
                <Phone className="h-4 w-4 text-univ-orange-500 shrink-0 mt-0.5" />
                <span className="font-mono">WhatsApp: {contactPhone}</span>
              </div>

              <div className="flex items-start space-x-2.5">
                <Mail className="h-4 w-4 text-univ-orange-500 shrink-0 mt-0.5" />
                <span className="font-mono">{contactEmail}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Footer legalities & credits signature */}
        <div className="mt-12 border-t border-slate-800 pt-6 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            <p>© {currentYear} Universitas Anak Bangsa (UNABA). Hak Cipta Dilindungi Undang-Undang.</p>
            <p className="text-[10px] text-slate-600 mt-1">Sistem Informasi Kredit Ekstrakurikuler Pendidikan Tinggi Indonesia Terakreditasi BAN-PT.</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <span className="hover:text-slate-400 cursor-pointer flex items-center space-x-1">
              <span>SIAKAD UNABA</span>
              <ExternalLink className="h-3 w-3" />
            </span>
            <span className="hover:text-slate-400 cursor-pointer flex items-center space-x-1">
              <span>RISTEKDIKTI</span>
              <ExternalLink className="h-3 w-3" />
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

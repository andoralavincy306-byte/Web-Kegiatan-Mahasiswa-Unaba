import React, { useEffect } from 'react';
import { Activity, ActivityStatus, isEventDatePassed, isActivityArchived } from '../types';
import { ArrowLeft, Award, Calendar, MapPin, Users, Phone, ShieldCheck, CheckCircle2, UserCheck, HelpCircle, Check } from 'lucide-react';

interface ActivityDetailsProps {
  activity: Activity;
  onBack: () => void;
  onRegister: (id: string) => void;
  hasRegistered: boolean;
  officialContactName: string;
  officialContactPhone: string;
}

export default function ActivityDetails({ 
  activity, 
  onBack, 
  onRegister,
  hasRegistered,
  officialContactName,
  officialContactPhone
}: ActivityDetailsProps) {
  
  // Requirement: "When the user opens the activity details, the page immediately jumps to the top"
  // Let's add an explicit hook to double guard this scroll behavior on load
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    const detailHeader = document.getElementById('activity-details-header');
    if (detailHeader) {
      detailHeader.scrollIntoView({ behavior: 'auto', block: 'start' });
    }
  }, [activity.id]);

  const seatsLeft = activity.quota - activity.registeredCount;
  const percentageUsed = Math.min(Math.round((activity.registeredCount / activity.quota) * 100), 100);

  return (
    <div id="activity-details-section" className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 text-left">
      
      {/* Retractable Breadcrumb Back Trigger */}
      <div className="mb-6">
        <button
          onClick={onBack}
          className="group inline-flex items-center space-x-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-bold text-gray-700 shadow-sm transition-all hover:bg-slate-50 hover:text-univ-blue-800"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          <span>Kembali ke Katalog</span>
        </button>
      </div>

      {/* Main Container Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Photo cover, descriptions, requirements, benefits (8 columns on lg) */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Main Visual Cover and Header */}
          <div id="activity-details-header" className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
            <div className="relative aspect-[21/9] w-full overflow-hidden bg-slate-200">
              <img
                src={activity.imageUrl}
                alt={activity.title}
                className="h-full w-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-4 left-4">
                <span className="inline-block rounded-lg bg-univ-blue-800 px-3 py-1 text-xs font-bold text-white shadow-md">
                  {activity.category}
                </span>
              </div>
            </div>

            <div className="p-6 sm:p-8 space-y-4">
              <h2 className="text-xl font-extrabold text-univ-blue-800 sm:text-2xl md:text-3xl leading-tight">
                {activity.title}
              </h2>

              <p className="text-gray-650 text-sm leading-relaxed whitespace-pre-line">
                {activity.longDescription}
              </p>
            </div>
          </div>

          {/* Certificate Notice Banner */}
          {activity.hasCertificate !== false && (activity.hasCertificate || activity.certificateUploaded) ? (
            <div className="rounded-2xl border border-emerald-200 bg-gradient-to-r from-emerald-50 to-teal-50 p-5 shadow-sm flex items-center space-x-4">
              <div className="p-3 rounded-xl bg-emerald-500 text-white shrink-0 shadow-sm">
                <Award className="h-6 w-6" />
              </div>
              <div className="space-y-0.5">
                <span className="inline-block px-2 py-0.5 rounded text-[10px] font-extrabold bg-emerald-200 text-emerald-800 uppercase tracking-wide">
                  🎓 E-Sertifikat Tersedia
                </span>
                <h4 className="text-sm font-extrabold text-slate-900">
                  Sertifikat Otomatis Diterbitkan Sesuai Nama Mahasiswa
                </h4>
                <p className="text-xs text-slate-600">
                  Setelah pendaftaran disetujui, E-Sertifikat resmi terverifikasi dengan nama & NIM Anda dapat diunduh langsung di menu Profil Saya.
                </p>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 shadow-sm flex items-center space-x-4">
              <div className="p-3 rounded-xl bg-slate-200 text-slate-600 shrink-0">
                <Award className="h-6 w-6" />
              </div>
              <div className="space-y-0.5">
                <span className="inline-block px-2 py-0.5 rounded text-[10px] font-extrabold bg-slate-200 text-slate-700 uppercase tracking-wide">
                  🚫 Tanpa Sertifikat
                </span>
                <h4 className="text-sm font-extrabold text-slate-800">
                  Kegiatan Ini Tidak Menyediakan E-Sertifikat
                </h4>
                <p className="text-xs text-slate-500">
                  Kegiatan ini diselenggarakan sebagai partisipasi/apresiasi umum tanpa penerbitan lembar E-Sertifikat resmi.
                </p>
              </div>
            </div>
          )}

          {/* Qualifications & Benefits Layout blocks */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Left Box: Requirements */}
            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm space-y-4">
              <h3 className="text-lg font-bold text-gray-900 border-b border-gray-50 pb-2.5">Kualifikasi & Persyaratan Daftar</h3>
              
              <ul className="space-y-2.5 text-xs text-gray-655 font-medium leading-normal">
                {activity.requirements.map((req, idx) => (
                  <li key={idx} className="flex items-start space-x-2">
                    <ShieldCheck className="h-4.5 w-4.5 shrink-0 text-univ-orange-500 mt-0.5" />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right Box: Benefits */}
            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm space-y-4">
              <h3 className="text-lg font-bold text-gray-900 border-b border-gray-50 pb-2.5">Fasilitas & Benefit Mahasiswa</h3>
              
              <ul className="space-y-2.5 text-xs text-gray-655 font-medium leading-normal">
                {activity.benefits.map((ben, idx) => (
                  <li key={idx} className="flex items-start space-x-2">
                    <UserCheck className="h-4.5 w-4.5 shrink-0 text-univ-blue-700 mt-0.5" />
                    <span>{ben}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>

        </div>

        {/* Right Side: Fast Registration widget and details (4 columns on lg) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Action Trigger Card */}
          <div className="rounded-2xl border border-univ-blue-100 bg-univ-blue-50/15 p-6 shadow-sm ring-1 ring-univ-blue-50/30">
            <h3 className="text-base font-extrabold text-univ-blue-800 pb-3 border-b border-univ-blue-100/30">Kuota & Status Terisi</h3>
            
            <div className="my-5 space-y-3 font-medium text-xs">
              <div className="flex justify-between text-xs text-gray-650">
                <span>Total Kuota Terdaftar:</span>
                <span className="font-bold text-gray-900">{activity.registeredCount} orang</span>
              </div>
              <div className="flex justify-between text-xs text-gray-505 font-medium pb-4 border-b border-gray-50">
                <span>Sisa Bangku Tersedia:</span>
                <span className={`font-bold uppercase ${seatsLeft > 0 ? 'text-green-600' : 'text-rose-600'}`}>
                  {seatsLeft > 0 ? `${seatsLeft} Kursi` : 'Kuota Habis'}
                </span>
              </div>

              {/* Progress bar ratio list */}
              <div className="space-y-1 pb-4">
                <div className="flex justify-between text-[11px] text-gray-400 font-medium">
                  <span>Rasio Terisi:</span>
                  <span>{percentageUsed}%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                  <div 
                    className="h-full rounded-full bg-univ-blue-800 transition-all duration-500" 
                    style={{ width: `${percentageUsed}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {hasRegistered ? (
              <div className="w-full rounded-xl bg-green-50 border border-green-200 py-3.5 text-center text-sm font-extrabold text-green-700 flex items-center justify-center space-x-1.5 shadow-sm">
                <Check className="h-4.5 w-4.5 text-green-600" />
                <span>Anda Sudah Mendaftar</span>
              </div>
            ) : isActivityArchived(activity) ? (
              <div className="rounded-xl bg-gray-50 border border-gray-100 px-4 py-3.5 text-center text-xs font-bold text-gray-400">
                Maaf, Pendaftaran Ditutup (Kegiatan Masuk Arsip / Sudah Lewat)
              </div>
            ) : activity.status === 'Pendaftaran Buka' && seatsLeft > 0 ? (
              <button
                id="details-register-btn"
                onClick={() => onRegister(activity.id)}
                className="w-full rounded-xl bg-univ-orange-500 py-3.5 text-center text-sm font-extrabold text-white shadow-md hover:bg-univ-orange-600 transition-all cursor-pointer"
              >
                Daftar Kegiatan Sekarang
              </button>
            ) : (
              <div className="rounded-xl bg-gray-50 border border-gray-100 px-4 py-3.5 text-center text-xs font-bold text-gray-400">
                Maaf, Pendaftaran Tidak Diperkenankan
              </div>
            )}
          </div>

          {/* Location & Time Schedule Card */}
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm space-y-4 text-sm font-medium">
            <h3 className="text-base font-extrabold text-univ-blue-800 pb-3 border-b border-gray-50">Waktu & Lokasi Kegiatan</h3>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3.5 text-gray-655">
                <Calendar className="h-5 w-5 shrink-0 text-univ-orange-500 mt-0.5" />
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase">Jadwal Pelaksanaan</p>
                  <p className="text-gray-900 font-semibold mt-0.5">{activity.eventDate}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3.5 text-gray-655">
                <MapPin className="h-4.5 w-4.5 shrink-0 text-univ-orange-500 mt-0.5" />
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase">Ruang / Tempat</p>
                  <p className="text-gray-900 font-semibold mt-0.5">{activity.location}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Person Details Card */}
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm space-y-4 text-sm">
            <h3 className="text-base font-extrabold text-univ-blue-800 pb-3 border-b border-gray-50">Hubungi Panitia Pelaksana</h3>
            
            <div className="flex items-center space-x-3.5">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-univ-orange-50 text-univ-orange-600 shrink-0">
                <Phone className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-gray-400 uppercase">Narahubung Resmi</p>
                <p className="font-extrabold text-gray-900 mt-0.5">{officialContactName}</p>
                <p className="font-mono text-xs font-semibold text-univ-blue-800 mt-0.5">{officialContactPhone}</p>
              </div>
            </div>

            <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 text-xs text-gray-500 leading-normal flex items-start space-x-2">
              <HelpCircle className="h-4.5 w-4.5 shrink-0 text-univ-orange-500 mt-0.5" />
              <span>Harap tanyakan syarat berkas pendukung langsung ke nomor narahubung jika ada kebingungan.</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

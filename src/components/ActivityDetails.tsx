import React, { useEffect } from 'react';
import { Activity, ActivityStatus } from '../types';
import { ArrowLeft, Award, Calendar, MapPin, Users, Phone, ShieldCheck, CheckCircle2, UserCheck, HelpCircle } from 'lucide-react';

interface ActivityDetailsProps {
  activity: Activity;
  onBack: () => void;
  onRegister: (id: string) => void;
}

export default function ActivityDetails({ activity, onBack, onRegister }: ActivityDetailsProps) {
  
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
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              
              <div className="absolute bottom-5 left-6 right-6 text-white">
                <span className="inline-block rounded-lg bg-univ-orange-500 px-3 py-1 text-xs font-bold uppercase tracking-wider mb-2">
                  {activity.category}
                </span>
                <h1 className="text-xl font-extrabold sm:text-2xl md:text-3xl tracking-tight leading-tight">
                  {activity.title}
                </h1>
              </div>
            </div>

            {/* Quick Micro Status Bar inside Header */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-5 text-sm text-gray-500 border-t border-gray-50 divide-x divide-gray-100">
              <div className="pl-2">
                <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest">Sertifikasi Acara</p>
                <p className="text-base font-extrabold text-univ-orange-600 mt-1 flex items-center space-x-1">
                  <Award className="h-4 w-4" />
                  <span>E-Sertifikat Resmi</span>
                </p>
              </div>
              
              <div className="pl-4">
                <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest">Batas Pendaftaran</p>
                <p className="text-sm font-bold text-gray-800 mt-1 font-mono">{activity.registrationDeadline}</p>
              </div>

              <div className="pl-4">
                <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest">Status Berkas</p>
                <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-bold mt-1 ${
                  activity.status === 'Pendaftaran Buka' ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-700'
                }`}>
                  {activity.status}
                </span>
              </div>

              <div className="pl-4">
                <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest">Sisa Kuota</p>
                <p className="text-sm font-bold text-gray-800 mt-1 font-mono">{seatsLeft} Kursi / {activity.quota}</p>
              </div>
            </div>
          </div>

          {/* Deep descriptive section */}
          <div className="rounded-2xl border border-gray-100 bg-white p-6 sm:p-8 shadow-sm space-y-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900 border-b border-gray-50 pb-2.5">Deskripsi Lengkap Kegiatan</h3>
              <p className="text-sm text-gray-600 mt-4 leading-relaxed whitespace-pre-line text-justify">
                {activity.longDescription}
              </p>
            </div>

            {/* Core Benefits */}
            <div className="pt-4">
              <h3 className="text-lg font-bold text-gray-900 border-b border-gray-50 pb-2.5">Fasilitas & Manfaat Peserta</h3>
              <ul className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                {activity.benefits.map((benefit, idx) => (
                  <li key={idx} className="flex items-start space-x-2.5 text-sm text-gray-650">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-univ-orange-500 mt-0.5" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Prerequisite requirements */}
            <div className="pt-4">
              <h3 className="text-lg font-bold text-gray-900 border-b border-gray-50 pb-2.5">Kualifikasi & Persyaratan Daftar</h3>
              <ul className="mt-4 space-y-3">
                {activity.requirements.map((req, idx) => (
                  <li key={idx} className="flex items-start space-x-2.5 text-sm text-gray-650 bg-slate-50 border border-slate-100 rounded-lg p-3">
                    <ShieldCheck className="h-4.5 w-4.5 shrink-0 text-univ-blue-700 mt-0.5" />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>

        {/* Right Side: Quick info widgets and CTA registration form link (4 columns) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Quick Registry CTA Card */}
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm space-y-5">
            <h3 className="text-base font-extrabold text-univ-blue-800">Panel Pendaftaran</h3>
            
            <div className="space-y-4">
              <div className="flex justify-between text-xs text-gray-500 font-medium pb-2 border-b border-gray-50">
                <span>Kuota Total:</span>
                <span className="font-bold text-gray-900">{activity.quota}</span>
              </div>
              <div className="flex justify-between text-xs text-gray-500 font-medium pb-2 border-b border-gray-50">
                <span>Pendaftar Terverifikasi:</span>
                <span className="font-bold text-gray-900">{activity.registeredCount} orang</span>
              </div>
              <div className="flex justify-between text-xs text-gray-500 font-medium pb-4 border-b border-gray-50">
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

            {activity.status === 'Pendaftaran Buka' && seatsLeft > 0 ? (
              <button
                id="details-register-btn"
                onClick={() => onRegister(activity.id)}
                className="w-full rounded-xl bg-univ-orange-500 py-3.5 text-center text-sm font-extrabold text-white shadow-md hover:bg-univ-orange-600 transition-all cursor-pointer"
              >
                Daftar Kegiatan Sekarang
              </button>
            ) : (
              <div className="rounded-xl bg-gray-50 border border-gray-100 px-4 py-3.5 text-center text-xs font-bold text-gray-400">
                Maaf, Pendaftaran Tidak Dibuka
              </div>
            )}
          </div>

          {/* Location & Time Schedule Card */}
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm space-y-4 text-sm font-medium">
            <h3 className="text-base font-extrabold text-univ-blue-800 pb-3 border-b border-gray-50">Waktu & Lokasi Kegiatan</h3>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3.5 text-gray-650">
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
                <p className="font-extrabold text-gray-900 mt-0.5">{activity.contactPerson.name}</p>
                <p className="font-mono text-xs font-semibold text-univ-blue-800 mt-0.5">{activity.contactPerson.phone}</p>
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

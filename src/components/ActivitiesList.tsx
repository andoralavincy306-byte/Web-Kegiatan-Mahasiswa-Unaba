import React, { useState, useMemo } from 'react';
import { Activity, ActivityCategory, ActivityStatus, isEventDatePassed, isActivityArchived } from '../types';
import { Search, Calendar, MapPin, Award, Users, Filter, ArrowUpDown, Check } from 'lucide-react';

interface ActivitiesListProps {
  activities: Activity[];
  onSelectActivity: (id: string) => void;
  onNavigateToRegistration: (id: string) => void;
  registeredActivityIds: string[];
}

type SortOption = 'DEFAULT' | 'DEADLINE_ASC' | 'QUOTA_LEFT';

export default function ActivitiesList({ 
  activities, 
  onSelectActivity, 
  onNavigateToRegistration,
  registeredActivityIds 
}: ActivitiesListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<SortOption>('DEFAULT');
  const [currentTab, setCurrentTab] = useState<'ACTIVE' | 'ARCHIVED'>('ACTIVE');

  // Categories helper
  const categoriesList = useMemo(() => [
    { value: 'ALL', label: 'Semua Kategori' },
    { value: ActivityCategory.ORGANIZATION, label: 'Organisasi & Kepemimpinan' },
    { value: ActivityCategory.ACADEMIC, label: 'Keilmuan & Penalaran' },
    { value: ActivityCategory.COMMUNITY, label: 'Pengabdian Masyarakat' },
    { value: ActivityCategory.ARTS, label: 'Seni & Budaya' },
    { value: ActivityCategory.SPORTS, label: 'Olahraga' }
  ], []);

  // Filter & Sort Logic
  const filteredActivities = useMemo(() => {
    let result = [...activities];

    // Filter by tab (ACTIVE or ARCHIVED)
    const today = new Date();
    today.setHours(0,0,0,0);
    result = result.filter(act => {
      const deadlineDate = new Date(act.registrationDeadline);
      const isPast = deadlineDate.getTime() < today.getTime();
      return currentTab === 'ACTIVE' ? !isPast : isPast;
    });

    // Search filter
    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (act) =>
          act.title.toLowerCase().includes(term) ||
          act.description.toLowerCase().includes(term) ||
          act.location.toLowerCase().includes(term)
      );
    }

    // Category filter
    if (selectedCategory !== 'ALL') {
      result = result.filter((act) => act.category === selectedCategory);
    }

    // Status filter
    if (selectedStatus !== 'ALL') {
      result = result.filter((act) => act.status === selectedStatus);
    }

    // Sorting
    switch (sortBy) {
      case 'DEADLINE_ASC':
        result.sort((a, b) => new Date(a.registrationDeadline).getTime() - new Date(b.registrationDeadline).getTime());
        break;
      case 'QUOTA_LEFT':
        result.sort((a, b) => (a.quota - a.registeredCount) - (b.quota - b.registeredCount));
        break;
      default:
        // Keep default state ordering
        break;
    }

    return result;
  }, [activities, searchTerm, selectedCategory, selectedStatus, sortBy, currentTab]);

  // Color mapper for status
  const getStatusStyle = (status: ActivityStatus) => {
    switch (status) {
      case ActivityStatus.OPEN:
        return 'bg-green-100 text-green-800 border-green-200';
      case ActivityStatus.UPCOMING:
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case ActivityStatus.ONGOING:
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case ActivityStatus.COMPLETED:
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case ActivityStatus.CLOSED:
        return 'bg-rose-100 text-rose-800 border-rose-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <div id="activities-panel" className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 text-left">
      
      {/* Title & Stats Summary */}
      <div className="mb-6 border-b border-gray-100 pb-5">
        <h2 className="text-2xl font-extrabold tracking-tight text-univ-blue-800 sm:text-3xl">
          Katalog Aktivitas Lengkap
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Dapatkan pengalaman lapangan berharga dan kumpulkan sertifikat resmi keikutsertaan Anda di Universitas Anak Bangsa.
        </p>
      </div>

      {/* Category / Scheduling Tabs */}
      <div className="flex border-b border-gray-200 mb-8 overflow-x-auto whitespace-nowrap">
        <button
          onClick={() => setCurrentTab('ACTIVE')}
          className={`px-6 py-3.5 text-sm font-extrabold border-b-2 transition-all cursor-pointer flex items-center space-x-2 shrink-0 ${
            currentTab === 'ACTIVE'
              ? 'border-univ-blue-800 text-univ-blue-800'
              : 'border-transparent text-gray-400 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          <span>Kegiatan Aktif</span>
          <span className={`px-2 py-0.5 rounded-full text-xs font-mono font-bold ${
            currentTab === 'ACTIVE' ? 'bg-univ-orange-100 text-univ-orange-700' : 'bg-slate-100 text-gray-400'
          }`}>
            {activities.filter(act => new Date(act.registrationDeadline).getTime() >= new Date().setHours(0,0,0,0)).length}
          </span>
        </button>
        <button
          onClick={() => setCurrentTab('ARCHIVED')}
          className={`px-6 py-3.5 text-sm font-extrabold border-b-2 transition-all cursor-pointer flex items-center space-x-2 shrink-0 ${
            currentTab === 'ARCHIVED'
              ? 'border-univ-blue-800 text-univ-blue-800'
              : 'border-transparent text-gray-400 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          <span>Arsip Kegiatan (Sudah Lewat)</span>
          <span className={`px-2 py-0.5 rounded-full text-xs font-mono font-bold ${
            currentTab === 'ARCHIVED' ? 'bg-univ-orange-100 text-univ-orange-700' : 'bg-slate-100 text-gray-400'
          }`}>
            {activities.filter(act => new Date(act.registrationDeadline).getTime() < new Date().setHours(0,0,0,0)).length}
          </span>
        </button>
      </div>

      {/* Advanced Filters Block */}
      <div className="mb-8 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          
          {/* Search bar input: md = 5 columns */}
          <div className="md:col-span-5 relative">
            <Search className="absolute top-3.5 left-3.5 h-4.5 w-4.5 text-gray-400" />
            <input
              id="search-input"
              type="text"
              placeholder="Cari kegiatan, lokasi, kepemimpinan..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-slate-50 pl-11 pr-4 py-3 text-sm font-medium text-gray-800 placeholder-gray-400 transition-all focus:border-univ-blue-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-univ-blue-600"
            />
          </div>

          {/* Status Dropdown Filter: md = 3 columns */}
          <div className="md:col-span-3 relative">
            <Filter className="absolute top-3.5 left-3.5 h-4 w-4 text-gray-400" />
            <select
              id="category-filter"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full appearance-none rounded-xl border border-gray-200 bg-slate-50 pl-11 pr-8 py-3 text-sm font-semibold text-gray-600 transition-all focus:border-univ-blue-600 focus:bg-white focus:outline-none"
            >
              {categoriesList.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
          </div>

          {/* Sorting Dropdown: md = 4 columns */}
          <div className="md:col-span-4 relative">
            <ArrowUpDown className="absolute top-3.5 left-3.5 h-4 w-4 text-gray-400" />
            <select
              id="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="w-full appearance-none rounded-xl border border-gray-200 bg-slate-50 pl-11 pr-8 py-3 text-sm font-semibold text-gray-600 transition-all focus:border-univ-blue-600 focus:bg-white focus:outline-none"
            >
              <option value="DEFAULT">Urutan Default</option>
              <option value="DEADLINE_ASC">Deadline Terdekat</option>
              <option value="QUOTA_LEFT">Sisa Kuota Paling Tipis</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid List Renderer */}
      {filteredActivities.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-gray-200 py-16 text-center">
          <p className="text-base font-bold text-gray-700">Kegiatan Tidak Ditemukan</p>
          <p className="text-xs text-gray-400 max-w-sm mx-auto mt-1">
            Gagal mencocokkan kata kunci "{searchTerm}" atau paduan filter aktif Anda. Silakan bersihkan kata kunci pencarian.
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('ALL');
              setSelectedStatus('ALL');
              setSortBy('DEFAULT');
            }}
            className="mt-4 rounded-lg bg-univ-blue-800 px-4 py-2 text-xs font-bold text-white transition-all hover:bg-univ-blue-900"
          >
            Reset Semua Filter
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredActivities.map((act) => {
            const seatsLeft = act.quota - act.registeredCount;
            const percentageUsed = Math.min(Math.round((act.registeredCount / act.quota) * 100), 100);
            const hasRegistered = registeredActivityIds.includes(act.id);

            return (
              <div
                key={act.id}
                id={`activity-card-${act.id}`}
                className="group flex flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition-all duration-300 hover:shadow-xl hover:border-univ-blue-600/30 hover:-translate-y-1.5"
              >
                {/* Accent Banner Image */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-200">
                  <img
                    src={act.imageUrl}
                    alt={act.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="inline-block rounded-lg bg-white/90 backdrop-blur-sm border border-slate-200 px-2.5 py-1 text-xs font-bold text-univ-blue-800 shadow">
                      {act.category}
                    </span>
                  </div>

                  <div className="absolute top-3 right-3">
                    <span className={`inline-block border rounded-lg px-2.5 py-1 text-xs font-extrabold shadow ${getStatusStyle(act.status)}`}>
                      {act.status}
                    </span>
                  </div>

                  {/* Certificate availability overlay badge */}
                  {act.hasCertificate !== false && (act.hasCertificate || act.certificateUploaded) ? (
                    <div className="absolute bottom-3 left-3 flex items-center space-x-1 rounded-lg bg-emerald-600/90 backdrop-blur-sm border border-emerald-500/30 px-2.5 py-1 text-xs font-extrabold text-white shadow">
                      <Award className="h-3.5 w-3.5 text-white" />
                      <span>🎓 E-Sertifikat Tersedia</span>
                    </div>
                  ) : (
                    <div className="absolute bottom-3 left-3 flex items-center space-x-1 rounded-lg bg-slate-800/80 backdrop-blur-sm border border-slate-700/50 px-2.5 py-1 text-[11px] font-bold text-slate-200 shadow">
                      <span>🚫 Tanpa Sertifikat</span>
                    </div>
                  )}
                </div>

                {/* Card Content body */}
                <div className="flex flex-1 flex-col p-5">
                  <span className="font-mono text-[10px] text-gray-400 font-bold tracking-wider block uppercase mb-1">
                    Pelaksanaan: {act.eventDate}
                  </span>
                  
                  <h3 
                    onClick={() => onSelectActivity(act.id)}
                    className="text-base font-extrabold text-gray-950 mt-1 line-clamp-2 hover:text-univ-blue-800 hover:underline cursor-pointer transition-colors leading-snug"
                  >
                    {act.title}
                  </h3>
                  
                  <p className="text-xs text-gray-500 mt-2 line-clamp-3 leading-relaxed">
                    {act.description}
                  </p>

                  <div className="mt-4 space-y-3.5 border-t border-gray-50 pt-4 text-xs text-gray-500">
                    {/* Location item */}
                    <div className="flex items-center space-x-2 text-gray-600">
                      <MapPin className="h-4 w-4 shrink-0 text-gray-400" />
                      <span className="truncate">{act.location}</span>
                    </div>

                    {/* Deadline item */}
                    <div className="flex items-center space-x-2 text-slate-500">
                      <Calendar className="h-4 w-4 shrink-0 text-univ-orange-500" />
                      <span>Batas Daftar: <strong className="font-mono text-gray-700">{act.registrationDeadline}</strong></span>
                    </div>

                    {/* Progress seats bar */}
                    <div className="space-y-1">
                      <div className="flex justify-between font-medium text-gray-500">
                        <span className="flex items-center space-x-1.5 font-sans">
                          <Users className="h-3.5 w-3.5 text-gray-400" />
                          <span>Kuota Terisi:</span>
                        </span>
                        <span>{act.registeredCount} / {act.quota} peserta</span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                        <div 
                          className={`h-full rounded-full transition-all duration-500 ${
                            percentageUsed >= 90 ? 'bg-rose-500' : 'bg-univ-blue-700'
                          }`}
                          style={{ width: `${percentageUsed}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  {/* Actions buttons footer */}
                  <div className="mt-5 grid grid-cols-2 gap-2.5 pt-1">
                    <button
                      onClick={() => onSelectActivity(act.id)}
                      className="rounded-xl border border-univ-blue-100 bg-univ-blue-50/50 py-2.5 text-center text-xs font-bold text-univ-blue-850 hover:bg-univ-blue-100/60 hover:text-univ-blue-900 transition-all cursor-pointer"
                    >
                      Lihat Detail
                    </button>

                    {hasRegistered ? (
                      <div className="rounded-xl bg-green-50 border border-green-200 py-2.5 text-center text-xs font-extrabold text-green-700 flex items-center justify-center space-x-1">
                        <Check className="h-3.5 w-3.5 text-green-600" />
                        <span>Anda Sudah Mendaftar</span>
                      </div>
                    ) : isActivityArchived(act) ? (
                      <button
                        disabled
                        className="rounded-xl bg-slate-100 py-2.5 text-center text-xs font-bold text-gray-400 cursor-not-allowed"
                      >
                        Pendaftaran Ditutup
                      </button>
                    ) : act.status === ActivityStatus.OPEN && seatsLeft > 0 ? (
                      <button
                        onClick={() => onNavigateToRegistration(act.id)}
                        className="rounded-xl bg-univ-orange-500 py-2.5 text-center text-xs font-extrabold text-white hover:bg-univ-orange-600 hover:shadow-md transition-all cursor-pointer"
                      >
                        Daftar Sekarang
                      </button>
                    ) : (
                      <button
                        disabled
                        className="rounded-xl bg-slate-100 py-2.5 text-center text-xs font-bold text-gray-400 cursor-not-allowed"
                      >
                        {seatsLeft <= 0 ? 'Kuota Penuh' : 'Ditutup'}
                      </button>
                    )}
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { PageType, Activity, Registration, StudentProfile, ActivityCategory, ActivityStatus } from './types';
import { INITIAL_ACTIVITIES, INITIAL_REGISTRATIONS, INITIAL_STUDENT } from './data';
import Header from './components/Header';
import Hero from './components/Hero';
import ActivitiesList from './components/ActivitiesList';
import ActivityDetails from './components/ActivityDetails';
import RegistrationForm from './components/RegistrationForm';
import ProfileSection from './components/ProfileSection';
import AdminPanel from './components/AdminPanel';
import Footer from './components/Footer';
import { motion, AnimatePresence } from 'motion/react';
import { CalendarDays, ShieldCheck, HelpCircle, ArrowRight, Award, MessageSquare, Sparkles, Megaphone, BookOpen } from 'lucide-react';

export default function App() {
  // --- Persistent LocalState Engine ---
  const [activities, setActivities] = useState<Activity[]>(() => {
    const saved = localStorage.getItem('uab_activities_v5') || localStorage.getItem('ubn_activities_v5');
    return saved ? JSON.parse(saved) : INITIAL_ACTIVITIES;
  });

  const [registrations, setRegistrations] = useState<Registration[]>(() => {
    const saved = localStorage.getItem('uab_registrations_v5') || localStorage.getItem('ubn_registrations_v5');
    return saved ? JSON.parse(saved) : INITIAL_REGISTRATIONS;
  });

  const [student, setStudent] = useState<StudentProfile>(() => {
    const saved = localStorage.getItem('uab_student_profile_v5') || localStorage.getItem('ubn_student_profile_v5');
    return saved ? JSON.parse(saved) : INITIAL_STUDENT;
  });

  const [activePage, setActivePage] = useState<PageType>(() => {
    const saved = localStorage.getItem('uab_active_page_v5') || localStorage.getItem('ubn_active_page_v5');
    return saved ? (saved as PageType) : 'HOME';
  });

  const [selectedActivityId, setSelectedActivityId] = useState<string>(() => {
    return localStorage.getItem('uab_selected_activity_id_v5') || localStorage.getItem('ubn_selected_activity_id_v5') || '';
  });

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('uab_activities_v5', JSON.stringify(activities));
  }, [activities]);

  useEffect(() => {
    localStorage.setItem('uab_registrations_v5', JSON.stringify(registrations));
  }, [registrations]);

  useEffect(() => {
    localStorage.setItem('uab_student_profile_v5', JSON.stringify(student));
  }, [student]);

  useEffect(() => {
    localStorage.setItem('uab_active_page_v5', activePage);
  }, [activePage]);

  useEffect(() => {
    localStorage.setItem('uab_selected_activity_id_v5', selectedActivityId);
  }, [selectedActivityId]);

  // --- Router Navigation Orchestrator with Top Scrolling ---
  const navigateTo = (page: PageType, activityId?: string) => {
    setActivePage(page);
    if (activityId) {
      setSelectedActivityId(activityId);
    }
    // UX requirement: immediate jump to the top on transition click
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  // --- Core State Mutators ---
  const handleApproveRegistration = (regId: string) => {
    const updatedRegs = registrations.map(reg => {
      if (reg.id === regId) {
        // Also update student SKPI score points
        const correspondingActivity = activities.find(a => a.id === reg.activityId);
        if (correspondingActivity) {
          // Increment points
          setStudent(prev => {
            const alreadyRegistered = prev.registeredActivityIds.includes(reg.activityId);
            const nextRegistered = alreadyRegistered 
              ? prev.registeredActivityIds 
              : [...prev.registeredActivityIds, reg.activityId];
            
            return {
              ...prev,
              registeredActivityIds: nextRegistered,
              skpiPointsAccumulated: prev.skpiPointsAccumulated + correspondingActivity.skpiPoints
            };
          });

          // Increment registered count inside activity limits
          setActivities(prevAct => prevAct.map(act => {
            if (act.id === reg.activityId) {
              return {
                ...act,
                registeredCount: Math.min(act.registeredCount + 1, act.quota)
              };
            }
            return act;
          }));
        }
        return { ...reg, status: 'APPROVED' as const };
      }
      return reg;
    });
    setRegistrations(updatedRegs);
    alert('Registrasi telah disetujui (Approved). Riwayat kegiatan mahasiswa telah diperbarui!');
  };

  const handleRejectRegistration = (regId: string) => {
    const updatedRegs = registrations.map(reg => {
      if (reg.id === regId) {
        return { ...reg, status: 'REJECTED' as const };
      }
      return reg;
    });
    setRegistrations(updatedRegs);
    alert('Registrasi ditolak (Rejected) oleh sistem.');
  };

  const handleAddActivity = (newAct: Activity) => {
    setActivities(prev => [newAct, ...prev]);
  };

  const handleDeleteActivity = (id: string) => {
    setActivities(prev => prev.filter(act => act.id !== id));
    setRegistrations(prev => prev.filter(reg => reg.activityId !== id));
  };

  const handleFormSubmit = (regData: Omit<Registration, 'id' | 'registrationDate' | 'status'>) => {
    const newRegistration: Registration = {
      ...regData,
      id: `REG-${Date.now().toString().substring(7)}`,
      registrationDate: new Date().toISOString().substring(0, 16).replace('T', ' '),
      status: 'PENDING'
    };

    setRegistrations(prev => [newRegistration, ...prev]);
    
    // Add activity reference loosely (but wait for admin approval to grant SKPI score points officially)
    setStudent(prev => {
      const alreadyReg = prev.registeredActivityIds.includes(regData.activityId);
      return {
        ...prev,
        registeredActivityIds: alreadyReg ? prev.registeredActivityIds : [...prev.registeredActivityIds, regData.activityId]
      };
    });
  };

  // Find selected activity helper
  const selectedActivity = activities.find(a => a.id === selectedActivityId) || activities[0];

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 font-sans selection:bg-univ-orange-100 selection:text-univ-orange-700">
      
      {/* Top sticky responsive Navbar */}
      <Header 
        activePage={activePage} 
        onChangePage={(p) => navigateTo(p)} 
        student={student} 
      />

      {/* Main Content Area with Smooth Animation Page Transitions */}
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          <motion.div
            key={activePage}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.28, ease: 'easeInOut' }}
          >
            {/* View ROUTER switchboard layout */}
            {activePage === 'HOME' && (
              <div id="home-view" className="space-y-12">
                
                {/* Hero Showcase Widget */}
                <Hero 
                  onNavigate={(p) => navigateTo(p)}
                  title="Portal Kemahasiswaan Terpadu"
                  subtitle="Selamat datang di Pusat Informasi Universitas Anak Bangsa (UAB Student Hub)."
                />

                {/* Categories Overview Bento Grid section */}
                <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-left">
                  <div className="flex flex-col md:flex-row md:items-baseline md:justify-between border-b border-gray-150 pb-4 mb-8">
                    <div>
                      <h3 className="text-xl font-extrabold text-univ-blue-800 sm:text-2xl">
                        Rekomendasi Layanan Aktivitas
                      </h3>
                      <p className="text-xs text-slate-500 mt-1">Cari bidang pengembangan kredensial Anda sesuai prodi kemahasiswaan</p>
                    </div>
                    <button 
                      onClick={() => navigateTo('ACTIVITIES')}
                      className="text-xs font-bold text-univ-orange-600 hover:text-univ-orange-700 inline-flex items-center space-x-1 mt-2 md:mt-0 hover:underline"
                    >
                      <span>Lihat Semua Kegiatan</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  {/* Bento Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                    {[
                      { icon: BookOpen, title: 'Keilmuan', desc: 'Lomba riset, karya tulis nasional, & penalaran.', cat: ActivityCategory.ACADEMIC },
                      { icon: Award, title: 'Organisasi', desc: 'Pelatihan LKMM, kepemimpinan fungsionaris.', cat: ActivityCategory.ORGANIZATION },
                      { icon: ShieldCheck, title: 'Pengabdian', desc: 'KKN tematik murni dan penyuluhan sosial.', cat: ActivityCategory.COMMUNITY },
                      { icon: Sparkles, title: 'Kesenian', desc: 'Festival teater tari & kreativitas budaya.', cat: ActivityCategory.ARTS },
                      { icon: CalendarDays, title: 'Olahraga', desc: 'Turnamen bulutangkis antar jurusan.', cat: ActivityCategory.SPORTS },
                    ].map((item, id) => (
                      <div 
                        key={id}
                        onClick={() => navigateTo('ACTIVITIES')}
                        className="group rounded-2xl border border-slate-100 bg-white p-5 shadow-sm hover:shadow-md hover:border-univ-blue-600/30 transition-all cursor-pointer"
                      >
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-univ-blue-50 text-univ-blue-800 group-hover:bg-univ-blue-800 group-hover:text-white transition-all">
                          <item.icon className="h-5 w-5" />
                        </div>
                        <h4 className="text-sm font-bold text-gray-900 mt-4 group-hover:text-univ-blue-800 transition-colors">{item.title}</h4>
                        <p className="text-[11px] text-gray-500 mt-1.5 leading-relaxed">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Featured Highlight Slider List */}
                <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-left">
                  <div className="border-b border-gray-150 pb-4 mb-8">
                    <h3 className="text-xl font-extrabold text-univ-blue-800 sm:text-2xl flex items-center space-x-2">
                      <Sparkles className="h-5.5 w-5.5 text-univ-orange-500 animate-pulse" />
                      <span>Highlight Kegiatan Terkini</span>
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">Daftar kegiatan mahasiswa terpopuler yang wajib Anda ikuti bulan ini</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {activities.slice(0, 3).map((act) => (
                      <div 
                        key={act.id}
                        className="group overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition-all hover:shadow-lg hover:-translate-y-1"
                      >
                        <div className="aspect-[16/10] w-full overflow-hidden bg-slate-100 relative">
                          <img 
                            src={act.imageUrl} 
                            alt={act.title} 
                            className="h-full w-full object-cover transition-transform group-hover:scale-105"
                            referrerPolicy="no-referrer"
                          />
                          <span className="absolute top-3 left-3 bg-white/95 text-univ-blue-800 font-bold text-[10px] px-2.5 py-1 rounded shadow">
                            {act.category}
                          </span>
                        </div>
                        <div className="p-5">
                          <span className="text-[10px] uppercase font-bold text-gray-400 font-mono tracking-wider">Deadline: {act.registrationDeadline}</span>
                          <h4 
                            onClick={() => navigateTo('DETAILS', act.id)}
                            className="text-sm font-bold text-gray-900 mt-1 line-clamp-2 hover:text-univ-blue-800 cursor-pointer transition-all"
                          >
                            {act.title}
                          </h4>
                          <div className="mt-4 flex items-center justify-between">
                            <span className="text-xs bg-univ-orange-50 text-univ-orange-700 font-extrabold rounded px-2.5 py-1">
                              E-Sertifikat Tersedia
                            </span>
                            <button 
                              onClick={() => navigateTo('DETAILS', act.id)}
                              className="text-xs font-bold text-univ-blue-800 hover:text-univ-blue-900 inline-flex items-center space-x-1"
                            >
                              <span>Lihat Detailnya</span>
                              <ArrowRight className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Informative Helpdesk FAQ and Guide Board */}
                <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-8 text-left">
                  <div className="rounded-3xl bg-gradient-to-br from-univ-blue-800 to-univ-blue-900 text-white p-6 sm:p-10 shadow-lg relative overflow-hidden">
                    <div className="absolute top-0 right-0 h-40 w-40 bg-univ-orange-500/10 rounded-full blur-3xl"></div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
                      <div className="lg:col-span-7 space-y-4">
                        <div className="inline-flex items-center space-x-1 border border-univ-orange-500/30 rounded-full bg-univ-orange-500/10 px-3 py-1 text-[11px] text-univ-orange-500 font-bold uppercase tracking-wider">
                          <Megaphone className="h-3.5 w-3.5 shrink-0" />
                          <span>Tahapan Pendaftaran & Sertifikasi</span>
                        </div>
                        <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight">Bagaimana Cara Mengikuti Kegiatan & Seminar Kampus?</h3>
                        <p className="text-xs text-slate-300 leading-relaxed max-w-xl text-justify">
                          Sistem Informasi Kegiatan Mahasiswa Universitas Anak Bangsa mendata pendaftaran agenda dan seminar kampus secara praktis. Cukup ikuti tiga proses mudah sebagai berikut:
                        </p>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                          <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                            <span className="text-lg font-extrabold text-univ-orange-500 font-mono block">1. DAFTAR</span>
                            <span className="text-[11px] text-slate-300 mt-1 block">Pilih kegiatan/seminar di Katalog dan isi formulir pendaftaran.</span>
                          </div>
                          <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                            <span className="text-lg font-extrabold text-univ-orange-500 font-mono block">2. VERIFIKASI</span>
                            <span className="text-[11px] text-slate-300 mt-1 block">Tim Kemahasiswaan akan memverifikasi berkas persyaratan Anda.</span>
                          </div>
                          <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                            <span className="text-lg font-extrabold text-univ-orange-500 font-mono block">3. SERTIFIKAT</span>
                            <span className="text-[11px] text-slate-300 mt-1 block">Pantau pendaftaran Anda, lalu klaim & unduh e-sertifikat resmi sah.</span>
                          </div>
                        </div>
                      </div>

                      <div className="lg:col-span-5 bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4">
                        <h4 className="text-sm font-bold border-b border-white/15 pb-2">Kontak Bantuan Cepat</h4>
                        <div className="space-y-3 text-xs text-slate-300">
                          <div className="flex items-center space-x-2.5">
                            <div className="flex h-7 w-7 items-center justify-center rounded bg-univ-orange-500/20 text-univ-orange-500 shrink-0">
                              <MessageSquare className="h-4 w-4" />
                            </div>
                            <span>Hubungi Sekretariat BKA via WhatsApp: 0812-3456-7890</span>
                          </div>
                          <div className="flex items-center space-x-2.5">
                            <div className="flex h-7 w-7 items-center justify-center rounded bg-univ-orange-500/20 text-univ-orange-500 shrink-0">
                              <ShieldCheck className="h-4 w-4" />
                            </div>
                            <span>Verifikasi Gagal? Email: kemahasiswaan@uab.ac.id</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            )}

            {activePage === 'ACTIVITIES' && (
              <ActivitiesList 
                activities={activities}
                onSelectActivity={(id) => navigateTo('DETAILS', id)}
                onNavigateToRegistration={(id) => navigateTo('REGISTRATION', id)}
              />
            )}

            {activePage === 'DETAILS' && selectedActivity && (
              <ActivityDetails 
                activity={selectedActivity}
                onBack={() => navigateTo('ACTIVITIES')}
                onRegister={(id) => navigateTo('REGISTRATION', id)}
              />
            )}

            {activePage === 'REGISTRATION' && selectedActivity && (
              <RegistrationForm 
                activity={selectedActivity}
                student={student}
                onBack={() => navigateTo('DETAILS', selectedActivity.id)}
                onSubmit={handleFormSubmit}
              />
            )}

            {activePage === 'PROFILE' && (
              <ProfileSection 
                student={student}
                registrations={registrations}
                activities={activities}
                onViewActivityDetails={(id) => navigateTo('DETAILS', id)}
              />
            )}

            {activePage === 'ADMIN' && (
              <AdminPanel 
                activities={activities}
                registrations={registrations}
                onApproveRegistration={handleApproveRegistration}
                onRejectRegistration={handleRejectRegistration}
                onAddActivity={handleAddActivity}
                onDeleteActivity={handleDeleteActivity}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Global Academic Footer */}
      <Footer onNavigate={(p) => navigateTo(p)} />
    </div>
  );
}

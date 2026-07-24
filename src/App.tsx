import React, { useState, useEffect } from 'react';
import { PageType, Activity, Registration, StudentProfile, ActivityCategory, ActivityStatus, isEventDatePassed, isActivityArchived } from './types';
import { INITIAL_ACTIVITIES, INITIAL_REGISTRATIONS, INITIAL_STUDENT } from './data';
import Header from './components/Header';
import Hero from './components/Hero';
import ActivitiesList from './components/ActivitiesList';
import ActivityDetails from './components/ActivityDetails';
import RegistrationForm from './components/RegistrationForm';
import ProfileSection from './components/ProfileSection';
import AdminPanel from './components/AdminPanel';
import StudentRegisterGate from './components/StudentRegisterGate';
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
    if (saved) {
      try {
        const parsed: Registration[] = JSON.parse(saved);
        if (parsed.length > 0) return parsed;
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_REGISTRATIONS;
  });

  const [student, setStudent] = useState<StudentProfile>(() => {
    const saved = localStorage.getItem('uab_student_profile_v5') || localStorage.getItem('ubn_student_profile_v5');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.name) {
          return parsed;
        }
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_STUDENT;
  });

  const [registeredStudents, setRegisteredStudents] = useState<StudentProfile[]>(() => {
    const saved = localStorage.getItem('uab_all_registered_students_v5');
    if (saved) {
      try {
        const parsed: StudentProfile[] = JSON.parse(saved);
        if (parsed.length > 0) return parsed;
      } catch (e) {
        console.error(e);
      }
    }
    return [INITIAL_STUDENT];
  });

  const [isRegistered, setIsRegistered] = useState<boolean>(() => {
    return localStorage.getItem('uab_student_registered_v5') === 'true';
  });

  const handleLogout = () => {
    localStorage.removeItem('uab_student_registered_v5');
    localStorage.removeItem('uab_student_profile_v5');
    localStorage.removeItem('uab_is_admin_authenticated');
    localStorage.setItem('uab_just_logged_out_v5', 'true');
    setIsRegistered(false);
    setActivePage('HOME');
  };

  const [plhRektorName, setPlhRektorName] = useState<string>(() => {
    return localStorage.getItem('uab_plh_rektor_name_v5') || 'Dr. Ir. H. Mulyono, M.T.';
  });

  const [officialContactName, setOfficialContactName] = useState<string>(() => {
    return localStorage.getItem('uab_official_contact_name_v5') || 'Biro Kemahasiswaan UNABA';
  });

  const [officialContactPhone, setOfficialContactPhone] = useState<string>(() => {
    return localStorage.getItem('uab_official_contact_phone_v5') || '0812-3456-7890';
  });

  const [officialContactEmail, setOfficialContactEmail] = useState<string>(() => {
    return localStorage.getItem('uab_official_contact_email_v5') || 'kemahasiswaan@unaba.ac.id';
  });

  const [officialSecretariatAddress, setOfficialSecretariatAddress] = useState<string>(() => {
    return localStorage.getItem('uab_official_secretariat_address_v5') || 'Gedung Rektorat Lt. 2, Jalan Jenderal Sudirman Kav. 21, Karet Semanggi, Jakarta Selatan';
  });

  const [activePage, setActivePage] = useState<PageType>(() => {
    const saved = localStorage.getItem('uab_active_page_v5') || localStorage.getItem('ubn_active_page_v5');
    return saved ? (saved as PageType) : 'HOME';
  });

  const [selectedActivityId, setSelectedActivityId] = useState<string>(() => {
    return localStorage.getItem('uab_selected_activity_id_v5') || localStorage.getItem('ubn_selected_activity_id_v5') || '';
  });

  // Intel/Sync to localStorage
  useEffect(() => {
    localStorage.setItem('uab_activities_v5', JSON.stringify(activities));
  }, [activities]);

  useEffect(() => {
    localStorage.setItem('uab_registrations_v5', JSON.stringify(registrations));
  }, [registrations]);

  useEffect(() => {
    localStorage.setItem('uab_all_registered_students_v5', JSON.stringify(registeredStudents));
  }, [registeredStudents]);

  useEffect(() => {
    localStorage.setItem('uab_student_profile_v5', JSON.stringify(student));
    
    // Also update this student profile record inside the master registry list
    if (isRegistered && student && student.nim) {
      setRegisteredStudents(prev => {
        const index = prev.findIndex(s => s.nim.trim() === student.nim.trim());
        if (index !== -1) {
          const currentItem = prev[index];
          if (JSON.stringify(currentItem) !== JSON.stringify(student)) {
            const updated = [...prev];
            updated[index] = student;
            return updated;
          }
        } else {
          return [...prev, student];
        }
        return prev;
      });
    }
  }, [student, isRegistered]);

  useEffect(() => {
    // Synchronize all students' registeredActivityIds based on the latest registrations
    setRegisteredStudents(prev => {
      let listChanged = false;
      const updatedList = prev.map(stu => {
        const stuRegs = registrations.filter(r => r.studentNim.trim() === stu.nim.trim());
        const registeredIds = stuRegs.map(r => r.activityId);
        
        const idsChanged = JSON.stringify(stu.registeredActivityIds.sort()) !== JSON.stringify(registeredIds.sort());
        
        if (idsChanged) {
          listChanged = true;
          return {
            ...stu,
            registeredActivityIds: registeredIds
          };
        }
        return stu;
      });
      return listChanged ? updatedList : prev;
    });

    // Also keep the currently logged-in student state in sync
    if (isRegistered && student && student.nim) {
      const stuRegs = registrations.filter(r => r.studentNim.trim() === student.nim.trim());
      const registeredIds = stuRegs.map(r => r.activityId);

      const idsChanged = JSON.stringify(student.registeredActivityIds.sort()) !== JSON.stringify(registeredIds.sort());

      if (idsChanged) {
        setStudent(prev => ({
          ...prev,
          registeredActivityIds: registeredIds
        }));
      }
    }
  }, [registrations]);

  useEffect(() => {
    localStorage.setItem('uab_plh_rektor_name_v5', plhRektorName);
  }, [plhRektorName]);

  useEffect(() => {
    localStorage.setItem('uab_official_contact_name_v5', officialContactName);
  }, [officialContactName]);

  useEffect(() => {
    localStorage.setItem('uab_official_contact_phone_v5', officialContactPhone);
  }, [officialContactPhone]);

  useEffect(() => {
    localStorage.setItem('uab_official_contact_email_v5', officialContactEmail);
  }, [officialContactEmail]);

  useEffect(() => {
    localStorage.setItem('uab_official_secretariat_address_v5', officialSecretariatAddress);
  }, [officialSecretariatAddress]);

  useEffect(() => {
    localStorage.setItem('uab_active_page_v5', activePage);
  }, [activePage]);

  // Synchronize active student profile's registeredActivityIds with the registrations database
  useEffect(() => {
    if (!isRegistered || !student || !student.nim) return;

    const studentRegs = registrations.filter(r => r.studentNim.trim() === student.nim.trim());
    const registeredIds = studentRegs.map(r => r.activityId);

    const isIdsSame = JSON.stringify(student.registeredActivityIds) === JSON.stringify(registeredIds);

    if (!isIdsSame) {
      setStudent(prev => ({
        ...prev,
        registeredActivityIds: registeredIds
      }));
    }
  }, [registrations, student.nim, isRegistered]);

  // Synchronize registered counts dynamically based on verified (APPROVED) registrations
  const activitiesWithUpdatedCounts = React.useMemo(() => {
    return activities.map(act => {
      const approvedCount = registrations.filter(r => r.activityId === act.id && r.status === 'APPROVED').length;
      return {
        ...act,
        registeredCount: approvedCount
      };
    });
  }, [activities, registrations]);

  useEffect(() => {
    localStorage.setItem('uab_selected_activity_id_v5', selectedActivityId);
  }, [selectedActivityId]);

  // --- Router Navigation Orchestrator with Top Scrolling ---
  const navigateTo = (page: PageType, activityId?: string) => {
    if (page === 'REGISTRATION') {
      const actId = activityId || selectedActivityId;
      const act = activities.find(a => a.id === actId);
      if (act && isActivityArchived(act)) {
        alert("Maaf, pendaftaran ditutup karena kegiatan ini sudah masuk arsip atau sudah lewat.");
        return;
      }
    }
    setActivePage(page);
    if (activityId) {
      setSelectedActivityId(activityId);
    }
    // UX requirement: immediate jump to the top on transition click
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  // --- Core State Mutators ---
  const handleApproveRegistration = (regId: string) => {
    const targetReg = registrations.find(r => r.id === regId);
    if (!targetReg) return;

    const alreadyApproved = registrations.some(
      r => r.id !== regId && r.activityId === targetReg.activityId && r.studentNim.trim() === targetReg.studentNim.trim() && r.status === 'APPROVED'
    );

    if (alreadyApproved) {
      alert(`Gagal Menyetujui: Mahasiswa dengan NIM ${targetReg.studentNim} sudah terverifikasi (APPROVED) aktif untuk kegiatan "${targetReg.activityTitle}". Pendaftaran ganda tidak diperbolehkan!`);
      return;
    }

    const updatedRegs = registrations.map(reg => {
      if (reg.id === regId) {
        if (reg.studentNim.trim() === student.nim.trim()) {
          setStudent(prev => {
            const alreadyRegistered = prev.registeredActivityIds.includes(reg.activityId);
            const nextRegistered = alreadyRegistered 
              ? prev.registeredActivityIds 
              : [...prev.registeredActivityIds, reg.activityId];
            return {
              ...prev,
              registeredActivityIds: nextRegistered
            };
          });
        }
        return { ...reg, status: 'APPROVED' as const };
      }
      return reg;
    });
    setRegistrations(updatedRegs);
    alert('Registrasi telah disetujui (Approved). Status pendaftaran mahasiswa telah diperbarui!');
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

  const handleEditActivity = (updatedAct: Activity) => {
    setActivities(prev => prev.map(act => act.id === updatedAct.id ? updatedAct : act));
    setRegistrations(prev => prev.map(reg => {
      if (reg.activityId === updatedAct.id) {
        return {
          ...reg,
          activityTitle: updatedAct.title
        };
      }
      return reg;
    }));
  };

  const handleDeleteActivity = (id: string) => {
    setActivities(prev => prev.filter(act => act.id !== id));
    setRegistrations(prev => prev.filter(reg => reg.activityId !== id));
  };

  const handleDeleteRegistration = (regId: string) => {
    const targetReg = registrations.find(r => r.id === regId);
    if (!targetReg) return;

    setRegistrations(prev => prev.filter(reg => reg.id !== regId));

    // Keep student profile and SKPI score points in sync if they belong to active student
    if (targetReg.studentNim.trim() === student.nim.trim()) {
      setStudent(prev => ({
        ...prev,
        registeredActivityIds: prev.registeredActivityIds.filter(id => id !== targetReg.activityId)
      }));
    }

    // Trigger explicit alert feedback so the admin is confident the registration is deleted
    alert(`Berkas pendaftaran ${targetReg.studentName} (NIM: ${targetReg.studentNim}) pada kegiatan "${targetReg.activityTitle}" berhasil dihapus secara permanen.`);
  };

  const handleDeleteStudent = (nim: string, name: string) => {
    // 1. Remove from registeredStudents list
    setRegisteredStudents(prev => prev.filter(s => s.nim.trim() !== nim.trim()));
    
    // 2. Remove all registrations for this student
    setRegistrations(prev => prev.filter(reg => reg.studentNim.trim() !== nim.trim()));

    // 3. If currently logged-in student, log them out!
    if (student && student.nim.trim() === nim.trim()) {
      handleLogout();
    }

    alert(`Akun mahasiswa "${name}" (NIM: ${nim}) beserta semua riwayat pendaftarannya berhasil dihapus dari database.`);
  };

  const handleUpdateStudent = (updatedStudent: StudentProfile) => {
    setRegisteredStudents(prev => prev.map(s => s.nim.trim() === updatedStudent.nim.trim() ? updatedStudent : s));
    
    if (student && student.nim.trim() === updatedStudent.nim.trim()) {
      setStudent(prev => ({
        ...prev,
        ...updatedStudent
      }));
    }

    setRegistrations(prev => prev.map(reg => {
      if (reg.studentNim.trim() === updatedStudent.nim.trim()) {
        return {
          ...reg,
          studentName: updatedStudent.name,
          studentDepartment: updatedStudent.department,
          studentSemester: updatedStudent.semester,
          studentFaculty: updatedStudent.faculty || reg.studentFaculty
        };
      }
      return reg;
    }));
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

  // Find selected activity helper with dynamically synchronized counts
  const selectedActivity = activitiesWithUpdatedCounts.find(a => a.id === selectedActivityId) || activitiesWithUpdatedCounts[0];

  if (!isRegistered) {
    return (
      <StudentRegisterGate 
        onRegisterComplete={(newStudent) => {
          setStudent(newStudent);
          setIsRegistered(true);
        }} 
        onAdminLogin={() => {
          localStorage.setItem('uab_student_registered_v5', 'true');
          localStorage.setItem('uab_is_admin_authenticated', 'true');
          setStudent({
            name: 'Administrator Portal',
            nim: '99999999',
            email: 'admin@unaba.ac.id',
            department: 'Sistem Informasi',
            semester: 8,
            skpiPointsAccumulated: 100,
            registeredActivityIds: [],
            faculty: 'Fakultas Psikologi dan Sains'
          });
          setIsRegistered(true);
          setActivePage('ADMIN');
        }}
      />
    );
  }

  return (
    <div className="flex min-h-screen w-full max-w-full overflow-x-hidden flex-col bg-slate-50 font-sans selection:bg-univ-orange-100 selection:text-univ-orange-700">
      
      {/* Top sticky responsive Navbar */}
      <Header 
        activePage={activePage} 
        onChangePage={(p) => navigateTo(p)} 
        student={student} 
        onLogout={handleLogout}
      />

      {/* Main Content Area with Smooth Animation Page Transitions */}
      <main className="flex-grow w-full max-w-full overflow-x-hidden">
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
                  subtitle="Selamat datang di Pusat Informasi Universitas Anak Bangsa (UNABA Student Hub)."
                />

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
                            <span>Hubungi {officialContactName} via WhatsApp: {officialContactPhone}</span>
                          </div>
                          <div className="flex items-center space-x-2.5">
                            <div className="flex h-7 w-7 items-center justify-center rounded bg-univ-orange-500/20 text-univ-orange-500 shrink-0">
                              <ShieldCheck className="h-4 w-4" />
                            </div>
                            <span>Verifikasi Gagal? Email: {officialContactEmail}</span>
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
                activities={activitiesWithUpdatedCounts}
                onSelectActivity={(id) => navigateTo('DETAILS', id)}
                onNavigateToRegistration={(id) => navigateTo('REGISTRATION', id)}
                registeredActivityIds={student.registeredActivityIds}
              />
            )}

            {activePage === 'DETAILS' && selectedActivity && (
              <ActivityDetails 
                activity={selectedActivity}
                onBack={() => navigateTo('ACTIVITIES')}
                onRegister={(id) => navigateTo('REGISTRATION', id)}
                hasRegistered={student.registeredActivityIds.includes(selectedActivity.id)}
                officialContactName={officialContactName}
                officialContactPhone={officialContactPhone}
              />
            )}

            {activePage === 'REGISTRATION' && selectedActivity && (
              <RegistrationForm 
                activity={selectedActivity}
                student={student}
                registrations={registrations}
                onBack={() => navigateTo('DETAILS', selectedActivity.id)}
                onSubmit={handleFormSubmit}
              />
            )}

            {activePage === 'PROFILE' && (
              <ProfileSection 
                student={student}
                registrations={registrations}
                activities={activitiesWithUpdatedCounts}
                onViewActivityDetails={(id) => navigateTo('DETAILS', id)}
                plhRektorName={plhRektorName}
                onLogout={handleLogout}
              />
            )}

            {activePage === 'ADMIN' && (
              <AdminPanel 
                activities={activitiesWithUpdatedCounts}
                registrations={registrations}
                studentsList={registeredStudents}
                onApproveRegistration={handleApproveRegistration}
                onRejectRegistration={handleRejectRegistration}
                onDeleteRegistration={handleDeleteRegistration}
                onAddActivity={handleAddActivity}
                onEditActivity={handleEditActivity}
                onDeleteActivity={handleDeleteActivity}
                onDeleteStudent={handleDeleteStudent}
                onUpdateStudent={handleUpdateStudent}
                plhRektorName={plhRektorName}
                onUpdatePlhRektorName={setPlhRektorName}
                officialContactName={officialContactName}
                onUpdateOfficialContactName={setOfficialContactName}
                officialContactPhone={officialContactPhone}
                onUpdateOfficialContactPhone={setOfficialContactPhone}
                officialContactEmail={officialContactEmail}
                onUpdateOfficialContactEmail={setOfficialContactEmail}
                officialSecretariatAddress={officialSecretariatAddress}
                onUpdateOfficialSecretariatAddress={setOfficialSecretariatAddress}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Global Academic Footer */}
      <Footer 
        onNavigate={(p) => navigateTo(p)} 
        contactPhone={officialContactPhone}
        contactEmail={officialContactEmail}
        secretariatAddress={officialSecretariatAddress}
      />
    </div>
  );
}

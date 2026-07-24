import React, { useState } from 'react';
import { Activity, Registration, ActivityCategory, ActivityStatus, StudentProfile } from '../types';
import { 
  Lock, LogIn, Users, Check, X, ShieldAlert, Award, Grid, 
  MapPin, Calendar, Clock, Plus, Trash2, Edit, Edit3, Image as ImageIcon, 
  Search, RefreshCw, Layers, CheckCircle, UploadCloud, Save, FileUp, FileCheck2, Eye
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import CertificateModal from './CertificateModal';

interface AdminPanelProps {
  activities: Activity[];
  registrations: Registration[];
  studentsList: StudentProfile[];
  onApproveRegistration: (id: string) => void;
  onRejectRegistration: (id: string) => void;
  onDeleteRegistration: (id: string) => void;
  onAddActivity: (activity: Activity) => void;
  onEditActivity: (activity: Activity) => void;
  onDeleteActivity: (id: string) => void;
  onDeleteStudent: (nim: string, name: string) => void;
  onUpdateStudent?: (student: StudentProfile) => void;
  plhRektorName: string;
  onUpdatePlhRektorName: (name: string) => void;
  officialContactName: string;
  onUpdateOfficialContactName: (name: string) => void;
  officialContactPhone: string;
  onUpdateOfficialContactPhone: (phone: string) => void;
  officialContactEmail: string;
  onUpdateOfficialContactEmail: (email: string) => void;
  officialSecretariatAddress: string;
  onUpdateOfficialSecretariatAddress: (address: string) => void;
}

const IMAGE_PRESETS = [
  { label: '💼 Kepemimpinan / LKMM', url: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800&h=450' },
  { label: '🏸 Turnamen Olahraga', url: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&q=80&w=800&h=450' },
  { label: '🤝 Pengabdian KKN', url: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=800&h=450' },
  { label: '🎨 Festival Budaya / Tari', url: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?auto=format&fit=crop&q=80&w=800&h=450' },
  { label: '🎤 Seminar Akbar', url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=800&h=450' }
];

export default function AdminPanel({
  activities,
  registrations,
  studentsList,
  onApproveRegistration,
  onRejectRegistration,
  onDeleteRegistration,
  onAddActivity,
  onEditActivity,
  onDeleteActivity,
  onDeleteStudent,
  onUpdateStudent,
  plhRektorName,
  onUpdatePlhRektorName,
  officialContactName,
  onUpdateOfficialContactName,
  officialContactPhone,
  onUpdateOfficialContactPhone,
  officialContactEmail,
  onUpdateOfficialContactEmail,
  officialSecretariatAddress,
  onUpdateOfficialSecretariatAddress,
}: AdminPanelProps) {
  // Search filters for registrations and students
  const [regSearch, setRegSearch] = useState('');
  const [studentSearch, setStudentSearch] = useState('');

  // Editing student state
  const [editingStudent, setEditingStudent] = useState<StudentProfile | null>(null);
  const [editStudentName, setEditStudentName] = useState('');
  const [editStudentDepartment, setEditStudentDepartment] = useState('');
  const [editStudentFaculty, setEditStudentFaculty] = useState('');
  const [editStudentSemester, setEditStudentSemester] = useState<number>(1);
  const [editStudentEmail, setEditStudentEmail] = useState('');

  const handleOpenStudentEdit = (stu: StudentProfile) => {
    setEditingStudent(stu);
    setEditStudentName(stu.name);
    setEditStudentDepartment(stu.department || 'Sistem Informasi');
    setEditStudentFaculty(stu.faculty || 'Fakultas Psikologi dan Sains');
    setEditStudentSemester(stu.semester || 1);
    setEditStudentEmail(stu.email || '');
  };

  const handleSaveStudentEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent) return;
    const updated: StudentProfile = {
      ...editingStudent,
      name: editStudentName,
      department: editStudentDepartment,
      faculty: editStudentFaculty,
      semester: editStudentSemester,
      email: editStudentEmail
    };
    if (onUpdateStudent) {
      onUpdateStudent(updated);
    }
    setEditingStudent(null);
    alert(`Data mahasiswa "${updated.name}" (Program Studi: ${updated.department}) berhasil diperbarui & disinkronkan ke seluruh portal!`);
  };

  const filteredRegistrations = registrations.filter(r => 
    r.studentName.toLowerCase().includes(regSearch.toLowerCase()) ||
    r.studentNim.toLowerCase().includes(regSearch.toLowerCase()) ||
    r.activityTitle.toLowerCase().includes(regSearch.toLowerCase())
  );

  const filteredStudentsList = studentsList.filter(s =>
    s.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
    s.nim.toLowerCase().includes(studentSearch.toLowerCase()) ||
    (s.department && s.department.toLowerCase().includes(studentSearch.toLowerCase()))
  );

  // Authentication State
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => {
    return localStorage.getItem('uab_is_admin_authenticated') === 'true';
  });
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  React.useEffect(() => {
    if (localStorage.getItem('uab_is_admin_authenticated') === 'true') {
      setIsAdminLoggedIn(true);
    }
  }, []);

  // Local Settings States (for "Simpan Perubahan/Save Changes" requirement)
  const [localPlhRektorName, setLocalPlhRektorName] = useState(plhRektorName);
  const [localOfficialContactName, setLocalOfficialContactName] = useState(officialContactName);
  const [localOfficialContactPhone, setLocalOfficialContactPhone] = useState(officialContactPhone);
  const [localOfficialContactEmail, setLocalOfficialContactEmail] = useState(officialContactEmail);
  const [localOfficialSecretariatAddress, setLocalOfficialSecretariatAddress] = useState(officialSecretariatAddress);

  // Sync with prop updates
  React.useEffect(() => {
    setLocalPlhRektorName(plhRektorName);
  }, [plhRektorName]);

  React.useEffect(() => {
    setLocalOfficialContactName(officialContactName);
  }, [officialContactName]);

  React.useEffect(() => {
    setLocalOfficialContactPhone(officialContactPhone);
  }, [officialContactPhone]);

  React.useEffect(() => {
    setLocalOfficialContactEmail(officialContactEmail);
  }, [officialContactEmail]);

  React.useEffect(() => {
    setLocalOfficialSecretariatAddress(officialSecretariatAddress);
  }, [officialSecretariatAddress]);

  const hasSettingsChanges = 
    localPlhRektorName !== plhRektorName ||
    localOfficialContactName !== officialContactName ||
    localOfficialContactPhone !== officialContactPhone ||
    localOfficialContactEmail !== officialContactEmail ||
    localOfficialSecretariatAddress !== officialSecretariatAddress;

  const handleSaveSettings = () => {
    onUpdatePlhRektorName(localPlhRektorName);
    onUpdateOfficialContactName(localOfficialContactName);
    onUpdateOfficialContactPhone(localOfficialContactPhone);
    onUpdateOfficialContactEmail(localOfficialContactEmail);
    onUpdateOfficialSecretariatAddress(localOfficialSecretariatAddress);
    alert('Seluruh perubahan konfigurasi portal berhasil disimpan!');
  };

  // Primary active view selection tab
  const [activeTab, setActiveTab] = useState<'VERIFICATION' | 'CATALOG' | 'CERTIFICATES' | 'STUDENTS'>('VERIFICATION');

  // Modal preview state for admin
  const [adminPreviewCertData, setAdminPreviewCertData] = useState<{
    studentName: string;
    studentNim: string;
    studentDepartment: string;
    activity: Activity;
    registrationId?: string;
  } | null>(null);

  // Database is automatically synchronized via React state props!
  const refreshStudentsList = () => {
    alert("Database akun mahasiswa tersinkronisasi otomatis secara real-time!");
  };

  const handleDeleteStudent = (nim: string, name: string) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus akun mahasiswa "${name}" (NIM: ${nim}) dari portal? Semua data pendaftaran kegiatan mereka juga akan ikut terhapus.`)) {
      onDeleteStudent(nim, name);
    }
  };

  // Search inside catalog list
  const [searchQuery, setSearchQuery] = useState('');
  const [adminActivityFilter, setAdminActivityFilter] = useState<'ALL' | 'ACTIVE' | 'ARCHIVED'>('ALL');

  // Add event panel visibility & Form state
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newLongDesc, setNewLongDesc] = useState('');
  const [newCategory, setNewCategory] = useState<ActivityCategory>(ActivityCategory.ACADEMIC);
  const [newPoints, setNewPoints] = useState(10);
  const [newQuota, setNewQuota] = useState(100);
  const [newLocation, setNewLocation] = useState('');
  const [newEventDate, setNewEventDate] = useState('');
  const [newEventTime, setNewEventTime] = useState('08:00 - 12:00 WIB');
  const [newDeadline, setNewDeadline] = useState('');
  const [newRequirements, setNewRequirements] = useState('');
  const [newBenefits, setNewBenefits] = useState('');
  const [newImageUrl, setNewImageUrl] = useState(IMAGE_PRESETS[0].url);
  const [newHasCertificate, setNewHasCertificate] = useState(true);
  const [newCertificateUploaded, setNewCertificateUploaded] = useState(true);
  const [newCertificateTemplateUrl, setNewCertificateTemplateUrl] = useState('');
  const [newCertificateSignerName, setNewCertificateSignerName] = useState('Dr. Ir. H. Mulyono, M.T.');
  const [newCertificateSignerRole, setNewCertificateSignerRole] = useState('PLH Rektor Universitas Anak Bangsa');

  // Dedicated Certificate Edit Modal state
  const [editingCertActivity, setEditingCertActivity] = useState<Activity | null>(null);
  const [certSignerNameInput, setCertSignerNameInput] = useState('');
  const [certSignerRoleInput, setCertSignerRoleInput] = useState('');
  const [certTitleInput, setCertTitleInput] = useState('');
  const [certDateInput, setCertDateInput] = useState('');
  const [certHasEnabledInput, setCertHasEnabledInput] = useState(true);
  const [certAllowDownloadInput, setCertAllowDownloadInput] = useState(true);

  const handleOpenCertEditor = (act: Activity) => {
    setEditingCertActivity(act);
    setCertSignerNameInput(act.certificateSignerName || plhRektorName || 'Dr. Ir. H. Mulyono, M.T.');
    setCertSignerRoleInput(act.certificateSignerRole || 'PLH Rektor Universitas Anak Bangsa');
    setCertTitleInput(act.title);
    setCertDateInput(act.eventDate || '');
    setCertHasEnabledInput(act.hasCertificate !== false);
    setCertAllowDownloadInput(act.allowCertificateDownload !== false);
  };

  const handleSaveCertEditor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCertActivity) return;

    onEditActivity({
      ...editingCertActivity,
      title: certTitleInput,
      eventDate: certDateInput,
      certificateSignerName: certSignerNameInput,
      certificateSignerRole: certSignerRoleInput,
      hasCertificate: certHasEnabledInput,
      certificateUploaded: certHasEnabledInput,
      allowCertificateDownload: certAllowDownloadInput,
    });
    alert(`Detail sertifikat untuk "${certTitleInput}" berhasil diperbarui!`);
    setEditingCertActivity(null);
  };

  // Edit Activity Panel state
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editLongDesc, setEditLongDesc] = useState('');
  const [editCategory, setEditCategory] = useState<ActivityCategory>(ActivityCategory.ACADEMIC);
  const [editPoints, setEditPoints] = useState(10);
  const [editQuota, setEditQuota] = useState(100);
  const [editLocation, setEditLocation] = useState('');
  const [editEventDate, setEditEventDate] = useState('');
  const [editEventTime, setEditEventTime] = useState('08:00 - 12:00 WIB');
  const [editDeadline, setEditDeadline] = useState('');
  const [editRequirements, setEditRequirements] = useState('');
  const [editBenefits, setEditBenefits] = useState('');
  const [editImageUrl, setEditImageUrl] = useState('');
  const [editHasCertificate, setEditHasCertificate] = useState(true);
  const [editCertificateUploaded, setEditCertificateUploaded] = useState(false);
  const [editCertificateTemplateUrl, setEditCertificateTemplateUrl] = useState('');
  const [editCertificateSignerName, setEditCertificateSignerName] = useState('');
  const [editCertificateSignerRole, setEditCertificateSignerRole] = useState('');

  const handleLocalCertificateUpload = (e: React.ChangeEvent<HTMLInputElement>, isEditMode: boolean) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 8 * 1024 * 1024) {
      alert('Ukuran file template sertifikat terlalu besar. Silakan pilih file di bawah 8MB.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      if (isEditMode) {
        setEditCertificateTemplateUrl(base64String);
        setEditCertificateUploaded(true);
      } else {
        setNewCertificateTemplateUrl(base64String);
        setNewCertificateUploaded(true);
      }
      alert('File sertifikat kegiatan berhasil di-upload!');
    };
    reader.readAsDataURL(file);
  };

  const handleLocalImageUpload = (e: React.ChangeEvent<HTMLInputElement>, isEditMode: boolean) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('Ukuran file foto terlalu besar. Silakan pilih foto di bawah 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      if (isEditMode) {
        setEditImageUrl(base64String);
      } else {
        setNewImageUrl(base64String);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'admin' && password === 'admin123') {
      setIsAdminLoggedIn(true);
      localStorage.setItem('uab_is_admin_authenticated', 'true');
      setLoginError('');
    } else {
      setLoginError('Kredensial salah. Silakan periksa kembali username dan kata sandi Anda.');
    }
  };

  const handleCreateActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newDesc || !newLocation || !newEventDate || !newDeadline) {
      alert('Harap isi semua baris wajib bertanda bintang.');
      return;
    }

    const createdActivity: Activity = {
      id: `act-${Date.now()}`,
      title: newTitle,
      description: newDesc,
      longDescription: newLongDesc || newDesc,
      category: newCategory,
      status: ActivityStatus.OPEN,
      skpiPoints: Number(newPoints) || 5,
      imageUrl: newImageUrl || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=800&h=450',
      registrationDeadline: newDeadline,
      eventDate: newEventDate,
      eventTime: newEventTime || '08:00 - 12:00 WIB',
      quota: Number(newQuota) || 50,
      registeredCount: 0,
      location: newLocation,
      benefits: newBenefits ? newBenefits.split(',').map(b => b.trim()) : ['Sertifikat Resmi UNABA', 'Voucher Konsumsi'],
      requirements: newRequirements ? newRequirements.split(',').map(r => r.trim()) : ['Mahasiswa Aktif UNABA'],
      contactPerson: {
        name: officialContactName,
        phone: officialContactPhone
      },
      hasCertificate: newHasCertificate,
      certificateUploaded: newHasCertificate ? newCertificateUploaded : false,
      certificateTemplateUrl: newCertificateTemplateUrl,
      certificateSignerName: newCertificateSignerName,
      certificateSignerRole: newCertificateSignerRole
    };

    onAddActivity(createdActivity);
    
    // Clear fields
    setNewTitle('');
    setNewDesc('');
    setNewLongDesc('');
    setNewPoints(10);
    setNewQuota(100);
    setNewLocation('');
    setNewEventDate('');
    setNewEventTime('08:00 - 12:00 WIB');
    setNewDeadline('');
    setNewRequirements('');
    setNewBenefits('');
    setNewImageUrl(IMAGE_PRESETS[0].url);
    setNewHasCertificate(true);
    setNewCertificateUploaded(true);
    setNewCertificateTemplateUrl('');
    setNewCertificateSignerName('Dr. Ir. H. Mulyono, M.T.');
    setNewCertificateSignerRole('PLH Rektor Universitas Anak Bangsa');
    
    setShowAddForm(false);
    alert('Aktivitas baru berhasil diluncurkan ke katalog!');
  };

  const handleBeginEdit = (act: Activity) => {
    setEditingActivity(act);
    setEditTitle(act.title);
    setEditDesc(act.description);
    setEditLongDesc(act.longDescription);
    setEditCategory(act.category);
    setEditPoints(act.skpiPoints);
    setEditQuota(act.quota);
    setEditLocation(act.location);
    setEditEventDate(act.eventDate);
    setEditEventTime(act.eventTime || '08:00 - 12:00 WIB');
    setEditDeadline(act.registrationDeadline);
    setEditImageUrl(act.imageUrl);
    setEditRequirements(act.requirements.join(', '));
    setEditBenefits(act.benefits.join(', '));
    setEditHasCertificate(act.hasCertificate !== false);
    setEditCertificateUploaded(!!act.certificateUploaded);
    setEditCertificateTemplateUrl(act.certificateTemplateUrl || '');
    setEditCertificateSignerName(act.certificateSignerName || plhRektorName || 'Dr. Ir. H. Mulyono, M.T.');
    setEditCertificateSignerRole(act.certificateSignerRole || 'PLH Rektor Universitas Anak Bangsa');
    
    // Scroll window smoothly to form panel
    window.scrollTo({ top: 320, behavior: 'smooth' });
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingActivity) return;

    if (!editTitle || !editDesc || !editLocation || !editEventDate || !editDeadline) {
      alert('Harap isi semua baris wajib bertanda bintang.');
      return;
    }

    const updatedActivity: Activity = {
      ...editingActivity,
      title: editTitle,
      description: editDesc,
      longDescription: editLongDesc || editDesc,
      category: editCategory,
      skpiPoints: Number(editPoints) || 5,
      imageUrl: editImageUrl || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=800&h=450',
      registrationDeadline: editDeadline,
      eventDate: editEventDate,
      eventTime: editEventTime || '08:00 - 12:00 WIB',
      quota: Number(editQuota) || 50,
      location: editLocation,
      benefits: editBenefits ? editBenefits.split(',').map(b => b.trim()) : ['Sertifikat Resmi UNABA', 'Voucher Konsumsi'],
      requirements: editRequirements ? editRequirements.split(',').map(r => r.trim()) : ['Mahasiswa Aktif UNABA'],
      hasCertificate: editHasCertificate,
      certificateUploaded: editHasCertificate ? editCertificateUploaded : false,
      certificateTemplateUrl: editCertificateTemplateUrl,
      certificateSignerName: editCertificateSignerName,
      certificateSignerRole: editCertificateSignerRole
    };

    onEditActivity(updatedActivity);
    setEditingActivity(null);
    alert(`Aktivitas "${updatedActivity.title}" berhasil diperbarui!`);
  };

  const handleCancelEdit = () => {
    setEditingActivity(null);
  };

  const handleLogout = () => {
    setIsAdminLoggedIn(false);
    localStorage.removeItem('uab_is_admin_authenticated');
    setUsername('');
    setPassword('');
  };

  // Metrics counting
  const totalRegistrations = registrations.length;
  const pendingRegistrations = registrations.filter(r => r.status === 'PENDING').length;
  const approvedRegistrations = registrations.filter(r => r.status === 'APPROVED').length;

  // Filter existing activities based on search box query and active/archived state
  const filteredActivities = activities.filter(act => {
    const matchesSearch = 
      act.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      act.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      act.location.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    // Check if archived (registration deadline is in the past)
    const deadlineDate = new Date(act.registrationDeadline);
    const today = new Date();
    today.setHours(0,0,0,0);
    const isPast = deadlineDate.getTime() < today.getTime();

    if (adminActivityFilter === 'ACTIVE') return !isPast;
    if (adminActivityFilter === 'ARCHIVED') return isPast;
    return true;
  });

  if (!isAdminLoggedIn) {
    return (
      <div id="admin-login-layout" className="mx-auto max-w-md px-4 py-16 text-left">
        <div className="rounded-3xl border border-gray-150 bg-white p-6 sm:p-10 shadow-lg space-y-6">
          <div className="text-center space-y-3">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-univ-blue-50 text-univ-blue-800 border border-univ-blue-100">
              <Lock className="h-6 w-6 text-univ-orange-500" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-gray-950">Log Masuk Administrator</h2>
              <p className="text-xs text-gray-400 mt-1">Gunakan kredensial pengelola Biro Kemahasiswaan UNABA</p>
            </div>
          </div>

          <form onSubmit={handleAdminLogin} className="space-y-4">
            {/* Username */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-600">Username Admin</label>
              <input
                id="admin-username"
                type="text"
                required
                placeholder="Masukkan Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-gray-800 transition-all focus:border-univ-blue-600 focus:bg-white focus:outline-none"
              />
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-600">Kata Sandi</label>
              <input
                id="admin-password"
                type="password"
                required
                placeholder="Masukkan Kata Sandi"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-gray-800 transition-all focus:border-univ-blue-600 focus:bg-white focus:outline-none"
              />
            </div>

            {loginError && (
              <p className="text-xs font-bold text-rose-600 border border-rose-100 bg-rose-50 rounded-lg p-2.5 text-center">
                {loginError}
              </p>
            )}

            <button
              id="submit-admin-login"
              type="submit"
              className="w-full rounded-xl bg-univ-blue-800 py-3.5 text-center text-sm font-extrabold text-white hover:bg-univ-blue-900 transition-all cursor-pointer flex items-center justify-center space-x-2"
            >
              <LogIn className="h-4 w-4" />
              <span>Masuk Sekarang</span>
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div id="admin-dashboard-container" className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 text-left">
      
      {/* Upper header */}
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center border-b border-slate-100 pb-6">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-univ-blue-800 sm:text-3xl">
            Pusat Pengendalian Biro Kemahasiswaan
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Selamat datang di Konsol Kampus. Kelola verifikasi berkas KTM pendaftaran mahasiswa serta tambah & edit katalog kegiatan secara langsung.
          </p>
        </div>
        
        <button
          onClick={handleLogout}
          className="rounded-xl border border-rose-250 bg-rose-50 text-rose-700 hover:bg-rose-100 px-4 py-2.5 text-xs font-bold cursor-pointer transition-all self-start md:self-auto shrink-0"
        >
          Keluar Admin
        </button>
      </div>

      {/* Portals Global Configuration Panel (PLH Rektor & contact person) */}
      <div className="mb-8 rounded-2xl border border-slate-200 bg-slate-50 p-5 shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 border-b border-slate-200 pb-3">
          <div className="space-y-1 max-w-2xl text-left">
            <span className="inline-block text-[9px] bg-univ-orange-100 text-univ-orange-850 font-extrabold uppercase rounded px-2 py-0.5 tracking-wider">
              Konfigurasi Global Portal
            </span>
            <h3 className="text-sm font-extrabold text-slate-850 mt-1">Sertifikat Resmi & Narahubung</h3>
            <p className="text-xs text-slate-500 leading-normal">
              Ubah data pejabat PLH Rektor serta narahubung resmi bantuan di bawah ini untuk mengupdate dokumen sertifikat dan detail bantuan kemahasiswaan secara *realtime*.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* PLH Rektor Name */}
          <div className="space-y-1 bg-white p-3 rounded-xl border border-slate-100">
            <label className="block text-[10px] font-extrabold text-gray-400 uppercase tracking-wide">Nama Pejabat PLH Rektor</label>
            <input
              type="text"
              value={localPlhRektorName}
              onChange={(e) => setLocalPlhRektorName(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-1.5 text-xs font-bold text-slate-800 transition-all focus:border-univ-blue-850 focus:bg-white focus:outline-none"
              placeholder="Contoh: Prof. Dr. Ir. H. Hermanto, M.Si."
            />
          </div>

          {/* Official Contact Name */}
          <div className="space-y-1 bg-white p-3 rounded-xl border border-slate-100">
            <label className="block text-[10px] font-extrabold text-gray-400 uppercase tracking-wide">Nama Narahubung Resmi</label>
            <input
              type="text"
              value={localOfficialContactName}
              onChange={(e) => setLocalOfficialContactName(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-1.5 text-xs font-bold text-slate-800 transition-all focus:border-univ-blue-850 focus:bg-white focus:outline-none"
              placeholder="Contoh: Biro Kemahasiswaan UNABA"
            />
          </div>

          {/* Official Contact Phone */}
          <div className="space-y-1 bg-white p-3 rounded-xl border border-slate-100">
            <label className="block text-[10px] font-extrabold text-gray-400 uppercase tracking-wide">No. Narahubung Resmi (WA)</label>
            <input
              type="text"
              value={localOfficialContactPhone}
              onChange={(e) => setLocalOfficialContactPhone(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-1.5 text-xs font-bold text-slate-800 transition-all focus:border-univ-blue-800 focus:bg-white focus:outline-none"
              placeholder="Contoh: 0812-1111-2222"
            />
          </div>

          {/* Official Contact Email */}
          <div className="space-y-1 bg-white p-3 rounded-xl border border-slate-100">
            <label className="block text-[10px] font-extrabold text-gray-400 uppercase tracking-wide">Email Resmi BKA</label>
            <input
              type="email"
              value={localOfficialContactEmail}
              onChange={(e) => setLocalOfficialContactEmail(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-1.5 text-xs font-bold text-slate-800 transition-all focus:border-univ-blue-850 focus:bg-white focus:outline-none"
              placeholder="Contoh: bka@unaba.ac.id"
            />
          </div>

          {/* Official Secretariat Address */}
          <div className="space-y-1 bg-white p-3 rounded-xl border border-slate-100 md:col-span-2">
            <label className="block text-[10px] font-extrabold text-gray-400 uppercase tracking-wide">Alamat Lengkap Sekretariat</label>
            <input
              type="text"
              value={localOfficialSecretariatAddress}
              onChange={(e) => setLocalOfficialSecretariatAddress(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-1.5 text-xs font-bold text-slate-800 transition-all focus:border-univ-blue-800 focus:bg-white focus:outline-none"
              placeholder="Contoh: Gedung Rektorat Lantai 2, Kampus Jakarta..."
            />
          </div>
        </div>

        {/* Change detected alert & Save action */}
        <div className="pt-3 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-100/50 p-3 rounded-xl">
          <div className="text-left">
            {hasSettingsChanges ? (
              <p className="text-xs font-extrabold text-univ-orange-600 animate-pulse flex items-center space-x-1">
                <span>⚠️ Ada perubahan data kontak & sekretariat yang belum disimpan!</span>
              </p>
            ) : (
              <p className="text-xs text-slate-500">
                Semua data kontak, PLH rektor, & sekretariat saat ini sinkron dengan database lokal.
              </p>
            )}
          </div>
          <button
            onClick={handleSaveSettings}
            disabled={!hasSettingsChanges}
            className={`flex items-center space-x-1.5 rounded-xl px-5 py-2.5 text-xs font-extrabold text-white transition-all shadow-md cursor-pointer ${
              hasSettingsChanges 
                ? 'bg-univ-orange-500 hover:bg-univ-orange-600 active:scale-95' 
                : 'bg-slate-300 cursor-not-allowed'
            }`}
          >
            <Save className="h-4 w-4" />
            <span>Simpan Perubahan Portal</span>
          </button>
        </div>
      </div>

      {/* Metrics board */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Total Pengajuan</p>
          <p className="text-2xl font-extrabold text-univ-blue-800 font-mono mt-1">{totalRegistrations}</p>
        </div>
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-amber-500">Minta Verifikasi</p>
          <p className="text-2xl font-extrabold text-amber-600 font-mono mt-1">{pendingRegistrations}</p>
        </div>
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-green-500 font-sans">Disetujui</p>
          <p className="text-2xl font-extrabold text-green-600 font-mono mt-1">{approvedRegistrations}</p>
        </div>
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-univ-orange-500">Total Kegiatan</p>
          <p className="text-2xl font-extrabold text-univ-orange-500 font-mono mt-1">{activities.length}</p>
        </div>
      </div>

      {/* TAB CONTROL SWITCHES */}
      <div className="flex border-b border-gray-200 mb-6 gap-2">
        <button
          onClick={() => { setActiveTab('VERIFICATION'); handleCancelEdit(); }}
          className={`px-5 py-3 text-sm font-bold border-b-2 transition-all cursor-pointer flex items-center space-x-2 ${
            activeTab === 'VERIFICATION'
              ? 'border-univ-blue-800 text-univ-blue-850'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          <Users className="h-4.5 w-4.5" />
          <span>Verifikasi Pendaftaran Mahasiswa</span>
          {pendingRegistrations > 0 && (
            <span className="ml-1 px-2 py-0.5 text-[10px] font-extrabold rounded-full bg-amber-500 text-white animate-pulse">
              {pendingRegistrations}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('CATALOG')}
          className={`px-5 py-3 text-sm font-bold border-b-2 transition-all cursor-pointer flex items-center space-x-2 ${
            activeTab === 'CATALOG'
              ? 'border-univ-blue-800 text-univ-blue-850'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          <Grid className="h-4.5 w-4.5" />
          <span>Kelola Katalog & Jam Kegiatan</span>
        </button>

        <button
          onClick={() => setActiveTab('CERTIFICATES')}
          className={`px-5 py-3 text-sm font-bold border-b-2 transition-all cursor-pointer flex items-center space-x-2 ${
            activeTab === 'CERTIFICATES'
              ? 'border-univ-blue-800 text-univ-blue-850'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          <Award className="h-4.5 w-4.5 text-emerald-600" />
          <span>Kelola E-Sertifikat</span>
          <span className="ml-1 px-2 py-0.5 text-[10px] font-extrabold rounded-full bg-emerald-100 text-emerald-800">
            {activities.filter(a => a.hasCertificate !== false).length}
          </span>
        </button>

        <button
          onClick={() => { setActiveTab('STUDENTS'); refreshStudentsList(); }}
          className={`px-5 py-3 text-sm font-bold border-b-2 transition-all cursor-pointer flex items-center space-x-2 ${
            activeTab === 'STUDENTS'
              ? 'border-univ-blue-800 text-univ-blue-850'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          <Users className="h-4.5 w-4.5 text-zinc-500" />
          <span>Database Akun Mahasiswa</span>
          {studentsList.length > 0 && (
            <span className="ml-1 px-2 py-0.5 text-[10px] font-extrabold rounded-full bg-slate-105 bg-slate-500 text-white">
              {studentsList.length}
            </span>
          )}
        </button>
      </div>

      {/* TAB 1: VERIFICATION LIST */}
      {activeTab === 'VERIFICATION' && (
        <div id="tab-verification-panel" className="rounded-2xl border border-gray-150 bg-white p-5 shadow-sm min-h-[400px]">
          <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-gray-100 pb-3 mb-4 gap-3">
            <div>
              <h3 className="text-base font-extrabold text-gray-900">
                Konfirmasi Registrasi & Berkas KTM Mahasiswa
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">Kelola persetujuan, penolakan, dan penghapusan data pendaftaran mahasiswa.</p>
            </div>
            
            <div className="w-full md:w-72">
              <input
                type="text"
                placeholder="Cari nama, NIM, atau kegiatan..."
                value={regSearch}
                onChange={(e) => setRegSearch(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-800 placeholder-slate-400 focus:bg-white focus:border-univ-blue-600 focus:outline-none transition-all"
              />
            </div>
          </div>

          {filteredRegistrations.length === 0 ? (
            <div className="text-center py-12">
              <CheckCircle className="mx-auto h-12 w-12 text-gray-300 mb-2" />
              <p className="text-sm font-bold text-gray-500">Tidak ada data pendaftaran yang sesuai</p>
              <p className="text-xs text-gray-400 mt-1">Gunakan kata kunci pencarian lain atau tunggu pendaftaran baru.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50 text-xs text-gray-500 font-bold uppercase">
                    <th className="p-3">Mahasiswa</th>
                    <th className="p-3">Nama Kegiatan</th>
                    <th className="p-3">Berkas KTM</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Opsi Tindakan Admin</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <AnimatePresence initial={false}>
                    {filteredRegistrations.map(reg => {
                      const targetActivity = activities.find(a => a.id === reg.activityId);

                      const isDuplicateApproved = registrations.some(
                        r => r.id !== reg.id && 
                             r.activityId === reg.activityId && 
                             r.studentNim.trim() === reg.studentNim.trim() && 
                             r.status === 'APPROVED'
                      );

                      const hasPendingDuplication = reg.status === 'PENDING' && registrations.some(
                        r => r.id !== reg.id && 
                             r.activityId === reg.activityId && 
                             r.studentNim.trim() === reg.studentNim.trim() && 
                             r.status === 'PENDING'
                      );

                      return (
                        <motion.tr 
                          key={reg.id}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: -30, backgroundColor: 'rgba(239, 68, 68, 0.1)' }}
                          transition={{ duration: 0.2 }}
                          className={`border-b border-slate-50 text-xs hover:bg-slate-50/50 ${isDuplicateApproved ? 'bg-rose-50/30' : ''}`}
                        >
                          {/* Student Details */}
                          <td className="p-3">
                            <div className="flex flex-wrap items-center gap-1.5">
                              <span className="font-extrabold text-gray-900">{reg.studentName}</span>
                              {isDuplicateApproved && (
                                <span className="inline-block bg-rose-150 text-rose-800 font-extrabold text-[9px] rounded px-1.5 py-0.5 select-none animate-pulse">
                                  ⚠️ Duplikat Disetujui
                                </span>
                              )}
                              {hasPendingDuplication && (
                                <span className="inline-block bg-amber-150 text-amber-800 font-extrabold text-[9px] rounded px-1.5 py-0.5 select-none">
                                  ⚠️ Ganda Antrean
                                </span>
                              )}
                            </div>
                            <p className="text-[10px] font-mono text-gray-550">NIM: {reg.studentNim} • Smt {reg.studentSemester}</p>
                            <p className="text-[10px] text-zinc-400">{reg.studentDepartment}</p>
                          </td>

                          {/* Activity Title */}
                          <td className="p-3 font-semibold text-gray-700 max-w-[200px] truncate">
                            {reg.activityTitle}
                          </td>

                          {/* Upload KTM */}
                          <td className="p-3 font-mono text-[11px] text-univ-blue-700">
                            <span className="hover:underline cursor-pointer block truncate max-w-[150px]" title={reg.uploadedKtmUrl}>
                              📄 {reg.uploadedKtmUrl}
                            </span>
                          </td>

                          {/* Status Badge */}
                          <td className="p-3">
                            <span className={`inline-block font-extrabold rounded-full px-2.5 py-0.5 text-[10px] uppercase ${
                              reg.status === 'APPROVED' 
                                ? 'bg-green-100 text-green-800 border border-green-200' 
                                : reg.status === 'PENDING' 
                                ? 'bg-amber-100 text-amber-800 border border-amber-200' 
                                : 'bg-rose-100 text-rose-800 border border-rose-200'
                            }`}>
                              {reg.status === 'APPROVED' ? 'Disetujui' : reg.status === 'REJECTED' ? 'Ditolak' : 'Menunggu'}
                            </span>
                          </td>

                          {/* Action triggers */}
                          <td className="p-3 text-right h-full">
                            <div className="flex items-center justify-end gap-1.5 flex-wrap">
                              {reg.status === 'APPROVED' ? (
                                <>
                                  <button
                                    onClick={() => onRejectRegistration(reg.id)}
                                    className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-600 hover:text-white border border-rose-200 transition-all cursor-pointer flex items-center space-x-1 shadow-xs"
                                    title="Batalkan & Tolak Pendaftaran"
                                  >
                                    <X className="h-3.5 w-3.5" />
                                    <span>Tolak</span>
                                  </button>

                                  {targetActivity && targetActivity.hasCertificate !== false && (
                                    <button
                                      onClick={() => {
                                        setAdminPreviewCertData({
                                          studentName: reg.studentName,
                                          studentNim: reg.studentNim,
                                          studentDepartment: reg.studentDepartment,
                                          activity: targetActivity,
                                          registrationId: reg.id
                                        });
                                      }}
                                      className="px-2.5 py-1 text-[11px] font-extrabold rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-600 hover:text-white transition-all flex items-center space-x-1 cursor-pointer shadow-xs"
                                      title="Pratinjau E-Sertifikat Mahasiswa Ini"
                                    >
                                      <Award className="h-3.5 w-3.5 text-emerald-600" />
                                      <span>Sertifikat</span>
                                    </button>
                                  )}
                                </>
                              ) : reg.status === 'REJECTED' ? (
                                <>
                                  <button
                                    onClick={() => onApproveRegistration(reg.id)}
                                    className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-green-50 text-green-700 hover:bg-green-600 hover:text-white border border-green-200 transition-all cursor-pointer flex items-center space-x-1 shadow-xs"
                                    title="Setujui Pendaftaran"
                                  >
                                    <Check className="h-3.5 w-3.5" />
                                    <span>Setujui</span>
                                  </button>
                                </>
                              ) : (
                                <>
                                  <button
                                    onClick={() => onApproveRegistration(reg.id)}
                                    className="px-2.5 py-1 text-[11px] font-extrabold rounded-lg bg-green-600 hover:bg-green-700 text-white transition-all cursor-pointer shadow-xs flex items-center space-x-1"
                                    title="Setujui Pendaftaran Mahasiswa"
                                  >
                                    <Check className="h-3.5 w-3.5" />
                                    <span>Setujui</span>
                                  </button>

                                  <button
                                    onClick={() => onRejectRegistration(reg.id)}
                                    className="px-2.5 py-1 text-[11px] font-extrabold rounded-lg bg-rose-600 hover:bg-rose-700 text-white transition-all cursor-pointer shadow-xs flex items-center space-x-1"
                                    title="Tolak Pendaftaran Mahasiswa"
                                  >
                                    <X className="h-3.5 w-3.5" />
                                    <span>Tolak</span>
                                  </button>
                                </>
                              )}

                              <button
                                onClick={() => {
                                  if (window.confirm(`Yakin ingin menghapus nama mahasiswa "${reg.studentName}" (NIM: ${reg.studentNim}) dari daftar pendaftaran kegiatan "${reg.activityTitle}"?`)) {
                                    onDeleteRegistration(reg.id);
                                  }
                                }}
                                className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-slate-100 hover:bg-rose-100 text-slate-600 hover:text-rose-700 transition-all cursor-pointer border border-slate-200 flex items-center space-x-1 shadow-xs"
                                title="Hapus Nama Mahasiswa dari Daftar Pendaftaran"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                                <span>Hapus Nama</span>
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      );
                    })}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: CATALOG MANAGEMENT (EDIT / ADD / DELETE) */}
      {activeTab === 'CATALOG' && (
        <div id="tab-catalog-panel" className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT: FORM EDITING / FORM ADDING (5 columns) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* EDIT ACTIVITY COMPONENT (HIGH PRIORITY FORM IF SELECTED) */}
            {editingActivity ? (
              <div className="rounded-2xl border-2 border-univ-orange-500 bg-white p-5 shadow-md">
                <div className="flex items-center justify-between border-b border-gray-150 pb-3 mb-4">
                  <div>
                    <span className="text-[10px] bg-univ-orange-50 text-univ-orange-600 font-extrabold uppercase rounded px-2 py-0.5">EDITING MODE</span>
                    <h3 className="text-base font-extrabold text-gray-900 mt-1">Ubah Detail Kegiatan</h3>
                  </div>
                  <button 
                    onClick={handleCancelEdit}
                    className="text-xs font-bold text-gray-400 hover:text-gray-600 px-2 py-1 rounded hover:bg-gray-100 transition-all cursor-pointer"
                  >
                    Batal
                  </button>
                </div>

                <form onSubmit={handleSaveEdit} className="space-y-4">
                  {/* Title */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-gray-600">Judul Kegiatan *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ubah judul pendaftaran..."
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-850 focus:border-univ-blue-800 outline-none"
                    />
                  </div>

                  {/* Summary & Long description */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-gray-600">Ringkasan Singkat *</label>
                    <input
                      type="text"
                      required
                      placeholder="Satu baris intisari..."
                      value={editDesc}
                      onChange={(e) => setEditDesc(e.target.value)}
                      className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-850"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-gray-600">Deskripsi Lengkap Kegiatan</label>
                    <textarea
                      placeholder="Penjelasan lengkap acara..."
                      rows={3}
                      value={editLongDesc}
                      onChange={(e) => setEditLongDesc(e.target.value)}
                      className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-850"
                    />
                  </div>

                  {/* Category & Points */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-gray-600">Kategori</label>
                    <select
                      value={editCategory}
                      onChange={(e) => setEditCategory(e.target.value as ActivityCategory)}
                      className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-600"
                    >
                      <option value={ActivityCategory.ACADEMIC}>Keilmuan & Penalaran</option>
                      <option value={ActivityCategory.ORGANIZATION}>Organisasi & Kepemimpinan</option>
                      <option value={ActivityCategory.COMMUNITY}>Pengabdian Masyarakat</option>
                      <option value={ActivityCategory.ARTS}>Kesenian & Kebudayaan</option>
                      <option value={ActivityCategory.SPORTS}>Olahraga</option>
                    </select>
                  </div>

                  {/* Quota & Location */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-gray-600">Batas Kuota Orang</label>
                      <input
                        type="number"
                        value={editQuota}
                        onChange={(e) => setEditQuota(Number(e.target.value))}
                        className="w-full rounded-lg border border-gray-200 px-2 py-2 text-xs font-mono font-semibold"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-gray-600">Lokasi / Ruangan *</label>
                      <input
                        type="text"
                        required
                        placeholder="Contoh: Gedung Rektorat Lt. 3"
                        value={editLocation}
                        onChange={(e) => setEditLocation(e.target.value)}
                        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold"
                      />
                    </div>
                  </div>

                  {/* Event Schedule & Deadline */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-gray-600">Tanggal Pelaksanaan *</label>
                      <input
                        type="text"
                        required
                        placeholder="Contoh: 15 Juli 2026"
                        value={editEventDate}
                        onChange={(e) => setEditEventDate(e.target.value)}
                        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-gray-600">Jam / Waktu Kegiatan *</label>
                      <input
                        type="text"
                        required
                        placeholder="Contoh: 08:00 - 12:00 WIB"
                        value={editEventTime}
                        onChange={(e) => setEditEventTime(e.target.value)}
                        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold text-univ-blue-800"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-gray-600">Batas Daftar *</label>
                      <input
                        type="text"
                        required
                        placeholder="YYYY-MM-DD"
                        value={editDeadline}
                        onChange={(e) => setEditDeadline(e.target.value)}
                        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs font-mono font-semibold"
                      />
                    </div>
                  </div>

                  {/* Banner Image URL and visual presets */}
                  <div className="space-y-1.5 pt-1">
                    <label className="text-[11px] font-bold text-gray-600 flex items-center space-x-1">
                      <ImageIcon className="h-3.5 w-3.5 text-gray-400" />
                      <span>URL Foto Banner Kegiatan *</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ganti link gambar Unsplash..."
                      value={editImageUrl}
                      onChange={(e) => setEditImageUrl(e.target.value)}
                      className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs font-mono font-semibold text-gray-700"
                    />

                    {/* Local computer/mobile upload option */}
                    <div className="mt-2.5 grid grid-cols-1 md:grid-cols-3 gap-3 border border-dashed border-amber-200 rounded-xl p-3 bg-amber-50/20">
                      <div className="md:col-span-2 space-y-1 block text-left">
                        <label className="text-[11px] font-extrabold text-univ-orange-800 flex items-center space-x-1.5">
                          <UploadCloud className="h-4 w-4 text-univ-orange-700" />
                          <span>Unggah File Foto Dari Komputer (Offline)</span>
                        </label>
                        <p className="text-[10px] text-gray-505 leading-normal">
                          Pilih / seret berkas gambar (PNG, JPG, WebP) untuk mengganti foto kegiatan ini secara langsung.
                        </p>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleLocalImageUpload(e, true)}
                          className="w-full text-xs text-gray-500 file:mr-2 file:py-1.5 file:px-2.5 file:rounded-lg file:border-0 file:text-[10px] file:font-extrabold file:bg-univ-orange-50 file:text-univ-orange-850 hover:file:bg-univ-orange-100 cursor-pointer"
                        />
                      </div>
                      <div className="flex flex-col items-center justify-center border border-slate-100 rounded-lg p-1 bg-white shadow-sm overflow-hidden min-h-[75px]">
                        {editImageUrl ? (
                          <img
                            src={editImageUrl}
                            alt="Pratinjau Foto"
                            className="h-14 w-full object-cover rounded"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <span className="text-[10px] text-gray-400 font-bold">Tanpa Foto</span>
                        )}
                        <span className="text-[9px] text-slate-400 font-semibold mt-1">Pratinjau Foto</span>
                      </div>
                    </div>

                    {/* Presets Grid */}
                    <div className="pt-1.5">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">Ganti Foto dengan Preset:</p>
                      <div className="flex flex-wrap gap-1.5">
                        {IMAGE_PRESETS.map((pst, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setEditImageUrl(pst.url)}
                            className="bg-slate-50 border border-slate-150 rounded px-2 py-1 text-[10px] font-bold text-gray-600 hover:bg-slate-100 hover:text-univ-blue-800 transition-all cursor-pointer truncate max-w-[150px]"
                          >
                            {pst.label.split('/')[0]}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Requirements & Benefits */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-gray-600">Syarat Kepesertaan (Pisahkan dengan koma)</label>
                    <input
                      type="text"
                      placeholder="Syarat 1, Syarat 2, Syarat 3"
                      value={editRequirements}
                      onChange={(e) => setEditRequirements(e.target.value)}
                      className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-850"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-gray-600">Benefit Berharga (Pisahkan dengan koma)</label>
                    <input
                      type="text"
                      placeholder="Benefit A, Benefit B, Benefit C"
                      value={editBenefits}
                      onChange={(e) => setEditBenefits(e.target.value)}
                      className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-850"
                    />
                  </div>

                  {/* Certificate eligibility toggle */}
                  <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-3.5 space-y-3">
                    <label className="text-[11px] font-extrabold text-slate-800 flex items-center space-x-1.5">
                      <Award className="h-4 w-4 text-emerald-600" />
                      <span>Opsi E-Sertifikat Kegiatan *</span>
                    </label>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setEditHasCertificate(true);
                          setEditCertificateUploaded(true);
                        }}
                        className={`py-2 px-3 rounded-lg text-xs font-extrabold transition-all cursor-pointer border flex items-center justify-center space-x-1.5 ${
                          editHasCertificate
                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <Check className="h-3.5 w-3.5" />
                        <span>Dapat Sertifikat</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setEditHasCertificate(false);
                          setEditCertificateUploaded(false);
                        }}
                        className={`py-2 px-3 rounded-lg text-xs font-extrabold transition-all cursor-pointer border flex items-center justify-center space-x-1.5 ${
                          !editHasCertificate
                            ? 'bg-rose-600 text-white border-rose-600 shadow-sm'
                            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <X className="h-3.5 w-3.5" />
                        <span>Tanpa Sertifikat</span>
                      </button>
                    </div>

                    {editHasCertificate && (
                      <div className="space-y-3 pt-2 border-t border-slate-200/80">
                        <div className="space-y-1">
                          <label className="text-[10px] uppercase font-bold text-slate-500">Nama Penandatangan Sertifikat</label>
                          <input
                            type="text"
                            placeholder="Dr. Ir. H. Mulyono, M.T."
                            value={editCertificateSignerName}
                            onChange={(e) => setEditCertificateSignerName(e.target.value)}
                            className="w-full rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-semibold bg-white"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] uppercase font-bold text-slate-500">Jabatan Penandatangan</label>
                          <input
                            type="text"
                            placeholder="PLH Rektor Universitas Anak Bangsa"
                            value={editCertificateSignerRole}
                            onChange={(e) => setEditCertificateSignerRole(e.target.value)}
                            className="w-full rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-semibold bg-white"
                          />
                        </div>

                        {/* CUSTOM CERTIFICATE FILE UPLOAD */}
                        <div className="space-y-1.5">
                          <label className="text-[10px] uppercase font-bold tracking-wider text-slate-500 flex items-center space-x-1">
                            <FileUp className="h-3.5 w-3.5 text-slate-400" />
                            <span>Unggah Desain Template Latar Belakang (Opsional)</span>
                          </label>
                          <input 
                            type="file" 
                            accept="image/*" 
                            onChange={(e) => handleLocalCertificateUpload(e, true)}
                            className="w-full text-xs font-semibold text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-[11px] file:font-bold file:bg-univ-blue-50 file:text-univ-blue-700 hover:file:bg-univ-blue-100 cursor-pointer"
                          />
                          {editCertificateTemplateUrl ? (
                            <div className="text-[10px] text-green-700 font-bold flex items-center space-x-1">
                              <Check className="h-3 w-3" />
                              <span>Template latar belakang khusus berhasil diunggah</span>
                            </div>
                          ) : (
                            <span className="text-[10px] text-slate-400 italic block">Jika dikosongkan, sistem akan otomatis menggunakan template e-sertifikat standar UNABA.</span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="pt-2 flex gap-2">
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className="flex-1 rounded-xl border border-gray-200 py-2.5 text-xs font-bold text-gray-600 hover:bg-gray-50 transition-all cursor-pointer text-center"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="flex-1 rounded-xl bg-univ-orange-500 py-2.5 text-xs font-extrabold text-white hover:bg-univ-orange-600 shadow-sm transition-all cursor-pointer text-center"
                    >
                      Simpan Perubahan
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              /* ADD NEW ACTIVITY CARD INSTEAD */
              <div className="rounded-2xl border border-slate-150 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between border-b border-gray-150 pb-3 mb-4">
                  <h3 className="text-base font-extrabold text-gray-900">
                    {showAddForm ? 'Luncurkan Kegiatan Baru' : 'Operasional Katalog'}
                  </h3>
                  <button
                    onClick={() => setShowAddForm(!showAddForm)}
                    className={`rounded-lg p-1.5 text-white transition-all cursor-pointer inline-flex items-center justify-center ${
                      showAddForm ? 'bg-amber-500 hover:bg-amber-600' : 'bg-univ-orange-500 hover:bg-univ-orange-600'
                    }`}
                    title={showAddForm ? "Tutup Form" : "Tambah Baru"}
                  >
                    {showAddForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                  </button>
                </div>

                {showAddForm ? (
                  <form onSubmit={handleCreateActivity} className="space-y-4">
                    {/* Title */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-gray-600">Judul Kegiatan *</label>
                      <input
                        type="text"
                        required
                        placeholder="Contoh: Lomba Robotik Mandiri / Webinar Nasional"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-850"
                      />
                    </div>

                    {/* Desc */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-gray-600">Ringkasan Deskripsi *</label>
                      <textarea
                        required
                        placeholder="Tuliskan intisari acara..."
                        rows={2}
                        value={newDesc}
                        onChange={(e) => setNewDesc(e.target.value)}
                        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-850"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-gray-600">Deskripsi Lengkap Kegiatan</label>
                      <textarea
                        placeholder="Rincian mendalam agenda..."
                        rows={2.5}
                        value={newLongDesc}
                        onChange={(e) => setNewLongDesc(e.target.value)}
                        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-850"
                      />
                    </div>

                    {/* Category selectors */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-gray-600">Kategori</label>
                      <select
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value as ActivityCategory)}
                        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-600"
                      >
                        <option value={ActivityCategory.ACADEMIC}>Keilmuan & Penalaran</option>
                        <option value={ActivityCategory.ORGANIZATION}>Organisasi & Kepemimpinan</option>
                        <option value={ActivityCategory.COMMUNITY}>Pengabdian Masyarakat</option>
                        <option value={ActivityCategory.ARTS}>Kesenian & Kebudayaan</option>
                        <option value={ActivityCategory.SPORTS}>Olahraga</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-gray-600">Kuota Orang</label>
                        <input
                          type="number"
                          value={newQuota}
                          onChange={(e) => setNewQuota(Number(e.target.value))}
                          className="w-full rounded-lg border border-gray-200 px-2 py-2 text-xs font-mono font-semibold"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-gray-600">Lokasi / Ruang *</label>
                        <input
                          type="text"
                          required
                          placeholder="Gedung serbaguna"
                          value={newLocation}
                          onChange={(e) => setNewLocation(e.target.value)}
                          className="w-full rounded-lg border border-gray-200 px-2 py-2 text-xs font-semibold"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-gray-600">Tanggal Pelaksanaan *</label>
                        <input
                          type="text"
                          required
                          placeholder="Contoh: 25 Juli 2026"
                          value={newEventDate}
                          onChange={(e) => setNewEventDate(e.target.value)}
                          className="w-full rounded-lg border border-gray-200 px-2 py-2 text-xs font-semibold"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-gray-600">Jam / Waktu Kegiatan *</label>
                        <input
                          type="text"
                          required
                          placeholder="Contoh: 08:00 - 12:00 WIB"
                          value={newEventTime}
                          onChange={(e) => setNewEventTime(e.target.value)}
                          className="w-full rounded-lg border border-gray-200 px-2 py-2 text-xs font-semibold text-univ-blue-800"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-gray-600">Batas Daftar *</label>
                        <input
                          type="text"
                          required
                          placeholder="YYYY-MM-DD"
                          value={newDeadline}
                          onChange={(e) => setNewDeadline(e.target.value)}
                          className="w-full rounded-lg border border-gray-200 px-2 py-2 text-xs font-mono font-semibold"
                        />
                      </div>
                    </div>

                    {/* New photo selection */}
                    <div className="space-y-1.5 pt-1">
                      <label className="text-[11px] font-bold text-gray-600 flex items-center space-x-1">
                        <ImageIcon className="h-3.5 w-3.5 text-gray-400" />
                        <span>Link Foto Kegiatan *</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="URL Banner Unsplash..."
                        value={newImageUrl}
                        onChange={(e) => setNewImageUrl(e.target.value)}
                        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs font-mono font-semibold text-gray-700"
                      />

                      {/* Local computer/mobile upload option */}
                      <div className="mt-2.5 grid grid-cols-1 md:grid-cols-3 gap-3 border border-dashed border-teal-200 rounded-xl p-3 bg-teal-50/25">
                        <div className="md:col-span-2 space-y-1 block text-left">
                          <label className="text-[11px] font-extrabold text-teal-800 flex items-center space-x-1.5">
                            <UploadCloud className="h-4 w-4 text-teal-600" />
                            <span>Unggah File Foto Dari Komputer</span>
                          </label>
                          <p className="text-[10px] text-gray-500 leading-normal">
                            Pilih / seret berkas gambar (PNG, JPG, WebP) untuk foto kegiatan baru secara instan.
                          </p>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleLocalImageUpload(e, false)}
                            className="w-full text-xs text-gray-500 file:mr-2 file:py-1.5 file:px-2.5 file:rounded-lg file:border-0 file:text-[10px] file:font-extrabold file:bg-teal-50 file:text-teal-850 hover:file:bg-teal-100 cursor-pointer"
                          />
                        </div>
                        <div className="flex flex-col items-center justify-center border border-slate-100 rounded-lg p-1 bg-white shadow-sm overflow-hidden min-h-[75px]">
                          {newImageUrl ? (
                            <img
                              src={newImageUrl}
                              alt="Pratinjau Foto"
                              className="h-14 w-full object-cover rounded"
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            <span className="text-[10px] text-gray-400 font-bold">Tanpa Foto</span>
                          )}
                          <span className="text-[9px] text-slate-400 font-semibold mt-1">Pratinjau Foto</span>
                        </div>
                      </div>

                      {/* Presets list */}
                      <div className="pt-1.5">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">Preset Instan:</p>
                        <div className="flex flex-wrap gap-1">
                          {IMAGE_PRESETS.map((pst, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => setNewImageUrl(pst.url)}
                              className="bg-slate-50 border border-slate-150 rounded px-2 py-0.5 text-[9px] font-bold text-slate-500 hover:bg-slate-100 hover:text-univ-blue-800 transition-all cursor-pointer"
                            >
                              {pst.label.split(' / ')[0]}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Requirements & Benefits */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-gray-600">Syarat Kepesertaan (Pisahkan dengan koma)</label>
                      <input
                        type="text"
                        placeholder="Contoh: Mahasiswa semester 2, Membawa laptop"
                        value={newRequirements}
                        onChange={(e) => setNewRequirements(e.target.value)}
                        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-gray-600">Benefit (Pisahkan dengan koma)</label>
                      <input
                        type="text"
                        placeholder="Contoh: E-Sertifikat, Snack Box"
                        value={newBenefits}
                        onChange={(e) => setNewBenefits(e.target.value)}
                        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold"
                      />
                    </div>

                    {/* Certificate eligibility toggle */}
                    <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-3.5 space-y-3">
                      <label className="text-[11px] font-extrabold text-slate-800 flex items-center space-x-1.5">
                        <Award className="h-4 w-4 text-emerald-600" />
                        <span>Opsi E-Sertifikat Kegiatan *</span>
                      </label>

                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setNewHasCertificate(true);
                            setNewCertificateUploaded(true);
                          }}
                          className={`py-2 px-3 rounded-lg text-xs font-extrabold transition-all cursor-pointer border flex items-center justify-center space-x-1.5 ${
                            newHasCertificate
                              ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          <Check className="h-3.5 w-3.5" />
                          <span>Dapat Sertifikat</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setNewHasCertificate(false);
                            setNewCertificateUploaded(false);
                          }}
                          className={`py-2 px-3 rounded-lg text-xs font-extrabold transition-all cursor-pointer border flex items-center justify-center space-x-1.5 ${
                            !newHasCertificate
                              ? 'bg-rose-600 text-white border-rose-600 shadow-sm'
                              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          <X className="h-3.5 w-3.5" />
                          <span>Tanpa Sertifikat</span>
                        </button>
                      </div>

                      {newHasCertificate && (
                        <div className="space-y-3 pt-2 border-t border-slate-200/80">
                          <div className="space-y-1">
                            <label className="text-[10px] uppercase font-bold text-slate-500">Nama Penandatangan Sertifikat</label>
                            <input
                              type="text"
                              placeholder="Dr. Ir. H. Mulyono, M.T."
                              value={newCertificateSignerName}
                              onChange={(e) => setNewCertificateSignerName(e.target.value)}
                              className="w-full rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-semibold bg-white"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] uppercase font-bold text-slate-500">Jabatan Penandatangan</label>
                            <input
                              type="text"
                              placeholder="PLH Rektor Universitas Anak Bangsa"
                              value={newCertificateSignerRole}
                              onChange={(e) => setNewCertificateSignerRole(e.target.value)}
                              className="w-full rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-semibold bg-white"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    <button
                      type="submit"
                      className="w-full rounded-xl bg-univ-orange-500 py-2.5 text-xs font-extrabold text-white hover:bg-univ-orange-600 transition-all cursor-pointer shadow-sm text-center"
                    >
                      Luncurkan Kegiatan Resmi
                    </button>
                  </form>
                ) : (
                  <div className="p-2 text-center space-y-3">
                    <div className="mx-auto h-12 w-12 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100">
                      <Layers className="h-5 w-5 text-univ-orange-500" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-extrabold text-gray-800">Menyunting & Publikasi</p>
                      <p className="text-[11px] text-gray-500 leading-normal">
                        Ingin mendaftarkan program atau webinar anyar? Klik tombol <strong className="text-univ-orange-500 font-bold">"+"</strong> di kanan atas untuk meluncurkan form pendaftaran mahasiswa baru.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* RIGHT: LIST OF LIVE ACTIVITIES (7 columns) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="rounded-2xl border border-slate-150 bg-white p-5 shadow-sm min-h-[400px]">
              
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-150 pb-3 mb-4">
                <h3 className="text-base font-extrabold text-gray-900 inline-flex items-center space-x-2">
                  <span>Daftar Katalog Kegiatan Kampus</span>
                  <span className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full font-mono">{filteredActivities.length}</span>
                </h3>

                {/* Live Search bar */}
                <div className="relative max-w-xs shrink-0">
                  <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Cari kegiatan..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-lg border border-gray-250 bg-slate-50 pl-8 pr-3 py-1.5 text-xs font-semibold focus:bg-white focus:outline-none focus:border-univ-blue-500"
                  />
                </div>
              </div>

              {/* Activity Scheduling/Archived Filters */}
              <div className="flex flex-wrap gap-1.5 mb-4 bg-slate-50 p-1 rounded-xl border border-slate-150">
                <button
                  type="button"
                  onClick={() => setAdminActivityFilter('ALL')}
                  className={`flex-1 text-center py-1.5 text-[10px] font-extrabold rounded-lg transition-all cursor-pointer ${
                    adminActivityFilter === 'ALL'
                      ? 'bg-univ-blue-800 text-white shadow-sm'
                      : 'text-gray-500 hover:text-gray-800 hover:bg-slate-100/50'
                  }`}
                >
                  Semua ({activities.length})
                </button>
                <button
                  type="button"
                  onClick={() => setAdminActivityFilter('ACTIVE')}
                  className={`flex-1 text-center py-1.5 text-[10px] font-extrabold rounded-lg transition-all cursor-pointer ${
                    adminActivityFilter === 'ACTIVE'
                      ? 'bg-univ-blue-800 text-white shadow-sm'
                      : 'text-gray-500 hover:text-gray-800 hover:bg-slate-100/50'
                  }`}
                >
                  Kegiatan Aktif ({
                    activities.filter(act => {
                      const deadlineDate = new Date(act.registrationDeadline);
                      const today = new Date();
                      today.setHours(0,0,0,0);
                      return deadlineDate.getTime() >= today.getTime();
                    }).length
                  })
                </button>
                <button
                  type="button"
                  onClick={() => setAdminActivityFilter('ARCHIVED')}
                  className={`flex-1 text-center py-1.5 text-[10px] font-extrabold rounded-lg transition-all cursor-pointer ${
                    adminActivityFilter === 'ARCHIVED'
                      ? 'bg-univ-blue-800 text-white shadow-sm'
                      : 'text-gray-500 hover:text-gray-800 hover:bg-slate-100/50'
                  }`}
                >
                  Arsip (Tanggal Lewat) ({
                    activities.filter(act => {
                      const deadlineDate = new Date(act.registrationDeadline);
                      const today = new Date();
                      today.setHours(0,0,0,0);
                      return deadlineDate.getTime() < today.getTime();
                    }).length
                  })
                </button>
              </div>

              {filteredActivities.length === 0 ? (
                <div className="text-center py-16">
                  <p className="text-sm text-gray-400">Tidak ada kegiatan yang sesuai dengan pencarian Anda.</p>
                </div>
              ) : (
                <div className="space-y-3.5 max-h-[640px] overflow-y-auto pr-1">
                  <AnimatePresence initial={false}>
                    {filteredActivities.map(act => {
                      const isPast = new Date(act.registrationDeadline).getTime() < new Date().setHours(0,0,0,0);
                      return (
                        <motion.div 
                          key={act.id} 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95, x: -20 }}
                          transition={{ duration: 0.2 }}
                          className={`flex flex-col md:flex-row md:items-center justify-between p-4 rounded-xl border transition-all ${
                            editingActivity?.id === act.id 
                              ? 'border-univ-orange-500 bg-univ-orange-50/10'
                              : 'border-slate-150 bg-white hover:border-univ-blue-300'
                          }`}
                        >
                          {/* Left: Thumbnail & text details */}
                          <div className="flex items-start space-x-3">
                            <img 
                              src={act.imageUrl} 
                              alt={act.title} 
                              className="h-14 w-14 rounded-lg object-cover shrink-0 bg-slate-100 border border-slate-100" 
                              referrerPolicy="no-referrer"
                            />
                            <div className="space-y-1">
                              <div className="flex flex-wrap gap-1 items-center">
                                <span className="inline-block px-2 py-0.5 rounded text-[8px] font-bold bg-univ-blue-50 text-univ-blue-800 uppercase">
                                  {act.category}
                                </span>
                                {isPast && (
                                  <span className="inline-block px-2 py-0.5 rounded text-[8px] font-extrabold bg-amber-50 border border-amber-200 text-amber-700 uppercase">
                                    Arsip (Tanggal Lewat)
                                  </span>
                                )}
                                {act.hasCertificate !== false && (act.hasCertificate || act.certificateUploaded) ? (
                                  <button
                                    type="button"
                                    onClick={() => onEditActivity({ ...act, hasCertificate: false, certificateUploaded: false })}
                                    className="inline-block px-2 py-0.5 rounded text-[8px] font-bold bg-emerald-100 border border-emerald-200 text-emerald-800 uppercase hover:bg-rose-100 hover:text-rose-800 transition-all cursor-pointer"
                                    title="Klik untuk menonaktifkan sertifikat kegiatan ini"
                                  >
                                    🎓 Sertifikat: AKTIFF (Klik Matikan)
                                  </button>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => onEditActivity({ ...act, hasCertificate: true, certificateUploaded: true })}
                                    className="inline-block px-2 py-0.5 rounded text-[8px] font-bold bg-slate-100 border border-slate-200 text-slate-600 uppercase hover:bg-emerald-100 hover:text-emerald-800 transition-all cursor-pointer"
                                    title="Klik untuk mengaktifkan sertifikat kegiatan ini"
                                  >
                                    🚫 Tanpa Sertifikat (Klik Aktifkan)
                                  </button>
                                )}
                              </div>
                              <h4 className="text-xs font-extrabold text-slate-900 leading-snug line-clamp-1">{act.title}</h4>
                              
                              <div className="flex items-center space-x-3 text-[10px] text-gray-500 font-medium flex-wrap gap-y-1">
                                <span className="flex items-center space-x-1">
                                  <Calendar className="h-3 w-3 text-univ-orange-500" />
                                  <span className="text-gray-700">{act.eventDate}</span>
                                </span>
                                <span className="flex items-center space-x-1">
                                  <Clock className="h-3 w-3 text-univ-blue-700" />
                                  <span className="text-univ-blue-800 font-bold">{act.eventTime || '08:00 - 12:00 WIB'}</span>
                                </span>
                                <span className="flex items-center space-x-1">
                                  <MapPin className="h-3 w-3 text-teal-600" />
                                  <span className="truncate max-w-[120px]" title={act.location}>{act.location}</span>
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Right: triggers for layout editing / delete */}
                          <div className="flex items-center justify-end space-x-2 mt-3 md:mt-0 md:ml-4 border-t pt-3.5 md:pt-0 md:border-0 border-dashed border-gray-100">
                            
                            {/* EDIT BUTTON TRIGGER */}
                            <button
                              onClick={() => handleBeginEdit(act)}
                              className="rounded-lg bg-univ-blue-50 font-bold text-univ-blue-800 border border-univ-blue-100 px-3 py-1.5 text-xs transition-all flex items-center space-x-1 cursor-pointer hover:bg-univ-blue-800 hover:text-white"
                              title="Sunting / Edit"
                            >
                              <Edit className="h-3 w-3" />
                              <span>Ubah</span>
                            </button>

                            {/* DELETE BUTTON */}
                            <button
                              onClick={() => {
                                if (confirm(`Apakah Anda yakin ingin menghapus "${act.title}"?\nSeluruh data pendaftaran terkait juga akan otomatis dihapus!`)) {
                                  onDeleteActivity(act.id);
                                  if (editingActivity?.id === act.id) {
                                    handleCancelEdit();
                                  }
                                }
                              }}
                              className="rounded-lg bg-rose-50 text-rose-600 border border-rose-100 px-3 py-1.5 text-xs transition-all flex items-center space-x-1 cursor-pointer hover:bg-rose-600 hover:text-white"
                              title="Hapus"
                            >
                              <Trash2 className="h-3 w-3" />
                              <span>Hapus</span>
                            </button>
                            
                          </div>

                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              )}

            </div>
          </div>

        </div>
      )}

      {/* TAB 3: REGISTERED USERS DATABASE */}
      {activeTab === 'STUDENTS' && (
        <div id="tab-students-panel" className="rounded-2xl border border-gray-150 bg-white p-5 shadow-sm min-h-[400px]">
          <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-gray-200 pb-3 mb-4 gap-3">
            <div>
              <h3 className="text-base font-extrabold text-gray-900">
                Data Akun Mahasiswa Terdaftar
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">Daftar seluruh mahasiswa yang terdaftar di Portal Universitas Anak Bangsa (UNABA).</p>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Cari nama, NIM, atau prodi..."
                value={studentSearch}
                onChange={(e) => setStudentSearch(e.target.value)}
                className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-800 placeholder-slate-400 focus:bg-white focus:border-univ-blue-600 focus:outline-none transition-all w-60"
              />
              <button
                onClick={refreshStudentsList}
                className="px-3.5 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl transition-all cursor-pointer flex items-center space-x-1.5 shrink-0"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                <span>Muat Ulang</span>
              </button>
            </div>
          </div>

          {filteredStudentsList.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <span className="text-4xl">👥</span>
              <p className="text-sm font-bold text-gray-500 mt-3">Tidak ada data mahasiswa yang sesuai</p>
              <p className="text-xs text-slate-400 max-w-sm mt-1">Gunakan kata kunci pencarian lain atau tambahkan akun mahasiswa baru.</p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-extrabold uppercase text-slate-500">
                    <th className="p-3">No</th>
                    <th className="p-3">Nama Lengkap</th>
                    <th className="p-3">NIM</th>
                    <th className="p-3">Alamat Email</th>
                    <th className="p-3">Program Studi & Fakultas</th>
                    <th className="p-3 text-center">Smstr</th>
                    <th className="p-3 text-right">Opsi Tindakan Admin</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-150 text-xs text-slate-700">
                  <AnimatePresence initial={false}>
                    {filteredStudentsList.map((stu, idx) => (
                      <motion.tr 
                        key={stu.nim}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -30, backgroundColor: 'rgba(239, 68, 68, 0.1)' }}
                        transition={{ duration: 0.2 }}
                        className="hover:bg-slate-50/50 transition-colors"
                      >
                        <td className="p-3 font-semibold text-slate-500">{idx + 1}</td>
                        <td className="p-3">
                          <div className="font-extrabold text-slate-900">{stu.name}</div>
                        </td>
                        <td className="p-3 font-mono font-bold text-slate-600">{stu.nim}</td>
                        <td className="p-3 font-medium text-slate-600">{stu.email}</td>
                        <td className="p-3">
                          <div className="font-semibold text-slate-800">{stu.department || 'Umum'}</div>
                          <div className="text-[10px] text-slate-400 font-bold uppercase">{stu.faculty || 'Fakultas Psikologi dan Sains'}</div>
                        </td>
                        <td className="p-3 text-center font-bold text-slate-600">{stu.semester}</td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => {
                              if (window.confirm(`Yakin ingin menghapus akun mahasiswa "${stu.name}" (NIM: ${stu.nim}) beserta seluruh pendaftarannya?`)) {
                                handleDeleteStudent(stu.nim, stu.name);
                              }
                            }}
                            className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-600 hover:text-white border border-rose-200 font-bold text-xs transition-all cursor-pointer shadow-xs"
                            title="Hapus Nama & Akun Mahasiswa"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            <span>Hapus Nama Mahasiswa</span>
                          </button>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: KELOLA E-SERTIFIKAT KEGIATAN */}
      {activeTab === 'CERTIFICATES' && (
        <div id="tab-certificates-panel" className="space-y-6">
          <div className="rounded-2xl border border-emerald-150 bg-gradient-to-r from-emerald-50/50 via-teal-50/30 to-white p-6 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <div className="p-2 rounded-xl bg-emerald-600 text-white shadow-sm">
                    <Award className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-extrabold text-slate-900">
                    Portal Kelola E-Sertifikat & Penandatangan Resmi
                  </h3>
                </div>
                <p className="text-xs text-slate-600 max-w-2xl leading-relaxed">
                  Kelola opsi kegiatan mana saja yang berhak mendapatkan E-Sertifikat, unggah berkas latar sertifikat khusus, atur nama & jabatan penandatangan resmi, serta pratinjau sertifikat otomatis mahasiswa.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-center shadow-xs">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Sertifikat Aktif</span>
                  <span className="text-lg font-extrabold text-emerald-600 font-mono">
                    {activities.filter(a => a.hasCertificate !== false).length} / {activities.length}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Activities List for Certificate Configuration */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {activities.map(act => {
              const approvedRegs = filteredRegistrations.filter(r => r.activityId === act.id && r.status === 'APPROVED');
              const isCertEnabled = act.hasCertificate !== false;

              return (
                <div 
                  key={act.id}
                  className={`rounded-2xl border transition-all bg-white p-5 space-y-4 shadow-sm ${
                    isCertEnabled ? 'border-emerald-200 ring-1 ring-emerald-100/50' : 'border-slate-200 opacity-80'
                  }`}
                >
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3">
                    <div className="flex items-start space-x-3">
                      <img 
                        src={act.imageUrl} 
                        alt={act.title} 
                        className="h-12 w-12 rounded-xl object-cover shrink-0 bg-slate-100 border border-slate-200"
                        referrerPolicy="no-referrer"
                      />
                      <div className="space-y-0.5">
                        <span className="inline-block px-2 py-0.5 rounded text-[9px] font-extrabold bg-univ-blue-50 text-univ-blue-800 uppercase">
                          {act.category}
                        </span>
                        <h4 className="text-xs font-extrabold text-slate-900 leading-snug line-clamp-1">{act.title}</h4>
                        <p className="text-[10px] font-medium text-slate-500">
                          {act.eventDate} • {approvedRegs.length} Peserta Disetujui
                        </p>
                      </div>
                    </div>

                    {/* Toggle Button */}
                    <button
                      type="button"
                      onClick={() => {
                        const updated = !isCertEnabled;
                        onEditActivity({
                          ...act,
                          hasCertificate: updated,
                          certificateUploaded: updated
                        });
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer border flex items-center space-x-1 shrink-0 ${
                        isCertEnabled
                          ? 'bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-700 shadow-sm'
                          : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-emerald-600 hover:text-white'
                      }`}
                    >
                      <Award className="h-3.5 w-3.5" />
                      <span>{isCertEnabled ? '🎓 Sertifikat: Aktif' : '🚫 Tanpa Sertifikat'}</span>
                    </button>
                  </div>

                  {/* Certificate Configuration Details */}
                  {isCertEnabled ? (
                    <div className="space-y-3 pt-1">
                      {/* Penandatangan & Detail Sertifikat Box */}
                      <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 space-y-2">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/60 pb-2">
                          <p className="text-[10px] font-extrabold text-slate-700 uppercase tracking-wide flex items-center space-x-1">
                            <CheckCircle className="h-3.5 w-3.5 text-emerald-600" />
                            <span>Konfigurasi & Penandatangan Resmi</span>
                          </p>

                          {/* Quick Toggle for Student Download Permission */}
                          <button
                            type="button"
                            onClick={() => {
                              const currentAllowed = act.allowCertificateDownload !== false;
                              onEditActivity({
                                ...act,
                                allowCertificateDownload: !currentAllowed
                              });
                            }}
                            className={`px-2.5 py-1 text-[11px] font-extrabold rounded-lg border transition-all cursor-pointer flex items-center space-x-1 shadow-2xs ${
                              act.allowCertificateDownload !== false
                                ? 'bg-emerald-100 text-emerald-800 border-emerald-300 hover:bg-emerald-200'
                                : 'bg-amber-100 text-amber-900 border-amber-300 hover:bg-amber-200'
                            }`}
                            title="Klik untuk mengubah status izin download sertifikat oleh mahasiswa"
                          >
                            {act.allowCertificateDownload !== false ? (
                              <>
                                <CheckCircle className="h-3.5 w-3.5 text-emerald-600" />
                                <span>Akses Unduh: 🟢 Boleh Diunduh</span>
                              </>
                            ) : (
                              <>
                                <Lock className="h-3.5 w-3.5 text-amber-700" />
                                <span>Akses Unduh: 🔒 Belum Boleh (Terkunci)</span>
                              </>
                            )}
                          </button>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                          <div>
                            <span className="text-[9px] text-slate-400 font-bold block uppercase">Nama Penandatangan:</span>
                            <span className="font-extrabold text-slate-800">{act.certificateSignerName || plhRektorName || 'Dr. Ir. H. Mulyono, M.T.'}</span>
                          </div>
                          <div>
                            <span className="text-[9px] text-slate-400 font-bold block uppercase">Jabatan:</span>
                            <span className="font-extrabold text-slate-800">{act.certificateSignerRole || 'PLH Rektor UNABA'}</span>
                          </div>
                        </div>
                      </div>

                      {/* Action Controls for Certificate */}
                      <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <button
                            type="button"
                            onClick={() => handleOpenCertEditor(act)}
                            className="px-3 py-1.5 text-xs font-extrabold text-univ-blue-800 bg-univ-blue-50 border border-univ-blue-200 rounded-xl hover:bg-univ-blue-600 hover:text-white transition-all cursor-pointer flex items-center space-x-1.5"
                          >
                            <Edit3 className="h-3.5 w-3.5" />
                            <span>Edit Detail Sertifikat</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              if (window.confirm(`Yakin ingin menghapus template sertifikat kustom untuk kegiatan "${act.title}" dan mengembalikan ke template standar institusi?`)) {
                                onEditActivity({
                                  ...act,
                                  certificateSignerName: plhRektorName || 'Dr. Ir. H. Mulyono, M.T.',
                                  certificateSignerRole: 'PLH Rektor Universitas Anak Bangsa',
                                  certificateUploaded: false
                                });
                                alert('Template sertifikat kustom berhasil dihapus & dikembalikan ke template standar!');
                              }
                            }}
                            className="px-3 py-1.5 text-xs font-bold text-rose-700 bg-rose-50 border border-rose-200 rounded-xl hover:bg-rose-600 hover:text-white transition-all cursor-pointer flex items-center space-x-1.5"
                            title="Hapus template sertifikat kustom dan gunakan format standar UNABA"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            <span>Hapus Template Custom</span>
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            setAdminPreviewCertData({
                              studentName: 'Andora Lavincy',
                              studentNim: '10123045',
                              studentDepartment: 'S1 Sistem Informasi',
                              activity: act,
                              registrationId: 'TEST-CERT-01'
                            });
                          }}
                          className="px-3 py-1.5 text-xs font-extrabold text-univ-orange-700 bg-univ-orange-50 border border-univ-orange-200 rounded-xl hover:bg-univ-orange-500 hover:text-white transition-all cursor-pointer flex items-center space-x-1.5"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          <span>Pratinjau E-Sertifikat</span>
                        </button>
                      </div>

                      {/* Approved Students List */}
                      {approvedRegs.length > 0 && (
                        <div className="space-y-1.5 pt-2 border-t border-slate-100">
                          <p className="text-[10px] font-extrabold uppercase text-slate-500 tracking-wider">
                            Peserta Terverifikasi ({approvedRegs.length} Mahasiswa):
                          </p>
                          <div className="max-h-32 overflow-y-auto space-y-1 pr-1">
                            {approvedRegs.map(reg => (
                              <div 
                                key={reg.id}
                                className="flex items-center justify-between p-2 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-150 text-xs"
                              >
                                <div className="space-y-0.5">
                                  <span className="font-extrabold text-slate-900 block">{reg.studentName}</span>
                                  <span className="text-[10px] text-slate-500 font-mono">NIM: {reg.studentNim} • {reg.studentDepartment}</span>
                                </div>

                                <button
                                  type="button"
                                  onClick={() => {
                                    setAdminPreviewCertData({
                                      studentName: reg.studentName,
                                      studentNim: reg.studentNim,
                                      studentDepartment: reg.studentDepartment,
                                      activity: act,
                                      registrationId: reg.id
                                    });
                                  }}
                                  className="px-2.5 py-1 text-[10px] font-extrabold text-emerald-800 bg-emerald-100 border border-emerald-200 rounded-lg hover:bg-emerald-600 hover:text-white transition-all cursor-pointer flex items-center space-x-1 shrink-0"
                                >
                                  <Award className="h-3 w-3" />
                                  <span>Unduh Sertifikat</span>
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                    </div>
                  ) : (
                    <div className="p-3 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
                      <p className="text-xs font-semibold text-slate-500">
                        Sertifikat dinonaktifkan untuk kegiatan ini. Peserta tidak akan mendapatkan opsi cetak e-sertifikat.
                      </p>
                    </div>
                  )}

                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Modal Edit Konfigurasi Detail Sertifikat */}
      {editingCertActivity && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl border border-slate-200/80 space-y-5 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-univ-blue-50 text-univ-blue-600 rounded-xl">
                  <Award className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">Edit Konfigurasi E-Sertifikat</h3>
                  <p className="text-xs text-slate-500 font-medium">Ubah detail judul, penandatangan, & poin SKPI</p>
                </div>
              </div>
              <button
                onClick={() => setEditingCertActivity(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-all cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCertEditor} className="space-y-4 text-left">
              {/* Toggle Has Certificate */}
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-200/80">
                <div>
                  <span className="text-xs font-bold text-slate-800 block">Status Terbit E-Sertifikat</span>
                  <span className="text-[10px] text-slate-500 block">Pilih apakah kegiatan ini menerbitkan e-sertifikat</span>
                </div>
                <button
                  type="button"
                  onClick={() => setCertHasEnabledInput(!certHasEnabledInput)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer border ${
                    certHasEnabledInput
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                      : 'bg-slate-200 text-slate-600 border-slate-300'
                  }`}
                >
                  {certHasEnabledInput ? '🎓 Aktif' : '🚫 Non-Aktif'}
                </button>
              </div>

              {/* Toggle Allow Download by Student */}
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
                <div>
                  <span className="text-xs font-bold text-slate-800 block">Status Akses Download Mahasiswa</span>
                  <span className="text-[10px] text-slate-500 block">Tentukan apakah mahasiswa sudah boleh mendownload sertifikat ini atau masih dikunci panitia</span>
                </div>
                <div className="flex items-center space-x-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setCertAllowDownloadInput(true)}
                    className={`flex-1 py-2 px-3 rounded-xl text-xs font-extrabold transition-all cursor-pointer border flex items-center justify-center space-x-1.5 ${
                      certAllowDownloadInput
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <CheckCircle className="h-4 w-4" />
                    <span>🟢 Boleh Diunduh</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCertAllowDownloadInput(false)}
                    className={`flex-1 py-2 px-3 rounded-xl text-xs font-extrabold transition-all cursor-pointer border flex items-center justify-center space-x-1.5 ${
                      !certAllowDownloadInput
                        ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <Lock className="h-4 w-4" />
                    <span>🔒 Belum Boleh (Dikunci)</span>
                  </button>
                </div>
              </div>

              {/* Judul Kegiatan / Nama Sertifikat */}
              <div className="space-y-1">
                <label className="text-[11px] font-extrabold uppercase tracking-wide text-slate-600">Judul Kegiatan di Sertifikat *</label>
                <input
                  type="text"
                  required
                  value={certTitleInput}
                  onChange={(e) => setCertTitleInput(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-univ-blue-500 focus:outline-none"
                  placeholder="Nama kegiatan..."
                />
              </div>

              {/* Tanggal Pelaksanaan / Penerbitan Sertifikat */}
              <div className="space-y-1">
                <label className="text-[11px] font-extrabold uppercase tracking-wide text-slate-600">Tanggal Pelaksanaan / Penerbitan Sertifikat *</label>
                <input
                  type="text"
                  required
                  value={certDateInput}
                  onChange={(e) => setCertDateInput(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-univ-blue-500 focus:outline-none"
                  placeholder="misal: 15 Maret 2026 atau 20 - 22 Juli 2026"
                />
              </div>

              {/* Penandatangan Nama */}
              <div className="space-y-1">
                <label className="text-[11px] font-extrabold uppercase tracking-wide text-slate-600">Nama Penandatangan Resmi *</label>
                <input
                  type="text"
                  required
                  value={certSignerNameInput}
                  onChange={(e) => setCertSignerNameInput(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-univ-blue-500 focus:outline-none"
                  placeholder="misal: Dr. Ir. H. Mulyono, M.T."
                />
              </div>

              {/* Penandatangan Jabatan */}
              <div className="space-y-1">
                <label className="text-[11px] font-extrabold uppercase tracking-wide text-slate-600">Jabatan Penandatangan *</label>
                <input
                  type="text"
                  required
                  value={certSignerRoleInput}
                  onChange={(e) => setCertSignerRoleInput(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-univ-blue-500 focus:outline-none"
                  placeholder="misal: PLH Rektor Universitas Anak Bangsa"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingCertActivity(null)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 transition-all cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-extrabold text-white bg-univ-orange-500 rounded-xl hover:bg-univ-orange-600 shadow-md transition-all cursor-pointer flex items-center space-x-1.5"
                >
                  <Check className="h-4 w-4" />
                  <span>Simpan Perubahan Sertifikat</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Admin Certificate Preview Modal Overlay */}
      {adminPreviewCertData && (
        <CertificateModal
          isOpen={true}
          onClose={() => setAdminPreviewCertData(null)}
          studentName={adminPreviewCertData.studentName}
          studentNim={adminPreviewCertData.studentNim}
          studentDepartment={adminPreviewCertData.studentDepartment}
          activityTitle={adminPreviewCertData.activity.title}
          activityCategory={adminPreviewCertData.activity.category}
          eventDate={adminPreviewCertData.activity.eventDate}
          location={adminPreviewCertData.activity.location}
          registrationId={adminPreviewCertData.registrationId}
          skpiPoints={adminPreviewCertData.activity.skpiPoints}
          hasCertificate={adminPreviewCertData.activity.hasCertificate}
          plhRektorName={plhRektorName}
          certificateSignerName={adminPreviewCertData.activity.certificateSignerName}
          certificateSignerRole={adminPreviewCertData.activity.certificateSignerRole}
        />
      )}

    </div>
  );
}

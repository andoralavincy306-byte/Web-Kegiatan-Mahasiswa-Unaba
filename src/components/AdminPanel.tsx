import React, { useState } from 'react';
import { Activity, Registration, ActivityCategory, ActivityStatus } from '../types';
import { 
  Lock, LogIn, Users, Check, X, ShieldAlert, Award, Grid, 
  MapPin, Calendar, Clock, Plus, Trash2, Edit, Image as ImageIcon, 
  Search, RefreshCw, Layers, CheckCircle, UploadCloud, Save
} from 'lucide-react';

interface AdminPanelProps {
  activities: Activity[];
  registrations: Registration[];
  onApproveRegistration: (id: string) => void;
  onRejectRegistration: (id: string) => void;
  onDeleteRegistration: (id: string) => void;
  onAddActivity: (activity: Activity) => void;
  onEditActivity: (activity: Activity) => void;
  onDeleteActivity: (id: string) => void;
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
  onApproveRegistration,
  onRejectRegistration,
  onDeleteRegistration,
  onAddActivity,
  onEditActivity,
  onDeleteActivity,
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
  // Authentication State
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

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
  const [activeTab, setActiveTab] = useState<'VERIFICATION' | 'CATALOG' | 'STUDENTS'>('VERIFICATION');

  const [studentsList, setStudentsList] = useState<any[]>(() => {
    const saved = localStorage.getItem('uab_all_registered_students_v5');
    return saved ? JSON.parse(saved) : [];
  });

  // Refresh student registry from localStorage whenever this tab is active or loaded
  const refreshStudentsList = () => {
    const saved = localStorage.getItem('uab_all_registered_students_v5');
    if (saved) {
      setStudentsList(JSON.parse(saved));
    }
  };

  const handleDeleteStudent = (nim: string, name: string) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus akun mahasiswa "${name}" (NIM: ${nim}) dari portal? Semua data pendaftaran kegiatan mereka tidak akan dihapus dari histori pendaftaran, tetapi akun mahasiswa mereka akan dihapus dari database pendaftaran.`)) {
      const saved = localStorage.getItem('uab_all_registered_students_v5');
      if (saved) {
        try {
          const list = JSON.parse(saved);
          const updatedList = list.filter((s: any) => s.nim.trim() !== nim.trim());
          localStorage.setItem('uab_all_registered_students_v5', JSON.stringify(updatedList));
          setStudentsList(updatedList);
          
          // Dispatch a custom event to notify App.tsx or other components if necessary 
          window.dispatchEvent(new Event('storage'));
          
          alert(`Akun mahasiswa "${name}" berhasil dihapus dari sistem portal.`);
        } catch (e) {
          console.error(e);
        }
      }
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
  const [newDeadline, setNewDeadline] = useState('');
  const [newRequirements, setNewRequirements] = useState('');
  const [newBenefits, setNewBenefits] = useState('');
  const [newImageUrl, setNewImageUrl] = useState(IMAGE_PRESETS[0].url);

  // Edit Panel state
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editLongDesc, setEditLongDesc] = useState('');
  const [editCategory, setEditCategory] = useState<ActivityCategory>(ActivityCategory.ACADEMIC);
  const [editPoints, setEditPoints] = useState(10);
  const [editQuota, setEditQuota] = useState(100);
  const [editLocation, setEditLocation] = useState('');
  const [editEventDate, setEditEventDate] = useState('');
  const [editDeadline, setEditDeadline] = useState('');
  const [editRequirements, setEditRequirements] = useState('');
  const [editBenefits, setEditBenefits] = useState('');
  const [editImageUrl, setEditImageUrl] = useState('');

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
      setLoginError('');
    } else {
      setLoginError('Kredensial salah. Petunjuk: gunakan user "admin" & sandi "admin123"');
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
      quota: Number(newQuota) || 50,
      registeredCount: 0,
      location: newLocation,
      benefits: newBenefits ? newBenefits.split(',').map(b => b.trim()) : ['Sertifikat Resmi UNABA', 'Voucher Konsumsi'],
      requirements: newRequirements ? newRequirements.split(',').map(r => r.trim()) : ['Mahasiswa Aktif UNABA'],
      contactPerson: {
        name: officialContactName,
        phone: officialContactPhone
      }
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
    setNewDeadline('');
    setNewRequirements('');
    setNewBenefits('');
    setNewImageUrl(IMAGE_PRESETS[0].url);
    
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
    setEditDeadline(act.registrationDeadline);
    setEditImageUrl(act.imageUrl);
    setEditRequirements(act.requirements.join(', '));
    setEditBenefits(act.benefits.join(', '));
    
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
      quota: Number(editQuota) || 50,
      location: editLocation,
      benefits: editBenefits ? editBenefits.split(',').map(b => b.trim()) : ['Sertifikat Resmi UNABA', 'Voucher Konsumsi'],
      requirements: editRequirements ? editRequirements.split(',').map(r => r.trim()) : ['Mahasiswa Aktif UNABA'],
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
                placeholder="Contoh: admin"
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
                placeholder="Contoh: admin123"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-gray-800 transition-all focus:border-univ-blue-600 focus:bg-white focus:outline-none"
              />
            </div>

            {/* Hint Notice */}
            <div className="rounded-xl bg-amber-50 border border-amber-200/50 p-3 text-xs text-amber-800 flex items-start space-x-2">
              <ShieldAlert className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" />
              <div>
                <span className="font-bold">Tips Reviewer:</span><br />
                User: <code className="font-mono bg-amber-100/80 px-1 rounded font-bold text-slate-800">admin</code> & Sandi: <code className="font-mono bg-amber-100/80 px-1 rounded font-bold text-slate-800">admin123</code>
              </div>
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
          <h3 className="text-base font-extrabold text-gray-900 border-b border-gray-55 pb-3 mb-4">
            Konfirmasi Registrasi & Berkas KTM Mahasiswa
          </h3>

          {registrations.length === 0 ? (
            <div className="text-center py-12">
              <CheckCircle className="mx-auto h-12 w-12 text-gray-300 mb-2" />
              <p className="text-sm text-gray-400">Belum ada pengajuan beredar</p>
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
                    <th className="p-3 text-right">Opsi</th>
                  </tr>
                </thead>
                <tbody>
                  {registrations.map(reg => {
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
                      <tr key={reg.id} className={`border-b border-slate-50 text-xs hover:bg-slate-50/50 ${isDuplicateApproved ? 'bg-rose-50/30' : ''}`}>
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
                          <span className={`inline-block font-bold rounded-full px-2 py-0.5 text-[9px] ${
                            reg.status === 'APPROVED' 
                              ? 'bg-green-100 text-green-800' 
                              : reg.status === 'PENDING' 
                              ? 'bg-amber-100 text-amber-800' 
                              : 'bg-rose-100 text-rose-800'
                          }`}>
                            {reg.status}
                          </span>
                        </td>

                        {/* Action triggers */}
                        <td className="p-3 text-right h-full">
                          <div className="flex items-center justify-end gap-1.5">
                            {reg.status === 'PENDING' && (
                              <>
                                <button
                                  onClick={() => onApproveRegistration(reg.id)}
                                  className="rounded bg-green-505 bg-green-500 hover:bg-green-600 p-1.5 text-white transition-all cursor-pointer shadow-sm"
                                  title="Setujui Pendaftaran"
                                >
                                  <Check className="h-3.5 w-3.5" />
                                </button>
                                <button
                                  onClick={() => onRejectRegistration(reg.id)}
                                  className="rounded bg-rose-505 bg-rose-500 hover:bg-rose-600 p-1.5 text-white transition-all cursor-pointer shadow-sm"
                                  title="Tolak Pendaftaran"
                                >
                                  <X className="h-3.5 w-3.5" />
                                </button>
                              </>
                            )}
                            {reg.status !== 'PENDING' && (
                              <span className={`text-[10px] px-2 py-0.5 rounded font-extrabold mr-1 ${
                                reg.status === 'APPROVED' ? 'bg-green-50 text-green-700' : 'bg-rose-50 text-rose-700'
                              }`}>
                                {reg.status === 'APPROVED' ? 'Disetujui' : 'Ditolak'}
                              </span>
                            )}
                            <button
                              onClick={() => {
                                if (window.confirm(`Yakin ingin menghapus berkas pendaftaran ${reg.studentName} (${reg.studentNim}) pada kegiatan "${reg.activityTitle}"?`)) {
                                  onDeleteRegistration(reg.id);
                                }
                              }}
                              className="rounded bg-slate-100 hover:bg-rose-100 text-slate-500 hover:text-rose-600 p-1.5 transition-all cursor-pointer border border-slate-200"
                              title="Hapus Registrasi"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
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
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-gray-600">Jam & Tanggal Kegiatan *</label>
                      <input
                        type="text"
                        required
                        placeholder="Contoh: 15 Juli 2026, 09:00 WIB"
                        value={editEventDate}
                        onChange={(e) => setEditEventDate(e.target.value)}
                        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold"
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

                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-gray-600">Tgl & Jam Kegiatan *</label>
                        <input
                          type="text"
                          required
                          placeholder="Contoh: 25 Juli 2026, 09:00 WIB"
                          value={newEventDate}
                          onChange={(e) => setNewEventDate(e.target.value)}
                          className="w-full rounded-lg border border-gray-200 px-2 py-2 text-xs font-semibold"
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
                  {filteredActivities.map(act => {
                    const isPast = new Date(act.registrationDeadline).getTime() < new Date().setHours(0,0,0,0);
                    return (
                      <div 
                        key={act.id} 
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
                            </div>
                            <h4 className="text-xs font-extrabold text-slate-900 leading-snug line-clamp-1">{act.title}</h4>
                            
                            <div className="flex items-center space-x-3 text-[10px] text-gray-500 font-medium">
                              <span className="flex items-center space-x-1">
                                <Calendar className="h-3 w-3 text-univ-orange-500" />
                                <span className="text-gray-700">{act.eventDate}</span>
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

                    </div>
                    );
                  })}
                </div>
              )}

            </div>
          </div>

        </div>
      )}

      {/* TAB 3: REGISTERED USERS DATABASE */}
      {activeTab === 'STUDENTS' && (
        <div id="tab-students-panel" className="rounded-2xl border border-gray-150 bg-white p-5 shadow-sm min-h-[400px]">
          <div className="flex flex-col sm:flex-row items-center justify-between border-b border-gray-255 pb-3 mb-4 gap-3">
            <div>
              <h3 className="text-base font-extrabold text-gray-900">
                Data Akun Mahasiswa Terdaftar
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">Daftar seluruh mahasiswa yang mendaftarkan akun utama di Portal Universitas Anak Bangsa (UNABA).</p>
            </div>
            <button
              onClick={refreshStudentsList}
              className="px-3.5 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl transition-all cursor-pointer flex items-center space-x-1.5"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Muat Ulang Database</span>
            </button>
          </div>

          {studentsList.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <span className="text-4xl">👥</span>
              <p className="text-sm font-bold text-gray-500 mt-3">Belum ada mahasiswa yang terdaftar di komputer portal ini</p>
              <p className="text-xs text-slate-400 max-w-sm mt-1">Registrasikan akun baru melalui form pendaftaran mahasiswa pada halaman utama.</p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-extrabold uppercase text-slate-500">
                    <th className="p-3">No</th>
                    <th className="p-3">Nama Lengkap</th>
                    <th className="p-3">NIM</th>
                    <th className="p-3">Alamat Email Gmail</th>
                    <th className="p-3">Program Studi & Fakultas</th>
                    <th className="p-3 text-center">Smstr</th>
                    <th className="p-3 text-center">Nilai SKPI</th>
                    <th className="p-3 text-right">Opsi Hapus</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-150 text-xs text-slate-700">
                  {studentsList.map((stu, idx) => (
                    <tr key={stu.nim} className="hover:bg-slate-50/50 transition-colors">
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
                      <td className="p-3 text-center">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-indigo-50 text-indigo-700 border border-indigo-150">
                          {stu.skpiPointsAccumulated || 0} Pkt
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => handleDeleteStudent(stu.nim, stu.name)}
                          className="inline-flex rounded-lg bg-rose-50 text-rose-600 border border-rose-100 p-2 transition-all hover:bg-rose-600 hover:text-white cursor-pointer shadow-sm"
                          title="Hapus Akun Mahasiswa"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

    </div>
  );
}

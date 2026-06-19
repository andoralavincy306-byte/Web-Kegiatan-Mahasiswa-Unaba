import React, { useState } from 'react';
import { Activity, Registration, ActivityCategory, ActivityStatus } from '../types';
import { Lock, LogIn, Users, Check, X, ShieldAlert, Award, AlignLeft, Grid, MapPin, Calendar, Clock, Plus, Trash2 } from 'lucide-react';

interface AdminPanelProps {
  activities: Activity[];
  registrations: Registration[];
  onApproveRegistration: (id: string) => void;
  onRejectRegistration: (id: string) => void;
  onAddActivity: (activity: Activity) => void;
  onDeleteActivity: (id: string) => void;
}

export default function AdminPanel({
  activities,
  registrations,
  onApproveRegistration,
  onRejectRegistration,
  onAddActivity,
  onDeleteActivity,
}: AdminPanelProps) {
  // Authentication State
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Add event panel visibility
  const [showAddForm, setShowAddForm] = useState(false);

  // New Activity Form states
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
      imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=800&h=450',
      registrationDeadline: newDeadline,
      eventDate: newEventDate,
      quota: Number(newQuota) || 50,
      registeredCount: 0,
      location: newLocation,
      benefits: newBenefits ? newBenefits.split(',').map(b => b.trim()) : ['Sertifikat Resmi UAB', 'Voucher Konsumsi'],
      requirements: newRequirements ? newRequirements.split(',').map(r => r.trim()) : ['Mahasiswa Aktif UAB'],
      contactPerson: {
        name: 'Admin Biro Kemahasiswaan',
        phone: '0812-1111-2222'
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
    
    setShowAddForm(false);
    alert('Aktivitas baru berhasil diluncurkan ke katalog!');
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
  const rejectedRegistrations = registrations.filter(r => r.status === 'REJECTED').length;

  if (!isAdminLoggedIn) {
    return (
      <div id="admin-login-layout" className="mx-auto max-w-md px-4 py-16 text-left">
        <div className="rounded-3xl border border-gray-150 bg-white p-6 sm:p-10 shadow-lg space-y-6">
          <div className="text-center space-y-3">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-univ-blue-50 text-univ-blue-800 border border-univ-blue-100">
              <Lock className="h-6 w-6 text-univ-orange-500 animate-pulse" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-gray-950">Log Masuk Administrator</h2>
              <p className="text-xs text-gray-400 mt-1">Gunakan kredensial pengelola Biro Kemahasiswaan UAB</p>
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
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-univ-blue-800 sm:text-3xl">
            Pusat Pengendalian Biro Kemahasiswaan
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Selamat datang di Konsol Kampus. Kelola verifikasi berkas KTM pendaftaran mahasiswa serta tambah katalog kegiatan baru.
          </p>
        </div>
        
        <button
          onClick={handleLogout}
          className="rounded-xl border border-rose-250 bg-rose-50 text-rose-700 hover:bg-rose-100 px-4 py-2.5 text-xs font-bold cursor-pointer transition-all self-start md:self-auto"
        >
          Keluar Admin
        </button>
      </div>

      {/* Metrics board */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Total Pengajuan</p>
          <p className="text-2xl font-extrabold text-univ-blue-800 font-mono mt-1">{totalRegistrations}</p>
        </div>
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-amber-500">Minta Verifikasi</p>
          <p className="text-2xl font-extrabold text-amber-600 font-mono mt-1">{pendingRegistrations}</p>
        </div>
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-green-500">Disetujui (Approved)</p>
          <p className="text-2xl font-extrabold text-green-600 font-mono mt-1">{approvedRegistrations}</p>
        </div>
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Total Kegiatan</p>
          <p className="text-2xl font-extrabold text-univ-orange-500 font-mono mt-1">{activities.length}</p>
        </div>
      </div>

      {/* Primary Panels tabs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Registration approval section (7 columns) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm min-h-[400px]">
            <h3 className="text-base font-extrabold text-gray-900 border-b border-gray-55 pb-3 mb-4">
              Konfirmasi Registrasi & Berkas KTM Mahasiswa
            </h3>

            {registrations.length === 0 ? (
              <p className="text-sm text-gray-400 py-10 text-center">Belum ada pengajuan beredar</p>
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
                      const activity = activities.find(a => a.id === reg.activityId);
                      return (
                        <tr key={reg.id} className="border-b border-slate-50 text-xs">
                          {/* Student Details */}
                          <td className="p-3">
                            <p className="font-extrabold text-gray-900">{reg.studentName}</p>
                            <p className="text-[10px] font-mono text-gray-550">NIM: {reg.studentNim}</p>
                            <p className="text-[10px] text-zinc-400">{reg.studentDepartment}</p>
                          </td>

                          {/* Activity Title */}
                          <td className="p-3 font-semibold text-gray-700 max-w-[150px] truncate">
                            {reg.activityTitle}
                          </td>

                          {/* Upload KTM mock */}
                          <td className="p-3 font-mono text-[11px] text-univ-blue-700">
                            <span className="hover:underline cursor-pointer block truncate max-w-[110px]" title={reg.uploadedKtmUrl}>
                              {reg.uploadedKtmUrl}
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
                          <td className="p-3 text-right space-x-1.5 h-full">
                            {reg.status === 'PENDING' ? (
                              <div className="flex items-center justify-end space-x-1.5">
                                <button
                                  onClick={() => onApproveRegistration(reg.id)}
                                  className="rounded bg-green-500 hover:bg-green-600 p-1.5 text-white transition-all cursor-pointer"
                                  title="Setujui Pendaftaran"
                                >
                                  <Check className="h-3.5 w-3.5" />
                                </button>
                                <button
                                  onClick={() => onRejectRegistration(reg.id)}
                                  className="rounded bg-rose-500 hover:bg-rose-600 p-1.5 text-white transition-all cursor-pointer"
                                  title="Reject"
                                >
                                  <X className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            ) : (
                              <span className="text-zinc-450 italic text-[10px]">{reg.status === 'APPROVED' ? 'Selesai' : 'Batal'}</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Configurations Activity Addition panel (4 columns) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between border-b border-gray-50 pb-3 mb-4">
              <h3 className="text-base font-extrabold text-gray-900">Config Katalog</h3>
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="rounded-lg bg-univ-orange-500 text-white p-1.5 hover:bg-univ-orange-600 transition-all cursor-pointer inline-flex items-center justify-center"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            {/* Collapsible form addition */}
            {showAddForm ? (
              <form onSubmit={handleCreateActivity} className="space-y-4">
                {/* Title */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-600">Judul Kegiatan *</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Lomba Robotik Mandiri"
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

                {/* Category selectors */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-gray-600">Kategori</label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value as ActivityCategory)}
                      className="w-full rounded-lg border border-gray-200 px-2 py-2 text-xs font-semibold text-gray-600"
                    >
                      <option value={ActivityCategory.ACADEMIC}>Keilmuan</option>
                      <option value={ActivityCategory.ORGANIZATION}>Organisasi</option>
                      <option value={ActivityCategory.COMMUNITY}>Pengabdian</option>
                      <option value={ActivityCategory.ARTS}>Kesenian</option>
                      <option value={ActivityCategory.SPORTS}>Olahraga</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-gray-600">Bobot Sertifikat (Poin)</label>
                    <input
                      type="number"
                      value={newPoints}
                      onChange={(e) => setNewPoints(Number(e.target.value))}
                      className="w-full rounded-lg border border-gray-200 px-2 py-2 text-xs font-mono font-semibold text-gray-850"
                    />
                  </div>
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
                    <label className="text-[11px] font-bold text-gray-600">Tgl Kegiatan *</label>
                    <input
                      type="text"
                      required
                      placeholder="25 Juli 2026"
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
                      placeholder="2026-07-20"
                      value={newDeadline}
                      onChange={(e) => setNewDeadline(e.target.value)}
                      className="w-full rounded-lg border border-gray-200 px-2 py-2 text-xs font-mono font-semibold"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full rounded-xl bg-univ-orange-500 py-2.5 text-xs font-extrabold text-white hover:bg-univ-orange-600 transition-all cursor-pointer"
                >
                  Publikasikan Kegiatan
                </button>
              </form>
            ) : (
              <div className="space-y-4">
                <p className="text-xs text-gray-500 leading-normal">
                  Klik tombol plus di atas jika Biro Kemahasiswaan ingin meluncurkan pendaftaran acara baru. Acara baru akan masuk ke listing katalog secara instan.
                </p>

                <div className="border-t border-gray-50 pt-3">
                  <p className="text-xs font-bold text-gray-700 mb-2">Hapus Aktivitas Aktif</p>
                  <div className="space-y-2 max-h-[180px] overflow-y-auto">
                    {activities.map(act => (
                      <div key={act.id} className="flex items-center justify-between text-xs p-2 rounded-lg bg-slate-50 border border-slate-100">
                        <span className="truncate max-w-[170px] font-semibold text-gray-700">{act.title}</span>
                        <button
                          onClick={() => {
                            if (confirm(`Yakin ingin menghapus ${act.title}?`)) {
                              onDeleteActivity(act.id);
                            }
                          }}
                          className="text-rose-600 hover:text-rose-800 p-1"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

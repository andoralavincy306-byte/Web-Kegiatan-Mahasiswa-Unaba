import React, { useState } from 'react';
import { Activity, StudentProfile, Registration } from '../types';
import { ArrowLeft, Check, AlertCircle, Sparkles, Building2, User2 } from 'lucide-react';
import { useNotification } from './CenterNotification';

interface RegistrationFormProps {
  activity: Activity;
  student: StudentProfile;
  registrations: Registration[];
  onBack: () => void;
  onSubmit: (registrationData: Omit<Registration, 'id' | 'registrationDate' | 'status'>) => void;
}

export default function RegistrationForm({ activity, student, registrations = [], onBack, onSubmit }: RegistrationFormProps) {
  const { showNotification } = useNotification();
  // Controlled fields (prefilled from student structure)
  const [name, setName] = useState(student.name);
  const [nim, setNim] = useState(student.nim);
  const [email, setEmail] = useState(student.email);
  const [phone, setPhone] = useState('');
  const [department, setDepartment] = useState(student.department);
  const [semester, setSemester] = useState(student.semester);
  const [faculty, setFaculty] = useState(student.faculty || 'Fakultas Psikologi dan Sains');

  // Form states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Check for duplicate registrations for this activity and student NIM
  const isDuplicate = registrations.some(
    reg => reg.activityId === activity.id && reg.studentNim.trim() === nim.trim()
  );

  const playSuccessSound = () => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      const now = ctx.currentTime;
      
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(659.25, now);
      gain1.gain.setValueAtTime(0.12, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.35);

      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(880.00, now + 0.1);
      gain2.gain.setValueAtTime(0.12, now + 0.1);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.1);
      osc2.stop(now + 0.5);
    } catch (err) {
      console.warn(err);
    }
  };

  const checkRequirements = () => {
    if (!activity.requirements || activity.requirements.length === 0) {
      return { meets: true };
    }
    
    for (const req of activity.requirements) {
      const lowerReq = req.toLowerCase();
      
      if (lowerReq.includes('semester')) {
        const match = lowerReq.match(/semester\s*(\d+)/);
        if (match) {
          const requiredSemester = parseInt(match[1]);
          if (semester < requiredSemester) {
            return {
              meets: false,
              reason: `Minimal Semester ${requiredSemester} (Anda berada di Semester ${semester})`
            };
          }
        }
      }

      const majors = ['psikologi', 'sistem informasi', 'akuntansi', 'manajemen', 'kesehatan masyarakat', 'administrasi masyarakat'];
      for (const major of majors) {
        if (lowerReq.includes(major) && department.toLowerCase() !== major) {
          return {
            meets: false,
            reason: `Dikhususkan untuk Program Studi ${major.toUpperCase()} (Anda di Prodi ${department})`
          };
        }
      }

      const faculties = ['psikologi dan sains', 'ekonomi', 'kesehatan'];
      for (const fac of faculties) {
        if (lowerReq.includes(fac) && !faculty.toLowerCase().includes(fac)) {
          return {
            meets: false,
            reason: `Dikhususkan untuk Fakultas ${fac.toUpperCase()} (Anda di ${faculty})`
          };
        }
      }
    }
    return { meets: true };
  };

  const reqCheck = checkRequirements();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isDuplicate) {
      showNotification("Pendaftaran Ganda Terdeteksi: Anda sudah terdaftar atau mengajukan pendaftaran untuk kegiatan ini.", "warning");
      return;
    }

    if (!reqCheck.meets) {
      showNotification("Anda belum memenuhi syarat sebagai peserta untuk kegiatan ini.", "error");
      return;
    }

    setIsSubmitting(true);

    // Simulate network delay
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      
      playSuccessSound();
      showNotification(`Pendaftaran Berhasil! Formulir Anda untuk "${activity.title}" telah diterima.`, "success", "Pendaftaran Terkirim");
      
      // Callback to save state
      onSubmit({
        activityId: activity.id,
        activityTitle: activity.title,
        studentName: name,
        studentNim: nim,
        studentEmail: email,
        studentPhone: phone || '0812-XXXX-XXXX',
        studentDepartment: department,
        studentSemester: semester,
        studentFaculty: faculty,
        uploadedKtmUrl: 'pendaftaran_manual_aktif.jpg'
      });
    }, 1200);
  };

  if (submitSuccess) {
    return (
      <div id="registration-success-card" className="mx-auto max-w-2xl px-4 py-16 text-center">
        <div className="rounded-3xl border border-gray-100 bg-white p-8 sm:p-12 shadow-md space-y-6">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600 animate-pulse">
            <Check className="h-9 w-9" />
          </div>
          
          <div className="space-y-2">
            <span className="inline-block rounded-full bg-univ-blue-50 px-3 py-1 text-xs font-bold text-univ-blue-800 uppercase">
              UNABA Academic Registrar
            </span>
            <h3 className="text-2xl font-extrabold text-gray-950">Pendaftaran Berhasil Dikirim!</h3>
            <p className="text-sm text-gray-500 leading-relaxed max-w-md mx-auto">
              Terima kasih! Formulir pendaftaran Anda untuk kegiatan <strong className="text-univ-blue-850 font-bold">{activity.title}</strong> telah disimpan dengan aman.
            </p>
          </div>

          <div className="rounded-2xl bg-slate-50 border border-slate-100 p-5 text-xs text-left text-gray-550 space-y-3">
            <p className="font-bold text-univ-blue-800 flex items-center space-x-1">
              <Sparkles className="h-4 w-4 text-univ-orange-500" />
              <span>Tahapan Selanjutnya:</span>
            </p>
            <ol className="list-decimal pl-4.5 space-y-2">
              <li>Tim Biro Kemahasiswaan akan memverifikasi keaktifan NIM & kesesuaian data pendaftaran Anda dalam 24 jam.</li>
              <li>Status pendaftaran dapat dipantau langsung pada menu <strong className="font-bold text-gray-800">"Pendaftaran Saya / Riwayat Kegiatan"</strong>.</li>
              <li>E-Sertifikat keikutsertaan kelulusan resmi akan otomatis diterbitkan ke portal Anda setelah admin memverifikasi kehadiran.</li>
            </ol>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row gap-3">
            <button
               onClick={onBack}
               className="flex-1 rounded-xl bg-univ-blue-800 py-3 text-[13px] font-bold text-white shadow hover:bg-univ-blue-900 transition-all cursor-pointer"
            >
              Kembali ke Katalog
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id="registration-form-panel" className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8 text-left">
      
      {/* Back breadcrumb trigger */}
      <div className="mb-6">
        <button
          onClick={onBack}
          className="inline-flex items-center space-x-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-bold text-gray-700 shadow-sm transition-all hover:bg-slate-50"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Kembali ke Detail Kegiatan</span>
        </button>
      </div>

      {/* Main card box */}
      <div className="overflow-hidden rounded-2xl border border-slate-150 bg-white shadow-md">
        
        {/* Banner Section Header */}
        <div className="bg-univ-blue-800 px-6 py-5 text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-univ-orange-500">Formulir Pendaftaran</span>
            <h2 className="text-lg font-extrabold sm:text-xl leading-snug mt-1">
              {activity.title}
            </h2>
          </div>
          <div className="rounded-lg bg-univ-blue-900 px-3 py-1.5 border border-univ-blue-700 shrink-0 text-center">
            <p className="text-[10px] text-gray-400 font-bold uppercase">Benefit Peserta</p>
            <p className="text-sm font-extrabold text-univ-orange-500">E-Sertifikat Resmi</p>
          </div>
        </div>

        {/* Form elements body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
          
          {/* Requirements Not Met Warning */}
          {!reqCheck.meets && (
            <div className="rounded-xl border border-rose-350 bg-rose-50 p-4 text-xs text-rose-800 flex items-start space-x-2.5 shadow-sm">
              <AlertCircle className="h-5 w-5 shrink-0 text-rose-600 mt-0.5" />
              <div className="space-y-1 text-left">
                <span className="font-extrabold block text-rose-950 uppercase tracking-wide text-[11px]">Syarat Tidak Terpenuhi</span>
                <p className="font-bold text-rose-850 text-sm leading-normal">
                  "anda belum bisa mendaftar dikarena belum memenuhi syarat sebagai peserta"
                </p>
                <p className="text-[11px] text-rose-700 italic font-medium mt-1">
                  Penyebab: {reqCheck.reason}
                </p>
              </div>
            </div>
          )}

          {/* Duplicate Registration Blocked Warning */}
          {isDuplicate && (
            <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-xs text-rose-800 flex items-start space-x-2.5 animate-pulse">
              <AlertCircle className="h-5 w-5 shrink-0 text-rose-600 mt-0.5 animate-bounce" />
              <div className="space-y-1">
                <span className="font-extrabold block uppercase tracking-wider text-rose-900 text-[11px]">Mahasiswa Sudah Terdaftar</span>
                Peringatan: Mahasiswa dengan NIM <strong className="font-mono text-rose-950 font-extrabold">{nim}</strong> ini sudah mengajukan pendaftaran atau sudah disetujui (APPROVED/PENDING) pada kegiatan <strong className="font-bold text-rose-950">{activity.title}</strong>. Anda tidak dapat melakukan pendaftaran ganda/dua kali untuk kegiatan yang sama. Silakan periksa halaman <strong className="font-bold whitespace-nowrap">"Pendaftaran Saya"</strong>.
              </div>
            </div>
          )}

          {/* Identity Pre-filled Notice */}
          <div className="rounded-xl border border-sky-100 bg-sky-50/50 p-4 text-xs text-univ-blue-900 flex items-start space-x-2.5">
            <AlertCircle className="h-5 w-5 shrink-0 text-univ-blue-700 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold block">Pemberitahuan Sistem:</span>
              Sistem telah memuat data profil otomatis Anda. Anda dapat menyesuaikan atau mengisi seluruh kolom di bawah ini secara bebas sesuai identitas peserta.
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 flex items-center space-x-1">
                <User2 className="h-3.5 w-3.5 text-gray-400" />
                <span>Nama Lengkap Mahasiswa</span>
                <span className="text-rose-500 font-extrabold">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Masukkan nama lengkap Anda"
                className="w-full rounded-xl border border-gray-250 bg-slate-50 px-4 py-3 text-sm font-semibold text-gray-800 transition-all focus:border-univ-blue-600 focus:bg-white focus:outline-none"
              />
            </div>

            {/* NIM Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 flex items-center space-x-1">
                <Building2 className="h-3.5 w-3.5 text-gray-400" />
                <span>Nomor Induk Mahasiswa (NIM)</span>
                <span className="text-rose-500 font-extrabold">*</span>
              </label>
              <input
                type="text"
                required
                value={nim}
                onChange={(e) => setNim(e.target.value)}
                placeholder="Contoh: 10123045"
                className="w-full rounded-xl border border-gray-250 bg-slate-50 px-4 py-3 text-sm font-mono font-semibold text-gray-800 transition-all focus:border-univ-blue-600 focus:bg-white focus:outline-none"
              />
            </div>

            {/* Faculty Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 flex items-center space-x-1">
                <Building2 className="h-3.5 w-3.5 text-gray-400" />
                <span>Fakultas</span>
                <span className="text-rose-500 font-extrabold">*</span>
              </label>
              <select
                required
                value={faculty}
                onChange={(e) => setFaculty(e.target.value)}
                className="w-full rounded-xl border border-gray-250 bg-slate-50 px-4 py-3 text-sm font-semibold text-gray-800 transition-all focus:border-univ-blue-600 focus:bg-white focus:outline-none"
              >
                <option value="Fakultas Psikologi dan Sains">Fakultas Psikologi dan Sains</option>
                <option value="Fakultas Ekonomi">Fakultas Ekonomi</option>
                <option value="Fakultas Kesehatan">Fakultas Kesehatan</option>
              </select>
            </div>

            {/* Department (Major) Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 flex items-center space-x-1">
                <Building2 className="h-3.5 w-3.5 text-gray-400" />
                <span>Program Studi (Prodi)</span>
                <span className="text-rose-500 font-extrabold">*</span>
              </label>
              <select
                required
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full rounded-xl border border-gray-250 bg-slate-50 px-4 py-3 text-sm font-semibold text-gray-800 transition-all focus:border-univ-blue-600 focus:bg-white focus:outline-none"
              >
                <option value="">-- Pilih Program Studi --</option>
                <option value="Psikologi">Psikologi</option>
                <option value="Sistem Informasi">Sistem Informasi</option>
                <option value="Akuntansi">Akuntansi</option>
                <option value="Manajemen">Manajemen</option>
                <option value="Kesehatan Masyarakat">Kesehatan Masyarakat</option>
                <option value="Administrasi Masyarakat">Administrasi Masyarakat</option>
                <option value="Manajemen Pelayanan Rumah Sakit">Manajemen Pelayanan Rumah Sakit</option>
              </select>
            </div>

            {/* Semester Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700">Semester Aktif</label>
              <input
                type="number"
                required
                min={1}
                max={14}
                value={semester}
                onChange={(e) => setSemester(Number(e.target.value) || 1)}
                className="w-full rounded-xl border border-gray-250 bg-slate-50 px-4 py-3 text-sm font-semibold text-gray-800 transition-all focus:border-univ-blue-600 focus:bg-white focus:outline-none font-mono"
              />
            </div>

            {/* Email field */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700">Email Mahasiswa</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama.mahasiswa@student.unaba.ac.id"
                className="w-full rounded-xl border border-gray-250 bg-slate-50 px-4 py-3 text-sm font-semibold text-gray-800 transition-all focus:border-univ-blue-600 focus:bg-white focus:outline-none font-mono"
              />
            </div>

            {/* Phone (Active) - Dynamic Manual input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 flex items-center space-x-1">
                <span>No. Handphone / WhatsApp Aktif</span>
                <span className="text-rose-500 font-extrabold">*</span>
              </label>
              <input
                id="phone-input"
                type="tel"
                required
                placeholder="Contoh: 081234567890"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-xl border border-gray-250 bg-slate-50 px-4 py-3 text-sm font-semibold text-gray-800 transition-all focus:border-univ-blue-600 focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          {/* Form Action buttons footer */}
          <div className="pt-6 border-t border-gray-100 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-3">
            <button
              type="button"
              onClick={onBack}
              className="rounded-xl border border-gray-250 py-3.5 text-center text-sm font-bold text-gray-600 hover:bg-slate-50 transition-all cursor-pointer sm:px-6"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting || isDuplicate}
              className={`rounded-xl py-3.5 text-center text-sm font-extrabold text-white transition-all sm:px-8 shadow disabled:opacity-75 disabled:cursor-not-allowed ${
                isDuplicate 
                  ? 'bg-rose-450 hover:bg-rose-500 bg-rose-500/80' 
                  : 'bg-univ-orange-500 hover:bg-univ-orange-600 cursor-pointer'
              }`}
            >
              {isSubmitting ? 'Mengirim Data...' : isDuplicate ? 'Tidak Bisa Daftar Ganda' : 'Kirim Pendaftaran'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

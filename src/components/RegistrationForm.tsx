import React, { useState, useRef } from 'react';
import { Activity, StudentProfile, Registration } from '../types';
import { ArrowLeft, Upload, FileText, Check, AlertCircle, Sparkles, Building2, User2 } from 'lucide-react';

interface RegistrationFormProps {
  activity: Activity;
  student: StudentProfile;
  onBack: () => void;
  onSubmit: (registrationData: Omit<Registration, 'id' | 'registrationDate' | 'status'>) => void;
}

export default function RegistrationForm({ activity, student, onBack, onSubmit }: RegistrationFormProps) {
  // Controlled fields (prefilled from student structure)
  const [name, setName] = useState(student.name);
  const [nim, setNim] = useState(student.nim);
  const [email, setEmail] = useState(student.email);
  const [phone, setPhone] = useState('');
  const [department, setDepartment] = useState(student.department);
  const [semester, setSemester] = useState(student.semester);
  
  // File upload state (Drag & drop)
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Drag and drop event handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      validateAndSetFile(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      validateAndSetFile(file);
    }
  };

  const validateAndSetFile = (file: File) => {
    const validTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (!validTypes.includes(file.type)) {
      setUploadError('Tipe berkas tidak valid. Harap unggah berkas berformat JPG, PNG, atau PDF.');
      setUploadedFile(null);
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setUploadError('Ukuran berkas terlalu besar. Maksimum batas ukuran adalah 2MB.');
      setUploadedFile(null);
      return;
    }
    setUploadError('');
    setUploadedFile(file);
  };

  const onButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!uploadedFile) {
      setUploadError('Harap lampirkan foto berkas pendukung KTM aktif Anda.');
      return;
    }

    setIsSubmitting(true);

    // Simulate network delay
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      
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
        uploadedKtmUrl: uploadedFile ? uploadedFile.name : 'ktm_upload.jpg'
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
              UAB Academic Registrar
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
              <li>Tim Biro Kemahasiswaan akan memverifikasi keaktifan NIM & kelengkapan berkas kartu mahasiswa (KTM) Anda dalam 24 jam.</li>
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
          
          {/* Identity Pre-filled Notice */}
          <div className="rounded-xl border border-sky-100 bg-sky-50/50 p-4 text-xs text-univ-blue-900 flex items-start space-x-2.5">
            <AlertCircle className="h-5 w-5 shrink-0 text-univ-blue-700 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold block">Pemberitahuan Sistem:</span>
              Sistem telah mendeteksi akun portal mahasiswa Anda dan mengisi data biodata secara otomatis untuk menjamin keaslian pendaftaran kuliah.
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 flex items-center space-x-1">
                <User2 className="h-3.5 w-3.5 text-gray-400" />
                <span>Nama Lengkap Mahasiswa</span>
              </label>
              <input
                type="text"
                disabled
                value={name}
                className="w-full rounded-xl border border-gray-100 bg-slate-100 px-4 py-3 text-sm font-semibold text-gray-500 cursor-not-allowed"
              />
            </div>

            {/* NIM Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 flex items-center space-x-1">
                <Building2 className="h-3.5 w-3.5 text-gray-400" />
                <span>Nomor Induk Mahasiswa (NIM)</span>
              </label>
              <input
                type="text"
                disabled
                value={nim}
                className="w-full rounded-xl border border-gray-100 bg-slate-100 px-4 py-3 text-sm font-mono font-semibold text-gray-500 cursor-not-allowed"
              />
            </div>

            {/* Department (Major) Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700">Program Studi (Prodi)</label>
              <input
                type="text"
                disabled
                value={department}
                className="w-full rounded-xl border border-gray-100 bg-slate-100 px-4 py-3 text-sm font-semibold text-gray-500 cursor-not-allowed"
              />
            </div>

            {/* Semester Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700">Semester Aktif</label>
              <input
                type="number"
                disabled
                value={semester}
                className="w-full rounded-xl border border-gray-100 bg-slate-100 px-4 py-3 text-sm font-semibold text-gray-400 cursor-not-allowed font-mono"
              />
            </div>

            {/* Email field */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700">Alamat Surat Elekronik (Email Kampus)</label>
              <input
                type="email"
                disabled
                value={email}
                className="w-full rounded-xl border border-gray-100 bg-slate-100 px-4 py-3 text-sm font-semibold text-gray-500 cursor-not-allowed font-mono"
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

          {/* Interactive Drag & Drop File Uploader */}
          <div className="space-y-2 pt-2 text-left">
            <label className="text-xs font-bold text-gray-700 flex items-center space-x-1.5">
              <span>Upload Lampiran KTM Aktif Berwarna (Format: JGP, PNG, atau PDF)</span>
              <span className="text-rose-500 font-extrabold">*</span>
            </label>

            <div
              id="file-drop-zone"
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              onClick={onButtonClick}
              className={`flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-6 sm:p-10 text-center transition-all cursor-pointer ${
                dragActive
                  ? 'border-univ-orange-500 bg-univ-orange-50/20'
                  : uploadedFile
                  ? 'border-green-400 bg-green-50/10'
                  : 'border-slate-200 bg-slate-50 hover:bg-slate-100/50 hover:border-slate-350'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept=".jpg,.jpeg,.png,.pdf"
                onChange={handleFileChange}
              />

              {uploadedFile ? (
                <div className="space-y-3">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600">
                    <FileText className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-800">{uploadedFile.name}</p>
                    <p className="text-xs text-gray-400 font-mono">{(uploadedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setUploadedFile(null);
                    }}
                    className="text-xs font-bold text-rose-600 hover:underline hover:text-rose-700"
                  >
                    Ganti Berkas
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-univ-blue-50 text-univ-blue-800 border border-univ-blue-100">
                    <Upload className="h-5.5 w-5.5" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-gray-800">
                      Seret & taruh berkas di sini atau <span className="text-univ-blue-700 hover:underline">pilih manual</span>
                    </p>
                    <p className="text-xs text-gray-400">Dimensi ideal, kapasitas berkas maksimum 2MB (JPG, PNG, PDF)</p>
                  </div>
                </div>
              )}
            </div>

            {/* Error messaging */}
            {uploadError && (
              <p className="text-xs font-bold text-rose-600 flex items-center space-x-1 mt-1">
                <AlertCircle className="h-3.5 w-3.5" />
                <span>{uploadError}</span>
              </p>
            )}
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
              disabled={isSubmitting}
              className="rounded-xl bg-univ-orange-500 py-3.5 text-center text-sm font-extrabold text-white hover:bg-univ-orange-600 transition-all cursor-pointer sm:px-8 shadow disabled:opacity-75 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Mengirim Data...' : 'Kirim Pendaftaran'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

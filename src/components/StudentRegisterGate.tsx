import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { StudentProfile } from '../types';
import { GraduationCap, Mail, User, BookOpen, AlertCircle, Calendar, Hash, ArrowRight, CheckCircle2, ShieldAlert, Lock, KeyRound } from 'lucide-react';

interface StudentRegisterGateProps {
  onRegisterComplete: (student: StudentProfile) => void;
  onAdminLogin?: () => void;
}

export default function StudentRegisterGate({ onRegisterComplete, onAdminLogin }: StudentRegisterGateProps) {
  // Mode toggle: 'REGISTER' | 'LOGIN' | 'ADMIN'
  const [mode, setMode] = useState<'REGISTER' | 'LOGIN' | 'ADMIN'>('REGISTER');

  // Registration controlled states
  const [name, setName] = useState('');
  const [nim, setNim] = useState('');
  const [email, setEmail] = useState('');
  const [department, setDepartment] = useState('Sistem Informasi');
  const [semester, setSemester] = useState(2);
  const [faculty, setFaculty] = useState('Fakultas Psikologi dan Sains');

  // Student Login controlled states
  const [loginEmail, setLoginEmail] = useState('');

  // Admin Login controlled states
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');

  // UI States
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [registeredList, setRegisteredList] = useState<StudentProfile[]>([]);

  // Load registered users database from localStorage on lifecycle boot
  useEffect(() => {
    const saved = localStorage.getItem('uab_all_registered_students_v5');
    let currentList: StudentProfile[] = [];
    if (saved) {
      currentList = JSON.parse(saved);
      setRegisteredList(currentList);
    } else {
      // Seed initially with a default student so that their data is preserved if needed
      const defaultStudent: StudentProfile = {
        name: 'Andora Lavincy',
        nim: '10123045',
        email: 'andora.lavincy306@gmail.com',
        department: 'Sistem Informasi',
        semester: 2,
        skpiPointsAccumulated: 0,
        registeredActivityIds: [],
        faculty: 'Fakultas Psikologi dan Sains'
      };
      currentList = [defaultStudent];
      setRegisteredList(currentList);
      localStorage.setItem('uab_all_registered_students_v5', JSON.stringify([defaultStudent]));
    }

    // Check if the user just logged out to show a friendly response notification
    const justLoggedOut = localStorage.getItem('uab_just_logged_out_v5');
    if (justLoggedOut === 'true') {
      setSuccessMessage('Anda telah berhasil keluar (Logged Out) dari akun Anda. Semua data pendaftaran kegiatan Anda tetap aman tersimpan.');
      localStorage.removeItem('uab_just_logged_out_v5');
      setMode('LOGIN'); // Automatically switch to login screen for better user flow
    }
  }, []);

  // Form validations & handle Register submission
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    // Primary general validation
    if (!name.trim() || !nim.trim() || !email.trim()) {
      setErrorMessage('Harap lengkapi semua bidang isian formulir!');
      return;
    }

    // NIM must be numeric
    if (!/^\d+$/.test(nim.trim())) {
      setErrorMessage('Nomor Induk Mahasiswa (NIM) harus berupa angka saja!');
      return;
    }

    // Email must be a valid Gmail format
    const cleanedEmail = email.trim().toLowerCase();
    const isGmailFormat = /^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(cleanedEmail);
    if (!isGmailFormat) {
      setErrorMessage('Alamat email wajib menggunakan domain Gmail resmi (@gmail.com)!');
      return;
    }

    // Strictly enforce uniqueness (1 akun hanya 1 gmail)
    const emailExists = registeredList.some(s => s.email.toLowerCase() === cleanedEmail);
    if (emailExists) {
      setErrorMessage('Gmail ini sudah terdaftar! Gunakan Gmail lain atau silakan Masuk Ke Akun Anda.');
      return;
    }

    // Also enforce NIM uniqueness for security/integrity
    const nimExists = registeredList.some(s => s.nim.trim() === nim.trim());
    if (nimExists) {
      setErrorMessage('Nomor Induk Mahasiswa (NIM) ini sudah digunakan oleh akun lain!');
      return;
    }

    // Registration succeeded! Appending student model
    const newStudent: StudentProfile = {
      name: name.trim(),
      nim: nim.trim(),
      email: cleanedEmail,
      department,
      semester,
      skpiPointsAccumulated: 0,
      registeredActivityIds: [],
      faculty
    };

    const updatedList = [...registeredList, newStudent];
    setRegisteredList(updatedList);
    localStorage.setItem('uab_all_registered_students_v5', JSON.stringify(updatedList));

    // Also set current active session
    localStorage.setItem('uab_student_registered_v5', 'true');
    localStorage.setItem('uab_student_profile_v5', JSON.stringify(newStudent));

    setSuccessMessage(`Akun baru untuk ${name} berhasil didaftarkan! Mengalihkan ke portal...`);
    
    setTimeout(() => {
      onRegisterComplete(newStudent);
    }, 1500);
  };

  // Login handler
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!loginEmail.trim()) {
      setErrorMessage('Masukkan alamat Gmail Anda!');
      return;
    }

    const cleanedEmail = loginEmail.trim().toLowerCase();
    
    // Find matched email account
    const matchedAccount = registeredList.find(s => s.email.toLowerCase() === cleanedEmail);
    if (!matchedAccount) {
      setErrorMessage('Email Gmail belum terdaftar di sistem! Silakan buat akun baru terlebih dahulu.');
      return;
    }

    // Success login
    localStorage.setItem('uab_student_registered_v5', 'true');
    localStorage.setItem('uab_student_profile_v5', JSON.stringify(matchedAccount));

    setSuccessMessage(`Selamat datang kembali, ${matchedAccount.name}! Membuka dashboard...`);

    setTimeout(() => {
      onRegisterComplete(matchedAccount);
    }, 1500);
  };

  // Admin login handler
  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (adminUsername === 'admin' && adminPassword === 'admin123') {
      localStorage.setItem('uab_is_admin_authenticated', 'true');
      localStorage.setItem('uab_student_registered_v5', 'true');
      setSuccessMessage('Login Administrator Berhasil! Mengalihkan ke Panel Admin...');
      setTimeout(() => {
        if (onAdminLogin) {
          onAdminLogin();
        } else {
          // Fallback if prop not supplied: register dummy admin profile
          const adminStudent: StudentProfile = {
            name: 'Administrator Portal',
            nim: '99999999',
            email: 'admin@unaba.ac.id',
            department: 'Sistem Informasi',
            semester: 8,
            skpiPointsAccumulated: 100,
            registeredActivityIds: [],
            faculty: 'Fakultas Psikologi dan Sains'
          };
          onRegisterComplete(adminStudent);
        }
      }, 1000);
    } else {
      setErrorMessage('Kredensial Admin Salah! Username: admin, Password: admin123');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans">
      
      {/* Background visual geometric lights */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-univ-blue-800/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-15%] right-[-10%] w-[50%] h-[50%] rounded-full bg-univ-orange-500/10 blur-[120px] pointer-events-none" />

      {/* Campus Logo & Portal Title */}
      <div className="mb-6 text-center z-10">
        <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-800 text-univ-orange-500 border border-slate-700 shadow-xl">
          <GraduationCap className="h-8 w-8" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          PORTAL <span className="text-univ-orange-500">TERPADU UNABA</span>
        </h1>
        <p className="text-xs text-gray-400 mt-1 max-w-md uppercase tracking-wider font-semibold">
          Universitas Anak Bangsa • Sistem Informasi Kemahasiswaan
        </p>
      </div>

      {/* Main card box container */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg bg-slate-950/80 border border-slate-800/80 rounded-[2.5rem] p-6 sm:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.4)] backdrop-blur-xl z-10 text-left"
      >
        {/* Step Mode Tab switches (3 Options: Register, Student Login, Admin Login) */}
        <div className="flex bg-slate-900 border border-slate-800 rounded-2xl p-1.5 mb-8 text-center">
          <button
            type="button"
            onClick={() => {
              setMode('REGISTER');
              setErrorMessage('');
              setSuccessMessage('');
            }}
            className={`flex-1 py-2.5 text-[11px] sm:text-xs font-semibold rounded-xl transition-all cursor-pointer ${
              mode === 'REGISTER'
                ? 'bg-univ-orange-500 text-white shadow-md font-extrabold'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Daftar Mahasiswa
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('LOGIN');
              setErrorMessage('');
              setSuccessMessage('');
            }}
            className={`flex-1 py-2.5 text-[11px] sm:text-xs font-semibold rounded-xl transition-all cursor-pointer ${
              mode === 'LOGIN'
                ? 'bg-univ-orange-500 text-white shadow-md font-extrabold'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Masuk Gmail
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('ADMIN');
              setErrorMessage('');
              setSuccessMessage('');
            }}
            className={`flex-1 py-2.5 text-[11px] sm:text-xs font-semibold rounded-xl transition-all cursor-pointer flex items-center justify-center space-x-1 ${
              mode === 'ADMIN'
                ? 'bg-univ-blue-800 text-white shadow-md font-extrabold border border-univ-blue-600'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Lock className="h-3 w-3 text-univ-orange-500" />
            <span>Login Admin</span>
          </button>
        </div>

        {/* Display Alert alerts */}
        {errorMessage && (
          <div className="mb-6 rounded-2xl border border-rose-950 bg-rose-950/30 p-4 text-xs text-rose-450 flex items-start space-x-2.5 animate-pulse">
            <AlertCircle className="h-5 w-5 shrink-0 text-rose-500 mt-0.5" />
            <div className="space-y-1">
              <span className="font-extrabold block uppercase tracking-wider text-rose-400">Peringatan Kegagalan</span>
              <p className="text-gray-300 font-bold leading-relaxed">{errorMessage}</p>
            </div>
          </div>
        )}

        {successMessage && (
          <div className="mb-6 rounded-2xl border border-emerald-950 bg-emerald-950/30 p-4 text-xs text-emerald-450 flex items-start space-x-2.5">
            <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500 mt-0.5" />
            <div className="space-y-1">
              <span className="font-extrabold block uppercase tracking-wider text-emerald-400">Verifikasi Sukses</span>
              <p className="text-gray-300 font-semibold leading-relaxed">{successMessage}</p>
            </div>
          </div>
        )}

        {/* --- REGISTER FORM MODE --- */}
        {mode === 'REGISTER' ? (
          <form onSubmit={handleRegister} className="space-y-5">
            <div className="space-y-1.5 text-center sm:text-left mb-2">
              <h2 className="text-lg font-bold text-slate-100 flex items-center space-x-2">
                <span>Lengkapi Profil Mahasiswa Utama</span>
              </h2>
              <p className="text-xs text-slate-450">Setiap data NIM dan Gmail hanya dapat didaftarkan satu kali.</p>
            </div>

            {/* Input Name */}
            <div className="space-y-1.5">
              <label className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-widest block">Nama Lengkap Sesuai KTM</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-600">
                  <User className="h-4 w-4" />
                </span>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Contoh: Andora Lavincy"
                  className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-10 pr-4 py-3 text-xs sm:text-sm font-semibold text-white placeholder-slate-600 transition-colors focus:outline-none focus:border-univ-orange-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Input NIM */}
              <div className="space-y-1.5">
                <label className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-widest block">Nomor Induk Mahasiswa (NIM)</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-600">
                    <Hash className="h-4 w-4" />
                  </span>
                  <input
                    type="text"
                    required
                    value={nim}
                    onChange={(e) => setNim(e.target.value)}
                    placeholder="Contoh: 10123045"
                    className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-10 pr-4 py-3 text-xs sm:text-sm font-mono text-white placeholder-slate-600 transition-colors focus:outline-none focus:border-univ-orange-500"
                  />
                </div>
              </div>

              {/* Input Gmail */}
              <div className="space-y-1.5">
                <label className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-widest block">Alamat Email Gmail Resmi</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-600">
                    <Mail className="h-4 w-4" />
                  </span>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nama@gmail.com"
                    className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-10 pr-4 py-3 text-xs sm:text-sm font-medium text-white placeholder-slate-600 transition-colors focus:outline-none focus:border-univ-orange-500"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Select Jurusan */}
              <div className="space-y-1.5">
                <label className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-widest block">Program Studi / Jurusan</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-600">
                    <BookOpen className="h-4 w-4" />
                  </span>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-10 pr-4 py-3 text-xs sm:text-sm text-slate-300 transition-colors focus:outline-none focus:border-univ-orange-500 appearance-none cursor-pointer"
                  >
                    <option value="Sistem Informasi">Sistem Informasi</option>
                    <option value="Psikologi">Psikologi</option>
                    <option value="Akuntansi">Akuntansi</option>
                    <option value="Manajemen">Manajemen</option>
                    <option value="Kesehatan Masyarakat">Kesehatan Masyarakat</option>
                    <option value="Administrasi Rumah Sakit">Administrasi Rumah Sakit</option>
                    <option value="Manajemen Pelayanan Rumah Sakit">Manajemen Pelayanan Rumah Sakit</option>
                  </select>
                </div>
              </div>

              {/* Select Semester */}
              <div className="space-y-1.5">
                <label className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-widest block">Semester Aktif</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-600">
                    <Calendar className="h-4 w-4" />
                  </span>
                  <select
                    value={semester}
                    onChange={(e) => setSemester(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-10 pr-4 py-3 text-xs sm:text-sm text-slate-300 transition-colors focus:outline-none focus:border-univ-orange-500 appearance-none cursor-pointer"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((sem) => (
                      <option key={sem} value={sem}>Semester {sem}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Select Faculty */}
            <div className="space-y-1.5">
              <label className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-widest block">Fakultas</label>
              <select
                value={faculty}
                onChange={(e) => setFaculty(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-4 py-3 text-xs sm:text-sm text-slate-300 transition-colors focus:outline-none focus:border-univ-orange-500 cursor-pointer"
              >
                <option value="Fakultas Psikologi dan Sains">Fakultas Psikologi dan Sains</option>
                <option value="Fakultas Ekonomi">Fakultas Ekonomi</option>
                <option value="Fakultas Kesehatan">Fakultas Kesehatan</option>
              </select>
            </div>

            {/* Warn user about Gmail condition */}
            <div className="rounded-xl bg-slate-900 border border-slate-800 p-3 flex items-start space-x-2">
              <ShieldAlert className="h-4 w-4 text-univ-orange-500 shrink-0 mt-0.5" />
              <p className="text-[10px] text-gray-400">
                Data email <span className="font-semibold text-slate-200">wajib berakhiran @gmail.com</span>. Setelah mendaftar, semua pendaftaran kegiatan pada portal ini akan menggunakan identitas ini secara permanen.
              </p>
            </div>

            {/* Submit registry button */}
            <button
              type="submit"
              className="w-full bg-univ-orange-500 hover:bg-univ-orange-600 text-white font-extrabold text-xs sm:text-sm py-3.5 rounded-2xl mt-4 cursor-pointer transition-all active:scale-[0.98] flex items-center justify-center space-x-2 shadow-lg"
            >
              <span>Daftar Akun Utama Portal</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        ) : mode === 'LOGIN' ? (
          /* --- LOGIN FORM MODE --- */
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-1.5 text-center sm:text-left mb-2">
              <h2 className="text-lg font-bold text-slate-100 flex items-center space-x-2">
                <span>Masuk dengan Gmail Terdaftar</span>
              </h2>
              <p className="text-xs text-slate-450">Silakan masukkan email Gmail yang pernah Anda daftarkan di portal.</p>
            </div>

            {/* Login Email Gmail */}
            <div className="space-y-1.5">
              <label className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-widest block">Email Gmail Terdaftar</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-600">
                  <Mail className="h-4 w-4" />
                </span>
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="contoh: andora.lavincy306@gmail.com"
                  className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-10 pr-4 py-4 text-xs sm:text-sm font-medium text-white placeholder-slate-600 transition-colors focus:outline-none focus:border-univ-orange-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-univ-orange-500 hover:bg-univ-orange-600 text-white font-extrabold text-xs sm:text-sm py-4 rounded-2xl mt-4 cursor-pointer transition-all active:scale-[0.98] flex items-center justify-center space-x-2 shadow-lg"
            >
              <span>Masuk Akun Kemahasiswaan</span>
              <ArrowRight className="h-4 w-4" />
            </button>

            <div className="text-center pt-2">
              <p className="text-xs text-gray-500">
                Belum pernah mendaftarkan akun?{' '}
                <span 
                  onClick={() => setMode('REGISTER')}
                  className="text-univ-orange-500 font-bold hover:underline cursor-pointer"
                >
                  Registrasi Di Sini
                </span>
              </p>
            </div>
          </form>
        ) : (
          /* --- ADMIN FORM MODE --- */
          <form onSubmit={handleAdminSubmit} className="space-y-5">
            <div className="space-y-1.5 text-center sm:text-left mb-2">
              <h2 className="text-lg font-bold text-slate-100 flex items-center space-x-2">
                <Lock className="h-5 w-5 text-univ-orange-500" />
                <span>Masuk Portal Administrator</span>
              </h2>
              <p className="text-xs text-slate-450">Akses khusus pengelola BKA untuk memverifikasi pendaftaran dan mengelola kegiatan.</p>
            </div>

            {/* Username Field */}
            <div className="space-y-1.5">
              <label className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-widest block">Username Pengelola</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-600">
                  <User className="h-4 w-4" />
                </span>
                <input
                  type="text"
                  required
                  value={adminUsername}
                  onChange={(e) => setAdminUsername(e.target.value)}
                  placeholder="Masukkan Username Admin"
                  className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-10 pr-4 py-3.5 text-xs sm:text-sm font-semibold text-white placeholder-slate-600 transition-colors focus:outline-none focus:border-univ-blue-500"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-widest block">Kata Sandi / Password</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-600">
                  <KeyRound className="h-4 w-4" />
                </span>
                <input
                  type="password"
                  required
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-10 pr-4 py-3.5 text-xs sm:text-sm font-mono text-white placeholder-slate-600 transition-colors focus:outline-none focus:border-univ-blue-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-univ-blue-800 hover:bg-univ-blue-900 text-white font-extrabold text-xs sm:text-sm py-4 rounded-2xl mt-4 cursor-pointer transition-all active:scale-[0.98] flex items-center justify-center space-x-2 shadow-lg border border-univ-blue-600"
            >
              <span>Masuk Portal Admin</span>
              <ArrowRight className="h-4 w-4 text-univ-orange-500" />
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
}

import React from 'react';
import { StudentProfile, Registration, Activity } from '../types';
import { Award, Mail, BookOpen, Clock, CheckCircle2, XCircle, Printer, CalendarDays, Key, MapPin } from 'lucide-react';

interface ProfileSectionProps {
  student: StudentProfile;
  registrations: Registration[];
  activities: Activity[];
  onViewActivityDetails: (id: string) => void;
}

export default function ProfileSection({ student, registrations, activities, onViewActivityDetails }: ProfileSectionProps) {
  // Filter registrations belonging to this student (by NIM)
  const studentRegistrations = registrations.filter(r => r.studentNim === student.nim);

  // Print function simulated
  const handlePrintTranscript = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Gagal membuka jendela cetak. Pastikan pop-up diperbolehkan di browser Anda.');
      return;
    }

    const rows = studentRegistrations.map((reg, index) => {
      const activity = activities.find(a => a.id === reg.activityId);
      const date = reg.registrationDate;
      const category = activity ? activity.category : '-';
      return `
        <tr style="border-bottom: 1px solid #e2e8f0;">
          <td style="padding: 12px; text-align: center;">${index + 1}</td>
          <td style="padding: 12px; font-weight: bold;">${reg.activityTitle}</td>
          <td style="padding: 12px;">${category}</td>
          <td style="padding: 12px; text-align: center; font-family: monospace;">${date}</td>
          <td style="padding: 12px; text-align: center; font-weight: bold; color: #166534;">${reg.status === 'APPROVED' ? 'Terverifikasi' : reg.status}</td>
        </tr>
      `;
    }).join('');

    printWindow.document.write(`
      <html>
        <head>
          <title>Riwayat Kegiatan - ${student.name}</title>
          <style>
            body { font-family: 'Helvetica Neue', Arial, sans-serif; padding: 40px; color: #1e293b; line-height: 1.5; }
            .header-table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
            .content-table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            .content-table th { background-color: #0a3d62; color: white; padding: 12px; text-align: left; }
            .stamp { border: 2px dashed #ff7f3f; color: #ff7f3f; padding: 10px 20px; display: inline-block; font-weight: bold; transform: rotate(-5deg); margin-top: 20px; }
            .seal { font-size: 11px; color: #64748b; margin-top: 50px; text-align: center; border-t: 1px solid #e2e8f0; padding-top: 20px; }
          </style>
        </head>
        <body>
          <table class="header-table">
            <tr>
              <td style="width: 80px;">
                <div style="width: 60px; height: 60px; background-color: #0a3d62; border-radius: 10px; display: flex; align-items: center; justify-content: center; color: #ff7f3f; font-size: 24px; font-weight: bold; text-align: center; line-height: 60px;">UAB</div>
              </td>
              <td>
                <h2 style="margin: 0; color: #0a3d62;">UNIVERSITAS ANAK BANGSA</h2>
                <p style="margin: 2px 0 0 0; font-size: 12px; text-transform: uppercase; tracking-widest; color: #64748b;">BIRO KEMAHASISWAAN & LAYANAN ALUMNI, REKTORAT lantai 2</p>
              </td>
            </tr>
          </table>

          <hr style="border: 1px solid #0a3d62;" />

          <h3 style="text-align: center; margin: 30px 0 20px 0; letter-spacing: 1px; color: #0a3d62;">DAFTAR KEIKUTSERTAAN KEGIATAN & SEMINAR MAHASISWA</h3>

          <table style="width: 100%; margin-bottom: 40px; font-size: 14px;">
            <tr>
              <td style="width: 120px; padding: 4px 0; font-weight: bold;">Nama Mahasiswa</td>
              <td style="padding: 4px 0;">: ${student.name}</td>
              <td style="width: 100px; padding: 4px 0; font-weight: bold;">Program Studi</td>
              <td style="padding: 4px 0;">: ${student.department}</td>
            </tr>
            <tr>
              <td style="padding: 4px 0; font-weight: bold;">NIM</td>
              <td style="padding: 4px 0; font-family: monospace;">: ${student.nim}</td>
              <td style="padding: 4px 0; font-weight: bold;">Semester / Kelas</td>
              <td style="padding: 4px 0;">: ${student.semester} / Reguler</td>
            </tr>
            <tr>
              <td style="padding: 4px 0; font-weight: bold;">Status Akademik</td>
              <td style="padding: 4px 0; color: green; font-weight: bold;">: AKTIF</td>
              <td style="padding: 4px 0; font-weight: bold;">Tanggal Cetak</td>
              <td style="padding: 4px 0; font-family: monospace;">: ${new Date().toLocaleDateString('id-ID')}</td>
            </tr>
          </table>

          <table class="content-table" border="1" cellpadding="0" cellspacing="0" style="border: 1px solid #cbd5e1; border-collapse: collapse; width: 100%;">
            <thead>
              <tr>
                <th style="width: 40px; text-align: center;">No.</th>
                <th>Nama Kegiatan / Aktivitas</th>
                <th>Kategori Layanan</th>
                <th style="width: 140px; text-align: center;">Tgl Pengajuan</th>
                <th style="width: 140px; text-align: center;">Status Verifikasi</th>
              </tr>
            </thead>
            <tbody>
              ${rows.length > 0 ? rows : '<tr><td colspan="5" style="padding: 20px; text-align: center; color: #64748b;">Belum ada kegiatan yang terdaftar</td></tr>'}
            </tbody>
          </table>

          <div style="margin-top: 40px; display: flex; justify-content: space-between; align-items: flex-start;">
            <div>
              <div class="stamp">DOKUMEN SAH DIGITAL</div>
            </div>
            <div style="text-align: center; min-width: 250px;">
              <p style="margin: 0 0 70px 0; font-size: 14px;">Kepala Biro Kemahasiswaan UAB,</p>
              <p style="margin: 0; font-weight: bold; text-decoration: underline;">Dr. Ir. H. Mulyono, M.T.</p>
              <p style="margin: 2px 0 0 0; font-size: 12px; color: #64748b; font-family: monospace;">NIP. 197405122002121004</p>
            </div>
          </div>

          <div class="seal">
            Dokumen ini dicetak secara mandiri melalui Sistem Informasi Portal Kegiatan Mahasiswa Universitas Anak Bangsa (UAB Student Portal).<br />
            Semua data aktivitas yang berstatus terverifikasi telah disinkronisasikan ke sistem SIAKAD kampus secara sah.
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  // Status badge selector helper
  const getStatusBadge = (status: Registration['status']) => {
    switch (status) {
      case 'APPROVED':
        return (
          <span className="inline-flex items-center space-x-1.5 rounded-full bg-green-50 px-2.5 py-1 text-xs font-bold text-green-700 border border-green-200">
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>Terverifikasi</span>
          </span>
        );
      case 'PENDING':
        return (
          <span className="inline-flex items-center space-x-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-700 border border-amber-200">
            <Clock className="h-3.5 w-3.5" />
            <span>Menunggu Review</span>
          </span>
        );
      case 'REJECTED':
        return (
          <span className="inline-flex items-center space-x-1.5 rounded-full bg-rose-50 px-2.5 py-1 text-xs font-bold text-rose-700 border border-rose-200">
            <XCircle className="h-3.5 w-3.5" />
            <span>Ditolak</span>
          </span>
        );
    }
  };

  // Calculate scores
  const totalPointsApproved = studentRegistrations
    .filter(r => r.status === 'APPROVED')
    .reduce((sum, r) => {
      const act = activities.find(a => a.id === r.activityId);
      return sum + (act ? act.skpiPoints : 0);
    }, 0);

  const targetPoints = 35;
  const progressPercent = Math.min(Math.round((totalPointsApproved / targetPoints) * 100), 100);

  return (
    <div id="profile-container" className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Page Title Header */}
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-univ-blue-800 sm:text-3xl">
            Riwayat Pendaftaran & Kegiatan Saya
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Pantau status pendaftaran acara, riwayat keikutsertaan seminar, serta cetak sertifikat elektronik resmi Anda di sini.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Column 1: Identity Card & Live SKPI Progress Indicator */}
        <div className="lg:col-span-1 space-y-6">
          {/* Student Biodata Card */}
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="flex items-center space-x-4 border-b border-gray-100 pb-5">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-univ-blue-50 text-univ-blue-800 font-extrabold text-2xl border border-univ-blue-100">
                {student.name.substring(0, 2).toUpperCase()}
              </div>
              <div>
                <span className="inline-block rounded-full bg-univ-orange-100 px-2.5 py-0.5 text-[10px] font-bold text-univ-orange-700 uppercase">
                  S1 Reguler
                </span>
                <h3 className="text-lg font-bold text-gray-900 mt-1 leading-snug">{student.name}</h3>
                <p className="text-xs font-semibold text-gray-500">NIM: {student.nim}</p>
              </div>
            </div>

            <div className="space-y-4 pt-5 text-sm">
              <div className="flex items-start justify-between">
                <span className="text-gray-500 font-medium">Program Studi:</span>
                <span className="text-right font-semibold text-gray-900 max-w-[180px]">{student.department}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500 font-medium">Fakultas:</span>
                <span className="font-semibold text-gray-900">Teknik & Riset</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500 font-medium font-sans">Semester:</span>
                <span className="font-semibold text-gray-900 font-mono">{student.semester} (Genap)</span>
              </div>
              <div className="flex items-center justify-between border-t border-gray-55/65 pt-3">
                <span className="text-gray-500 font-medium flex items-center space-x-1.5">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span>Email:</span>
                </span>
                <span className="font-mono text-xs text-gray-600 truncate max-w-[180px]">{student.email}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500 font-medium flex items-center space-x-1.5">
                  <Key className="h-4 w-4 text-gray-400" />
                  <span>Status:</span>
                </span>
                <span className="inline-flex rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-bold text-green-700">Aktif</span>
              </div>
            </div>
          </div>
        </div>

        {/* Column 2: List of Registered Activities */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm min-h-[400px]">
            <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-4 mb-6">
              Riwayat Pengajuan kegiatan & Sertifikat ({studentRegistrations.length})
            </h3>

            {studentRegistrations.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <CalendarDays className="h-12 w-12 text-gray-300 mb-3" />
                <p className="text-base font-bold text-gray-700">Belum ada kegiatan yang terdaftar</p>
                <p className="text-xs text-gray-400 max-w-sm mt-1">
                  Anda belum pernah mengajukan pendaftaran kegiatan apapun. Jelajahi katalog kegiatan kampus untuk mendaftar.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {studentRegistrations.map((reg) => {
                  const activity = activities.find(a => a.id === reg.activityId);
                  const date = reg.registrationDate;

                  return (
                    <div 
                      key={reg.id} 
                      className="group overflow-hidden rounded-xl border border-gray-100 bg-slate-50 p-4 transition-all hover:bg-white hover:shadow-md hover:border-univ-blue-100"
                    >
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        
                        {/* Event summary details */}
                        <div className="space-y-1">
                          <span className="inline-flex items-center space-x-1 font-mono text-[10px] text-gray-500">
                            <span>ID Regis: {reg.id}</span>
                            <span>•</span>
                            <span>Tgl: {date}</span>
                          </span>
                          
                          <h4 
                            onClick={() => onViewActivityDetails(reg.activityId)}
                            className="text-base font-bold text-gray-900 hover:text-univ-blue-800 hover:underline cursor-pointer transition-all"
                          >
                            {reg.activityTitle}
                          </h4>
                          
                          <div className="flex flex-wrap gap-2 pt-1">
                            {activity && (
                              <span className="rounded bg-univ-blue-50 px-2 py-0.5 text-[11px] font-semibold text-univ-blue-700">
                                {activity.category}
                              </span>
                            )}
                            <span className="rounded bg-univ-orange-50 px-2 py-0.5 text-[11px] font-bold text-univ-orange-700">
                              E-Sertifikat Tersedia
                            </span>
                          </div>
                        </div>

                        {/* Verification details and actions */}
                        <div className="flex flex-col items-start gap-2.5 sm:items-end justify-between">
                          {getStatusBadge(reg.status)}
                          
                          {reg.status === 'APPROVED' ? (
                            <button
                              onClick={handlePrintTranscript}
                              className="text-xs font-bold text-univ-blue-700 hover:text-univ-blue-900 inline-flex items-center space-x-1 border border-univ-blue-100 rounded-lg px-2.5 py-1.5 bg-white shadow-sm hover:shadow"
                            >
                              <Printer className="h-3.5 w-3.5" />
                              <span>Cetak Sertifikat</span>
                            </button>
                          ) : reg.status === 'PENDING' ? (
                            <p className="text-[11px] text-gray-500 italic">Berkas KTM di-upload: {reg.uploadedKtmUrl}</p>
                          ) : (
                            <p className="text-[11px] text-rose-500 font-medium">Batas pendaftaran / syarat tidak terpenuhi</p>
                          )}
                        </div>

                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

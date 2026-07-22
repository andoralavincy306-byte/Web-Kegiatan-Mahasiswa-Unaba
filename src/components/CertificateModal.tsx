import React, { useRef, useState } from 'react';
import { Award, Download, Printer, X, CheckCircle2, ShieldCheck, FileCheck2, Sparkles } from 'lucide-react';

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentName: string;
  studentNim: string;
  studentDepartment: string;
  studentFaculty?: string;
  activityTitle: string;
  activityCategory?: string;
  eventDate?: string;
  location?: string;
  registrationId?: string;
  skpiPoints?: number;
  hasCertificate?: boolean;
  plhRektorName?: string;
  certificateSignerName?: string;
  certificateSignerRole?: string;
}

export default function CertificateModal({
  isOpen,
  onClose,
  studentName,
  studentNim,
  studentDepartment,
  studentFaculty,
  activityTitle,
  activityCategory = 'Aktivitas Kemahasiswaan',
  eventDate = '2026',
  location = 'Kampus Universitas Anak Bangsa',
  registrationId = 'REG-UNABA-2026',
  skpiPoints = 10,
  hasCertificate = true,
  plhRektorName = 'Dr. Ir. H. Mulyono, M.T.',
  certificateSignerName,
  certificateSignerRole
}: CertificateModalProps) {
  const [isGeneratingPng, setIsGeneratingPng] = useState(false);
  const certRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const signerName = certificateSignerName || plhRektorName;
  const signerRole = certificateSignerRole || 'PLH Rektor Universitas Anak Bangsa';
  const certNumber = `UNABA/CERT/2026/${registrationId.replace(/[^a-zA-Z0-9]/g, '').slice(-8).toUpperCase()}`;

  const formattedDate = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  // Helper to draw wrapped text on Canvas cleanly
  const drawCanvasWrappedText = (
    ctx: CanvasRenderingContext2D,
    text: string,
    x: number,
    startY: number,
    maxWidth: number,
    lineHeight: number
  ): number => {
    const words = text.split(' ');
    let line = '';
    let currentY = startY;

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && n > 0) {
        ctx.fillText(line.trim(), x, currentY);
        line = words[n] + ' ';
        currentY += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line.trim(), x, currentY);
    return currentY;
  };

  // Handle PNG Image Download via Canvas drawing
  const handleDownloadPng = () => {
    setIsGeneratingPng(true);
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 1600;
      canvas.height = 1130;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        alert('Browser Anda tidak mendukung ekspor gambar canvas.');
        setIsGeneratingPng(false);
        return;
      }

      // Clean White Background
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Subtle background pattern
      ctx.fillStyle = '#F8FAFC';
      for (let i = 0; i < canvas.width; i += 80) {
        for (let j = 0; j < canvas.height; j += 80) {
          ctx.beginPath();
          ctx.arc(i, j, 1.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Outer gold double border
      ctx.lineWidth = 16;
      ctx.strokeStyle = '#D4AF37';
      ctx.strokeRect(32, 32, canvas.width - 64, canvas.height - 64);

      // Inner navy border
      ctx.lineWidth = 3;
      ctx.strokeStyle = '#002D62';
      ctx.strokeRect(52, 52, canvas.width - 104, canvas.height - 104);

      // Header Text
      ctx.textAlign = 'center';

      // University
      ctx.font = 'bold 34px serif';
      ctx.fillStyle = '#002D62';
      ctx.fillText('UNIVERSITAS ANAK BANGSA', canvas.width / 2, 125);

      ctx.font = 'bold 17px sans-serif';
      ctx.fillStyle = '#64748B';
      ctx.fillText('BIRO KEMAHASISWAAN & ALUMNI (BKA UNABA)', canvas.width / 2, 160);

      // Decorative Line
      ctx.beginPath();
      ctx.moveTo(canvas.width / 2 - 160, 182);
      ctx.lineTo(canvas.width / 2 + 160, 182);
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = '#D4AF37';
      ctx.stroke();

      // Certificate Title
      ctx.font = 'bold 44px serif';
      ctx.fillStyle = '#FF7F3F';
      ctx.fillText('SERTIFIKAT ELEKTRONIK', canvas.width / 2, 245);

      ctx.font = 'italic 19px serif';
      ctx.fillStyle = '#475569';
      ctx.fillText(`Nomor: ${certNumber}`, canvas.width / 2, 280);

      ctx.font = '19px sans-serif';
      ctx.fillStyle = '#334155';
      ctx.fillText('Diberikan penghargaan setinggi-tingginya kepada:', canvas.width / 2, 330);

      // Student Name with responsive font sizing
      const nameFontSize = studentName.length > 25 ? 40 : 48;
      ctx.font = `bold ${nameFontSize}px serif`;
      ctx.fillStyle = '#002D62';
      ctx.fillText(studentName, canvas.width / 2, 395);

      // Underline student name
      const nameWidth = ctx.measureText(studentName).width;
      ctx.beginPath();
      ctx.moveTo(canvas.width / 2 - nameWidth / 2, 410);
      ctx.lineTo(canvas.width / 2 + nameWidth / 2, 410);
      ctx.lineWidth = 3;
      ctx.strokeStyle = '#D4AF37';
      ctx.stroke();

      // Student Details
      ctx.font = 'bold 20px monospace';
      ctx.fillStyle = '#475569';
      ctx.fillText(`NIM: ${studentNim}  •  PRODI: ${studentDepartment}`, canvas.width / 2, 452);

      // Participation Description
      ctx.font = '19px sans-serif';
      ctx.fillStyle = '#334155';
      ctx.fillText('Atas partisipasi aktif dan kelulusan verifikasi resmi dalam kegiatan:', canvas.width / 2, 505);

      // Activity Title (Wrapped safely)
      ctx.font = 'bold 26px sans-serif';
      ctx.fillStyle = '#002D62';
      const titleLastY = drawCanvasWrappedText(
        ctx,
        `"${activityTitle}"`,
        canvas.width / 2,
        550,
        1250,
        36
      );

      ctx.font = '18px sans-serif';
      ctx.fillStyle = '#64748B';
      ctx.fillText(`Kategori: ${activityCategory}  |  Lokasi: ${location}`, canvas.width / 2, titleLastY + 40);
      ctx.fillText(`Dilaksanakan pada: ${eventDate}`, canvas.width / 2, titleLastY + 68);

      // Signatures & Stamp Section (Anchored to bottom to prevent overlap)
      const sigSectionTop = Math.max(titleLastY + 120, 810);

      // Stamp Box (Left)
      ctx.save();
      ctx.translate(220, sigSectionTop + 50);
      ctx.rotate((-4 * Math.PI) / 180);
      ctx.strokeStyle = '#FF7F3F';
      ctx.lineWidth = 2.5;
      ctx.strokeRect(-110, -32, 220, 64);
      ctx.font = 'bold 16px sans-serif';
      ctx.fillStyle = '#FF7F3F';
      ctx.fillText('VERIFIED E-SIGNATURE', 0, -4);
      ctx.font = '11px monospace';
      ctx.fillText('UNABA OFFICIAL STAMP', 0, 16);
      ctx.restore();

      // Signer Box (Right)
      ctx.font = 'bold 19px sans-serif';
      ctx.fillStyle = '#475569';
      ctx.fillText('Jakarta, ' + formattedDate, canvas.width - 320, sigSectionTop);
      ctx.fillText(signerRole + ',', canvas.width - 320, sigSectionTop + 30);

      ctx.font = 'bold 23px serif';
      ctx.fillStyle = '#002D62';
      ctx.fillText(signerName, canvas.width - 320, sigSectionTop + 115);

      const signerWidth = ctx.measureText(signerName).width;
      ctx.beginPath();
      ctx.moveTo(canvas.width - 320 - signerWidth / 2, sigSectionTop + 125);
      ctx.lineTo(canvas.width - 320 + signerWidth / 2, sigSectionTop + 125);
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#002D62';
      ctx.stroke();

      ctx.font = '14px monospace';
      ctx.fillStyle = '#64748B';
      ctx.fillText('NIP. 196908181995031002', canvas.width - 320, sigSectionTop + 148);

      // Footer Note
      ctx.font = '13px monospace';
      ctx.fillStyle = '#94A3B8';
      ctx.fillText(`Dokumen E-Sertifikat Resmi Terverifikasi Sistem SIAKAD UNABA  •  ID Registrasi: ${registrationId}`, canvas.width / 2, canvas.height - 40);

      // Convert to image and download
      const imageUri = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      const safeStudentName = studentName.replace(/[^a-zA-Z0-9]/g, '_');
      const safeActivityTitle = activityTitle.slice(0, 20).replace(/[^a-zA-Z0-9]/g, '_');
      downloadLink.download = `Sertifikat_${safeStudentName}_${safeActivityTitle}.png`;
      downloadLink.href = imageUri;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);

      setIsGeneratingPng(false);
    } catch (err) {
      console.error('Error generating PNG:', err);
      alert('Terjadi kendala saat mengunduh gambar sertifikat.');
      setIsGeneratingPng(false);
    }
  };

  // Handle Printable PDF
  const handlePrintPdf = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Gagal membuka jendela cetak. Pastikan pop-up diperbolehkan di browser Anda.');
      return;
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Sertifikat - ${studentName} - ${activityTitle}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600;800&family=Playfair+Display:ital,wght@0,600;0,800;1,500&family=Inter:wght@400;600;700&display=swap');
            @page {
              size: A4 landscape;
              margin: 0;
            }
            body { 
              margin: 0; 
              padding: 0; 
              font-family: 'Inter', sans-serif; 
              color: #1e293b; 
              background-color: #ffffff;
              display: flex;
              justify-content: center;
              align-items: center;
              min-height: 100vh;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            .cert-container { 
              width: 1020px; 
              height: 700px; 
              padding: 45px; 
              box-sizing: border-box;
              border: 18px double #d4af37; 
              background: #ffffff;
              background-image: radial-gradient(#f1f5f9 1.5px, transparent 1.5px), radial-gradient(#f1f5f9 1.5px, #ffffff 1.5px);
              background-size: 60px 60px;
              background-position: 0 0, 30px 30px;
              position: relative;
              display: flex;
              flex-direction: column;
              justify-content: space-between;
            }
            .inner-border {
              position: absolute;
              top: 12px;
              left: 12px;
              right: 12px;
              bottom: 12px;
              border: 2px solid #002d62;
              pointer-events: none;
            }
            .header { text-align: center; margin-top: 5px; }
            .univ-title { 
              font-family: 'Cinzel', serif; 
              color: #002d62; 
              font-size: 22px; 
              font-weight: 850;
              letter-spacing: 2px;
              margin: 0;
            }
            .univ-sub { 
              font-size: 10px; 
              letter-spacing: 3px; 
              color: #64748b; 
              margin: 4px 0 10px 0;
              text-transform: uppercase;
              font-weight: 700;
            }
            .cert-title { 
              font-family: 'Playfair Display', serif; 
              color: #ff7f3f; 
              font-size: 32px; 
              font-weight: 800;
              margin: 6px 0 2px 0;
              letter-spacing: 1px;
            }
            .cert-number {
              font-family: monospace;
              font-size: 12px;
              color: #64748b;
              margin: 0 0 10px 0;
            }
            .student-name { 
              font-family: 'Playfair Display', serif; 
              font-size: 30px; 
              font-weight: 800; 
              color: #002d62; 
              margin: 10px 0 0 0;
              text-decoration: underline;
              text-underline-offset: 6px;
              text-decoration-color: #d4af37;
            }
            .student-nim { 
              font-family: monospace; 
              font-size: 13px; 
              color: #475569; 
              margin: 6px 0 14px 0;
              font-weight: 700;
            }
            .participation-text { 
              font-size: 13px; 
              color: #475569; 
              max-width: 760px; 
              margin: 0 auto; 
              line-height: 1.5;
              text-align: center;
            }
            .activity-title { 
              font-size: 17px; 
              font-weight: 800; 
              color: #002d62; 
              margin: 6px auto;
              padding: 4px 12px;
              background: #f8fafc;
              border: 1px solid #e2e8f0;
              border-radius: 6px;
              display: inline-block;
              max-width: 720px;
            }
            .footer-sig { 
              margin-top: 20px; 
              display: flex; 
              justify-content: space-between; 
              align-items: flex-end;
              padding: 0 40px;
            }
            .stamp-box { 
              border: 2px dashed #ff7f3f; 
              color: #ff7f3f; 
              padding: 6px 14px; 
              font-size: 11px; 
              font-weight: 800; 
              text-transform: uppercase;
              transform: rotate(-4deg); 
            }
            .signer { text-align: center; min-width: 240px; }
            .signer-role-p {
              margin: 0 0 35px 0; 
              font-size: 12px; 
              font-weight: 600; 
              color: #475569;
              line-height: 1.3;
            }
            .printed-time {
              font-family: monospace;
              font-size: 10px;
              color: #94a3b8;
              text-align: center;
              margin-top: 15px;
            }
          </style>
        </head>
        <body>
          <div class="cert-container">
            <div class="inner-border"></div>
            
            <div class="header">
              <p class="univ-title">UNIVERSITAS ANAK BANGSA</p>
              <p class="univ-sub">Biro Kegiatan Mahasiswa & Alumni (BKA)</p>
              <hr style="width: 180px; border: 1px solid #d4af37; margin: 0 auto 15px auto;" />
              <h2 class="cert-title">SERTIFIKAT ELEKTRONIK</h2>
              <p class="cert-number">Nomor: ${certNumber}</p>
              <p style="font-size: 14px; color: #475569; margin: 0;">Diberikan penghargaan setinggi-tingginya kepada:</p>
              
              <h3 class="student-name">${studentName}</h3>
              <p class="student-nim">NIM: ${studentNim} • Program Studi: ${studentDepartment}</p>
            </div>

            <p class="participation-text">
              Atas partisipasi aktif, dedikasi, serta kelulusan verifikasi resmi dalam menyukseskan program:<br />
              <strong class="activity-title">"${activityTitle}"</strong>
              <span>Kategori: ${activityCategory} | Lokasi: ${location}</span><br />
              <span>Tanggal Pelaksanaan: ${eventDate}</span>
            </p>

            <div class="footer-sig">
              <div>
                <div class="stamp-box">VERIFIED E-SIGNATURE</div>
                <div style="font-size: 11px; color: #64748b; margin-top: 6px; font-weight: 600; font-family: monospace;">ID Regis: ${registrationId}</div>
              </div>
              
              <div class="signer">
                <p class="signer-role-p">Jakarta, ${formattedDate}<br/>${signerRole},</p>
                <p style="margin: 0; font-weight: 800; font-size: 16px; text-decoration: underline; color: #002d62;">${signerName}</p>
                <p style="margin: 2px 0 0 0; font-size: 11px; color: #64748b; font-family: monospace;">NIP. 196908181995031002</p>
              </div>
            </div>

            <div class="printed-time">
              Dokumen Resmi Terverifikasi Otomatis Melalui Sistem Informasi Kemahasiswaan UNABA
            </div>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 250);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-md p-3 sm:p-6 overflow-y-auto">
      <div className="relative w-full max-w-5xl rounded-3xl bg-white shadow-2xl overflow-hidden border border-slate-100 flex flex-col my-auto max-h-[92vh]">
        
        {/* Top Header Controls */}
        <div className="bg-slate-900 text-white px-5 py-4 flex flex-wrap items-center justify-between gap-3 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Award className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-extrabold text-white tracking-tight">E-Sertifikat Resmi UNABA</h3>
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <ShieldCheck className="h-3 w-3" />
                  <span>Otomatis Sesuai Nama Mahasiswa</span>
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Mahasiswa: <strong className="text-amber-300">{studentName}</strong> ({studentNim})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadPng}
              disabled={isGeneratingPng}
              className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-univ-orange-500 hover:bg-univ-orange-600 text-white font-bold text-xs shadow-md transition-all cursor-pointer disabled:opacity-50"
            >
              <Download className="h-4 w-4" />
              <span>{isGeneratingPng ? 'Mengunduh...' : 'Unduh Gambar (PNG)'}</span>
            </button>

            <button
              onClick={handlePrintPdf}
              className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-univ-blue-600 hover:bg-univ-blue-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
            >
              <Printer className="h-4 w-4" />
              <span>Cetak / Simpan PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer ml-1"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Certificate Display Area */}
        <div className="p-4 sm:p-8 bg-slate-100 overflow-x-auto flex justify-center items-center">
          <div 
            ref={certRef}
            className="w-[880px] min-w-[880px] min-h-[620px] p-6 sm:p-7 box-border border-[14px] border-double border-[#D4AF37] bg-white relative shadow-xl flex flex-col justify-between text-slate-800 rounded-sm"
          >
            {/* Inner Border */}
            <div className="absolute inset-2 border-2 border-[#002D62] pointer-events-none" />

            {/* Header */}
            <div className="text-center relative z-10 space-y-0.5">
              <div className="flex items-center justify-center space-x-2 text-univ-blue-900 font-serif font-extrabold text-lg tracking-widest uppercase">
                <Sparkles className="h-4 w-4 text-amber-500" />
                <span>UNIVERSITAS ANAK BANGSA</span>
                <Sparkles className="h-4 w-4 text-amber-500" />
              </div>
              <p className="text-[10px] tracking-[2.5px] text-slate-500 uppercase font-bold">
                Biro Kemahasiswaan & Alumni (BKA UNABA)
              </p>
              <hr className="w-32 border-t border-[#D4AF37] mx-auto my-1.5" />
              
              <h2 className="font-serif text-2xl font-black text-univ-orange-600 tracking-wide">
                SERTIFIKAT ELEKTRONIK
              </h2>
              <p className="font-mono text-[11px] text-slate-500 font-bold">
                Nomor: {certNumber}
              </p>
              <p className="font-serif italic text-xs text-slate-600 mt-1">
                Diberikan penghargaan setinggi-tingginya kepada:
              </p>

              {/* Student Name */}
              <h1 className="font-serif text-2xl sm:text-3xl font-black text-univ-blue-900 my-1.5 underline decoration-[#D4AF37] decoration-2 underline-offset-4 inline-block px-2">
                {studentName}
              </h1>
              <p className="font-mono text-xs text-slate-600 font-bold">
                NIM: {studentNim} &bull; Program Studi: {studentDepartment}
              </p>
            </div>

            {/* Description */}
            <div className="text-center text-xs text-slate-600 max-w-xl mx-auto space-y-1 leading-snug relative z-10 my-1.5">
              <p className="text-[11px]">
                Atas partisipasi aktif, dedikasi, serta kelulusan verifikasi berkas resmi dalam menyukseskan program:
              </p>
              <div className="my-1 px-4 py-1.5 bg-slate-50/90 rounded-lg border border-slate-200 inline-block max-w-lg">
                <p className="text-sm font-extrabold text-univ-blue-900 leading-snug">
                  "{activityTitle}"
                </p>
              </div>
              <p className="text-[10px] text-slate-500 font-medium">
                Kategori: <span className="font-bold text-slate-700">{activityCategory}</span> | Lokasi: <span className="font-bold text-slate-700">{location}</span> | Tanggal: <span className="font-bold text-slate-700">{eventDate}</span>
              </p>
            </div>

            {/* Footer Signatures */}
            <div className="flex items-end justify-between px-6 mb-1 relative z-10">
              <div>
                <div className="border-2 border-dashed border-univ-orange-500 text-univ-orange-600 px-3 py-1 text-[10px] font-black tracking-wider uppercase -rotate-3 rounded-sm shadow-sm">
                  VERIFIED E-SIGNATURE
                </div>
                <div className="text-[9px] text-slate-500 font-mono mt-1 font-bold">
                  ID Registrasi: {registrationId}
                </div>
              </div>

              <div className="text-center min-w-[200px]">
                <p className="text-[11px] font-semibold text-slate-600 mb-8 leading-tight">
                  Jakarta, {formattedDate}<br />
                  {signerRole},
                </p>
                <p className="font-serif font-bold text-xs text-univ-blue-900 underline">
                  {signerName}
                </p>
                <p className="font-mono text-[9px] text-slate-500 mt-0.5">
                  NIP. 196908181995031002
                </p>
              </div>
            </div>

            {/* Footer Verification Notice */}
            <div className="text-[9px] font-mono text-slate-400 text-center relative z-10 border-t border-slate-100 pt-1">
              Dokumen resmi elektronik ditarik realtime melalui Sistem Informasi Portal Kegiatan Mahasiswa UNABA
            </div>
          </div>
        </div>

        {/* Bottom Banner Info */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex flex-wrap items-center justify-between text-xs text-slate-600">
          <div className="flex items-center space-x-2">
            <FileCheck2 className="h-4 w-4 text-emerald-600" />
            <span>Sertifikat ini secara otomatis mencantumkan nama mahasiswa <strong>{studentName}</strong> dan terhubung dengan basis data SIAKAD.</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg border border-slate-300 font-bold text-slate-700 hover:bg-slate-200 transition-all cursor-pointer"
          >
            Tutup Pratinjau
          </button>
        </div>

      </div>
    </div>
  );
}

import { Activity, ActivityCategory, ActivityStatus, StudentProfile, Registration } from './types';

export const INITIAL_ACTIVITIES: Activity[] = [
  {
    id: 'act-1',
    title: 'Latihan Kepemimpinan Manajemen Mahasiswa (LKMM-TD) 2026',
    description: 'Pelatihan dasar kepemimpinan dan manajemen organisasi untuk membekali mahasiswa UAB menjadi pemimpin masa depan yang berintegritas.',
    longDescription: 'Latihan Kepemimpinan Manajemen Mahasiswa Tingkat Dasar (LKMM-TD) merupakan program wajib bagi fungsionaris organisasi mahasiswa dan sangat disarankan untuk seluruh mahasiswa aktif Universitas Anak Bangsa. Program ini dirancang khusus untuk membekali mahasiswa dengan kemampuan kepemimpinan, manajemen organisasi, penyusunan rencana kerja, serta pengambilan keputusan strategis secara etis dan profesional di lingkungan kampus maupun masyarakat luas.',
    category: ActivityCategory.ORGANIZATION,
    status: ActivityStatus.OPEN,
    skpiPoints: 15,
    imageUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800&h=450',
    registrationDeadline: '2026-07-10',
    eventDate: '2026-07-15 s/d 2026-07-17',
    quota: 120,
    registeredCount: 84,
    location: 'Auditorium Gd. Rektorat Lt. 3, Kampus Jakarta',
    benefits: [
      'Sertifikat Resmi Kelulusan Terakreditasi (Kemahasiswaan)',
      'Modul Kepemimpinan & Manajemen Organisasi',
      'Makan Siang & Coffee Break selama 3 Hari',
      'Networking dengan Jajaran Pemimpin Organisasi Kampus',
      'Portofolio Kepemimpinan Terverifikasi'
    ],
    requirements: [
      'Mahasiswa aktif Universitas Anak Bangsa (Semester 2 - 6)',
      'Melampirkan Curriculum Vitae (CV) singkat',
      'Melampirkan Kartu Tanda Mahasiswa (KTM) aktif',
      'Berkomitmen mengikuti seluruh rangkaian acara secara penuh'
    ],
    contactPerson: {
      name: 'Aditya Herlambang',
      phone: '0812-3456-7890'
    }
  },
  {
    id: 'act-2',
    title: 'UAB Badminton Campus Cup XI',
    description: 'Turnamen bulutangkis antar jurusan se-Universitas Anak Bangsa untuk menyalurkan minat, bakat, serta sportivitas antar mahasiswa.',
    longDescription: 'Ajang bergengsi olahraga tahunan Universitas Anak Bangsa kembali hadir! UAB Badminton Campus Cup ke-11 memperlombakan kategori Tunggal Putra, Tunggal Putri, Ganda Putra, Ganda Putri, dan Ganda Campuran. Tunjukkan sportivitas, pertahankan kehormatan jurusanmu, dan raih total hadiah puluhan juta rupiah serta piala bergilir Rektor UAB.',
    category: ActivityCategory.SPORTS,
    status: ActivityStatus.OPEN,
    skpiPoints: 10,
    imageUrl: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&q=80&w=800&h=450',
    registrationDeadline: '2026-06-30',
    eventDate: '2026-07-05 s/d 2026-07-09',
    quota: 64,
    registeredCount: 42,
    location: 'Gedung Olahraga (GOR) Tri Dharma UAB, Kampus Depok',
    benefits: [
      'Sertifikat Kepesertaan Nasional / Universitas',
      'Piala, Medali, dan Uang Pembinaan untuk Juara 1, 2, & 3',
      'Snack, Isotonik, & Jersey Resmi Turnamen',
      'Sertifikat Keikutsertaan Bidang Non-Akademik'
    ],
    requirements: [
      'Mahasiswa aktif Universitas Anak Bangsa dari semua program studi',
      'Membayar biaya komitmen pendaftaran sebesar Rp 50.000 (akan dikembalikan)',
      'Menyerahkan pas foto digital berkemeja',
      'Melampirkan KTM dan Surat Bebas Masalah Jantung / Kesehatan'
    ],
    contactPerson: {
      name: 'Dewi Lestari',
      phone: '0857-1122-3344'
    }
  },
  {
    id: 'act-3',
    title: 'Kuliah Kerja Nyata (KKN) Tematik Tanggap Bencana & Sanitasi',
    description: 'Aksi nyata pengabdian mahasiswa dalam mengedukasi mitigasi bencana alam dan membangun infrastruktur sanitasi di Desa Sukamulya.',
    longDescription: 'KKN Tematik ini merupakan wujud nyata Tridharma Perguruan Tinggi dalam pengabdian kepada masyarakat. Mahasiswa dari berbagai disiplin ilmu akan bekerja sama selama 1 bulan penuh di lokasi sasaran untuk melaksanakan program peningkatan kesadaran tanggap bencana, pembangunan modul sanitasi air bersih murni, serta mengajar di sekolah alam dasar setempat.',
    category: ActivityCategory.COMMUNITY,
    status: ActivityStatus.UPCOMING,
    skpiPoints: 25,
    imageUrl: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=800&h=450',
    registrationDeadline: '2026-07-25',
    eventDate: '2026-08-01 s/d 2026-08-31',
    quota: 80,
    registeredCount: 0,
    location: 'Kecamatan Caringin, Kabupaten Bogor, Jawa Barat',
    benefits: [
      'Konversi SKS Kuliah Pengabdian Masyarakat (Sesuai regulasi prodi)',
      'Sertifikat KKN Tematik Skala Universitas',
      'Uang Saku Transportasi & Seragam Atribut KKN Mandiri',
      'Pendidikan Karakter & Pengendalian Masalah Sosial Lapangan',
      'Relasi Hangat bersama Pejabat Daerah & Masyarakat Binaan'
    ],
    requirements: [
      'Mahasiswa UAB Aktif minimal Semester 5',
      'IPK minimal 3.00 pada portal akademik',
      'Surat persetujuan dari Orang Tua / Wali (Ttd & bermaterai Rp 10.000)',
      'Lolos seleksi berkas administrasi dan wawancara internal tim dosen pembimbing'
    ],
    contactPerson: {
      name: 'Dosen Koordinator KKN',
      phone: '0813-9090-8080'
    }
  },
  {
    id: 'act-4',
    title: 'Festival Teater Nusantara & Parade Seni Mahasiswa XXIV',
    description: 'Pergelaran ekspresi teater, musik tradisional, seni tari, dan diskusi kebudayaan terbesar oleh Unit Kegiatan Mahasiswa (UKM) Kesenian.',
    longDescription: 'Kembali menyapa pencinta estetika! Festival Teater Nusantara sampaikan pementasan teatrikal luar biasa berdurasi 3 malam bertema "Metamorfosa Nusantara di Era Digital". Nikmati karya kolaboratif dari para seniman muda berbakat se-Indonesia, didukung oleh pameran instalasi seni rupa orisinal di galeri seni kampus.',
    category: ActivityCategory.ARTS,
    status: ActivityStatus.ONGOING,
    skpiPoints: 10,
    imageUrl: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?auto=format&fit=crop&q=80&w=800&h=450',
    registrationDeadline: '2026-06-15',
    eventDate: '2026-06-18 s/d 2026-06-20',
    quota: 300,
    registeredCount: 300,
    location: 'Teater Terbuka & Galeri Seni UAB, Kampus Jakarta',
    benefits: [
      'Apresiasi Karakter Bidang Kesenian & Budaya',
      'Akses Masuk Gratis untuk Seluruh Penonton Mahasiswa',
      'Merchandise Eksklusif (Pin, Totebag, Sticker)',
      'Relasi dengan Maestro Seni Nasional yang hadir sebagai narasumber diskusi'
    ],
    requirements: [
      'Terbuka untuk Umum & Seluruh Mahasiswa Aktif',
      'Wajib membawa Kartu Mahasiswa (KTM) fisik guna verifikasi kehadiran tiket gratis',
      'Mematuhi protokol tata tertib keamanan & ketertiban Auditorium Teater'
    ],
    contactPerson: {
      name: 'Humas UKM Kesenian UAB',
      phone: '0899-7777-6666'
    }
  },
  {
    id: 'act-5',
    title: 'Lomba Karya Tulis Ilmiah Nasional (LKTIN) Anak Bangsa 2026',
    description: 'Ajang kompetisi riset dan inovasi keilmuan nasional dalam menciptakan solusi cerdas bagi pembangunan berkelanjutan di Indonesia.',
    longDescription: 'LKTIN Anak Bangsa mengundang mahasiswa kreatif dari seluruh penjuru Indonesia untuk mengirimkan gagasan visioner, hasil riset teoretis, dan rancangan fisik berdayaguna yang berfokus pada transisi energi hijau, ketahanan pangan tangguh, serta transformasi pendidikan digital.',
    category: ActivityCategory.ACADEMIC,
    status: ActivityStatus.OPEN,
    skpiPoints: 15,
    imageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=800&h=450',
    registrationDeadline: '2026-07-05',
    eventDate: '2026-07-22 s/d 2026-07-24 (Presentasi Finalis)',
    quota: 150,
    registeredCount: 68,
    location: 'Gedung Sinergi Riset Lantai Dasar, Kampus Depok',
    benefits: [
      'Sertifikat Finalis / Juara Nasional dari Rektorat UAB',
      'Total Hadiah Juara Rp 25.000.000 + Plakat Penghargaan',
      'Prosiding Ber-ISSN untuk Abstrak yang Layak Publikasi',
      'Sertifikat Prestasi Kategori Lomba Keilmuan'
    ],
    requirements: [
      'Mahasiswa aktif D3/D4/S1 terdaftar di Pangkalan Data Pendidikan Tinggi',
      'Satu tim terdiri dari maksimal 3 orang',
      'Mengirimkan naskah karya tulis lengkap sesuai template format resmi',
      'Surat Orisinalitas bermaterai untuk menjamin karya bebas plagiasi'
    ],
    contactPerson: {
      name: 'Fakultas Teknik & Riset UAB',
      phone: '0812-9988-7766'
    }
  },
  {
    id: 'act-6',
    title: 'Seminar Nasional AI & Transformasi Kebijakan Publik Indonesia',
    description: 'Diskusi panel interaktif bersama pakar teknologi AI, menteri komunikasi, dan akademisi senior mengenai regulasi etika AI.',
    longDescription: 'Seminar akbar akhir tahun ajaran ini mengangkat diskursus regulasi kecerdasan buatan (Artificial Intelligence) dari kacamata kemitraan sosial serta implikasinya terhadap tenaga kerja muda di tanah air. Menghadirkan keynote speaker nasional yang siap mengupas tuntas roadmap AI Indonesia 2025-2045.',
    category: ActivityCategory.ACADEMIC,
    status: ActivityStatus.COMPLETED,
    skpiPoints: 5,
    imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=800&h=450',
    registrationDeadline: '2026-05-10',
    eventDate: '2026-05-15',
    quota: 500,
    registeredCount: 500,
    location: 'Virtual via Zoom Webinar & Live YouTube Humas UAB',
    benefits: [
      'E-Sertifikat Kehadiran Peserta Terverifikasi Instan',
      'Materi Paparan Slide Lengkap dari Pembicara Berpengaruh',
      'Ilmu dan Wawasan Masa Depan Menghadapi AI',
      'Sertifikat Elektronik Seminar Akademik Terpadu'
    ],
    requirements: [
      'Telah mendaftar akun portal mahasiswa UAB',
      'Mengisi kuesioner evaluasi acara sebelum sertifikat dirilis'
    ],
    contactPerson: {
      name: 'Biro Admin Akademik UAB',
      phone: '0821-2233-4455'
    }
  }
];

export const INITIAL_STUDENT: StudentProfile = {
  name: 'Andora Lavincy',
  nim: '10123045',
  email: 'andora.lavincy@student.uab.ac.id',
  department: 'Sistem Informasi',
  semester: 2,
  skpiPointsAccumulated: 0,
  registeredActivityIds: [],
  faculty: 'Fakultas Sains dan Teknik'
};

export const INITIAL_REGISTRATIONS: Registration[] = [
  {
    id: 'reg-mock-3',
    activityId: 'act-2',
    activityTitle: 'UAB Badminton Campus Cup XI',
    studentName: 'Siti Rahmawati',
    studentNim: '10123180',
    studentEmail: 'siti.rahma@student.uab.ac.id',
    studentPhone: '0857-8899-7766',
    studentDepartment: 'Kesehatan Masyarakat',
    studentSemester: 4,
    uploadedKtmUrl: 'ktm_siti_rahma.jpg',
    registrationDate: '2026-06-19 08:30',
    status: 'PENDING'
  }
];

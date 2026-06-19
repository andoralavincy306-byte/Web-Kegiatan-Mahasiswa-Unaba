export enum ActivityCategory {
  SPORTS = 'Olahraga & Kesehatan',
  ARTS = 'Seni & Budaya',
  ACADEMIC = 'Penalaran & Keilmuan',
  COMMUNITY = 'Pengabdian Masyarakat',
  ORGANIZATION = 'Kepemimpinan & Organisasi',
}

export enum ActivityStatus {
  OPEN = 'Pendaftaran Buka',
  UPCOMING = 'Segera Hadir',
  CLOSED = 'Pendaftaran Tutup',
  ONGOING = 'Sedang Berjalan',
  COMPLETED = 'Selesai',
}

export interface Activity {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  category: ActivityCategory;
  status: ActivityStatus;
  skpiPoints: number;
  imageUrl: string;
  registrationDeadline: string;
  eventDate: string;
  quota: number;
  registeredCount: number;
  location: string;
  benefits: string[];
  requirements: string[];
  contactPerson: {
    name: string;
    phone: string;
  };
}

export interface Registration {
  id: string;
  activityId: string;
  activityTitle: string;
  studentName: string;
  studentNim: string; // Nomor Induk Mahasiswa
  studentEmail: string;
  studentPhone: string;
  studentDepartment: string;
  studentSemester: number;
  uploadedKtmUrl: string; // Mock URL or filename
  registrationDate: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
}

export interface StudentProfile {
  name: string;
  nim: string;
  email: string;
  department: string;
  semester: number;
  skpiPointsAccumulated: number;
  registeredActivityIds: string[];
  faculty?: string;
}

export type PageType = 'HOME' | 'PROFILE' | 'ACTIVITIES' | 'DETAILS' | 'REGISTRATION' | 'ADMIN';

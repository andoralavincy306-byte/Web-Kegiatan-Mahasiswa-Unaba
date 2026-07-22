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
  certificateUploaded?: boolean;
  certificateTemplateUrl?: string;
  hasCertificate?: boolean; // Option whether certificate is provided for this activity
  certificateSignerName?: string;
  certificateSignerRole?: string;
  allowCertificateDownload?: boolean; // Option whether students are allowed to download the certificate
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
  studentFaculty?: string;
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

export function isEventDatePassed(eventDateStr: string): boolean {
  if (!eventDateStr) return false;
  const dateRegex = /\d{4}-\d{2}-\d{2}/g;
  const matches = eventDateStr.match(dateRegex);
  if (!matches || matches.length === 0) {
    return false;
  }
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const dates = matches.map(d => new Date(d));
  const maxDate = new Date(Math.max(...dates.map(d => d.getTime())));
  maxDate.setHours(23, 59, 59, 999);
  
  return today.getTime() > maxDate.getTime();
}

export function isActivityArchived(act: { registrationDeadline: string; eventDate: string }): boolean {
  if (!act) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const deadlineDate = new Date(act.registrationDeadline);
  const isPastDeadline = deadlineDate.getTime() < today.getTime();
  return isPastDeadline || isEventDatePassed(act.eventDate);
}


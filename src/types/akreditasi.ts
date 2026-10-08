export type CapaianRubrik = 'Kurang' | 'Cukup Baik' | 'Baik' | 'Sangat Baik';

export type StatusVerifikasi = 'Belum Diunggah' | 'Draf' | 'Perlu Perbaikan' | 'Terverifikasi Valid';

export type StatusBuktiFisik = 'Tersedia' | 'Dalam Proses' | 'Belum Ada';

export type UserRole = 'Admin' | 'Asesi' | 'Validator' | 'Viewer';

export interface UserProfile {
  id?: string;
  name: string;
  role: UserRole;
  title: string;
  department?: string;
  email?: string;
}

export interface Komponen {
  id: string;
  kode: string;
  nomor: number;
  nama: string;
  deskripsi: string;
  bobot: number;
  butir?: Butir[];
}

export interface Butir {
  id: string;
  komponen_id: string;
  nomor: number;
  kode: string;
  nama: string;
  deskripsi: string;
  fokus_vokasi?: string;
  indikator?: Indikator[];
}

export interface RubrikPenilaian {
  id: string;
  indikator_id: string;
  level: number; // 1, 2, 3, 4
  kategori: CapaianRubrik;
  deskripsi: string;
}

export interface BuktiFisik {
  id: string;
  indikator_id: string;
  kode: string;
  nama: string;
  jenis: 'Dokumen' | 'Observasi' | 'Wawancara' | 'Produk Siswa' | 'Sertifikat' | 'MoU';
  deskripsi: string;
  wajib: boolean;
}

export interface BuktiVersion {
  id: string;
  bukti_id: string;
  indikator_id: string;
  indikator_kode?: string;
  version_tag: string; // e.g. 'v1.0', 'v1.1', 'v2.0'
  status: StatusBuktiFisik;
  previous_status?: StatusBuktiFisik;
  file_name?: string;
  file_url?: string;
  file_size?: string;
  change_summary: string;
  user_name: string;
  user_role: string;
  user_role_type?: UserRole;
  timestamp: string;
}

export interface Indikator {
  id: string;
  butir_id: string;
  kode: string;
  nomor: number;
  nama: string;
  definisi_operasional: string;
  penjelasan: string;
  rubrik_penilaian?: RubrikPenilaian[];
  bukti_fisik?: BuktiFisik[];
}

export interface ActivityLog {
  id: string;
  evaluasi_id?: string;
  indikator_id: string;
  indikator_kode?: string;
  action: 'CREATE' | 'UPDATE' | 'STATUS_CHANGE' | 'EVIDENCE_UPDATE' | 'VALIDATION_REVIEW';
  user_name: string;
  user_role: string;
  user_role_type?: UserRole;
  previous_capaian?: CapaianRubrik;
  new_capaian?: CapaianRubrik;
  previous_status?: StatusVerifikasi;
  new_status?: StatusVerifikasi;
  notes_snippet?: string;
  validator_notes?: string;
  timestamp: string;
}

export interface EvaluasiAsesi {
  id: string;
  indikator_id: string;
  capaian: CapaianRubrik;
  skor: number; // 1 - 4
  catatan: string;
  catatan_validator?: string;
  bukti_urls?: string[];
  bukti_checklist?: Record<string, StatusBuktiFisik>; // Mapping ID/Kode Bukti Fisik -> Status ('Tersedia' | 'Dalam Proses' | 'Belum Ada')
  status_verifikasi: StatusVerifikasi;
  verified_by?: string;
  last_edited_by?: string;
  last_edited_role?: string;
  last_edited_role_type?: UserRole;
  activity_logs?: ActivityLog[];
  created_at?: string;
  updated_at?: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export interface SupabaseConfig {
  url: string;
  anonKey: string;
  isConnected: boolean;
  usingLiveSupabase: boolean;
}

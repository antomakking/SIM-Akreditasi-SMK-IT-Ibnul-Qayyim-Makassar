import { CapaianRubrik, EvaluasiAsesi, StatusVerifikasi, ValidationResult, ActivityLog, UserRole, UserProfile } from '../types/akreditasi';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

export const VALID_CAPAIAN: CapaianRubrik[] = ['Kurang', 'Cukup Baik', 'Baik', 'Sangat Baik'];

export const SKOR_MAP: Record<CapaianRubrik, number> = {
  'Kurang': 1,
  'Cukup Baik': 2,
  'Baik': 3,
  'Sangat Baik': 4
};

const LOCAL_STORAGE_KEY = 'sim_akreditasi_evaluasi_v2';
const LOCAL_LOGS_KEY = 'sim_akreditasi_logs_v2';
const SUPABASE_CONFIG_KEY = 'sim_akreditasi_supabase_cfg';
const ACTIVE_USER_KEY = 'sim_akreditasi_current_user_v3';
export type { UserProfile };

export const DEFAULT_TEAM_USERS: UserProfile[] = [
  // 1. ADMIN
  { 
    id: 'usr-admin-1',
    name: 'Drs. H. M. Said, M.Pd', 
    role: 'Admin',
    title: 'Kepala Satuan Pendidikan & Penanggung Jawab Akreditasi',
    department: 'Manajemen & Tata Kelola Sekolah',
    email: 'said.kepsek@smkitibnulqayyim.sch.id'
  },
  // 2. ASESI (TIM ASESI SEKOLAH)
  { 
    id: 'usr-asesi-1',
    name: 'Ahmad Fadhil, S.Kom', 
    role: 'Asesi',
    title: 'Ketua Tim Asesi / Guru Produktif RPL',
    department: 'Jurusan Rekayasa Perangkat Lunak',
    email: 'fadhil.rpl@smkitibnulqayyim.sch.id'
  },
  { 
    id: 'usr-asesi-2',
    name: 'Nur Hidayah, S.Pd', 
    role: 'Asesi',
    title: 'Waka Kurikulum & Pembelajaran',
    department: 'Kurikulum & Pembelajaran',
    email: 'hidayah.kurikulum@smkitibnulqayyim.sch.id'
  },
  { 
    id: 'usr-asesi-3',
    name: 'Muh. Yusuf, S.T', 
    role: 'Asesi',
    title: 'Kepala Lab & Bengkel IT / Sarpras',
    department: 'Sarana Prasarana & Lab IT',
    email: 'yusuf.lab@smkitibnulqayyim.sch.id'
  },
  { 
    id: 'usr-asesi-4',
    name: 'Fatimah Az-Zahra, S.Sos', 
    role: 'Asesi',
    title: 'Koordinator BKK & Kemitraan DUDIKA',
    department: 'Hubungan Industri & BKK',
    email: 'fatimah.bkk@smkitibnulqayyim.sch.id'
  },
  // 3. VALIDATOR (ASESOR INTERNAL / AUDITOR MUTU)
  { 
    id: 'usr-val-1',
    name: 'Dr. Ir. H. Abdurrahman, M.T', 
    role: 'Validator',
    title: 'Asesor Internal BAN-PDM / Auditor Penjamin Mutu',
    department: 'Lembaga Penjaminan Mutu Pendidikan (LPMP/Internal)',
    email: 'abdurrahman.asesor@banpdm-sulsel.org'
  },
  { 
    id: 'usr-val-2',
    name: 'Dra. Hj. Maryam, M.M', 
    role: 'Validator',
    title: 'Tim Verifikator Kinerja & Validasi Portofolio',
    department: 'Tim Validasi & Verifikasi Eksternal/Internal',
    email: 'maryam.verifikator@smkitibnulqayyim.sch.id'
  },
  // 4. VIEWER (PENGGUNA UMUM / GUEST READ-ONLY)
  { 
    id: 'usr-view-1',
    name: 'Pengunjung Tamu / Pengguna Umum', 
    role: 'Viewer',
    title: 'Akses Read-Only (Hanya Membaca Data & Laporan)',
    department: 'Masyarakat Umum / Pengawas / Mahasiswa',
    email: 'tamu@smkitibnulqayyim.sch.id'
  }
];

export function canEditEvaluasiNotes(role: UserRole): boolean {
  return role === 'Admin' || role === 'Asesi';
}

export function canEditChecklist(role: UserRole): boolean {
  return role === 'Admin' || role === 'Asesi';
}

export function canValidate(role: UserRole): boolean {
  return role === 'Admin' || role === 'Validator';
}

export function isReadOnlyUser(role: UserRole): boolean {
  return role === 'Viewer';
}

export function getCurrentUser(): UserProfile {
  try {
    const raw = localStorage.getItem(ACTIVE_USER_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      // Validasi struktur
      if (parsed && parsed.name && parsed.role) {
        return parsed;
      }
    }
  } catch {
    // ignore
  }
  return DEFAULT_TEAM_USERS[1]; // Default to Ketua Asesi
}

export function setCurrentUser(user: UserProfile): void {
  localStorage.setItem(ACTIVE_USER_KEY, JSON.stringify(user));
}

export interface StoredSupabaseConfig {
  url: string;
  anonKey: string;
  isActive: boolean;
}

export function getStoredConfig(): StoredSupabaseConfig {
  try {
    const raw = localStorage.getItem(SUPABASE_CONFIG_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {
    // ignore
  }
  return {
    url: '',
    anonKey: '',
    isActive: false
  };
}

export function saveStoredConfig(config: StoredSupabaseConfig): void {
  localStorage.setItem(SUPABASE_CONFIG_KEY, JSON.stringify(config));
}

let activeClient: SupabaseClient | null = null;

export function getClient(): SupabaseClient | null {
  const cfg = getStoredConfig();
  if (cfg.isActive && cfg.url && cfg.anonKey) {
    if (!activeClient) {
      activeClient = createClient(cfg.url, cfg.anonKey);
    }
    return activeClient;
  }
  return null;
}

export function resetClient(): void {
  activeClient = null;
}

/**
 * Validasi ketat data input evaluasi sebelum pengiriman ke database
 */
export function validateEvaluasiInput(
  params: {
    indikator_id: string;
    capaian: string;
    catatan: string;
    bukti_urls?: string[];
  },
  options: { isAutoSave?: boolean; requireMinLength?: boolean } = {}
): ValidationResult {
  const errors: Record<string, string> = {};

  // 1. Validasi ID Indikator
  if (!params.indikator_id || typeof params.indikator_id !== 'string') {
    errors.indikator_id = 'ID Indikator wajib ditentukan.';
  }

  // 2. Validasi Capaian Rubrik
  if (!params.capaian) {
    errors.capaian = 'Pilihan capaian rubrik wajib dipilih.';
  } else if (!VALID_CAPAIAN.includes(params.capaian as CapaianRubrik)) {
    errors.capaian = `Capaian "${params.capaian}" tidak valid. Pilihan yang diizinkan: ${VALID_CAPAIAN.join(', ')}.`;
  }

  // 3. Validasi Catatan Evaluasi Diri
  const isAutoSave = options.isAutoSave || false;
  const requireMinLength = options.requireMinLength ?? !isAutoSave;

  if (params.catatan !== undefined && params.catatan !== null) {
    const trimmed = String(params.catatan).trim();
    if (requireMinLength && trimmed.length < 20) {
      errors.catatan = `Catatan evaluasi terlalu singkat (${trimmed.length} karakter). Minimal 20 karakter untuk memaparkan bukti dan kondisi riil di sekolah.`;
    } else if (trimmed.length > 3000) {
      errors.catatan = 'Catatan evaluasi melebihi batas maksimal 3.000 karakter.';
    }
  }

  // 4. Validasi URL Bukti
  if (params.bukti_urls && Array.isArray(params.bukti_urls)) {
    for (let i = 0; i < params.bukti_urls.length; i++) {
      const url = params.bukti_urls[i];
      if (url && url.trim().length > 0) {
        try {
          const parsed = new URL(url.trim());
          if (!['http:', 'https:'].includes(parsed.protocol)) {
            errors[`bukti_url_${i}`] = `Link "${url}" harus berawalan http:// atau https://`;
          }
        } catch {
          errors[`bukti_url_${i}`] = `Format link "${url}" tidak valid.`;
        }
      }
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

/**
 * Mengambil seluruh log aktivitas dari LocalStorage
 */
export function getAllStoredLogs(): ActivityLog[] {
  try {
    const raw = localStorage.getItem(LOCAL_LOGS_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {
    // ignore
  }
  return [];
}

/**
 * Menyimpan log aktivitas baru
 */
export function recordActivityLog(log: Omit<ActivityLog, 'id' | 'timestamp'>): ActivityLog {
  const newEntry: ActivityLog = {
    ...log,
    id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    timestamp: new Date().toISOString()
  };

  try {
    const existing = getAllStoredLogs();
    const updated = [newEntry, ...existing].slice(0, 200); // Simpan 200 riwayat terbaru
    localStorage.setItem(LOCAL_LOGS_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save log to localStorage:', e);
  }

  return newEntry;
}

/**
 * Mengambil log aktivitas untuk satu indikator spesifik
 */
export function getLogsForIndikator(indikator_id: string): ActivityLog[] {
  const all = getAllStoredLogs();
  return all.filter((l) => l.indikator_id === indikator_id);
}

/**
 * Menyimpan evaluasi asesi ke Supabase jika aktif, atau ke LocalStorage (Offline Safe),
 * sekaligus merekam audit trail (Log Aktivitas) dan siapa pengubah terakhirnya.
 */
export async function saveEvaluasi(
  indikator_id: string,
  capaian: CapaianRubrik,
  catatan: string,
  bukti_urls: string[] = [],
  status_verifikasi: StatusVerifikasi = 'Draf',
  editor?: UserProfile,
  bukti_checklist: Record<string, 'Tersedia' | 'Dalam Proses' | 'Belum Ada'> = {},
  options: { isAutoSave?: boolean; catatan_validator?: string } = {}
): Promise<{ success: boolean; message: string; data: EvaluasiAsesi; log: ActivityLog }> {
  const activeUser = editor || getCurrentUser();

  // 1. Enforce Role-Based Restrictions
  if (activeUser.role === 'Viewer') {
    throw new Error('Akses Ditolak: Pengguna Umum (Viewer) hanya memiliki izin baca saja (Read-Only). Pengeditan tidak diizinkan.');
  }

  // 2. Lakukan validasi data sebelum pengiriman
  const validation = validateEvaluasiInput(
    {
      indikator_id,
      capaian,
      catatan,
      bukti_urls
    },
    { isAutoSave: options.isAutoSave }
  );

  if (!validation.isValid) {
    const errorDetails = Object.values(validation.errors).join(', ');
    throw new Error(`Validasi gagal: ${errorDetails}`);
  }

  const skor = SKOR_MAP[capaian];
  const cleanUrls = bukti_urls.filter(u => u && u.trim().length > 0);

  // Ambil state sebelumnya untuk mencatat diff di log
  const existingRecords = getAllStoredEvaluasi();
  const previousRecord = existingRecords[indikator_id];

  const hasChecklistChanged = JSON.stringify(previousRecord?.bukti_checklist || {}) !== JSON.stringify(bukti_checklist || {});

  const actionType: ActivityLog['action'] = !previousRecord 
    ? 'CREATE' 
    : previousRecord.status_verifikasi !== status_verifikasi 
    ? 'STATUS_CHANGE'
    : (previousRecord.bukti_urls?.length !== cleanUrls.length || hasChecklistChanged)
    ? 'EVIDENCE_UPDATE' 
    : 'UPDATE';

  // Catat riwayat log
  const logEntry = recordActivityLog({
    evaluasi_id: previousRecord?.id || `eval-${Date.now()}`,
    indikator_id: indikator_id.trim(),
    action: actionType,
    user_name: activeUser.name,
    user_role: `${activeUser.role} - ${activeUser.title}`,
    user_role_type: activeUser.role,
    previous_capaian: previousRecord?.capaian,
    new_capaian: capaian,
    previous_status: previousRecord?.status_verifikasi,
    new_status: status_verifikasi,
    notes_snippet: catatan.trim().length > 90 ? `${catatan.trim().slice(0, 90)}...` : catatan.trim(),
    validator_notes: options.catatan_validator || previousRecord?.catatan_validator
  });

  const payload: EvaluasiAsesi = {
    id: previousRecord?.id || `eval-${Date.now()}`,
    indikator_id: indikator_id.trim(),
    capaian,
    skor,
    catatan: catatan.trim(),
    catatan_validator: options.catatan_validator !== undefined ? options.catatan_validator : previousRecord?.catatan_validator,
    bukti_urls: cleanUrls,
    bukti_checklist,
    status_verifikasi,
    verified_by: status_verifikasi === 'Terverifikasi Valid' ? activeUser.name : previousRecord?.verified_by,
    last_edited_by: activeUser.name,
    last_edited_role: activeUser.title,
    last_edited_role_type: activeUser.role,
    updated_at: new Date().toISOString()
  };

  const client = getClient();

  if (client) {
    // Mode Live Supabase
    try {
      const { data, error } = await client
        .from('evaluasi_asesi')
        .upsert(
          {
            indikator_id: payload.indikator_id,
            capaian: payload.capaian,
            skor: payload.skor,
            catatan: payload.catatan,
            catatan_validator: payload.catatan_validator,
            bukti_urls: payload.bukti_urls,
            bukti_checklist: payload.bukti_checklist,
            status_verifikasi: payload.status_verifikasi,
            verified_by: payload.verified_by,
            updated_at: payload.updated_at
          },
          { onConflict: 'indikator_id' }
        )
        .select()
        .single();

      if (error) {
        throw new Error(`Supabase Error (${error.code}): ${error.message}`);
      }

      // Simpan log ke tabel log_aktivitas_evaluasi jika tabel ada
      try {
        await client.from('log_aktivitas_evaluasi').insert({
          evaluasi_id: data.id,
          indikator_id: payload.indikator_id,
          user_name: activeUser.name,
          user_role: `${activeUser.role} - ${activeUser.title}`,
          action: actionType,
          previous_capaian: previousRecord?.capaian,
          new_capaian: capaian,
          previous_status: previousRecord?.status_verifikasi,
          new_status: status_verifikasi,
          catatan_ringkas: logEntry.notes_snippet
        });
      } catch (logErr) {
        console.warn('Supabase activity log table notice:', logErr);
      }

      // Sync ke local mirror
      updateLocalStorageRecord({
        ...(data as EvaluasiAsesi),
        bukti_checklist: payload.bukti_checklist,
        catatan_validator: payload.catatan_validator,
        last_edited_by: activeUser.name,
        last_edited_role: activeUser.title,
        last_edited_role_type: activeUser.role
      });

      return {
        success: true,
        message: 'Evaluasi & status checklist bukti fisik berhasil disimpan ke Supabase PostgreSQL.',
        data: { 
          ...(data as EvaluasiAsesi), 
          bukti_checklist: payload.bukti_checklist,
          catatan_validator: payload.catatan_validator 
        },
        log: logEntry
      };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      throw new Error(`Gagal menyimpan ke Supabase: ${msg}`);
    }
  } else {
    // Mode Local Reactive Storage (Mock / Offline Sandbox)
    updateLocalStorageRecord(payload);
    return {
      success: true,
      message: 'Evaluasi & status checklist bukti fisik tersimpan di penyimpanan lokal asesi.',
      data: payload,
      log: logEntry
    };
  }
}

/**
 * Khusus Validator / Admin: Melakukan review validasi dan pembaruan status verifikasi
 * tanpa mengubah catatan asli pengisian dari Asesi (Audit Trail Aman).
 */
export async function saveValidatorReview(
  indikator_id: string,
  new_status: StatusVerifikasi,
  validator_notes: string = '',
  editor?: UserProfile
): Promise<{ success: boolean; message: string; data: EvaluasiAsesi; log: ActivityLog }> {
  const activeUser = editor || getCurrentUser();

  if (activeUser.role !== 'Validator' && activeUser.role !== 'Admin') {
    throw new Error('Akses Ditolak: Hanya pengguna dengan peran "Validator" atau "Admin" yang berhak melakukan validasi dan menetapkan status verifikasi.');
  }

  const existingRecords = getAllStoredEvaluasi();
  const previousRecord = existingRecords[indikator_id];

  if (!previousRecord) {
    throw new Error('Data evaluasi asesi belum dibuat untuk indikator ini.');
  }

  const logEntry = recordActivityLog({
    evaluasi_id: previousRecord.id,
    indikator_id: indikator_id.trim(),
    action: 'VALIDATION_REVIEW',
    user_name: activeUser.name,
    user_role: `${activeUser.role} - ${activeUser.title}`,
    user_role_type: activeUser.role,
    previous_capaian: previousRecord.capaian,
    new_capaian: previousRecord.capaian,
    previous_status: previousRecord.status_verifikasi,
    new_status: new_status,
    notes_snippet: previousRecord.catatan.length > 90 ? `${previousRecord.catatan.slice(0, 90)}...` : previousRecord.catatan,
    validator_notes: validator_notes.trim()
  });

  const updatedRecord: EvaluasiAsesi = {
    ...previousRecord,
    status_verifikasi: new_status,
    catatan_validator: validator_notes.trim(),
    verified_by: new_status === 'Terverifikasi Valid' ? activeUser.name : (new_status === 'Perlu Perbaikan' ? `${activeUser.name} (Review)` : previousRecord.verified_by),
    last_edited_by: activeUser.name,
    last_edited_role: activeUser.title,
    last_edited_role_type: activeUser.role,
    updated_at: new Date().toISOString()
  };

  const client = getClient();
  if (client) {
    try {
      const { data, error } = await client
        .from('evaluasi_asesi')
        .update({
          status_verifikasi: updatedRecord.status_verifikasi,
          catatan_validator: updatedRecord.catatan_validator,
          verified_by: updatedRecord.verified_by,
          updated_at: updatedRecord.updated_at
        })
        .eq('indikator_id', indikator_id)
        .select()
        .single();

      if (error) {
        throw new Error(`Supabase Error (${error.code}): ${error.message}`);
      }

      // Log ke tabel log_aktivitas_evaluasi
      try {
        await client.from('log_aktivitas_evaluasi').insert({
          evaluasi_id: previousRecord.id,
          indikator_id: indikator_id,
          user_name: activeUser.name,
          user_role: `${activeUser.role} - ${activeUser.title}`,
          action: 'VALIDATION_REVIEW',
          previous_capaian: previousRecord.capaian,
          new_capaian: previousRecord.capaian,
          previous_status: previousRecord.status_verifikasi,
          new_status: new_status,
          catatan_ringkas: `[Validator Review]: ${validator_notes.trim().slice(0, 100)}`
        });
      } catch (logErr) {
        console.warn('Supabase log notice:', logErr);
      }

      updateLocalStorageRecord(updatedRecord);
      return {
        success: true,
        message: `Status verifikasi berhasil diperbarui menjadi "${new_status}".`,
        data: updatedRecord,
        log: logEntry
      };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      throw new Error(`Gagal menyimpan validasi: ${msg}`);
    }
  } else {
    updateLocalStorageRecord(updatedRecord);
    return {
      success: true,
      message: `Status verifikasi berhasil diperbarui menjadi "${new_status}" (Tersimpan Lokal).`,
      data: updatedRecord,
      log: logEntry
    };
  }
}

function updateLocalStorageRecord(item: EvaluasiAsesi): void {
  try {
    const all = getAllStoredEvaluasi();
    all[item.indikator_id] = item;
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(all));
  } catch (e) {
    console.error('LocalStorage write error:', e);
  }
}

export function getAllStoredEvaluasi(): Record<string, EvaluasiAsesi> {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {
    // ignore
  }
  return {};
}

export function initLocalStorage(defaultMap: Record<string, EvaluasiAsesi>): void {
  const current = getAllStoredEvaluasi();
  if (Object.keys(current).length === 0) {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(defaultMap));
  }

  // Inisialisasi seed logs jika kosong
  const currentLogs = getAllStoredLogs();
  if (currentLogs.length === 0) {
    const seedLogs: ActivityLog[] = [
      {
        id: 'log-seed-1',
        indikator_id: 'ind-1.1.1',
        action: 'UPDATE',
        user_name: 'Ahmad Fadhil, S.Kom',
        user_role: 'Ketua Tim Asesi / Guru Produktif RPL',
        previous_capaian: 'Baik',
        new_capaian: 'Sangat Baik',
        previous_status: 'Draf',
        new_status: 'Terverifikasi Valid',
        notes_snippet: 'Pendidik di SMK IT Ibnul Qayyim Makassar secara konsisten membangun interaksi positif...',
        timestamp: '2026-03-15T09:30:00.000Z'
      },
      {
        id: 'log-seed-2',
        indikator_id: 'ind-1.2.1',
        action: 'UPDATE',
        user_name: 'Nur Hidayah, S.Pd',
        user_role: 'Waka Kurikulum & Pembelajaran',
        previous_capaian: 'Cukup Baik',
        new_capaian: 'Baik',
        previous_status: 'Draf',
        new_status: 'Terverifikasi Valid',
        notes_snippet: 'Kesepakatan kelas disusun di awal semester ganjil melibatkan aspirasi seluruh murid...',
        timestamp: '2026-03-16T11:00:00.000Z'
      },
      {
        id: 'log-seed-3',
        indikator_id: 'ind-2.6.4',
        action: 'STATUS_CHANGE',
        user_name: 'Drs. H. M. Said, M.Pd',
        user_role: 'Kepala Satuan Pendidikan',
        previous_capaian: 'Baik',
        new_capaian: 'Sangat Baik',
        previous_status: 'Perlu Perbaikan',
        new_status: 'Terverifikasi Valid',
        notes_snippet: 'SMK IT Ibnul Qayyim Makassar telah menjalin MoU strategis dengan 12 mitra dunia kerja...',
        timestamp: '2026-03-20T14:15:00.000Z'
      },
      {
        id: 'log-seed-4',
        indikator_id: 'ind-3.15.2',
        action: 'CREATE',
        user_name: 'Muh. Yusuf, S.T',
        user_role: 'Kepala Laboratorium & Bengkel IT',
        new_capaian: 'Baik',
        new_status: 'Draf',
        notes_snippet: 'Unit produksi Teaching Factory (TeFa) software house dan jaringan komputer telah berjalan...',
        timestamp: '2026-03-22T10:00:00.000Z'
      }
    ];
    localStorage.setItem(LOCAL_LOGS_KEY, JSON.stringify(seedLogs));
  }
}

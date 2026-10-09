import { UserRole } from '../types/akreditasi';
import { UserAccount, AuthSession, RolePermissionDetail } from '../types/auth';

const ACCOUNTS_STORAGE_KEY = 'sim_akreditasi_accounts_v1';
const SESSION_STORAGE_KEY = 'sim_akreditasi_auth_session_v1';
const ACTIVE_USER_KEY = 'sim_akreditasi_current_user_v3';

export const INITIAL_USER_ACCOUNTS: UserAccount[] = [
  // 1. ADMIN
  {
    id: 'usr-admin-1',
    username: 'admin',
    password: 'admin@iq2026',
    name: 'Drs. H. M. Said, M.Pd',
    role: 'Admin',
    title: 'Kepala Satuan Pendidikan & Penanggung Jawab Akreditasi',
    department: 'Manajemen & Tata Kelola Sekolah',
    email: 'said.kepsek@smkitibnulqayyim.sch.id',
    avatarBg: 'bg-amber-600',
    isDefault: true,
    permissions: [
      'Full Control seluruh modul sistem',
      'Kelola akun pengguna & atur password',
      'Edit catatan evaluasi & override nilai capaian',
      'Verifikasi & validasi akhir instrumen',
      'Ekspor laporan resmi PDF/Excel & cetak',
      'Konfigurasi integrasi Supabase PostgreSQL'
    ]
  },

  // 2. TIM ASESI SEKOLAH
  {
    id: 'usr-asesi-1',
    username: 'asesi',
    password: 'asesi@rpl2026',
    name: 'Ahmad Fadhil, S.Kom',
    role: 'Asesi',
    title: 'Ketua Tim Asesi / Guru Produktif RPL',
    department: 'Jurusan Rekayasa Perangkat Lunak',
    email: 'fadhil.rpl@smkitibnulqayyim.sch.id',
    avatarBg: 'bg-emerald-600',
    isDefault: true,
    permissions: [
      'Pengisian catatan evaluasi diri asesi',
      'Penentuan level rubrik capaian kinerja (Level 1-4)',
      'Unggah & perbarui bukti fisik akreditasi',
      'Kelola riwayat versi dokumen bukti',
      'Pemberian catatan perbaikan & checklist bukti',
      'Pratinjau cetak formulir instrumen asesi'
    ]
  },
  {
    id: 'usr-asesi-2',
    username: 'kurikulum',
    password: 'kurikulum@2026',
    name: 'Nur Hidayah, S.Pd',
    role: 'Asesi',
    title: 'Waka Kurikulum & Pembelajaran',
    department: 'Kurikulum & Pembelajaran',
    email: 'hidayah.kurikulum@smkitibnulqayyim.sch.id',
    avatarBg: 'bg-teal-600',
    isDefault: true,
    permissions: [
      'Pengisian evaluasi Komponen 1 (Kepemimpinan Kurikulum)',
      'Unggah dokumen KOSP, Silabus & Modul Ajar',
      'Verifikasi kelengkapan perangkat pembelajaran'
    ]
  },
  {
    id: 'usr-asesi-3',
    username: 'sarpras',
    password: 'sarpras@2026',
    name: 'Muh. Yusuf, S.T',
    role: 'Asesi',
    title: 'Kepala Lab & Bengkel IT / Sarpras',
    department: 'Sarana Prasarana & Lab IT',
    email: 'yusuf.lab@smkitibnulqayyim.sch.id',
    avatarBg: 'bg-blue-600',
    isDefault: true,
    permissions: [
      'Pengisian bukti fisik sarana & prasarana vokasi',
      'Unggah daftar inventaris alat laboratorium komputer',
      'Dokumentasi kelayakan K3 bengkel IT'
    ]
  },
  {
    id: 'usr-asesi-4',
    username: 'bkk',
    password: 'dudika@2026',
    name: 'Fatimah Az-Zahra, S.Sos',
    role: 'Asesi',
    title: 'Koordinator BKK & Kemitraan DUDIKA',
    department: 'Hubungan Industri & BKK',
    email: 'fatimah.bkk@smkitibnulqayyim.sch.id',
    avatarBg: 'bg-indigo-600',
    isDefault: true,
    permissions: [
      'Unggah MoU kerjasama kemitraan industri DUDIKA',
      'Data keterserapan alumni di dunia kerja (BKK)',
      'Dokumentasi sertifikasi kompetensi siswa LSP'
    ]
  },

  // 3. VALIDATOR (ASESOR / AUDITOR PENJAMIN MUTU)
  {
    id: 'usr-val-1',
    username: 'validator',
    password: 'validator@banpdm',
    name: 'Dr. Ir. H. Abdurrahman, M.T',
    role: 'Validator',
    title: 'Asesor Internal BAN-PDM / Auditor Penjamin Mutu',
    department: 'Lembaga Penjaminan Mutu Pendidikan (LPMP/Internal)',
    email: 'abdurrahman.asesor@banpdm-sulsel.org',
    avatarBg: 'bg-purple-600',
    isDefault: true,
    permissions: [
      'Review & audit skor penilaian mandiri asesi',
      'Verifikasi keabsahan dokumen bukti fisik',
      'Pemberian status validasi (Valid / Perlu Perbaikan)',
      'Pemberian catatan telaah & rekomendasi reviewer',
      'Pemberian rekomendasi kelayakan visitasi akreditasi'
    ]
  },
  {
    id: 'usr-val-2',
    username: 'verifikator',
    password: 'verifikator@2026',
    name: 'Dra. Hj. Maryam, M.M',
    role: 'Validator',
    title: 'Tim Verifikator Kinerja & Validasi Portofolio',
    department: 'Tim Validasi & Verifikasi Eksternal/Internal',
    email: 'maryam.verifikator@smkitibnulqayyim.sch.id',
    avatarBg: 'bg-fuchsia-600',
    isDefault: true,
    permissions: [
      'Uji silang portofolio bukti fisik terhadap rubrik',
      'Pemberian feedback korektif dokumen asesi',
      'Validasi capaian mutu sekolah'
    ]
  },

  // 4. VIEWER (PENGUNJUNG TAMU / PENGAWAS READ-ONLY)
  {
    id: 'usr-view-1',
    username: 'viewer',
    password: 'viewer@tamu2026',
    name: 'Pengunjung Tamu / Pengawas',
    role: 'Viewer',
    title: 'Akses Read-Only (Hanya Membaca Data & Laporan)',
    department: 'Masyarakat Umum / Pengawas Pembina / Tamu',
    email: 'tamu@smkitibnulqayyim.sch.id',
    avatarBg: 'bg-slate-600',
    isDefault: true,
    permissions: [
      'Melihat dashboard progres & capaian akreditasi',
      'Melihat butir & indikator instrumen BAN-PDM',
      'Melihat pratinjau cetak laporan evaluasi',
      'Mode baca saja (tidak dapat mengedit atau menghapus)'
    ]
  }
];

export const ROLE_PERMISSIONS_MATRIX: RolePermissionDetail[] = [
  {
    role: 'Admin',
    label: 'Administrator Sistem',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
    deskripsi: 'Akses tertinggi sistem akreditasi. Bertanggung jawab atas pengelolaan akun, password, konfigurasi database, dan pengesahan seluruh data.',
    canEditEvaluasi: true,
    canUploadBukti: true,
    canValidate: true,
    canManageUsers: true,
    canExportReport: true,
    canConfigureDb: true,
    aksesModul: ['Dashboard', 'Instrumen Evaluasi', 'Manajemen Pengguna & Password', 'Skema SQL', 'Supabase JS', 'Ekspor Laporan']
  },
  {
    role: 'Asesi',
    label: 'Tim Asesi Sekolah',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    deskripsi: 'Tim pengembang sekolah yang mengisi evaluasi diri, memilih level rubrik, melengkapi catatan kinerja, dan mengunggah dokumen bukti fisik.',
    canEditEvaluasi: true,
    canUploadBukti: true,
    canValidate: false,
    canManageUsers: false,
    canExportReport: true,
    canConfigureDb: false,
    aksesModul: ['Dashboard', 'Instrumen Evaluasi Diri', 'Manajemen Bukti Fisik', 'Riwayat Versi Dokumen', 'Pratinjau Cetak']
  },
  {
    role: 'Validator',
    label: 'Asesor & Validator',
    badgeColor: 'bg-purple-100 text-purple-800 border-purple-300',
    deskripsi: 'Asesor internal atau eksternal yang bertugas menelaah skor, memverifikasi kesesuaian bukti fisik, dan memberikan umpan balik perbaikan.',
    canEditEvaluasi: false,
    canUploadBukti: false,
    canValidate: true,
    canManageUsers: false,
    canExportReport: true,
    canConfigureDb: false,
    aksesModul: ['Dashboard Penilaian', 'Instrumen Validasi', 'Panel Catatan Reviewer', 'Verifikasi Status Bukti', 'Ekspor Laporan']
  },
  {
    role: 'Viewer',
    label: 'Pengunjung / Tamu',
    badgeColor: 'bg-slate-100 text-slate-700 border-slate-300',
    deskripsi: 'Akses terbatas untuk membaca data evaluasi, progres pencapaian, dan laporan tanpa hak modifikasi (Read-Only).',
    canEditEvaluasi: false,
    canUploadBukti: false,
    canValidate: false,
    canManageUsers: false,
    canExportReport: true,
    canConfigureDb: false,
    aksesModul: ['Dashboard Ringkasan', 'Lihat Instrumen (Read-Only)', 'Pratinjau Cetak Laporan']
  }
];

export function getStoredAccounts(): UserAccount[] {
  try {
    const raw = localStorage.getItem(ACCOUNTS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Gagal membaca data akun dari localStorage:', err);
  }
  // Simpan data inisial
  saveStoredAccounts(INITIAL_USER_ACCOUNTS);
  return INITIAL_USER_ACCOUNTS;
}

export function saveStoredAccounts(accounts: UserAccount[]): void {
  try {
    localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(accounts));
  } catch (err) {
    console.error('Gagal menyimpan data akun ke localStorage:', err);
  }
}

export function getAccountById(id: string): UserAccount | undefined {
  const accounts = getStoredAccounts();
  return accounts.find((a) => a.id === id);
}

export function findAccountByCredential(identifier: string): UserAccount | undefined {
  const accounts = getStoredAccounts();
  const trimmed = identifier.trim().toLowerCase();
  return accounts.find(
    (a) =>
      a.username.toLowerCase() === trimmed ||
      (a.email && a.email.toLowerCase() === trimmed)
  );
}

export function getAuthSession(): AuthSession {
  try {
    const raw = localStorage.getItem(SESSION_STORAGE_KEY);
    if (raw) {
      const parsed: AuthSession = JSON.parse(raw);
      if (parsed && parsed.currentUser) {
        // Sinkronkan akun dengan data akun tersimpan terbaru
        const syncedAccount = getAccountById(parsed.currentUser.id);
        if (syncedAccount) {
          return {
            ...parsed,
            currentUser: syncedAccount
          };
        }
        return parsed;
      }
    }
  } catch (err) {
    console.error('Gagal membaca auth session:', err);
  }

  // Default: Sesi aktif akun default Asesi
  const defaultAcc = INITIAL_USER_ACCOUNTS[1];
  const defaultSession: AuthSession = {
    isLoggedIn: true,
    currentUser: defaultAcc,
    loginTime: new Date().toISOString(),
    rememberMe: true
  };
  return defaultSession;
}

export function saveAuthSession(session: AuthSession): void {
  try {
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
    // Sinkronkan juga ke ACTIVE_USER_KEY agar evaluasiService tetap terupdate
    localStorage.setItem(ACTIVE_USER_KEY, JSON.stringify({
      id: session.currentUser.id,
      name: session.currentUser.name,
      role: session.currentUser.role,
      title: session.currentUser.title,
      department: session.currentUser.department,
      email: session.currentUser.email
    }));
  } catch (err) {
    console.error('Gagal menyimpan auth session:', err);
  }
}

export function loginUser(
  identifier: string,
  passwordInput: string,
  rememberMe: boolean = true
): { success: boolean; account?: UserAccount; error?: string } {
  if (!identifier.trim()) {
    return { success: false, error: 'Username atau Email tidak boleh kosong.' };
  }
  if (!passwordInput) {
    return { success: false, error: 'Password tidak boleh kosong.' };
  }

  const account = findAccountByCredential(identifier);
  if (!account) {
    return {
      success: false,
      error: `Akun dengan username atau email "${identifier}" tidak ditemukan.`
    };
  }

  if (account.password !== passwordInput) {
    return {
      success: false,
      error: 'Password yang Anda masukkan salah. Silakan periksa kembali atau gunakan akun demo.'
    };
  }

  // Update last login
  const now = new Date().toISOString();
  account.lastLogin = now;
  const accounts = getStoredAccounts();
  const idx = accounts.findIndex((a) => a.id === account.id);
  if (idx !== -1) {
    accounts[idx] = { ...account, lastLogin: now };
    saveStoredAccounts(accounts);
  }

  const session: AuthSession = {
    isLoggedIn: true,
    currentUser: account,
    loginTime: now,
    rememberMe
  };
  saveAuthSession(session);

  return { success: true, account };
}

export function switchUserDirectly(accountId: string): UserAccount | undefined {
  const account = getAccountById(accountId);
  if (!account) return undefined;

  const now = new Date().toISOString();
  const session: AuthSession = {
    isLoggedIn: true,
    currentUser: account,
    loginTime: now,
    rememberMe: true
  };
  saveAuthSession(session);
  return account;
}

export function logoutUser(): void {
  const guestViewer = INITIAL_USER_ACCOUNTS[INITIAL_USER_ACCOUNTS.length - 1];
  const session: AuthSession = {
    isLoggedIn: false,
    currentUser: guestViewer,
    loginTime: undefined,
    rememberMe: false
  };
  saveAuthSession(session);
}

export function updateAccountPassword(accountId: string, newPassword: string): boolean {
  if (!newPassword || newPassword.trim().length < 4) {
    return false;
  }
  const accounts = getStoredAccounts();
  const idx = accounts.findIndex((a) => a.id === accountId);
  if (idx === -1) return false;

  accounts[idx].password = newPassword.trim();
  saveStoredAccounts(accounts);

  // Jika akun yang diubah adalah sesi aktif, perbarui sesi juga
  const currentSession = getAuthSession();
  if (currentSession.currentUser.id === accountId) {
    currentSession.currentUser.password = newPassword.trim();
    saveAuthSession(currentSession);
  }

  return true;
}

export function addNewAccount(
  newAcc: Omit<UserAccount, 'id'>
): UserAccount {
  const accounts = getStoredAccounts();
  const id = `usr-custom-${Date.now()}`;
  const created: UserAccount = {
    ...newAcc,
    id,
    isDefault: false
  };
  accounts.push(created);
  saveStoredAccounts(accounts);
  return created;
}

export function deleteAccount(accountId: string): boolean {
  const accounts = getStoredAccounts();
  const target = accounts.find((a) => a.id === accountId);
  if (!target || target.isDefault) {
    return false; // Akun default tidak boleh dihapus
  }
  const filtered = accounts.filter((a) => a.id !== accountId);
  saveStoredAccounts(filtered);
  return true;
}

export function resetAllAccountsToDefault(): void {
  saveStoredAccounts(INITIAL_USER_ACCOUNTS);
  // Reset sesi aktif ke Ketua Asesi
  const session: AuthSession = {
    isLoggedIn: true,
    currentUser: INITIAL_USER_ACCOUNTS[1],
    loginTime: new Date().toISOString(),
    rememberMe: true
  };
  saveAuthSession(session);
}

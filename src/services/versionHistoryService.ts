import { BuktiVersion, StatusBuktiFisik, UserProfile, UserRole } from '../types/akreditasi';
import { getCurrentUser } from './evaluasiService';

const LOCAL_STORAGE_BUKTI_VERSIONS_KEY = 'sim_akreditasi_bukti_versions_v1';

// Initial mock seed history for SMK IT Ibnul Qayyim Makassar
const INITIAL_BUKTI_VERSIONS: BuktiVersion[] = [
  // Bukti Fisik BF-1.1.2-A (Dokumentasi bimbingan/pendampingan)
  {
    id: 'bv-112-1-v1',
    bukti_id: 'bf112-1',
    indikator_id: 'ind-1.1.2',
    indikator_kode: '1.1.2',
    version_tag: 'v1.0',
    status: 'Dalam Proses',
    previous_status: 'Belum Ada',
    file_name: 'Draf_Laporan_Bimbingan_Remedial_TP25.docx',
    file_url: 'https://drive.google.com/file/d/smkit-bimbingan-draf-v1',
    file_size: '1.4 MB',
    change_summary: 'Draf awal rekapan bimbingan belajar remedial dan klinik belajar siswa jurusan RPL & TKJ diunggah.',
    user_name: 'Ahmad Fadhil, S.Kom',
    user_role: 'Ketua Tim Asesi / Guru Produktif RPL',
    user_role_type: 'Asesi',
    timestamp: '2026-08-15T09:30:00.000Z'
  },
  {
    id: 'bv-112-1-v2',
    bukti_id: 'bf112-1',
    indikator_id: 'ind-1.1.2',
    indikator_kode: '1.1.2',
    version_tag: 'v1.1',
    status: 'Dalam Proses',
    previous_status: 'Dalam Proses',
    file_name: 'Laporan_Bimbingan_Remedial_Lengkap_Foto.pdf',
    file_url: 'https://drive.google.com/file/d/smkit-bimbingan-foto-v2',
    file_size: '3.8 MB',
    change_summary: 'Menambahkan lampiran foto dokumentasi pendampingan belajar individual dan daftar presensi siswa.',
    user_name: 'Nur Hidayah, S.Pd',
    user_role: 'Waka Kurikulum & Pembelajaran',
    user_role_type: 'Asesi',
    timestamp: '2026-09-10T14:15:00.000Z'
  },
  {
    id: 'bv-112-1-v3',
    bukti_id: 'bf112-1',
    indikator_id: 'ind-1.1.2',
    indikator_kode: '1.1.2',
    version_tag: 'v2.0',
    status: 'Tersedia',
    previous_status: 'Dalam Proses',
    file_name: 'Final_Dokumentasi_Bimbingan_Tandatangan_Kepsek.pdf',
    file_url: 'https://drive.google.com/file/d/smkit-bimbingan-final-signed',
    file_size: '4.2 MB',
    change_summary: 'Dokumen final telah disahkan Kepala Sekolah dengan stempel basah dan dinyatakan Tersedia Lengkap.',
    user_name: 'Drs. H. M. Said, M.Pd',
    user_role: 'Kepala Satuan Pendidikan & Penanggung Jawab',
    user_role_type: 'Admin',
    timestamp: '2026-09-28T11:00:00.000Z'
  },

  // Bukti Fisik BF-1.1.2-B (Catatan guru & komunikasi orang tua)
  {
    id: 'bv-112-2-v1',
    bukti_id: 'bf112-2',
    indikator_id: 'ind-1.1.2',
    indikator_kode: '1.1.2',
    version_tag: 'v1.0',
    status: 'Dalam Proses',
    previous_status: 'Belum Ada',
    file_name: 'Log_Komunikasi_Ortu_SemesterGanjil2025.pdf',
    file_url: 'https://drive.google.com/file/d/smkit-ortu-log-v1',
    file_size: '2.1 MB',
    change_summary: 'Mengunggah log panggilan orang tua dan rekaman hasil home visit siswa yang memerlukan bimbingan khusus.',
    user_name: 'Fatimah Az-Zahra, S.Sos',
    user_role: 'Koordinator BKK & Kemitraan',
    user_role_type: 'Asesi',
    timestamp: '2026-09-02T10:45:00.000Z'
  },
  {
    id: 'bv-112-2-v2',
    bukti_id: 'bf112-2',
    indikator_id: 'ind-1.1.2',
    indikator_kode: '1.1.2',
    version_tag: 'v1.1',
    status: 'Tersedia',
    previous_status: 'Dalam Proses',
    file_name: 'Log_Komunikasi_Ortu_dan_Form_Kesepakatan_Signed.pdf',
    file_url: 'https://drive.google.com/file/d/smkit-ortu-signed-v2',
    file_size: '2.9 MB',
    change_summary: 'Melengkapi form berita acara tindak lanjut pendampingan belajar bersama orang tua siswa.',
    user_name: 'Ahmad Fadhil, S.Kom',
    user_role: 'Ketua Tim Asesi / Guru Produktif RPL',
    user_role_type: 'Asesi',
    timestamp: '2026-09-22T13:20:00.000Z'
  },

  // Bukti Fisik BF-1.2.1-A (Poster/dokumen kesepakatan kelas)
  {
    id: 'bv-121-1-v1',
    bukti_id: 'bf121-1',
    indikator_id: 'ind-1.2.1',
    indikator_kode: '1.2.1',
    version_tag: 'v1.0',
    status: 'Tersedia',
    previous_status: 'Belum Ada',
    file_name: 'Foto_Kesepakatan_Kelas_Lab_RPL_dan_RuangTeori.pdf',
    file_url: 'https://drive.google.com/file/d/smkit-kesepakatan-kelas-v1',
    file_size: '5.6 MB',
    change_summary: 'Dokumentasi visual poster kesepakatan kelas di seluruh ruang kelas X, XI, XII dan Lab Komputer.',
    user_name: 'Muh. Yusuf, S.T',
    user_role: 'Kepala Lab & Bengkel IT / Sarpras',
    user_role_type: 'Asesi',
    timestamp: '2026-09-14T08:10:00.000Z'
  },

  // Bukti Fisik BF-1.2.1-B (Telaah supervisi & jurnal refleksi guru)
  {
    id: 'bv-121-2-v1',
    bukti_id: 'bf121-2',
    indikator_id: 'ind-1.2.1',
    indikator_kode: '1.2.1',
    version_tag: 'v1.0',
    status: 'Dalam Proses',
    previous_status: 'Belum Ada',
    file_name: 'Instrumen_Supervisi_Kelas_GuruProduktif.pdf',
    file_url: 'https://drive.google.com/file/d/smkit-supervisi-kelas-v1',
    file_size: '1.8 MB',
    change_summary: 'Pengunggahan instrumen supervisi internal suasana belajar dari 8 guru produktif dan adaptif.',
    user_name: 'Nur Hidayah, S.Pd',
    user_role: 'Waka Kurikulum & Pembelajaran',
    user_role_type: 'Asesi',
    timestamp: '2026-09-18T15:30:00.000Z'
  }
];

/**
 * Mengambil seluruh database riwayat versi bukti fisik dari LocalStorage
 */
export function getAllBuktiVersions(): BuktiVersion[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_BUKTI_VERSIONS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to read bukti versions from localStorage:', e);
  }
  // Inisialisasi default jika kosong
  localStorage.setItem(LOCAL_STORAGE_BUKTI_VERSIONS_KEY, JSON.stringify(INITIAL_BUKTI_VERSIONS));
  return INITIAL_BUKTI_VERSIONS;
}

/**
 * Mengambil riwayat versi spesifik untuk satu bukti fisik tertentu
 */
export function getVersionsForBukti(bukti_id: string): BuktiVersion[] {
  const all = getAllBuktiVersions();
  return all
    .filter((v) => v.bukti_id === bukti_id)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

/**
 * Menghitung tag versi berikutnya (misal jika sudah ada v1.0, v1.1 -> v1.2 atau jika status berubah signifikan -> v2.0)
 */
export function generateNextVersionTag(currentVersions: BuktiVersion[], isMajor: boolean = false): string {
  if (currentVersions.length === 0) {
    return 'v1.0';
  }

  // Cari tag versi terakhir
  const latest = currentVersions[0]; // diasumsikan sudah terurut descending
  const match = latest.version_tag.match(/^v(\d+)\.(\d+)$/);
  if (!match) {
    return `v${currentVersions.length + 1}.0`;
  }

  const major = parseInt(match[1], 10);
  const minor = parseInt(match[2], 10);

  if (isMajor) {
    return `v${major + 1}.0`;
  } else {
    return `v${major}.${minor + 1}`;
  }
}

/**
 * Menambahkan rekaman versi baru ke riwayat bukti fisik
 */
export function recordBuktiVersion(params: {
  bukti_id: string;
  indikator_id: string;
  indikator_kode?: string;
  status: StatusBuktiFisik;
  previous_status?: StatusBuktiFisik;
  file_name?: string;
  file_url?: string;
  file_size?: string;
  change_summary?: string;
  custom_version_tag?: string;
  user?: UserProfile;
}): BuktiVersion {
  const activeUser = params.user || getCurrentUser();
  const existingForBukti = getVersionsForBukti(params.bukti_id);

  // Tentukan tag versi
  const isMajor = params.status === 'Tersedia' && params.previous_status !== 'Tersedia';
  const versionTag = params.custom_version_tag || generateNextVersionTag(existingForBukti, isMajor);

  // Tentukan catatan perubahan default jika tidak diisi
  let summary = params.change_summary;
  if (!summary || summary.trim().length === 0) {
    if (params.previous_status && params.previous_status !== params.status) {
      summary = `Status dokumen diubah dari "${params.previous_status}" menjadi "${params.status}".`;
    } else if (params.file_name) {
      summary = `Pembaharuan berkas bukti fisik: ${params.file_name}`;
    } else {
      summary = `Pencatatan revisi dokumen bukti fisik status ${params.status}.`;
    }
  }

  const newVersion: BuktiVersion = {
    id: `bv-${params.bukti_id}-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    bukti_id: params.bukti_id,
    indikator_id: params.indikator_id,
    indikator_kode: params.indikator_kode,
    version_tag: versionTag,
    status: params.status,
    previous_status: params.previous_status,
    file_name: params.file_name,
    file_url: params.file_url,
    file_size: params.file_size,
    change_summary: summary.trim(),
    user_name: activeUser.name,
    user_role: `${activeUser.role} - ${activeUser.title}`,
    user_role_type: activeUser.role,
    timestamp: new Date().toISOString()
  };

  const allVersions = getAllBuktiVersions();
  const updated = [newVersion, ...allVersions];
  localStorage.setItem(LOCAL_STORAGE_BUKTI_VERSIONS_KEY, JSON.stringify(updated));

  return newVersion;
}

/**
 * Mengembalikan / Revert ke versi sebelumnya
 */
export function revertToVersion(
  targetVersion: BuktiVersion,
  user?: UserProfile
): { success: boolean; newVersion: BuktiVersion } {
  const activeUser = user || getCurrentUser();
  const existingForBukti = getVersionsForBukti(targetVersion.bukti_id);
  const nextTag = generateNextVersionTag(existingForBukti, false);

  const revertedEntry = recordBuktiVersion({
    bukti_id: targetVersion.bukti_id,
    indikator_id: targetVersion.indikator_id,
    indikator_kode: targetVersion.indikator_kode,
    status: targetVersion.status,
    previous_status: existingForBukti[0]?.status,
    file_name: targetVersion.file_name,
    file_url: targetVersion.file_url,
    file_size: targetVersion.file_size,
    change_summary: `Memulihkan (Rollback) dokumen ke ${targetVersion.version_tag} (${targetVersion.change_summary.slice(0, 75)}...).`,
    custom_version_tag: nextTag,
    user: activeUser
  });

  return {
    success: true,
    newVersion: revertedEntry
  };
}

/**
 * Format tanggal dan waktu standar Indonesia
 */
export function formatVersionTimestamp(isoString: string): { formattedDate: string; timeAgo: string } {
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) {
      return { formattedDate: isoString, timeAgo: '' };
    }

    const months = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];

    const day = d.getDate();
    const month = months[d.getMonth()];
    const year = d.getFullYear();
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');

    const formattedDate = `${day} ${month} ${year}, ${hours}:${minutes} WITA`;

    // Time ago
    const diffSeconds = Math.floor((Date.now() - d.getTime()) / 1000);
    let timeAgo = '';
    if (diffSeconds < 60) {
      timeAgo = 'Baru saja';
    } else if (diffSeconds < 3600) {
      timeAgo = `${Math.floor(diffSeconds / 60)} menit yang lalu`;
    } else if (diffSeconds < 86400) {
      timeAgo = `${Math.floor(diffSeconds / 3600)} jam yang lalu`;
    } else {
      const days = Math.floor(diffSeconds / 86400);
      timeAgo = `${days} hari yang lalu`;
    }

    return { formattedDate, timeAgo };
  } catch {
    return { formattedDate: isoString, timeAgo: '' };
  }
}

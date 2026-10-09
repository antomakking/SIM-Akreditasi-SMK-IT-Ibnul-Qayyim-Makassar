import { Komponen, Indikator, EvaluasiAsesi, IndikatorDeadline } from '../types/akreditasi';

const DEADLINES_STORAGE_KEY = 'sim_akreditasi_deadlines_v1';

export type DeadlineUrgency = 'overdue' | 'critical' | 'warning' | 'safe' | 'completed';

export interface IndikatorDeadlineInfo {
  indikatorId: string;
  kodeIndikator: string;
  namaIndikator: string;
  komponenId: string;
  komponenKode: string;
  komponenNama: string;
  butirKode: string;
  tanggalJatuhTempo: string;
  formattedDate: string;
  daysRemaining: number;
  urgency: DeadlineUrgency;
  urgencyLabel: string;
  badgeStyle: {
    bg: string;
    text: string;
    border: string;
    dotColor: string;
  };
  penanggungJawab: string;
  prioritas: 'Tinggi' | 'Sedang' | 'Normal';
  catatanTarget: string;
  isCompleted: boolean;
  isUrgent: boolean;
  statusVerifikasi: string;
  persentaseBukti: number;
  totalBukti: number;
  tersediaBukti: number;
  kekuranganBukti: number;
}

export interface DeadlineSummaryMetrics {
  total: number;
  overdueCount: number;
  criticalCount: number; // <= 3 hari
  warningCount: number;  // 4 - 7 hari
  safeCount: number;     // > 7 hari
  completedCount: number;
  urgentTotal: number;   // overdue + critical + warning
  nearestDeadlineDays: number | null;
  nearestDeadlineDate: string | null;
}

/**
 * Jadwal Standar Jatuh Tempo Indikator Akreditasi BAN-PDM SMK IT Ibnul Qayyim Makassar
 * Periode Pelaksanaan & Target Unggah Portofolio Sispena 2026
 */
export const DEFAULT_INDICATOR_DEADLINES: Record<string, IndikatorDeadline> = {
  // Komponen 1: Kinerja Pendidik (Target Minggu I - II Oktober 2026)
  'ind-1.1.1': {
    indikator_id: 'ind-1.1.1',
    tanggal_jatuh_tempo: '2026-10-09',
    penanggung_jawab: 'Ahmad Fadhil, S.Kom',
    prioritas: 'Tinggi',
    catatan_target: 'Observasi kelas & modul ajar interaksi positif',
  },
  'ind-1.1.2': {
    indikator_id: 'ind-1.1.2',
    tanggal_jatuh_tempo: '2026-10-10', // H-2 (Mendesak / Kritis)
    penanggung_jawab: 'Nur Hidayah, S.Pd',
    prioritas: 'Tinggi',
    catatan_target: 'Dokumentasi bimbingan khusus & catatan komunikasi ortu',
  },
  'ind-1.1.3': {
    indikator_id: 'ind-1.1.3',
    tanggal_jatuh_tempo: '2026-10-11', // H-3 (Mendesak / Kritis)
    penanggung_jawab: 'Nur Hidayah, S.Pd',
    prioritas: 'Tinggi',
    catatan_target: 'Jurnal refleksi murid dan bukti umpan balik growth mindset',
  },
  'ind-1.2.1': {
    indikator_id: 'ind-1.2.1',
    tanggal_jatuh_tempo: '2026-10-12', // H-4 (Mendekati)
    penanggung_jawab: 'Ahmad Fadhil, S.Kom',
    prioritas: 'Tinggi',
    catatan_target: 'Kesepakatan kelas partisipatif di seluruh rombel',
  },
  'ind-1.2.2': {
    indikator_id: 'ind-1.2.2',
    tanggal_jatuh_tempo: '2026-10-13', // H-5 (Mendekati)
    penanggung_jawab: 'Ahmad Fadhil, S.Kom',
    prioritas: 'Tinggi',
    catatan_target: 'SOP disiplin positif tanpa hukuman agresif fisik',
  },
  'ind-1.2.3': {
    indikator_id: 'ind-1.2.3',
    tanggal_jatuh_tempo: '2026-10-14', // H-6 (Mendekati)
    penanggung_jawab: 'Nur Hidayah, S.Pd',
    prioritas: 'Sedang',
    catatan_target: 'Ketertiban jadwal mengajar & manajemen jam belajar produktif',
  },
  'ind-1.3.1': {
    indikator_id: 'ind-1.3.1',
    tanggal_jatuh_tempo: '2026-10-15', // H-7 (Mendekati)
    penanggung_jawab: 'Nur Hidayah, S.Pd',
    prioritas: 'Sedang',
    catatan_target: 'Instrumen asesmen awal dan perencanaan diferensiasi',
  },

  // Komponen 2: Kepemimpinan Kepala Sekolah (Target Minggu III Oktober 2026)
  'ind-2.5.1': {
    indikator_id: 'ind-2.5.1',
    tanggal_jatuh_tempo: '2026-10-16',
    penanggung_jawab: 'Drs. H. M. Said, M.Pd',
    prioritas: 'Tinggi',
    catatan_target: 'Pedoman PKG/PKKS & laporan evaluasi kinerja guru terjadwal',
  },
  'ind-2.5.2': {
    indikator_id: 'ind-2.5.2',
    tanggal_jatuh_tempo: '2026-10-17',
    penanggung_jawab: 'Drs. H. M. Said, M.Pd',
    prioritas: 'Sedang',
    catatan_target: 'Rencana Pengembangan Keprofesian Berkelanjutan (PKB)',
  },
  'ind-2.8.1': {
    indikator_id: 'ind-2.8.1',
    tanggal_jatuh_tempo: '2026-10-18',
    penanggung_jawab: 'Muh. Yusuf, S.T',
    prioritas: 'Tinggi',
    catatan_target: 'Inventarisasi sarpras laboratorium IT & pemenuhan K3',
  },
  'ind-2.8.2': {
    indikator_id: 'ind-2.8.2',
    tanggal_jatuh_tempo: '2026-10-19',
    penanggung_jawab: 'Muh. Yusuf, S.T',
    prioritas: 'Sedang',
    catatan_target: 'Buku jadwal pemeliharaan berkala sarpras IT',
  },

  // Komponen 3: Iklim Lingkungan Belajar (Target Akhir Oktober 2026)
  'ind-3.10.1': {
    indikator_id: 'ind-3.10.1',
    tanggal_jatuh_tempo: '2026-10-21',
    penanggung_jawab: 'Drs. H. M. Said, M.Pd',
    prioritas: 'Sedang',
    catatan_target: 'Kebijakan iklim kebinekaan & toleransi antarmurid',
  },
  'ind-3.10.2': {
    indikator_id: 'ind-3.10.2',
    tanggal_jatuh_tempo: '2026-10-22',
    penanggung_jawab: 'Nur Hidayah, S.Pd',
    prioritas: 'Normal',
    catatan_target: 'Sarana ibadah dan jadwal kegiatan keagamaan sekolah',
  },
  'ind-3.14.1': {
    indikator_id: 'ind-3.14.1',
    tanggal_jatuh_tempo: '2026-10-24',
    penanggung_jawab: 'Muh. Yusuf, S.T',
    prioritas: 'Normal',
    catatan_target: 'Fasilitas sanitasi toilet bersih, air mengalir, & kantin sehat',
  },
  'ind-3.14.2': {
    indikator_id: 'ind-3.14.2',
    tanggal_jatuh_tempo: '2026-10-25',
    penanggung_jawab: 'Nur Hidayah, S.Pd',
    prioritas: 'Normal',
    catatan_target: 'Jadwal olahraga rutin & program UKS kebugaran siswa',
  },

  // Komponen 4: Kemitraan DUDIKA & Mutu Lulusan (Target Awal November 2026)
  'ind-3.15.1': {
    indikator_id: 'ind-3.15.1',
    tanggal_jatuh_tempo: '2026-10-28',
    penanggung_jawab: 'Fatimah Az-Zahra, S.Sos',
    prioritas: 'Tinggi',
    catatan_target: 'MoU industri mitra software house dan penyelarasan kurikulum',
  },
  'ind-3.15.2': {
    indikator_id: 'ind-3.15.2',
    tanggal_jatuh_tempo: '2026-10-30',
    penanggung_jawab: 'Fatimah Az-Zahra, S.Sos',
    prioritas: 'Tinggi',
    catatan_target: 'Jurnal PKL siswa di industri mitra minimal 6 bulan',
  },
  'ind-3.15.3': {
    indikator_id: 'ind-3.15.3',
    tanggal_jatuh_tempo: '2026-11-02',
    penanggung_jawab: 'Fatimah Az-Zahra, S.Sos',
    prioritas: 'Sedang',
    catatan_target: 'Jadwal mengajar guru tamu praktisi industri',
  },
  'ind-4.16.1': {
    indikator_id: 'ind-4.16.1',
    tanggal_jatuh_tempo: '2026-11-05',
    penanggung_jawab: 'Ahmad Fadhil, S.Kom',
    prioritas: 'Tinggi',
    catatan_target: 'Portofolio Uji Kompetensi Keahlian (UKK) & sertifikasi BNSP',
  },
  'ind-4.16.2': {
    indikator_id: 'ind-4.16.2',
    tanggal_jatuh_tempo: '2026-11-08',
    penanggung_jawab: 'Fatimah Az-Zahra, S.Sos',
    prioritas: 'Sedang',
    catatan_target: 'Data keterserapan lulusan (Tracer Study) BKK',
  },
};

/**
 * Mengambil konfigurasi deadline dari LocalStorage atau default
 */
export function getStoredDeadlines(): Record<string, IndikatorDeadline> {
  try {
    const raw = localStorage.getItem(DEADLINES_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(DEADLINES_STORAGE_KEY, JSON.stringify(DEFAULT_INDICATOR_DEADLINES));
      return { ...DEFAULT_INDICATOR_DEADLINES };
    }
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_INDICATOR_DEADLINES, ...parsed };
  } catch {
    return { ...DEFAULT_INDICATOR_DEADLINES };
  }
}

/**
 * Menyimpan / memperbarui tanggal jatuh tempo spesifik indikator
 */
export function saveStoredDeadline(deadline: IndikatorDeadline): void {
  try {
    const current = getStoredDeadlines();
    current[deadline.indikator_id] = deadline;
    localStorage.setItem(DEADLINES_STORAGE_KEY, JSON.stringify(current));
  } catch (err) {
    console.error('Gagal menyimpan target jatuh tempo:', err);
  }
}

/**
 * Reset jadwal deadline ke standar BAN-PDM
 */
export function resetDeadlinesToDefault(): void {
  try {
    localStorage.setItem(DEADLINES_STORAGE_KEY, JSON.stringify(DEFAULT_INDICATOR_DEADLINES));
  } catch (err) {
    console.error('Gagal reset deadline:', err);
  }
}

/**
 * Format tanggal Indonesia ramah pengguna: '10 Okt 2026'
 */
export function formatIndonesianDate(isoDateStr: string): string {
  try {
    const [year, month, day] = isoDateStr.split('-').map(Number);
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
      'Jul', 'Agt', 'Sep', 'Okt', 'Nov', 'Des'
    ];
    if (!year || !month || !day) return isoDateStr;
    return `${day} ${months[month - 1]} ${year}`;
  } catch {
    return isoDateStr;
  }
}

/**
 * Menghitung selisih hari antara tanggal jatuh tempo dengan hari ini
 * Menggunakan tanggal referensi sistem (Oktober 2026)
 */
export function calculateDaysRemaining(targetIsoDate: string): number {
  try {
    const today = new Date();
    // Normalisasi jam ke 00:00:00 untuk perbandingan hari murni
    const nowZero = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    
    const [year, month, day] = targetIsoDate.split('-').map(Number);
    const targetDate = new Date(year, month - 1, day);
    
    const diffMs = targetDate.getTime() - nowZero.getTime();
    return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  } catch {
    return 30;
  }
}

/**
 * Memeriksa apakah indikator sudah terpenuhi / selesai 100%
 */
export function isIndikatorComplete(indikator: Indikator, evaluasi?: EvaluasiAsesi): boolean {
  if (!evaluasi) return false;
  
  // Jika sudah berstatus 'Terverifikasi Valid'
  if (evaluasi.status_verifikasi === 'Terverifikasi Valid') {
    // Pastikan tidak ada bukti wajib yang masih Belum Ada
    const buktiList = indikator.bukti_fisik || [];
    if (buktiList.length === 0) return true;
    
    const hasMissingWajib = buktiList.some(bf => {
      const status = evaluasi.bukti_checklist?.[bf.id];
      return bf.wajib && status !== 'Tersedia';
    });
    
    return !hasMissingWajib;
  }
  
  return false;
}

/**
 * Evaluasi status jatuh tempo untuk satu indikator
 */
export function evaluateIndikatorDeadline(
  indikator: Indikator,
  komponen: Komponen,
  butirKode: string,
  evaluasi?: EvaluasiAsesi,
  customDeadline?: IndikatorDeadline
): IndikatorDeadlineInfo {
  const deadlineConfig = customDeadline || DEFAULT_INDICATOR_DEADLINES[indikator.id] || {
    indikator_id: indikator.id,
    tanggal_jatuh_tempo: '2026-10-31',
    penanggung_jawab: 'Tim Asesi Sekolah',
    prioritas: 'Normal' as const,
    catatanTarget: 'Kelengkapan evaluasi diri dan portofolio bukti fisik',
  };

  const isoDate = deadlineConfig.tanggal_jatuh_tempo;
  const days = calculateDaysRemaining(isoDate);
  const completed = isIndikatorComplete(indikator, evaluasi);

  // Hitung pemenuhan bukti fisik
  const buktiList = indikator.bukti_fisik || [];
  const totalBukti = buktiList.length;
  let tersediaBukti = 0;
  let dalamProsesBukti = 0;
  let belumAdaBukti = 0;

  buktiList.forEach(bf => {
    const st = evaluasi?.bukti_checklist?.[bf.id];
    if (st === 'Tersedia') tersediaBukti++;
    else if (st === 'Dalam Proses') dalamProsesBukti++;
    else belumAdaBukti++;
  });

  const persentaseBukti = totalBukti > 0 ? Math.round((tersediaBukti / totalBukti) * 100) : 0;
  const kekuranganBukti = totalBukti - tersediaBukti;

  let urgency: DeadlineUrgency = 'safe';
  let urgencyLabel = '';
  let badgeStyle = {
    bg: 'bg-slate-50',
    text: 'text-slate-700',
    border: 'border-slate-200',
    dotColor: '#94A3B8',
  };

  if (completed) {
    urgency = 'completed';
    urgencyLabel = 'Selesai Tepat Waktu';
    badgeStyle = {
      bg: 'bg-emerald-50',
      text: 'text-emerald-800',
      border: 'border-emerald-200',
      dotColor: '#16A34A',
    };
  } else if (days < 0) {
    urgency = 'overdue';
    urgencyLabel = `Terlambat ${Math.abs(days)} Hari`;
    badgeStyle = {
      bg: 'bg-rose-50',
      text: 'text-rose-800',
      border: 'border-rose-200',
      dotColor: '#DC2626',
    };
  } else if (days === 0) {
    urgency = 'critical';
    urgencyLabel = 'Jatuh Tempo Hari Ini!';
    badgeStyle = {
      bg: 'bg-rose-50',
      text: 'text-rose-800',
      border: 'border-rose-200',
      dotColor: '#DC2626',
    };
  } else if (days <= 3) {
    urgency = 'critical';
    urgencyLabel = `H-${days} (${days} Hari Lagi)`;
    badgeStyle = {
      bg: 'bg-rose-50',
      text: 'text-rose-800',
      border: 'border-rose-200',
      dotColor: '#DC2626',
    };
  } else if (days <= 7) {
    urgency = 'warning';
    urgencyLabel = `H-${days} (${days} Hari Lagi)`;
    badgeStyle = {
      bg: 'bg-amber-50',
      text: 'text-amber-800',
      border: 'border-amber-200',
      dotColor: '#D97706',
    };
  } else {
    urgency = 'safe';
    urgencyLabel = `${days} Hari Lagi`;
    badgeStyle = {
      bg: 'bg-slate-50',
      text: 'text-slate-700',
      border: 'border-slate-200',
      dotColor: '#64748B',
    };
  }

  const isUrgent = !completed && (urgency === 'overdue' || urgency === 'critical' || urgency === 'warning');

  return {
    indikatorId: indikator.id,
    kodeIndikator: indikator.kode,
    namaIndikator: indikator.nama,
    komponenId: komponen.id,
    komponenKode: komponen.kode,
    komponenNama: komponen.nama,
    butirKode,
    tanggalJatuhTempo: isoDate,
    formattedDate: formatIndonesianDate(isoDate),
    daysRemaining: days,
    urgency,
    urgencyLabel,
    badgeStyle,
    penanggungJawab: deadlineConfig.penanggung_jawab || 'Tim Asesi Sekolah',
    prioritas: deadlineConfig.prioritas || 'Normal',
    catatanTarget: deadlineConfig.catatan_target || 'Pemenuhan instrumen & portofolio bukti fisik',
    isCompleted: completed,
    isUrgent,
    statusVerifikasi: evaluasi?.status_verifikasi || 'Belum Diisi',
    persentaseBukti,
    totalBukti,
    tersediaBukti,
    kekuranganBukti,
  };
}

/**
 * Menghasilkan semua daftar peringatan deadline indikator
 */
export function getAllDeadlineAlerts(
  komponenList: Komponen[],
  evaluasiMap: Record<string, EvaluasiAsesi>
): IndikatorDeadlineInfo[] {
  const storedDeadlines = getStoredDeadlines();
  const list: IndikatorDeadlineInfo[] = [];

  komponenList.forEach(k => {
    k.butir?.forEach(b => {
      b.indikator?.forEach(ind => {
        const evalItem = evaluasiMap[ind.id];
        const customDeadline = storedDeadlines[ind.id];
        const info = evaluateIndikatorDeadline(ind, k, b.kode, evalItem, customDeadline);
        list.push(info);
      });
    });
  });

  // Urutkan: Terlambat & Kritis paling atas, lalu Warning, Safe, terakhir Completed
  return list.sort((a, b) => {
    // Completed paling bawah
    if (a.isCompleted && !b.isCompleted) return 1;
    if (!a.isCompleted && b.isCompleted) return -1;
    
    // Urutkan sisa hari dari terkecil
    return a.daysRemaining - b.daysRemaining;
  });
}

/**
 * Ringkasan metrik jatuh tempo
 */
export function getDeadlineSummaryMetrics(alerts: IndikatorDeadlineInfo[]): DeadlineSummaryMetrics {
  let overdueCount = 0;
  let criticalCount = 0;
  let warningCount = 0;
  let safeCount = 0;
  let completedCount = 0;

  let nearestDeadlineDays: number | null = null;
  let nearestDeadlineDate: string | null = null;

  alerts.forEach(item => {
    if (item.isCompleted) {
      completedCount++;
    } else {
      if (item.urgency === 'overdue') overdueCount++;
      else if (item.urgency === 'critical') criticalCount++;
      else if (item.urgency === 'warning') warningCount++;
      else safeCount++;

      if (nearestDeadlineDays === null || item.daysRemaining < nearestDeadlineDays) {
        nearestDeadlineDays = item.daysRemaining;
        nearestDeadlineDate = item.formattedDate;
      }
    }
  });

  return {
    total: alerts.length,
    overdueCount,
    criticalCount,
    warningCount,
    safeCount,
    completedCount,
    urgentTotal: overdueCount + criticalCount + warningCount,
    nearestDeadlineDays,
    nearestDeadlineDate,
  };
}

/**
 * Hitung jumlah indikator mendesak per komponen
 */
export function getComponentUrgentCount(komponenId: string, alerts: IndikatorDeadlineInfo[]): {
  urgentCount: number;
  criticalCount: number;
  nearestDays: number | null;
} {
  const compAlerts = alerts.filter(a => a.komponenId === komponenId && !a.isCompleted);
  const urgent = compAlerts.filter(a => a.isUrgent);
  const critical = compAlerts.filter(a => a.urgency === 'critical' || a.urgency === 'overdue');

  let nearestDays: number | null = null;
  compAlerts.forEach(a => {
    if (nearestDays === null || a.daysRemaining < nearestDays) {
      nearestDays = a.daysRemaining;
    }
  });

  return {
    urgentCount: urgent.length,
    criticalCount: critical.length,
    nearestDays,
  };
}

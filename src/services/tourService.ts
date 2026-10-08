import { driver, DriveStep, Config } from 'driver.js';
import 'driver.js/dist/driver.css';

const TOUR_COMPLETED_KEY = 'sim_akreditasi_tour_completed_v1';

export type TourType = 'full' | 'dashboard' | 'instrumen';

export function hasCompletedTour(): boolean {
  return localStorage.getItem(TOUR_COMPLETED_KEY) === 'true';
}

export function setTourCompleted(completed: boolean = true): void {
  localStorage.setItem(TOUR_COMPLETED_KEY, completed ? 'true' : 'false');
}

export function startAppTour(options: {
  type?: TourType;
  activeTab: 'dashboard' | 'instrumen' | 'sql' | 'vanilla';
  setActiveTab: (tab: 'dashboard' | 'instrumen' | 'sql' | 'vanilla') => void;
  onTourEnd?: () => void;
}) {
  const { type = 'full', activeTab, setActiveTab, onTourEnd } = options;

  const dashboardSteps: DriveStep[] = [
    {
      element: '#header-brand',
      popover: {
        title: '🏫 SIM Akreditasi SMK IT Ibnul Qayyim',
        description: 'Selamat datang! Sistem ini dirancang untuk mengelola evaluasi diri akreditasi BAN-PDM, portofolio bukti fisik, dan estimasi nilai akhir berbasis instrumen vokasi 4 komponen.',
        side: 'bottom',
        align: 'start',
      }
    },
    {
      element: '#header-role-selector',
      popover: {
        title: '👥 Multi-Role & Hak Akses',
        description: 'Anda dapat beralih peran antara Admin (Kepala Sekolah), Asesi (Tim Mutu/Guru), Validator (Asesor BAN-PDM), atau Viewer (Tamu). Setiap peran memiliki izin akses yang disesuaikan.',
        side: 'bottom',
        align: 'end',
      }
    },
    {
      element: '#header-nav-tabs',
      popover: {
        title: '📑 Navigasi Menu Utama',
        description: 'Akses cepat antar Dashboard Ringkasan, Instrumen Evaluasi Diri, SQL Studio untuk analisis database, dan Vanilla JS Playground.',
        side: 'bottom',
        align: 'center',
      }
    },
    {
      element: '#dashboard-banner',
      popover: {
        title: '🏛️ Profil & Masa Berlaku Akreditasi',
        description: 'Menampilkan data resmi SMK IT Ibnul Qayyim Makassar, NPSN, SK BAN-PDM, predikat akreditasi A (Unggul), dan hitung mundur masa berlaku sertifikat.',
        side: 'bottom',
        align: 'center',
      }
    },
    {
      element: '#dashboard-executive-summary',
      popover: {
        title: '📊 Ringkasan Eksekutif & Estimasi Nilai',
        description: 'Kartu kalkulasi otomatis nilai akhir akreditasi berdasarkan bobot resmi 4 komponen (Kinerja Guru, Kepemimpinan, Iklim Lingkungan, dan Hasil Belajar/Vokasi).',
        side: 'top',
        align: 'center',
      }
    },
    {
      element: '#dashboard-analytics-bento',
      popover: {
        title: '📈 Analitik Distribusi & Level Capaian',
        description: 'Grafik komparasi progres per butir dan ringkasan distribusi capaian 4 Level Rubrik: Level 1 (Merah), Level 2 (Kuning), Level 3 (Biru), dan Level 4 (Hijau).',
        side: 'top',
        align: 'center',
      }
    },
  ];

  const instrumenSteps: DriveStep[] = [
    {
      element: '#instrumen-komponen-tabs',
      popover: {
        title: '📚 4 Komponen Utama Akreditasi',
        description: 'Pilih komponen instrumen yang ingin dievaluasi: Kinerja Pendidik (35%), Kepemimpinan (25%), Iklim Lingkungan (15%), atau Hasil Belajar Lulusan (25%).',
        side: 'bottom',
        align: 'start',
      }
    },
    {
      element: '.instrumen-card-indicator:first-of-type',
      popover: {
        title: '📝 Kartu Indikator Kinerja BAN-PDM',
        description: 'Setiap butir memuat nomor indikator, definisi operasional, dan petunjuk teknis penilaian mutu sekolah.',
        side: 'top',
        align: 'start',
      }
    },
    {
      element: '.instrumen-card-indicator:first-of-type .rubrik-matrix-container',
      popover: {
        title: '🎨 4 Level Rubrik Bergradasi Warna',
        description: 'Pilih capaian mutu riil sekolah dari Level 1 (Merah: Kurang), Level 2 (Kuning: Cukup), Level 3 (Biru: Baik), hingga Level 4 (Hijau: Sangat Baik / Unggul).',
        side: 'top',
        align: 'center',
      }
    },
    {
      element: '.instrumen-card-indicator:first-of-type .bukti-checklist-container',
      popover: {
        title: '📂 Checklist & Riwayat Versi Bukti Fisik',
        description: 'Tandai status dokumen (Tersedia, Dalam Proses, Belum Ada). Klik tombol "Riwayat Versi" pada berkas untuk meninjau riwayat unggahan, revisi, atau memulihkan versi lama.',
        side: 'top',
        align: 'center',
      }
    },
    {
      element: '.instrumen-card-indicator:first-of-type .ai-assistant-btn',
      popover: {
        title: '✨ Asisten Pintar Gemini AI',
        description: 'Klik tombol ini untuk mendapatkan rekomendasi narasi evaluasi diri otomatis berbasis AI yang disesuaikan dengan definisi operasional BAN-PDM.',
        side: 'left',
        align: 'center',
      }
    },
    {
      element: '.instrumen-card-indicator:first-of-type .validator-review-panel',
      popover: {
        title: '🛡️ Panel Verifikasi Validator / Asesor',
        description: 'Validator dan Auditor internal dapat mengaudit dokumen, memberi catatan pembinaan, dan mengubah status menjadi "Terverifikasi Valid" atau "Perlu Perbaikan".',
        side: 'top',
        align: 'center',
      }
    },
    {
      element: '#header-export-btn',
      popover: {
        title: '📑 Ekspor & Laporan Resmi Akreditasi',
        description: 'Cetak dan unduh Berita Acara, Lembar Evaluasi Diri (LED), atau Salinan Sertifikat Akreditasi untuk arsip visitasi.',
        side: 'bottom',
        align: 'end',
      }
    }
  ];

  let steps: DriveStep[] = [];

  if (type === 'dashboard') {
    if (activeTab !== 'dashboard') setActiveTab('dashboard');
    steps = dashboardSteps;
  } else if (type === 'instrumen') {
    if (activeTab !== 'instrumen') setActiveTab('instrumen');
    steps = instrumenSteps;
  } else {
    // Full Tour
    steps = [
      ...dashboardSteps,
      {
        element: '#header-tab-instrumen',
        popover: {
          title: '➡️ Beralih ke Instrumen Evaluasi',
          description: 'Mari kita lihat bagaimana proses pengisian instrumen, pemilihan rubrik, asisten AI, dan riwayat versi dokumen.',
          side: 'bottom',
          align: 'center',
        }
      },
      ...instrumenSteps
    ];
  }

  const driverObj = driver({
    showProgress: true,
    animate: true,
    allowClose: true,
    overlayColor: 'rgba(15, 23, 42, 0.75)',
    stagePadding: 6,
    stageRadius: 10,
    doneBtnText: '🎉 Selesai & Paham',
    nextBtnText: 'Lanjut ➔',
    prevBtnText: '⬅ Kembali',
    progressText: 'Langkah {{current}} dari {{total}}',
    steps,
    onDestroyed: () => {
      setTourCompleted(true);
      if (onTourEnd) onTourEnd();
    },
    onHighlightStarted: (element, step) => {
      // If we encounter step pointing to instrumen tabs, switch tabs automatically
      if (step?.element === '#header-tab-instrumen' || String(step?.element).includes('instrumen-')) {
        if (activeTab !== 'instrumen') {
          setActiveTab('instrumen');
        }
      } else if (String(step?.element).includes('dashboard-')) {
        if (activeTab !== 'dashboard') {
          setActiveTab('dashboard');
        }
      }
    }
  });

  driverObj.drive();
}

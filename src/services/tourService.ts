import { driver, DriveStep, Driver } from 'driver.js';
import 'driver.js/dist/driver.css';

const TOUR_COMPLETED_KEY = 'sim_akreditasi_tour_completed_v1';

export type TourType = 'full' | 'dashboard' | 'instrumen';

export function hasCompletedTour(): boolean {
  return localStorage.getItem(TOUR_COMPLETED_KEY) === 'true';
}

export function setTourCompleted(completed: boolean = true): void {
  localStorage.setItem(TOUR_COMPLETED_KEY, completed ? 'true' : 'false');
}

// Track active instance to prevent duplicate overlapping tours
let activeTourInstance: Driver | null = null;
let globalTourClickListener: ((e: MouseEvent) => void) | null = null;

function cleanupTourArtifacts(): void {
  document.body.classList.remove('driver-active', 'driver-fade', 'driver-simple', 'driver-no-scroll');
  document.querySelectorAll('.driver-popover, .driver-overlay, #driver-dummy-element').forEach((el) => {
    try {
      el.remove();
    } catch {
      // ignore
    }
  });
  if (globalTourClickListener) {
    document.removeEventListener('click', globalTourClickListener, true);
    globalTourClickListener = null;
  }
}

export function stopAppTour(): void {
  if (activeTourInstance) {
    try {
      if (activeTourInstance.isActive()) {
        activeTourInstance.destroy();
      }
    } catch {
      // ignore
    }
    activeTourInstance = null;
  }
  cleanupTourArtifacts();
}

/**
 * Helper menunggu elemen DOM selesai dimount oleh React sebelum driver diarahkan ke langkah terkait
 */
function waitForSelector(selector: string, timeout = 1200): Promise<Element | null> {
  return new Promise((resolve) => {
    try {
      const existing = document.querySelector(selector);
      if (existing) return resolve(existing);
    } catch {
      // jika selector kompleks
    }

    const start = Date.now();
    const interval = setInterval(() => {
      try {
        const el = document.querySelector(selector);
        if (el) {
          clearInterval(interval);
          resolve(el);
          return;
        }
      } catch {
        // ignore
      }
      if (Date.now() - start >= timeout) {
        clearInterval(interval);
        resolve(null);
      }
    }, 35);
  });
}

export function startAppTour(options: {
  type?: TourType;
  activeTab: string;
  setActiveTab: (tab: any) => void;
  onTourEnd?: () => void;
}) {
  const { type = 'full', activeTab: initialActiveTab, setActiveTab, onTourEnd } = options;

  // Hentikan tour aktif sebelumnya jika ada dan bersihkan DOM
  stopAppTour();

  let currentTab = initialActiveTab;

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
        description: 'Anda dapat beralih peran antara Admin (Kepala Sekolah), Asesi (Tim Mutu/Guru), Validator (Asesor BAN-PDM), atau Viewer (Tamu). Setiap peran memiliki hak akses yang disesuaikan.',
        side: 'bottom',
        align: 'end',
      }
    },
    {
      element: '#header-tour-btn',
      popover: {
        title: '🧭 Panduan Tour Interaktif',
        description: 'Tombol ini siap membantu Anda mempelajari seluruh alur kerja sistem kapan pun Anda butuhkan panduan langkah demi langkah.',
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
      element: '#dashboard-deadline-alerts',
      popover: {
        title: '⏰ Peringatan Jatuh Tempo & Deadline Akreditasi',
        description: 'Notifikasi proaktif untuk indikator yang mendekati batas waktu unggah BAN-PDM (Kritis ≤ 3 hari, Mendekati 4-7 hari). Anda dapat mengatur tanggal target, menunjuk PIC asesi, dan langsung membuka butir yang perlu dilengkapi.',
        side: 'top',
        align: 'center',
      }
    },
    {
      element: '#dashboard-executive-summary',
      popover: {
        title: '📊 Ringkasan Eksekutif & Estimasi Nilai',
        description: 'Kalkulasi otomatis nilai akhir akreditasi berdasarkan bobot resmi 4 komponen (Kinerja Guru 35%, Kepemimpinan 25%, Iklim Lingkungan 15%, dan Hasil Belajar/Vokasi 25%).',
        side: 'top',
        align: 'center',
      }
    },
    {
      element: '#dashboard-document-fulfillment',
      popover: {
        title: '📁 Progress Pemenuhan Dokumen & Kekurangan Berkas',
        description: 'Pantau persentase kesiapan bukti fisik per komponen (K1-K4), temukan berkas yang berstatus Belum Ada atau Dalam Proses, serta salin daftar dokumen yang masih kurang.',
        side: 'top',
        align: 'center',
      }
    },
    {
      element: '#dashboard-analytics-bento',
      popover: {
        title: '📈 Analitik Distribusi & Level Capaian',
        description: 'Grafik komparasi progres per butir dan ringkasan distribusi capaian 4 Level Rubrik: Level 1 (Kurang), Level 2 (Cukup), Level 3 (Baik), dan Level 4 (Unggul).',
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
      element: '.instrumen-card-indicator',
      popover: {
        title: '📝 Kartu Indikator Kinerja BAN-PDM',
        description: 'Setiap butir memuat nomor indikator, definisi operasional BAN-PDM, dan petunjuk teknis penilaian mutu sekolah vokasi.',
        side: 'top',
        align: 'start',
      }
    },
    {
      element: '.instrumen-card-indicator .rubrik-matrix-container',
      popover: {
        title: '🎨 4 Level Rubrik Bergradasi Warna',
        description: 'Pilih capaian mutu riil sekolah dari Level 1 (Merah: Kurang), Level 2 (Kuning: Cukup), Level 3 (Biru: Baik), hingga Level 4 (Hijau: Sangat Baik / Unggul). Nilai skor otomatis terkalkulasi.',
        side: 'top',
        align: 'center',
      }
    },
    {
      element: '.instrumen-card-indicator .bukti-checklist-container',
      popover: {
        title: '📂 Checklist & Riwayat Versi Bukti Fisik',
        description: 'Tandai status dokumen (Tersedia, Dalam Proses, Belum Ada). Klik tombol "Riwayat Versi" pada berkas untuk meninjau riwayat unggahan, revisi, atau memulihkan versi lama.',
        side: 'top',
        align: 'center',
      }
    },
    {
      element: '.instrumen-card-indicator .ai-assistant-btn',
      popover: {
        title: '✨ Asisten Pintar Gemini AI',
        description: 'Klik tombol ini untuk mendapatkan rekomendasi narasi evaluasi diri otomatis berbasis AI yang diselaraskan dengan definisi operasional BAN-PDM dan bukti fisik.',
        side: 'left',
        align: 'center',
      }
    },
    {
      element: '.instrumen-card-indicator .evaluasi-catatan-section',
      popover: {
        title: '✍️ Catatan Evaluasi Diri Asesi & Verifikasi',
        description: 'Tuliskan deskripsi kondisi faktual sekolah. Fitur auto-save otomatis menyimpan draf penulisan Anda setiap kali selesai mengetik.',
        side: 'top',
        align: 'center',
      }
    },
    {
      element: '#instrumen-reviewer-notes-btn',
      popover: {
        title: '💬 Catatan Reviewer & Kolaborasi Tim',
        description: 'Buka panel samping catatan reviewer untuk melihat masukan pembinaan, komentar asesor internal, dan feedback kolaboratif.',
        side: 'bottom',
        align: 'center',
      }
    },
    {
      element: '#instrumen-print-preview-btn',
      popover: {
        title: '🖨️ Pratinjau Cetak Formal (Print Preview)',
        description: 'Fitur tampilan dokumen resmi cetak instrumen evaluasi diri BAN-PDM lengkap dengan Kop Surat resmi, tabel rekapitulasi, indikator terformat rapi, dan Lembar Pengesahan bertanda tangan 3 kolom.',
        side: 'bottom',
        align: 'center',
      }
    },
    {
      element: '#header-export-btn',
      popover: {
        title: '📑 Ekspor & Laporan Resmi Akreditasi',
        description: 'Cetak dan unduh Berita Acara, Lembar Evaluasi Diri (LED), atau Salinan Sertifikat Akreditasi untuk arsip visitasi BAN-PDM.',
        side: 'bottom',
        align: 'end',
      }
    }
  ];

  let steps: DriveStep[] = [];

  if (type === 'dashboard') {
    if (currentTab !== 'dashboard') {
      currentTab = 'dashboard';
      setActiveTab('dashboard');
    }
    steps = dashboardSteps;
  } else if (type === 'instrumen') {
    if (currentTab !== 'instrumen') {
      currentTab = 'instrumen';
      setActiveTab('instrumen');
    }
    steps = instrumenSteps;
  } else {
    // Full Tour
    if (currentTab !== 'dashboard') {
      currentTab = 'dashboard';
      setActiveTab('dashboard');
    }
    steps = [
      ...dashboardSteps,
      {
        element: '#header-nav-tabs',
        popover: {
          title: '➡️ Beralih ke Instrumen Evaluasi Diri',
          description: 'Selanjutnya kita akan melihat bagaimana cara mengisi instrumen evaluasi diri, memilih rubrik capaian, checklist bukti fisik, asisten AI, dan pratinjau cetak formal.',
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
    allowKeyboardControl: true,
    overlayColor: 'rgba(15, 23, 42, 0.72)',
    stagePadding: 8,
    stageRadius: 12,
    popoverOffset: 12,
    doneBtnText: '🎉 Selesai & Paham',
    nextBtnText: 'Lanjut ➔',
    prevBtnText: '⬅ Kembali',
    progressText: 'Langkah {{current}} dari {{total}}',
    steps,
    disableActiveInteraction: false,
    skipMissingElement: false,
    waitForElement: 1200,
    onDestroyed: () => {
      setTourCompleted(true);
      activeTourInstance = null;
      cleanupTourArtifacts();
      if (onTourEnd) onTourEnd();
    },
    onNextClick: (_element, _step, hookOpts) => {
      const currentDriver = hookOpts?.driver || activeTourInstance || driverObj;
      const activeIdx = currentDriver.getActiveIndex() ?? 0;
      const nextIdx = activeIdx + 1;

      // Jika sudah di langkah terakhir, tutup tour dengan sukses
      if (nextIdx >= steps.length) {
        currentDriver.destroy();
        return;
      }

      const nextStep = steps[nextIdx];
      const nextElStr = String(nextStep?.element || '');

      const isInstrumenEl =
        nextElStr.includes('instrumen-') ||
        nextElStr.includes('indikator-') ||
        nextElStr.includes('bukti-') ||
        nextElStr.includes('ai-') ||
        nextElStr.includes('evaluasi-');

      const isDashboardEl = nextElStr.includes('dashboard-');

      // Perpindahan otomatis ke tab instrumen jika elemen berikutnya ada di instrumen dan belum aktif
      if (isInstrumenEl && currentTab !== 'instrumen') {
        currentTab = 'instrumen';
        setActiveTab('instrumen');
        waitForSelector(nextElStr).then(() => {
          currentDriver.moveTo(nextIdx);
        });
        return;
      }

      // Perpindahan otomatis ke tab dashboard jika elemen berikutnya ada di dashboard dan belum aktif
      if (isDashboardEl && currentTab !== 'dashboard') {
        currentTab = 'dashboard';
        setActiveTab('dashboard');
        waitForSelector(nextElStr).then(() => {
          currentDriver.moveTo(nextIdx);
        });
        return;
      }

      // Berpindah langsung jika berada di tab yang sama
      currentDriver.moveTo(nextIdx);
    },
    onPrevClick: (_element, _step, hookOpts) => {
      const currentDriver = hookOpts?.driver || activeTourInstance || driverObj;
      const activeIdx = currentDriver.getActiveIndex() ?? 0;
      const prevIdx = activeIdx - 1;

      if (prevIdx < 0) {
        return;
      }

      const prevStep = steps[prevIdx];
      const prevElStr = String(prevStep?.element || '');

      const isDashboardEl = prevElStr.includes('dashboard-');
      const isInstrumenEl =
        prevElStr.includes('instrumen-') ||
        prevElStr.includes('indikator-') ||
        prevElStr.includes('bukti-') ||
        prevElStr.includes('ai-') ||
        prevElStr.includes('evaluasi-');

      // Beralih ke dashboard jika langkah sebelumnya ada di dashboard
      if (isDashboardEl && currentTab !== 'dashboard') {
        currentTab = 'dashboard';
        setActiveTab('dashboard');
        waitForSelector(prevElStr).then(() => {
          currentDriver.moveTo(prevIdx);
        });
        return;
      }

      // Beralih ke instrumen jika langkah sebelumnya ada di instrumen
      if (isInstrumenEl && currentTab !== 'instrumen') {
        currentTab = 'instrumen';
        setActiveTab('instrumen');
        waitForSelector(prevElStr).then(() => {
          currentDriver.moveTo(prevIdx);
        });
        return;
      }

      currentDriver.moveTo(prevIdx);
    },
    onCloseClick: (_element, _step, hookOpts) => {
      const currentDriver = hookOpts?.driver || activeTourInstance || driverObj;
      currentDriver.destroy();
    }
  });

  activeTourInstance = driverObj;

  // Tunggu sejenak jika tab baru saja berganti agar komponen DOM selesai dimount
  const delay = (type === 'full' && initialActiveTab !== 'dashboard') ||
                (type === 'instrumen' && initialActiveTab !== 'instrumen') ||
                (type === 'dashboard' && initialActiveTab !== 'dashboard')
                ? 160 : 50;

  setTimeout(() => {
    driverObj.drive();
  }, delay);
}

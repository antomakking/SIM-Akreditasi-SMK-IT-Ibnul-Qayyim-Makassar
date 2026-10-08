export interface AiSuggestionRequest {
  kodeIndikator: string;
  namaIndikator: string;
  definisiOperasional: string;
  levelCapaian?: number;
  kategoriCapaian?: string;
  deskripsiRubrik?: string;
  buktiFisikList?: Array<{
    kode: string;
    nama: string;
    status: string;
    wajib?: boolean;
  }>;
  catatanSaatIni?: string;
  tipePermintaan?: 'rekomendasi_lengkap' | 'ringkas' | 'penyempurnaan' | 'rekomendasi_bukti';
}

export interface AiSuggestionResult {
  ringkasanKesesuaian: string;
  saranCatatanEvaluasi: string;
  poinKunci: string[];
  rekomendasiDokumen: string[];
  tipsAsesor: string;
}

export interface AiApiResponse {
  success: boolean;
  data: AiSuggestionResult;
  model?: string;
  source?: string;
  error?: string;
  details?: string;
}

/**
 * Generator lokal cerdas berbasis konteks SMK IT Ibnul Qayyim Makassar
 * Digunakan sebagai fallback andal jika terjadi timeout atau gangguan koneksi jaringan.
 */
export function generateLocalSaran(request: AiSuggestionRequest): AiSuggestionResult {
  const kode = request.kodeIndikator || 'K1.1';
  const nama = request.namaIndikator || 'Penyelarasan Mutu BAN-PDM';
  const def = request.definisiOperasional || 'Pelaksanaan proses pembelajaran dan tata kelola satuan pendidikan sesuai standar instrumen BAN-PDM.';
  const level = Number(request.levelCapaian) || 4;
  const kategori = request.kategoriCapaian || (level === 4 ? 'Kinerja Unggul' : level === 3 ? 'Kinerja Baik' : level === 2 ? 'Kinerja Cukup' : 'Kinerja Kurang');
  const tipe = request.tipePermintaan || 'rekomendasi_lengkap';
  const catatan = request.catatanSaatIni || '';
  const buktiList = request.buktiFisikList || [];

  const buktiTersedia = buktiList
    .filter((b) => b.status === 'Tersedia')
    .map((b) => b.nama || b.kode);

  let narasi = '';

  if (tipe === 'ringkas') {
    narasi = `SMK IT Ibnul Qayyim Makassar telah merealisasikan pemenuhan ${kode} (${nama}) pada Level ${level} (${kategori}). Penyelarasan kurikulum kejuruan teknologi informasi dengan pembiasaan karakter dan adab islami terlaksana secara terstruktur.

Dukungan bukti fisik (${buktiTersedia.length > 0 ? buktiTersedia.slice(0, 3).join(', ') : 'SOP, perangkat kurikulum merdeka, dan portofolio digital'}) telah diarsipkan secara sistematis dalam repositori sekolah dan siap diverifikasi oleh asesor BAN-PDM.`;
  } else if (tipe === 'penyempurnaan' && catatan.trim().length > 15) {
    narasi = `${catatan.trim()}

[Penyempurnaan Standar BAN-PDM Level ${level} - ${kategori}]:
Pelaksanaan program pada indikator ${kode} (${nama}) di SMK IT Ibnul Qayyim Makassar telah diintegrasikan ke dalam siklus penjaminan mutu internal (RKT/RKAS). Sinergi antara dewan guru, peserta didik, dan mitra DUDIKA bidang teknologi informasi memastikan capaian kinerja terukur, terdokumentasi, dan berdampak positif pada peningkatan mutu lulusan.`;
  } else if (tipe === 'rekomendasi_bukti') {
    narasi = `Untuk memenuhi indikator ${kode} (${nama}) pada Level ${level}, SMK IT Ibnul Qayyim Makassar menyiapkan bukti fisik berjenjang:

1. Dokumen Pokok: ${buktiTersedia.length > 0 ? buktiTersedia.join(', ') : 'SK penetapan tim pengembang, program kerja tahunan, modul ajar terdiferensiasi'}.
2. Dokumen Digital: Repositori cloud drive arsip sekolah, dokumentasi visual pelaksanaan kegiatan, dan portofolio produk kejuruan IT peserta didik.

Semua berkas telah divalidasi oleh tim penjaminan mutu internal dan siap diverifikasi saat visitasi asesor BAN-PDM.`;
  } else {
    // Default: rekomendasi_lengkap
    narasi = `SMK IT Ibnul Qayyim Makassar secara konsisten dan terencana telah mengimplementasikan ${nama} (${kode}) sesuai standar capaian Level ${level} (${kategori}) instrumen akreditasi BAN-PDM SMK/MAK 2024 (Versi 2025). Pelaksanaan program didasarkan pada definisi operasional instrumen yang menekankan keunggulan kejuruan teknologi informasi yang diselaraskan dengan pembiasaan adab dan karakter islami.

Proses pelaksanaan melibatkan kolaborasi aktif antara kepala sekolah, tim kurikulum, guru produktif IT, komite sekolah, serta kemitraan Dunia Usaha dan Dunia Industri Kerja (DUDIKA). Modul ajar terdiferensiasi dan instrumen asesmen dirancang adaptif terhadap kebutuhan dunia kerja di era digital.

Ketercapaian indikator ini didukung oleh ketersediaan bukti fisik yang sahih dan mutakhir, seperti ${buktiTersedia.length > 0 ? buktiTersedia.join(', ') : 'SK Tim Pengembang, modul ajar, dokumen kemitraan industri, serta instrumen monitoring berkala'}. Repositori digital sekolah memastikan keterbukaan akses dokumen untuk mempermudah verifikasi dan validasi saat visitasi asesor BAN-PDM.

Evaluasi dan tindak lanjut berkala secara konsisten dilaksanakan setiap semester guna menjaga siklus perbaikan mutu berkelanjutan di SMK IT Ibnul Qayyim Makassar.`;
  }

  const ringkasanKesesuaian = `Berdasarkan definisi operasional "${def.length > 90 ? def.slice(0, 90) + '...' : def}", kondisi faktual SMK IT Ibnul Qayyim Makassar memenuhi kriteria ${kategori} (Level ${level}) dengan dukungan bukti fisik yang valid.`;

  const poinKunci = [
    `Penyelarasan kurikulum kejuruan IT dan nilai karakter islami di SMK IT`,
    `Pelibatan kolaboratif manajemen sekolah, pendidik, dan mitra DUDIKA`,
    `Ketersediaan arsip bukti fisik lengkap (${buktiTersedia.length} dokumen terkonfirmasi siap)`,
    `Siklus evaluasi, monitoring, dan refleksi tindak lanjut mutu berkala`,
  ];

  const rekomendasiDokumen = buktiList.length > 0
    ? buktiList.slice(0, 4).map((b) => `${b.nama || 'Dokumen Bukti'} (${b.kode || 'BF'}) - [Status: ${b.status || 'Tersedia'}]`)
    : [
        'SK Penetapan Tim Pengembang & Penjaminan Mutu Sekolah',
        'Modul Ajar / RPP Terdiferensiasi dan instrumen asesmen',
        'Dokumen MoU / Kerjasama Industri (DUDIKA)',
        'Laporan kegiatan berkala dan dokumentasi visual pelaksanaan',
      ];

  const tipsAsesor = `Saat visitasi asesor BAN-PDM untuk ${kode}: Siapkan dokumen fisik orisinal bertanda tangan/stempel di meja visitasi, tunjukkan folder cloud drive bukti digital, dan pastikan penanggung jawab indikator menguasai penjelasan proses pelaksanaan secara percaya diri.`;

  return {
    ringkasanKesesuaian,
    saranCatatanEvaluasi: narasi,
    poinKunci,
    rekomendasiDokumen,
    tipsAsesor,
  };
}

/**
 * Memanggil endpoint backend Gemini API (/api/ai/saran-evaluasi)
 * dengan mekanisme fallback lokal otomatis jika terjadi gangguan jaringan atau timeout.
 */
export async function getSaranEvaluasi(request: AiSuggestionRequest): Promise<AiSuggestionResult> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 22000);

    const response = await fetch('/api/ai/saran-evaluasi', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(request),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const contentType = response.headers.get('content-type') || '';
    if (!response.ok || !contentType.includes('application/json')) {
      console.info(`[AI Assistant] Backend returned ${response.status} or non-JSON content. Activating resilient local engine.`);
      return generateLocalSaran(request);
    }

    const json: AiApiResponse = await response.json();
    if (!json.success || !json.data || !json.data.saranCatatanEvaluasi) {
      console.info('[AI Assistant] Backend payload incomplete. Activating resilient local engine.');
      return generateLocalSaran(request);
    }

    return json.data;
  } catch (err: any) {
    console.info('[AI Assistant] Network/Timeout standby, seamlessly activating resilient local engine:', err?.message || 'Local mode');
    return generateLocalSaran(request);
  }
}

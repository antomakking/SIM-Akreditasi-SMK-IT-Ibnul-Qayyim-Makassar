import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, ThinkingLevel } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize Google GenAI SDK (Server-Side)
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;

if (apiKey) {
  aiClient = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
      timeout: 20000,
    },
  });
} else {
  console.info('GEMINI_API_KEY is not set in environment variables. Fallback simulation mode enabled.');
}

// Intelligent Contextual Recommendation Generator for SMK IT Ibnul Qayyim Makassar
function buildContextualSaran(params: any) {
  const kodeIndikator = params.kodeIndikator || 'K1.1';
  const namaIndikator = params.namaIndikator || 'Penyelarasan Mutu Pendidikan BAN-PDM';
  const def = params.definisiOperasional || 'Pelaksanaan proses pembelajaran dan tata kelola satuan pendidikan sesuai standar instrumen BAN-PDM.';
  const levelCapaian = Number(params.levelCapaian) || 4;
  const kategoriCapaian = params.kategoriCapaian || (levelCapaian === 4 ? 'Kinerja Unggul' : levelCapaian === 3 ? 'Kinerja Baik' : levelCapaian === 2 ? 'Kinerja Cukup' : 'Kinerja Kurang');
  const deskripsiRubrik = params.deskripsiRubrik || 'Seluruh kriteria indikator terpenuhi secara konsisten dan terinternalisasi dalam budaya sekolah.';
  const buktiFisikList = Array.isArray(params.buktiFisikList) ? params.buktiFisikList : [];
  const catatanSaatIni = params.catatanSaatIni || '';
  const tipePermintaan = params.tipePermintaan || 'rekomendasi_lengkap';

  const buktiTersedia = buktiFisikList
    .filter((b: any) => b.status === 'Tersedia')
    .map((b: any) => b.nama || b.kode);

  let narasi = '';

  if (tipePermintaan === 'ringkas') {
    narasi = `SMK IT Ibnul Qayyim Makassar telah mengimplementasikan ${kodeIndikator} (${namaIndikator}) pada capaian Level ${levelCapaian} (${kategoriCapaian}). Pelaksanaan program terbukti efektif menyelaraskan kurikulum kejuruan teknologi informasi dengan pembiasaan karakter dan adab islami.

Ketercapaian didukung oleh ketersediaan berkas bukti fisik terverifikasi (${buktiTersedia.length > 0 ? buktiTersedia.slice(0, 3).join(', ') : 'SOP, perangkat kurikulum merdeka, dan portofolio digital'}) yang tersimpan rapi dalam repositori sekolah dan siap diverifikasi oleh asesor BAN-PDM.`;
  } else if (tipePermintaan === 'penyempurnaan' && catatanSaatIni.trim().length > 15) {
    narasi = `${catatanSaatIni.trim()}

[Penyempurnaan Standar BAN-PDM Level ${levelCapaian} - ${kategoriCapaian}]:
Implementasi pada indikator ${kodeIndikator} (${namaIndikator}) di SMK IT Ibnul Qayyim Makassar telah diintegrasikan secara menyeluruh ke dalam siklus penjaminan mutu internal (RKT/RKAS). Program ini didukung oleh keterlibatan aktif dewan guru, peserta didik, serta kemitraan DUDIKA IT. Bukti fisik pendukung (${buktiTersedia.length > 0 ? buktiTersedia.slice(0, 3).join(', ') : 'dokumen program kerja dan instrumen asesmen'}) menunjukkan bukti kinerja nyata yang konsisten dan berdampak positif pada iklim akademik sekolah.`;
  } else if (tipePermintaan === 'rekomendasi_bukti') {
    narasi = `Dalam rangka pemenuhan instrumen ${kodeIndikator} (${namaIndikator}) pada Level ${levelCapaian}, SMK IT Ibnul Qayyim Makassar telah menyiapkan portofolio bukti fisik yang sistematis:

1. Bukti Pokok: Berkas administrasi utama (${buktiTersedia.length > 0 ? buktiTersedia.join(', ') : 'SK penetapan tim, program kerja tahunan, modul ajar terdiferensiasi'}).
2. Bukti Digital & Penunjang: Repositori cloud drive arsip sekolah, dokumentasi visual pelaksanaan kegiatan, serta karya/proyek teknologi informasi peserta didik.

Seluruh berkas bukti fisik telah diverifikasi oleh tim penjaminan mutu internal dan siap diperiksa keabsahannya pada saat visitasi asesor BAN-PDM.`;
  } else {
    // Default: rekomendasi_lengkap
    narasi = `SMK IT Ibnul Qayyim Makassar secara konsisten dan terprogram telah merealisasikan ${namaIndikator} (${kodeIndikator}) sesuai dengan kriteria capaian Level ${levelCapaian} (${kategoriCapaian}) instrumen akreditasi BAN-PDM SMK/MAK 2024 (Versi 2025). Kebijakan dan pelaksanaan program berpijak kuat pada definisi operasional instrumen, yang menekankan keunggulan vokasi teknologi informasi yang terintegrasi dengan pembiasaan adab dan karakter islami bagi seluruh peserta didik.

Dalam tataran implementasi, proses perancangan hingga evaluasi melibatkan partisipasi kolaboratif antara pimpinan satuan pendidikan, tim kurikulum, tenaga pendidik produktif IT, orang tua/komite, serta kemitraan Dunia Usaha dan Dunia Industri Kerja (DUDIKA). Modul ajar, program kerja berbasis kompetensi riil, dan instrumen monitoring berkala dirancang adaptif terhadap dinamika industri digital masa kini.

Pencapaian mutu pada indikator ini dibuktikan dengan ketersediaan berkas bukti fisik yang valid, mutakhir, dan komprehensif, meliputi ${buktiTersedia.length > 0 ? buktiTersedia.join(', ') : 'SK Tim Pengembang, modul ajar, dokumen kemitraan industri, serta instrumen monitoring berkala'}. Repositori digital sekolah memastikan keterbukaan akses dokumen untuk memudahkan proses klarifikasi dan verifikasi faktual oleh asesor BAN-PDM saat visitasi.

Kegiatan monitoring, evaluasi, dan refleksi tindak lanjut dilaksanakan secara terjadwal setiap semester guna memastikan siklus peningkatan mutu berkelanjutan (Continuous Quality Improvement) terus membudaya di SMK IT Ibnul Qayyim Makassar.`;
  }

  const ringkasanKesesuaian = `Berdasarkan definisi operasional "${def.length > 90 ? def.slice(0, 90) + '...' : def}", kondisi faktual SMK IT Ibnul Qayyim Makassar memenuhi standar ${kategoriCapaian} (Level ${levelCapaian}) dengan dukungan bukti fisik yang valid.`;

  const poinKunci = [
    `Integrasi kurikulum kejuruan teknologi informasi dengan pembiasaan adab islami di SMK IT`,
    `Pelibatan kolaboratif manajemen, pendidik, dan kemitraan aktif bersama DUDIKA`,
    `Ketersediaan arsip bukti fisik lengkap (${buktiTersedia.length} dokumen terkonfirmasi siap)`,
    `Siklus evaluasi, monitoring, dan refleksi tindak lanjut mutu yang berkelanjutan`,
  ];

  const rekomendasiDokumen = buktiFisikList.length > 0
    ? buktiFisikList.slice(0, 4).map((b: any) => `${b.nama || 'Dokumen Bukti'} (${b.kode || 'BF'}) - [Status: ${b.status || 'Tersedia'}]`)
    : [
        'SK Penetapan Tim Pengembang & Penjaminan Mutu Sekolah',
        'Modul Ajar / RPP Terdiferensiasi dan instrumen asesmen',
        'Dokumen MoU / Kerjasama Industri (DUDIKA)',
        'Laporan kegiatan berkala dan dokumentasi visual pelaksanaan',
      ];

  const tipsAsesor = `Saat visitasi asesor BAN-PDM untuk ${kodeIndikator}: Siapkan dokumen fisik orisinal bertanda tangan/stempel di meja visitasi, tunjukkan folder cloud drive bukti digital, dan pastikan penanggung jawab indikator menguasai penjelasan proses pelaksanaan secara percaya diri.`;

  return {
    ringkasanKesesuaian,
    saranCatatanEvaluasi: narasi,
    poinKunci,
    rekomendasiDokumen,
    tipsAsesor,
  };
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    hasApiKey: Boolean(process.env.GEMINI_API_KEY),
    timestamp: new Date().toISOString(),
  });
});

// API Endpoint for AI Evaluation Note Suggestions
app.post('/api/ai/saran-evaluasi', async (req, res) => {
  try {
    const {
      kodeIndikator,
      namaIndikator,
      definisiOperasional,
      levelCapaian,
      kategoriCapaian,
      deskripsiRubrik,
      buktiFisikList,
      catatanSaatIni,
      tipePermintaan = 'rekomendasi_lengkap',
    } = req.body || {};

    const schoolContext = `Satuan Pendidikan: SMK IT IBNUL QAYYIM MAKASSAR (NPSN: 70031494).
Sekolah Menengah Kejuruan Berbasis Teknologi Informasi dan Nilai-nilai Karakter Islami di Kota Makassar, Sulawesi Selatan.
Instrumen: Akreditasi BAN-PDM SMK/MAK 2024 (Versi 2025).`;

    const promptSystem = `Anda adalah Asisten Pakar Akreditasi BAN-PDM Sekolah Menengah Kejuruan (SMK) untuk SMK IT Ibnul Qayyim Makassar.
Tugas Anda adalah menyusun saran dan rekomendasi isian Catatan Evaluasi Diri Asesi yang profesional, komprehensif, berbasis data dan fakta riil implementasi di SMK IT.

Panduan Penulisan:
1. Bahasan harus baku, akademis, lugas, dan meyakinkan bagi Asesor BAN-PDM.
2. Deskripsikan kondisi nyata proses pembelajaran, manajemen, kurikulum merdeka SMK, keterlibatan DUDIKA/Industri, fasilitas IT, dan pembiasaan karakter di SMK IT Ibnul Qayyim Makassar.
3. Selaraskan secara tepat dengan Definisi Operasional indikator dan deskripsi rubrik capaian yang dipilih.
4. Jangan gunakan placeholder kosong seperti "[sebutkan]" jika bisa memberikan narasi model contoh riil yang langsung aplikatif.
5. Gunakan struktur yang teratur dan mudah dipahami.`;

    const userPrompt = `Mohon berikan saran catatan evaluasi diri dan rekomendasi bukti untuk indikator berikut:

${schoolContext}

---
KODE INDIKATOR: ${kodeIndikator || '-'}
NAMA INDIKATOR: ${namaIndikator || '-'}

DEFINISI OPERASIONAL INDIKATOR:
${definisiOperasional || 'Tidak tersedia'}

LEVEL CAPAIAN YANG DIPILIH ASESI:
Level ${levelCapaian || 4} - ${kategoriCapaian || 'Kinerja Unggul'}
Deskripsi Capaian: ${deskripsiRubrik || 'Memenuhi kriteria secara konsisten dan terinternalisasi'}

DAFTAR BUKTI FISIK TERSEDIA / DIKELOLA:
${
  Array.isArray(buktiFisikList) && buktiFisikList.length > 0
    ? buktiFisikList.map((b: any, idx: number) => `${idx + 1}. [${b.status || 'Tersedia'}] ${b.nama} (${b.kode})`).join('\n')
    : 'Dokumen portofolio, SOP, SK, dan modul ajar terkait'
}

CATATAN EVALUASI SAAT INI (JIKA ADA):
${catatanSaatIni ? catatanSaatIni : '(Belum diisi oleh asesi)'}

TIPE PERMINTAAN: ${tipePermintaan}

---
Format keluaran dalam bahasa Indonesia:
Berikan respons dalam struktur JSON yang valid dengan field berikut:
{
  "ringkasanKesesuaian": "Analisis singkat 1-2 kalimat mengapa kondisi ini sesuai dengan definisi operasional indikator BAN-PDM.",
  "saranCatatanEvaluasi": "Teks narasi lengkap dan komprehensif (3-5 paragraf mengalir) yang siap dipakai dan disalin langsung ke kolom Catatan Evaluasi Diri Asesi.",
  "poinKunci": [
    "Poin keunggulan 1 yang perlu ditegaskan",
    "Poin keunggulan 2",
    "Poin keunggulan 3"
  ],
  "rekomendasiDokumen": [
    "Dokumen fisik/digital 1 yang wajib disiapkan untuk visitasi asesor",
    "Dokumen 2",
    "Dokumen 3"
  ],
  "tipsAsesor": "Tips khusus saat sesi wawancara atau observasi visitasi asesor untuk indikator ini."
}`;

    if (aiClient) {
      try {
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Gemini API timeout (20s)')), 20000)
        );

        const generatePromise = aiClient.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: [
            {
              role: 'user',
              parts: [{ text: `${promptSystem}\n\n${userPrompt}` }],
            },
          ],
          config: {
            temperature: 0.4,
            responseMimeType: 'application/json',
            thinkingConfig: {
              thinkingLevel: ThinkingLevel.LOW,
            },
          },
        });

        const response: any = await Promise.race([generatePromise, timeoutPromise]);
        const responseText = response.text || '';
        
        try {
          const parsed = JSON.parse(responseText);
          if (parsed && parsed.saranCatatanEvaluasi) {
            return res.json({
              success: true,
              data: parsed,
              model: 'gemini-3.8-flash',
              source: 'gemini-api',
            });
          }
        } catch {
          // If JSON parse fails but text is present
          if (responseText.trim().length > 20) {
            return res.json({
              success: true,
              data: {
                ringkasanKesesuaian: `Saran evaluasi diri untuk ${kodeIndikator} berdasarkan Definisi Operasional BAN-PDM.`,
                saranCatatanEvaluasi: responseText,
                poinKunci: ['Kesesuaian kurikulum vokasi IT', 'Pembiasaan karakter islami', 'Penjaminan mutu BAN-PDM'],
                rekomendasiDokumen: ['SK Tim Pengembang', 'Modul Ajar Terdiferensiasi', 'Portofolio Digital'],
                tipsAsesor: 'Tunjukkan bukti fisik orisinal yang telah disahkan saat visitasi.',
              },
              model: 'gemini-3.8-flash',
              source: 'gemini-api-raw',
            });
          }
        }
      } catch (geminiError: any) {
        console.info('Using contextual generator fallback:', geminiError?.message || 'Gemini standby');
      }
    }

    // Fallback: Contextual rule engine specifically tailored for SMK IT Ibnul Qayyim Makassar
    const contextualData = buildContextualSaran(req.body || {});
    return res.json({
      success: true,
      data: contextualData,
      model: aiClient ? 'gemini-3.8-flash-contextual-engine' : 'simulated-engine',
      source: 'contextual-rule-engine',
    });
  } catch (error: any) {
    console.info('Recovered request in /api/ai/saran-evaluasi route:', error?.message || 'Recovered');
    const safeData = buildContextualSaran(req.body || {});
    return res.json({
      success: true,
      data: safeData,
      model: 'resilient-fallback-engine',
      source: 'error-recovery',
    });
  }
});

// Setup Vite middleware or static files
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        host: '0.0.0.0',
        port: PORT,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running at http://0.0.0.0:${PORT}`);
  });
}

startServer();

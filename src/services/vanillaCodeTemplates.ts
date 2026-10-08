/**
 * Template Kode Vanilla JavaScript Modular untuk Integrasi Supabase.js
 * SIM Akreditasi BAN-PDM SMK IT Ibnul Qayyim Makassar
 */

export const VANILLA_SUPABASE_CLIENT_JS = `/**
 * @file supabaseClient.js
 * Inisialisasi Koneksi Supabase Client Menggunakan CDN supabase-js v2
 * Satuan Pendidikan: SMK IT Ibnul Qayyim Makassar
 */

// Pastikan skrip CDN berikut dimuat di index.html:
// <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>

// Konfigurasi Kredensial Supabase Project Anda
// Ganti dengan Project URL dan Anon Key dari Supabase Dashboard -> Project Settings -> API
const SUPABASE_CONFIG = {
  url: window.ENV?.SUPABASE_URL || 'https://xyzcompany.supabase.co',
  anonKey: window.ENV?.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummy_anon_key'
};

/**
 * Membuat instance client Supabase secara singleton
 */
let supabaseInstance = null;

export function getSupabaseClient() {
  if (supabaseInstance) {
    return supabaseInstance;
  }

  // Validasi ketersediaan library supabase dari CDN global
  if (typeof window.supabase === 'undefined' || !window.supabase.createClient) {
    console.error('[Supabase Client Error]: Library @supabase/supabase-js CDN belum dimuat!');
    throw new Error('Supabase JS library tidak ditemukan. Pastikan tag CDN telah dipasang di <head> atau sebelum skrip ini.');
  }

  try {
    supabaseInstance = window.supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true
      }
    });
    console.log('[Supabase Client]: Berhasil menginisialisasi koneksi ke:', SUPABASE_CONFIG.url);
    return supabaseInstance;
  } catch (error) {
    console.error('[Supabase Client Init Failed]:', error);
    throw error;
  }
}

export const supabase = getSupabaseClient();
`;

export const VANILLA_INSTRUMEN_SERVICE_JS = `/**
 * @file instrumenService.js
 * Service Asinkron untuk Mengambil Seluruh Struktur Instrumen Akreditasi BAN-PDM 2024/2025
 * Relasi: Komponen -> Butir -> Indikator -> Rubrik Penilaian & Bukti Fisik
 */

import { supabase } from './supabaseClient.js';

/**
 * Mengambil seluruh data instrumen akreditasi secara hierarkis menggunakan fitur Join / Inner Select Supabase
 * @returns {Promise<Array>} Array komponen lengkap dengan child butir, indikator, rubrik, bukti fisik, dan evaluasi asesi
 */
export async function fetchInstrumen() {
  try {
    console.log('[fetchInstrumen] Memulai pengambilan data instrumen BAN-PDM dari Supabase...');

    // Query relasional bertingkat (Deep Nested Select)
    const { data, error } = await supabase
      .from('komponen')
      .select(\`
        id,
        kode,
        nomor,
        nama,
        deskripsi,
        bobot,
        butir (
          id,
          komponen_id,
          nomor,
          kode,
          nama,
          deskripsi,
          fokus_vokasi,
          indikator (
            id,
            butir_id,
            nomor,
            kode,
            nama,
            definisi_operasional,
            penjelasan,
            rubrik_penilaian (
              id,
              indikator_id,
              level,
              kategori,
              deskripsi
            ),
            bukti_fisik (
              id,
              indikator_id,
              kode,
              nama,
              jenis,
              deskripsi,
              wajib
            ),
            evaluasi_asesi (
              id,
              indikator_id,
              capaian,
              skor,
              catatan,
              bukti_urls,
              status_verifikasi,
              updated_at
            )
          )
        )
      \`)
      .order('nomor', { ascending: true });

    // Penanganan error database dari response Supabase
    if (error) {
      console.error('[fetchInstrumen] Database Error:', error.message, error.details);
      throw new Error(\`Gagal memuat instrumen akreditasi: \${error.message}\`);
    }

    if (!data || data.length === 0) {
      console.warn('[fetchInstrumen] Data instrumen kosong di database.');
      return [];
    }

    // Normalisasi pengurutan nomor butir & indikator di sisi client
    const normalizedData = data.map(komp => ({
      ...komp,
      butir: (komp.butir || [])
        .sort((a, b) => a.nomor - b.nomor)
        .map(b => ({
          ...b,
          indikator: (b.indikator || [])
            .sort((a, b) => a.nomor - b.nomor)
            .map(ind => ({
              ...ind,
              rubrik_penilaian: (ind.rubrik_penilaian || []).sort((a, b) => a.level - b.level),
              bukti_fisik: (ind.bukti_fisik || []).sort((a, b) => a.kode.localeCompare(b.kode)),
              // Ambil evaluasi aktif jika ada (berupa objek pertama dari array relasi)
              evaluasi: Array.isArray(ind.evaluasi_asesi) ? ind.evaluasi_asesi[0] || null : ind.evaluasi_asesi
            }))
        }))
    }));

    console.log(\`[fetchInstrumen] Berhasil memuat \${normalizedData.length} komponen akreditasi.\`);
    return normalizedData;
  } catch (err) {
    console.error('[fetchInstrumen Catch]:', err);
    throw err;
  }
}
`;

export const VANILLA_EVALUASI_SERVICE_JS = `/**
 * @file evaluasiService.js
 * Service Transaksional untuk Validasi dan Penyimpanan Evaluasi Diri Asesi
 * Satuan Pendidikan: SMK IT Ibnul Qayyim Makassar
 */

import { supabase } from './supabaseClient.js';

// Kategori capaian yang valid sesuai standar BAN-PDM 2024/2025
export const VALID_CAPAIAN = ['Kurang', 'Cukup Baik', 'Baik', 'Sangat Baik'];

// Pemetaan skor standar BAN-PDM (1 - 4)
export const SKOR_MAP = {
  'Kurang': 1,
  'Cukup Baik': 2,
  'Baik': 3,
  'Sangat Baik': 4
};

/**
 * Fungsi Validasi Data Sebelum Pengiriman ke Database (Integritas Input Pengguna)
 * @param {Object} payload Data yang akan dikirim
 * @returns {{ isValid: boolean, errors: string[] }}
 */
export function validateEvaluasiInput({ indikator_id, capaian, catatan, bukti_urls = [] }) {
  const errors = [];

  // 1. Validasi keberadaan dan format UUID indikator_id
  if (!indikator_id || typeof indikator_id !== 'string') {
    errors.push('ID Indikator wajib diisi.');
  } else {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(indikator_id.trim())) {
      errors.push('Format ID Indikator tidak valid (harus berupa format UUID).');
    }
  }

  // 2. Validasi capaian rubrik
  if (!capaian || typeof capaian !== 'string') {
    errors.push('Pilihan capaian rubrik wajib dipilih.');
  } else if (!VALID_CAPAIAN.includes(capaian.trim())) {
    errors.push(\`Capaian "\${capaian}" tidak sah. Harus salah satu dari: \${VALID_CAPAIAN.join(', ')}.\`);
  }

  // 3. Validasi catatan evaluasi diri
  if (!catatan || typeof catatan !== 'string') {
    errors.push('Catatan evaluasi asesi wajib diisi.');
  } else {
    const trimmedCatatan = catatan.trim();
    if (trimmedCatatan.length < 20) {
      errors.push(\`Catatan evaluasi terlalu singkat (\${trimmedCatatan.length} karakter). Minimal 20 karakter untuk memberikan justifikasi kondisi riil sekolah.\`);
    } else if (trimmedCatatan.length > 3000) {
      errors.push('Catatan evaluasi melebihi batas maksimal 3.000 karakter.');
    }
  }

  // 4. Validasi format URL bukti fisik (jika dilampirkan)
  if (bukti_urls && Array.isArray(bukti_urls)) {
    for (const url of bukti_urls) {
      if (typeof url === 'string' && url.trim().length > 0) {
        try {
          const parsed = new URL(url.trim());
          if (!['http:', 'https:'].includes(parsed.protocol)) {
            errors.push(\`Protokol link bukti "\${url}" harus menggunakan http:// atau https://\`);
          }
        } catch {
          errors.push(\`Format URL link bukti fisik tidak valid: "\${url}"\`);
        }
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Menyimpan atau memperbarui data evaluasi asesi ke tabel evaluasi_asesi (Upsert)
 * @param {string} indikator_id - UUID indikator
 * @param {string} capaian - Kategori capaian ('Kurang' | 'Cukup Baik' | 'Baik' | 'Sangat Baik')
 * @param {string} catatan - Deskripsi justifikasi evaluasi diri sekolah
 * @param {Array<string>} [bukti_urls=[]] - Daftar link file bukti (opsional)
 * @param {string} [status_verifikasi='Draf'] - Status verifikasi ('Belum Diunggah' | 'Draf' | 'Perlu Perbaikan' | 'Terverifikasi Valid')
 * @returns {Promise<Object>} Data evaluasi_asesi yang berhasil tersimpan
 */
export async function saveEvaluasi(
  indikator_id,
  capaian,
  catatan,
  bukti_urls = [],
  status_verifikasi = 'Draf'
) {
  // Lakukan validasi menyeluruh di sisi client sebelum menghubungi Supabase
  const validation = validateEvaluasiInput({
    indikator_id,
    capaian,
    catatan,
    bukti_urls
  });

  if (!validation.isValid) {
    const errorMsg = \`Validasi gagal:\\n- \${validation.errors.join('\\n- ')}\`;
    console.error('[saveEvaluasi Validation Error]:', validation.errors);
    throw new Error(errorMsg);
  }

  // Hitung skor numerik otomatis berdasarkan capaian
  const skorNumerik = SKOR_MAP[capaian.trim()];

  // Susun payload yang bersih dan aman
  const payload = {
    indikator_id: indikator_id.trim(),
    capaian: capaian.trim(),
    skor: skorNumerik,
    catatan: catatan.trim(),
    bukti_urls: Array.isArray(bukti_urls) ? bukti_urls.filter(u => typeof u === 'string' && u.trim().length > 0) : [],
    status_verifikasi: status_verifikasi || 'Draf',
    updated_at: new Date().toISOString()
  };

  try {
    console.log('[saveEvaluasi] Mengirim data evaluasi ke Supabase...', payload);

    // Gunakan fungsi UPSERT Supabase pada kolom unique (indikator_id)
    const { data, error } = await supabase
      .from('evaluasi_asesi')
      .upsert(payload, {
        onConflict: 'indikator_id',
        ignoreDuplicates: false
      })
      .select()
      .single();

    if (error) {
      console.error('[saveEvaluasi Database Error]:', error.message, error.details);
      throw new Error(\`Database error (\${error.code}): \${error.message}\`);
    }

/**
 * Khusus Validator / Asesor Internal: Memvalidasi dan menetapkan status verifikasi
 * @param {string} indikator_id - UUID indikator
 * @param {string} status_verifikasi - 'Terverifikasi Valid' | 'Perlu Perbaikan' | 'Draf'
 * @param {string} [catatan_validator=''] - Catatan audit / masukan validator
 * @param {string} [verified_by=''] - Nama verifikator
 * @returns {Promise<Object>}
 */
export async function saveValidatorReview(
  indikator_id,
  status_verifikasi,
  catatan_validator = '',
  verified_by = ''
) {
  try {
    const { data, error } = await supabase
      .from('evaluasi_asesi')
      .update({
        status_verifikasi,
        catatan_validator: catatan_validator.trim(),
        verified_by: verified_by || 'Asesor Internal',
        updated_at: new Date().toISOString()
      })
      .eq('indikator_id', indikator_id)
      .select()
      .single();

    if (error) {
      throw new Error(\`Gagal validasi (\${error.code}): \${error.message}\`);
    }

    return {
      success: true,
      message: \`Status verifikasi berhasil diperbarui menjadi "\${status_verifikasi}".\`,
      data
    };
  } catch (err) {
    console.error('[saveValidatorReview Error]:', err);
    throw err;
  }
}
`;

export const VANILLA_INDEX_HTML_SNIPPET = `<!-- 
  Integrasi di index.html untuk Single Page Application (SPA)
  SMK IT Ibnul Qayyim Makassar
-->
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SIM Akreditasi SMK IT Ibnul Qayyim Makassar</title>
  
  <!-- 1. Tailwind CSS via CDN / Build pipeline -->
  <script src="https://cdn.tailwindcss.com"></script>
  
  <!-- 2. Supabase JS Client v2 via Official CDN -->
  <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
</head>
<body class="bg-slate-50 text-slate-900">
  <!-- Container UI SPA -->
  <div id="app"></div>

  <!-- Inisialisasi Script Modular -->
  <script type="module">
    import { fetchInstrumen } from './js/instrumenService.js';
    import { saveEvaluasi } from './js/evaluasiService.js';

    async function initApp() {
      try {
        const instrumen = await fetchInstrumen();
        console.log('Instrumen terambil:', instrumen);
        // Render UI ke DOM...
      } catch (err) {
        alert(err.message);
      }
    }

    window.addEventListener('DOMContentLoaded', initApp);
  </script>
</body>
</html>
`;

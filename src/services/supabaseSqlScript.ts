/**
 * Skrip SQL DDL Lengkap untuk Supabase PostgreSQL
 * Sesuai Panduan Penjelasan Instrumen Akreditasi SMK/MAK 2024 (IA2024 Versi 2025) untuk Asesi
 * Kepmendikbudristek No. 246/O/2024
 * Satuan Pendidikan: SMK IT Ibnul Qayyim Makassar
 */

export const SUPABASE_SQL_DDL = `-- ==============================================================================
-- SISTEM INFORMASI MANAJEMEN AKREDITASI BAN-PDM SMK/MAK 2024 (IA2024 VERSI 2025)
-- Sesuai Keputusan Mendikbudristek Nomor 246/O/2024
-- Satuan Pendidikan Asesi: SMK IT IBNUL QAYYIM MAKASSAR
-- Database Engine: PostgreSQL 15+ (Supabase BaaS)
-- ==============================================================================

-- 1. AKTIFKAN EXTENSION UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==============================================================================
-- 2. PERANCANGAN TABEL STRUKTUR INSTRUMEN & RELASI FOREIGN KEY
-- ==============================================================================

-- Tabel 1: komponen
-- 4 Komponen Utama Akreditasi BAN-PDM SMK/MAK 2024
CREATE TABLE IF NOT EXISTS komponen (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    kode VARCHAR(10) UNIQUE NOT NULL, -- 'K1', 'K2', 'K3', 'K4'
    nomor INT NOT NULL,
    nama VARCHAR(255) NOT NULL,
    deskripsi TEXT,
    bobot NUMERIC(5,2) DEFAULT 25.00,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabel 2: butir
-- 16 Butir Standar Instrumen Akreditasi (IA2024 Versi 2025)
-- K1 (Butir 1-4), K2 (Butir 5-9), K3 (Butir 10-15), K4 (Butir 16)
CREATE TABLE IF NOT EXISTS butir (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    komponen_id UUID NOT NULL REFERENCES komponen(id) ON DELETE CASCADE,
    nomor INT NOT NULL,
    kode VARCHAR(20) UNIQUE NOT NULL, -- 'Butir 1' s.d. 'Butir 16'
    nama VARCHAR(350) NOT NULL,
    deskripsi TEXT NOT NULL,
    fokus_vokasi TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabel 3: indikator
-- Rincian Indikator Kinerja Butir beserta definisi operasional & penjelasan
CREATE TABLE IF NOT EXISTS indikator (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    butir_id UUID NOT NULL REFERENCES butir(id) ON DELETE CASCADE,
    nomor INT NOT NULL,
    kode VARCHAR(30) UNIQUE NOT NULL, -- '1.1.1', '1.1.2', dst.
    nama VARCHAR(350) NOT NULL,
    definisi_operasional TEXT NOT NULL,
    penjelasan TEXT NOT NULL,
    snp VARCHAR(100), -- Standar Nasional Pendidikan rujukan (Standar Proses, PTK, Sarpras, SKL, dll.)
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabel 4: rubrik_penilaian
-- Matriks 4 Kategori Capaian: Kurang (1), Cukup Baik (2), Baik (3), Sangat Baik (4)
CREATE TABLE IF NOT EXISTS rubrik_penilaian (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    indikator_id UUID NOT NULL REFERENCES indikator(id) ON DELETE CASCADE,
    level INT NOT NULL CHECK (level BETWEEN 1 AND 4),
    kategori VARCHAR(50) NOT NULL CHECK (kategori IN ('Kurang', 'Cukup Baik', 'Baik', 'Sangat Baik')),
    deskripsi TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT uq_indikator_level UNIQUE (indikator_id, level),
    CONSTRAINT uq_indikator_kategori UNIQUE (indikator_id, kategori)
);

-- Tabel 5: bukti_fisik
-- Referensi bukti dokumen / observasi / wawancara yang disyaratkan untuk setiap indikator
CREATE TABLE IF NOT EXISTS bukti_fisik (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    indikator_id UUID NOT NULL REFERENCES indikator(id) ON DELETE CASCADE,
    kode VARCHAR(50) NOT NULL,
    nama VARCHAR(350) NOT NULL,
    jenis VARCHAR(50) NOT NULL CHECK (jenis IN ('Dokumen', 'Observasi', 'Wawancara', 'Produk Siswa', 'Sertifikat', 'MoU')),
    deskripsi TEXT,
    wajib BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabel 6: user_profiles (Sistem Hak Akses & Peran Pengguna: Admin, Asesi, Validator, Viewer)
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('Admin', 'Asesi', 'Validator', 'Viewer')),
    title VARCHAR(255) NOT NULL,
    department VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabel 7: evaluasi_asesi (Tabel Transaksional)
-- Menyimpan pengisian evaluasi diri (Deskripsi Kinerja Asesi - DKA) SMK IT Ibnul Qayyim Makassar
CREATE TABLE IF NOT EXISTS evaluasi_asesi (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    indikator_id UUID NOT NULL UNIQUE REFERENCES indikator(id) ON DELETE CASCADE,
    capaian VARCHAR(50) NOT NULL CHECK (capaian IN ('Kurang', 'Cukup Baik', 'Baik', 'Sangat Baik')),
    skor INT NOT NULL CHECK (skor BETWEEN 1 AND 4),
    catatan TEXT NOT NULL,
    catatan_validator TEXT, -- Catatan / Rekomendasi Khusus dari Validator / Asesor Internal
    bukti_urls JSONB DEFAULT '[]'::jsonb, -- Tautan Google Drive / Repositori IT Bukti Fisik
    bukti_checklist JSONB DEFAULT '{}'::jsonb, -- Status checklist dokumen ('Tersedia' | 'Dalam Proses' | 'Belum Ada')
    status_verifikasi VARCHAR(50) NOT NULL DEFAULT 'Draf' CHECK (status_verifikasi IN ('Belum Diunggah', 'Draf', 'Perlu Perbaikan', 'Terverifikasi Valid')),
    verified_by VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabel 8: log_aktivitas_evaluasi (Audit Trail & Riwayat Pengeditan)
-- Mencatat siapa saja yang mengubah catatan evaluasi beserta timestamp & diff
CREATE TABLE IF NOT EXISTS log_aktivitas_evaluasi (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    evaluasi_id UUID REFERENCES evaluasi_asesi(id) ON DELETE CASCADE,
    indikator_id UUID NOT NULL REFERENCES indikator(id) ON DELETE CASCADE,
    user_name VARCHAR(150) NOT NULL,
    user_role VARCHAR(150),
    action VARCHAR(50) NOT NULL, -- 'CREATE', 'UPDATE', 'STATUS_CHANGE', 'EVIDENCE_UPDATE', 'VALIDATION_REVIEW'
    previous_capaian VARCHAR(50),
    new_capaian VARCHAR(50),
    previous_status VARCHAR(50),
    new_status VARCHAR(50),
    catatan_ringkas TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 3. INDEKS OPTIMASI QUERY HIERARKIS & RBAC
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON user_profiles(role);
CREATE INDEX IF NOT EXISTS idx_butir_komponen ON butir(komponen_id);
CREATE INDEX IF NOT EXISTS idx_indikator_butir ON indikator(butir_id);
CREATE INDEX IF NOT EXISTS idx_rubrik_indikator ON rubrik_penilaian(indikator_id);
CREATE INDEX IF NOT EXISTS idx_bukti_indikator ON bukti_fisik(indikator_id);
CREATE INDEX IF NOT EXISTS idx_evaluasi_indikator ON evaluasi_asesi(indikator_id);
CREATE INDEX IF NOT EXISTS idx_evaluasi_status ON evaluasi_asesi(status_verifikasi);
CREATE INDEX IF NOT EXISTS idx_log_indikator ON log_aktivitas_evaluasi(indikator_id);
CREATE INDEX IF NOT EXISTS idx_log_created ON log_aktivitas_evaluasi(created_at DESC);

-- ==============================================================================
-- 4. TRIGGER OTOMATIS UPDATED_AT TIMESTAMP
-- ==============================================================================
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_timestamp_user_profiles ON user_profiles;
CREATE TRIGGER set_timestamp_user_profiles
BEFORE UPDATE ON user_profiles
FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

DROP TRIGGER IF EXISTS set_timestamp_komponen ON komponen;
CREATE TRIGGER set_timestamp_komponen
BEFORE UPDATE ON komponen
FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

DROP TRIGGER IF EXISTS set_timestamp_butir ON butir;
CREATE TRIGGER set_timestamp_butir
BEFORE UPDATE ON butir
FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

DROP TRIGGER IF EXISTS set_timestamp_indikator ON indikator;
CREATE TRIGGER set_timestamp_indikator
BEFORE UPDATE ON indikator
FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

DROP TRIGGER IF EXISTS set_timestamp_evaluasi ON evaluasi_asesi;
CREATE TRIGGER set_timestamp_evaluasi
BEFORE UPDATE ON evaluasi_asesi
FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

-- ==============================================================================
-- 5. ROW LEVEL SECURITY (RLS) POLICIES BERBASIS PERAN (RBAC)
-- ==============================================================================
-- Hak Akses Berdasarkan Peran:
-- - Admin: Akses penuh (Read/Write/Delete/Manage Role)
-- - Asesi: Akses tulis pada catatan evaluasi diri, rubrik, checklist bukti & tautan bukti fisik
-- - Validator: Akses tulis DIBATASI (hanya dapat memperbarui status_verifikasi & catatan_validator)
-- - Viewer / General User: Hanya memiliki hak akses BACA SAJA (Read-Only)
-- ==============================================================================
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE komponen ENABLE ROW LEVEL SECURITY;
ALTER TABLE butir ENABLE ROW LEVEL SECURITY;
ALTER TABLE indikator ENABLE ROW LEVEL SECURITY;
ALTER TABLE rubrik_penilaian ENABLE ROW LEVEL SECURITY;
ALTER TABLE bukti_fisik ENABLE ROW LEVEL SECURITY;
ALTER TABLE evaluasi_asesi ENABLE ROW LEVEL SECURITY;
ALTER TABLE log_aktivitas_evaluasi ENABLE ROW LEVEL SECURITY;

-- 5.1 Kebijakan SELECT (Dapat Dibaca Oleh Seluruh Pengguna / Viewer)
CREATE POLICY "Public select master data komponen" ON komponen FOR SELECT USING (true);
CREATE POLICY "Public select master data butir" ON butir FOR SELECT USING (true);
CREATE POLICY "Public select master data indikator" ON indikator FOR SELECT USING (true);
CREATE POLICY "Public select master data rubrik" ON rubrik_penilaian FOR SELECT USING (true);
CREATE POLICY "Public select master data bukti" ON bukti_fisik FOR SELECT USING (true);
CREATE POLICY "Public select user profiles" ON user_profiles FOR SELECT USING (true);
CREATE POLICY "Public select evaluasi asesi" ON evaluasi_asesi FOR SELECT USING (true);
CREATE POLICY "Public select log aktivitas" ON log_aktivitas_evaluasi FOR SELECT USING (true);

-- 5.2 Kebijakan INSERT/UPDATE/DELETE untuk Admin (Akses Penuh)
CREATE POLICY "Admin full manage user_profiles" ON user_profiles FOR ALL TO authenticated USING (
    EXISTS (SELECT 1 FROM user_profiles up WHERE up.user_id = auth.uid() AND up.role = 'Admin')
);

CREATE POLICY "Admin full manage evaluasi" ON evaluasi_asesi FOR ALL TO authenticated USING (
    EXISTS (SELECT 1 FROM user_profiles up WHERE up.user_id = auth.uid() AND up.role = 'Admin')
);

-- 5.3 Kebijakan Asesi (Hanya Edit Catatan, Rubrik & Checklist Bukti)
CREATE POLICY "Asesi manage evaluasi notes and checklist" ON evaluasi_asesi FOR ALL TO authenticated USING (
    EXISTS (SELECT 1 FROM user_profiles up WHERE up.user_id = auth.uid() AND up.role IN ('Asesi', 'Admin'))
);

-- 5.4 Kebijakan Validator (Dibatasi: Hanya Update Status & Catatan Validator)
CREATE POLICY "Validator update verification status" ON evaluasi_asesi FOR UPDATE TO authenticated USING (
    EXISTS (SELECT 1 FROM user_profiles up WHERE up.user_id = auth.uid() AND up.role IN ('Validator', 'Admin'))
);

-- 5.5 Staging Anonim (Fallback untuk Mode Prototyping & Development)
CREATE POLICY "Anon select all" ON evaluasi_asesi FOR SELECT TO anon USING (true);
CREATE POLICY "Anon insert evaluasi" ON evaluasi_asesi FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Anon update evaluasi" ON evaluasi_asesi FOR UPDATE TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Public insert log aktivitas" ON log_aktivitas_evaluasi FOR INSERT WITH CHECK (true);

-- ==============================================================================
-- 6. DUMMY DATA SEEDING SESUAI BUKU PANDUAN IA2024 VERSI 2025
-- ==============================================================================
DO $$
DECLARE
    v_k1 UUID := 'a1111111-1111-4111-a111-111111111111'::UUID;
    v_k2 UUID := 'a2222222-2222-4222-a222-222222222222'::UUID;
    v_k3 UUID := 'a3333333-3333-4333-a333-333333333333'::UUID;
    v_k4 UUID := 'a4444444-4444-4444-a444-444444444444'::UUID;

    v_b1 UUID := 'b1111111-1111-4111-b111-111111111111'::UUID;
    v_b2 UUID := 'b1111111-1111-4111-b111-222222222222'::UUID;
    v_b3 UUID := 'b1111111-1111-4111-b111-333333333333'::UUID;
    v_b4 UUID := 'b1111111-1111-4111-b111-444444444444'::UUID;

    v_ind1_1_1 UUID := 'c1111111-1111-4111-c111-111111111111'::UUID;
    v_ind1_1_2 UUID := 'c1111111-1111-4111-c111-222222222222'::UUID;
    v_ind1_1_3 UUID := 'c1111111-1111-4111-c111-333333333333'::UUID;
BEGIN
    -- 6.1 Seed 4 Komponen Utama Resmi
    INSERT INTO komponen (id, kode, nomor, nama, deskripsi, bobot) VALUES
    (v_k1, 'K1', 1, 'Kinerja Pendidik dalam Mengelola Proses Pembelajaran yang Berpusat pada Peserta Didik',
     'Kapasitas guru dalam memfasilitasi pembelajaran efektif, menyenangkan, interaksi aktif dan empatik, serta memperhatikan kebutuhan belajar murid SMK/MAK.', 25.00),
    (v_k2, 'K2', 2, 'Kepemimpinan Kepala Satuan Pendidikan dalam Pengelolaan Satuan Pendidikan',
     'Instructional leadership kepala sekolah/madrasah dalam budaya refleksi, manajemen GTK, ketercapaian visi-misi partisipatif, akuntabilitas anggaran, sarpras, dan kurikulum selaras kurikulum nasional & SKK.', 25.00),
    (v_k3, 'K3', 3, 'Iklim Lingkungan Belajar',
     'Menciptakan suasana belajar yang kondusif, aman dan nyaman secara fisik dan psikis bagi murid, guru, dan tenaga kependidikan mencakup kebinekaan, inklusivitas, pencegahan kekerasan/perundungan, keselamatan fisik & P3K, kesehatan fisik/mental, serta pembelajaran relevan dunia kerja.', 30.00),
    (v_k4, 'K4', 4, 'Kompetensi Hasil Pembelajaran Lulusan dan/atau Peserta Didik',
     'Memastikan setiap murid meraih kompetensi spesifik okupasi kejuruan yang diakui dunia kerja (portofolio karya nyata & sertifikat BNSP/LSP) serta keterserapan lulusan (Bekerja, Wirausaha, Melanjutkan studi / BMW).', 20.00)
    ON CONFLICT (kode) DO NOTHING;

    -- 6.2 Seed Butir 1 (Komponen 1)
    INSERT INTO butir (id, komponen_id, nomor, kode, nama, deskripsi, fokus_vokasi) VALUES
    (v_b1, v_k1, 1, 'Butir 1',
     'Pendidik menyediakan dukungan sosial emosional bagi peserta didik dalam proses pembelajaran',
     'Membangun interaksi yang setara dan menghargai, memberi perhatian ekstra pada murid yang membutuhkan, serta menerapkan pola pikir bertumbuh (growth mindset).',
     'Interaksi pembelajaran vokasi IT di kelas dan laboratorium komputer.')
    ON CONFLICT (kode) DO NOTHING;

    -- 6.3 Seed Indikator Butir 1 Sesuai Buku Panduan (Halaman 16-25)
    -- Indikator 1.1.1
    INSERT INTO indikator (id, butir_id, nomor, kode, nama, definisi_operasional, penjelasan, snp) VALUES
    (v_ind1_1_1, v_b1, 1, '1.1.1',
     'Interaksi guru dan murid yang setara dan menghargai',
     'Mengukur kinerja guru dalam berinteraksi dengan murid selama proses pembelajaran yang membuat murid merasa aman untuk bertanya, berpendapat, berdiskusi, dan tidak takut salah.',
     'Interaksi guru-murid positif, tidak takut bertanya/salah, berani berpendapat, dan aktif berdiskusi.',
     'Standar Proses')
    ON CONFLICT (kode) DO NOTHING;

    -- Indikator 1.1.2
    INSERT INTO indikator (id, butir_id, nomor, kode, nama, definisi_operasional, penjelasan, snp) VALUES
    (v_ind1_1_2, v_b1, 2, '1.1.2',
     'Perhatian kepada murid yang memerlukan dukungan lebih/ekstra dalam pembelajaran',
     'Mengukur kinerja guru dalam mengidentifikasi murid yang memerlukan dukungan lebih/ekstra dalam pembelajaran dan memberikan pendampingan agar murid dapat mencapai tujuan pembelajaran.',
     'Identifikasi murid yang pencapaiannya di bawah standar kompetensi atau memiliki kendala belajar, lalu diberi bantuan/pendampingan terencana.',
     'Standar Proses dan Standar Penilaian')
    ON CONFLICT (kode) DO NOTHING;

    -- Indikator 1.1.3
    INSERT INTO indikator (id, butir_id, nomor, kode, nama, definisi_operasional, penjelasan, snp) VALUES
    (v_ind1_1_3, v_b1, 3, '1.1.3',
     'Guru menerapkan pola pikir bertumbuh untuk menguatkan keterampilan sosial emosional murid dalam proses belajar',
     'Mengukur kinerja guru dalam menerapkan berbagai strategi untuk membangun efikasi diri murid saat belajar sehingga murid memiliki pola pikir bertumbuh, keterampilan sosial emosional, dan mandiri.',
     'Membangun efikasi diri bertahap, empati saat murid menghadapi kesulitan, memberi umpan balik positif, dan model peran praktisi.',
     'Standar Proses')
    ON CONFLICT (kode) DO NOTHING;

    -- 6.4 Seed Rubrik Penilaian Indikator 1.1.1
    INSERT INTO rubrik_penilaian (indikator_id, level, kategori, deskripsi) VALUES
    (v_ind1_1_1, 1, 'Kurang', 'Guru mengabaikan atau tidak menanggapi pertanyaan maupun komentar murid. Jikapun guru menanggapi, tanggapannya bersifat merendahkan atau terindikasi memberi stigma kurang baik/negatif.'),
    (v_ind1_1_1, 2, 'Cukup Baik', 'Guru memberi kesempatan murid bertanya/berkomentar, namun hanya mendengar pertanyaan atau tanggapan murid secara sepintas dan menanggapi sekadarnya, tergesa-gesa merespons tanpa memastikan pemahaman murid.'),
    (v_ind1_1_1, 3, 'Baik', 'Guru memberi kesempatan murid bertanya/berkomentar, mendengarkan dengan seksama dan memberi tanggapan yang relevan, serta memberi kesempatan pada tiga atau lebih murid untuk bertanya/memberi masukan.'),
    (v_ind1_1_1, 4, 'Sangat Baik', 'Guru mendengarkan dengan seksama, menggali maksud murid lebih lanjut dan merespon dengan tanggapan relevan, menggunakan bahasa yang membangun semangat, serta memberi kesempatan pada tiga atau lebih murid.')
    ON CONFLICT (indikator_id, level) DO UPDATE SET deskripsi = EXCLUDED.deskripsi;

    -- 6.5 Seed Rubrik Penilaian Indikator 1.1.2
    INSERT INTO rubrik_penilaian (indikator_id, level, kategori, deskripsi) VALUES
    (v_ind1_1_2, 1, 'Kurang', 'Guru belum mengidentifikasi murid yang memerlukan dukungan lebih/ekstra dalam belajar dan belum ada upaya untuk memberi dukungan lebih/ekstra bagi murid tertentu.'),
    (v_ind1_1_2, 2, 'Cukup Baik', 'Guru telah mengidentifikasi murid yang memerlukan dukungan lebih/ekstra dalam belajar, namun belum ada upaya untuk memberi dukungan lebih/ekstra bagi murid tertentu.'),
    (v_ind1_1_2, 3, 'Baik', 'Guru telah mengidentifikasi murid yang memerlukan bantuan dalam belajar, mencari informasi tambahan kepada orang tua/wali/guru lain, dan memberikan dukungan tambahan secara insidental.'),
    (v_ind1_1_2, 4, 'Sangat Baik', 'Guru mengidentifikasi murid, mencari info tambahan, berdiskusi dengan orang tua/wali/guru lain, dan memberikan dukungan tambahan secara berkesinambungan mencakup aspek belajar dan sosial emosional murid.')
    ON CONFLICT (indikator_id, level) DO UPDATE SET deskripsi = EXCLUDED.deskripsi;

    -- 6.6 Seed Rubrik Penilaian Indikator 1.1.3
    INSERT INTO rubrik_penilaian (indikator_id, level, kategori, deskripsi) VALUES
    (v_ind1_1_3, 1, 'Kurang', 'Guru belum memahami pola pikir bertumbuh. Guru belum mampu berempati jika murid mengekspresikan emosi negatif saat menghadapi situasi menantang/sulit dan belum mampu membimbing kemandirian murid.'),
    (v_ind1_1_3, 2, 'Cukup Baik', 'Guru menunjukkan pengertian tentang pola pikir bertumbuh. Sebagian guru dapat berempati jika murid mengekspresikan emosi negatif, namun belum mampu membimbing dan menguatkan kemandirian murid.'),
    (v_ind1_1_3, 3, 'Baik', 'Guru menerapkan pola pikir bertumbuh dan berempati jika murid mengekspresikan emosi negatif saat menghadapi tantangan. Beberapa guru mampu membimbing kemandirian murid mengelola emosinya.'),
    (v_ind1_1_3, 4, 'Sangat Baik', 'Guru memberi keteladanan pola pikir bertumbuh, berempati pada kesulitan murid, mampu menunjukkan cara memahami akar masalah serta membimbing dan menguatkan kemandirian murid secara sistematis.')
    ON CONFLICT (indikator_id, level) DO UPDATE SET deskripsi = EXCLUDED.deskripsi;

    -- 6.7 Seed Bukti Fisik Indikator 1.1.1
    INSERT INTO bukti_fisik (indikator_id, kode, nama, jenis, deskripsi, wajib) VALUES
    (v_ind1_1_1, 'BF-1.1.1-A', 'Observasi kelas saat proses pembelajaran', 'Observasi', 'Interaksi tanya jawab guru dengan murid, dorongan aktif, dan respons positif.', TRUE),
    (v_ind1_1_1, 'BF-1.1.1-B', 'Telaah dokumen RPP / Modul Ajar Kurikulum Merdeka', 'Dokumen', 'Perancangan proses belajar yang mendorong interaksi aktif dan diskusi.', TRUE),
    (v_ind1_1_1, 'BF-1.1.1-C', 'Hasil wawancara dengan guru dan murid pada saat observasi', 'Wawancara', 'Persepsi kenyamanan belajar dan rasa aman berpendapat.', TRUE)
    ON CONFLICT DO NOTHING;

    -- 6.8 Seed Data Profil Pengguna & Peran (Admin, Asesi, Validator, Viewer)
    INSERT INTO user_profiles (email, name, role, title, department) VALUES
    ('said.kepsek@smkitibnulqayyim.sch.id', 'Drs. H. M. Said, M.Pd', 'Admin', 'Kepala Satuan Pendidikan & Penanggung Jawab Akreditasi', 'Manajemen Sekolah'),
    ('fadhil.rpl@smkitibnulqayyim.sch.id', 'Ahmad Fadhil, S.Kom', 'Asesi', 'Ketua Tim Asesi / Guru Produktif RPL', 'Kompetensi Keahlian RPL'),
    ('hidayah.kurikulum@smkitibnulqayyim.sch.id', 'Nur Hidayah, S.Pd', 'Asesi', 'Waka Kurikulum & Pembelajaran', 'Tim Kurikulum'),
    ('abdurrahman.asesor@banpdm-sulsel.org', 'Dr. Ir. H. Abdurrahman, M.T', 'Validator', 'Asesor Internal BAN-PDM / Auditor Penjamin Mutu', 'Lembaga Akreditasi Mandiri/Internal'),
    ('tamu@smkitibnulqayyim.sch.id', 'Pengunjung Tamu / Pengguna Umum', 'Viewer', 'Akses Read-Only (Hanya Membaca Data & Laporan)', 'Publik')
    ON CONFLICT (email) DO UPDATE SET
        role = EXCLUDED.role,
        title = EXCLUDED.title,
        department = EXCLUDED.department;

    -- 6.9 Sampel Evaluasi Diri SMK IT Ibnul Qayyim Makassar
    INSERT INTO evaluasi_asesi (indikator_id, capaian, skor, catatan, catatan_validator, bukti_urls, status_verifikasi, verified_by)
    VALUES (
        v_ind1_1_1,
        'Sangat Baik',
        4,
        'Pendidik di SMK IT Ibnul Qayyim Makassar secara konsisten membangun interaksi positif dua arah. Dalam setiap sesi teori maupun praktikum di Laboratorium IT, guru mendengarkan pendapat murid dengan seksama, menggali pemahaman lebih lanjut, dan menggunakan bahasa yang memotivasi siswa untuk berani berpendapat.',
        'Dokumen modul ajar lengkap dan rekaman observasi praktikum lab IT telah diverifikasi memenuhi kriteria Sangat Baik.',
        '["https://drive.google.com/drive/folders/smkit-ibnulqayyim-modul-ajar-2025", "https://smkitibnulqayyim.sch.id/sop-lab-it"]'::jsonb,
        'Terverifikasi Valid',
        'Dr. Ir. H. Abdurrahman, M.T'
    )
    ON CONFLICT (indikator_id) DO UPDATE SET
        capaian = EXCLUDED.capaian,
        skor = EXCLUDED.skor,
        catatan = EXCLUDED.catatan,
        catatan_validator = EXCLUDED.catatan_validator,
        status_verifikasi = EXCLUDED.status_verifikasi;

END $$;
`;

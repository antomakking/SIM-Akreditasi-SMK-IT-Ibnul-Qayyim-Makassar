import React, { useState } from 'react';
import { SUPABASE_SQL_DDL } from '../services/supabaseSqlScript';
import { Copy, Check, Download, Database, ShieldAlert, Sparkles, Terminal, FileCode } from 'lucide-react';

export const SqlStudio: React.FC = () => {
  const [copied, setCopied] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'ddl' | 'guide' | 'erd'>('ddl');

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(SUPABASE_SQL_DDL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // fallback
    }
  };

  const handleDownload = () => {
    const blob = new Blob([SUPABASE_SQL_DDL], { type: 'text/sql;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'schema_supabase_akreditasi_smkit_ibnul_qayyim.sql';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header Penjelasan Tugas 1 */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
              <span className="font-semibold text-emerald-700">Tugas 1: Database Architect</span>
              <span aria-hidden="true">·</span>
              <span>PostgreSQL 15+ (Supabase BaaS)</span>
              <span aria-hidden="true">·</span>
              <span>Row Level Security (RLS)</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              Perancangan Skema Database Supabase (SQL DDL)
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 max-w-3xl">
              Struktur data komprehensif untuk instrumen BAN-PDM SMK/MAK 2024 (Versi 2025) dan pencatatan evaluasi diri SMK IT Ibnul Qayyim Makassar. Siap dieksekusi langsung di Supabase SQL Editor.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg border transition-all ${
                copied
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50 shadow-xs'
              }`}
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Tersalin ke Clipboard!' : 'Salin Skrip SQL'}</span>
            </button>

            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Unduh .sql File</span>
            </button>
          </div>
        </div>

        {/* Tab Sub Navigasi */}
        <div className="flex items-center gap-2 mt-6 pt-4 border-t border-slate-100">
          <button
            onClick={() => setActiveTab('ddl')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              activeTab === 'ddl'
                ? 'bg-emerald-50 text-emerald-800'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Skrip DDL & Seed SQL
          </button>
          <button
            onClick={() => setActiveTab('guide')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              activeTab === 'guide'
                ? 'bg-emerald-50 text-emerald-800'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Petunjuk Eksekusi Supabase
          </button>
          <button
            onClick={() => setActiveTab('erd')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              activeTab === 'erd'
                ? 'bg-emerald-50 text-emerald-800'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Arsitektur Relasi (ERD)
          </button>
        </div>
      </div>

      {activeTab === 'ddl' && (
        <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden shadow-lg">
          <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-emerald-400" />
              <span className="font-mono text-slate-300">schema_supabase_akreditasi.sql</span>
              <span className="text-slate-600">·</span>
              <span className="text-slate-500">PostgreSQL DDL + Triggers + RLS + Seed</span>
            </div>
            <button
              onClick={handleCopy}
              className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-mono"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Tersalin!' : 'Copy Code'}</span>
            </button>
          </div>

          <div className="p-4 overflow-x-auto max-h-[620px] font-mono text-xs leading-relaxed text-slate-200">
            <pre className="whitespace-pre">{SUPABASE_SQL_DDL}</pre>
          </div>
        </div>
      )}

      {activeTab === 'guide' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div>
            <h2 className="text-base font-bold text-slate-900 mb-1">
              Panduan Menjalankan Skrip di Supabase & Pipeline GitHub Actions
            </h2>
            <p className="text-xs text-slate-500">
              Langkah terstruktur untuk mempersiapkan backend BaaS sebelum rilis ke web hosting (Hostinger)
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg border border-slate-200 bg-slate-50 space-y-2">
              <div className="w-7 h-7 rounded-md bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                1
              </div>
              <h3 className="text-xs font-bold text-slate-900">Buka Supabase SQL Editor</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Masuk ke dashboard proyek Supabase Anda di <code className="bg-slate-200 px-1 py-0.5 rounded font-mono text-[11px]">app.supabase.com</code>. Pilih menu <strong>SQL Editor</strong> pada bilah sisi kiri, lalu buat <em>New Query</em>.
              </p>
            </div>

            <div className="p-4 rounded-lg border border-slate-200 bg-slate-50 space-y-2">
              <div className="w-7 h-7 rounded-md bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                2
              </div>
              <h3 className="text-xs font-bold text-slate-900">Paste & Eksekusi Skrip DDL</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Salin seluruh skrip dari tab <strong>Skrip DDL & Seed SQL</strong>, tempelkan ke editor, lalu klik tombol hijau <strong>Run</strong>. Database akan membuat 6 tabel, relasi FK, trigger waktu, dan RLS.
              </p>
            </div>

            <div className="p-4 rounded-lg border border-slate-200 bg-slate-50 space-y-2">
              <div className="w-7 h-7 rounded-md bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                3
              </div>
              <h3 className="text-xs font-bold text-slate-900">Verifikasi Table Editor & RLS</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Buka menu <strong>Table Editor</strong> untuk memastikan tabel <code className="font-mono text-emerald-700">komponen</code>, <code className="font-mono text-emerald-700">butir</code>, dan data uji Komponen 1 & Butir 1 telah terisi secara sempurna.
              </p>
            </div>
          </div>

          {/* Rincian RLS */}
          <div className="p-4 rounded-lg border border-emerald-200 bg-emerald-50/60 space-y-2">
            <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs">
              <ShieldAlert className="w-4 h-4 text-emerald-700" />
              <span>Penjelasan Keamanan Row Level Security (RLS)</span>
            </div>
            <p className="text-xs text-emerald-950 leading-relaxed">
              Skrip telah mengaktifkan RLS pada seluruh tabel. Tabel master instrumen (<code className="font-mono">komponen</code>, <code className="font-mono">butir</code>, <code className="font-mono">indikator</code>, <code className="font-mono">rubrik_penilaian</code>, <code className="font-mono">bukti_fisik</code>) dapat dibaca publik agar form asesi dapat memuat instrumen tanpa harus login terlebih dahulu. Sedangkan tabel transaksi <code className="font-mono">evaluasi_asesi</code> dilindungi kebijakan otentikasi sehingga hanya staf SMK IT Ibnul Qayyim Makassar yang berwenang yang dapat menyimpan perubahan data.
            </p>
          </div>

          {/* Catatan Deploy Hostinger via GitHub Actions */}
          <div className="p-4 rounded-lg border border-slate-200 bg-slate-50 space-y-2">
            <h3 className="text-xs font-bold text-slate-900">
              Integrasi Pipeline GitHub Actions ke Web Hosting (Hostinger)
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Karena aplikasi ini adalah Single Page Application (SPA) front-end dengan BaaS Supabase, deploy ke Hostinger sangat mudah via FTP/SSH Actions:
            </p>
            <div className="bg-slate-900 text-slate-200 p-3 rounded font-mono text-[11px] overflow-x-auto">
{`# .github/workflows/deploy.yml
name: Deploy to Hostinger Web Hosting
on:
  push:
    branches: [ main ]
jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 20
      - run: npm ci
      - run: npm run build
      - name: Deploy to Hostinger via FTP
        uses: SamKirkland/FTP-Deploy-Action@v4.3.4
        with:
          server: \${{ secrets.HOSTINGER_FTP_HOST }}
          username: \${{ secrets.HOSTINGER_FTP_USERNAME }}
          password: \${{ secrets.HOSTINGER_FTP_PASSWORD }}
          local-dir: dist/
          server-dir: public_html/`}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'erd' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 mb-1">
              Diagram Relasi Data (Entity Relationship Architecture)
            </h2>
            <p className="text-xs text-slate-500">
              Koneksi hierarkis 6 tabel dari Komponen hingga Evaluasi Asesi
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg border border-slate-200 bg-slate-50">
              <span className="text-xs font-bold font-mono text-emerald-800">1. komponen (1)</span>
              <p className="text-xs text-slate-500 mt-1">4 Komponen Utama Akreditasi</p>
              <ul className="text-[11px] font-mono text-slate-600 mt-2 space-y-0.5">
                <li>• id (UUID PK)</li>
                <li>• kode (VARCHAR UNIQUE)</li>
                <li>• nama (VARCHAR)</li>
                <li>• bobot (NUMERIC)</li>
              </ul>
            </div>

            <div className="p-4 rounded-lg border border-slate-200 bg-slate-50">
              <span className="text-xs font-bold font-mono text-emerald-800">2. butir (N)</span>
              <p className="text-xs text-slate-500 mt-1">16 Butir Standar BAN-PDM</p>
              <ul className="text-[11px] font-mono text-slate-600 mt-2 space-y-0.5">
                <li>• id (UUID PK)</li>
                <li>• komponen_id (FK -&gt; komponen.id)</li>
                <li>• nomor, kode, nama, deskripsi</li>
                <li>• fokus_vokasi (TEXT)</li>
              </ul>
            </div>

            <div className="p-4 rounded-lg border border-slate-200 bg-slate-50">
              <span className="text-xs font-bold font-mono text-emerald-800">3. indikator (N)</span>
              <p className="text-xs text-slate-500 mt-1">Rincian Indikator Kinerja</p>
              <ul className="text-[11px] font-mono text-slate-600 mt-2 space-y-0.5">
                <li>• id (UUID PK)</li>
                <li>• butir_id (FK -&gt; butir.id)</li>
                <li>• definisi_operasional (TEXT)</li>
                <li>• penjelasan (TEXT)</li>
              </ul>
            </div>

            <div className="p-4 rounded-lg border border-slate-200 bg-slate-50">
              <span className="text-xs font-bold font-mono text-emerald-800">4. rubrik_penilaian (N)</span>
              <p className="text-xs text-slate-500 mt-1">4 Level Capaian per Indikator</p>
              <ul className="text-[11px] font-mono text-slate-600 mt-2 space-y-0.5">
                <li>• id (UUID PK)</li>
                <li>• indikator_id (FK -&gt; indikator.id)</li>
                <li>• level (INT 1-4)</li>
                <li>• kategori (Kurang/Cukup/Baik/Sangat)</li>
              </ul>
            </div>

            <div className="p-4 rounded-lg border border-slate-200 bg-slate-50">
              <span className="text-xs font-bold font-mono text-emerald-800">5. bukti_fisik (N)</span>
              <p className="text-xs text-slate-500 mt-1">Daftar Dokumen/Observasi</p>
              <ul className="text-[11px] font-mono text-slate-600 mt-2 space-y-0.5">
                <li>• id (UUID PK)</li>
                <li>• indikator_id (FK -&gt; indikator.id)</li>
                <li>• jenis (Dokumen/Observasi/Wawancara)</li>
                <li>• wajib (BOOLEAN)</li>
              </ul>
            </div>

            <div className="p-4 rounded-lg border border-emerald-300 bg-emerald-50/50">
              <span className="text-xs font-bold font-mono text-emerald-800">6. evaluasi_asesi (1:1)</span>
              <p className="text-xs text-slate-500 mt-1">Isian Riil SMK IT Ibnul Qayyim</p>
              <ul className="text-[11px] font-mono text-slate-700 mt-2 space-y-0.5">
                <li>• id (UUID PK)</li>
                <li>• indikator_id (FK UNIQUE)</li>
                <li>• capaian &amp; skor (INT 1-4)</li>
                <li>• catatan (TEXT Evaluasi Diri)</li>
                <li>• bukti_urls (JSONB link Drive)</li>
                <li>• status_verifikasi (VARCHAR)</li>
              </ul>
            </div>

            <div className="p-4 rounded-lg border border-amber-300 bg-amber-50/50">
              <span className="text-xs font-bold font-mono text-amber-800">8. user_profiles (RBAC)</span>
              <p className="text-xs text-slate-500 mt-1">Peran: Admin, Asesi, Validator, Viewer</p>
              <ul className="text-[11px] font-mono text-slate-700 mt-2 space-y-0.5">
                <li>• id (UUID PK)</li>
                <li>• email (VARCHAR UNIQUE)</li>
                <li>• name, title, department</li>
                <li>• role (Admin | Asesi | Validator | Viewer)</li>
                <li>• RLS Policies Terisolasi</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

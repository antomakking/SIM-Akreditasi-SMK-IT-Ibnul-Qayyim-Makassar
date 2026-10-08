import React, { useState } from 'react';
import { 
  VANILLA_SUPABASE_CLIENT_JS, 
  VANILLA_INSTRUMEN_SERVICE_JS, 
  VANILLA_EVALUASI_SERVICE_JS,
  VANILLA_INDEX_HTML_SNIPPET 
} from '../services/vanillaCodeTemplates';
import { Copy, Check, FileCode2, ShieldCheck, Cpu, Code2 } from 'lucide-react';

export const VanillaCodeStudio: React.FC = () => {
  const [activeFile, setActiveFile] = useState<'client' | 'instrumen' | 'evaluasi' | 'html'>('instrumen');
  const [copiedFile, setCopiedFile] = useState<string | null>(null);

  const getActiveCode = () => {
    switch (activeFile) {
      case 'client':
        return VANILLA_SUPABASE_CLIENT_JS;
      case 'instrumen':
        return VANILLA_INSTRUMEN_SERVICE_JS;
      case 'evaluasi':
        return VANILLA_EVALUASI_SERVICE_JS;
      case 'html':
        return VANILLA_INDEX_HTML_SNIPPET;
    }
  };

  const getFileName = () => {
    switch (activeFile) {
      case 'client':
        return 'supabaseClient.js';
      case 'instrumen':
        return 'instrumenService.js';
      case 'evaluasi':
        return 'evaluasiService.js';
      case 'html':
        return 'index.html (Integrasi CDN)';
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(getActiveCode());
      setCopiedFile(activeFile);
      setTimeout(() => setCopiedFile(null), 2500);
    } catch {
      // fallback
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Penjelasan Tugas 2 */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
              <span className="font-semibold text-indigo-700">Tugas 2: Front-End Engineer</span>
              <span aria-hidden="true">·</span>
              <span>Vanilla JavaScript (ES Modules)</span>
              <span aria-hidden="true">·</span>
              <span>CDN supabase-js v2</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              Integrasi Supabase.js Modular & Validasi Data
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 max-w-3xl">
              Kode Vanilla JavaScript modular yang rapi, menggunakan <code className="font-mono text-emerald-700">async/await</code>, penanganan error <code className="font-mono text-emerald-700">try/catch</code>, relasi JOIN Supabase hierarkis, serta validasi ketat sebelum transmisi data ke database.
            </p>
          </div>

          <button
            onClick={handleCopy}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg border transition-all ${
              copiedFile === activeFile
                ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50 shadow-xs'
            }`}
          >
            {copiedFile === activeFile ? (
              <Check className="w-3.5 h-3.5 text-emerald-600" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
            <span>{copiedFile === activeFile ? 'File Tersalin!' : 'Salin Kode File Ini'}</span>
          </button>
        </div>

        {/* Tab File Selector */}
        <div className="flex flex-wrap items-center gap-2 mt-6 pt-4 border-t border-slate-100">
          <button
            onClick={() => setActiveFile('instrumen')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              activeFile === 'instrumen'
                ? 'bg-indigo-50 text-indigo-800'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>instrumenService.js (fetchInstrumen)</span>
          </button>

          <button
            onClick={() => setActiveFile('evaluasi')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              activeFile === 'evaluasi'
                ? 'bg-indigo-50 text-indigo-800'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>evaluasiService.js (saveEvaluasi + Validasi)</span>
          </button>

          <button
            onClick={() => setActiveFile('client')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              activeFile === 'client'
                ? 'bg-indigo-50 text-indigo-800'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>supabaseClient.js (Inisialisasi CDN)</span>
          </button>

          <button
            onClick={() => setActiveFile('html')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              activeFile === 'html'
                ? 'bg-indigo-50 text-indigo-800'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <FileCode2 className="w-3.5 h-3.5" />
            <span>index.html (Setup Script Tag)</span>
          </button>
        </div>
      </div>

      {/* Code Editor Box */}
      <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden shadow-lg">
        <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-400"></span>
            <span className="font-mono text-slate-300">{getFileName()}</span>
            <span className="text-slate-600">·</span>
            <span className="text-slate-500">Vanilla JS (Clean Architecture)</span>
          </div>
          <button
            onClick={handleCopy}
            className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-mono"
          >
            {copiedFile === activeFile ? (
              <Check className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
            <span>{copiedFile === activeFile ? 'Tersalin' : 'Copy'}</span>
          </button>
        </div>

        <div className="p-4 overflow-x-auto max-h-[600px] font-mono text-xs leading-relaxed text-slate-200">
          <pre className="whitespace-pre">{getActiveCode()}</pre>
        </div>
      </div>

      {/* Bedah Fitur Teknis Utama */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Card Fitur 1: Deep Join Supabase */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Fitur Relasional Deep Nested JOIN Supabase</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Fungsi <code className="font-mono text-emerald-700">fetchInstrumen()</code> mengeksekusi 1 query efisien bertingkat:
            <br />
            <code className="text-[11px] font-mono bg-slate-100 px-1 py-0.5 rounded">komponen -&gt; butir -&gt; indikator -&gt; (rubrik_penilaian &amp; bukti_fisik &amp; evaluasi_asesi)</code>.
            Tidak ada request berantai (N+1 query problem), sehingga pemuatan halaman di hosting Hostinger sangat cepat dan hemat kuota Supabase.
          </p>
        </div>

        {/* Card Fitur 2: Validasi Data Klien */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
            <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
            <span>Validasi Data Integritas (Security & Data Quality)</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Fungsi <code className="font-mono text-indigo-700">validateEvaluasiInput()</code> memeriksa format UUID indikator, validitas enum capaian (<code className="font-mono text-[11px]">Kurang, Cukup Baik, Baik, Sangat Baik</code>), batas minimal uraian catatan evaluasi (min. 20 karakter agar asesi tidak mengisi catatan kosong), dan validitas protokol URL dokumen bukti (http/https).
          </p>
        </div>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  X, 
  Copy, 
  Check, 
  FileText, 
  CheckCircle2, 
  ShieldCheck, 
  HelpCircle, 
  RefreshCw, 
  ArrowRight, 
  Layers, 
  Lightbulb, 
  BookOpen, 
  SlidersHorizontal,
  Bot,
  Zap,
  Info,
  CheckCircle,
  FileCheck2
} from 'lucide-react';
import { getSaranEvaluasi, AiSuggestionResult, AiSuggestionRequest } from '../services/aiAssistantService';
import { getRubrikThemeByLevel } from '../utils/rubrikTheme';

interface AsistenPintarModalProps {
  isOpen: boolean;
  onClose: () => void;
  indikator: {
    id: string;
    kode: string;
    nomor: number;
    nama: string;
    definisi_operasional: string;
    bukti_fisik?: Array<{
      id: string;
      kode: string;
      nama: string;
      jenis: string;
      wajib: boolean;
    }>;
  };
  levelCapaian?: number;
  kategoriCapaian?: string;
  deskripsiRubrik?: string;
  buktiChecklist?: Record<string, string>;
  currentCatatan?: string;
  onApplySuggestion: (suggestionText: string, mode: 'replace' | 'append') => void;
  canEdit: boolean;
}

export const AsistenPintarModal: React.FC<AsistenPintarModalProps> = ({
  isOpen,
  onClose,
  indikator,
  levelCapaian = 4,
  kategoriCapaian = 'Kinerja Unggul',
  deskripsiRubrik = 'Kriteria terpenuhi secara konsisten dan terinternalisasi dalam budaya sekolah.',
  buktiChecklist = {},
  currentCatatan = '',
  onApplySuggestion,
  canEdit,
}) => {
  const [selectedType, setSelectedType] = useState<'rekomendasi_lengkap' | 'ringkas' | 'penyempurnaan' | 'rekomendasi_bukti'>('rekomendasi_lengkap');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AiSuggestionResult | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [applied, setApplied] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'narasi' | 'poin_bukti' | 'tips'>('narasi');
  const [showDefinisi, setShowDefinisi] = useState<boolean>(true);

  // Trigger AI fetch when opened or when preset changes
  useEffect(() => {
    if (isOpen) {
      fetchSuggestion(selectedType);
    } else {
      setResult(null);
      setError(null);
      setCopied(false);
      setApplied(false);
    }
  }, [isOpen, selectedType, indikator.id]);

  const fetchSuggestion = async (type: typeof selectedType) => {
    setLoading(true);
    setError(null);
    setCopied(false);
    setApplied(false);

    try {
      const buktiList = (indikator.bukti_fisik || []).map((b) => ({
        kode: b.kode,
        nama: b.nama,
        status: buktiChecklist[b.id] || 'Belum Ada',
        wajib: b.wajib,
      }));

      const req: AiSuggestionRequest = {
        kodeIndikator: indikator.kode,
        namaIndikator: indikator.nama,
        definisiOperasional: indikator.definisi_operasional,
        levelCapaian,
        kategoriCapaian,
        deskripsiRubrik,
        buktiFisikList: buktiList,
        catatanSaatIni: currentCatatan,
        tipePermintaan: type,
      };

      const res = await getSaranEvaluasi(req);
      setResult(res);
    } catch (err: any) {
      setError(err?.message || 'Terjadi kesalahan saat memproses saran AI.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleApply = (mode: 'replace' | 'append') => {
    if (!result) return;
    onApplySuggestion(result.saranCatatanEvaluasi, mode);
    setApplied(true);
    setTimeout(() => {
      setApplied(false);
      onClose();
    }, 900);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 w-full max-w-3xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header Asisten Pintar */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-900 text-white p-4 sm:p-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#0084FF] to-teal-400 p-0.5 flex items-center justify-center shadow-md">
              <div className="w-full h-full bg-slate-900/40 rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-teal-300 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-white leading-tight">
                  Asisten Pintar Akreditasi
                </h3>
                <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-[#0084FF]/30 text-blue-200 rounded-full border border-blue-400/30">
                  Gemini API 3.8
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5 line-clamp-1">
                Saran narasi evaluasi diri berbasis Definisi Operasional BAN-PDM SMK IT
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 p-2 rounded-xl transition-colors"
            title="Tutup Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sub-Header: Indikator & Definisi Operasional Banner */}
        <div className="bg-slate-50 border-b border-slate-200 px-4 sm:px-6 py-3 shrink-0">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-blue-100 text-[#0084FF] font-bold text-xs rounded font-mono">
                  {indikator.kode}
                </span>
                <span className="text-xs font-bold text-slate-900">
                  {indikator.nama}
                </span>
              </div>
              <div className="text-[11px] text-slate-600 flex items-center gap-2">
                <span>Pilihan Capaian:</span>
                <span className={`inline-flex items-center gap-1 font-bold px-2 py-0.5 rounded text-[11px] border ${getRubrikThemeByLevel(levelCapaian).pillFull}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${getRubrikThemeByLevel(levelCapaian).dotColor}`} />
                  Level {levelCapaian}: {kategoriCapaian}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowDefinisi(!showDefinisi)}
              className="text-[11px] font-medium text-[#0084FF] hover:underline flex items-center gap-1 shrink-0 pt-0.5"
            >
              <Info className="w-3.5 h-3.5" />
              <span>{showDefinisi ? 'Sembunyikan Definisi' : 'Lihat Definisi'}</span>
            </button>
          </div>

          {/* Kotak Definisi Operasional BAN-PDM */}
          {showDefinisi && (
            <div className="mt-2.5 p-3 rounded-xl bg-blue-50/60 border border-blue-100 text-xs text-slate-700 leading-relaxed">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-blue-900 mb-1">
                <BookOpen className="w-3.5 h-3.5 text-[#0084FF]" />
                <span>Definisi Operasional BAN-PDM:</span>
              </div>
              <p className="italic text-slate-700">
                "{indikator.definisi_operasional}"
              </p>
            </div>
          )}
        </div>

        {/* Selector Tipe Saran (Preset Chips) */}
        <div className="bg-white border-b border-slate-100 px-4 sm:px-6 py-2.5 flex items-center gap-2 overflow-x-auto shrink-0">
          <span className="text-[11px] font-semibold text-slate-500 shrink-0 flex items-center gap-1">
            <SlidersHorizontal className="w-3 h-3" />
            Mode Saran:
          </span>

          <button
            type="button"
            onClick={() => setSelectedType('rekomendasi_lengkap')}
            className={`px-3 py-1 text-xs font-medium rounded-lg transition-all shrink-0 flex items-center gap-1.5 ${
              selectedType === 'rekomendasi_lengkap'
                ? 'bg-[#0084FF] text-white shadow-xs font-semibold'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Sparkles className="w-3 h-3" />
            <span>Rekomendasi Lengkap</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedType('ringkas')}
            className={`px-3 py-1 text-xs font-medium rounded-lg transition-all shrink-0 flex items-center gap-1.5 ${
              selectedType === 'ringkas'
                ? 'bg-[#0084FF] text-white shadow-xs font-semibold'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Zap className="w-3 h-3" />
            <span>Ringkas & Padat</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedType('penyempurnaan')}
            className={`px-3 py-1 text-xs font-medium rounded-lg transition-all shrink-0 flex items-center gap-1.5 ${
              selectedType === 'penyempurnaan'
                ? 'bg-[#0084FF] text-white shadow-xs font-semibold'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Lightbulb className="w-3 h-3" />
            <span>Penyempurnaan Draf</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedType('rekomendasi_bukti')}
            className={`px-3 py-1 text-xs font-medium rounded-lg transition-all shrink-0 flex items-center gap-1.5 ${
              selectedType === 'rekomendasi_bukti'
                ? 'bg-[#0084FF] text-white shadow-xs font-semibold'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <FileCheck2 className="w-3 h-3" />
            <span>Fokus Bukti Fisik</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
          {loading && (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
              <div className="relative">
                <div className="w-12 h-12 rounded-full border-3 border-blue-200 border-t-[#0084FF] animate-spin" />
                <Sparkles className="w-5 h-5 text-[#0084FF] absolute inset-0 m-auto animate-pulse" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-bold text-slate-800">
                  Gemini API sedang menganalisis definisi operasional...
                </p>
                <p className="text-xs text-slate-500 max-w-sm">
                  Menyusun narasi evaluasi diri berbasis konteks SMK IT Ibnul Qayyim Makassar dan kriteria BAN-PDM.
                </p>
              </div>
            </div>
          )}

          {error && !loading && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs space-y-2">
              <div className="font-bold flex items-center gap-1.5">
                <span>Gagal Mendapatkan Saran AI:</span>
              </div>
              <p>{error}</p>
              <button
                type="button"
                onClick={() => fetchSuggestion(selectedType)}
                className="mt-2 px-3 py-1 bg-rose-700 text-white rounded-lg text-xs font-medium hover:bg-rose-800 flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Coba Lagi</span>
              </button>
            </div>
          )}

          {result && !loading && (
            <div className="space-y-4">
              {/* Kesesuaian Ringkas */}
              <div className="p-3.5 bg-emerald-50/70 border border-emerald-200/80 rounded-xl">
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 mb-1">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>Kesesuaian dengan Standar Akreditasi:</span>
                </div>
                <p className="text-xs text-emerald-900 leading-relaxed">
                  {result.ringkasanKesesuaian}
                </p>
              </div>

              {/* Navigation Tabs (Narasi | Poin & Bukti | Tips Asesor) */}
              <div className="border-b border-slate-200 flex items-center gap-4 text-xs font-medium">
                <button
                  type="button"
                  onClick={() => setActiveTab('narasi')}
                  className={`pb-2 border-b-2 transition-colors flex items-center gap-1.5 ${
                    activeTab === 'narasi'
                      ? 'border-[#0084FF] text-[#0084FF] font-bold'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Draf Narasi Evaluasi</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('poin_bukti')}
                  className={`pb-2 border-b-2 transition-colors flex items-center gap-1.5 ${
                    activeTab === 'poin_bukti'
                      ? 'border-[#0084FF] text-[#0084FF] font-bold'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Poin Kunci & Bukti Fisik ({result.poinKunci?.length || 0})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('tips')}
                  className={`pb-2 border-b-2 transition-colors flex items-center gap-1.5 ${
                    activeTab === 'tips'
                      ? 'border-[#0084FF] text-[#0084FF] font-bold'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Lightbulb className="w-3.5 h-3.5" />
                  <span>Tips Asesor BAN-PDM</span>
                </button>
              </div>

              {/* Tab 1: Narasi Evaluasi */}
              {activeTab === 'narasi' && (
                <div className="space-y-3">
                  <div className="relative bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs leading-relaxed text-slate-800 whitespace-pre-wrap font-sans select-text">
                    {result.saranCatatanEvaluasi}
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>{result.saranCatatanEvaluasi.length} Karakter · Siap disalin atau diterapkan</span>
                    <button
                      type="button"
                      onClick={() => handleCopy(result.saranCatatanEvaluasi)}
                      className="text-slate-600 hover:text-slate-900 flex items-center gap-1 px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                    >
                      {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      <span>{copied ? 'Tersalin ke Clipboard!' : 'Salin Narasi'}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Tab 2: Poin Kunci & Rekomendasi Dokumen */}
              {activeTab === 'poin_bukti' && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h5 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Poin Keunggulan yang Perlu Ditonjolkan:</span>
                    </h5>
                    <ul className="space-y-1.5">
                      {result.poinKunci?.map((pk, idx) => (
                        <li key={idx} className="text-xs text-slate-700 flex items-start gap-2 bg-slate-50 p-2 rounded-lg border border-slate-200">
                          <span className="w-5 h-5 rounded-full bg-blue-100 text-[#0084FF] flex items-center justify-center font-bold text-[10px] shrink-0">
                            {idx + 1}
                          </span>
                          <span>{pk}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <h5 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <FileCheck2 className="w-4 h-4 text-[#0084FF]" />
                      <span>Rekomendasi Dokumen Fisik / Digital Pendukung:</span>
                    </h5>
                    <ul className="space-y-1.5">
                      {result.rekomendasiDokumen?.map((rd, idx) => (
                        <li key={idx} className="text-xs text-slate-700 flex items-start gap-2 bg-blue-50/40 p-2 rounded-lg border border-blue-100">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#0084FF] mt-1.5 shrink-0" />
                          <span>{rd}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* Tab 3: Tips Asesor BAN-PDM */}
              {activeTab === 'tips' && (
                <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200/80 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-900">
                    <Lightbulb className="w-4 h-4 text-amber-600" />
                    <span>Panduan Visitasi Asesor BAN-PDM untuk Indikator Ini:</span>
                  </div>
                  <p className="text-xs text-amber-950 leading-relaxed">
                    {result.tipsAsesor || 'Pastikan bukti fisik tersusun rapi dan koordinator indikator menguasai penjelasan proses pelaksanaan saat sesi wawancara.'}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="bg-slate-50 border-t border-slate-200 px-4 sm:px-6 py-3 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => fetchSuggestion(selectedType)}
              disabled={loading}
              className="px-3 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-100 transition-colors flex items-center justify-center gap-1.5 w-full sm:w-auto disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Muat Ulang AI</span>
            </button>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 rounded-xl transition-colors"
            >
              Tutup
            </button>

            {canEdit && result && (
              <>
                {currentCatatan && currentCatatan.trim().length > 0 && (
                  <button
                    type="button"
                    onClick={() => handleApply('append')}
                    disabled={applied || loading}
                    className="px-3 py-2 text-xs font-semibold bg-slate-800 text-white rounded-xl hover:bg-slate-900 transition-all flex items-center justify-center gap-1.5 shadow-xs"
                    title="Tambahkan saran ini di akhir catatan saat ini"
                  >
                    <span>+ Tambah ke Catatan</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => handleApply('replace')}
                  disabled={applied || loading}
                  className="px-4 py-2 text-xs font-bold bg-gradient-to-r from-[#FF5722] to-orange-600 text-white rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all flex items-center justify-center gap-1.5 shadow-sm"
                >
                  {applied ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Berhasil Diterapkan!</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Gunakan Saran Ini</span>
                    </>
                  )}
                </button>
              </>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

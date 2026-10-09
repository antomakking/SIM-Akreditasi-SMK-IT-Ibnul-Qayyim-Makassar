import React, { useState, useEffect, useMemo } from 'react';
import { 
  Printer, 
  X, 
  Settings2, 
  CheckCircle2, 
  ZoomIn, 
  ZoomOut, 
  Building2, 
  ShieldCheck, 
  Layers, 
  FileCheck2,
  Calendar,
  User,
  Sliders,
  ChevronDown,
  Info
} from 'lucide-react';
import { Komponen, EvaluasiAsesi, UserProfile, CapaianRubrik } from '../types/akreditasi';
import { DATA_SEKOLAH_AKREDITASI } from '../data/akreditasiData';
import { DEFAULT_TEAM_USERS } from '../services/evaluasiService';

interface InstrumenPrintPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  komponenList: Komponen[];
  evaluasiMap: Record<string, EvaluasiAsesi>;
  currentKomponenId?: string;
  currentUser?: UserProfile;
}

export const InstrumenPrintPreviewModal: React.FC<InstrumenPrintPreviewModalProps> = ({
  isOpen,
  onClose,
  komponenList,
  evaluasiMap,
  currentKomponenId,
  currentUser = DEFAULT_TEAM_USERS[1],
}) => {
  // Opsi Tampilan & Tata Letak Dokumen Cetak
  const [selectedScope, setSelectedScope] = useState<string>(currentKomponenId || 'all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'terisi' | 'selesai'>('all');
  const [showKopSurat, setShowKopSurat] = useState<boolean>(true);
  const [showIdentitasSekolah, setShowIdentitasSekolah] = useState<boolean>(true);
  const [showRekapitulasi, setShowRekapitulasi] = useState<boolean>(true);
  const [showDeskripsiIndikator, setShowDeskripsiIndikator] = useState<boolean>(true);
  const [showCatatanAsesi, setShowCatatanAsesi] = useState<boolean>(true);
  const [showBuktiFisik, setShowBuktiFisik] = useState<boolean>(true);
  const [showBuktiLinks, setShowBuktiLinks] = useState<boolean>(false);
  const [showLembarPengesahan, setShowLembarPengesahan] = useState<boolean>(true);
  const [layoutDensity, setLayoutDensity] = useState<'standard' | 'compact'>('standard');
  const [zoomScale, setZoomScale] = useState<number>(100);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  // Sync selectedScope with currentKomponenId when opened
  useEffect(() => {
    if (isOpen && currentKomponenId) {
      setSelectedScope(currentKomponenId);
    }
  }, [isOpen, currentKomponenId]);

  // Shortcut keyboard: Esc untuk tutup, Ctrl/Cmd + P untuk cetak
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if ((e.ctrlKey || e.metaKey) && (e.key === 'p' || e.key === 'P')) {
        e.preventDefault();
        window.print();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Filter Komponen berdasarkan Scope
  const filteredKomponenList = useMemo(() => {
    if (selectedScope === 'all') {
      return komponenList;
    }
    return komponenList.filter((k) => k.id === selectedScope);
  }, [komponenList, selectedScope]);

  // Statistik Ringkasan Dokumen
  const printStats = useMemo(() => {
    let totalInd = 0;
    let terisiInd = 0;
    let validInd = 0;
    let totalScore = 0;
    let maxScore = 0;

    komponenList.forEach((k) => {
      k.butir?.forEach((b) => {
        b.indikator?.forEach((ind) => {
          totalInd++;
          maxScore += 4;
          const ev = evaluasiMap[ind.id];
          if (ev) {
            terisiInd++;
            totalScore += ev.skor || 0;
            if (ev.status_verifikasi === 'Terverifikasi Valid' || ev.status_verifikasi === 'Selesai') {
              validInd++;
            }
          }
        });
      });
    });

    const completionPercent = totalInd > 0 ? Math.round((terisiInd / totalInd) * 100) : 0;
    const nilaiRata = totalInd > 0 ? (totalScore / totalInd).toFixed(2) : '0.00';
    const nilaiKonversi100 = totalInd > 0 ? Math.round((totalScore / maxScore) * 100) : 0;

    return {
      totalInd,
      terisiInd,
      validInd,
      totalScore,
      completionPercent,
      nilaiRata,
      nilaiKonversi100,
    };
  }, [komponenList, evaluasiMap]);

  // Rekapitulasi per Komponen
  const komponenSummaries = useMemo(() => {
    return komponenList.map((k) => {
      let kTotalInd = 0;
      let kTerisiInd = 0;
      let kValidInd = 0;
      let kScoreSum = 0;

      k.butir?.forEach((b) => {
        b.indikator?.forEach((ind) => {
          kTotalInd++;
          const ev = evaluasiMap[ind.id];
          if (ev) {
            kTerisiInd++;
            kScoreSum += ev.skor || 0;
            if (ev.status_verifikasi === 'Terverifikasi Valid' || ev.status_verifikasi === 'Selesai') {
              kValidInd++;
            }
          }
        });
      });

      const avgScore = kTotalInd > 0 ? (kScoreSum / kTotalInd).toFixed(2) : '0.00';
      const weightedScore = kTotalInd > 0 ? ((kScoreSum / (kTotalInd * 4)) * k.bobot).toFixed(2) : '0.00';

      return {
        id: k.id,
        kode: k.kode,
        nama: k.nama,
        bobot: k.bobot,
        totalIndikator: kTotalInd,
        terisiIndikator: kTerisiInd,
        validIndikator: kValidInd,
        avgScore,
        weightedScore,
      };
    });
  }, [komponenList, evaluasiMap]);

  const totalWeightedOverall = useMemo(() => {
    return komponenSummaries
      .reduce((acc, curr) => acc + parseFloat(curr.weightedScore), 0)
      .toFixed(2);
  }, [komponenSummaries]);

  // Tanggal cetak format resmi Indonesia
  const currentDateFormatted = useMemo(() => {
    const d = new Date();
    return d.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }, []);

  const handleTriggerPrint = () => {
    window.print();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/90 backdrop-blur-xs flex flex-col animate-fadeIn">
      {/* 1. TOP FLOATING / STICKY CONTROL TOOLBAR (Disembunyikan saat cetak) */}
      <aside 
        aria-label="Panel Kontrol Print Preview" 
        className="no-print sticky top-0 z-40 bg-slate-900 border-b border-slate-700 text-white shadow-xl px-4 py-3 shrink-0"
      >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Sisi Kiri: Judul & Informasi Status */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400 shrink-0">
              <Printer className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-white tracking-wide">
                  Pratinjau Cetak Formal (Print Preview)
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Format Resmi BAN-PDM
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Dokumen DIA A4 Terstandarisasi · SMK IT Ibnul Qayyim Makassar
              </p>
            </div>
          </div>

          {/* Sisi Tengah: Quick Filter Scope & Density */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-start md:justify-center">
            {/* Scope Komponen Selector */}
            <div className="flex items-center gap-1.5 bg-slate-800 border border-slate-700 px-2.5 py-1 rounded-xl text-xs">
              <Layers className="w-3.5 h-3.5 text-slate-400" />
              <label htmlFor="scope-select" className="text-slate-400">Lingkup:</label>
              <select
                id="scope-select"
                value={selectedScope}
                onChange={(e) => setSelectedScope(e.target.value)}
                className="bg-transparent text-white font-semibold focus:outline-none cursor-pointer"
              >
                <option value="all" className="bg-slate-900 text-white">
                  Seluruh Komponen (K1 - K4 Lengkap)
                </option>
                {komponenList.map((k) => (
                  <option key={k.id} value={k.id} className="bg-slate-900 text-white">
                    {k.kode} - {k.nama.slice(0, 32)}...
                  </option>
                ))}
              </select>
            </div>

            {/* Filter Status Indikator */}
            <div className="flex items-center gap-1.5 bg-slate-800 border border-slate-700 px-2.5 py-1 rounded-xl text-xs">
              <FileCheck2 className="w-3.5 h-3.5 text-slate-400" />
              <label htmlFor="filter-status-select" className="text-slate-400">Status:</label>
              <select
                id="filter-status-select"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as typeof filterStatus)}
                className="bg-transparent text-white font-semibold focus:outline-none cursor-pointer"
              >
                <option value="all" className="bg-slate-900 text-white">Semua Indikator</option>
                <option value="terisi" className="bg-slate-900 text-white">Hanya yang Terevaluasi</option>
                <option value="selesai" className="bg-slate-900 text-white">Hanya Terverifikasi/Selesai</option>
              </select>
            </div>

            {/* Pengaturan Tambahan Toggle Dropdown */}
            <button
              type="button"
              onClick={() => setIsSettingsOpen(!isSettingsOpen)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-colors cursor-pointer ${
                isSettingsOpen
                  ? 'bg-slate-700 text-white border-slate-600'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
              }`}
              title="Pengaturan Tampilan Cetak Dokumen"
            >
              <Sliders className="w-3.5 h-3.5 text-amber-400" />
              <span>Opsi Dokumen</span>
              <ChevronDown className={`w-3 h-3 transition-transform ${isSettingsOpen ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* Sisi Kanan: Action Buttons (Cetak & Tutup) */}
          <div className="flex items-center gap-2 w-full md:w-auto justify-end">
            {/* Zoom Controls */}
            <div className="hidden lg:flex items-center gap-1 bg-slate-800 border border-slate-700 px-2 py-1 rounded-xl text-xs">
              <button
                type="button"
                onClick={() => setZoomScale(Math.max(70, zoomScale - 10))}
                className="p-1 hover:text-white text-slate-400 transition-colors"
                title="Perkecil Tampilan"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="font-mono text-[11px] px-1 text-slate-300 min-w-[38px] text-center">
                {zoomScale}%
              </span>
              <button
                type="button"
                onClick={() => setZoomScale(Math.min(130, zoomScale + 10))}
                className="p-1 hover:text-white text-slate-400 transition-colors"
                title="Perbesar Tampilan"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Tombol Cetak Dokumen Utama */}
            <button
              type="button"
              onClick={handleTriggerPrint}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-lg transition-all cursor-pointer hover:scale-102"
              title="Cetak dokumen atau simpan sebagai file PDF resmi (Ctrl+P)"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak / Simpan PDF</span>
            </button>

            {/* Tombol Tutup Preview */}
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer border border-slate-700"
              title="Tutup Pratinjau (Esc)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Panel Opsi Dokumen Tambahan (Expandable) */}
        {isSettingsOpen && (
          <div className="mt-3 pt-3 border-t border-slate-800 max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4 text-xs animate-fadeIn">
            <div className="flex flex-wrap items-center gap-4">
              <label className="flex items-center gap-1.5 cursor-pointer text-slate-300 hover:text-white">
                <input
                  type="checkbox"
                  checked={showKopSurat}
                  onChange={(e) => setShowKopSurat(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span>Kop Surat Resmi</span>
              </label>

              <label className="flex items-center gap-1.5 cursor-pointer text-slate-300 hover:text-white">
                <input
                  type="checkbox"
                  checked={showIdentitasSekolah}
                  onChange={(e) => setShowIdentitasSekolah(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span>Identitas Satuan Pendidikan</span>
              </label>

              <label className="flex items-center gap-1.5 cursor-pointer text-slate-300 hover:text-white">
                <input
                  type="checkbox"
                  checked={showRekapitulasi}
                  onChange={(e) => setShowRekapitulasi(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span>Tabel Rekapitulasi Skor</span>
              </label>

              <label className="flex items-center gap-1.5 cursor-pointer text-slate-300 hover:text-white">
                <input
                  type="checkbox"
                  checked={showDeskripsiIndikator}
                  onChange={(e) => setShowDeskripsiIndikator(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span>Definisi & Penjelasan Indikator</span>
              </label>

              <label className="flex items-center gap-1.5 cursor-pointer text-slate-300 hover:text-white">
                <input
                  type="checkbox"
                  checked={showCatatanAsesi}
                  onChange={(e) => setShowCatatanAsesi(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span>Catatan Evaluasi Diri Asesi</span>
              </label>

              <label className="flex items-center gap-1.5 cursor-pointer text-slate-300 hover:text-white">
                <input
                  type="checkbox"
                  checked={showBuktiFisik}
                  onChange={(e) => setShowBuktiFisik(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span>Daftar Bukti Fisik</span>
              </label>

              <label className="flex items-center gap-1.5 cursor-pointer text-slate-300 hover:text-white">
                <input
                  type="checkbox"
                  checked={showBuktiLinks}
                  onChange={(e) => setShowBuktiLinks(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span>Tautan URL Digital</span>
              </label>

              <label className="flex items-center gap-1.5 cursor-pointer text-slate-300 hover:text-white">
                <input
                  type="checkbox"
                  checked={showLembarPengesahan}
                  onChange={(e) => setShowLembarPengesahan(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span>Lembar Pengesahan (Tanda Tangan)</span>
              </label>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-slate-400">Kerapatan:</span>
              <button
                type="button"
                onClick={() => setLayoutDensity('standard')}
                className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors ${
                  layoutDensity === 'standard' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'
                }`}
              >
                Standar
              </button>
              <button
                type="button"
                onClick={() => setLayoutDensity('compact')}
                className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors ${
                  layoutDensity === 'compact' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'
                }`}
              >
                Rapat (Hemat Halaman)
              </button>
            </div>
          </div>
        )}
      </aside>

      {/* 2. AREA WORKBENCH DOKUMEN CETAK FORMAL */}
      <div className="flex-1 p-2 sm:p-6 md:p-10 flex justify-center overflow-x-auto">
        <div 
          style={{ transform: `scale(${zoomScale / 100})`, transformOrigin: 'top center' }}
          className="transition-transform duration-150"
        >
          {/* LEMBAR KERTAS A4 DOKUMEN FORMAL */}
          <article 
            aria-label="Dokumen Evaluasi Diri Akreditasi (DIA)" 
            className="formal-print-document bg-white text-slate-900 shadow-2xl mx-auto my-0 p-8 sm:p-12 md:p-14 w-[210mm] min-h-[297mm] border border-slate-300 print:shadow-none print:border-none print:m-0 print:p-0 print:w-full print:min-h-0"
          >
            
            {/* A. KOP SURAT DINAS RESMI SEKOLAH & YAYASAN */}
            {showKopSurat && (
              <header className="border-b-[3px] border-slate-900 pb-3 mb-6 print-avoid-break">
                <div className="flex items-center justify-between gap-4">
                  {/* Logo Lambang Tut Wuri Handayani / Pendidikan */}
                  <div className="w-20 h-20 shrink-0 flex items-center justify-center p-1">
                    <svg viewBox="0 0 100 100" className="w-18 h-18 text-slate-900" fill="currentColor">
                      <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" strokeWidth="3" />
                      <path d="M50 15 L78 35 L68 70 L32 70 L22 35 Z" fill="none" stroke="currentColor" strokeWidth="2.5" />
                      <circle cx="50" cy="38" r="7" />
                      <path d="M50 48 L50 65 M40 56 L60 56" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                      <path d="M26 78 C35 84 65 84 74 78" fill="none" stroke="currentColor" strokeWidth="2" />
                    </svg>
                  </div>

                  {/* Teks Identitas Kop Surat Formal */}
                  <div className="flex-1 text-center font-serif leading-tight space-y-0.5">
                    <p className="text-xs font-semibold tracking-wider text-slate-700 uppercase">
                      Yayasan Pendidikan Wahdah Islamiyah
                    </p>
                    <p className="text-xs font-semibold tracking-wider text-slate-800 uppercase">
                      Sekolah Menengah Kejuruan Teknologi Informasi
                    </p>
                    <h1 className="text-base sm:text-lg font-black text-slate-950 tracking-wide uppercase font-sans">
                      SMK IT IBNUL QAYYIM MAKASSAR
                    </h1>
                    <p className="text-[11px] font-medium text-slate-700">
                      NPSN: {DATA_SEKOLAH_AKREDITASI.npsn} · STATUS AKREDITASI: {DATA_SEKOLAH_AKREDITASI.statusAkreditasi.toUpperCase()} (BAN-PDM)
                    </p>
                    <p className="text-[10px] text-slate-600">
                      {DATA_SEKOLAH_AKREDITASI.alamat}
                    </p>
                    <p className="text-[9.5px] text-slate-500 font-sans">
                      Pos-el: smkitibnulqayyim@sch.id · Laman: https://smkitibnulqayyim.sch.id · Telp: (0411) 510xxx
                    </p>
                  </div>

                  {/* Logo Lambang Akreditasi / BAN-PDM */}
                  <div className="w-20 h-20 shrink-0 flex items-center justify-center p-1">
                    <div className="w-16 h-16 rounded-xl border-2 border-slate-900 flex flex-col items-center justify-center text-center p-1 font-sans">
                      <span className="text-[9px] font-black tracking-tighter text-slate-900 uppercase">
                        BAN-PDM
                      </span>
                      <ShieldCheck className="w-6 h-6 text-slate-900 my-0.5" />
                      <span className="text-[7.5px] font-bold text-slate-700 leading-none">
                        TERAKREDITASI A
                      </span>
                    </div>
                  </div>
                </div>

                {/* Garis Ganda Khas Surat Resmi */}
                <div className="mt-2 border-t border-slate-900 pt-0.5">
                  <div className="border-t-[0.5px] border-slate-700" />
                </div>
              </header>
            )}

            {/* B. JUDUL DOKUMEN EVALUASI DIRI (DIA) */}
            <div className="text-center my-4 font-serif print-avoid-break">
              <h2 className="text-sm sm:text-base font-extrabold text-slate-950 uppercase tracking-wider underline decoration-1 underline-offset-4">
                DOKUMEN EVALUASI DIRI AKREDITASI (DIA)
              </h2>
              <p className="text-xs font-semibold text-slate-800 mt-1 uppercase font-sans">
                INSTRUMEN AKREDITASI BAN-PDM SMK/MAK 2024 / 2025
              </p>
              <p className="text-[10.5px] text-slate-600 mt-0.5 font-sans">
                {selectedScope === 'all' 
                  ? 'Dokumen Komprehensif Seluruh Komponen Akreditasi (Komponen 1 s.d. 4)' 
                  : `Dokumen Penilaian Mandiri: ${filteredKomponenList[0]?.kode} - ${filteredKomponenList[0]?.nama}`}
              </p>
            </div>

            {/* C. TABEL IDENTITAS SATUAN PENDIDIKAN & TIM ASESI */}
            {showIdentitasSekolah && (
              <section aria-label="Identitas Satuan Pendidikan" className="my-5 border border-slate-800 rounded-sm text-xs print-avoid-break">
                <div className="bg-slate-100 px-3 py-1.5 border-b border-slate-800 font-bold text-slate-900 flex items-center justify-between">
                  <span>I. IDENTITAS SATUAN PENDIDIKAN & PENILAIAN MANDIRI</span>
                  <span className="font-mono text-[10px] text-slate-600">Formulir DIA-01</span>
                </div>
                <div className="p-3 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1.5 font-sans text-[11px] leading-relaxed">
                  <div className="flex">
                    <span className="w-40 text-slate-600 shrink-0">1. Nama Satuan Pendidikan</span>
                    <span className="w-3 text-slate-600">:</span>
                    <strong className="text-slate-900 uppercase">{DATA_SEKOLAH_AKREDITASI.nama}</strong>
                  </div>
                  <div className="flex">
                    <span className="w-40 text-slate-600 shrink-0">6. Tanggal Cetak Dokumen</span>
                    <span className="w-3 text-slate-600">:</span>
                    <span className="text-slate-900 font-medium">{currentDateFormatted}</span>
                  </div>
                  <div className="flex">
                    <span className="w-40 text-slate-600 shrink-0">2. Nomor Pokok Sekolah (NPSN)</span>
                    <span className="w-3 text-slate-600">:</span>
                    <span className="font-mono font-semibold text-slate-900">{DATA_SEKOLAH_AKREDITASI.npsn}</span>
                  </div>
                  <div className="flex">
                    <span className="w-40 text-slate-600 shrink-0">7. Penanggung Jawab / Kepsek</span>
                    <span className="w-3 text-slate-600">:</span>
                    <span className="text-slate-900 font-semibold">{DEFAULT_TEAM_USERS[0].name}</span>
                  </div>
                  <div className="flex">
                    <span className="w-40 text-slate-600 shrink-0">3. Bentuk Pendidikan / Jenjang</span>
                    <span className="w-3 text-slate-600">:</span>
                    <span className="text-slate-900">SMK (Sekolah Menengah Kejuruan)</span>
                  </div>
                  <div className="flex">
                    <span className="w-40 text-slate-600 shrink-0">8. Ketua Tim Asesi Satuan</span>
                    <span className="w-3 text-slate-600">:</span>
                    <span className="text-slate-900 font-semibold">{DEFAULT_TEAM_USERS[1].name}</span>
                  </div>
                  <div className="flex">
                    <span className="w-40 text-slate-600 shrink-0">4. Program Keahlian Unggulan</span>
                    <span className="w-3 text-slate-600">:</span>
                    <span className="text-slate-900">Teknik Komputer & Jaringan / RPL</span>
                  </div>
                  <div className="flex">
                    <span className="w-40 text-slate-600 shrink-0">9. Status Pengisian Evaluasi</span>
                    <span className="w-3 text-slate-600">:</span>
                    <span className="text-slate-900 font-bold">
                      {printStats.terisiInd} dari {printStats.totalInd} Indikator ({printStats.completionPercent}%)
                    </span>
                  </div>
                  <div className="flex">
                    <span className="w-40 text-slate-600 shrink-0">5. Tahun Penilaian Akreditasi</span>
                    <span className="w-3 text-slate-600">:</span>
                    <span className="text-slate-900">2025 / 2026 (Periode Berjalan)</span>
                  </div>
                  <div className="flex">
                    <span className="w-40 text-slate-600 shrink-0">10. Validator Internal BAN-PDM</span>
                    <span className="w-3 text-slate-600">:</span>
                    <span className="text-slate-900">{DEFAULT_TEAM_USERS[5]?.name || 'Dr. Ir. H. Abdurrahman, M.T'}</span>
                  </div>
                </div>
              </section>
            )}

            {/* D. TABEL REKAPITULASI CAPAIAN PER KOMPONEN */}
            {showRekapitulasi && (
              <section aria-label="Rekapitulasi Capaian Nilai per Komponen" className="my-5 print-avoid-break">
                <div className="bg-slate-100 px-3 py-1.5 border border-slate-800 font-bold text-xs text-slate-900 flex items-center justify-between">
                  <span>II. REKAPITULASI CAPAIAN NILAI PER KOMPONEN AKREDITASI</span>
                  <span className="text-[10px] font-normal text-slate-600">Skala Skor: 1.00 s.d. 4.00</span>
                </div>
                <table className="w-full border-collapse border border-slate-800 text-[11px] font-sans">
                  <thead>
                    <tr className="bg-slate-200/80 text-slate-900 text-center font-bold">
                      <th className="border border-slate-800 py-1.5 px-2 w-10">No</th>
                      <th className="border border-slate-800 py-1.5 px-2 w-14">Kode</th>
                      <th className="border border-slate-800 py-1.5 px-3 text-left">Nama Komponen Akreditasi BAN-PDM</th>
                      <th className="border border-slate-800 py-1.5 px-2 w-16">Bobot</th>
                      <th className="border border-slate-800 py-1.5 px-2 w-20">Jml Indikator</th>
                      <th className="border border-slate-800 py-1.5 px-2 w-20">Terevaluasi</th>
                      <th className="border border-slate-800 py-1.5 px-2 w-20">Rata-rata Skor</th>
                      <th className="border border-slate-800 py-1.5 px-2 w-24">Skor Terbobot</th>
                    </tr>
                  </thead>
                  <tbody>
                    {komponenSummaries.map((s, idx) => (
                      <tr key={s.id} className="text-center hover:bg-slate-50">
                        <td className="border border-slate-800 py-1 px-2">{idx + 1}</td>
                        <td className="border border-slate-800 py-1 px-2 font-mono font-bold text-slate-900">{s.kode}</td>
                        <td className="border border-slate-800 py-1 px-3 text-left font-medium text-slate-800">{s.nama}</td>
                        <td className="border border-slate-800 py-1 px-2 font-semibold">{s.bobot}%</td>
                        <td className="border border-slate-800 py-1 px-2">{s.totalIndikator}</td>
                        <td className="border border-slate-800 py-1 px-2 font-semibold text-emerald-800">
                          {s.terisiIndikator} / {s.totalIndikator}
                        </td>
                        <td className="border border-slate-800 py-1 px-2 font-mono font-bold">{s.avgScore}</td>
                        <td className="border border-slate-800 py-1 px-2 font-mono font-bold text-slate-900">{s.weightedScore}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-slate-100 font-bold text-center border-t-2 border-slate-800">
                      <td colSpan={3} className="border border-slate-800 py-1.5 px-3 text-right">
                        TOTAL ESTIMASI SKOR AKREDITASI
                      </td>
                      <td className="border border-slate-800 py-1.5 px-2">100%</td>
                      <td className="border border-slate-800 py-1.5 px-2">{printStats.totalInd}</td>
                      <td className="border border-slate-800 py-1.5 px-2 text-emerald-900">{printStats.terisiInd}</td>
                      <td className="border border-slate-800 py-1.5 px-2 font-mono">{printStats.nilaiRata}</td>
                      <td className="border border-slate-800 py-1.5 px-2 font-mono text-sm text-slate-950 font-black">
                        {totalWeightedOverall}
                      </td>
                    </tr>
                  </tfoot>
                </table>
                <div className="mt-1 flex items-center justify-between text-[10px] text-slate-600 px-1 font-sans">
                  <span>* Skor terbobot dihitung proporsional dari batas maksimal 100 poin.</span>
                  <span>Predikat Akreditasi Mandiri: <strong>UNGGUL (TERAKREDITASI A)</strong></span>
                </div>
              </section>
            )}

            {/* E. RINCIAN BUTIR & INDIKATOR EVALUASI (TABEL FORMAL UTAMA) */}
            <section aria-label="Instrumen Evaluasi dan Pembuktian Fisik" className="my-6 space-y-6">
              <div className="bg-slate-100 px-3 py-1.5 border border-slate-800 font-bold text-xs text-slate-900 flex items-center justify-between print-avoid-break">
                <span>III. RINCIAN BUTIR, INDIKATOR KINERJA, DAN CATATAN EVALUASI DIRI (DIA)</span>
                <span className="text-[10px] font-normal text-slate-600">Instrumen BAN-PDM SMK</span>
              </div>

              {filteredKomponenList.map((komp, kIdx) => {
                return (
                  <div key={komp.id} className="space-y-4 print-avoid-break">
                    {/* Header Komponen */}
                    <div className="bg-slate-800 text-white px-3 py-2 rounded-xs flex items-center justify-between text-xs font-bold font-sans">
                      <div className="flex items-center gap-2">
                        <span className="bg-white text-slate-900 px-1.5 py-0.5 rounded-xs font-mono text-[11px]">
                          {komp.kode}
                        </span>
                        <span>{komp.nama}</span>
                      </div>
                      <span className="font-mono text-[11px] text-slate-200">Bobot Komponen: {komp.bobot}%</span>
                    </div>

                    {komp.butir?.map((butir) => {
                      // Filter indikator sesuai filterStatus
                      const indicators = (butir.indikator || []).filter((ind) => {
                        const evalItem = evaluasiMap[ind.id];
                        if (filterStatus === 'terisi') return !!evalItem;
                        if (filterStatus === 'selesai') {
                          return evalItem?.status_verifikasi === 'Terverifikasi Valid' || evalItem?.status_verifikasi === 'Selesai';
                        }
                        return true;
                      });

                      if (indicators.length === 0) return null;

                      return (
                        <div key={butir.id} className="border border-slate-800 rounded-xs overflow-hidden mb-4 print-avoid-break">
                          {/* Header Butir */}
                          <div className="bg-slate-100/90 px-3 py-1.5 border-b border-slate-800 flex items-center justify-between text-[11px] font-sans">
                            <div className="flex items-start gap-2">
                              <span className="font-mono font-bold text-slate-900 bg-white border border-slate-300 px-1 py-0.2 rounded-xs text-[10px]">
                                {butir.kode}
                              </span>
                              <span className="font-bold text-slate-900">{butir.nama}</span>
                            </div>
                            {butir.fokus_vokasi && (
                              <span className="text-[9.5px] italic text-slate-600 hidden sm:inline">
                                Fokus: {butir.fokus_vokasi}
                              </span>
                            )}
                          </div>

                          {/* Tabel Rincian Indikator untuk Butir ini */}
                          <table className="w-full border-collapse text-[10.5px] font-sans">
                            <thead>
                              <tr className="bg-slate-50 text-slate-800 border-b border-slate-800 text-center font-bold">
                                <th className="border-r border-slate-800 py-1.5 px-2 w-16">Kode</th>
                                <th className="border-r border-slate-800 py-1.5 px-3 text-left w-1/3">
                                  Indikator Kinerja & Definisi
                                </th>
                                <th className="border-r border-slate-800 py-1.5 px-2 w-28">
                                  Capaian & Skor
                                </th>
                                {showCatatanAsesi && (
                                  <th className="border-r border-slate-800 py-1.5 px-3 text-left">
                                    Catatan Analisis Evaluasi Diri
                                  </th>
                                )}
                                {showBuktiFisik && (
                                  <th className="border-r border-slate-800 py-1.5 px-2 w-44 text-left">
                                    Bukti Fisik & Status
                                  </th>
                                )}
                                <th className="py-1.5 px-2 w-24">Status</th>
                              </tr>
                            </thead>
                            <tbody>
                              {indicators.map((ind, indIdx) => {
                                const evalItem = evaluasiMap[ind.id];
                                const currentCapaian = evalItem?.capaian || 'Belum Diisi';
                                const currentSkor = evalItem?.skor || 0;
                                const currentCatatan = evalItem?.catatan || '- Belum ada catatan evaluasi diri tertulis -';
                                const statusVerif = evalItem?.status_verifikasi || 'Belum Diunggah';

                                return (
                                  <tr 
                                    key={ind.id} 
                                    className={`border-b border-slate-800 align-top ${
                                      indIdx % 2 === 1 ? 'bg-slate-50/50' : 'bg-white'
                                    } print-avoid-break`}
                                  >
                                    {/* Kolom 1: Kode Indikator */}
                                    <td className="border-r border-slate-800 p-2 text-center font-mono font-bold text-slate-900">
                                      {ind.kode}
                                    </td>

                                    {/* Kolom 2: Nama & Definisi Indikator */}
                                    <td className="border-r border-slate-800 p-2.5">
                                      <p className="font-bold text-slate-950 leading-snug">
                                        {ind.nama}
                                      </p>
                                      {showDeskripsiIndikator && (
                                        <p className="text-[9.5px] text-slate-600 mt-1 leading-normal">
                                          {ind.definisi_operasional || ind.penjelasan}
                                        </p>
                                      )}
                                    </td>

                                    {/* Kolom 3: Level Capaian Rubrik & Skor */}
                                    <td className="border-r border-slate-800 p-2 text-center font-sans">
                                      <div className="font-bold text-slate-900 text-[11px]">
                                        {currentCapaian}
                                      </div>
                                      <div className="text-[10px] text-slate-600 font-mono mt-0.5">
                                        Skor: <strong className="text-slate-900 font-bold">{currentSkor}.00</strong> / 4.00
                                      </div>
                                      <div className="text-[8.5px] text-slate-500 mt-0.5">
                                        Level {currentSkor} BAN-PDM
                                      </div>
                                    </td>

                                    {/* Kolom 4: Catatan Evaluasi Diri Asesi */}
                                    {showCatatanAsesi && (
                                      <td className="border-r border-slate-800 p-2.5 text-[10px] leading-relaxed text-slate-800 font-serif">
                                        <div className="whitespace-pre-line">
                                          {currentCatatan}
                                        </div>
                                      </td>
                                    )}

                                    {/* Kolom 5: Bukti Fisik Pendukung */}
                                    {showBuktiFisik && (
                                      <td className="border-r border-slate-800 p-2 text-[9.5px]">
                                        {ind.bukti_fisik && ind.bukti_fisik.length > 0 ? (
                                          <ul className="space-y-1">
                                            {ind.bukti_fisik.map((bf) => {
                                              const bfStatus = evalItem?.bukti_checklist?.[bf.id] || 'Belum Ada';
                                              return (
                                                <li key={bf.id} className="leading-tight flex items-start gap-1">
                                                  <span className={`font-mono text-[9px] font-bold shrink-0 ${
                                                    bfStatus === 'Tersedia' ? 'text-emerald-700' : 'text-slate-500'
                                                  }`}>
                                                    [{bfStatus === 'Tersedia' ? '✓' : '—'}]
                                                  </span>
                                                  <span className="text-slate-800">
                                                    {bf.nama}
                                                    {bf.wajib && <span className="text-rose-600 font-bold ml-0.5">*</span>}
                                                  </span>
                                                </li>
                                              );
                                            })}
                                          </ul>
                                        ) : (
                                          <span className="text-slate-400 italic">Tidak ada daftar bukti khusus</span>
                                        )}

                                        {/* Tautan URL Digital jika dicentang */}
                                        {showBuktiLinks && evalItem?.bukti_urls && evalItem.bukti_urls.length > 0 && (
                                          <div className="mt-1.5 pt-1 border-t border-slate-200">
                                            <span className="text-[8.5px] font-bold text-slate-600 uppercase">Tautan Berkas:</span>
                                            <div className="font-mono text-[8.5px] text-slate-700 truncate max-w-[150px]">
                                              {evalItem.bukti_urls[0]}
                                            </div>
                                          </div>
                                        )}
                                      </td>
                                    )}

                                    {/* Kolom 6: Status Verifikasi */}
                                    <td className="p-2 text-center">
                                      <span className="inline-block px-1.5 py-0.5 text-[9px] font-bold border border-slate-800 rounded-xs uppercase tracking-tight text-slate-900">
                                        {statusVerif}
                                      </span>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </section>

            {/* F. LEMBAR PENGESAHAN DOKUMEN FORMAL (TANDA TANGAN 3 PIHAK) */}
            {showLembarPengesahan && (
              <section aria-label="Lembar Pengesahan Dokumen Formal" className="my-8 pt-4 border-t border-slate-800 print-avoid-break">
                <div className="text-right text-xs text-slate-800 mb-6 font-serif">
                  <p>Makassar, {currentDateFormatted}</p>
                </div>

                <div className="grid grid-cols-3 gap-4 text-center font-serif text-[11px] leading-snug">
                  {/* Kolom 1: Asesi / Ketua Tim Akreditasi */}
                  <div className="flex flex-col justify-between h-40">
                    <div>
                      <p className="font-semibold text-slate-800">Ketua Tim Asesi / Akreditasi,</p>
                      <p className="text-[10px] text-slate-600 mt-0.5">SMK IT Ibnul Qayyim Makassar</p>
                    </div>

                    <div>
                      <p className="font-bold text-slate-950 underline decoration-1 underline-offset-2">
                        {DEFAULT_TEAM_USERS[1].name}
                      </p>
                      <p className="text-[10px] text-slate-600 font-mono mt-0.5">
                        NIP/NUPTK: 19880415 201402 1 003
                      </p>
                    </div>
                  </div>

                  {/* Kolom 2: Verifikator / Auditor Penjamin Mutu */}
                  <div className="flex flex-col justify-between h-40">
                    <div>
                      <p className="font-semibold text-slate-800">Verifikator / Reviewer Internal,</p>
                      <p className="text-[10px] text-slate-600 mt-0.5">Tim Penjaminan Mutu Satuan</p>
                    </div>

                    <div>
                      <p className="font-bold text-slate-950 underline decoration-1 underline-offset-2">
                        {DEFAULT_TEAM_USERS[5]?.name || 'Dr. Ir. H. Abdurrahman, M.T'}
                      </p>
                      <p className="text-[10px] text-slate-600 font-mono mt-0.5">
                        NIP/NUPTK: 19740621 199903 1 002
                      </p>
                    </div>
                  </div>

                  {/* Kolom 3: Mengetahui / Kepala Satuan Pendidikan */}
                  <div className="flex flex-col justify-between h-40">
                    <div>
                      <p className="font-semibold text-slate-800">Mengetahui & Mengesahkan,</p>
                      <p className="font-semibold text-slate-900 mt-0.5">Kepala SMK IT Ibnul Qayyim</p>
                    </div>

                    <div className="relative">
                      {/* Stempel Grafis Otentikasi BAN-PDM */}
                      <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-20 h-20 rounded-full border-2 border-slate-900/40 border-dashed flex items-center justify-center pointer-events-none rotate-[-12deg]">
                        <span className="text-[8px] font-black uppercase text-slate-900/40 text-center leading-none">
                          TERVERIFIKASI<br />BAN-PDM<br />2026
                        </span>
                      </div>

                      <p className="font-bold text-slate-950 underline decoration-1 underline-offset-2 relative z-10">
                        {DEFAULT_TEAM_USERS[0].name}
                      </p>
                      <p className="text-[10px] text-slate-600 font-mono mt-0.5 relative z-10">
                        NIP/NUPTK: 19810312 200501 1 004
                      </p>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* G. FOOTER FORMAL DOKUMEN CETAK */}
            <footer className="mt-8 pt-3 border-t border-slate-400 text-[9px] text-slate-500 font-sans flex items-center justify-between print-avoid-break">
              <span>
                Dokumen Resmi SIM Akreditasi BAN-PDM · SMK IT Ibnul Qayyim Makassar (NPSN: {DATA_SEKOLAH_AKREDITASI.npsn})
              </span>
              <span>
                Dicetak secara digital pada: {new Date().toLocaleString('id-ID')}
              </span>
            </footer>

          </article>
        </div>
      </div>
    </div>
  );
};

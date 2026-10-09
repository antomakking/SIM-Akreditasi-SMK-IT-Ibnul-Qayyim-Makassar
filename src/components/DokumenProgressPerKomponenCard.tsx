import React, { useState, useMemo } from 'react';
import { Komponen, EvaluasiAsesi, StatusBuktiFisik } from '../types/akreditasi';
import { 
  FileCheck2, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  Search, 
  ArrowRight, 
  ChevronDown, 
  ChevronUp, 
  Copy, 
  Check, 
  Filter, 
  Sparkles,
  ExternalLink,
  ShieldAlert,
  Layers,
  FileWarning,
  Eye,
  FileSpreadsheet,
  AlertTriangle,
  Target,
  BarChart3,
  TrendingDown,
  Table,
  CheckSquare
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip as RechartsTooltip, 
  CartesianGrid, 
  Legend, 
  Cell 
} from 'recharts';
import { evaluateIndikatorDeadline } from '../services/deadlineService';

export interface KekuranganDokumenItem {
  buktiId: string;
  kodeBukti: string;
  namaBukti: string;
  jenis: string;
  wajib: boolean;
  status: 'Dalam Proses' | 'Belum Ada';
  indikatorId: string;
  indikatorKode: string;
  indikatorNama: string;
  butirKode: string;
  komponenId: string;
  komponenKode: string;
  komponenNama: string;
  deadlineUrgency?: string;
  deadlineLabel?: string;
  isDeadlineUrgent?: boolean;
  formattedDeadlineDate?: string;
}

export interface KomponenDokumenSummary {
  id: string;
  kode: string;
  nama: string;
  bobot: number;
  totalBukti: number;
  tersediaBukti: number;
  dalamProsesBukti: number;
  belumAdaBukti: number;
  persentasePemenuhan: number;
  totalKekurangan: number;
  totalWajibKurang: number;
  // Gap Analysis Fields
  totalWajib: number;
  wajibTersedia: number;
  wajibDalamProses: number;
  wajibBelumAda: number;
  gapWajib: number;
  gapWajibPercentage: number;
  wajibFulfillmentPercent: number;
  gapStatus: 'tuntas' | 'rendah' | 'kritis';
  daftarKekurangan: KekuranganDokumenItem[];
  daftarWajibKurang: KekuranganDokumenItem[];
}

export interface OverallDokumenSummary {
  total: number;
  tersedia: number;
  dalamProses: number;
  belumAda: number;
  kekurangan: number;
  wajibKurang: number;
  persentase: number;
  totalWajib: number;
  wajibTersedia: number;
  wajibDalamProses: number;
  wajibBelumAda: number;
  gapWajib: number;
  gapWajibPercentage: number;
  wajibFulfillmentPercent: number;
  highestGapKomponen?: KomponenDokumenSummary;
}

interface DokumenProgressPerKomponenCardProps {
  komponenList: Komponen[];
  evaluasiMap: Record<string, EvaluasiAsesi>;
  onSelectKomponen?: (kompId: string) => void;
}

export const DokumenProgressPerKomponenCard: React.FC<DokumenProgressPerKomponenCardProps> = ({
  komponenList,
  evaluasiMap,
  onSelectKomponen,
}) => {
  // State interaktif
  const [activeViewTab, setActiveViewTab] = useState<'gap_analysis' | 'gap_table' | 'component_cards'>('gap_analysis');
  const [selectedKomponenFilter, setSelectedKomponenFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'Belum Ada' | 'Dalam Proses' | 'wajib'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedKomponenId, setExpandedKomponenId] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // Kalkulasi rekap pemenuhan dokumen dan gap analisis per komponen
  const { komponenSummaries, overallSummary, allKekurangan } = useMemo(() => {
    let grandTotalBukti = 0;
    let grandTersedia = 0;
    let grandDalamProses = 0;
    let grandBelumAda = 0;
    let grandTotalWajib = 0;
    let grandWajibTersedia = 0;
    let grandWajibDalamProses = 0;
    let grandWajibBelumAda = 0;
    const allKekuranganList: KekuranganDokumenItem[] = [];

    const summaries: KomponenDokumenSummary[] = komponenList.map((k) => {
      let totalBukti = 0;
      let tersedia = 0;
      let dalamProses = 0;
      let belumAda = 0;
      let totalWajib = 0;
      let wajibTersedia = 0;
      let wajibDalamProses = 0;
      let wajibBelumAda = 0;
      const kekuranganList: KekuranganDokumenItem[] = [];

      k.butir?.forEach((b) => {
        b.indikator?.forEach((ind) => {
          const evalItem = evaluasiMap[ind.id];
          ind.bukti_fisik?.forEach((bf) => {
            totalBukti++;
            const isWajib = !!bf.wajib;
            if (isWajib) totalWajib++;

            const rawStatus = evalItem?.bukti_checklist?.[bf.id];
            const currentStatus: StatusBuktiFisik = rawStatus || 'Belum Ada';

            if (currentStatus === 'Tersedia') {
              tersedia++;
              if (isWajib) wajibTersedia++;
            } else {
              if (currentStatus === 'Dalam Proses') {
                dalamProses++;
                if (isWajib) wajibDalamProses++;
              } else {
                belumAda++;
                if (isWajib) wajibBelumAda++;
              }

              const dlInfo = evaluateIndikatorDeadline(ind, k, b.kode, evalItem);

              const item: KekuranganDokumenItem = {
                buktiId: bf.id,
                kodeBukti: bf.kode,
                namaBukti: bf.nama,
                jenis: bf.jenis,
                wajib: isWajib,
                status: currentStatus as 'Dalam Proses' | 'Belum Ada',
                indikatorId: ind.id,
                indikatorKode: ind.kode,
                indikatorNama: ind.nama,
                butirKode: b.kode,
                komponenId: k.id,
                komponenKode: k.kode,
                komponenNama: k.nama,
                deadlineUrgency: dlInfo.urgency,
                deadlineLabel: dlInfo.urgencyLabel,
                isDeadlineUrgent: dlInfo.isUrgent,
                formattedDeadlineDate: dlInfo.formattedDate,
              };

              kekuranganList.push(item);
              allKekuranganList.push(item);
            }
          });
        });
      });

      grandTotalBukti += totalBukti;
      grandTersedia += tersedia;
      grandDalamProses += dalamProses;
      grandBelumAda += belumAda;
      grandTotalWajib += totalWajib;
      grandWajibTersedia += wajibTersedia;
      grandWajibDalamProses += wajibDalamProses;
      grandWajibBelumAda += wajibBelumAda;

      const persentase = totalBukti > 0 ? Math.round((tersedia / totalBukti) * 100) : 0;
      const gapWajib = totalWajib - wajibTersedia;
      const gapWajibPercentage = totalWajib > 0 ? Math.round((gapWajib / totalWajib) * 100) : 0;
      const wajibFulfillmentPercent = totalWajib > 0 ? Math.round((wajibTersedia / totalWajib) * 100) : 100;
      const gapStatus: 'tuntas' | 'rendah' | 'kritis' = 
        gapWajib === 0 ? 'tuntas' : gapWajib <= 2 ? 'rendah' : 'kritis';

      return {
        id: k.id,
        kode: k.kode,
        nama: k.nama,
        bobot: k.bobot,
        totalBukti,
        tersediaBukti: tersedia,
        dalamProsesBukti: dalamProses,
        belumAdaBukti: belumAda,
        persentasePemenuhan: persentase,
        totalKekurangan: dalamProses + belumAda,
        totalWajibKurang: gapWajib,
        totalWajib,
        wajibTersedia,
        wajibDalamProses,
        wajibBelumAda,
        gapWajib,
        gapWajibPercentage,
        wajibFulfillmentPercent,
        gapStatus,
        daftarKekurangan: kekuranganList,
        daftarWajibKurang: kekuranganList.filter((item) => item.wajib),
      };
    });

    const overallPct = grandTotalBukti > 0 ? Math.round((grandTersedia / grandTotalBukti) * 100) : 0;
    const grandWajibGap = grandTotalWajib - grandWajibTersedia;
    const grandWajibGapPct = grandTotalWajib > 0 ? Math.round((grandWajibGap / grandTotalWajib) * 100) : 0;
    const grandWajibFulfillmentPct = grandTotalWajib > 0 ? Math.round((grandWajibTersedia / grandTotalWajib) * 100) : 100;

    const sortedByGap = [...summaries].sort((a, b) => b.gapWajib - a.gapWajib);
    const highestGapKomp = sortedByGap[0];

    const overall: OverallDokumenSummary = {
      total: grandTotalBukti,
      tersedia: grandTersedia,
      dalamProses: grandDalamProses,
      belumAda: grandBelumAda,
      kekurangan: grandDalamProses + grandBelumAda,
      wajibKurang: grandWajibGap,
      persentase: overallPct,
      totalWajib: grandTotalWajib,
      wajibTersedia: grandWajibTersedia,
      wajibDalamProses: grandWajibDalamProses,
      wajibBelumAda: grandWajibBelumAda,
      gapWajib: grandWajibGap,
      gapWajibPercentage: grandWajibGapPct,
      wajibFulfillmentPercent: grandWajibFulfillmentPct,
      highestGapKomponen: highestGapKomp,
    };

    return {
      komponenSummaries: summaries,
      overallSummary: overall,
      allKekurangan: allKekuranganList,
    };
  }, [komponenList, evaluasiMap]);

  // Filter daftar kekurangan dokumen
  const filteredKekurangan = useMemo(() => {
    return allKekurangan.filter((item) => {
      // Filter komponen
      if (selectedKomponenFilter !== 'all' && item.komponenId !== selectedKomponenFilter) {
        return false;
      }
      // Filter status
      if (statusFilter === 'Belum Ada' && item.status !== 'Belum Ada') return false;
      if (statusFilter === 'Dalam Proses' && item.status !== 'Dalam Proses') return false;
      if (statusFilter === 'wajib' && !item.wajib) return false;
      // Filter search
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        return (
          item.namaBukti.toLowerCase().includes(query) ||
          item.kodeBukti.toLowerCase().includes(query) ||
          item.indikatorNama.toLowerCase().includes(query) ||
          item.indikatorKode.toLowerCase().includes(query)
        );
      }
      return true;
    });
  }, [allKekurangan, selectedKomponenFilter, statusFilter, searchQuery]);

  // Copy list kekurangan to clipboard
  const handleCopyKekurangan = () => {
    const lines = [
      `DAFTAR KEKURANGAN BUKTI FISIK & DOKUMEN AKREDITASI BAN-PDM`,
      `SMK IT IBNUL QAYYIM MAKASSAR`,
      `Tanggal Unduh: ${new Date().toLocaleDateString('id-ID', { dateStyle: 'full' })}`,
      `Total Kekurangan: ${filteredKekurangan.length} Dokumen`,
      `--------------------------------------------------`,
      ...filteredKekurangan.map((item, idx) => {
        return `${idx + 1}. [${item.komponenKode}] ${item.kodeBukti} - ${item.namaBukti}
   Indikator: ${item.indikatorKode} (${item.indikatorNama})
   Status: ${item.status.toUpperCase()} | Sifat: ${item.wajib ? 'WAJIB' : 'OPSIONAL'} | Jenis: ${item.jenis}`;
      }),
      `--------------------------------------------------`,
      `Sistem Informasi Akreditasi (SIM) SMK IT Ibnul Qayyim Makassar`
    ];

    navigator.clipboard.writeText(lines.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // Helper warna tema per komponen
  const getComponentBadgeTheme = (kode: string) => {
    switch (kode) {
      case 'K1':
        return {
          pill: 'bg-blue-50 text-[#0084FF] border-blue-200',
          barColor: '#0084FF',
          accentBg: 'bg-blue-500',
          lightBg: 'bg-blue-50/50',
          border: 'border-blue-100',
        };
      case 'K2':
        return {
          pill: 'bg-amber-50 text-[#D97706] border-amber-200',
          barColor: '#D97706',
          accentBg: 'bg-amber-500',
          lightBg: 'bg-amber-50/50',
          border: 'border-amber-100',
        };
      case 'K3':
        return {
          pill: 'bg-orange-50 text-[#FF5722] border-orange-200',
          barColor: '#FF5722',
          accentBg: 'bg-orange-500',
          lightBg: 'bg-orange-50/50',
          border: 'border-orange-100',
        };
      case 'K4':
      default:
        return {
          pill: 'bg-purple-50 text-[#7C3AED] border-purple-200',
          barColor: '#7C3AED',
          accentBg: 'bg-purple-500',
          lightBg: 'bg-purple-50/50',
          border: 'border-purple-100',
        };
    }
  };

  // Data Recharts untuk Grafik Komparasi Target vs Terunggah & Gap
  const rechartsGapData = useMemo(() => {
    return komponenSummaries.map((s) => ({
      name: s.kode,
      fullName: s.nama,
      targetWajib: s.totalWajib,
      terunggah: s.wajibTersedia,
      gapDefisit: s.gapWajib,
      dalamProses: s.wajibDalamProses,
      belumAda: s.wajibBelumAda,
      persen: s.wajibFulfillmentPercent,
      gapPct: s.gapWajibPercentage,
    }));
  }, [komponenSummaries]);

  // Helper label tingkat pemenuhan
  const getFulfillmentLevelBadge = (pct: number) => {
    if (pct >= 85) {
      return {
        label: 'Sangat Lengkap',
        badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300',
        progressClass: 'bg-emerald-500',
        textColor: 'text-emerald-700',
      };
    }
    if (pct >= 60) {
      return {
        label: 'Sebagian Lengkap',
        badgeClass: 'bg-blue-100 text-blue-800 border-blue-300',
        progressClass: 'bg-[#0084FF]',
        textColor: 'text-blue-700',
      };
    }
    if (pct >= 40) {
      return {
        label: 'Perlu Ditingkatkan',
        badgeClass: 'bg-amber-100 text-amber-800 border-amber-300',
        progressClass: 'bg-amber-500',
        textColor: 'text-amber-700',
      };
    }
    return {
      label: 'Banyak Kekurangan',
      badgeClass: 'bg-rose-100 text-rose-800 border-rose-300',
      progressClass: 'bg-rose-500',
      textColor: 'text-rose-700',
    };
  };

  // Custom tooltip untuk Recharts Komparasi Gap
  const CustomGapTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900/95 backdrop-blur-md text-white p-3.5 rounded-xl shadow-xl border border-slate-700 text-xs space-y-2 min-w-[240px]">
          <div className="border-b border-slate-800 pb-1.5 flex items-center justify-between gap-2">
            <span className="font-bold text-white text-xs truncate">{data.name} — {data.fullName}</span>
            <span className="text-[10px] font-mono font-bold bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded border border-indigo-400/30 shrink-0">
              {data.persen}% Terpenuhi
            </span>
          </div>
          <div className="space-y-1 text-[11px]">
            <div className="flex items-center justify-between text-indigo-300">
              <span>Target Dokumen Wajib:</span>
              <span className="font-mono font-bold">{data.targetWajib} Berkas</span>
            </div>
            <div className="flex items-center justify-between text-emerald-400">
              <span>Dokumen Terunggah (Tersedia):</span>
              <span className="font-mono font-bold">{data.terunggah} Berkas ({data.persen}%)</span>
            </div>
            {data.dalamProses > 0 && (
              <div className="flex items-center justify-between text-amber-300">
                <span>Dalam Proses Penyusunan:</span>
                <span className="font-mono font-bold">{data.dalamProses} Berkas</span>
              </div>
            )}
            <div className="flex items-center justify-between text-rose-400 font-semibold border-t border-slate-800 pt-1">
              <span>GAP Defisit Dokumen Wajib:</span>
              <span className="font-mono font-bold">
                {data.gapDefisit === 0 ? '✓ Tuntas (0 Gap)' : `-${data.gapDefisit} Berkas (${data.gapPct}%)`}
              </span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div id="dashboard-document-fulfillment" className="bg-white rounded-2xl border border-slate-100 p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-6">
      
      {/* 1. Header Card with Title, View Tabs & Actions */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-orange-50 text-[#FF5722] flex items-center justify-center shadow-2xs">
              <FileCheck2 className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                  Perbandingan Dokumen Terunggah vs Target Dokumen Wajib
                </h2>
                <span className="text-[10px] font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200">
                  Analisis Gap BAN-PDM
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Visualisasi komparatif antara bukti fisik yang sudah siap (terunggah) dengan standar regulasi wajib BAN-PDM per komponen
              </p>
            </div>
          </div>
        </div>

        {/* Global Action & View Switcher Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* View Mode Tabs */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold border border-slate-200">
            <button
              type="button"
              onClick={() => setActiveViewTab('gap_analysis')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeViewTab === 'gap_analysis'
                  ? 'bg-white text-indigo-700 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Komparasi Visual &amp; Gap</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveViewTab('gap_table')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeViewTab === 'gap_table'
                  ? 'bg-white text-indigo-700 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Table className="w-3.5 h-3.5" />
              <span>Matriks Tabel Gap</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveViewTab('component_cards')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeViewTab === 'component_cards'
                  ? 'bg-white text-indigo-700 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Rincian 4 Komponen</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-[#FF5722] hover:bg-[#E64A19] rounded-xl transition-all shadow-xs cursor-pointer active:scale-95"
            title="Buka rekap seluruh dokumen yang kurang"
          >
            <AlertCircle className="w-3.5 h-3.5 text-white" />
            <span>Lihat {overallSummary.kekurangan} Kekurangan</span>
          </button>

          <button
            type="button"
            onClick={handleCopyKekurangan}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all cursor-pointer active:scale-95"
            title="Salin daftar dokumen yang kurang ke clipboard"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700 font-bold">Tersalin!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-500" />
                <span>Salin Rekap</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 2. Global Metric Summary Bar: Komparasi Target Wajib vs Realisasi Terunggah */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-4 sm:p-5 rounded-2xl shadow-sm">
        {/* Metric 1: Total Dokumen Keseluruhan */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0 border border-white/10">
            <Layers className="w-5 h-5 text-blue-300" />
          </div>
          <div>
            <div className="text-xs text-slate-300">Total Bukti Fisik</div>
            <div className="text-xl sm:text-2xl font-black font-mono tracking-tight text-white">
              {overallSummary.total} <span className="text-xs font-normal text-slate-400">Berkas</span>
            </div>
            <div className="text-[10px] text-slate-400">Wajib &amp; Pendukung</div>
          </div>
        </div>

        {/* Metric 2: Target Regulasi Dokumen Wajib */}
        <div className="flex items-center gap-3 border-l border-white/10 pl-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center shrink-0 border border-indigo-400/30">
            <Target className="w-5 h-5 text-indigo-300" />
          </div>
          <div>
            <div className="text-xs text-indigo-200 font-medium">Target Dokumen Wajib</div>
            <div className="text-xl sm:text-2xl font-black font-mono tracking-tight text-indigo-300">
              {overallSummary.totalWajib} <span className="text-xs font-normal text-indigo-200/70">Wajib</span>
            </div>
            <div className="text-[10px] text-indigo-200/80">Standar BAN-PDM (100%)</div>
          </div>
        </div>

        {/* Metric 3: Dokumen Wajib Terunggah (Tersedia) */}
        <div className="flex items-center gap-3 border-l border-white/10 pl-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center shrink-0 border border-emerald-400/30">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <div className="text-xs text-emerald-300 font-medium">Wajib Terunggah ({overallSummary.wajibFulfillmentPercent}%)</div>
            <div className="text-xl sm:text-2xl font-black font-mono tracking-tight text-emerald-400">
              {overallSummary.wajibTersedia} <span className="text-xs font-normal text-emerald-200/70">Siap</span>
            </div>
            <div className="text-[10px] text-emerald-300/80">Dokumen Telah Valid</div>
          </div>
        </div>

        {/* Metric 4: GAP Defisit Dokumen Wajib */}
        <div className="flex items-center gap-3 border-l border-white/10 pl-3">
          <div className="w-10 h-10 rounded-xl bg-rose-500/20 flex items-center justify-center shrink-0 border border-rose-400/30">
            <TrendingDown className="w-5 h-5 text-rose-400" />
          </div>
          <div>
            <div className="text-xs text-rose-300 font-medium">GAP Defisit Wajib ({overallSummary.gapWajibPercentage}%)</div>
            <div className="text-xl sm:text-2xl font-black font-mono tracking-tight text-rose-400">
              -{overallSummary.gapWajib} <span className="text-xs font-normal text-rose-200/70">Berkas</span>
            </div>
            <div className="text-[10px] text-rose-300/80">
              {overallSummary.gapWajib === 0 ? 'Zero Gap (Tuntas)' : 'Perlu Segera Diunggah'}
            </div>
          </div>
        </div>
      </div>

      {/* VIEW TAB 1: KOMPARASI VISUAL & ANALISIS GAP (DEFAULT) */}
      {activeViewTab === 'gap_analysis' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Sub-Banner Gap Priority Callout */}
          {overallSummary.highestGapKomponen && overallSummary.highestGapKomponen.gapWajib > 0 && (
            <div className="p-4 bg-amber-50/80 border border-amber-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-start sm:items-center gap-2.5">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5 sm:mt-0" />
                <div>
                  <span className="font-bold text-amber-900">
                    Fokus Prioritas Gap Tertinggi: {overallSummary.highestGapKomponen.kode} ({overallSummary.highestGapKomponen.nama})
                  </span>
                  <p className="text-amber-700 text-[11px] mt-0.5">
                    Komponen ini memiliki defisit <strong>{overallSummary.highestGapKomponen.gapWajib} berkas dokumen wajib</strong> ({overallSummary.highestGapKomponen.gapWajibPercentage}% gap) yang harus dipenuhi sebelum visitasi asesor.
                  </p>
                </div>
              </div>
              {onSelectKomponen && (
                <button
                  type="button"
                  onClick={() => onSelectKomponen(overallSummary.highestGapKomponen!.id)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl shadow-xs transition-colors shrink-0"
                >
                  <span>Buka &amp; Lengkapi Gap</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )}

          {/* Grafik Batang Komparatif: Target Dokumen Wajib vs Terunggah vs Gap */}
          <div className="bg-slate-50/70 rounded-2xl border border-slate-200/80 p-5 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-indigo-600" />
                  <span>Grafik Komparasi: Target Regulasi vs Realisasi Terunggah &amp; Gap Defisit</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Perbandingan berkas dokumen wajib BAN-PDM per komponen dengan delta defisit yang belum terpenuhi
                </p>
              </div>

              <div className="flex items-center gap-3 text-xs font-semibold">
                <span className="flex items-center gap-1 text-indigo-700">
                  <span className="w-3 h-3 rounded-xs bg-indigo-500" />
                  <span>Target Wajib</span>
                </span>
                <span className="flex items-center gap-1 text-emerald-700">
                  <span className="w-3 h-3 rounded-xs bg-emerald-500" />
                  <span>Terunggah</span>
                </span>
                <span className="flex items-center gap-1 text-rose-700">
                  <span className="w-3 h-3 rounded-xs bg-rose-500" />
                  <span>GAP Defisit</span>
                </span>
              </div>
            </div>

            <div className="h-64 sm:h-72 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={rechartsGapData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fontSize: 12, fill: '#334155', fontWeight: 700 }}
                    axisLine={{ stroke: '#cbd5e1' }}
                    tickLine={false}
                  />
                  <YAxis 
                    tick={{ fontSize: 11, fill: '#64748b' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <RechartsTooltip content={<CustomGapTooltip />} />
                  <Bar dataKey="targetWajib" name="Target Dokumen Wajib" fill="#6366F1" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="terunggah" name="Dokumen Terunggah" fill="#10B981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="gapDefisit" name="GAP Defisit (Belum Diunggah)" fill="#F43F5E" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Grid 4 Kartu Komponen Dual-Meter Visual (Target Wajib vs Realisasi & GAP) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {komponenSummaries.map((summary) => {
              const theme = getComponentBadgeTheme(summary.kode);
              const isTuntas = summary.gapWajib === 0;

              return (
                <div
                  key={summary.id}
                  className="rounded-2xl border border-slate-200 bg-white p-5 flex flex-col justify-between space-y-4 shadow-xs hover:border-indigo-300 transition-all"
                >
                  {/* Header Kartu Komponen */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${theme.pill}`}>
                          {summary.kode} · Bobot {summary.bobot}%
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                            summary.gapStatus === 'tuntas'
                              ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                              : summary.gapStatus === 'rendah'
                              ? 'bg-amber-100 text-amber-800 border-amber-300'
                              : 'bg-rose-100 text-rose-800 border-rose-300'
                          }`}
                        >
                          {summary.gapStatus === 'tuntas'
                            ? '✅ Zero Gap (Tuntas)'
                            : summary.gapStatus === 'rendah'
                            ? `⚠️ Gap Ringan (-${summary.gapWajib})`
                            : `🚨 Gap Kritis (-${summary.gapWajib} Wajib)`}
                        </span>
                      </div>

                      <div className="text-right">
                        <span className="text-xl sm:text-2xl font-black font-mono text-slate-900 tabular-nums">
                          {summary.wajibFulfillmentPercent}%
                        </span>
                        <span className="text-[10px] block font-semibold text-slate-400 uppercase">
                          Terpenuhi
                        </span>
                      </div>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 line-clamp-1">
                      {summary.nama}
                    </h3>
                  </div>

                  {/* Dual-Meter Visual Comparison Bar: Target Wajib vs Realisasi & GAP */}
                  <div className="space-y-2 bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs">
                    {/* Track 1: Target Wajib Regulasi */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-semibold text-indigo-900 flex items-center gap-1">
                          <Target className="w-3 h-3 text-indigo-600" />
                          <span>Target Wajib BAN-PDM:</span>
                        </span>
                        <span className="font-mono font-bold text-indigo-700">
                          {summary.totalWajib} Berkas (100%)
                        </span>
                      </div>
                      <div className="w-full h-2 bg-indigo-100 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-500 rounded-full w-full" />
                      </div>
                    </div>

                    {/* Track 2: Realisasi Terunggah & Gap Defisit */}
                    <div className="space-y-1 pt-1 border-t border-slate-200/60">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-semibold text-slate-700 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>Realisasi Terunggah vs Gap:</span>
                        </span>
                        <span className="font-mono font-bold text-slate-700">
                          {summary.wajibTersedia} Terunggah · {summary.gapWajib > 0 ? (
                            <span className="text-rose-600 font-bold">Defisit -{summary.gapWajib}</span>
                          ) : (
                            <span className="text-emerald-600 font-bold">Lengkap</span>
                          )}
                        </span>
                      </div>

                      {/* Segmented Realization Bar */}
                      <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden flex gap-0.5 p-0.5">
                        {/* Segment Terunggah */}
                        <div
                          className="h-full bg-emerald-500 rounded-l-full transition-all duration-500"
                          style={{
                            width: `${summary.totalWajib > 0 ? (summary.wajibTersedia / summary.totalWajib) * 100 : 0}%`,
                          }}
                          title={`Terunggah: ${summary.wajibTersedia} berkas`}
                        />
                        {/* Segment Dalam Proses */}
                        {summary.wajibDalamProses > 0 && (
                          <div
                            className="h-full bg-amber-400 transition-all duration-500"
                            style={{
                              width: `${summary.totalWajib > 0 ? (summary.wajibDalamProses / summary.totalWajib) * 100 : 0}%`,
                            }}
                            title={`Dalam Proses: ${summary.wajibDalamProses} berkas`}
                          />
                        )}
                        {/* Segment GAP Defisit Belum Ada */}
                        {summary.wajibBelumAda > 0 && (
                          <div
                            className="h-full bg-rose-500 rounded-r-full transition-all duration-500 animate-pulse"
                            style={{
                              width: `${summary.totalWajib > 0 ? (summary.wajibBelumAda / summary.totalWajib) * 100 : 0}%`,
                            }}
                            title={`GAP Defisit Belum Ada: ${summary.wajibBelumAda} berkas`}
                          />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Statistik Ticker Komparasi 3-Kolom */}
                  <div className="grid grid-cols-3 gap-2 text-center text-xs bg-white p-2.5 rounded-xl border border-slate-200">
                    <div className="p-1">
                      <span className="text-[10px] text-slate-400 block font-medium">Target Wajib</span>
                      <span className="font-mono font-black text-indigo-700 text-sm">{summary.totalWajib}</span>
                    </div>
                    <div className="p-1 border-x border-slate-100">
                      <span className="text-[10px] text-slate-400 block font-medium">Terunggah</span>
                      <span className="font-mono font-black text-emerald-600 text-sm">{summary.wajibTersedia}</span>
                    </div>
                    <div className="p-1">
                      <span className="text-[10px] text-slate-400 block font-medium">GAP Defisit</span>
                      <span className={`font-mono font-black text-sm ${summary.gapWajib > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                        {summary.gapWajib > 0 ? `-${summary.gapWajib}` : '0 (Tuntas)'}
                      </span>
                    </div>
                  </div>

                  {/* Preview Berkas Wajib yang Belum Terpenuhi */}
                  {summary.daftarWajibKurang.length > 0 ? (
                    <div className="space-y-1.5 text-xs">
                      <div className="flex items-center justify-between text-[11px] font-semibold text-slate-700">
                        <span className="flex items-center gap-1 text-rose-700">
                          <AlertCircle className="w-3 h-3 text-rose-600" />
                          <span>Dokumen Wajib yang Masih Kurang ({summary.daftarWajibKurang.length}):</span>
                        </span>
                      </div>
                      <div className="space-y-1 max-h-24 overflow-y-auto">
                        {summary.daftarWajibKurang.slice(0, 3).map((item) => (
                          <div
                            key={item.buktiId}
                            className="p-1.5 rounded-lg bg-rose-50/50 border border-rose-200/80 text-[11px] flex items-center justify-between gap-2"
                          >
                            <div className="truncate">
                              <span className="font-mono font-bold text-slate-800 mr-1.5">{item.kodeBukti}</span>
                              <span className="text-slate-700 truncate">{item.namaBukti}</span>
                            </div>
                            <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold shrink-0 ${
                              item.status === 'Dalam Proses' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                            }`}>
                              {item.status}
                            </span>
                          </div>
                        ))}
                        {summary.daftarWajibKurang.length > 3 && (
                          <p className="text-[10px] text-slate-400 text-center">
                            +{summary.daftarWajibKurang.length - 3} dokumen wajib lainnya
                          </p>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span className="font-medium">Seluruh dokumen wajib di komponen ini telah 100% terunggah.</span>
                    </div>
                  )}

                  {/* Tombol Aksi Langsung ke Komponen */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs text-slate-500">
                      Total Semua Berkas: <strong className="text-slate-800">{summary.totalBukti}</strong>
                    </span>

                    {onSelectKomponen && (
                      <button
                        type="button"
                        onClick={() => onSelectKomponen(summary.id)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer ${
                          isTuntas
                            ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                            : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                        }`}
                      >
                        <span>{isTuntas ? `Tinjau ${summary.kode}` : `Lengkapi Gap ${summary.kode}`}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW TAB 2: TABEL MATRIKS GAP ANALISIS KOMPREHENSIF */}
      {activeViewTab === 'gap_table' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-900 text-white font-semibold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-4">Komponen BAN-PDM</th>
                  <th className="py-3 px-3 text-center">Bobot</th>
                  <th className="py-3 px-3 text-center bg-indigo-950 text-indigo-300">Target Wajib</th>
                  <th className="py-3 px-3 text-center text-emerald-300">Terunggah (Siap)</th>
                  <th className="py-3 px-3 text-center text-amber-300">Dalam Proses</th>
                  <th className="py-3 px-3 text-center text-rose-300">GAP Defisit</th>
                  <th className="py-3 px-3 text-center">Pemenuhan</th>
                  <th className="py-3 px-3 text-center">Status Gap</th>
                  <th className="py-3 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {komponenSummaries.map((summary) => (
                  <tr key={summary.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-semibold text-slate-900">
                      <div className="font-bold text-indigo-700">{summary.kode}</div>
                      <div className="text-[11px] text-slate-500 max-w-xs truncate">{summary.nama}</div>
                    </td>
                    <td className="py-3 px-3 text-center font-mono font-bold text-slate-700">{summary.bobot}%</td>
                    <td className="py-3 px-3 text-center font-mono font-bold bg-indigo-50/50 text-indigo-800">
                      {summary.totalWajib} Berkas
                    </td>
                    <td className="py-3 px-3 text-center font-mono font-bold text-emerald-700">
                      {summary.wajibTersedia}
                    </td>
                    <td className="py-3 px-3 text-center font-mono text-amber-700">
                      {summary.wajibDalamProses}
                    </td>
                    <td className="py-3 px-3 text-center font-mono font-black text-rose-600">
                      {summary.gapWajib === 0 ? '✓ 0' : `-${summary.gapWajib}`}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <div className="flex items-center justify-center gap-1 font-mono font-bold">
                        <span>{summary.wajibFulfillmentPercent}%</span>
                      </div>
                      <div className="w-16 h-1.5 bg-slate-100 rounded-full mx-auto overflow-hidden mt-1">
                        <div
                          className="h-full bg-emerald-500 rounded-full"
                          style={{ width: `${summary.wajibFulfillmentPercent}%` }}
                        />
                      </div>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                          summary.gapStatus === 'tuntas'
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                            : summary.gapStatus === 'rendah'
                            ? 'bg-amber-100 text-amber-800 border-amber-300'
                            : 'bg-rose-100 text-rose-800 border-rose-300'
                        }`}
                      >
                        {summary.gapStatus === 'tuntas' ? 'Tuntas' : summary.gapStatus === 'rendah' ? 'Gap Ringan' : 'Gap Kritis'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      {onSelectKomponen && (
                        <button
                          type="button"
                          onClick={() => onSelectKomponen(summary.id)}
                          className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-800 hover:underline cursor-pointer"
                        >
                          <span>Buka</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-slate-100 font-bold text-slate-800 border-t-2 border-slate-300">
                <tr>
                  <td className="py-3 px-4 uppercase text-[11px]">Total Keseluruhan</td>
                  <td className="py-3 px-3 text-center font-mono">100%</td>
                  <td className="py-3 px-3 text-center font-mono text-indigo-900 bg-indigo-100/60">
                    {overallSummary.totalWajib} Berkas
                  </td>
                  <td className="py-3 px-3 text-center font-mono text-emerald-800">
                    {overallSummary.wajibTersedia}
                  </td>
                  <td className="py-3 px-3 text-center font-mono text-amber-800">
                    {overallSummary.wajibDalamProses}
                  </td>
                  <td className="py-3 px-3 text-center font-mono text-rose-700">
                    -{overallSummary.gapWajib} Berkas
                  </td>
                  <td className="py-3 px-3 text-center font-mono">
                    {overallSummary.wajibFulfillmentPercent}%
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-200 text-slate-800">
                      Defisit {overallSummary.gapWajibPercentage}%
                    </span>
                  </td>
                  <td className="py-3 px-4" />
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}

      {/* VIEW TAB 3: GRID 4 KARTU KOMPONEN RINCIAN LENGKAP */}
      {activeViewTab === 'component_cards' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fadeIn">
        {komponenSummaries.map((summary) => {
          const theme = getComponentBadgeTheme(summary.kode);
          const level = getFulfillmentLevelBadge(summary.persentasePemenuhan);
          const isExpanded = expandedKomponenId === summary.id;

          return (
            <div
              key={summary.id}
              className={`rounded-2xl border transition-all duration-200 bg-white flex flex-col justify-between overflow-hidden shadow-2xs hover:shadow-sm ${
                isExpanded ? 'border-[#0084FF] ring-2 ring-blue-100' : 'border-slate-200'
              }`}
            >
              {/* Card Header & Percentage Visual */}
              <div className="p-5 space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${theme.pill}`}>
                        {summary.kode} · Bobot {summary.bobot}%
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${level.badgeClass}`}>
                        {level.label}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 leading-snug pt-0.5 line-clamp-1">
                      {summary.nama}
                    </h3>
                  </div>

                  {/* Circular/Pill Big Percentage Display */}
                  <div className="flex flex-col items-end shrink-0">
                    <div className={`text-2xl sm:text-3xl font-black font-mono tabular-nums tracking-tight ${level.textColor}`}>
                      {summary.persentasePemenuhan}%
                    </div>
                    <span className="text-[10px] uppercase font-bold text-slate-400">
                      Pemenuhan
                    </span>
                  </div>
                </div>

                {/* Progress Bar Visual (Linear Multi-Segment) */}
                <div className="space-y-1.5">
                  <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden flex p-0.5 gap-0.5">
                    {/* Segment 1: Tersedia */}
                    <div
                      className={`h-full rounded-l-full transition-all duration-500 ${level.progressClass}`}
                      style={{
                        width: `${summary.totalBukti > 0 ? (summary.tersediaBukti / summary.totalBukti) * 100 : 0}%`,
                      }}
                      title={`Tersedia: ${summary.tersediaBukti} berkas`}
                    />
                    {/* Segment 2: Dalam Proses */}
                    <div
                      className="h-full bg-amber-400 transition-all duration-500"
                      style={{
                        width: `${summary.totalBukti > 0 ? (summary.dalamProsesBukti / summary.totalBukti) * 100 : 0}%`,
                      }}
                      title={`Dalam Proses: ${summary.dalamProsesBukti} berkas`}
                    />
                    {/* Segment 3: Belum Ada (Remaining gray/rose) */}
                  </div>

                  <div className="flex items-center justify-between text-[11px] font-medium text-slate-500">
                    <div className="flex items-center gap-2 font-mono">
                      <span className="text-emerald-700 font-bold">✓ {summary.tersediaBukti} Tersedia</span>
                      <span className="text-slate-300">·</span>
                      <span className="text-amber-700 font-semibold">⏳ {summary.dalamProsesBukti} Proses</span>
                      <span className="text-slate-300">·</span>
                      <span className="text-rose-700 font-semibold">✗ {summary.belumAdaBukti} Kosong</span>
                    </div>
                    <span className="text-slate-700 font-bold font-mono">
                      {summary.tersediaBukti}/{summary.totalBukti}
                    </span>
                  </div>
                </div>

                {/* Status Kekurangan Dokumen Pill */}
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs">
                  <div className="flex items-center gap-2">
                    {summary.totalKekurangan > 0 ? (
                      <AlertCircle className="w-4 h-4 text-[#FF5722] shrink-0" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    )}
                    <span className="text-slate-700 font-medium">
                      {summary.totalKekurangan > 0 ? (
                        <>
                          Kurang <strong>{summary.totalKekurangan} Berkas</strong>
                          {summary.totalWajibKurang > 0 && (
                            <span className="ml-1 text-rose-600 font-bold">
                              ({summary.totalWajibKurang} Wajib)
                            </span>
                          )}
                        </>
                      ) : (
                        <span className="text-emerald-700 font-bold">Seluruh Dokumen Lengkap!</span>
                      )}
                    </span>
                  </div>

                  {summary.totalKekurangan > 0 && (
                    <button
                      type="button"
                      onClick={() => setExpandedKomponenId(isExpanded ? null : summary.id)}
                      className="text-xs font-bold text-[#0084FF] hover:text-[#0066CC] flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <span>{isExpanded ? 'Tutup Rincian' : 'Lihat Dokumen Kurang'}</span>
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>
                  )}
                </div>

                {/* Inline Expandable List: Kekurangan Dokumen di Komponen ini */}
                {isExpanded && summary.totalKekurangan > 0 && (
                  <div className="space-y-2 pt-2 border-t border-slate-100 animate-fadeIn">
                    <div className="flex items-center justify-between text-[11px] font-bold text-slate-700">
                      <span>Daftar {summary.daftarKekurangan.length} Dokumen yang Perlu Dilengkapi:</span>
                      <span className="text-slate-400 font-normal">Klik untuk melengkapi</span>
                    </div>

                    <div className="max-h-56 overflow-y-auto space-y-1.5 pr-1">
                      {summary.daftarKekurangan.map((item) => (
                        <div
                          key={item.buktiId}
                          className="p-2.5 rounded-xl bg-slate-50 hover:bg-blue-50/50 border border-slate-200 transition-colors flex items-start justify-between gap-2"
                        >
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-1.5">
                              <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 bg-slate-200 text-slate-800 rounded">
                                {item.kodeBukti}
                              </span>
                              <span className="text-[10px] font-mono text-[#0084FF] font-semibold">
                                Indikator {item.indikatorKode}
                              </span>
                              {item.wajib && (
                                <span className="text-[9px] font-bold px-1.5 py-0.2 bg-red-100 text-red-700 rounded border border-red-200">
                                  Wajib
                                </span>
                              )}
                              {item.isDeadlineUrgent && (
                                <span className="text-[9px] font-bold px-1.5 py-0.2 bg-amber-50 text-amber-800 rounded border border-amber-200 font-mono">
                                  ⏰ {item.deadlineLabel}
                                </span>
                              )}
                              <span className="text-[9px] text-slate-400 font-medium">
                                · {item.jenis}
                              </span>
                            </div>
                            <p className="text-xs font-semibold text-slate-900 leading-snug">
                              {item.namaBukti}
                            </p>
                            <p className="text-[10px] text-slate-500 line-clamp-1">
                              {item.indikatorNama}
                            </p>
                          </div>

                          <div className="flex flex-col items-end gap-1 shrink-0">
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                                item.status === 'Dalam Proses'
                                  ? 'bg-amber-100 text-amber-800 border-amber-300'
                                  : 'bg-rose-100 text-rose-800 border-rose-300'
                              }`}
                            >
                              {item.status}
                            </span>

                            {onSelectKomponen && (
                              <button
                                type="button"
                                onClick={() => onSelectKomponen(summary.id)}
                                className="text-[10px] font-bold text-[#FF5722] hover:underline flex items-center gap-0.5 pt-0.5"
                              >
                                <span>Lengkapi</span>
                                <ArrowRight className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Card Footer: Action Button to Open Instrumen */}
              <div className="bg-slate-50/80 px-5 py-3 border-t border-slate-100 flex items-center justify-between">
                <div className="text-xs text-slate-500">
                  <span>Bobot Komponen: </span>
                  <strong className="text-slate-800">{summary.bobot}%</strong>
                </div>

                {onSelectKomponen && (
                  <button
                    type="button"
                    onClick={() => onSelectKomponen(summary.id)}
                    className="flex items-center gap-1.5 text-xs font-bold text-[#0084FF] hover:text-[#0066CC] transition-colors cursor-pointer"
                  >
                    <span>Buka Instrumen {summary.kode}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
      )}

      {/* 4. Modal Rekap Seluruh Dokumen yang Kurang (Full Rekap View) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/60 backdrop-blur-xs overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-slate-900 to-indigo-950 text-white shrink-0">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-[#FF5722]" />
                  <h3 className="text-base sm:text-lg font-bold text-white">
                    Rekap Kekurangan Bukti Fisik Akreditasi BAN-PDM
                  </h3>
                </div>
                <p className="text-xs text-slate-300">
                  Daftar berkas yang masih berstatus 'Belum Ada' atau 'Dalam Proses' di SMK IT Ibnul Qayyim Makassar
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
                title="Tutup"
              >
                ✕
              </button>
            </div>

            {/* Modal Filter Toolbar */}
            <div className="p-4 bg-slate-50 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 shrink-0">
              {/* Search Bar */}
              <div className="relative flex-1 min-w-[200px] max-w-md">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Cari nama bukti, kode, atau indikator..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0084FF] text-slate-800 placeholder-slate-400"
                />
              </div>

              {/* Component Tabs Filter */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                <button
                  type="button"
                  onClick={() => setSelectedKomponenFilter('all')}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                    selectedKomponenFilter === 'all'
                      ? 'bg-[#0084FF] text-white'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  Semua ({allKekurangan.length})
                </button>
                {komponenSummaries.map((k) => (
                  <button
                    key={k.id}
                    type="button"
                    onClick={() => setSelectedKomponenFilter(k.id)}
                    className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                      selectedKomponenFilter === k.id
                        ? 'bg-[#0084FF] text-white'
                        : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {k.kode} ({k.totalKekurangan})
                  </button>
                ))}
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-1.5">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0084FF]"
                >
                  <option value="all">Semua Status</option>
                  <option value="Belum Ada">Hanya 'Belum Ada'</option>
                  <option value="Dalam Proses">Hanya 'Dalam Proses'</option>
                  <option value="wajib">Hanya Dokumen Wajib</option>
                </select>

                <button
                  type="button"
                  onClick={handleCopyKekurangan}
                  className="px-3 py-1 text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
                  <span>{copied ? 'Tersalin' : 'Salin Rekap'}</span>
                </button>
              </div>
            </div>

            {/* Modal Body: List of Kekurangan Dokumen */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-2.5">
              {filteredKekurangan.length === 0 ? (
                <div className="py-12 flex flex-col items-center justify-center text-center space-y-2">
                  <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                  <h4 className="text-sm font-bold text-slate-800">
                    Tidak Ditemukan Dokumen Kurang
                  </h4>
                  <p className="text-xs text-slate-500 max-w-sm">
                    {searchQuery
                      ? 'Tidak ada bukti fisik yang cocok dengan filter pencarian.'
                      : 'Luar biasa! Seluruh dokumen bukti fisik pada filter ini telah berstatus Tersedia.'}
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-500 px-1">
                    <span>Menampilkan <strong>{filteredKekurangan.length}</strong> dokumen yang perlu dilengkapi:</span>
                  </div>

                  {filteredKekurangan.map((item, idx) => (
                    <div
                      key={item.buktiId}
                      className="p-3 rounded-xl bg-white border border-slate-200/90 hover:border-blue-300 hover:shadow-xs transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="flex items-start gap-3">
                        <span className="w-6 h-6 rounded-lg bg-slate-100 text-slate-600 font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                          {idx + 1}
                        </span>

                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-[#0084FF] border border-blue-200">
                              {item.komponenKode}
                            </span>
                            <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 bg-slate-100 text-slate-800 rounded">
                              {item.kodeBukti}
                            </span>
                            <span className="text-[10px] font-mono text-slate-500">
                              Indikator {item.indikatorKode}
                            </span>
                            {item.wajib && (
                              <span className="text-[9px] font-bold px-1.5 py-0.2 bg-red-100 text-red-700 rounded border border-red-200">
                                Wajib
                              </span>
                            )}
                            {item.isDeadlineUrgent && (
                              <span className="text-[10px] font-bold px-2 py-0.5 bg-amber-50 text-amber-800 rounded border border-amber-200 font-mono">
                                ⏰ {item.deadlineLabel} ({item.formattedDeadlineDate})
                              </span>
                            )}
                            <span className="text-[10px] text-slate-400">
                              · {item.jenis}
                            </span>
                          </div>

                          <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                            {item.namaBukti}
                          </h4>

                          <p className="text-[11px] text-slate-500 line-clamp-1">
                            {item.indikatorNama}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 sm:self-center shrink-0 pl-9 sm:pl-0">
                        <span
                          className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                            item.status === 'Dalam Proses'
                              ? 'bg-amber-100 text-amber-800 border-amber-300'
                              : 'bg-rose-100 text-rose-800 border-rose-300'
                          }`}
                        >
                          {item.status}
                        </span>

                        {onSelectKomponen && (
                          <button
                            type="button"
                            onClick={() => {
                              setIsModalOpen(false);
                              onSelectKomponen(item.komponenId);
                            }}
                            className="px-3 py-1.5 text-xs font-bold bg-[#FF5722] hover:bg-[#E64A19] text-white rounded-xl transition-colors flex items-center gap-1 shadow-2xs cursor-pointer"
                          >
                            <span>Lengkapi</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between shrink-0">
              <span className="text-xs text-slate-500">
                SMK IT Ibnul Qayyim Makassar · Akreditasi BAN-PDM 2024
              </span>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-xs font-bold bg-slate-800 hover:bg-slate-900 text-white rounded-xl transition-colors"
              >
                Tutup Jendela
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

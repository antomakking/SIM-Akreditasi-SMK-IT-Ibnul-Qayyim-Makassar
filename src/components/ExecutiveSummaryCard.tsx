import React, { useState } from 'react';
import { Komponen, EvaluasiAsesi } from '../types/akreditasi';
import { 
  Award, 
  TrendingUp, 
  Calculator, 
  CheckCircle2, 
  AlertCircle, 
  ChevronDown, 
  ChevronUp, 
  Layers, 
  ShieldCheck, 
  Info, 
  Sparkles,
  Target,
  ArrowUpRight,
  FileCheck2,
  AlertTriangle
} from 'lucide-react';
import { RUBRIK_THEMES, getRubrikThemeByLevel } from '../utils/rubrikTheme';
import { getAllDeadlineAlerts, getDeadlineSummaryMetrics } from '../services/deadlineService';

interface ExecutiveSummaryCardProps {
  komponenList: Komponen[];
  evaluasiMap: Record<string, EvaluasiAsesi>;
  onSelectKomponen?: (kompId: string) => void;
}

export interface ComponentWeightDetail {
  id: string;
  kode: string;
  nama: string;
  bobot: number;
  totalIndikator: number;
  filledIndikator: number;
  avgScore: number;
  kontribusiSkor4: number;
  kontribusiSkor100: number;
  progressPercentage: number;
  statusKinerja: 'Unggul' | 'Baik' | 'Cukup' | 'Kurang' | 'Belum Diisi';
}

export const ExecutiveSummaryCard: React.FC<ExecutiveSummaryCardProps> = ({
  komponenList,
  evaluasiMap,
  onSelectKomponen,
}) => {
  const [showFormulaDetails, setShowFormulaDetails] = useState(false);
  const [projectionTarget, setProjectionTarget] = useState<4 | 3>(4);

  // Ambil data peringatan deadline
  const deadlineMetrics = React.useMemo(() => {
    const alerts = getAllDeadlineAlerts(komponenList, evaluasiMap);
    return getDeadlineSummaryMetrics(alerts);
  }, [komponenList, evaluasiMap]);

  // Kalkulasi detail per-komponen dengan pembobotan BAN-PDM resmi
  let totalBobot = 0;
  let totalIndikatorAll = 0;
  let totalFilledAll = 0;
  let currentWeightedScore4 = 0;

  const componentDetails: ComponentWeightDetail[] = komponenList.map((k) => {
    let indCount = 0;
    let filledCount = 0;
    let scoreSum = 0;

    k.butir?.forEach((b) => {
      b.indikator?.forEach((ind) => {
        indCount++;
        totalIndikatorAll++;
        const evalItem = evaluasiMap[ind.id];
        if (evalItem) {
          filledCount++;
          totalFilledAll++;
          scoreSum += evalItem.skor;
        }
      });
    });

    totalBobot += k.bobot;
    const avgScore = filledCount > 0 ? (scoreSum / filledCount) : 0;
    const kontribusi4 = avgScore * (k.bobot / 100);
    const kontribusi100 = (avgScore / 4) * k.bobot;
    const progressPercentage = indCount > 0 ? Math.round((filledCount / indCount) * 100) : 0;

    currentWeightedScore4 += kontribusi4;

    let statusKinerja: ComponentWeightDetail['statusKinerja'] = 'Belum Diisi';
    if (avgScore >= 3.6) statusKinerja = 'Unggul';
    else if (avgScore >= 3.0) statusKinerja = 'Baik';
    else if (avgScore >= 2.0) statusKinerja = 'Cukup';
    else if (avgScore > 0) statusKinerja = 'Kurang';

    return {
      id: k.id,
      kode: k.kode,
      nama: k.nama,
      bobot: k.bobot,
      totalIndikator: indCount,
      filledIndikator: filledCount,
      avgScore,
      kontribusiSkor4: kontribusi4,
      kontribusiSkor100: kontribusi100,
      progressPercentage,
      statusKinerja,
    };
  });

  // Nilai saat ini (skala 4.00 dan skala 100)
  const finalScore4 = Number(currentWeightedScore4.toFixed(2));
  const finalScore100 = Number(((finalScore4 / 4) * 100).toFixed(1));

  // Simulasi Proyeksi Jika Seluruh Indikator Sisa Terisi dengan Target (Level 4 atau Level 3)
  let projectedWeightedScore4 = 0;
  komponenList.forEach((k) => {
    let indCount = 0;
    let scoreSum = 0;

    k.butir?.forEach((b) => {
      b.indikator?.forEach((ind) => {
        indCount++;
        const evalItem = evaluasiMap[ind.id];
        if (evalItem) {
          scoreSum += evalItem.skor;
        } else {
          scoreSum += projectionTarget; // Asumsi sisa indikator diisi sesuai target
        }
      });
    });

    const projectedAvg = indCount > 0 ? (scoreSum / indCount) : projectionTarget;
    projectedWeightedScore4 += projectedAvg * (k.bobot / 100);
  });

  const projectedScore4 = Number(projectedWeightedScore4.toFixed(2));
  const projectedScore100 = Number(((projectedScore4 / 4) * 100).toFixed(1));

  // Penentuan Predikat Akreditasi BAN-PDM
  const getPredikat = (score100: number) => {
    if (score100 >= 91) {
      return {
        huruf: 'A',
        kategori: 'Unggul',
        badgeBg: 'bg-emerald-500',
        badgeLight: 'bg-emerald-50 text-emerald-800 border-emerald-200',
        textColor: 'text-emerald-700',
        ringColor: 'ring-emerald-500',
        desc: 'Memenuhi seluruh kriteria mutu unggul vokasi BAN-PDM SMK/MAK',
      };
    } else if (score100 >= 81) {
      return {
        huruf: 'B',
        kategori: 'Baik',
        badgeBg: 'bg-[#0084FF]',
        badgeLight: 'bg-blue-50 text-blue-800 border-blue-200',
        textColor: 'text-blue-700',
        ringColor: 'ring-blue-500',
        desc: 'Memenuhi standar mutu akreditasi BAN-PDM dengan predikat Baik',
      };
    } else if (score100 >= 71) {
      return {
        huruf: 'C',
        kategori: 'Cukup',
        badgeBg: 'bg-amber-500',
        badgeLight: 'bg-amber-50 text-amber-800 border-amber-200',
        textColor: 'text-amber-700',
        ringColor: 'ring-amber-500',
        desc: 'Memenuhi standar minimal kelayakan operasional',
      };
    } else {
      return {
        huruf: 'TT',
        kategori: 'Perlu Peningkatan',
        badgeBg: 'bg-rose-500',
        badgeLight: 'bg-rose-50 text-rose-800 border-rose-200',
        textColor: 'text-rose-700',
        ringColor: 'ring-rose-500',
        desc: 'Skor di bawah ambang batas akreditasi nasional',
      };
    }
  };

  const predikatSaatIni = getPredikat(finalScore100);
  const predikatProyeksi = getPredikat(projectedScore100);
  const overallProgress = totalIndikatorAll > 0 ? Math.round((totalFilledAll / totalIndikatorAll) * 100) : 0;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-[0_4px_20px_rgba(0,0,0,0.04)] overflow-hidden transition-all">
      {/* Top Banner Executive Summary */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 p-6 text-white relative overflow-hidden">
        {/* Ambient Decorative Shapes */}
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute left-1/3 -top-10 w-40 h-40 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="inline-flex items-center gap-1 font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-2.5 py-0.5 rounded-full">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                Ringkasan Eksekutif
              </span>
              <span className="text-slate-400">·</span>
              <span className="text-slate-300 font-medium">Perhitungan Bobot BAN-PDM 2024</span>
              <span className="text-slate-400">·</span>
              <span className="text-slate-400 font-mono">Total Bobot: 100%</span>
              {deadlineMetrics.urgentTotal > 0 && (
                <>
                  <span className="text-slate-400">·</span>
                  <a
                    href="#dashboard-deadline-alerts"
                    className="inline-flex items-center gap-1 font-bold bg-amber-500/20 text-amber-200 hover:bg-amber-500/30 border border-amber-400/30 px-2.5 py-0.5 rounded-full transition-colors"
                  >
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                    <span>{deadlineMetrics.urgentTotal} Mendekati Jatuh Tempo</span>
                  </a>
                </>
              )}
            </div>

            <h2 className="text-lg sm:text-2xl font-black tracking-tight text-white">
              Estimasi Nilai Akhir &amp; Proyeksi Akreditasi
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Kalkulasi otomatis nilai kumulatif terbobot berdasarkan seluruh butir dan indikator yang telah dievaluasi oleh Tim Asesi SMK IT Ibnul Qayyim Makassar.
            </p>
          </div>

          {/* Hero Score Badge Box */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15 shrink-0 shadow-lg">
            <div className="text-center sm:text-left pr-3 sm:border-r border-white/15">
              <div className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider">
                Estimasi Skor Akhir
              </div>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span className="text-3xl sm:text-4xl font-black text-white font-mono tabular-nums tracking-tight">
                  {finalScore4.toFixed(2)}
                </span>
                <span className="text-xs font-semibold text-slate-400">/ 4.00</span>
              </div>
              <div className="text-xs font-semibold text-emerald-300 flex items-center gap-1 mt-0.5 font-mono">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Konversi: {finalScore100} / 100</span>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center pl-1 sm:pl-2">
              <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl ${predikatSaatIni.badgeBg} text-white flex flex-col items-center justify-center shadow-lg font-black tracking-tight`}>
                <span className="text-xs uppercase font-semibold opacity-90 leading-none">Predikat</span>
                <span className="text-2xl sm:text-3xl leading-none mt-0.5">{predikatSaatIni.huruf}</span>
              </div>
              <span className="text-[10px] font-bold text-slate-200 mt-1 uppercase tracking-wider">
                {predikatSaatIni.kategori}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Rincian Komposisi Bobot & Kontribusi 4 Komponen */}
      <div className="p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#0084FF]" />
              <span>Rincian Bobot &amp; Kontribusi Komponen Akreditasi</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Distribusi 4 komponen instrumen akreditasi vokasi dengan kontribusi skor riil
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowFormulaDetails(!showFormulaDetails)}
            className="text-xs text-[#0084FF] hover:underline flex items-center gap-1 font-semibold self-start sm:self-auto"
          >
            <Calculator className="w-3.5 h-3.5" />
            <span>{showFormulaDetails ? 'Sembunyikan Rumus' : 'Lihat Rumus Perhitungan'}</span>
            {showFormulaDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Kotak Penjelasan Formula BAN-PDM (Collapsible) */}
        {showFormulaDetails && (
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-2 text-slate-700 animate-fade-in">
            <div className="flex items-center gap-1.5 font-bold text-slate-900 text-xs">
              <Info className="w-4 h-4 text-[#0084FF]" />
              <span>Metodologi Perhitungan Skor Terbobot BAN-PDM:</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px] pt-1 leading-relaxed font-mono bg-white p-3 rounded-lg border border-slate-200/80">
              <div>
                <span className="font-bold text-slate-900 block mb-1">1. Rata-Rata Skor Komponen (S_k):</span>
                <code className="text-[#0084FF]">S_k = (Total Skor Indikator Terisi) / (Jumlah Indikator Terisi)</code>
              </div>
              <div>
                <span className="font-bold text-slate-900 block mb-1">2. Kontribusi Nilai Akhir (NA):</span>
                <code className="text-emerald-700">NA = Σ (S_k × (Bobot_k / 100)) [Skala 4.00]</code>
              </div>
            </div>
            <p className="text-[11px] text-slate-500 italic">
              *Catatan: Skor konversi skala 100 dihitung dengan (NA / 4.00) × 100. Standar BAN-PDM: Predikat A ≥ 91 (Unggul), Predikat B 81–90 (Baik), Predikat C 71–80 (Cukup).
            </p>
          </div>
        )}

        {/* Tabel / Grid Kartu Kontribusi 4 Komponen */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {componentDetails.map((comp) => {
            const levelTheme = getRubrikThemeByLevel(Math.round(comp.avgScore || 4));

            return (
              <div
                key={comp.id}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:shadow-md transition-all flex flex-col justify-between space-y-3 relative group"
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-1.5">
                    <span className="px-2 py-0.5 bg-blue-100/70 text-[#0084FF] font-bold text-xs rounded font-mono">
                      {comp.kode}
                    </span>
                    <span className="text-[11px] font-bold text-slate-600 font-mono">
                      Bobot: <strong>{comp.bobot}%</strong>
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-slate-900 leading-snug line-clamp-2" title={comp.nama}>
                    {comp.nama}
                  </h4>

                  {/* Progres Indikator */}
                  <div className="mt-2.5 space-y-1">
                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span>Kelengkapan:</span>
                      <span className="font-mono font-semibold text-slate-700">
                        {comp.filledIndikator}/{comp.totalIndikator} ({comp.progressPercentage}%)
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#0084FF] rounded-full transition-all duration-500"
                        style={{ width: `${comp.progressPercentage}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Score & Kontribusi Box */}
                <div className="pt-2 border-t border-slate-200/80 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 text-[11px]">Rata-rata Skor:</span>
                    <span className={`font-mono font-bold ${comp.avgScore > 0 ? 'text-slate-900' : 'text-slate-400'}`}>
                      {comp.avgScore > 0 ? `${comp.avgScore.toFixed(2)} / 4.00` : 'Belum diisi'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between bg-white px-2 py-1 rounded border border-slate-200/80">
                    <span className="text-slate-600 text-[10px] font-semibold">Kontribusi NA:</span>
                    <span className="font-mono font-bold text-emerald-700 text-xs">
                      +{comp.kontribusiSkor4.toFixed(2)} <span className="text-[10px] font-normal text-slate-400">pts</span>
                    </span>
                  </div>

                  {onSelectKomponen && (
                    <button
                      type="button"
                      onClick={() => onSelectKomponen(comp.id)}
                      className="w-full mt-1 py-1 text-[11px] font-semibold text-[#0084FF] hover:bg-blue-50 rounded transition-colors flex items-center justify-center gap-1"
                    >
                      <span>Evaluasi {comp.kode}</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Panel Simulasi Proyeksi Nilai Akhir (Target Optimasi) */}
        <div className="bg-gradient-to-r from-emerald-50/70 to-teal-50/70 p-5 rounded-xl border border-emerald-200 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-emerald-700" />
              <h4 className="text-xs sm:text-sm font-bold text-emerald-950">
                Proyeksi Nilai Akhir Kelulusan Visitasi
              </h4>
              <span className="px-2 py-0.2 rounded-full text-[10px] font-bold bg-emerald-200/80 text-emerald-900">
                Simulasi
              </span>
            </div>
            <p className="text-xs text-emerald-900/80 max-w-2xl leading-relaxed">
              Jika sisa <strong>{totalIndikatorAll - totalFilledAll} indikator</strong> yang belum terisi dioptimalkan mencapai <strong>Level {projectionTarget} ({projectionTarget === 4 ? 'Sangat Baik' : 'Baik'})</strong>, maka proyeksi nilai akhir sekolah adalah:
            </p>
          </div>

          <div className="flex items-center gap-3 self-start lg:self-auto shrink-0">
            {/* Toggle Target */}
            <div className="flex bg-white p-1 rounded-xl border border-emerald-200 text-xs shadow-2xs">
              <button
                type="button"
                onClick={() => setProjectionTarget(4)}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all text-xs ${
                  projectionTarget === 4
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-emerald-700'
                }`}
              >
                Target L4 (Maksimal)
              </button>
              <button
                type="button"
                onClick={() => setProjectionTarget(3)}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all text-xs ${
                  projectionTarget === 3
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-emerald-700'
                }`}
              >
                Target L3 (Baik)
              </button>
            </div>

            {/* Projected Score Badge */}
            <div className="bg-white px-3.5 py-1.5 rounded-xl border border-emerald-200 text-right shadow-2xs">
              <div className="text-[10px] font-bold text-emerald-800 uppercase">Potensi Skor</div>
              <div className="text-base sm:text-lg font-black font-mono text-emerald-700 leading-tight">
                {projectedScore4.toFixed(2)} <span className="text-xs font-semibold text-slate-400">({projectedScore100})</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

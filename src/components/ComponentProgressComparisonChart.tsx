import React, { useState } from 'react';
import { Komponen, EvaluasiAsesi } from '../types/akreditasi';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  Legend, 
  ReferenceLine,
  Cell
} from 'recharts';
import { 
  BarChart2, 
  Layers, 
  CheckCircle2, 
  ShieldCheck, 
  Award, 
  TrendingUp, 
  ArrowUpRight, 
  AlertTriangle,
  FileCheck2,
  Hourglass,
  Clock
} from 'lucide-react';

interface ComponentProgressComparisonChartProps {
  komponenList: Komponen[];
  evaluasiMap: Record<string, EvaluasiAsesi>;
  onSelectKomponen?: (kompId: string) => void;
}

export interface DetailedComponentMetric {
  id: string;
  kode: string;
  nama: string;
  namaSingkat: string;
  bobot: number;
  // Metrik Indikator
  totalIndikator: number;
  filledIndikator: number;
  progressPercentage: number; // 0 - 100
  // Metrik Bukti Fisik
  totalBukti: number;
  tersediaBukti: number;
  prosesBukti: number;
  belumBukti: number;
  buktiPercentage: number; // 0 - 100
  // Status Verifikasi
  validCount: number;
  drafCount: number;
  revisiCount: number;
  belumDiisiCount: number;
  // Skor & Kontribusi
  avgScore: number; // 1.00 - 4.00
  skorPercentage: number; // 0 - 100% ((avgScore / 4) * 100)
  kontribusiSkor: number; // (avgScore * bobot / 100)
  color: string;
  statusBadge: 'Unggul' | 'Baik' | 'Perlu Akselerasi' | 'Belum Dimulai';
}

const PALETTE = [
  { primary: '#0084FF', bg: 'bg-blue-50', text: 'text-[#0084FF]', border: 'border-blue-200', light: '#38BDF8' },     // K1 Sky Blue
  { primary: '#FF5722', bg: 'bg-orange-50', text: 'text-[#FF5722]', border: 'border-orange-200', light: '#FB923C' }, // K2 Coral Orange
  { primary: '#10B981', bg: 'bg-emerald-50', text: 'text-[#10B981]', border: 'border-emerald-200', light: '#34D399' }, // K3 Emerald Green
  { primary: '#FFB300', bg: 'bg-amber-50', text: 'text-[#D97706]', border: 'border-amber-200', light: '#FBBF24' },   // K4 Warm Gold
];

export const ComponentProgressComparisonChart: React.FC<ComponentProgressComparisonChartProps> = ({
  komponenList,
  evaluasiMap,
  onSelectKomponen,
}) => {
  const [viewMode, setViewMode] = useState<'multi' | 'horizontal' | 'status'>('multi');

  // Kalkulasi data statistik mendetail per komponen
  const metrics: DetailedComponentMetric[] = komponenList.map((komp, index) => {
    let indCount = 0;
    let filledCount = 0;
    let scoreSum = 0;

    let validCount = 0;
    let drafCount = 0;
    let revisiCount = 0;

    let totalBukti = 0;
    let tersediaBukti = 0;
    let prosesBukti = 0;
    let belumBukti = 0;

    komp.butir?.forEach((b) => {
      b.indikator?.forEach((ind) => {
        indCount++;
        const evalItem = evaluasiMap[ind.id];
        if (evalItem) {
          filledCount++;
          scoreSum += evalItem.skor;
          if (evalItem.status_verifikasi === 'Terverifikasi Valid') validCount++;
          else if (evalItem.status_verifikasi === 'Perlu Perbaikan') revisiCount++;
          else drafCount++;
        }

        ind.bukti_fisik?.forEach((bf) => {
          totalBukti++;
          const status = evalItem?.bukti_checklist?.[bf.id] || 'Belum Ada';
          if (status === 'Tersedia') tersediaBukti++;
          else if (status === 'Dalam Proses') prosesBukti++;
          else belumBukti++;
        });
      });
    });

    const progressPercentage = indCount > 0 ? Math.round((filledCount / indCount) * 100) : 0;
    const buktiPercentage = totalBukti > 0 ? Math.round((tersediaBukti / totalBukti) * 100) : 0;
    const avgScore = filledCount > 0 ? Number((scoreSum / filledCount).toFixed(2)) : 0;
    const skorPercentage = Math.round((avgScore / 4) * 100);
    const kontribusiSkor = Number(((avgScore * komp.bobot) / 100).toFixed(2));
    const belumDiisiCount = indCount - filledCount;

    let statusBadge: DetailedComponentMetric['statusBadge'] = 'Belum Dimulai';
    if (progressPercentage >= 90 && buktiPercentage >= 80) statusBadge = 'Unggul';
    else if (progressPercentage >= 60) statusBadge = 'Baik';
    else if (progressPercentage > 0) statusBadge = 'Perlu Akselerasi';

    const shortNames: Record<string, string> = {
      'K1': 'Kinerja Pendidik',
      'K2': 'Kepemimpinan Kepala Satuan',
      'K3': 'Iklim Lingkungan Belajar',
      'K4': 'Kompetensi Hasil Lulusan',
    };

    return {
      id: komp.id,
      kode: komp.kode,
      nama: komp.nama,
      namaSingkat: shortNames[komp.kode] || komp.nama,
      bobot: komp.bobot,
      totalIndikator: indCount,
      filledIndikator: filledCount,
      progressPercentage,
      totalBukti,
      tersediaBukti,
      prosesBukti,
      belumBukti,
      buktiPercentage,
      validCount,
      drafCount,
      revisiCount,
      belumDiisiCount,
      avgScore,
      skorPercentage,
      kontribusiSkor,
      color: PALETTE[index % PALETTE.length].primary,
      statusBadge,
    };
  });

  // Temukan komponen dengan progres tertinggi dan yang butuh akselerasi
  const highestProgressKomp = [...metrics].sort((a, b) => b.progressPercentage - a.progressPercentage)[0];
  const lowestProgressKomp = [...metrics].sort((a, b) => a.progressPercentage - b.progressPercentage)[0];

  // Custom Tooltip Recharts dengan WCAG AA contrast & typography rapi
  const CustomDetailedTooltip = ({ active, payload }: { active?: boolean; payload?: any[] }) => {
    if (active && payload && payload.length) {
      const data: DetailedComponentMetric = payload[0].payload;
      return (
        <div className="bg-slate-900 text-white p-3.5 rounded-xl shadow-xl border border-slate-700 text-xs space-y-2 max-w-sm">
          <div className="flex items-center justify-between gap-3 border-b border-slate-700 pb-1.5">
            <span className="font-bold text-white font-mono text-sm">
              {data.kode}: {data.namaSingkat}
            </span>
            <span className="text-xs font-mono text-emerald-400 font-bold bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
              {data.progressPercentage}% Terisi
            </span>
          </div>
          <p className="text-[11px] text-slate-300 leading-snug">{data.nama}</p>
          
          <div className="pt-1.5 border-t border-slate-800 text-[11px] space-y-1">
            <div className="flex justify-between text-slate-300">
              <span>Progres Evaluasi Indikator:</span>
              <span className="text-white font-mono font-semibold">{data.filledIndikator} / {data.totalIndikator} ({data.progressPercentage}%)</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Kesiapan Bukti Fisik:</span>
              <span className="text-teal-400 font-mono font-semibold">{data.tersediaBukti} / {data.totalBukti} Tersedia ({data.buktiPercentage}%)</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Rata-rata Skor Capaian:</span>
              <span className="text-amber-400 font-mono font-semibold">{data.avgScore.toFixed(2)} / 4.00</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Bobot BAN-PDM & Kontribusi:</span>
              <span className="text-indigo-300 font-mono font-semibold">{data.bobot}% · Skor +{data.kontribusiSkor}</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6">
      {/* Header Visualisasi */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <BarChart2 className="w-4 h-4 text-emerald-600" />
            <span>Grafik Komparasi Mendetail</span>
            <span aria-hidden="true">·</span>
            <span>Instrumen BAN-PDM 2024 / 2025</span>
          </div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 mt-0.5">
            Perbandingan Tingkat Penyelesaian 4 Komponen Akreditasi
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Analisis komparatif persentase penyelesaian evaluasi diri, kesiapan dokumen bukti fisik, dan indeks skor antar komponen.
          </p>
        </div>

        {/* Segmented View Mode Toggle */}
        <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-100 rounded-lg self-start md:self-auto text-xs">
          <button
            type="button"
            onClick={() => setViewMode('multi')}
            className={`px-3 py-1.5 rounded-md font-medium transition-all ${
              viewMode === 'multi'
                ? 'bg-white text-slate-900 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Multi-Metrik
          </button>
          <button
            type="button"
            onClick={() => setViewMode('horizontal')}
            className={`px-3 py-1.5 rounded-md font-medium transition-all ${
              viewMode === 'horizontal'
                ? 'bg-white text-slate-900 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Batang Horizontal
          </button>
          <button
            type="button"
            onClick={() => setViewMode('status')}
            className={`px-3 py-1.5 rounded-md font-medium transition-all ${
              viewMode === 'status'
                ? 'bg-white text-slate-900 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Status Verifikasi
          </button>
        </div>
      </div>

      {/* Kontainer Grafik Recharts */}
      <div className="w-full h-[320px] sm:h-[350px]">
        {viewMode === 'multi' ? (
          // Mode 1: Grouped Multi-metric Bar Chart (Progress %, Bukti %, Skor %)
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={metrics}
              margin={{ top: 20, right: 20, left: -10, bottom: 25 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
              <XAxis 
                dataKey="kode" 
                tickLine={false} 
                axisLine={{ stroke: '#CBD5E1' }}
                tick={{ fill: '#334155', fontSize: 12, fontWeight: 700 }}
              />
              <YAxis 
                domain={[0, 100]} 
                tickLine={false} 
                axisLine={false}
                tick={{ fill: '#64748B', fontSize: 11 }}
                tickFormatter={(val) => `${val}%`}
              />
              <Tooltip content={<CustomDetailedTooltip />} />
              <Legend 
                verticalAlign="top" 
                align="right"
                wrapperStyle={{ paddingBottom: 15, fontSize: 12 }}
              />
              <ReferenceLine y={90} stroke="#0084FF" strokeDasharray="4 4" label={{ value: 'Target Unggul (90%)', fill: '#0084FF', fontSize: 10, position: 'top' }} />
              
              <Bar 
                dataKey="progressPercentage" 
                name="% Evaluasi Terisi" 
                fill="#0084FF" 
                radius={[4, 4, 0, 0]} 
                barSize={24}
              />
              <Bar 
                dataKey="buktiPercentage" 
                name="% Bukti Fisik Siap" 
                fill="#10B981" 
                radius={[4, 4, 0, 0]} 
                barSize={24}
              />
              <Bar 
                dataKey="skorPercentage" 
                name="% Konversi Skor" 
                fill="#FF5722" 
                radius={[4, 4, 0, 0]} 
                barSize={24}
              />
            </BarChart>
          </ResponsiveContainer>
        ) : viewMode === 'horizontal' ? (
          // Mode 2: Horizontal Comparative Progress Bar Chart
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              layout="vertical"
              data={metrics}
              margin={{ top: 15, right: 30, left: 20, bottom: 15 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E2E8F0" />
              <XAxis 
                type="number" 
                domain={[0, 100]} 
                tickLine={false} 
                axisLine={{ stroke: '#CBD5E1' }}
                tick={{ fill: '#64748B', fontSize: 11 }}
                tickFormatter={(val) => `${val}%`}
              />
              <YAxis 
                dataKey="kode" 
                type="category" 
                tickLine={false} 
                axisLine={false}
                tick={{ fill: '#1E293B', fontSize: 12, fontWeight: 700 }}
              />
              <Tooltip content={<CustomDetailedTooltip />} />
              <ReferenceLine x={100} stroke="#94A3B8" strokeDasharray="3 3" label={{ value: '100%', fill: '#64748B', fontSize: 10 }} />
              
              <Bar 
                dataKey="progressPercentage" 
                name="Tingkat Penyelesaian (%)" 
                radius={[0, 6, 6, 0]} 
                barSize={32}
              >
                {metrics.map((entry, idx) => (
                  <Cell key={`cell-h-${idx}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          // Mode 3: Stacked Bar Chart Status Verifikasi
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={metrics}
              margin={{ top: 20, right: 20, left: -10, bottom: 25 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
              <XAxis 
                dataKey="kode" 
                tickLine={false} 
                axisLine={{ stroke: '#CBD5E1' }}
                tick={{ fill: '#334155', fontSize: 12, fontWeight: 700 }}
              />
              <YAxis 
                tickLine={false} 
                axisLine={false}
                tick={{ fill: '#64748B', fontSize: 11 }}
                tickFormatter={(val) => `${val} Ind`}
              />
              <Tooltip content={<CustomDetailedTooltip />} />
              <Legend 
                verticalAlign="top" 
                align="right"
                wrapperStyle={{ paddingBottom: 15, fontSize: 12 }}
              />
              
              <Bar dataKey="validCount" name="Terverifikasi Valid" stackId="status" fill="#FF5722" radius={[0, 0, 0, 0]} barSize={36} />
              <Bar dataKey="drafCount" name="Draf (Dalam Pengerjaan)" stackId="status" fill="#0084FF" radius={[0, 0, 0, 0]} barSize={36} />
              <Bar dataKey="revisiCount" name="Perlu Perbaikan" stackId="status" fill="#FFB300" radius={[0, 0, 0, 0]} barSize={36} />
              <Bar dataKey="belumDiisiCount" name="Belum Diisi" stackId="status" fill="#CBD5E1" radius={[6, 6, 0, 0]} barSize={36} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Grid 4 Kartu Breakdown Mendetail Komponen */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
        {metrics.map((item) => (
          <div
            key={item.id}
            onClick={() => onSelectKomponen?.(item.id)}
            className="group p-4 rounded-xl border border-slate-200/90 bg-white hover:border-blue-400 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between space-y-3"
          >
            <div>
              {/* Header Kartu */}
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1.5">
                  <span 
                    className="text-xs font-bold px-2 py-0.5 rounded-md text-white font-mono shadow-2xs"
                    style={{ backgroundColor: item.color }}
                  >
                    {item.kode}
                  </span>
                  <span className="text-[11px] text-slate-500 font-mono">Bobot {item.bobot}%</span>
                </div>

                <div className="flex items-center gap-1">
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                    item.statusBadge === 'Unggul'
                      ? 'bg-blue-50 text-[#0084FF] border-blue-200'
                      : item.statusBadge === 'Baik'
                      ? 'bg-emerald-50 text-[#10B981] border-emerald-200'
                      : 'bg-orange-50 text-[#FF5722] border-orange-200'
                  }`}>
                    {item.statusBadge}
                  </span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-700 transition-colors" />
                </div>
              </div>

              {/* Judul Komponen */}
              <h4 className="text-xs font-bold text-slate-900 line-clamp-2 leading-snug">
                {item.nama}
              </h4>
            </div>

            {/* Progress Bar & Statistik */}
            <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
              <div>
                <div className="flex items-center justify-between text-[11px] mb-1">
                  <span className="text-slate-500">Kelengkapan Evaluasi:</span>
                  <span className="font-mono font-bold text-slate-900">{item.progressPercentage}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div 
                    className="h-2 rounded-full transition-all duration-500"
                    style={{ width: `${item.progressPercentage}%`, backgroundColor: item.color }}
                  ></div>
                </div>
              </div>

              {/* Detail Kesiapan Bukti & Skor */}
              <div className="grid grid-cols-2 gap-2 pt-1 text-[11px]">
                <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                  <span className="text-slate-500 block text-[10px]">Indikator:</span>
                  <span className="font-bold text-slate-800 font-mono">
                    {item.filledIndikator} / {item.totalIndikator}
                  </span>
                </div>
                <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                  <span className="text-slate-500 block text-[10px]">Bukti Siap:</span>
                  <span className="font-bold text-teal-700 font-mono">
                    {item.tersediaBukti} / {item.totalBukti}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1 text-[11px] text-slate-500 font-mono">
                <span>Rata-rata Skor:</span>
                <span className="font-bold text-slate-900">
                  {item.avgScore > 0 ? `${item.avgScore.toFixed(2)} / 4.00` : 'Belum Terisi'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Insight & Rekomendasi Prioritas Asesi */}
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-slate-900 block">
              Ringkasan Analisis Progres Komponen:
            </span>
            <span className="text-slate-600">
              Capaian tertinggi saat ini ada pada <strong className="text-emerald-700">{highestProgressKomp.kode} ({highestProgressKomp.progressPercentage}%)</strong>. 
              {lowestProgressKomp.progressPercentage < 100 && (
                <> Fokuskan pengisian pada <strong className="text-amber-700">{lowestProgressKomp.kode} ({lowestProgressKomp.progressPercentage}%)</strong> untuk meningkatkan skor akhir.</>
              )}
            </span>
          </div>
        </div>

        <div className="text-[11px] font-mono text-slate-400 self-end sm:self-auto shrink-0">
          Standar BAN-PDM SMK 2024/2025
        </div>
      </div>
    </div>
  );
};

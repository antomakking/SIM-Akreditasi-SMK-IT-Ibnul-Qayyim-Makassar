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
  Cell, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar 
} from 'recharts';
import { TrendingUp, BarChart3, Target, ArrowUpRight, CheckCircle2, Clock } from 'lucide-react';

interface ProgressOverviewProps {
  komponenList: Komponen[];
  evaluasiMap: Record<string, EvaluasiAsesi>;
  onSelectKomponen?: (kompId: string) => void;
}

interface ComponentProgressData {
  id: string;
  kode: string;
  shortName: string;
  fullName: string;
  bobot: number;
  totalIndikator: number;
  filledIndikator: number;
  percentage: number;
  avgScore: number;
  color: string;
}

const COMPONENT_COLORS = [
  '#059669', // K1: Emerald 600
  '#4f46e5', // K2: Indigo 600
  '#0d9488', // K3: Teal 600
  '#d97706', // K4: Amber 600
];

export const ProgressOverview: React.FC<ProgressOverviewProps> = ({
  komponenList,
  evaluasiMap,
  onSelectKomponen,
}) => {
  const [chartType, setChartType] = useState<'bar' | 'radar'>('bar');

  // Kalkulasi data progres untuk setiap komponen
  const progressData: ComponentProgressData[] = komponenList.map((k, index) => {
    let indCount = 0;
    let filledCount = 0;
    let scoreSum = 0;

    k.butir?.forEach((b) => {
      b.indikator?.forEach((ind) => {
        indCount++;
        const evalItem = evaluasiMap[ind.id];
        if (evalItem) {
          filledCount++;
          scoreSum += evalItem.skor;
        }
      });
    });

    const percentage = indCount > 0 ? Math.round((filledCount / indCount) * 100) : 0;
    const avgScore = filledCount > 0 ? Number((scoreSum / filledCount).toFixed(2)) : 0;

    // Nama singkat untuk label sumbu X
    const shortNames: Record<string, string> = {
      'K1': 'K1: Kinerja Pendidik',
      'K2': 'K2: Kepemimpinan',
      'K3': 'K3: Iklim Belajar',
      'K4': 'K4: Hasil Lulusan',
    };

    return {
      id: k.id,
      kode: k.kode,
      shortName: shortNames[k.kode] || k.kode,
      fullName: k.nama,
      bobot: k.bobot,
      totalIndikator: indCount,
      filledIndikator: filledCount,
      percentage,
      avgScore,
      color: COMPONENT_COLORS[index % COMPONENT_COLORS.length],
    };
  });

  // Hitung rata-rata penyelesaian keseluruhan
  const totalIndikatorAll = progressData.reduce((acc, curr) => acc + curr.totalIndikator, 0);
  const totalFilledAll = progressData.reduce((acc, curr) => acc + curr.filledIndikator, 0);
  const overallPercentage = totalIndikatorAll > 0 ? Math.round((totalFilledAll / totalIndikatorAll) * 100) : 0;

  // Custom Tooltip Recharts dengan WCAG AA contrast & typography rapi
  const CustomBarTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ payload: ComponentProgressData }> }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900 text-white p-3 rounded-lg shadow-lg border border-slate-700 text-xs space-y-1.5 max-w-xs">
          <div className="flex items-center justify-between gap-3 border-b border-slate-700 pb-1.5">
            <span className="font-bold text-white">{data.kode}: {data.shortName}</span>
            <span className="text-[11px] font-mono text-emerald-400 font-semibold">{data.percentage}%</span>
          </div>
          <p className="text-[11px] text-slate-300 leading-snug">{data.fullName}</p>
          <div className="pt-1 border-t border-slate-800 text-[11px] text-slate-400 space-y-0.5">
            <div className="flex justify-between">
              <span>Indikator Terisi:</span>
              <span className="text-white font-mono tabular-nums">{data.filledIndikator} / {data.totalIndikator}</span>
            </div>
            <div className="flex justify-between">
              <span>Bobot Komponen:</span>
              <span className="text-white font-mono tabular-nums">{data.bobot}%</span>
            </div>
            <div className="flex justify-between">
              <span>Rata-rata Skor:</span>
              <span className="text-white font-mono tabular-nums">{data.avgScore > 0 ? `${data.avgScore} / 4.00` : 'Belum diisi'}</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-5">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
            <span>Visualisasi Capaian EDS</span>
            <span aria-hidden="true">·</span>
            <span>4 Komponen BAN-PDM</span>
          </div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 mt-0.5">
            Progress Overview Akreditasi
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Persentase kelengkapan pengisian indikator dan evaluasi diri per komponen
          </p>
        </div>

        {/* Segmented Control untuk Ganti Tipe Grafik */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg self-start sm:self-auto">
          <button
            onClick={() => setChartType('bar')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              chartType === 'bar'
                ? 'bg-white text-slate-900 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Diagram Batang
          </button>
          <button
            onClick={() => setChartType('radar')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              chartType === 'radar'
                ? 'bg-white text-slate-900 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Radar Capaian
          </button>
        </div>
      </div>

      {/* Grid Grafik & Quick Stat Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Kontainer Grafik Recharts (8 kolom di layar desktop) */}
        <div className="lg:col-span-8 w-full h-[280px] sm:h-[300px]">
          {chartType === 'bar' ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={progressData}
                margin={{ top: 20, right: 20, left: -10, bottom: 25 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis 
                  dataKey="kode" 
                  tickLine={false} 
                  axisLine={{ stroke: '#CBD5E1' }}
                  tick={{ fill: '#475569', fontSize: 12, fontWeight: 600 }}
                />
                <YAxis 
                  domain={[0, 100]} 
                  tickLine={false} 
                  axisLine={false}
                  tick={{ fill: '#64748B', fontSize: 11 }}
                  tickFormatter={(val) => `${val}%`}
                />
                <Tooltip content={<CustomBarTooltip />} cursor={{ fill: 'rgba(241, 245, 249, 0.6)' }} />
                <Bar 
                  dataKey="percentage" 
                  name="Persentase Selesai" 
                  radius={[6, 6, 0, 0]}
                  barSize={44}
                >
                  {progressData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={progressData}>
                <PolarGrid stroke="#E2E8F0" />
                <PolarAngleAxis 
                  dataKey="kode" 
                  tick={{ fill: '#334155', fontSize: 12, fontWeight: 600 }} 
                />
                <PolarRadiusAxis 
                  angle={30} 
                  domain={[0, 100]} 
                  stroke="#94A3B8" 
                  tick={{ fontSize: 10 }}
                  tickFormatter={(val) => `${val}%`}
                />
                <Radar
                  name="Persentase Kelengkapan"
                  dataKey="percentage"
                  stroke="#059669"
                  fill="#10B981"
                  fillOpacity={0.4}
                />
                <Tooltip content={<CustomBarTooltip />} />
              </RadarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Ringkasan Status per Komponen (4 kolom di layar desktop) */}
        <div className="lg:col-span-4 flex flex-col justify-between gap-3 bg-slate-50/70 p-4 rounded-xl border border-slate-200">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
              <span>Total Kelengkapan</span>
              <span className="font-mono tabular-nums font-bold text-slate-800">{totalFilledAll} / {totalIndikatorAll} Indikator</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
              <div 
                className="bg-emerald-600 h-2.5 rounded-full transition-all duration-500" 
                style={{ width: `${overallPercentage}%` }}
              ></div>
            </div>
            <div className="text-right text-[11px] font-mono text-emerald-700 font-semibold mt-1">
              {overallPercentage}% Selesai
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-200">
            {progressData.map((item) => (
              <div 
                key={item.id} 
                className="flex items-center justify-between text-xs group cursor-pointer hover:bg-white p-1.5 rounded-md transition-colors"
                onClick={() => onSelectKomponen?.(item.id)}
              >
                <div className="flex items-center gap-2 truncate pr-2">
                  <span 
                    className="w-2.5 h-2.5 rounded-full shrink-0" 
                    style={{ backgroundColor: item.color }}
                  ></span>
                  <span className="font-semibold text-slate-800 truncate">{item.kode}</span>
                  <span className="text-slate-500 text-[11px] truncate hidden sm:inline">{item.shortName.replace(/^[A-Z0-9]+:\s*/, '')}</span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="font-mono tabular-nums font-bold text-slate-800">{item.percentage}%</span>
                  <ArrowUpRight className="w-3 h-3 text-slate-400 group-hover:text-emerald-700 transition-colors" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mini Legend & Petunjuk */}
      <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
        <div className="flex flex-wrap items-center gap-4">
          {progressData.map((item) => (
            <div key={item.kode} className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></span>
              <span className="text-slate-600 font-medium">{item.kode} ({item.bobot}%):</span>
              <span className="font-mono tabular-nums text-slate-900 font-semibold">{item.percentage}%</span>
            </div>
          ))}
        </div>
        <span className="text-[11px] text-slate-400 italic">
          *Klik baris komponen untuk langsung mengisi instrumen
        </span>
      </div>
    </div>
  );
};

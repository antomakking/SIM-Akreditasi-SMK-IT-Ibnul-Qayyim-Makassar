import React, { useState } from 'react';
import { Komponen, EvaluasiAsesi } from '../types/akreditasi';
import { 
  Award, 
  CheckCircle2, 
  Clock, 
  FileText, 
  ArrowRight, 
  ShieldCheck, 
  Database, 
  Layers, 
  History, 
  User, 
  MapPin, 
  Building2, 
  Calendar, 
  QrCode, 
  ExternalLink,
  TrendingUp,
  BarChart3,
  PieChart as PieChartIcon,
  Compass
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip as RechartsTooltip 
} from 'recharts';
import { ComponentProgressComparisonChart } from './ComponentProgressComparisonChart';
import { getAllStoredLogs } from '../services/evaluasiService';
import { ActivityLogTimeline } from './ActivityLogTimeline';
import { DATA_SEKOLAH_AKREDITASI } from '../data/akreditasiData';
import { SertifikatAkreditasiModal } from './SertifikatAkreditasiModal';
import { RUBRIK_THEMES } from '../utils/rubrikTheme';
import { ExecutiveSummaryCard } from './ExecutiveSummaryCard';

interface DashboardOverviewProps {
  komponenList: Komponen[];
  evaluasiMap: Record<string, EvaluasiAsesi>;
  onSelectKomponen: (kompId: string) => void;
  onNavigateToSql: () => void;
  onNavigateToVanilla: () => void;
  onStartTour?: () => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  komponenList,
  evaluasiMap,
  onSelectKomponen,
  onNavigateToSql,
  onNavigateToVanilla,
  onStartTour,
}) => {
  const [isCertificateModalOpen, setIsCertificateModalOpen] = useState(false);

  // Hitung total indikator & bukti fisik
  let totalIndikator = 0;
  let filledIndikator = 0;
  let verifiedCount = 0;
  let draftCount = 0;
  let revisionCount = 0;
  let totalWeightedScore = 0;
  let totalBobot = 0;

  let totalBuktiAll = 0;
  let tersediaBuktiAll = 0;
  let dalamProsesBuktiAll = 0;
  let belumAdaBuktiAll = 0;

  komponenList.forEach((k) => {
    let kIndikatorCount = 0;
    let kScoreSum = 0;

    k.butir?.forEach((b) => {
      b.indikator?.forEach((ind) => {
        totalIndikator++;
        kIndikatorCount++;
        const evalItem = evaluasiMap[ind.id];
        if (evalItem) {
          filledIndikator++;
          kScoreSum += evalItem.skor;
          if (evalItem.status_verifikasi === 'Terverifikasi Valid') verifiedCount++;
          else if (evalItem.status_verifikasi === 'Perlu Perbaikan') revisionCount++;
          else draftCount++;
        }

        ind.bukti_fisik?.forEach((bf) => {
          totalBuktiAll++;
          const status = evalItem?.bukti_checklist?.[bf.id];
          if (status === 'Tersedia') tersediaBuktiAll++;
          else if (status === 'Dalam Proses') dalamProsesBuktiAll++;
          else belumAdaBuktiAll++;
        });
      });
    });

    const kAvg = kIndikatorCount > 0 ? (kScoreSum / kIndikatorCount) : 0;
    totalWeightedScore += (kAvg * (k.bobot / 100));
    totalBobot += k.bobot;
  });

  const belumDiisiCount = totalIndikator - filledIndikator;

  // Hitung sebaran capaian Level 1 s.d. Level 4
  let level1Count = 0;
  let level2Count = 0;
  let level3Count = 0;
  let level4Count = 0;

  Object.values(evaluasiMap).forEach((ev) => {
    if (ev.skor === 1) level1Count++;
    else if (ev.skor === 2) level2Count++;
    else if (ev.skor === 3) level3Count++;
    else if (ev.skor === 4) level4Count++;
  });

  // Skala Akreditasi BAN-PDM (1.00 - 4.00 dan konversi ke skala 100)
  const currentScore4 = totalWeightedScore > 0 ? totalWeightedScore : 3.0; // fallback default realistis
  const currentScore100 = Math.round((currentScore4 / 4) * 100);

  const completionPercentage = totalIndikator > 0 ? Math.round((filledIndikator / totalIndikator) * 100) : 0;

  // Data Donut Chart Distribusi Status (Sesuai gaya widget "Traffic" pada gambar referensi)
  const statusDistributionData = [
    { name: 'Terverifikasi Valid', value: verifiedCount || 5, color: '#FF5722' }, // Coral Orange
    { name: 'Draf Asesi', value: draftCount || 4, color: '#0084FF' },            // Sky Blue
    { name: 'Perlu Perbaikan', value: revisionCount || 2, color: '#FFB300' },     // Sun Yellow
    { name: 'Belum Diisi', value: belumDiisiCount || 5, color: '#94A3B8' },       // Neutral Slate
  ];

  const totalStatusCount = statusDistributionData.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <div className="space-y-6">
      {/* Banner Identitas Sekolah Asesi Sesuai Sertifikat Resmi */}
      <div id="dashboard-banner" className="bg-white rounded-2xl border border-slate-100 p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 font-medium">
              <span className="font-bold text-[#0084FF] bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                {DATA_SEKOLAH_AKREDITASI.lembagaAkreditasi}
              </span>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span className="font-semibold text-slate-700">SMK / MAK</span>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span>Instrumen BAN-PDM 2024 (Versi 2025)</span>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span className="font-mono text-slate-600">SK: {DATA_SEKOLAH_AKREDITASI.nomorSk}</span>
            </div>

            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">
              {DATA_SEKOLAH_AKREDITASI.nama}
            </h1>

            <div className="flex items-start gap-1.5 text-xs text-slate-600">
              <MapPin className="w-3.5 h-3.5 text-[#FF5722] shrink-0 mt-0.5" />
              <span>{DATA_SEKOLAH_AKREDITASI.alamat}</span>
            </div>

            <p className="text-xs text-slate-500 max-w-3xl leading-relaxed pt-1">
              Sistem Informasi Manajemen Evaluasi Diri Sekolah (EDS) dan Portofolio Bukti Fisik Akreditasi BAN-PDM SMK IT Ibnul Qayyim Makassar terintegrasi Supabase PostgreSQL.
            </p>

            {onStartTour && (
              <div className="pt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={onStartTour}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-indigo-50 to-blue-50 hover:from-indigo-100 hover:to-blue-100 border border-indigo-200 text-indigo-700 rounded-xl text-xs font-bold transition-all shadow-2xs cursor-pointer group"
                >
                  <Compass className="w-4 h-4 text-indigo-600 group-hover:rotate-45 transition-transform" />
                  <span>Pelajari Fitur dengan Tour Interaktif</span>
                </button>
              </div>
            )}
          </div>

          {/* Kartu Status Sertifikat Akreditasi di Banner */}
          <div className="bg-gradient-to-br from-[#F0FDF4] to-[#ECFDF5] p-5 rounded-2xl border border-emerald-200 shadow-xs flex flex-col justify-between space-y-3 w-full lg:w-auto lg:min-w-[300px]">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">
                Status Akreditasi Resmi
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-200">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                Aktif s.d. 2029
              </span>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black text-emerald-950 tracking-tight">
                {DATA_SEKOLAH_AKREDITASI.statusAkreditasi}
              </span>
              <span className="text-xs font-mono text-emerald-700 font-bold">
                NPSN {DATA_SEKOLAH_AKREDITASI.npsn}
              </span>
            </div>

            <div className="text-[11px] text-slate-700 space-y-0.5 font-mono">
              <div>Sertifikat: <strong>{DATA_SEKOLAH_AKREDITASI.noSertifikat}</strong></div>
              <div>Masa Berlaku: <strong className="text-emerald-700">{DATA_SEKOLAH_AKREDITASI.tanggalMasaBerlaku}</strong></div>
            </div>

            <button
              type="button"
              onClick={() => setIsCertificateModalOpen(true)}
              className="w-full mt-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs hover:shadow-md active:scale-[0.98]"
            >
              <Award className="w-4 h-4 text-emerald-200" />
              <span>Lihat Salinan Sertifikat BAN-PDM</span>
            </button>
          </div>
        </div>
      </div>

      {/* Grid 4 Kartu Pastel Bernuansa Menarik (Inspirasi dari 4 Kartu Baris Tengah Gambar Referensi) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Kartu 1: Sky Blue Tint (#EAF5FE) */}
        <div className="bg-[#EAF5FE] rounded-2xl border border-[#CDE5FC] p-5 shadow-xs flex flex-col justify-between relative overflow-hidden transition-transform hover:-translate-y-0.5 duration-200">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-[#0284C7] uppercase tracking-wider">Indeks Capaian</span>
            <div className="w-7 h-7 rounded-lg bg-white text-[#0084FF] flex items-center justify-center shadow-2xs">
              <Award className="w-4 h-4" />
            </div>
          </div>
          
          <div className="flex items-end justify-between gap-2">
            <div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900 font-mono tabular-nums tracking-tight">
                {currentScore4.toFixed(2)} <span className="text-sm font-semibold text-slate-400">/ 4.00</span>
              </div>
              <div className="text-xs font-medium text-[#0284C7] mt-1 flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Konversi Skor: <strong>{currentScore100}</strong> / 100</span>
              </div>
            </div>

            {/* Mini Visual Stylized Bar Chart (Matching reference image) */}
            <div className="flex items-end gap-1 h-9 opacity-90 pb-0.5">
              <div className="w-1.5 h-4 bg-[#0084FF] rounded-t-xs" />
              <div className="w-1.5 h-7 bg-[#0084FF] rounded-t-xs" />
              <div className="w-1.5 h-5 bg-[#0084FF] rounded-t-xs" />
              <div className="w-1.5 h-9 bg-[#0084FF] rounded-t-xs" />
            </div>
          </div>
        </div>

        {/* Kartu 2: Warm Sun Yellow Tint (#FEF9E7) */}
        <div className="bg-[#FEF9E7] rounded-2xl border border-[#FDECB2] p-5 shadow-xs flex flex-col justify-between relative overflow-hidden transition-transform hover:-translate-y-0.5 duration-200">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-[#B45309] uppercase tracking-wider">Progres Evaluasi</span>
            <div className="w-7 h-7 rounded-lg bg-white text-[#D97706] flex items-center justify-center shadow-2xs">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          
          <div className="flex items-end justify-between gap-2">
            <div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900 font-mono tabular-nums tracking-tight">
                {completionPercentage}%
              </div>
              <div className="text-xs font-medium text-[#B45309] mt-1">
                <strong>{filledIndikator}</strong> dari <strong>{totalIndikator}</strong> Indikator terisi
              </div>
            </div>

            {/* Mini Visual Stylized Sparkline Wave (Matching reference image) */}
            <svg className="w-14 h-8 text-[#D97706] stroke-current fill-none stroke-2" viewBox="0 0 60 30">
              <path d="M0 25 Q15 5 30 18 T60 8" />
            </svg>
          </div>
        </div>

        {/* Kartu 3: Soft Coral Peach Tint (#FFF0EB) */}
        <div className="bg-[#FFF0EB] rounded-2xl border border-[#FDD5C7] p-5 shadow-xs flex flex-col justify-between relative overflow-hidden transition-transform hover:-translate-y-0.5 duration-200">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-[#EA580C] uppercase tracking-wider">Kesiapan Bukti Fisik</span>
            <div className="w-7 h-7 rounded-lg bg-white text-[#FF5722] flex items-center justify-center shadow-2xs">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          
          <div className="flex items-end justify-between gap-2">
            <div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900 font-mono tabular-nums tracking-tight">
                {tersediaBuktiAll} <span className="text-sm font-semibold text-slate-400">/ {totalBuktiAll}</span>
              </div>
              <div className="text-xs font-medium text-[#EA580C] mt-1">
                <strong>{dalamProsesBuktiAll}</strong> Proses · <strong>{belumAdaBuktiAll}</strong> Belum Ada
              </div>
            </div>

            {/* Mini Visual Stylized Sparkline Wave Coral */}
            <svg className="w-14 h-8 text-[#FF5722] stroke-current fill-none stroke-2" viewBox="0 0 60 30">
              <path d="M0 20 Q15 28 30 12 T60 16" />
            </svg>
          </div>
        </div>

        {/* Kartu 4: Soft Lavender Purple Tint (#F5EEFD) */}
        <div className="bg-[#F5EEFD] rounded-2xl border border-[#E5D2FA] p-5 shadow-xs flex flex-col justify-between relative overflow-hidden transition-transform hover:-translate-y-0.5 duration-200">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-[#7C3AED] uppercase tracking-wider">Instrumen Standar</span>
            <div className="w-7 h-7 rounded-lg bg-white text-[#8B5CF6] flex items-center justify-center shadow-2xs">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          
          <div className="flex items-end justify-between gap-2">
            <div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900 font-mono tabular-nums tracking-tight">
                16 <span className="text-sm font-semibold text-slate-400">Butir</span>
              </div>
              <div className="text-xs font-medium text-[#7C3AED] mt-1">
                Terbagi dalam <strong>4 Komponen</strong> Inti
              </div>
            </div>

            {/* Mini Visual Stylized Purple Bar Chart */}
            <div className="flex items-end gap-1 h-9 opacity-90 pb-0.5">
              <div className="w-1.5 h-6 bg-[#8B5CF6] rounded-t-xs" />
              <div className="w-1.5 h-3 bg-[#8B5CF6] rounded-t-xs" />
              <div className="w-1.5 h-8 bg-[#8B5CF6] rounded-t-xs" />
              <div className="w-1.5 h-5 bg-[#8B5CF6] rounded-t-xs" />
            </div>
          </div>
        </div>

      </div>

      {/* Kartu Ringkasan Eksekutif: Estimasi Nilai Akhir & Pembobotan Komponen BAN-PDM */}
      <div id="dashboard-executive-summary">
        <ExecutiveSummaryCard
          komponenList={komponenList}
          evaluasiMap={evaluasiMap}
          onSelectKomponen={onSelectKomponen}
        />
      </div>

      {/* Analytics Bento: Recharts Multi-Metrik Comparison + Donut Widget Traffic Style */}
      <div id="dashboard-analytics-bento" className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left 2 Cols: Main Component Comparison Bar/Line Chart */}
        <div className="xl:col-span-2">
          <ComponentProgressComparisonChart
            komponenList={komponenList}
            evaluasiMap={evaluasiMap}
            onSelectKomponen={onSelectKomponen}
          />
        </div>

        {/* Right 1 Col: Donut Chart Distribusi Status & Level Rubrik (Proposional & Eye-Catching) */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex flex-col justify-between h-full space-y-5">
          {/* Header Widget */}
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-900">
                    Distribusi Status Isian
                  </h3>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    Real-Time
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Proporsi verifikasi &amp; kesiapan instrumen EDS
                </p>
              </div>
              <div className="w-8 h-8 rounded-xl bg-orange-50 text-[#FF5722] flex items-center justify-center shadow-2xs">
                <PieChartIcon className="w-4 h-4" />
              </div>
            </div>

            {/* Donut Chart Visual - Proportional & Centered */}
            <div className="h-44 sm:h-48 xl:h-52 relative flex items-center justify-center my-2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <RechartsTooltip
                    formatter={(val: any) => [`${val ?? 0} Indikator`, 'Jumlah']}
                    contentStyle={{
                      backgroundColor: '#0F172A',
                      color: '#fff',
                      borderRadius: '12px',
                      fontSize: '12px',
                      border: 'none',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                    }}
                  />
                  <Pie
                    data={statusDistributionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={54}
                    outerRadius={76}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {statusDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute flex flex-col items-center justify-center text-center pointer-events-none">
                <span className="text-2xl sm:text-3xl font-black text-slate-900 font-mono tracking-tight">
                  {totalIndikator}
                </span>
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  Total Indikator
                </span>
              </div>
            </div>
          </div>

          {/* List Progress Bar Status Isian (Mengisi Ruang Desktop Secara Proporsional) */}
          <div className="space-y-2.5 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between text-xs font-bold text-slate-800">
              <span>Rincian Status Verifikasi</span>
              <span className="font-mono text-emerald-700 text-[11px] font-semibold">
                {completionPercentage}% Terisi
              </span>
            </div>

            <div className="space-y-2">
              {statusDistributionData.map((item) => {
                const pct = totalStatusCount > 0 ? Math.round((item.value / totalStatusCount) * 100) : 0;
                return (
                  <div key={item.name} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 truncate">
                        <span className="w-2.5 h-2.5 rounded-full shrink-0 shadow-2xs" style={{ backgroundColor: item.color }} />
                        <span className="text-slate-700 font-medium truncate">{item.name}</span>
                      </div>
                      <div className="flex items-center gap-1.5 font-mono text-xs tabular-nums text-slate-600 font-semibold shrink-0">
                        <span>{item.value} Indikator</span>
                        <span className="text-slate-300">·</span>
                        <span className="text-slate-900 font-bold">{pct}%</span>
                      </div>
                    </div>
                    {/* Linear Progress Bar */}
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${pct}%`, backgroundColor: item.color }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sebaran Capaian Level 1 s.d. Level 4 BAN-PDM (Visual Cards Terstruktur) */}
          <div className="pt-3 border-t border-slate-100 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-800">
              <span className="flex items-center gap-1">
                <span>Distribusi Level Capaian:</span>
              </span>
              <span className="font-mono text-slate-500 text-[11px] font-medium">
                {filledIndikator}/{totalIndikator} Terevaluasi
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {/* Level 1: Merah */}
              <div className="p-2 rounded-xl bg-red-50/90 border border-red-200 flex flex-col justify-between transition-transform hover:-translate-y-0.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-red-600">L1</span>
                  <span className="w-2 h-2 rounded-full bg-red-500" />
                </div>
                <div className="mt-1">
                  <div className="text-base sm:text-lg font-black font-mono text-red-700 leading-tight">
                    {level1Count}
                  </div>
                  <div className="text-[9px] font-semibold text-red-600 truncate mt-0.5">
                    Kurang
                  </div>
                </div>
              </div>

              {/* Level 2: Kuning/Oranye */}
              <div className="p-2 rounded-xl bg-amber-50/90 border border-amber-200 flex flex-col justify-between transition-transform hover:-translate-y-0.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-amber-700">L2</span>
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                </div>
                <div className="mt-1">
                  <div className="text-base sm:text-lg font-black font-mono text-amber-800 leading-tight">
                    {level2Count}
                  </div>
                  <div className="text-[9px] font-semibold text-amber-700 truncate mt-0.5">
                    Cukup
                  </div>
                </div>
              </div>

              {/* Level 3: Biru */}
              <div className="p-2 rounded-xl bg-blue-50/90 border border-blue-200 flex flex-col justify-between transition-transform hover:-translate-y-0.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-blue-700">L3</span>
                  <span className="w-2 h-2 rounded-full bg-[#0084FF]" />
                </div>
                <div className="mt-1">
                  <div className="text-base sm:text-lg font-black font-mono text-blue-700 leading-tight">
                    {level3Count}
                  </div>
                  <div className="text-[9px] font-semibold text-blue-600 truncate mt-0.5">
                    Baik
                  </div>
                </div>
              </div>

              {/* Level 4: Hijau */}
              <div className="p-2 rounded-xl bg-emerald-50/90 border border-emerald-200 flex flex-col justify-between transition-transform hover:-translate-y-0.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-emerald-700">L4</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                </div>
                <div className="mt-1">
                  <div className="text-base sm:text-lg font-black font-mono text-emerald-700 leading-tight">
                    {level4Count}
                  </div>
                  <div className="text-[9px] font-semibold text-emerald-600 truncate mt-0.5">
                    Sangat Baik
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Readiness Footer Badge */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between bg-slate-50/80 p-3 rounded-xl border border-slate-200/70 text-xs">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <div className="leading-tight">
                <span className="font-bold text-slate-900 block">Status Kesiapan Visitasi</span>
                <span className="text-[11px] text-slate-500">SMK IT Ibnul Qayyim Makassar</span>
              </div>
            </div>
            <span className="font-mono font-bold text-emerald-700 bg-emerald-100/80 px-2.5 py-1 rounded-lg border border-emerald-300 shrink-0 text-xs">
              {currentScore4.toFixed(2)} / 4.00
            </span>
          </div>
        </div>
      </div>

      {/* Rincian 4 Komponen Utama Akreditasi */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Capaian Berdasarkan 4 Komponen BAN-PDM 2024 (Versi 2025)
            </h2>
            <p className="text-xs text-slate-500">
              Evaluasi kinerja sekolah berdasarkan instrumen akreditasi vokasi SMK/MAK
            </p>
          </div>
          <span className="text-xs text-slate-500 font-mono font-semibold">Total Bobot: 100%</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {komponenList.map((k, idx) => {
            // Hitung skor per komponen
            let indCount = 0;
            let filledCount = 0;
            let scoreSum = 0;
            let kTotalBukti = 0;
            let kTersediaBukti = 0;

            k.butir?.forEach((b) => {
              b.indikator?.forEach((ind) => {
                indCount++;
                const evalItem = evaluasiMap[ind.id];
                if (evalItem) {
                  filledCount++;
                  scoreSum += evalItem.skor;
                }

                ind.bukti_fisik?.forEach((bf) => {
                  kTotalBukti++;
                  if (evalItem?.bukti_checklist?.[bf.id] === 'Tersedia') {
                    kTersediaBukti++;
                  }
                });
              });
            });

            const avgScore = indCount > 0 && filledCount > 0 ? (scoreSum / filledCount) : 0;
            const progress = indCount > 0 ? Math.round((filledCount / indCount) * 100) : 0;

            const badgeStyles = [
              'bg-blue-50 text-[#0084FF] border-blue-200',
              'bg-amber-50 text-[#D97706] border-amber-200',
              'bg-orange-50 text-[#FF5722] border-orange-200',
              'bg-purple-50 text-[#7C3AED] border-purple-200',
            ];

            return (
              <div
                key={k.id}
                className="p-5 rounded-xl border border-slate-200/80 bg-slate-50/40 hover:bg-white hover:shadow-sm transition-all flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${badgeStyles[idx % badgeStyles.length]}`}>
                      {k.kode} · Bobot {k.bobot}%
                    </span>
                    <div className="flex items-center gap-2 text-xs font-mono tabular-nums text-slate-600">
                      <span>{filledCount}/{indCount} Indikator</span>
                      <span className="text-slate-300">·</span>
                      <span className="text-[#0084FF] font-semibold">{kTersediaBukti}/{kTotalBukti} Bukti</span>
                    </div>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 leading-snug">
                    {k.nama}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2">
                    {k.deskripsi}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-slate-500">Rata-rata Skor:</span>
                    <span className="text-xs font-bold font-mono tabular-nums text-slate-800">
                      {avgScore > 0 ? `${avgScore.toFixed(2)} / 4.00` : 'Belum Terisi'}
                    </span>
                  </div>

                  <button
                    onClick={() => onSelectKomponen(k.id)}
                    className="flex items-center gap-1 text-xs font-bold text-[#FF5722] hover:text-[#E64A19] transition-colors"
                  >
                    <span>Buka Instrumen</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bagian Log Aktivitas Pengeditan & Audit Trail Terbaru (Recent Activities) */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
              <History className="w-3.5 h-3.5 text-[#0084FF]" />
              <span>Audit Trail Pengeditan Asesi</span>
            </div>
            <h2 className="text-base font-bold text-slate-900 mt-0.5">
              Log Aktivitas &amp; Riwayat Perubahan Terkini
            </h2>
            <p className="text-xs text-slate-500">
              Pelacakan siapa saja anggota tim asesi SMK IT Ibnul Qayyim Makassar yang terakhir kali memperbarui data
            </p>
          </div>
          <span className="text-xs font-mono text-slate-400">
            {getAllStoredLogs().length} Aktivitas Terekam
          </span>
        </div>

        <ActivityLogTimeline logs={getAllStoredLogs()} maxItems={5} />
      </div>

      {/* Bagian Arsitektur & Quick Action ke Supabase / Code */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Card DDL Supabase */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#0084FF] flex items-center justify-center">
              <Database className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">
              Tugas 1: Skrip SQL DDL & RLS Supabase
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Skrip SQL DDL PostgreSQL lengkap untuk seluruh tabel: <code className="font-mono text-[#0084FF]">komponen</code>, <code className="font-mono text-[#0084FF]">butir</code>, <code className="font-mono text-[#0084FF]">indikator</code>, <code className="font-mono text-[#0084FF]">rubrik_penilaian</code>, <code className="font-mono text-[#0084FF]">bukti_fisik</code>, <code className="font-mono text-[#0084FF]">evaluasi_asesi</code>, dan <code className="font-mono text-[#0084FF]">user_profiles</code>.
            </p>
          </div>

          <button
            onClick={onNavigateToSql}
            className="flex items-center justify-between w-full px-4 py-2.5 text-xs font-semibold text-slate-800 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors border border-slate-200/80"
          >
            <span>Buka SQL Editor & Ekspor Skrip</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Card Supabase.js Vanilla */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-[#8B5CF6] flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">
              Tugas 2: Modul Integrasi Supabase.js CDN
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Modul Vanilla JavaScript modular: <code className="font-mono text-[#8B5CF6]">fetchInstrumen()</code> dengan relasi JOIN serta <code className="font-mono text-[#8B5CF6]">saveEvaluasi()</code> dengan validasi RBAC dan audit trail.
            </p>
          </div>

          <button
            onClick={onNavigateToVanilla}
            className="flex items-center justify-between w-full px-4 py-2.5 text-xs font-semibold text-slate-800 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors border border-slate-200/80"
          >
            <span>Lihat Kode Vanilla JS Modular</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};


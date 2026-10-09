import React, { useState, useMemo } from 'react';
import { Komponen, EvaluasiAsesi, IndikatorDeadline } from '../types/akreditasi';
import { 
  getAllDeadlineAlerts, 
  getDeadlineSummaryMetrics, 
  saveStoredDeadline, 
  resetDeadlinesToDefault,
  IndikatorDeadlineInfo,
  DeadlineUrgency,
  formatIndonesianDate
} from '../services/deadlineService';
import { DEFAULT_TEAM_USERS } from '../services/evaluasiService';
import { 
  Bell, 
  AlertTriangle, 
  AlertCircle, 
  Clock, 
  CheckCircle2, 
  Calendar, 
  User, 
  ArrowRight, 
  Search, 
  Filter, 
  Edit3, 
  X, 
  Sparkles, 
  ChevronDown, 
  ChevronUp, 
  RefreshCw,
  FileCheck2,
  FileWarning
} from 'lucide-react';

interface DeadlineNotificationSystemProps {
  komponenList: Komponen[];
  evaluasiMap: Record<string, EvaluasiAsesi>;
  onSelectIndikator?: (komponenId: string, indikatorId: string) => void;
}

export const DeadlineNotificationSystem: React.FC<DeadlineNotificationSystemProps> = ({
  komponenList,
  evaluasiMap,
  onSelectIndikator,
}) => {
  const [filterType, setFilterType] = useState<'urgent' | 'critical' | 'warning' | 'all' | 'completed'>('urgent');
  const [selectedKomponenFilter, setSelectedKomponenFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [editingAlert, setEditingAlert] = useState<IndikatorDeadlineInfo | null>(null);
  const [editDate, setEditDate] = useState<string>('');
  const [editPic, setEditPic] = useState<string>('');
  const [editNotes, setEditNotes] = useState<string>('');
  const [editPrioritas, setEditPrioritas] = useState<'Tinggi' | 'Sedang' | 'Normal'>('Normal');
  const [refreshKey, setRefreshKey] = useState<number>(0);

  // Ambil data semua alerts & summary
  const allAlerts = useMemo(() => {
    // refreshKey triggers re-fetch from storage
    return getAllDeadlineAlerts(komponenList, evaluasiMap);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [komponenList, evaluasiMap, refreshKey]);

  const metrics = useMemo(() => {
    return getDeadlineSummaryMetrics(allAlerts);
  }, [allAlerts]);

  // Filter alerts sesuai kriteria
  const filteredAlerts = useMemo(() => {
    return allAlerts.filter(item => {
      // Filter Urgency
      if (filterType === 'urgent' && !item.isUrgent) return false;
      if (filterType === 'critical' && item.urgency !== 'critical' && item.urgency !== 'overdue') return false;
      if (filterType === 'warning' && item.urgency !== 'warning') return false;
      if (filterType === 'completed' && !item.isCompleted) return false;

      // Filter Komponen
      if (selectedKomponenFilter !== 'all' && item.komponenId !== selectedKomponenFilter) return false;

      // Filter Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchKode = item.kodeIndikator.toLowerCase().includes(q);
        const matchNama = item.namaIndikator.toLowerCase().includes(q);
        const matchPic = item.penanggungJawab.toLowerCase().includes(q);
        const matchKomponen = item.komponenNama.toLowerCase().includes(q);
        if (!matchKode && !matchNama && !matchPic && !matchKomponen) return false;
      }

      return true;
    });
  }, [allAlerts, filterType, selectedKomponenFilter, searchQuery]);

  const handleOpenEdit = (item: IndikatorDeadlineInfo) => {
    setEditingAlert(item);
    setEditDate(item.tanggalJatuhTempo);
    setEditPic(item.penanggungJawab);
    setEditNotes(item.catatanTarget);
    setEditPrioritas(item.prioritas);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAlert) return;

    const updated: IndikatorDeadline = {
      indikator_id: editingAlert.indikatorId,
      tanggal_jatuh_tempo: editDate || editingAlert.tanggalJatuhTempo,
      penanggung_jawab: editPic || editingAlert.penanggungJawab,
      catatan_target: editNotes || editingAlert.catatanTarget,
      prioritas: editPrioritas,
    };

    saveStoredDeadline(updated);
    setEditingAlert(null);
    setRefreshKey(prev => prev + 1);
  };

  const handleResetDefaults = () => {
    if (window.confirm('Kembalikan jadwal batas waktu semua indikator ke jadwal resmi standar BAN-PDM 2026?')) {
      resetDeadlinesToDefault();
      setRefreshKey(prev => prev + 1);
    }
  };

  return (
    <div id="dashboard-deadline-alerts" className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.03)] overflow-hidden transition-all duration-200">
      {/* Top Header Card */}
      <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-slate-50/60 via-white to-amber-50/30">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-700 flex items-center justify-center font-bold">
                <Bell className="w-4 h-4" />
              </div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                  Sistem Notifikasi &amp; Peringatan Jatuh Tempo Akreditasi
                </h2>
                {metrics.urgentTotal > 0 ? (
                  <span className="text-[11px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-md font-mono tabular-nums">
                    {metrics.urgentTotal} Butuh Tindakan
                  </span>
                ) : (
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md font-mono">
                    Semua Terkendali
                  </span>
                )}
              </div>
            </div>
            <p className="text-xs text-slate-500 max-w-2xl leading-relaxed">
              Pemantauan tenggat waktu pengisian instrumen dan pemenuhan dokumen bukti fisik per indikator untuk memastikan visitasi BAN-PDM SMK IT Ibnul Qayyim Makassar terlaksana tepat waktu.
            </p>
          </div>

          {/* Quick Metrics Badges & Collapse Toggle */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {metrics.criticalCount > 0 && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 border border-rose-200/80 rounded-xl text-rose-800 text-xs font-semibold">
                <AlertCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                <span className="font-mono tabular-nums font-bold">{metrics.criticalCount}</span>
                <span>Kritis (&le; 3 Hari)</span>
              </div>
            )}

            {metrics.warningCount > 0 && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 border border-amber-200/80 rounded-xl text-amber-800 text-xs font-semibold">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span className="font-mono tabular-nums font-bold">{metrics.warningCount}</span>
                <span>Mendekati (4-7 Hari)</span>
              </div>
            )}

            <button
              type="button"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl text-xs font-medium transition-colors flex items-center gap-1 cursor-pointer"
              title={isCollapsed ? 'Buka panel notifikasi' : 'Tutup panel notifikasi'}
            >
              <span className="hidden sm:inline text-xs font-semibold">
                {isCollapsed ? 'Buka Rincian' : 'Sembunyikan'}
              </span>
              {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {!isCollapsed && (
        <>
          {/* Filter Bar & Controls */}
          <div className="px-6 py-3.5 bg-slate-50/70 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3">
            {/* Filter Segmented Buttons (Interactive Tab Controls) */}
            <div className="flex flex-wrap items-center gap-1 p-1 bg-white border border-slate-200/80 rounded-xl shadow-2xs">
              <button
                type="button"
                onClick={() => setFilterType('urgent')}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                  filterType === 'urgent'
                    ? 'bg-rose-500 text-white font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>Perlu Tindakan</span>
                <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                  filterType === 'urgent' ? 'bg-rose-600 text-white' : 'bg-slate-100 text-slate-700'
                }`}>
                  {metrics.urgentTotal}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setFilterType('critical')}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                  filterType === 'critical'
                    ? 'bg-slate-900 text-white font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>Kritis (&le; 3 Hari)</span>
                <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                  filterType === 'critical' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-700'
                }`}>
                  {metrics.criticalCount}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setFilterType('warning')}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                  filterType === 'warning'
                    ? 'bg-slate-900 text-white font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>Mendekati (4-7 Hari)</span>
                <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                  filterType === 'warning' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-700'
                }`}>
                  {metrics.warningCount}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setFilterType('all')}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                  filterType === 'all'
                    ? 'bg-slate-900 text-white font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>Semua Jadwal</span>
                <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                  filterType === 'all' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-700'
                }`}>
                  {metrics.total}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setFilterType('completed')}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                  filterType === 'completed'
                    ? 'bg-emerald-600 text-white font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>Selesai Tepat Waktu</span>
                <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                  filterType === 'completed' ? 'bg-emerald-700 text-white' : 'bg-slate-100 text-slate-700'
                }`}>
                  {metrics.completedCount}
                </span>
              </button>
            </div>

            {/* Filter by Komponen & Search */}
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari indikator atau PIC..."
                  className="pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-amber-500 w-44 sm:w-56"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>

              <select
                value={selectedKomponenFilter}
                onChange={(e) => setSelectedKomponenFilter(e.target.value)}
                className="py-1.5 px-2.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer"
              >
                <option value="all">Semua Komponen</option>
                {komponenList.map(k => (
                  <option key={k.id} value={k.id}>{k.kode} (Bobot {k.bobot}%)</option>
                ))}
              </select>

              <button
                type="button"
                onClick={handleResetDefaults}
                title="Reset jadwal default BAN-PDM"
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-lg transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* List of Notification Items */}
          <div className="divide-y divide-slate-100 max-h-[460px] overflow-y-auto">
            {filteredAlerts.length === 0 ? (
              <div className="p-12 text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
                <h3 className="text-sm font-bold text-slate-800">
                  Tidak Ada Indikator dalam Kategori Ini
                </h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Semua indikator pada filter terpilih telah terisi atau belum memasuki tanggal peringatan.
                </p>
                {filterType !== 'all' && (
                  <button
                    type="button"
                    onClick={() => setFilterType('all')}
                    className="mt-2 text-xs text-amber-700 font-semibold hover:underline cursor-pointer"
                  >
                    Tampilkan Semua Jadwal Indikator &rarr;
                  </button>
                )}
              </div>
            ) : (
              filteredAlerts.map((item) => (
                <div
                  key={item.indikatorId}
                  className={`p-4 sm:p-5 transition-colors hover:bg-slate-50/80 flex flex-col sm:flex-row sm:items-start justify-between gap-4 ${
                    item.urgency === 'critical' ? 'bg-rose-50/20' : item.urgency === 'warning' ? 'bg-amber-50/15' : ''
                  }`}
                >
                  {/* Left Column: Urgency Badge & Indicator Details */}
                  <div className="space-y-2 flex-1 min-w-0">
                    {/* Meta Row: Unboxed clean metadata (Zero-Pill discipline compliant) */}
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                      {/* Urgency Badge */}
                      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-bold font-mono border ${item.badgeStyle.bg} ${item.badgeStyle.text} ${item.badgeStyle.border}`}>
                        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: item.badgeStyle.dotColor }} />
                        <span>{item.urgencyLabel}</span>
                      </span>

                      <span aria-hidden="true" className="text-slate-300">&middot;</span>
                      
                      <span className="font-semibold text-slate-800">
                        {item.komponenKode} ({item.butirKode})
                      </span>

                      <span aria-hidden="true" className="text-slate-300">&middot;</span>

                      <span className="flex items-center gap-1 text-slate-600 font-mono text-[11px]">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        <span>Jatuh Tempo: <strong>{item.formattedDate}</strong></span>
                      </span>

                      <span aria-hidden="true" className="text-slate-300">&middot;</span>

                      <span className="flex items-center gap-1 text-slate-600 text-[11px]">
                        <User className="w-3 h-3 text-slate-400" />
                        <span>PIC: <strong>{item.penanggungJawab}</strong></span>
                      </span>
                    </div>

                    {/* Indicator Title */}
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 leading-snug">
                        <span className="font-mono text-[#0084FF] mr-1.5">[{item.kodeIndikator}]</span>
                        {item.namaIndikator}
                      </h4>
                      <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">
                        Fokus: {item.catatanTarget}
                      </p>
                    </div>

                    {/* Sub-status: Progress Dokumen & Verifikasi */}
                    <div className="flex flex-wrap items-center gap-3 pt-1 text-xs">
                      {/* Status Verifikasi */}
                      <div className="flex items-center gap-1 text-slate-600">
                        <span className="text-slate-400">Status:</span>
                        <strong className={`font-medium ${
                          item.statusVerifikasi === 'Terverifikasi Valid'
                            ? 'text-emerald-700'
                            : item.statusVerifikasi === 'Perlu Perbaikan'
                            ? 'text-amber-700'
                            : 'text-slate-700'
                        }`}>
                          {item.statusVerifikasi}
                        </strong>
                      </div>

                      <span aria-hidden="true" className="text-slate-300">&middot;</span>

                      {/* Dokumen Pemenuhan */}
                      <div className="flex items-center gap-1 text-slate-600 font-mono text-xs">
                        <FileCheck2 className="w-3.5 h-3.5 text-slate-400" />
                        <span>
                          Bukti Fisik: <strong>{item.tersediaBukti}/{item.totalBukti}</strong> ({item.persentaseBukti}%)
                        </span>
                        {item.kekuranganBukti > 0 && (
                          <span className="text-rose-600 font-semibold ml-1">
                            ({item.kekuranganBukti} Berkas Kurang)
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Actions */}
                  <div className="flex items-center sm:flex-col gap-2 shrink-0 self-end sm:self-center">
                    <button
                      type="button"
                      onClick={() => onSelectIndikator?.(item.komponenId, item.indikatorId)}
                      className={`px-3 py-1.5 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer whitespace-nowrap ${
                        item.isCompleted
                          ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                          : item.urgency === 'critical' || item.urgency === 'overdue'
                          ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-200'
                          : 'bg-amber-600 hover:bg-amber-700 text-white shadow-amber-200'
                      }`}
                    >
                      <span>{item.isCompleted ? 'Lihat Bukti' : 'Lengkapi Sekarang'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleOpenEdit(item)}
                      className="px-2.5 py-1 text-[11px] font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <Edit3 className="w-3 h-3 text-slate-400" />
                      <span>Atur Tenggat</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Summary Strip */}
          <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>
                Tenggat Terdekat: <strong>{metrics.nearestDeadlineDate || '31 Okt 2026'}</strong>
                {metrics.nearestDeadlineDays !== null && (
                  <span className="font-mono text-slate-700 ml-1">
                    ({metrics.nearestDeadlineDays <= 0 ? 'Hari Ini / Terlambat' : `Sisa ${metrics.nearestDeadlineDays} Hari`})
                  </span>
                )}
              </span>
            </div>

            <div className="text-slate-400 text-[11px]">
              Klik <strong>Lengkapi Sekarang</strong> untuk langsung membuka formulir pengisian &amp; upload bukti fisik terkait.
            </div>
          </div>
        </>
      )}

      {/* Modal Edit Tanggal Jatuh Tempo & Penanggung Jawab */}
      {editingAlert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-100 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-amber-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  Atur Jadwal &amp; PIC Indikator
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingAlert(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1 bg-slate-50 p-3 rounded-xl border border-slate-100">
              <div className="text-xs font-mono font-bold text-[#0084FF]">
                {editingAlert.kodeIndikator} · {editingAlert.komponenNama}
              </div>
              <div className="text-xs font-semibold text-slate-800 line-clamp-2">
                {editingAlert.namaIndikator}
              </div>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Tanggal Batas Waktu (Jatuh Tempo):
                </label>
                <input
                  type="date"
                  required
                  value={editDate}
                  onChange={(e) => setEditDate(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Penanggung Jawab (PIC Asesi):
                </label>
                <select
                  value={editPic}
                  onChange={(e) => setEditPic(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-500 bg-white"
                >
                  <option value="">Pilih dari Tim Asesi Sekolah...</option>
                  {DEFAULT_TEAM_USERS.map((u) => (
                    <option key={u.id} value={u.name}>
                      {u.name} ({u.title})
                    </option>
                  ))}
                  <option value="Tim Asesi Sekolah">Tim Asesi Sekolah (Kolektif)</option>
                </select>
                <input
                  type="text"
                  placeholder="Atau ketik nama PIC lain..."
                  value={editPic}
                  onChange={(e) => setEditPic(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-500 mt-1.5"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Tingkat Prioritas:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Tinggi', 'Sedang', 'Normal'] as const).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setEditPrioritas(p)}
                      className={`py-1.5 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                        editPrioritas === p
                          ? p === 'Tinggi'
                            ? 'bg-rose-50 border-rose-300 text-rose-800'
                            : p === 'Sedang'
                            ? 'bg-amber-50 border-amber-300 text-amber-800'
                            : 'bg-blue-50 border-blue-300 text-blue-800'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Catatan Target / Milestone:
                </label>
                <textarea
                  rows={2}
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  placeholder="Catatan dokumen yang harus disiapkan sebelum tanggal jatuh tempo..."
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingAlert(null)}
                  className="px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Simpan Jadwal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

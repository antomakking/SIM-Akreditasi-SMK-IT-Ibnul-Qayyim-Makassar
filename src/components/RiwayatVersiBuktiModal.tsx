import React, { useState, useEffect } from 'react';
import { BuktiFisik, BuktiVersion, StatusBuktiFisik, UserProfile } from '../types/akreditasi';
import { 
  getVersionsForBukti, 
  recordBuktiVersion, 
  revertToVersion, 
  formatVersionTimestamp,
  generateNextVersionTag
} from '../services/versionHistoryService';
import { 
  History, 
  X, 
  Plus, 
  FileText, 
  Clock, 
  User, 
  CheckCircle2, 
  Hourglass, 
  XCircle, 
  ArrowRight, 
  RotateCcw, 
  ExternalLink, 
  UploadCloud, 
  Sparkles, 
  ShieldCheck,
  Calendar,
  Layers,
  Search,
  Check
} from 'lucide-react';

interface RiwayatVersiBuktiModalProps {
  isOpen: boolean;
  onClose: () => void;
  buktiFisik: BuktiFisik | null;
  indikatorKode?: string;
  indikatorNama?: string;
  currentStatus: StatusBuktiFisik;
  currentUser: UserProfile;
  onStatusUpdated?: (buktiId: string, newStatus: StatusBuktiFisik) => void;
}

export function RiwayatVersiBuktiModal({
  isOpen,
  onClose,
  buktiFisik,
  indikatorKode = '',
  indikatorNama = '',
  currentStatus,
  currentUser,
  onStatusUpdated
}: RiwayatVersiBuktiModalProps) {
  const [versions, setVersions] = useState<BuktiVersion[]>([]);
  const [activeTab, setActiveTab] = useState<'timeline' | 'add_version'>('timeline');
  const [searchQuery, setSearchQuery] = useState('');
  const [revertingId, setRevertingId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form states for adding a new version
  const [formStatus, setFormStatus] = useState<StatusBuktiFisik>(currentStatus);
  const [formSummary, setFormSummary] = useState('');
  const [formFileName, setFormFileName] = useState('');
  const [formFileUrl, setFormFileUrl] = useState('');
  const [formFileSize, setFormFileSize] = useState('2.4 MB');
  const [versionType, setVersionType] = useState<'minor' | 'major'>('minor');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load versions whenever modal opens or buktiFisik changes
  useEffect(() => {
    if (isOpen && buktiFisik) {
      const data = getVersionsForBukti(buktiFisik.id);
      setVersions(data);
      setFormStatus(currentStatus);
      setFormSummary('');
      setFormFileName('');
      setFormFileUrl('');
      setSearchQuery('');
      setActiveTab('timeline');
    }
  }, [isOpen, buktiFisik, currentStatus]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  if (!isOpen || !buktiFisik) return null;

  const filteredVersions = versions.filter((v) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      v.version_tag.toLowerCase().includes(q) ||
      v.change_summary.toLowerCase().includes(q) ||
      v.user_name.toLowerCase().includes(q) ||
      (v.file_name && v.file_name.toLowerCase().includes(q)) ||
      v.status.toLowerCase().includes(q)
    );
  });

  const latestVersion = versions[0];
  const firstVersion = versions[versions.length - 1];

  const handleCreateNewVersion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!buktiFisik) return;

    if (!formSummary.trim()) {
      showToast('⚠️ Mohon isi ringkasan catatan revisi atau perubahan dokumen.');
      return;
    }

    setIsSubmitting(true);

    try {
      const nextTag = generateNextVersionTag(versions, versionType === 'major');
      
      const newEntry = recordBuktiVersion({
        bukti_id: buktiFisik.id,
        indikator_id: buktiFisik.indikator_id,
        indikator_kode: indikatorKode,
        status: formStatus,
        previous_status: latestVersion?.status || currentStatus,
        file_name: formFileName.trim() || undefined,
        file_url: formFileUrl.trim() || undefined,
        file_size: formFileName.trim() ? formFileSize : undefined,
        change_summary: formSummary.trim(),
        custom_version_tag: nextTag,
        user: currentUser
      });

      // Refresh versions
      const updatedVersions = getVersionsForBukti(buktiFisik.id);
      setVersions(updatedVersions);

      // Notify parent if status changed
      if (onStatusUpdated && formStatus !== currentStatus) {
        onStatusUpdated(buktiFisik.id, formStatus);
      }

      showToast(`✅ Versi baru ${newEntry.version_tag} berhasil ditambahkan ke riwayat!`);
      setActiveTab('timeline');
      setFormSummary('');
      setFormFileName('');
      setFormFileUrl('');
    } catch (err: any) {
      showToast(`❌ Gagal menyimpan versi: ${err?.message || 'Terjadi kesalahan'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRevert = (targetVersion: BuktiVersion) => {
    if (!buktiFisik) return;

    const confirmed = window.confirm(
      `Apakah Anda yakin ingin mengembalikan status dokumen ke versi "${targetVersion.version_tag}" (${targetVersion.status})? Tindakan ini akan menambahkan entri riwayat pemulihan baru.`
    );

    if (!confirmed) return;

    setRevertingId(targetVersion.id);

    try {
      const res = revertToVersion(targetVersion, currentUser);
      const updatedVersions = getVersionsForBukti(buktiFisik.id);
      setVersions(updatedVersions);

      if (onStatusUpdated && targetVersion.status !== currentStatus) {
        onStatusUpdated(buktiFisik.id, targetVersion.status);
      }

      showToast(`🔄 Berhasil memulihkan dokumen ke versi ${targetVersion.version_tag}!`);
    } catch (err: any) {
      showToast(`❌ Gagal memulihkan versi: ${err?.message || 'Terjadi kesalahan'}`);
    } finally {
      setRevertingId(null);
    }
  };

  const getStatusBadge = (status: StatusBuktiFisik) => {
    switch (status) {
      case 'Tersedia':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Tersedia
          </span>
        );
      case 'Dalam Proses':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
            <Hourglass className="w-3.5 h-3.5 text-amber-600" />
            Dalam Proses
          </span>
        );
      case 'Belum Ada':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-300">
            <XCircle className="w-3.5 h-3.5 text-slate-500" />
            Belum Ada
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 sm:p-6 overflow-y-auto animate-fadeIn">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-60 max-w-md bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl border border-slate-700 text-xs font-medium flex items-center gap-2 animate-slideDown">
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white flex items-start justify-between gap-4 border-b border-slate-700/60">
          <div className="space-y-1.5 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold bg-white/15 px-2.5 py-0.5 rounded-md text-emerald-300 border border-white/10">
                <History className="w-3.5 h-3.5 text-emerald-400" />
                {buktiFisik.kode}
              </span>
              <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider ${
                buktiFisik.wajib ? 'bg-rose-500/30 text-rose-300 border border-rose-400/40' : 'bg-slate-700 text-slate-300'
              }`}>
                {buktiFisik.wajib ? 'Wajib Dikumpulkan' : 'Dokumen Tambahan'}
              </span>
              <span className="text-[11px] text-slate-300 bg-white/10 px-2 py-0.5 rounded">
                Jenis: <strong>{buktiFisik.jenis}</strong>
              </span>
              {indikatorKode && (
                <span className="text-[11px] text-indigo-200 bg-indigo-500/20 border border-indigo-400/30 px-2 py-0.5 rounded">
                  Indikator {indikatorKode}
                </span>
              )}
            </div>

            <h2 className="text-lg sm:text-xl font-extrabold text-white leading-snug">
              {buktiFisik.nama}
            </h2>

            {buktiFisik.deskripsi && (
              <p className="text-xs text-slate-300 line-clamp-2 max-w-3xl">
                {buktiFisik.deskripsi}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-xl transition-colors shrink-0"
            title="Tutup (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Stats Strip */}
        <div className="bg-slate-50 border-b border-slate-200 px-5 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-4 text-slate-600">
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400">Status Saat Ini:</span>
              {getStatusBadge(latestVersion ? latestVersion.status : currentStatus)}
            </div>

            <div className="flex items-center gap-1.5 font-mono text-[11px] text-slate-500">
              <Layers className="w-3.5 h-3.5 text-indigo-500" />
              <span><strong>{versions.length}</strong> Versi Tercatat</span>
            </div>

            {latestVersion && (
              <div className="hidden sm:flex items-center gap-1.5 text-slate-500 text-[11px]">
                <Clock className="w-3.5 h-3.5 text-emerald-600" />
                <span>Terakhir diperbarui: <strong>{formatVersionTimestamp(latestVersion.timestamp).timeAgo}</strong></span>
              </div>
            )}
          </div>

          {/* Tab Navigation buttons */}
          <div className="flex items-center gap-1 bg-slate-200/80 p-1 rounded-lg">
            <button
              type="button"
              onClick={() => setActiveTab('timeline')}
              className={`px-3 py-1 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'timeline'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <History className="w-3.5 h-3.5 text-indigo-600" />
              <span>Linimasa Versi</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('add_version')}
              className={`px-3 py-1 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'add_version'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-emerald-700'
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Catat Revisi / Upload Baru</span>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-6">

          {/* TAB 1: TIMELINE RIWAYAT VERSI */}
          {activeTab === 'timeline' && (
            <div className="space-y-4">
              {/* Search & Filter Header */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="relative w-full sm:w-80">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Cari versi, catatan revisi, penulis..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white"
                  />
                  {searchQuery && (
                    <button 
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
                    >
                      ×
                    </button>
                  )}
                </div>

                <div className="text-[11px] text-slate-500 flex items-center gap-2 self-end sm:self-auto">
                  <span>Asesi & Tim Mutu dapat meninjau kronologi perubahan dokumen dari waktu ke waktu.</span>
                </div>
              </div>

              {/* Timeline List */}
              {filteredVersions.length > 0 ? (
                <div className="relative pl-6 space-y-6 before:absolute before:left-3 before:top-3 before:bottom-3 before:w-0.5 before:bg-gradient-to-b before:from-indigo-500 before:via-emerald-400 before:to-slate-300">
                  {filteredVersions.map((ver, idx) => {
                    const isLatest = idx === 0;
                    const { formattedDate, timeAgo } = formatVersionTimestamp(ver.timestamp);

                    return (
                      <div
                        key={ver.id}
                        className={`relative bg-white rounded-xl border p-4 sm:p-5 transition-all shadow-xs hover:shadow-md ${
                          isLatest
                            ? 'border-indigo-300 ring-2 ring-indigo-50/80 bg-gradient-to-br from-white to-indigo-50/20'
                            : 'border-slate-200'
                        }`}
                      >
                        {/* Timeline node dot */}
                        <div className={`absolute -left-[31px] top-5 w-4 h-4 rounded-full border-2 border-white flex items-center justify-center shadow-xs ${
                          isLatest 
                            ? 'bg-indigo-600 ring-4 ring-indigo-100' 
                            : ver.status === 'Tersedia' 
                            ? 'bg-emerald-500' 
                            : ver.status === 'Dalam Proses'
                            ? 'bg-amber-500'
                            : 'bg-slate-400'
                        }`} />

                        {/* Card Header: Version Tag, Timestamp, Status Transition */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className={`font-mono text-xs font-extrabold px-2.5 py-0.5 rounded-md ${
                              isLatest
                                ? 'bg-indigo-600 text-white shadow-xs'
                                : 'bg-slate-800 text-slate-100'
                            }`}>
                              {ver.version_tag}
                            </span>

                            {isLatest && (
                              <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                                <Sparkles className="w-3 h-3 text-indigo-600" />
                                Versi Aktif
                              </span>
                            )}

                            {/* Status Change Transition */}
                            <div className="flex items-center gap-1 text-xs">
                              {ver.previous_status && ver.previous_status !== ver.status ? (
                                <div className="flex items-center gap-1">
                                  {getStatusBadge(ver.previous_status)}
                                  <ArrowRight className="w-3 h-3 text-slate-400" />
                                  {getStatusBadge(ver.status)}
                                </div>
                              ) : (
                                getStatusBadge(ver.status)
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-2 text-right text-[11px] text-slate-400">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                            <span>{formattedDate}</span>
                            <span className="text-slate-300">·</span>
                            <span className="font-semibold text-slate-500">{timeAgo}</span>
                          </div>
                        </div>

                        {/* Card Body: Summary Note & User Details */}
                        <div className="pt-3 space-y-3">
                          <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-normal">
                            {ver.change_summary}
                          </p>

                          {/* File Attachment Pill (if attached) */}
                          {ver.file_name && (
                            <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200/80 flex flex-wrap items-center justify-between gap-2 text-xs">
                              <div className="flex items-center gap-2 truncate max-w-lg">
                                <div className="p-1.5 bg-indigo-100 text-indigo-700 rounded-md shrink-0">
                                  <FileText className="w-4 h-4" />
                                </div>
                                <div className="truncate">
                                  <span className="font-semibold text-slate-800 truncate block">
                                    {ver.file_name}
                                  </span>
                                  {ver.file_size && (
                                    <span className="text-[10px] text-slate-400 font-mono">
                                      Ukuran: {ver.file_size}
                                    </span>
                                  )}
                                </div>
                              </div>

                              {ver.file_url ? (
                                <a
                                  href={ver.file_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-700 bg-white hover:bg-indigo-50 px-2.5 py-1 rounded border border-indigo-200 transition-colors"
                                >
                                  <ExternalLink className="w-3 h-3" />
                                  <span>Buka Dokumen</span>
                                </a>
                              ) : (
                                <span className="text-[10px] text-slate-400 italic">
                                  Tersimpan di Arsip Akreditasi
                                </span>
                              )}
                            </div>
                          )}

                          {/* Footer: User Identity & Action (Rollback / Restore) */}
                          <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs border-t border-slate-100/70">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 font-bold text-[10px] flex items-center justify-center">
                                {ver.user_name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                              </div>
                              <div>
                                <span className="font-bold text-slate-700">{ver.user_name}</span>
                                <span className="text-[11px] text-slate-400 ml-1.5">({ver.user_role})</span>
                              </div>
                            </div>

                            {/* Revert / Restore Button (hanya tampil jika bukan versi paling baru) */}
                            {!isLatest && (
                              <button
                                type="button"
                                disabled={revertingId === ver.id}
                                onClick={() => handleRevert(ver)}
                                className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-600 hover:text-indigo-700 bg-slate-100 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 px-2.5 py-1 rounded-md transition-all self-end sm:self-auto cursor-pointer"
                                title="Kembalikan status dan dokumen ke versi ini"
                              >
                                <RotateCcw className="w-3 h-3" />
                                <span>{revertingId === ver.id ? 'Memulihkan...' : `Pulihkan ke ${ver.version_tag}`}</span>
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-300 p-6 space-y-3">
                  <History className="w-8 h-8 text-slate-400 mx-auto" />
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-slate-700">
                      {searchQuery ? 'Tidak ditemukan riwayat yang sesuai pencarian' : 'Belum ada riwayat revisi tercatat'}
                    </p>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto">
                      {searchQuery 
                        ? 'Coba ubah kata kunci pencarian Anda.' 
                        : 'Klik tombol "Catat Revisi / Upload Baru" di atas untuk menambahkan versi pertama dokumen ini.'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: UNGGAH REVISI / TAMBAH VERSI BARU */}
          {activeTab === 'add_version' && (
            <form onSubmit={handleCreateNewVersion} className="space-y-5">
              <div className="bg-indigo-50/60 p-4 rounded-xl border border-indigo-100 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                <div className="text-xs text-indigo-950 space-y-1">
                  <p className="font-bold">Form Pencatatan Revisi & Pembaruan Status Dokumen Bukti Fisik</p>
                  <p className="text-indigo-800 leading-relaxed">
                    Setiap perubahan berkas atau status ketersediaan akan tercatat secara permanen dalam audit trail akreditasi SMK IT Ibnul Qayyim Makassar atas nama Anda (<strong>{currentUser.name}</strong>).
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 1. Status Bukti Fisik */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">
                    Status Ketersediaan Dokumen Baru:
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setFormStatus('Tersedia')}
                      className={`py-2 px-2 text-xs font-bold rounded-lg border flex flex-col items-center gap-1 transition-all ${
                        formStatus === 'Tersedia'
                          ? 'bg-emerald-50 border-emerald-500 text-emerald-800 ring-2 ring-emerald-200'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Tersedia</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setFormStatus('Dalam Proses')}
                      className={`py-2 px-2 text-xs font-bold rounded-lg border flex flex-col items-center gap-1 transition-all ${
                        formStatus === 'Dalam Proses'
                          ? 'bg-amber-50 border-amber-500 text-amber-800 ring-2 ring-amber-200'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <Hourglass className="w-4 h-4 text-amber-600" />
                      <span>Dalam Proses</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setFormStatus('Belum Ada')}
                      className={`py-2 px-2 text-xs font-bold rounded-lg border flex flex-col items-center gap-1 transition-all ${
                        formStatus === 'Belum Ada'
                          ? 'bg-slate-100 border-slate-500 text-slate-800 ring-2 ring-slate-200'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <XCircle className="w-4 h-4 text-slate-500" />
                      <span>Belum Ada</span>
                    </button>
                  </div>
                </div>

                {/* 2. Tingkat Revisi (Minor vs Major) */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">
                    Jenis Pembaharuan Versi:
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setVersionType('minor')}
                      className={`p-2.5 text-xs text-left rounded-lg border transition-all ${
                        versionType === 'minor'
                          ? 'bg-indigo-50 border-indigo-500 text-indigo-900 ring-2 ring-indigo-200'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <div className="font-bold flex items-center justify-between">
                        <span>Revisi Minor</span>
                        <span className="font-mono text-[11px] text-indigo-600">
                          {generateNextVersionTag(versions, false)}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500 mt-0.5">Perbaikan berkas, kelengkapan foto/lampiran</p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setVersionType('major')}
                      className={`p-2.5 text-xs text-left rounded-lg border transition-all ${
                        versionType === 'major'
                          ? 'bg-emerald-50 border-emerald-500 text-emerald-900 ring-2 ring-emerald-200'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <div className="font-bold flex items-center justify-between">
                        <span>Rilis Mayor</span>
                        <span className="font-mono text-[11px] text-emerald-600">
                          {generateNextVersionTag(versions, true)}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500 mt-0.5">Pengesahan dokumen resmi, validasi akhir</p>
                    </button>
                  </div>
                </div>
              </div>

              {/* 3. Catatan Perubahan & Ringkasan Revisi */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                  <span>Catatan Perubahan / Deskripsi Revisi: *</span>
                  <span className="text-[10px] text-slate-400 font-normal">Wajib diisi</span>
                </label>
                <textarea
                  rows={3}
                  required
                  value={formSummary}
                  onChange={(e) => setFormSummary(e.target.value)}
                  placeholder="Contoh: Mengunggah pembaruan SK Pembagian Tugas TP 2025/2026 yang telah ditandatangani Kepala Sekolah dan dilengkapi daftar hadir rapat kurikulum..."
                  className="w-full p-3 text-xs bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 leading-relaxed"
                />
              </div>

              {/* 4. Berkas / File Lampiran */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                  <UploadCloud className="w-4 h-4 text-emerald-600" />
                  <span>Lampiran Berkas / Tautan Dokumen (Opsional)</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-600 block">
                      Nama Berkas Dokumen:
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. SK_Kurikulum_SMKIT_2025_Final.pdf"
                      value={formFileName}
                      onChange={(e) => setFormFileName(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-600 font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-600 block">
                      Tautan Google Drive / Repositori IT:
                    </label>
                    <input
                      type="url"
                      placeholder="https://drive.google.com/file/d/..."
                      value={formFileUrl}
                      onChange={(e) => setFormFileUrl(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-600 font-mono"
                    />
                  </div>
                </div>

                {formFileName && (
                  <div className="flex items-center gap-2 pt-1 text-[11px] text-slate-500">
                    <span>Estimasi Ukuran:</span>
                    <select
                      value={formFileSize}
                      onChange={(e) => setFormFileSize(e.target.value)}
                      className="px-2 py-0.5 bg-white border border-slate-200 rounded text-xs"
                    >
                      <option value="512 KB">512 KB</option>
                      <option value="1.2 MB">1.2 MB</option>
                      <option value="2.4 MB">2.4 MB</option>
                      <option value="4.8 MB">4.8 MB</option>
                      <option value="8.5 MB">8.5 MB</option>
                      <option value="15 MB">15 MB</option>
                    </select>
                  </div>
                )}
              </div>

              {/* Form Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setActiveTab('timeline')}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                >
                  Batal
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 rounded-xl shadow-xs transition-all flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>{isSubmitting ? 'Menyimpan...' : 'Simpan Versi Baru Dokumen'}</span>
                </button>
              </div>
            </form>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-1.5 font-mono text-[11px]">
            <History className="w-3.5 h-3.5 text-slate-400" />
            <span>Versi ID: {latestVersion?.id || buktiFisik.id}</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg font-bold text-xs transition-colors"
          >
            Tutup Jendela
          </button>
        </div>

      </div>
    </div>
  );
}

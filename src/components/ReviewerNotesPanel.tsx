import React, { useState, useMemo } from 'react';
import { 
  MessageSquare, 
  MessageSquarePlus, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  User, 
  Send, 
  ChevronDown, 
  ChevronUp, 
  X, 
  Pin, 
  CornerDownRight, 
  Shield, 
  Crown, 
  Edit3, 
  Eye, 
  Search, 
  ArrowUpRight,
  Filter,
  Check,
  Trash2
} from 'lucide-react';
import { 
  ReviewerNote, 
  ReviewerNoteCategory, 
  ReviewerNotePriority, 
  ReviewerNoteTarget, 
  ReviewerNoteStatus,
  UserProfile, 
  Komponen, 
  Indikator 
} from '../types/akreditasi';
import { 
  addReviewerNote, 
  addNoteReply, 
  updateNoteStatus, 
  deleteReviewerNote,
  getNotesSummary 
} from '../services/reviewerNotesService';

interface ReviewerNotesPanelProps {
  isOpen: boolean;
  onClose: () => void;
  isPinned: boolean;
  onTogglePin: () => void;
  notes: ReviewerNote[];
  onNotesChange: (notes: ReviewerNote[]) => void;
  currentUser: UserProfile;
  komponenList: Komponen[];
  selectedKomponenId: string;
  activeIndikatorId?: string | null;
  onSelectIndikator?: (indikatorId: string) => void;
}

export const ReviewerNotesPanel: React.FC<ReviewerNotesPanelProps> = ({
  isOpen,
  onClose,
  isPinned,
  onTogglePin,
  notes,
  onNotesChange,
  currentUser,
  komponenList,
  selectedKomponenId,
  activeIndikatorId,
  onSelectIndikator
}) => {
  // Filters
  const [filterAudience, setFilterAudience] = useState<'semua' | ReviewerNoteTarget>('semua');
  const [filterStatus, setFilterStatus] = useState<'semua' | 'unresolved' | 'terbuka' | 'proses' | 'selesai'>('unresolved');
  const [filterIndikatorOnly, setFilterIndikatorOnly] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // New Note Form State
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [targetAudience, setTargetAudience] = useState<ReviewerNoteTarget>('admin');
  const [category, setCategory] = useState<ReviewerNoteCategory>('catatan_admin');
  const [priority, setPriority] = useState<ReviewerNotePriority>('tinggi');
  const [selectedIndId, setSelectedIndId] = useState<string>(activeIndikatorId || '');
  const [message, setMessage] = useState<string>('');

  // Reply State
  const [replyOpenMap, setReplyOpenMap] = useState<Record<string, boolean>>({});
  const [replyInputMap, setReplyInputMap] = useState<Record<string, string>>({});

  // Active Komponen & Indikator List
  const currentKomponen = useMemo(() => {
    return komponenList.find(k => k.id === selectedKomponenId);
  }, [komponenList, selectedKomponenId]);

  const currentIndikatorsList = useMemo(() => {
    if (!currentKomponen?.butir) return [];
    const list: Indikator[] = [];
    currentKomponen.butir.forEach(b => {
      if (b.indikator) list.push(...b.indikator);
    });
    return list;
  }, [currentKomponen]);

  const activeIndikator = useMemo(() => {
    if (!activeIndikatorId) return null;
    return currentIndikatorsList.find(ind => ind.id === activeIndikatorId);
  }, [currentIndikatorsList, activeIndikatorId]);

  // Sync default form selected indikator when active indicator changes
  React.useEffect(() => {
    if (activeIndikatorId) {
      setSelectedIndId(activeIndikatorId);
    }
  }, [activeIndikatorId]);

  // Summary Metrics
  const summary = useMemo(() => {
    return getNotesSummary(notes, selectedKomponenId, filterIndikatorOnly && activeIndikatorId ? activeIndikatorId : undefined);
  }, [notes, selectedKomponenId, filterIndikatorOnly, activeIndikatorId]);

  // Filtered Notes
  const filteredNotes = useMemo(() => {
    return notes.filter(n => {
      // Must match current Komponen or be marked for this Komponen
      if (n.komponen_id !== selectedKomponenId) return false;

      // Filter Indikator Aktif
      if (filterIndikatorOnly && activeIndikatorId) {
        if (n.indikator_id !== activeIndikatorId) return false;
      }

      // Filter Audience
      if (filterAudience !== 'semua' && n.target_audience !== filterAudience) {
        return false;
      }

      // Filter Status
      if (filterStatus === 'unresolved' && n.status === 'selesai') return false;
      if (filterStatus === 'terbuka' && n.status !== 'terbuka') return false;
      if (filterStatus === 'proses' && n.status !== 'proses') return false;
      if (filterStatus === 'selesai' && n.status !== 'selesai') return false;

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchText = 
          n.message.toLowerCase().includes(q) ||
          n.author_name.toLowerCase().includes(q) ||
          (n.indikator_kode && n.indikator_kode.toLowerCase().includes(q)) ||
          (n.replies && n.replies.some(r => r.message.toLowerCase().includes(q) || r.author_name.toLowerCase().includes(q)));
        if (!matchText) return false;
      }

      return true;
    });
  }, [notes, selectedKomponenId, filterIndikatorOnly, activeIndikatorId, filterAudience, filterStatus, searchQuery]);

  // Handle Form Submit
  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    let targetKode: string | undefined = undefined;
    if (selectedIndId) {
      const found = currentIndikatorsList.find(ind => ind.id === selectedIndId);
      targetKode = found?.kode;
    }

    const created = addReviewerNote(
      {
        komponen_id: selectedKomponenId,
        indikator_id: selectedIndId || undefined,
        indikator_kode: targetKode,
        target_audience: targetAudience,
        category: category,
        priority: priority,
        message: message.trim()
      },
      currentUser
    );

    onNotesChange([created, ...notes]);
    setMessage('');
    setIsFormOpen(false);
  };

  // Handle Reply Submit
  const handleSendReply = (noteId: string) => {
    const text = replyInputMap[noteId]?.trim();
    if (!text) return;

    const updated = addNoteReply(noteId, text, currentUser);
    if (updated) {
      const newNotes = notes.map(n => (n.id === noteId ? updated : n));
      onNotesChange(newNotes);
      setReplyInputMap(prev => ({ ...prev, [noteId]: '' }));
    }
  };

  // Handle Status Toggle
  const handleStatusChange = (noteId: string, newStatus: ReviewerNoteStatus) => {
    const updated = updateNoteStatus(noteId, newStatus, currentUser);
    if (updated) {
      const newNotes = notes.map(n => (n.id === noteId ? updated : n));
      onNotesChange(newNotes);
    }
  };

  // Handle Delete
  const handleDelete = (noteId: string) => {
    if (window.confirm('Hapus catatan reviewer ini?')) {
      deleteReviewerNote(noteId);
      onNotesChange(notes.filter(n => n.id !== noteId));
    }
  };

  // Helper for quick suggestion chips
  const applyQuickTemplate = (tpl: string) => {
    setMessage(prev => (prev ? `${prev} ${tpl}` : tpl));
  };

  if (!isOpen) return null;

  return (
    <>
      {!isPinned && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 transition-opacity animate-fadeIn"
          aria-hidden="true"
        />
      )}
      <aside
        className={`bg-white border-l border-slate-200 flex flex-col transition-all duration-300 shadow-2xl ${
          isPinned
            ? 'w-full lg:w-96 xl:w-[420px] shrink-0 sticky top-20 h-[calc(100vh-5.5rem)] rounded-2xl border z-30'
            : 'fixed top-0 right-0 bottom-0 w-full sm:w-[460px] md:w-[480px] h-full shadow-2xl z-50'
        }`}
        aria-label="Panel Catatan Reviewer"
      >
      {/* 1. Header Bar */}
      <div className="p-4 sm:p-5 border-b border-slate-100 bg-linear-to-r from-slate-900 via-slate-800 to-indigo-950 text-white shrink-0">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-400/20 border border-amber-300/30 flex items-center justify-center text-amber-300 shrink-0">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm sm:text-base text-white tracking-tight">
                  Catatan Reviewer
                </h3>
                <span className="text-[10px] font-semibold bg-amber-400 text-slate-950 px-2 py-0.5 rounded-full shadow-xs">
                  Kolaborasi
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5 line-clamp-1">
                {currentKomponen?.kode}: {currentKomponen?.nama}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={onTogglePin}
              title={isPinned ? 'Lepas dock (mode floating drawer)' : 'Sematkan ke samping (Dock pinned)'}
              className={`p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors hidden lg:inline-flex ${
                isPinned ? 'bg-white/20 text-white' : ''
              }`}
            >
              <Pin className={`w-4 h-4 ${isPinned ? 'rotate-45 text-amber-300' : ''}`} />
            </button>
            <button
              type="button"
              onClick={onClose}
              title="Tutup Panel"
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Counter Summary Pills */}
        <div className="flex items-center gap-2 mt-3 text-xs overflow-x-auto pb-1 scrollbar-none">
          <span className="inline-flex items-center gap-1 bg-white/10 text-slate-200 border border-white/10 px-2 py-0.5 rounded-md text-[11px] font-medium whitespace-nowrap">
            Total: <strong className="text-white font-bold">{summary.total}</strong>
          </span>
          <span className="inline-flex items-center gap-1 bg-amber-400/20 text-amber-200 border border-amber-300/30 px-2 py-0.5 rounded-md text-[11px] font-medium whitespace-nowrap">
            <Clock className="w-3 h-3 text-amber-300" />
            Perlu Tindak Lanjut: <strong className="text-white font-bold">{summary.unresolved}</strong>
          </span>
          {summary.untukAdmin > 0 && (
            <span className="inline-flex items-center gap-1 bg-rose-500/20 text-rose-200 border border-rose-300/30 px-2 py-0.5 rounded-md text-[11px] font-medium whitespace-nowrap">
              <Crown className="w-3 h-3 text-rose-300" />
              Untuk Admin: <strong className="text-white font-bold">{summary.untukAdmin}</strong>
            </span>
          )}
        </div>
      </div>

      {/* 2. Action Strip: Tulis Catatan Baru + Filter */}
      <div className="p-3.5 bg-slate-50 border-b border-slate-200 shrink-0 space-y-2.5">
        <div className="flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => setIsFormOpen(!isFormOpen)}
            className={`w-full inline-flex items-center justify-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl shadow-xs transition-all ${
              isFormOpen
                ? 'bg-slate-200 text-slate-800 hover:bg-slate-300'
                : 'bg-emerald-700 hover:bg-emerald-800 text-white'
            }`}
          >
            {isFormOpen ? (
              <>
                <ChevronUp className="w-3.5 h-3.5" />
                <span>Tutup Form Penulisan</span>
              </>
            ) : (
              <>
                <MessageSquarePlus className="w-3.5 h-3.5" />
                <span>+ Tulis Catatan / Rekomendasi Reviewer</span>
              </>
            )}
          </button>
        </div>

        {/* Filter Toolbar */}
        <div className="space-y-2 pt-1 text-xs">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Cari pesan, penulis, kode butir..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-lg pl-8 pr-7 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-600 focus:border-emerald-600"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {/* Status Pills */}
            <div className="flex items-center bg-white border border-slate-200 rounded-lg p-0.5 text-[11px] font-medium">
              <button
                type="button"
                onClick={() => setFilterStatus('unresolved')}
                className={`px-2 py-0.5 rounded-md transition-colors ${
                  filterStatus === 'unresolved' ? 'bg-amber-100 text-amber-900 font-bold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Aktif ({summary.unresolved})
              </button>
              <button
                type="button"
                onClick={() => setFilterStatus('semua')}
                className={`px-2 py-0.5 rounded-md transition-colors ${
                  filterStatus === 'semua' ? 'bg-slate-200 text-slate-900 font-bold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Semua ({summary.total})
              </button>
              <button
                type="button"
                onClick={() => setFilterStatus('selesai')}
                className={`px-2 py-0.5 rounded-md transition-colors ${
                  filterStatus === 'selesai' ? 'bg-emerald-100 text-emerald-900 font-bold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Selesai ({summary.selesai})
              </button>
            </div>

            {/* Audience Filter Select */}
            <select
              value={filterAudience}
              onChange={(e) => setFilterAudience(e.target.value as any)}
              className="text-[11px] bg-white border border-slate-200 rounded-lg px-2 py-1 text-slate-700 font-medium focus:outline-none focus:ring-1 focus:ring-emerald-600"
            >
              <option value="semua">Target: Semua Role</option>
              <option value="admin">👑 Untuk Admin</option>
              <option value="asesi">👥 Antar Tim Asesi</option>
              <option value="validator">🔍 Tim Reviewer / Asesor</option>
            </select>

            {/* Indikator Aktif Toggle */}
            {activeIndikator && (
              <button
                type="button"
                onClick={() => setFilterIndikatorOnly(!filterIndikatorOnly)}
                className={`inline-flex items-center gap-1 text-[11px] px-2 py-1 rounded-lg border font-medium transition-colors ${
                  filterIndikatorOnly
                    ? 'bg-indigo-50 text-indigo-800 border-indigo-200 font-bold'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <span>Hanya {activeIndikator.kode}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 3. New Note Form Collapse */}
      {isFormOpen && (
        <form
          onSubmit={handleAddNote}
          className="p-4 bg-slate-50 border-b border-slate-200 shrink-0 space-y-3 animate-fadeIn"
        >
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-900 flex items-center gap-1.5">
              <Edit3 className="w-3.5 h-3.5 text-emerald-600" />
              Tulis Catatan / Kolaborasi Baru
            </span>
            <span className="text-[11px] text-slate-500">
              Sebagai: <strong className="font-semibold text-slate-700">{currentUser.name}</strong> ({currentUser.role})
            </span>
          </div>

          {/* Form Fields: Indikator & Target Role */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Terkait Indikator:
              </label>
              <select
                value={selectedIndId}
                onChange={(e) => setSelectedIndId(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-600"
              >
                <option value="">Umum (Seluruh Komponen Ini)</option>
                {currentIndikatorsList.map(ind => (
                  <option key={ind.id} value={ind.id}>
                    {ind.kode} - {ind.nama.slice(0, 32)}...
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Ditujukan Kepada:
              </label>
              <select
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value as ReviewerNoteTarget)}
                className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-600 font-medium"
              >
                <option value="admin">👑 Untuk Admin (Kepsek / Manajemen)</option>
                <option value="asesi">👥 Kolaborasi Antar Tim Asesi</option>
                <option value="validator">🔍 Masukan untuk Reviewer / Auditor</option>
                <option value="semua">🌐 Semua Anggota Tim</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Kategori Catatan:
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ReviewerNoteCategory)}
                className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-600"
              >
                <option value="catatan_admin">Catatan Kebijakan / Admin</option>
                <option value="reviu_dokumen">Reviu Kelayakan Dokumen</option>
                <option value="diskusi_asesi">Diskusi Internal Asesi</option>
                <option value="tindak_lanjut">Tindak Lanjut Perbaikan</option>
                <option value="umum">Informasi Umum</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Tingkat Urgensi / Prioritas:
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as ReviewerNotePriority)}
                className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-600 font-semibold"
              >
                <option value="tinggi">🔴 Tinggi (Mendesak / Butuh SK / Capaian Utama)</option>
                <option value="sedang">🟠 Sedang (Kelengkapan Lampiran)</option>
                <option value="normal">🔵 Normal (Koordinasi Rutin)</option>
              </select>
            </div>
          </div>

          {/* Quick template suggestions */}
          <div>
            <span className="block text-[10px] text-slate-500 mb-1">
              Templat Cepat Catatan:
            </span>
            <div className="flex flex-wrap gap-1">
              {[
                '@Admin: Mohon tandatangan & stempel basah SK',
                '@Asesi: Dokumen lampiran MoU mohon disinkronkan',
                '@Validator: Berkas bukti revisi telah diperbarui di Drive',
                '@Sarpras: Foto sarana praktikum lab IT belum lengkap'
              ].map((tpl, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => applyQuickTemplate(tpl)}
                  className="text-[10px] bg-white border border-slate-200 hover:border-slate-300 text-slate-700 px-2 py-0.5 rounded-md hover:bg-slate-100 transition-colors"
                >
                  {tpl}
                </button>
              ))}
            </div>
          </div>

          <div>
            <textarea
              required
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tuliskan uraian catatan reviewer, rekomendasi perbaikan, atau instruksi untuk admin..."
              className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-600 focus:border-emerald-600 resize-none leading-relaxed"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-800 font-medium rounded-lg"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={!message.trim()}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Kirim Catatan</span>
            </button>
          </div>
        </form>
      )}

      {/* 4. Notes List (Scrollable Area) */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
        {filteredNotes.length === 0 ? (
          <div className="text-center py-12 px-4 space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-slate-800">
              Tidak Ada Catatan Reviewer
            </h4>
            <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
              {searchQuery || filterStatus !== 'semua' || filterAudience !== 'semua'
                ? 'Tidak ditemukan catatan yang cocok dengan filter yang dipilih. Coba sesuaikan filter atau reset pencarian.'
                : 'Belum ada catatan kolaborasi untuk komponen ini. Klik "+ Tulis Catatan Baru" untuk memulai koordinasi antar asesi atau catatan untuk admin.'}
            </p>
            {(searchQuery || filterStatus !== 'semua' || filterAudience !== 'semua') && (
              <button
                type="button"
                onClick={() => {
                  setFilterStatus('semua');
                  setFilterAudience('semua');
                  setSearchQuery('');
                  setFilterIndikatorOnly(false);
                }}
                className="inline-flex items-center gap-1 text-xs text-emerald-700 font-semibold hover:underline"
              >
                Reset Semua Filter
              </button>
            )}
          </div>
        ) : (
          filteredNotes.map((note) => {
            const isReplying = replyOpenMap[note.id] || false;
            const replies = note.replies || [];
            const canDelete = currentUser.role === 'Admin' || currentUser.name === note.author_name;

            // Role styling
            const roleBadgeClass =
              note.author_role === 'Admin'
                ? 'bg-amber-100 text-amber-800 border-amber-300'
                : note.author_role === 'Validator'
                ? 'bg-purple-100 text-purple-800 border-purple-300'
                : note.author_role === 'Asesi'
                ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                : 'bg-slate-100 text-slate-700 border-slate-300';

            const RoleIcon =
              note.author_role === 'Admin'
                ? Crown
                : note.author_role === 'Validator'
                ? Shield
                : note.author_role === 'Asesi'
                ? Edit3
                : Eye;

            return (
              <div
                key={note.id}
                className={`bg-white rounded-xl border transition-all p-3.5 space-y-2.5 shadow-xs ${
                  note.status === 'selesai'
                    ? 'border-emerald-200 bg-emerald-50/20 opacity-85'
                    : note.priority === 'tinggi'
                    ? 'border-rose-200 bg-rose-50/20'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                {/* Note Top Bar: Badges & Actions */}
                <div className="flex flex-wrap items-center justify-between gap-1.5">
                  <div className="flex flex-wrap items-center gap-1.5">
                    {/* Status Badge */}
                    <span
                      className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        note.status === 'selesai'
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                          : note.status === 'proses'
                          ? 'bg-blue-100 text-blue-800 border-blue-300'
                          : 'bg-amber-100 text-amber-800 border-amber-300'
                      }`}
                    >
                      {note.status === 'selesai' ? (
                        <>
                          <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
                          <span>Selesai</span>
                        </>
                      ) : note.status === 'proses' ? (
                        <>
                          <Clock className="w-2.5 h-2.5 text-blue-600" />
                          <span>Diproses</span>
                        </>
                      ) : (
                        <>
                          <Clock className="w-2.5 h-2.5 text-amber-600" />
                          <span>Terbuka</span>
                        </>
                      )}
                    </span>

                    {/* Priority Badge */}
                    {note.priority === 'tinggi' && (
                      <span className="inline-flex items-center gap-0.5 text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-300 px-1.5 py-0.5 rounded-full">
                        <AlertTriangle className="w-2.5 h-2.5" />
                        <span>Prioritas Tinggi</span>
                      </span>
                    )}

                    {/* Audience Target Pill */}
                    <span className="text-[10px] font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full border border-slate-200">
                      {note.target_audience === 'admin'
                        ? '👑 Untuk Admin'
                        : note.target_audience === 'asesi'
                        ? '👥 Antar Tim Asesi'
                        : note.target_audience === 'validator'
                        ? '🔍 Reviewer/Auditor'
                        : '🌐 Tim Umum'}
                    </span>
                  </div>

                  {/* Indikator Link Badge (Clickable to jump) */}
                  {note.indikator_kode && (
                    <button
                      type="button"
                      onClick={() => {
                        if (note.indikator_id && onSelectIndikator) {
                          onSelectIndikator(note.indikator_id);
                        }
                      }}
                      title="Klik untuk menuju ke butir/indikator ini di evaluasi"
                      className="inline-flex items-center gap-0.5 text-[10px] font-mono font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 px-2 py-0.5 rounded-md transition-colors"
                    >
                      <span>{note.indikator_kode}</span>
                      <ArrowUpRight className="w-2.5 h-2.5" />
                    </button>
                  )}
                </div>

                {/* Author Info */}
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold border ${roleBadgeClass}`}>
                      <RoleIcon className="w-2.5 h-2.5" />
                      <span>{note.author_role}</span>
                    </span>
                    <span className="font-semibold text-slate-900 text-xs">
                      {note.author_name}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400">
                    {new Date(note.created_at).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>

                {/* Note Message */}
                <p className="text-xs text-slate-800 leading-relaxed font-normal whitespace-pre-wrap">
                  {note.message}
                </p>

                {/* Resolution Stamp */}
                {note.status === 'selesai' && note.resolved_by && (
                  <div className="p-2 bg-emerald-50 border border-emerald-200 rounded-lg text-[11px] text-emerald-800 flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-emerald-900">Ditandai Selesai / Ditindaklanjuti</p>
                      <p className="text-[10px] text-emerald-700">
                        Oleh {note.resolved_by} {note.resolved_at ? `pada ${new Date(note.resolved_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}` : ''}
                      </p>
                    </div>
                  </div>
                )}

                {/* Replies Thread */}
                {replies.length > 0 && (
                  <div className="pl-3 border-l-2 border-slate-200 space-y-2 pt-1 text-xs">
                    {replies.map((rep) => {
                      const RepRoleIcon =
                        rep.author_role === 'Admin'
                          ? Crown
                          : rep.author_role === 'Validator'
                          ? Shield
                          : Edit3;

                      return (
                        <div key={rep.id} className="bg-slate-50 rounded-lg p-2 space-y-1 border border-slate-100">
                          <div className="flex items-center justify-between text-[11px]">
                            <div className="flex items-center gap-1">
                              <span className="font-bold text-slate-900">{rep.author_name}</span>
                              <span className="text-[9px] bg-slate-200 text-slate-700 px-1 py-0.2 rounded font-medium">
                                {rep.author_role}
                              </span>
                            </div>
                            <span className="text-[9px] text-slate-400">
                              {new Date(rep.created_at).toLocaleDateString('id-ID', {
                                day: 'numeric',
                                month: 'short',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>
                          <p className="text-xs text-slate-700 leading-relaxed">
                            {rep.message}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Inline Reply Box */}
                {isReplying && (
                  <div className="pt-1.5 space-y-2">
                    <div className="relative">
                      <input
                        type="text"
                        value={replyInputMap[note.id] || ''}
                        onChange={(e) => setReplyInputMap({ ...replyInputMap, [note.id]: e.target.value })}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleSendReply(note.id);
                          }
                        }}
                        placeholder={`Balas sebagai ${currentUser.name} (${currentUser.role})...`}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-3 pr-9 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-600 focus:bg-white"
                      />
                      <button
                        type="button"
                        onClick={() => handleSendReply(note.id)}
                        disabled={!replyInputMap[note.id]?.trim()}
                        className="absolute right-1.5 top-1.5 p-1 rounded-md text-emerald-700 hover:text-emerald-900 disabled:opacity-30"
                      >
                        <Send className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Card Actions Footer */}
                <div className="pt-1 flex items-center justify-between text-xs border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setReplyOpenMap({ ...replyOpenMap, [note.id]: !isReplying })}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-600 hover:text-slate-900 transition-colors"
                    >
                      <CornerDownRight className="w-3 h-3 text-slate-400" />
                      <span>{isReplying ? 'Tutup Balasan' : replies.length > 0 ? `${replies.length} Balasan · Balas` : 'Balas'}</span>
                    </button>

                    {/* Change Status Dropdown */}
                    <div className="flex items-center gap-1">
                      {note.status !== 'selesai' ? (
                        <button
                          type="button"
                          onClick={() => handleStatusChange(note.id, 'selesai')}
                          className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 hover:text-emerald-900 transition-colors"
                        >
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span>Tandai Selesai</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleStatusChange(note.id, 'terbuka')}
                          className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 hover:text-amber-900 transition-colors"
                        >
                          <Clock className="w-3 h-3 text-amber-600" />
                          <span>Buka Kembali</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {canDelete && (
                    <button
                      type="button"
                      onClick={() => handleDelete(note.id)}
                      title="Hapus catatan ini"
                      className="p-1 rounded text-slate-400 hover:text-rose-600 transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* 5. Footer Quick Role Guidance */}
      <div className="p-3 bg-slate-50 border-t border-slate-200 text-[11px] text-slate-500 flex items-center justify-between shrink-0">
        <span className="flex items-center gap-1.5">
          <User className="w-3.5 h-3.5 text-slate-400" />
          <span>Pengguna Aktif: <strong className="font-semibold text-slate-700">{currentUser.name}</strong></span>
        </span>
        <span className="font-mono text-[10px] text-slate-400">
          Sync Real-Time
        </span>
      </div>
    </aside>
    </>
  );
};

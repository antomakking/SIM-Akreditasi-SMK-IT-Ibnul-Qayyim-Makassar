import React, { useState, useEffect, useRef } from 'react';
import { 
  Komponen, 
  EvaluasiAsesi, 
  CapaianRubrik, 
  StatusVerifikasi, 
  StatusBuktiFisik, 
  UserRole, 
  UserProfile, 
  Indikator, 
  BuktiFisik,
  ReviewerNote
} from '../types/akreditasi';
import { 
  saveEvaluasi, 
  saveValidatorReview,
  validateEvaluasiInput, 
  validateBuktiDukungUntukSelesai,
  getCurrentUser, 
  setCurrentUser, 
  DEFAULT_TEAM_USERS, 
  getLogsForIndikator 
} from '../services/evaluasiService';
import { ActivityLogTimeline } from './ActivityLogTimeline';
import { AsistenPintarModal } from './AsistenPintarModal';
import { RiwayatVersiBuktiModal } from './RiwayatVersiBuktiModal';
import { ReviewerNotesPanel } from './ReviewerNotesPanel';
import { InstrumenPrintPreviewModal } from './InstrumenPrintPreviewModal';
import { getStoredReviewerNotes } from '../services/reviewerNotesService';
import { RUBRIK_THEMES, getRubrikThemeByLevel, getRubrikThemeByKategori } from '../utils/rubrikTheme';
import { getVersionsForBukti, recordBuktiVersion } from '../services/versionHistoryService';
import { evaluateIndikatorDeadline } from '../services/deadlineService';
import { 
  Check, 
  AlertCircle, 
  AlertTriangle,
  ExternalLink, 
  Plus, 
  Trash2, 
  Save, 
  Search, 
  Filter, 
  Info, 
  CheckCircle, 
  Clock, 
  History, 
  User, 
  ChevronDown, 
  ChevronUp, 
  CheckCircle2, 
  FileCheck2, 
  Hourglass, 
  HelpCircle, 
  XCircle,
  Zap,
  Loader2,
  RefreshCw,
  Sparkles,
  Maximize2,
  Minimize2,
  FileEdit,
  AlignLeft,
  ListOrdered,
  Layers,
  Shield,
  Crown,
  Edit3,
  Eye,
  Lock,
  MessageSquare,
  Compass,
  Printer
} from 'lucide-react';

interface InstrumenEvaluasiProps {
  komponenList: Komponen[];
  selectedKomponenId: string;
  setSelectedKomponenId: (id: string) => void;
  targetIndikatorId?: string | null;
  setTargetIndikatorId?: (id: string | null) => void;
  evaluasiMap: Record<string, EvaluasiAsesi>;
  onEvaluasiUpdated: (item: EvaluasiAsesi) => void;
  isFocusMode?: boolean;
  setIsFocusMode?: (val: boolean) => void;
  currentUser?: UserProfile;
  onUserChanged?: (user: UserProfile) => void;
  onStartTour?: () => void;
}

export type AutoSaveState = 'idle' | 'pending' | 'saving' | 'saved' | 'error';

export interface AutoSaveInfo {
  state: AutoSaveState;
  lastSaved?: string;
  error?: string;
}

export const InstrumenEvaluasi: React.FC<InstrumenEvaluasiProps> = ({
  komponenList,
  selectedKomponenId,
  setSelectedKomponenId,
  targetIndikatorId,
  setTargetIndikatorId,
  evaluasiMap,
  onEvaluasiUpdated,
  isFocusMode = false,
  setIsFocusMode,
  currentUser: propCurrentUser,
  onUserChanged,
  onStartTour,
}) => {
  const [selectedButirId, setSelectedButirId] = useState<string>('all');
  const [selectedIndikatorId, setSelectedIndikatorId] = useState<string>('all');

  // Auto-focus & scroll ke target indikator jika dipicu dari dashboard alert
  useEffect(() => {
    if (targetIndikatorId) {
      setSelectedIndikatorId(targetIndikatorId);
      const activeKomponen = komponenList.find(k => k.id === selectedKomponenId);
      const parentButir = activeKomponen?.butir?.find(b => b.indikator?.some(ind => ind.id === targetIndikatorId));
      if (parentButir) {
        setSelectedButirId(parentButir.id);
      }
      setTimeout(() => {
        const el = document.getElementById(`indikator-card-${targetIndikatorId}`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          el.classList.add('ring-2', 'ring-amber-500');
          setTimeout(() => {
            el.classList.remove('ring-2', 'ring-amber-500');
          }, 3500);
        }
      }, 200);
    }
  }, [targetIndikatorId, selectedKomponenId, komponenList]);
  const [statusFilter, setStatusFilter] = useState<'all' | 'belum_evaluasi' | 'sudah_evaluasi' | 'valid' | 'draf' | 'selesai' | 'perlu_perbaikan'>('all');
  const [capaianFilter, setCapaianFilter] = useState<'all' | CapaianRubrik>('all');
  const [buktiFilter, setBuktiFilter] = useState<'all' | 'lengkap' | 'belum_lengkap'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [savingIndikatorId, setSavingIndikatorId] = useState<string | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<{ id: string; type: 'success' | 'error'; text: string } | null>(null);
  const [openLogIndikatorId, setOpenLogIndikatorId] = useState<string | null>(null);
  const [openButirLogId, setOpenButirLogId] = useState<string | null>(null);
  const [isSidebarOpenInFocus, setIsSidebarOpenInFocus] = useState<boolean>(true);

  // Reviewer Notes Side Panel State
  const [isReviewerPanelOpen, setIsReviewerPanelOpen] = useState<boolean>(false);
  const [isReviewerPanelPinned, setIsReviewerPanelPinned] = useState<boolean>(false);
  const [reviewerNotes, setReviewerNotes] = useState<ReviewerNote[]>(() => getStoredReviewerNotes());

  // Print Preview Modal State
  const [isPrintPreviewOpen, setIsPrintPreviewOpen] = useState<boolean>(false);

  const handleSelectIndikatorFromNotes = (indikatorId: string) => {
    setSelectedIndikatorId(indikatorId);
    const activeKomponen = komponenList.find((k) => k.id === selectedKomponenId);
    const parentButir = activeKomponen?.butir?.find((b) => b.indikator?.some((ind) => ind.id === indikatorId));
    if (parentButir) {
      setSelectedButirId(parentButir.id);
    }
    setTimeout(() => {
      const el = document.getElementById(`indikator-card-${indikatorId}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el.classList.add('ring-2', 'ring-indigo-500');
        setTimeout(() => {
          el.classList.remove('ring-2', 'ring-indigo-500');
        }, 3500);
      }
    }, 200);
  };

  // Auto-Save System State
  const [isAutoSaveEnabled, setIsAutoSaveEnabled] = useState<boolean>(true);
  const [autoSaveMap, setAutoSaveMap] = useState<Record<string, AutoSaveInfo>>({});
  const [lastGlobalSavedTime, setLastGlobalSavedTime] = useState<string | null>(null);
  const [lastSavedKode, setLastSavedKode] = useState<string | null>(null);
  const autoSaveTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  // Active User / Editor State
  const [localCurrentUser, setLocalCurrentUser] = useState<UserProfile>(getCurrentUser());
  const currentUser = propCurrentUser || localCurrentUser;

  // Role permissions
  const isAdmin = currentUser.role === 'Admin';
  const isAsesi = currentUser.role === 'Asesi';
  const isValidator = currentUser.role === 'Validator';
  const isViewer = currentUser.role === 'Viewer';

  const canEditAsesiNotes = isAdmin || isAsesi;
  const canEditChecklist = isAdmin || isAsesi;
  const canEditUrls = isAdmin || isAsesi;
  const canValidate = isAdmin || isValidator;
  const isReadOnly = isViewer;

  // Validator form states per indicator
  const [validatorNotesMap, setValidatorNotesMap] = useState<Record<string, string>>({});
  const [validatorStatusMap, setValidatorStatusMap] = useState<Record<string, StatusVerifikasi>>({});
  const [savingValidatorId, setSavingValidatorId] = useState<string | null>(null);

  // Asisten Pintar Gemini AI State
  const [aiAssistantIndikator, setAiAssistantIndikator] = useState<Indikator | null>(null);

  // Riwayat Versi Bukti Fisik Modal State
  const [activeVersionBukti, setActiveVersionBukti] = useState<BuktiFisik | null>(null);
  const [activeVersionIndikatorKode, setActiveVersionIndikatorKode] = useState<string>('');
  const [activeVersionIndikatorNama, setActiveVersionIndikatorNama] = useState<string>('');
  const [activeVersionStatus, setActiveVersionStatus] = useState<StatusBuktiFisik>('Belum Ada');
  const [isVersionModalOpen, setIsVersionModalOpen] = useState<boolean>(false);

  const handleOpenVersionHistory = (
    bf: BuktiFisik,
    indikatorKode?: string,
    indikatorNama?: string,
    currentStatus?: StatusBuktiFisik
  ) => {
    setActiveVersionBukti(bf);
    setActiveVersionIndikatorKode(indikatorKode || '');
    setActiveVersionIndikatorNama(indikatorNama || '');
    setActiveVersionStatus(currentStatus || 'Belum Ada');
    setIsVersionModalOpen(true);
  };

  const handleVersionStatusUpdated = (buktiId: string, newStatus: StatusBuktiFisik) => {
    if (activeVersionBukti) {
      handleChecklistStatusChange(
        activeVersionBukti.indikator_id,
        buktiId,
        newStatus,
        activeVersionIndikatorKode
      );
      setActiveVersionStatus(newStatus);
    }
  };

  // Form State lokal per indikator yang sedang diedit
  const [formStates, setFormStates] = useState<Record<string, {
    capaian: CapaianRubrik;
    catatan: string;
    bukti_urls: string[];
    bukti_checklist: Record<string, StatusBuktiFisik>;
    newUrlInput: string;
    status_verifikasi: StatusVerifikasi;
  }>>({});

  // Bersihkan timer auto-save saat unmount
  useEffect(() => {
    return () => {
      Object.values(autoSaveTimers.current).forEach((timer) => clearTimeout(timer));
    };
  }, []);

  const currentKomponen = komponenList.find((k) => k.id === selectedKomponenId) || komponenList[0];

  const handleUserChange = (user: UserProfile) => {
    setLocalCurrentUser(user);
    setCurrentUser(user);
    if (onUserChanged) {
      onUserChanged(user);
    }
  };

  // Helper untuk inisialisasi state form jika belum ada di lokal
  const getFormState = (indikatorId: string) => {
    if (formStates[indikatorId]) {
      return formStates[indikatorId];
    }
    const saved = evaluasiMap[indikatorId];
    return {
      capaian: saved ? saved.capaian : 'Baik',
      catatan: saved ? saved.catatan : '',
      bukti_urls: saved?.bukti_urls ? [...saved.bukti_urls] : [],
      bukti_checklist: saved?.bukti_checklist ? { ...saved.bukti_checklist } : {},
      newUrlInput: '',
      status_verifikasi: saved ? saved.status_verifikasi : 'Draf',
    };
  };

  const updateFormState = (indikatorId: string, partial: Partial<ReturnType<typeof getFormState>>) => {
    setFormStates((prev) => ({
      ...prev,
      [indikatorId]: {
        ...getFormState(indikatorId),
        ...partial,
      },
    }));
  };

  /**
   * Inti Auto-Save: Menjadwalkan penyimpanan otomatis 500ms setelah aktivitas selesai (Hanya untuk yang memiliki hak edit Asesi/Admin)
   */
  const scheduleAutoSave = (
    indikatorId: string,
    updatedPartial: Partial<ReturnType<typeof getFormState>>,
    indikatorKode?: string
  ) => {
    if (!isAutoSaveEnabled || !canEditAsesiNotes) return;

    // Set status ke pending (sedang mengetik / menunggu jeda 500ms)
    setAutoSaveMap((prev) => ({
      ...prev,
      [indikatorId]: {
        state: 'pending',
        lastSaved: prev[indikatorId]?.lastSaved,
      },
    }));

    if (autoSaveTimers.current[indikatorId]) {
      clearTimeout(autoSaveTimers.current[indikatorId]);
    }

    autoSaveTimers.current[indikatorId] = setTimeout(async () => {
      const currentState = {
        ...getFormState(indikatorId),
        ...updatedPartial,
      };

      setAutoSaveMap((prev) => ({
        ...prev,
        [indikatorId]: {
          state: 'saving',
          lastSaved: prev[indikatorId]?.lastSaved,
        },
      }));

      try {
        const result = await saveEvaluasi(
          indikatorId,
          currentState.capaian,
          currentState.catatan,
          currentState.bukti_urls,
          currentState.status_verifikasi,
          currentUser,
          currentState.bukti_checklist,
          { isAutoSave: true }
        );

        onEvaluasiUpdated(result.data);

        const timeStr = new Intl.DateTimeFormat('id-ID', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }).format(new Date());

        setAutoSaveMap((prev) => ({
          ...prev,
          [indikatorId]: {
            state: 'saved',
            lastSaved: timeStr,
          },
        }));

        setLastGlobalSavedTime(timeStr);
        if (indikatorKode) {
          setLastSavedKode(indikatorKode);
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        setAutoSaveMap((prev) => ({
          ...prev,
          [indikatorId]: {
            state: 'error',
            error: msg,
            lastSaved: prev[indikatorId]?.lastSaved,
          },
        }));
      }
    }, 500);
  };

  const handleNotesChange = (indikatorId: string, newNotes: string, indikatorKode?: string) => {
    if (!canEditAsesiNotes) return;
    updateFormState(indikatorId, { catatan: newNotes });
    scheduleAutoSave(indikatorId, { catatan: newNotes }, indikatorKode);
  };

  const handleApplyAiSuggestion = (suggestionText: string, mode: 'replace' | 'append') => {
    if (!aiAssistantIndikator) return;
    const indId = aiAssistantIndikator.id;
    const indKode = aiAssistantIndikator.kode;
    const currentForm = getFormState(indId);

    let newCatatan = suggestionText;
    if (mode === 'append' && currentForm.catatan.trim().length > 0) {
      newCatatan = `${currentForm.catatan.trim()}\n\n${suggestionText.trim()}`;
    }

    handleNotesChange(indId, newCatatan, indKode);
  };

  const handleCapaianChange = (indikatorId: string, capaian: CapaianRubrik, indikatorKode?: string) => {
    if (!canEditAsesiNotes) return;
    updateFormState(indikatorId, { capaian });
    scheduleAutoSave(indikatorId, { capaian }, indikatorKode);
  };

  const handleStatusVerifikasiChange = (indikatorId: string, status_verifikasi: StatusVerifikasi, indikatorKode?: string) => {
    // Validasi data bukti dukung sebelum status diubah menjadi 'Selesai'
    if (status_verifikasi === 'Selesai') {
      const activeInd = currentKomponen?.butir?.flatMap((b) => b.indikator || []).find((i) => i.id === indikatorId);
      if (activeInd) {
        const form = getFormState(indikatorId);
        const valRes = validateBuktiDukungUntukSelesai(activeInd, form);
        if (!valRes.isValid) {
          setFeedbackMessage({
            id: indikatorId,
            type: 'error',
            text: `Perhatian: Bukti dukung belum memenuhi syarat 'Selesai'. ${valRes.errors[0]}`
          });
        } else {
          setFeedbackMessage({
            id: indikatorId,
            type: 'success',
            text: `Status 'Selesai' berhasil ditetapkan. Seluruh ${valRes.totalBuktiWajib} bukti fisik wajib & repositori digital telah valid.`
          });
        }
      }
    }

    updateFormState(indikatorId, { status_verifikasi });
    if (canEditAsesiNotes) {
      scheduleAutoSave(indikatorId, { status_verifikasi }, indikatorKode);
    }
  };

  const handleChecklistStatusChange = (indikatorId: string, buktiId: string, status: StatusBuktiFisik, indikatorKode?: string) => {
    if (!canEditChecklist) return;
    const state = getFormState(indikatorId);
    const previousStatus = state.bukti_checklist[buktiId] || 'Belum Ada';
    
    // Catat ke version history jika terjadi perubahan status
    if (previousStatus !== status) {
      recordBuktiVersion({
        bukti_id: buktiId,
        indikator_id: indikatorId,
        indikator_kode: indikatorKode,
        status: status,
        previous_status: previousStatus,
        user: currentUser,
      });
    }

    const updatedChecklist = {
      ...state.bukti_checklist,
      [buktiId]: status,
    };
    updateFormState(indikatorId, { bukti_checklist: updatedChecklist });
    scheduleAutoSave(indikatorId, { bukti_checklist: updatedChecklist }, indikatorKode);
  };

  const handleSetAllChecklistStatus = (indikatorId: string, buktiList: { id: string }[], status: StatusBuktiFisik, indikatorKode?: string) => {
    if (!canEditChecklist) return;
    const state = getFormState(indikatorId);
    const updatedChecklist = { ...state.bukti_checklist };
    
    buktiList.forEach((b) => {
      const prev = state.bukti_checklist[b.id] || 'Belum Ada';
      if (prev !== status) {
        recordBuktiVersion({
          bukti_id: b.id,
          indikator_id: indikatorId,
          indikator_kode: indikatorKode,
          status: status,
          previous_status: prev,
          user: currentUser,
        });
      }
      updatedChecklist[b.id] = status;
    });

    updateFormState(indikatorId, { bukti_checklist: updatedChecklist });
    scheduleAutoSave(indikatorId, { bukti_checklist: updatedChecklist }, indikatorKode);
  };

  const handleAddUrl = (indikatorId: string, indikatorKode?: string) => {
    if (!canEditUrls) return;
    const state = getFormState(indikatorId);
    if (!state.newUrlInput.trim()) return;

    const trimmed = state.newUrlInput.trim();
    if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
      alert('Link bukti fisik harus berawalan http:// atau https://');
      return;
    }

    const updatedUrls = [...state.bukti_urls, trimmed];
    updateFormState(indikatorId, {
      bukti_urls: updatedUrls,
      newUrlInput: '',
    });
    scheduleAutoSave(indikatorId, { bukti_urls: updatedUrls }, indikatorKode);
  };

  const handleRemoveUrl = (indikatorId: string, index: number, indikatorKode?: string) => {
    if (!canEditUrls) return;
    const state = getFormState(indikatorId);
    const updated = state.bukti_urls.filter((_, i) => i !== index);
    updateFormState(indikatorId, { bukti_urls: updated });
    scheduleAutoSave(indikatorId, { bukti_urls: updated }, indikatorKode);
  };

  const handleValidatorReview = async (indikatorId: string, customStatus?: StatusVerifikasi) => {
    const statusToSet = customStatus || validatorStatusMap[indikatorId] || evaluasiMap[indikatorId]?.status_verifikasi || 'Terverifikasi Valid';
    const notesToSet = validatorNotesMap[indikatorId] !== undefined 
      ? validatorNotesMap[indikatorId] 
      : (evaluasiMap[indikatorId]?.catatan_validator || '');

    setSavingValidatorId(indikatorId);
    try {
      const result = await saveValidatorReview(
        indikatorId,
        statusToSet,
        notesToSet,
        currentUser
      );
      onEvaluasiUpdated(result.data);
      setFeedbackMessage({
        id: indikatorId,
        type: 'success',
        text: `Status berhasil diverifikasi menjadi "${statusToSet}".`,
      });
      setTimeout(() => {
        setFeedbackMessage((curr) => (curr?.id === indikatorId ? null : curr));
      }, 4000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setFeedbackMessage({
        id: indikatorId,
        type: 'error',
        text: msg,
      });
    } finally {
      setSavingValidatorId(null);
    }
  };

  const handleSave = async (indikatorId: string) => {
    if (isReadOnly) {
      alert('Akses Ditolak: Pengguna Umum (Viewer) hanya memiliki akses baca saja.');
      return;
    }

    // Batalkan timer auto-save jika sedang pending
    if (autoSaveTimers.current[indikatorId]) {
      clearTimeout(autoSaveTimers.current[indikatorId]);
    }

    const state = getFormState(indikatorId);

    // Validasi data di sisi antarmuka pengguna
    const validation = validateEvaluasiInput({
      indikator_id: indikatorId,
      capaian: state.capaian,
      catatan: state.catatan,
      bukti_urls: state.bukti_urls,
    });

    if (!validation.isValid) {
      const errorMsg = Object.values(validation.errors).join(' ');
      setFeedbackMessage({
        id: indikatorId,
        type: 'error',
        text: `Gagal menyimpan: ${errorMsg}`,
      });
      return;
    }

    setSavingIndikatorId(indikatorId);
    setFeedbackMessage(null);

    try {
      const result = await saveEvaluasi(
        indikatorId,
        state.capaian,
        state.catatan,
        state.bukti_urls,
        state.status_verifikasi,
        currentUser,
        state.bukti_checklist
      );

      onEvaluasiUpdated(result.data);

      const timeStr = new Intl.DateTimeFormat('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }).format(new Date());

      setAutoSaveMap((prev) => ({
        ...prev,
        [indikatorId]: {
          state: 'saved',
          lastSaved: timeStr,
        },
      }));
      setLastGlobalSavedTime(timeStr);

      setFeedbackMessage({
        id: indikatorId,
        type: 'success',
        text: result.message || 'Evaluasi asesi berhasil disimpan!',
      });

      setTimeout(() => {
        setFeedbackMessage((curr) => (curr?.id === indikatorId ? null : curr));
      }, 4000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setFeedbackMessage({
        id: indikatorId,
        type: 'error',
        text: msg,
      });
    } finally {
      setSavingIndikatorId(null);
    }
  };

  const toggleLogView = (indikatorId: string) => {
    setOpenLogIndikatorId((prev) => (prev === indikatorId ? null : indikatorId));
  };

  const formatTimestamp = (isoString?: string) => {
    if (!isoString) return '-';
    try {
      const d = new Date(isoString);
      return new Intl.DateTimeFormat('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(d);
    } catch {
      return isoString;
    }
  };

  // Status global auto-save
  const pendingCount = Object.values(autoSaveMap).filter((s) => s.state === 'pending').length;
  const savingCount = Object.values(autoSaveMap).filter((s) => s.state === 'saving').length;
  const errorCount = Object.values(autoSaveMap).filter((s) => s.state === 'error').length;

  // Filter butir & indikator
  const filteredButir = currentKomponen?.butir?.filter((b) => {
    if (selectedButirId !== 'all' && b.id !== selectedButirId) return false;
    return true;
  }) || [];

  return (
    <div className={`space-y-6 ${isFocusMode ? 'pb-16' : ''}`}>
      {/* Floating Focus Mode Top Bar */}
      {isFocusMode && (
        <div className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-md text-white border-b border-slate-800 px-4 sm:px-6 py-3 shadow-lg">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center font-bold text-white shadow-xs">
                <Maximize2 className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                    Mode Fokus Layar Penuh
                  </span>
                  <span className="text-xs text-slate-400 hidden sm:inline">Navigasi Sidebar Disembunyikan</span>
                </div>
                <h2 className="text-xs sm:text-sm font-bold text-white truncate mt-0.5">
                  {currentKomponen?.kode}: {currentKomponen?.nama}
                </h2>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* Quick Component Buttons in Focus Mode */}
              <div className="flex items-center gap-1 bg-slate-800/90 p-1 rounded-lg border border-slate-700">
                {komponenList.map((k) => (
                  <button
                    key={k.id}
                    type="button"
                    onClick={() => {
                      setSelectedKomponenId(k.id);
                      setSelectedButirId('all');
                      setSelectedIndikatorId('all');
                    }}
                    className={`px-2.5 py-1 rounded text-xs font-bold transition-colors ${
                      k.id === currentKomponen?.id
                        ? 'bg-emerald-600 text-white'
                        : 'text-slate-300 hover:text-white hover:bg-slate-700'
                    }`}
                  >
                    {k.kode}
                  </button>
                ))}
              </div>

              {/* Auto-save Status indicator */}
              <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700 text-xs">
                <Zap className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-slate-300">
                  {savingCount > 0 ? 'Menyimpan...' : 'Auto-Save Aktif'}
                </span>
              </div>

              {/* Tombol Tour Panduan di Mode Fokus */}
              {onStartTour && (
                <button
                  type="button"
                  onClick={onStartTour}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-emerald-300 text-xs font-semibold rounded-lg transition-all shadow-xs border border-slate-700 cursor-pointer group"
                  title="Mulai Panduan Tour Interaktif Pengisian Instrumen"
                >
                  <Compass className="w-3.5 h-3.5 text-emerald-400 group-hover:rotate-45 transition-transform" />
                  <span>Panduan Tour</span>
                </button>
              )}

              {/* Tombol Print Preview di Mode Fokus */}
              <button
                type="button"
                onClick={() => setIsPrintPreviewOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-lg transition-all shadow-xs border border-slate-700 cursor-pointer"
                title="Pratinjau Cetak Formal (Print Preview Dokumen)"
              >
                <Printer className="w-3.5 h-3.5 text-emerald-400" />
                <span>Print Preview</span>
              </button>

              {/* Exit Focus Mode button */}
              <button
                type="button"
                onClick={() => setIsFocusMode?.(false)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-lg transition-all shadow-xs"
                title="Keluar dari mode fokus (atau tekan tombol Esc pada keyboard)"
              >
                <Minimize2 className="w-3.5 h-3.5" />
                <span>Keluar Fokus (Esc)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Auto-Save Global Sticky Status Bar & Editor Context */}
      <div className={`bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3 ${isFocusMode ? 'max-w-7xl mx-auto' : ''}`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold ${
              isAdmin 
                ? 'bg-amber-100 text-amber-800' 
                : isValidator 
                ? 'bg-purple-100 text-purple-800' 
                : isAsesi 
                ? 'bg-emerald-100 text-emerald-800' 
                : 'bg-slate-100 text-slate-700'
            }`}>
              {isAdmin ? <Crown className="w-4 h-4" /> : isValidator ? <Shield className="w-4 h-4" /> : isAsesi ? <Edit3 className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-medium text-slate-500">
                  Pengguna Aktif:
                </span>
                <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded border ${
                  isAdmin 
                    ? 'bg-amber-50 text-amber-700 border-amber-200' 
                    : isValidator 
                    ? 'bg-purple-50 text-purple-700 border-purple-200' 
                    : isAsesi 
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                    : 'bg-slate-100 text-slate-600 border-slate-200'
                }`}>
                  Peran: {currentUser.role}
                </span>
              </div>
              <span className="text-xs sm:text-sm font-bold text-slate-900">
                {currentUser.name} <span className="font-normal text-slate-500 text-xs">({currentUser.title})</span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs text-slate-500 whitespace-nowrap hidden md:inline">Ganti Pengguna & Peran:</label>
            <select
              value={currentUser.name}
              onChange={(e) => {
                const selected = DEFAULT_TEAM_USERS.find((u) => u.name === e.target.value);
                if (selected) handleUserChange(selected);
              }}
              className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-600 focus:bg-white"
            >
              {DEFAULT_TEAM_USERS.map((u) => (
                <option key={u.name} value={u.name}>
                  [{u.role}] {u.name} — {u.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Informative Role Banner Notification */}
        {isViewer ? (
          <div className="p-3 bg-slate-100/90 border border-slate-300 rounded-lg flex items-start gap-2.5 text-xs text-slate-700">
            <Eye className="w-4 h-4 text-slate-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-slate-900">Mode Pengguna Umum (Read-Only) Aktif</p>
              <p className="text-slate-600 text-[11px] leading-relaxed mt-0.5">
                Anda hanya memiliki izin membaca data (Lihat butir, indikator, rubrik, checklist bukti &amp; laporan). Pengisian formulir evaluasi, checklist bukti fisik, dan perubahan status verifikasi dinonaktifkan.
              </p>
            </div>
          </div>
        ) : isValidator ? (
          <div className="p-3 bg-purple-50/80 border border-purple-200 rounded-lg flex items-start gap-2.5 text-xs text-purple-900">
            <Shield className="w-4 h-4 text-purple-700 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-purple-950">Mode Validator (Asesor Internal / Auditor Mutu) Aktif</p>
              <p className="text-purple-800 text-[11px] leading-relaxed mt-0.5">
                Anda berwenang memvalidasi portofolio, memberikan review mutu, dan menetapkan <strong>Status Verifikasi</strong> (Terverifikasi Valid, Perlu Perbaikan, Draf). Catatan evaluasi diri dan checklist bukti fisik asesi dikunci untuk menjaga integritas data pengisian asesi.
              </p>
            </div>
          </div>
        ) : isAsesi ? (
          <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-lg flex items-start gap-2.5 text-xs text-emerald-900">
            <Edit3 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-emerald-950">Mode Tim Asesi Sekolah Aktif</p>
              <p className="text-emerald-800 text-[11px] leading-relaxed mt-0.5">
                Silakan isi Catatan Evaluasi Diri (DKA), pilih capaian rubrik, unggah tautan bukti fisik (Google Drive/Cloud), dan tandai kesiapan Checklist Dokumen. Auto-save otomatis menyimpan draf tiap 500ms.
              </p>
            </div>
          </div>
        ) : (
          <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-lg flex items-start gap-2.5 text-xs text-amber-900">
            <Crown className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-amber-950">Mode Administrator Akreditasi Aktif</p>
              <p className="text-amber-800 text-[11px] leading-relaxed mt-0.5">
                Akses penuh: Anda dapat mengedit catatan asesi, checklist bukti fisik, menetapkan status verifikasi, serta mengelola skema database.
              </p>
            </div>
          </div>
        )}

        {/* Global Auto-Save Status Bar Strip & Focus Mode Toggle */}
        <div className="pt-2.5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => {
                if (isReadOnly || isValidator) return;
                setIsAutoSaveEnabled(!isAutoSaveEnabled);
              }}
              disabled={isReadOnly || isValidator}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition-all ${
                isReadOnly || isValidator
                  ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
                  : isAutoSaveEnabled
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : 'bg-slate-100 text-slate-600 border border-slate-200'
              }`}
              title={isReadOnly || isValidator ? 'Auto-save dinonaktifkan untuk peran ini' : 'Klik untuk mengaktifkan / menonaktifkan penyimpanan otomatis saat mengetik'}
            >
              <Zap className={`w-3.5 h-3.5 ${isAutoSaveEnabled && !isReadOnly && !isValidator ? 'text-emerald-700 fill-emerald-600' : 'text-slate-400'}`} />
              <span>
                {isReadOnly || isValidator ? 'Auto-Save Terkunci' : `Auto-Save ${isAutoSaveEnabled ? 'Aktif (500ms)' : 'Nonaktif'}`}
              </span>
            </button>

            {/* Tombol Masuk Mode Fokus */}
            <button
              type="button"
              onClick={() => setIsFocusMode?.(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 transition-all shadow-xs"
              title="Masuk ke mode layar penuh tanpa navigasi untuk fokus menulis catatan evaluasi diri"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>Mode Fokus (Layar Penuh)</span>
            </button>

            {/* Tombol Tour Panduan Instrumen */}
            {onStartTour && (
              <button
                type="button"
                id="instrumen-tour-btn"
                onClick={onStartTour}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 transition-all shadow-xs cursor-pointer group"
                title="Panduan Interaktif Pengisian Instrumen & Bukti Fisik"
              >
                <Compass className="w-3.5 h-3.5 text-emerald-600 group-hover:rotate-45 transition-transform" />
                <span>Panduan Tour</span>
              </button>
            )}

            {/* Tombol Print Preview Dokumen Formal */}
            <button
              type="button"
              id="instrumen-print-preview-btn"
              onClick={() => setIsPrintPreviewOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white transition-all shadow-xs cursor-pointer group"
              title="Pratinjau Cetak Formal (Print Preview) Laporan Evaluasi Diri BAN-PDM"
            >
              <Printer className="w-3.5 h-3.5 text-emerald-400 group-hover:scale-110 transition-transform" />
              <span>Print Preview Formal</span>
            </button>

            {/* Tombol Panel Catatan Reviewer & Kolaborasi */}
            <button
              type="button"
              id="instrumen-reviewer-notes-btn"
              onClick={() => setIsReviewerPanelOpen(!isReviewerPanelOpen)}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all shadow-xs cursor-pointer ${
                isReviewerPanelOpen
                  ? 'bg-amber-400 text-slate-950 font-bold shadow-sm'
                  : 'bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300'
              }`}
              title="Buka panel kolaborasi tim asesi, catatan untuk admin & audit reviewer"
            >
              <MessageSquare className="w-3.5 h-3.5 text-amber-700" />
              <span>Catatan Reviewer</span>
              {reviewerNotes.filter((n) => n.komponen_id === selectedKomponenId && n.status !== 'selesai').length > 0 && (
                <span className="bg-amber-600 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                  {reviewerNotes.filter((n) => n.komponen_id === selectedKomponenId && n.status !== 'selesai').length}
                </span>
              )}
            </button>

            {/* Dynamic Status Feedback */}
            {!canEditAsesiNotes ? (
              <span className="inline-flex items-center gap-1.5 text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200 font-medium">
                <Lock className="w-3.5 h-3.5" />
                <span>{isValidator ? 'Pengisian Asesi Terkunci (Gunakan Panel Validator)' : 'Mode Baca Saja (Read-Only)'}</span>
              </span>
            ) : isAutoSaveEnabled ? (
              savingCount > 0 ? (
                <span className="inline-flex items-center gap-1.5 text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200 font-medium">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Menyimpan otomatis ke database...</span>
                </span>
              ) : pendingCount > 0 ? (
                <span className="inline-flex items-center gap-1.5 text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200 font-medium animate-pulse">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Mengetik... Menyimpan dalam 500ms</span>
                </span>
              ) : errorCount > 0 ? (
                <span className="inline-flex items-center gap-1.5 text-rose-700 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200 font-medium">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>Ada kesalahan auto-save</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>
                    Semua perubahan tersimpan {lastGlobalSavedTime ? `(pukul ${lastGlobalSavedTime})` : 'otomatis'}
                  </span>
                </span>
              )
            ) : (
              <span className="text-slate-400 text-xs">
                (Mode manual: Klik tombol simpan pada setiap indikator)
              </span>
            )}
          </div>

          {lastSavedKode && (
            <div className="text-[11px] font-mono text-slate-500 hidden sm:inline">
              Indikator terakhir disinkron: <span className="font-bold text-slate-700">{lastSavedKode}</span>
            </div>
          )}
        </div>
      </div>

      {/* Header Komponen Selector (4 Komponen BAN-PDM) */}
      <div id="instrumen-komponen-tabs" className="bg-white rounded-2xl border border-slate-100 p-5 shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5">
          Pilih Komponen Akreditasi (BAN-PDM 2024 / Versi 2025)
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {komponenList.map((k) => {
            const isSelected = k.id === currentKomponen?.id;
            return (
              <button
                key={k.id}
                onClick={() => {
                  setSelectedKomponenId(k.id);
                  setSelectedButirId('all');
                }}
                className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'border-[#0084FF] bg-[#EAF5FE] shadow-xs ring-1 ring-[#0084FF]'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                    isSelected ? 'bg-[#0084FF] text-white shadow-2xs' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {k.kode}
                  </span>
                  <span className="text-xs text-slate-500 font-mono font-semibold">Bobot {k.bobot}%</span>
                </div>
                <div className="text-xs font-bold text-slate-900 line-clamp-2 leading-tight">
                  {k.nama}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Container Evaluasi & Side Panel Catatan Reviewer */}
      <div className="flex flex-col lg:flex-row items-start gap-6 relative">
        <div className="flex-1 min-w-0 w-full space-y-6">
          {/* Bar Filter Butir, Indikator & Pencarian */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3">
        {/* Baris 1: Filter Butir & Pencarian */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
            <Filter className="w-4 h-4 text-slate-400 shrink-0" />
            <span className="text-xs font-semibold text-slate-700 whitespace-nowrap">Filter Butir:</span>
            <button
              onClick={() => {
                setSelectedButirId('all');
                setSelectedIndikatorId('all');
              }}
              className={`px-2.5 py-1 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                selectedButirId === 'all'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Semua Butir ({currentKomponen?.butir?.length || 0})
            </button>
            {currentKomponen?.butir?.map((b) => (
              <button
                key={b.id}
                onClick={() => {
                  setSelectedButirId(b.id);
                  setSelectedIndikatorId('all');
                }}
                className={`px-2.5 py-1 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                  selectedButirId === b.id
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {b.kode}
              </button>
            ))}
          </div>

          <div className="relative min-w-[220px]">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari kata kunci indikator..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-600 focus:bg-white"
            />
          </div>
        </div>

        {/* Baris 2: FITUR FILTER INDIKATOR MULTI-KRITERIA */}
        <div className="pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 text-xs">
          {/* 1. Dropdown Filter Indikator Spesifik */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Pilih Indikator Spesifik:
            </label>
            <select
              value={selectedIndikatorId}
              onChange={(e) => setSelectedIndikatorId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800 font-medium focus:outline-none focus:ring-1 focus:ring-emerald-600 focus:bg-white"
            >
              <option value="all">
                Semua Indikator ({currentKomponen?.butir?.flatMap((b) => b.indikator || []).length || 0})
              </option>
              {currentKomponen?.butir
                ?.filter((b) => selectedButirId === 'all' || b.id === selectedButirId)
                .flatMap((b) => b.indikator || [])
                .map((ind) => (
                  <option key={ind.id} value={ind.id}>
                    {ind.kode} — {ind.nama.length > 40 ? `${ind.nama.slice(0, 40)}...` : ind.nama}
                  </option>
                ))}
            </select>
          </div>

          {/* 2. Filter Status Evaluasi Indikator */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Status Evaluasi:
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800 font-medium focus:outline-none focus:ring-1 focus:ring-emerald-600 focus:bg-white"
            >
              <option value="all">Semua Status Evaluasi</option>
              <option value="belum_evaluasi">⏳ Belum Dievaluasi</option>
              <option value="sudah_evaluasi">✓ Sudah Terevaluasi</option>
              <option value="selesai">✅ Selesai (Dokumen Lengkap)</option>
              <option value="valid">🟢 Terverifikasi Valid</option>
              <option value="draf">📝 Draf (Belum Final)</option>
              <option value="perlu_perbaikan">⚠️ Perlu Perbaikan</option>
            </select>
          </div>

          {/* 3. Filter Capaian Rubrik */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Level Capaian Rubrik:
            </label>
            <select
              value={capaianFilter}
              onChange={(e) => setCapaianFilter(e.target.value as typeof capaianFilter)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800 font-medium focus:outline-none focus:ring-1 focus:ring-emerald-600 focus:bg-white"
            >
              <option value="all">Semua Level Capaian</option>
              <option value="Sangat Baik">⭐ Sangat Baik (Level 4)</option>
              <option value="Baik">🔹 Baik (Level 3)</option>
              <option value="Cukup Baik">🔸 Cukup Baik (Level 2)</option>
              <option value="Kurang">🔻 Kurang (Level 1)</option>
            </select>
          </div>

          {/* 4. Filter Kesiapan Bukti Fisik */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Status Bukti Fisik:
            </label>
            <select
              value={buktiFilter}
              onChange={(e) => setBuktiFilter(e.target.value as typeof buktiFilter)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800 font-medium focus:outline-none focus:ring-1 focus:ring-emerald-600 focus:bg-white"
            >
              <option value="all">Semua Status Bukti</option>
              <option value="lengkap">📂 Bukti Lengkap (100% Tersedia)</option>
              <option value="belum_lengkap">⏳ Bukti Belum Lengkap / Proses</option>
            </select>
          </div>
        </div>

        {/* Baris 3: Indikator Hasil Filter & Tombol Reset */}
        {(selectedIndikatorId !== 'all' ||
          statusFilter !== 'all' ||
          capaianFilter !== 'all' ||
          buktiFilter !== 'all' ||
          selectedButirId !== 'all' ||
          searchQuery.trim() !== '') && (
          <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-slate-500 font-medium">Filter Aktif:</span>
              {selectedButirId !== 'all' && (
                <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded border font-mono text-[11px]">
                  Butir: {currentKomponen?.butir?.find((b) => b.id === selectedButirId)?.kode}
                </span>
              )}
              {selectedIndikatorId !== 'all' && (
                <span className="bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded border border-emerald-200 font-mono text-[11px]">
                  Indikator: {currentKomponen?.butir?.flatMap((b) => b.indikator || []).find((i) => i.id === selectedIndikatorId)?.kode}
                </span>
              )}
              {statusFilter !== 'all' && (
                <span className="bg-blue-50 text-blue-800 px-2 py-0.5 rounded border border-blue-200 text-[11px]">
                  Status: {statusFilter.replace('_', ' ')}
                </span>
              )}
              {capaianFilter !== 'all' && (
                <span className="bg-amber-50 text-amber-800 px-2 py-0.5 rounded border border-amber-200 text-[11px]">
                  Capaian: {capaianFilter}
                </span>
              )}
              {buktiFilter !== 'all' && (
                <span className="bg-teal-50 text-teal-800 px-2 py-0.5 rounded border border-teal-200 text-[11px]">
                  Bukti: {buktiFilter === 'lengkap' ? 'Lengkap' : 'Belum Lengkap'}
                </span>
              )}
              {searchQuery.trim() !== '' && (
                <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded border text-[11px]">
                  Kata Kunci: "{searchQuery}"
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={() => {
                setSelectedButirId('all');
                setSelectedIndikatorId('all');
                setStatusFilter('all');
                setCapaianFilter('all');
                setBuktiFilter('all');
                setSearchQuery('');
              }}
              className="text-rose-600 hover:text-rose-800 hover:underline font-semibold text-xs flex items-center gap-1"
            >
              <XCircle className="w-3.5 h-3.5" />
              <span>Reset Semua Filter</span>
            </button>
          </div>
        )}
      </div>

      {/* Rincian Butir & Indikator */}
      {filteredButir.every((butir) => {
        const matching = (butir.indikator || []).filter((ind) => {
          if (selectedIndikatorId !== 'all' && ind.id !== selectedIndikatorId) return false;
          if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            const matchesSearch =
              ind.kode.toLowerCase().includes(q) ||
              ind.nama.toLowerCase().includes(q) ||
              ind.definisi_operasional.toLowerCase().includes(q) ||
              ind.penjelasan.toLowerCase().includes(q);
            if (!matchesSearch) return false;
          }
          const form = getFormState(ind.id);
          const savedEval = evaluasiMap[ind.id];
          if (statusFilter === 'belum_evaluasi' && savedEval) return false;
          if (statusFilter === 'sudah_evaluasi' && !savedEval) return false;
          if (statusFilter === 'valid' && savedEval?.status_verifikasi !== 'Terverifikasi Valid') return false;
          if (statusFilter === 'draf' && savedEval?.status_verifikasi !== 'Draf') return false;
          if (statusFilter === 'selesai' && savedEval?.status_verifikasi !== 'Selesai' && form.status_verifikasi !== 'Selesai') return false;
          if (statusFilter === 'perlu_perbaikan' && savedEval?.status_verifikasi !== 'Perlu Perbaikan') return false;
          if (capaianFilter !== 'all') {
            const currentCapaian = form.capaian || savedEval?.capaian;
            if (currentCapaian !== capaianFilter) return false;
          }
          if (buktiFilter !== 'all') {
            const totalBukti = ind.bukti_fisik?.length || 0;
            let tersedia = 0;
            ind.bukti_fisik?.forEach((bf) => {
              const st = form.bukti_checklist[bf.id] || 'Belum Ada';
              if (st === 'Tersedia') tersedia++;
            });
            if (buktiFilter === 'lengkap' && (totalBukti === 0 || tersedia < totalBukti)) return false;
            if (buktiFilter === 'belum_lengkap' && totalBukti > 0 && tersedia === totalBukti) return false;
          }
          return true;
        });
        return matching.length === 0;
      }) ? (
        <div className="bg-white rounded-xl border border-dashed border-slate-300 p-8 text-center space-y-3 shadow-xs">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center mx-auto">
            <Search className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-bold text-slate-900">
            Tidak ada indikator yang sesuai dengan filter
          </h4>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Tidak ditemukan indikator yang memenuhi kriteria filter yang Anda pilih pada komponen ini. Silakan sesuaikan filter atau reset untuk menampilkan semua indikator.
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedButirId('all');
              setSelectedIndikatorId('all');
              setStatusFilter('all');
              setCapaianFilter('all');
              setBuktiFilter('all');
              setSearchQuery('');
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Semua Filter</span>
          </button>
        </div>
      ) : null}

      {/* Rincian Butir & Indikator */}
      <div className="space-y-6">
        {filteredButir.map((butir) => {
          const indicators = (butir.indikator || []).filter((ind) => {
            // 1. Filter Indikator Spesifik
            if (selectedIndikatorId !== 'all' && ind.id !== selectedIndikatorId) {
              return false;
            }

            // 2. Filter Pencarian Teks
            if (searchQuery.trim()) {
              const q = searchQuery.toLowerCase();
              const matchesSearch =
                ind.kode.toLowerCase().includes(q) ||
                ind.nama.toLowerCase().includes(q) ||
                ind.definisi_operasional.toLowerCase().includes(q) ||
                ind.penjelasan.toLowerCase().includes(q);
              if (!matchesSearch) return false;
            }

            const form = getFormState(ind.id);
            const savedEval = evaluasiMap[ind.id];

            // 3. Filter Status Evaluasi
            if (statusFilter === 'belum_evaluasi' && savedEval) return false;
            if (statusFilter === 'sudah_evaluasi' && !savedEval) return false;
            if (statusFilter === 'valid' && savedEval?.status_verifikasi !== 'Terverifikasi Valid') return false;
            if (statusFilter === 'draf' && savedEval?.status_verifikasi !== 'Draf') return false;
            if (statusFilter === 'selesai' && savedEval?.status_verifikasi !== 'Selesai' && form.status_verifikasi !== 'Selesai') return false;
            if (statusFilter === 'perlu_perbaikan' && savedEval?.status_verifikasi !== 'Perlu Perbaikan') return false;

            // 4. Filter Capaian Rubrik
            if (capaianFilter !== 'all') {
              const currentCapaian = form.capaian || savedEval?.capaian;
              if (currentCapaian !== capaianFilter) return false;
            }

            // 5. Filter Status Bukti Fisik
            if (buktiFilter !== 'all') {
              const totalBukti = ind.bukti_fisik?.length || 0;
              let tersedia = 0;
              ind.bukti_fisik?.forEach((bf) => {
                const st = form.bukti_checklist[bf.id] || 'Belum Ada';
                if (st === 'Tersedia') tersedia++;
              });

              if (buktiFilter === 'lengkap' && (totalBukti === 0 || tersedia < totalBukti)) return false;
              if (buktiFilter === 'belum_lengkap' && totalBukti > 0 && tersedia === totalBukti) return false;
            }

            return true;
          });

          if (indicators.length === 0) return null;

          // Aggregasikan seluruh log aktivitas dari semua indikator dalam Butir ini
          const butirLogs = indicators
            .flatMap((ind) => getLogsForIndikator(ind.id))
            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

          // Cari editor paling mutakhir di level Butir
          let latestEditorName = '-';
          let latestEditorRole = '';
          let latestEditorTime = '';

          if (butirLogs.length > 0) {
            latestEditorName = butirLogs[0].user_name;
            latestEditorRole = butirLogs[0].user_role;
            latestEditorTime = butirLogs[0].timestamp;
          } else {
            // Cek dari evaluasiMap
            for (const ind of indicators) {
              const ev = evaluasiMap[ind.id];
              if (ev && ev.updated_at && (!latestEditorTime || new Date(ev.updated_at) > new Date(latestEditorTime))) {
                latestEditorName = ev.last_edited_by || ev.verified_by || '-';
                latestEditorRole = ev.last_edited_role || '';
                latestEditorTime = ev.updated_at;
              }
            }
          }

          const isButirLogOpen = openButirLogId === butir.id;

          return (
            <div key={butir.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
              {/* Header Butir */}
              <div className="bg-slate-50/80 px-6 py-4 border-b border-slate-200">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded font-mono">
                      {butir.kode}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">Butir Ke-{butir.nomor} BAN-PDM</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {butir.fokus_vokasi && (
                      <span className="text-xs text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 rounded font-medium">
                        Fokus Vokasi: {butir.fokus_vokasi}
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => setOpenButirLogId(isButirLogOpen ? null : butir.id)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold border transition-all ${
                        isButirLogOpen
                          ? 'bg-indigo-700 text-white border-indigo-700 shadow-xs'
                          : 'bg-white text-indigo-700 border-indigo-200 hover:bg-indigo-50'
                      }`}
                      title="Lihat riwayat pengeditan seluruh indikator di butir ini"
                    >
                      <History className="w-3.5 h-3.5" />
                      <span>Log Aktivitas Butir ({butirLogs.length})</span>
                      {isButirLogOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <h3 className="text-sm sm:text-base font-bold text-slate-900">
                  {butir.nama}
                </h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  {butir.deskripsi}
                </p>

                {/* Info Pengedit Terakhir di Level Butir */}
                <div className="mt-3 pt-2.5 border-t border-slate-200/70 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span>Terakhir diubah di Butir ini:</span>
                    <span className="font-semibold text-slate-800">
                      {latestEditorName !== '-' ? latestEditorName : 'Belum ada perubahan'}
                    </span>
                    {latestEditorRole && (
                      <span className="text-slate-400">({latestEditorRole})</span>
                    )}
                    {latestEditorTime && (
                      <>
                        <span className="text-slate-300">·</span>
                        <span className="text-slate-500 font-mono">
                          {formatTimestamp(latestEditorTime)}
                        </span>
                      </>
                    )}
                  </div>

                  <div className="text-slate-400 font-mono">
                    {indicators.length} Indikator Standar BAN-PDM
                  </div>
                </div>

                {/* Collapsible Timeline Log Aktivitas Butir */}
                {isButirLogOpen && (
                  <div className="mt-4 p-4 bg-white border border-indigo-100 rounded-xl shadow-xs space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <div className="flex items-center gap-2">
                        <History className="w-4 h-4 text-indigo-700" />
                        <h4 className="text-xs font-bold text-slate-900">
                          Log Aktivitas Lengkap: {butir.kode} — {butir.nama}
                        </h4>
                      </div>
                      <span className="text-xs font-mono text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200 font-semibold">
                        {butirLogs.length} Riwayat Tercatat
                      </span>
                    </div>

                    <ActivityLogTimeline
                      logs={butirLogs}
                      emptyMessage={`Belum ada riwayat aktivitas pengeditan tercatat pada butir ${butir.kode}.`}
                    />
                  </div>
                )}
              </div>

              {/* Daftar Indikator untuk Butir ini */}
              <div className="divide-y divide-slate-200">
                {indicators.map((ind) => {
                  const form = getFormState(ind.id);
                  const savedEval = evaluasiMap[ind.id];
                  const isSaved = !!savedEval;
                  const isSaving = savingIndikatorId === ind.id;
                  const currentFeedback = feedbackMessage?.id === ind.id ? feedbackMessage : null;
                  const indicatorLogs = getLogsForIndikator(ind.id);
                  const isLogOpen = openLogIndikatorId === ind.id;
                  const autoSaveInfo = autoSaveMap[ind.id] || { state: 'idle' };

                  // Hitung statistik kelengkapan checklist bukti fisik
                  const totalBukti = ind.bukti_fisik?.length || 0;
                  let tersediaCount = 0;
                  let dalamProsesCount = 0;
                  let belumAdaCount = 0;

                  ind.bukti_fisik?.forEach((bf) => {
                    const status = form.bukti_checklist[bf.id] || 'Belum Ada';
                    if (status === 'Tersedia') tersediaCount++;
                    else if (status === 'Dalam Proses') dalamProsesCount++;
                    else belumAdaCount++;
                  });

                  const deadlineInfo = currentKomponen 
                    ? evaluateIndikatorDeadline(ind, currentKomponen, butir.kode, savedEval)
                    : null;

                  const buktiValidation = validateBuktiDukungUntukSelesai(ind, form);
                  const indNotes = reviewerNotes.filter((n) => n.indikator_id === ind.id);
                  const indUnresolvedNotes = indNotes.filter((n) => n.status !== 'selesai');

                  return (
                    <div key={ind.id} id={`indikator-card-${ind.id}`} className="instrumen-card-indicator p-6 space-y-6 transition-all rounded-xl">
                      {/* Informasi Indikator */}
                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded font-mono">
                              {ind.kode}
                            </span>
                            <h4 className="text-sm font-bold text-slate-900">
                              {ind.nama}
                            </h4>
                          </div>

                          <div className="flex flex-wrap items-center gap-2">
                            {/* Tombol Cepat Catatan Reviewer per Indikator */}
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedIndikatorId(ind.id);
                                setIsReviewerPanelOpen(true);
                              }}
                              className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full border transition-colors cursor-pointer ${
                                indUnresolvedNotes.length > 0
                                  ? 'bg-amber-100 text-amber-900 border-amber-300 hover:bg-amber-200'
                                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                              }`}
                              title="Buka panel catatan reviewer & kolaborasi tim untuk indikator ini"
                            >
                              <MessageSquare className="w-3.5 h-3.5 text-amber-600" />
                              <span>Catatan Reviewer</span>
                              {indNotes.length > 0 && (
                                <span className="bg-amber-500 text-slate-950 font-bold px-1.5 py-0.2 rounded-full text-[10px]">
                                  {indNotes.length}
                                </span>
                              )}
                            </button>

                            {deadlineInfo?.isUrgent && (
                              <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-md border font-mono ${deadlineInfo.badgeStyle.bg} ${deadlineInfo.badgeStyle.text} ${deadlineInfo.badgeStyle.border}`}>
                                <AlertTriangle className="w-3.5 h-3.5" />
                                <span>Jatuh Tempo: {deadlineInfo.urgencyLabel} ({deadlineInfo.formattedDate})</span>
                              </span>
                            )}

                            {form.status_verifikasi === 'Selesai' && (
                              <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full border ${
                                buktiValidation.isValid 
                                  ? 'bg-emerald-100 text-emerald-800 border-emerald-300' 
                                  : 'bg-rose-100 text-rose-800 border-rose-300 animate-pulse'
                              }`}>
                                {buktiValidation.isValid ? (
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                ) : (
                                  <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                                )}
                                <span>Selesai {buktiValidation.isValid ? '(Valid)' : '(Bukti Kurang)'}</span>
                              </span>
                            )}

                            {isSaved ? (
                              <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full border ${getRubrikThemeByKategori(savedEval.capaian).pillFull}`}>
                                <span className={`w-2 h-2 rounded-full ${getRubrikThemeByKategori(savedEval.capaian).dotColor}`} />
                                <span>Terevaluasi Level {savedEval.skor} ({savedEval.capaian})</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                                <Clock className="w-3 h-3 text-amber-600" />
                                <span>Belum Dievaluasi</span>
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Definisi Operasional & Penjelasan */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-1">
                          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 flex flex-col justify-between space-y-2">
                            <div>
                              <div className="flex items-center justify-between mb-1">
                                <span className="font-semibold text-slate-700">
                                  Definisi Operasional:
                                </span>
                                <button
                                  type="button"
                                  onClick={() => setAiAssistantIndikator(ind)}
                                  className="text-[10px] font-bold text-[#0084FF] hover:text-blue-700 flex items-center gap-1 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 transition-colors"
                                  title="Dapatkan saran catatan evaluasi diri berdasarkan definisi ini"
                                >
                                  <Sparkles className="w-3 h-3 text-amber-500" />
                                  <span>Bantuan AI</span>
                                </button>
                              </div>
                              <p className="text-slate-600 leading-relaxed">
                                {ind.definisi_operasional}
                              </p>
                            </div>
                          </div>
                          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                            <span className="font-semibold text-slate-700 block mb-1">
                              Penjelasan &amp; Petunjuk Asesmen:
                            </span>
                            <p className="text-slate-600 leading-relaxed">
                              {ind.penjelasan}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Matriks Rubrik Penilaian (4 Kategori BAN-PDM) dengan Kode Warna Berbeda per Level */}
                      <div className="rubrik-matrix-container space-y-2.5">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-slate-50/70 p-3 rounded-xl border border-slate-200/80">
                          <div>
                            <label className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                              <span>Rubrik Penilaian Asesi (Pilih level capaian kondisi sekolah riil):</span>
                              {!canEditAsesiNotes && (
                                <span className="text-[10px] text-slate-500 font-normal bg-slate-200/70 px-1.5 py-0.2 rounded">
                                  (Hanya Lihat)
                                </span>
                              )}
                            </label>
                            {/* Panduan Palet Warna 4 Level BAN-PDM */}
                            <div className="flex flex-wrap items-center gap-1.5 mt-1 text-[11px]">
                              <span className="text-slate-400 font-medium text-[10px]">Panduan Level:</span>
                              <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded bg-red-50 text-red-700 border border-red-200 font-semibold text-[10px]">
                                <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                                L1: Kurang (Merah)
                              </span>
                              <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded bg-amber-50 text-amber-800 border border-amber-200 font-semibold text-[10px]">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                                L2: Cukup (Kuning/Oranye)
                              </span>
                              <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded bg-blue-50 text-blue-700 border border-blue-200 font-semibold text-[10px]">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#0084FF]" />
                                L3: Baik (Biru)
                              </span>
                              <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold text-[10px]">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                L4: Sangat Baik (Hijau)
                              </span>
                            </div>
                          </div>

                          <div className="text-xs shrink-0 flex items-center gap-1.5">
                            <span className="text-slate-500">Terpilih:</span>
                            {form.capaian ? (
                              <span className={`inline-flex items-center gap-1 font-bold px-2.5 py-0.5 rounded-lg text-xs border ${getRubrikThemeByKategori(form.capaian).pillFull}`}>
                                <span className={`w-2 h-2 rounded-full ${getRubrikThemeByKategori(form.capaian).dotColor}`} />
                                <strong>Level {getRubrikThemeByKategori(form.capaian).level}: {form.capaian}</strong>
                              </span>
                            ) : (
                              <span className="text-slate-400 italic bg-white px-2 py-0.5 rounded border border-slate-200">
                                Belum dipilih
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                          {ind.rubrik_penilaian?.map((rubrik) => {
                            const isSelected = form.capaian === rubrik.kategori;
                            const theme = getRubrikThemeByLevel(rubrik.level);

                            return (
                              <button
                                key={rubrik.id}
                                type="button"
                                disabled={!canEditAsesiNotes}
                                onClick={() => handleCapaianChange(ind.id, rubrik.kategori, ind.kode)}
                                className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between relative group ${
                                  isSelected
                                    ? theme.selectedCard
                                    : !canEditAsesiNotes
                                    ? theme.disabledCard
                                    : theme.unselectedCard
                                }`}
                              >
                                <div>
                                  <div className="flex items-center justify-between mb-2">
                                    <span className={`text-xs font-bold px-2.5 py-0.5 rounded-md transition-all ${
                                      isSelected
                                        ? theme.selectedBadge
                                        : theme.unselectedBadge
                                    }`}>
                                      Level {rubrik.level}: {rubrik.kategori}
                                    </span>
                                    {isSelected ? (
                                      <div className={`w-5 h-5 rounded-full flex items-center justify-center ${theme.selectedBadge}`}>
                                        <Check className="w-3.5 h-3.5 text-white stroke-[2.5]" />
                                      </div>
                                    ) : (
                                      <span className="text-[10px] font-mono text-slate-400 group-hover:text-slate-600 font-semibold">
                                        Skor {rubrik.level}
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-xs text-slate-700 leading-relaxed font-normal">
                                    {rubrik.deskripsi}
                                  </p>
                                </div>
                                <div className="mt-3 pt-2 border-t border-slate-100/80 flex items-center justify-between text-[11px]">
                                  <span className="text-[10px] text-slate-400">
                                    {theme.colorName}
                                  </span>
                                  <span className={`font-mono font-bold text-[11px] ${isSelected ? theme.skorText : 'text-slate-500'}`}>
                                    Skor: {rubrik.level}.00
                                  </span>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Checklist Bukti Fisik & Dokumen Pendukung */}
                      <div className="bukti-checklist-container space-y-3 bg-slate-50/60 p-4 rounded-xl border border-slate-200">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/80 pb-2.5">
                          <div>
                            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                              <FileCheck2 className="w-4 h-4 text-emerald-700" />
                              <span>Checklist Status Bukti Fisik / Portofolio (BAN-PDM)</span>
                              {!canEditChecklist && (
                                <span className="text-[10px] text-slate-500 font-normal bg-slate-200/70 px-1.5 py-0.2 rounded">
                                  (Read-Only)
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-500 mt-0.5">
                              {canEditChecklist 
                                ? 'Tandai ketersediaan dokumen pendukung: Tersedia, Dalam Proses, atau Belum Ada'
                                : 'Ketersediaan dokumen bukti fisik diunggah dan ditandai oleh Tim Asesi Sekolah'}
                            </p>
                          </div>

                          <div className="flex flex-wrap items-center gap-2 text-[11px]">
                            {canEditChecklist && (
                              <>
                                <button
                                  type="button"
                                  onClick={() => handleSetAllChecklistStatus(ind.id, ind.bukti_fisik || [], 'Tersedia', ind.kode)}
                                  className="text-[10px] font-semibold text-emerald-800 bg-emerald-100/80 hover:bg-emerald-200 px-2 py-0.5 rounded transition-colors"
                                  title="Tandai seluruh dokumen indikator ini menjadi Tersedia"
                                >
                                  Semua Tersedia
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleSetAllChecklistStatus(ind.id, ind.bukti_fisik || [], 'Belum Ada', ind.kode)}
                                  className="text-[10px] font-medium text-slate-600 bg-slate-200/80 hover:bg-slate-300 px-2 py-0.5 rounded transition-colors"
                                  title="Reset checklist dokumen indikator ini"
                                >
                                  Reset
                                </button>
                              </>
                            )}

                            <div className="flex items-center gap-1.5 font-mono font-medium pl-1 border-l border-slate-200">
                              <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                                {tersediaCount}/{totalBukti} Tersedia
                              </span>
                              {dalamProsesCount > 0 && (
                                <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                                  {dalamProsesCount} Proses
                                </span>
                              )}
                              {belumAdaCount > 0 && (
                                <span className="text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                                  {belumAdaCount} Belum
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
                          {ind.bukti_fisik?.map((bf) => {
                            const currentStatus: StatusBuktiFisik = form.bukti_checklist[bf.id] || 'Belum Ada';
                            const bfVersions = getVersionsForBukti(bf.id);
                            const latestVer = bfVersions[0];
                            const versionCount = bfVersions.length;

                            return (
                              <div
                                key={bf.id}
                                className={`p-3 rounded-lg border transition-all flex flex-col justify-between space-y-3 ${
                                  currentStatus === 'Tersedia'
                                    ? 'bg-emerald-50/40 border-emerald-300'
                                    : currentStatus === 'Dalam Proses'
                                    ? 'bg-amber-50/40 border-amber-300'
                                    : 'bg-white border-slate-200'
                                }`}
                              >
                                <div className="space-y-1.5">
                                  <div className="flex items-center justify-between gap-1">
                                    <span className="font-mono text-[10px] text-slate-500 font-bold">
                                      {bf.kode}
                                    </span>
                                    <div className="flex items-center gap-1">
                                      <span className={`text-[10px] px-1.5 py-0.2 rounded font-medium ${
                                        bf.wajib ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-slate-100 text-slate-600'
                                      }`}>
                                        {bf.wajib ? 'Wajib' : 'Opsional'}
                                      </span>

                                      {/* Tombol Riwayat Versi */}
                                      <button
                                        type="button"
                                        onClick={() => handleOpenVersionHistory(bf, ind.kode, ind.nama, currentStatus)}
                                        className="inline-flex items-center gap-1 text-[10px] font-bold text-indigo-700 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 px-1.5 py-0.2 rounded transition-all cursor-pointer"
                                        title={`Lihat riwayat versi & perubahan status dokumen (${versionCount} riwayat)`}
                                      >
                                        <History className="w-2.5 h-2.5 text-indigo-600" />
                                        <span>{latestVer ? latestVer.version_tag : 'v1.0'}</span>
                                        <span className="text-[9px] bg-indigo-200/70 text-indigo-900 px-1 rounded-full font-mono">
                                          {versionCount}
                                        </span>
                                      </button>
                                    </div>
                                  </div>

                                  <div className="font-semibold text-slate-900 text-xs leading-snug">
                                    {bf.nama}
                                  </div>

                                  {bf.deskripsi && (
                                    <p className="text-slate-500 text-[11px] leading-relaxed">
                                      {bf.deskripsi}
                                    </p>
                                  )}

                                  {/* Info revisi terakhir */}
                                  {latestVer && (
                                    <div className="pt-1 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                                      <span className="truncate max-w-[130px]" title={latestVer.user_name}>
                                        ✍️ {latestVer.user_name.split(',')[0]}
                                      </span>
                                      <button
                                        type="button"
                                        onClick={() => handleOpenVersionHistory(bf, ind.kode, ind.nama, currentStatus)}
                                        className="text-indigo-600 hover:underline hover:text-indigo-800 font-sans font-semibold flex items-center gap-0.5 cursor-pointer"
                                      >
                                        <span>Riwayat Versi</span>
                                        <ChevronDown className="w-2.5 h-2.5 -rotate-90" />
                                      </button>
                                    </div>
                                  )}
                                </div>

                                {/* Status Segmented Control (Tersedia | Dalam Proses | Belum Ada) */}
                                {canEditChecklist ? (
                                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-1 bg-slate-100/70 p-1 rounded-lg">
                                    <button
                                      type="button"
                                      onClick={() => handleChecklistStatusChange(ind.id, bf.id, 'Tersedia', ind.kode)}
                                      className={`flex-1 py-1 px-1.5 text-[10px] font-semibold rounded transition-all flex items-center justify-center gap-1 ${
                                        currentStatus === 'Tersedia'
                                          ? 'bg-emerald-600 text-white shadow-xs'
                                          : 'text-slate-600 hover:text-emerald-700 hover:bg-white'
                                      }`}
                                      title="Tandai dokumen sudah tersedia lengkap"
                                    >
                                      <CheckCircle2 className="w-3 h-3 shrink-0" />
                                      <span>Tersedia</span>
                                    </button>

                                    <button
                                      type="button"
                                      onClick={() => handleChecklistStatusChange(ind.id, bf.id, 'Dalam Proses', ind.kode)}
                                      className={`flex-1 py-1 px-1.5 text-[10px] font-semibold rounded transition-all flex items-center justify-center gap-1 ${
                                        currentStatus === 'Dalam Proses'
                                          ? 'bg-amber-600 text-white shadow-xs'
                                          : 'text-slate-600 hover:text-amber-700 hover:bg-white'
                                      }`}
                                      title="Tandai dokumen sedang disiapkan / dalam proses revisi"
                                    >
                                      <Hourglass className="w-3 h-3 shrink-0" />
                                      <span>Proses</span>
                                    </button>

                                    <button
                                      type="button"
                                      onClick={() => handleChecklistStatusChange(ind.id, bf.id, 'Belum Ada', ind.kode)}
                                      className={`flex-1 py-1 px-1.5 text-[10px] font-semibold rounded transition-all flex items-center justify-center gap-1 ${
                                        currentStatus === 'Belum Ada'
                                          ? 'bg-slate-700 text-white shadow-xs'
                                          : 'text-slate-500 hover:text-slate-800 hover:bg-white'
                                      }`}
                                      title="Dokumen belum dibuat atau belum ada"
                                    >
                                      <XCircle className="w-3 h-3 shrink-0" />
                                      <span>Belum</span>
                                    </button>
                                  </div>
                                ) : (
                                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                                    <span className="text-[11px] text-slate-500">Status Kesiapan:</span>
                                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold ${
                                      currentStatus === 'Tersedia'
                                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                        : currentStatus === 'Dalam Proses'
                                        ? 'bg-amber-100 text-amber-800 border border-amber-300'
                                        : 'bg-slate-100 text-slate-600 border border-slate-200'
                                    }`}>
                                      {currentStatus === 'Tersedia' && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                                      {currentStatus === 'Dalam Proses' && <Hourglass className="w-3 h-3 text-amber-600" />}
                                      {currentStatus === 'Belum Ada' && <XCircle className="w-3 h-3 text-slate-500" />}
                                      <span>{currentStatus}</span>
                                    </span>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Lampiran Link Bukti Fisik (Google Drive / Cloud URL) */}
                      <div className="space-y-2 bg-slate-50/70 p-4 rounded-lg border border-slate-200">
                        <label className="text-xs font-semibold text-slate-700 block">
                          Tautan Bukti Dokumen (Google Drive / Nextcloud / Repositori IT):
                        </label>

                        {form.bukti_urls.length > 0 ? (
                          <div className="space-y-1.5 mb-2">
                            {form.bukti_urls.map((url, idx) => (
                              <div
                                key={idx}
                                className="flex items-center justify-between bg-white px-3 py-1.5 rounded border border-slate-200 text-xs"
                              >
                                <a
                                  href={url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-emerald-700 hover:underline flex items-center gap-1.5 truncate max-w-md font-mono"
                                >
                                  <ExternalLink className="w-3 h-3 shrink-0" />
                                  <span className="truncate">{url}</span>
                                </a>
                                {canEditUrls && (
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveUrl(ind.id, idx, ind.kode)}
                                    className="text-slate-400 hover:text-rose-600 ml-2"
                                    title="Hapus Link"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-xs text-slate-400 italic">
                            Belum ada tautan repositori/Google Drive bukti fisik yang dilampirkan.
                          </p>
                        )}

                        {canEditUrls && (
                          <div className="flex gap-2">
                            <input
                              type="url"
                              placeholder="https://drive.google.com/drive/folders/... atau link dokumen bukti"
                              value={form.newUrlInput}
                              onChange={(e) => updateFormState(ind.id, { newUrlInput: e.target.value })}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  handleAddUrl(ind.id, ind.kode);
                                }
                              }}
                              className="flex-1 px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-600"
                            />
                            <button
                              type="button"
                              onClick={() => handleAddUrl(ind.id, ind.kode)}
                              className="px-3 py-1.5 text-xs font-medium bg-slate-800 text-white rounded-lg hover:bg-slate-900 transition-colors flex items-center gap-1 shrink-0"
                            >
                              <Plus className="w-3 h-3" />
                              <span>Tambah Link</span>
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Catatan Evaluasi Diri Asesi & Status Verifikasi */}
                      <div className="evaluasi-catatan-section space-y-3">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                            <span>Catatan Evaluasi Diri SMK IT Ibnul Qayyim Makassar:</span>
                            {!canEditAsesiNotes && (
                              <span className="text-[10px] text-purple-700 font-semibold bg-purple-50 px-2 py-0.5 rounded border border-purple-200 flex items-center gap-1">
                                <Lock className="w-3 h-3" />
                                Terkunci untuk Validator/Viewer
                              </span>
                            )}
                          </label>

                          <div className="flex items-center gap-2">
                            {/* Tombol Bantuan Asisten Pintar Gemini */}
                            <button
                              type="button"
                              onClick={() => setAiAssistantIndikator(ind)}
                              className="ai-assistant-btn inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-gradient-to-r from-[#0084FF] to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 shadow-xs hover:shadow-sm transition-all cursor-pointer group"
                              title="Dapatkan saran pengisian narasi evaluasi diri berdasarkan Definisi Operasional BAN-PDM menggunakan Gemini AI"
                            >
                              <Sparkles className="w-3.5 h-3.5 text-yellow-300 animate-pulse group-hover:scale-110 transition-transform" />
                              <span>Asisten Pintar AI</span>
                              <span className="text-[10px] bg-white/20 px-1 py-0.2 rounded font-normal hidden sm:inline">
                                Gemini
                              </span>
                            </button>

                            <span className={`text-[11px] font-mono ${
                              form.catatan.trim().length < 20 ? 'text-amber-600 font-medium' : 'text-slate-400'
                            }`}>
                              {form.catatan.trim().length} / 3000 karakter
                            </span>
                          </div>
                        </div>

                        <textarea
                          rows={3}
                          readOnly={!canEditAsesiNotes}
                          placeholder={
                            canEditAsesiNotes 
                              ? "Tuliskan uraian kondisi riil di SMK IT Ibnul Qayyim Makassar, penjelasan pelaksanaan proses pembelajaran/manajemen, dan keterkaitan dengan bukti fisik yang dilampirkan..."
                              : "Asesi belum mengisi uraian catatan evaluasi diri."
                          }
                          value={form.catatan}
                          onChange={(e) => handleNotesChange(ind.id, e.target.value, ind.kode)}
                          className={`w-full p-3 text-xs border rounded-lg focus:outline-none focus:ring-1 ${
                            !canEditAsesiNotes 
                              ? 'bg-slate-50/90 text-slate-800 border-slate-200 cursor-default'
                              : form.catatan.trim().length > 0 && form.catatan.trim().length < 20
                              ? 'bg-white border-amber-400 focus:ring-amber-500'
                              : 'bg-white border-slate-200 focus:ring-emerald-600'
                          }`}
                        />

                        {canEditAsesiNotes && form.catatan.trim().length > 0 && form.catatan.trim().length < 20 && (
                          <p className="text-[11px] text-amber-600 flex items-center gap-1">
                            <Info className="w-3 h-3 shrink-0" />
                            Draf otomatis tersimpan. Tambahkan hingga minimal 20 karakter untuk status final terverifikasi.
                          </p>
                        )}
                      </div>

                      {/* PANEL KHUSUS VALIDATOR (Asesor Internal / Auditor Mutu) */}
                      {canValidate ? (
                        <div className="validator-review-panel bg-purple-50/70 border border-purple-200 p-4 rounded-xl space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Shield className="w-4 h-4 text-purple-700" />
                              <h5 className="text-xs font-bold text-purple-950">
                                Panel Validasi &amp; Verifikasi Mutu (Asesor Internal / Validator)
                              </h5>
                            </div>
                            <span className="text-[11px] text-purple-700 font-mono">
                              Verifikator: {currentUser.name}
                            </span>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <div className="space-y-1">
                              <label className="text-xs font-semibold text-purple-900 block">
                                Tetapkan Status Verifikasi:
                              </label>
                              <select
                                value={validatorStatusMap[ind.id] || form.status_verifikasi}
                                onChange={(e) => setValidatorStatusMap((prev) => ({ ...prev, [ind.id]: e.target.value as StatusVerifikasi }))}
                                className="w-full text-xs bg-white border border-purple-300 rounded-lg px-3 py-1.5 text-purple-950 font-semibold focus:outline-none focus:ring-1 focus:ring-purple-600"
                              >
                                <option value="Terverifikasi Valid">✅ Terverifikasi Valid</option>
                                <option value="Perlu Perbaikan">⚠️ Perlu Perbaikan (Revisi Dokumen)</option>
                                <option value="Draf">📝 Draf (Belum Lengkap)</option>
                                <option value="Belum Diunggah">❌ Belum Diunggah</option>
                              </select>
                            </div>

                            <div className="md:col-span-2 space-y-1">
                              <label className="text-xs font-semibold text-purple-900 block">
                                Catatan / Rekomendasi Validasi untuk Tim Asesi:
                              </label>
                              <input
                                type="text"
                                placeholder="Tuliskan catatan verifikasi, rekomendasi dokumen tambahan, atau catatan audit..."
                                value={validatorNotesMap[ind.id] !== undefined ? validatorNotesMap[ind.id] : (savedEval?.catatan_validator || '')}
                                onChange={(e) => setValidatorNotesMap((prev) => ({ ...prev, [ind.id]: e.target.value }))}
                                className="w-full text-xs bg-white border border-purple-300 rounded-lg px-3 py-1.5 text-purple-950 placeholder-purple-300 focus:outline-none focus:ring-1 focus:ring-purple-600"
                              />
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-1">
                            <span className="text-[11px] text-purple-800">
                              Status saat ini: <strong className="font-semibold">{form.status_verifikasi}</strong>
                              {savedEval?.verified_by && ` (oleh ${savedEval.verified_by})`}
                            </span>

                            <button
                              type="button"
                              onClick={() => handleValidatorReview(ind.id)}
                              disabled={savingValidatorId === ind.id}
                              className="px-4 py-1.5 bg-purple-700 hover:bg-purple-800 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 shadow-xs disabled:bg-purple-300"
                            >
                              {savingValidatorId === ind.id ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              ) : (
                                <Shield className="w-3.5 h-3.5" />
                              )}
                              <span>Simpan Status Validasi</span>
                            </button>
                          </div>
                        </div>
                      ) : savedEval?.catatan_validator ? (
                        <div className="bg-purple-50/80 border border-purple-200 p-3 rounded-lg text-xs space-y-1">
                          <div className="flex items-center gap-1.5 text-purple-900 font-bold">
                            <Shield className="w-3.5 h-3.5 text-purple-700" />
                            <span>Catatan / Masukan dari Validator ({savedEval.verified_by || 'Asesor'}):</span>
                          </div>
                          <p className="text-purple-950 leading-relaxed pl-5">
                            "{savedEval.catatan_validator}"
                          </p>
                        </div>
                      ) : null}

                      {/* Peringatan Visual Validasi Bukti Dukung Sebelum Status Selesai */}
                      {form.status_verifikasi === 'Selesai' && !buktiValidation.isValid ? (
                        <div className="p-3.5 bg-rose-50 border-2 border-rose-300 rounded-xl space-y-2 text-xs">
                          <div className="flex items-start gap-2.5">
                            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                            <div className="space-y-1.5 flex-1">
                              <div className="flex flex-wrap items-center justify-between gap-1">
                                <p className="font-bold text-rose-900 text-xs">
                                  ⚠️ Peringatan Validasi: Bukti Dukung Belum Memenuhi Syarat Status 'Selesai'
                                </p>
                                <span className="text-[10px] font-bold bg-rose-200 text-rose-900 px-2 py-0.5 rounded-full">
                                  {buktiValidation.tersediaBuktiWajib}/{buktiValidation.totalBuktiWajib} Bukti Wajib Tersedia
                                </span>
                              </div>
                              <p className="text-rose-700 text-[11px] leading-relaxed">
                                Status indikator ini diatur ke <strong>Selesai</strong>, namun sistem mendeteksi kekurangan bukti fisik atau uraian evaluasi diri yang diwajibkan oleh BAN-PDM:
                              </p>
                              <ul className="list-disc list-inside text-[11px] text-rose-800 space-y-1 bg-white/70 p-2.5 rounded-lg border border-rose-200 font-medium">
                                {buktiValidation.errors.map((err, i) => (
                                  <li key={i}>{err}</li>
                                ))}
                              </ul>
                              {buktiValidation.missingMandatoryBukti.length > 0 && (
                                <p className="text-[10px] text-rose-700 font-semibold pt-0.5">
                                  Dokumen wajib yang belum Tersedia: {buktiValidation.missingMandatoryBukti.map((m) => `${m.kode} - ${m.nama}`).join(', ')}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      ) : form.status_verifikasi === 'Selesai' && buktiValidation.isValid ? (
                        <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl flex items-center justify-between gap-2 text-xs text-emerald-900">
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                            <div>
                              <p className="font-bold text-emerald-950">Status Selesai: Bukti Dukung Sah &amp; Lengkap</p>
                              <p className="text-[11px] text-emerald-700">
                                Seluruh {buktiValidation.totalBuktiWajib} bukti wajib berstatus Tersedia dan tautan repositori digital telah terverifikasi.
                              </p>
                            </div>
                          </div>
                          <span className="text-[11px] font-mono font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-md border border-emerald-200 shrink-0">
                            Cakupan Bukti: {buktiValidation.checklistCoveragePercent}%
                          </span>
                        </div>
                      ) : !buktiValidation.isValid ? (
                        <div className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between gap-2 text-[11px] text-slate-600">
                          <span className="flex items-center gap-1.5">
                            <Info className="w-3.5 h-3.5 text-slate-400" />
                            <span>Kesiapan Status Selesai: {buktiValidation.tersediaBuktiWajib}/{buktiValidation.totalBuktiWajib} bukti wajib tersedia · {buktiValidation.hasValidBuktiUrl ? '✓ Link cloud ada' : 'Tautan cloud belum ada'} · {buktiValidation.catatanValid ? '✓ Catatan cukup' : 'Catatan < 20 karakter'}</span>
                          </span>
                        </div>
                      ) : (
                        <div className="px-3 py-1.5 bg-emerald-50/50 border border-emerald-200/60 rounded-lg flex items-center justify-between gap-2 text-[11px] text-emerald-700">
                          <span className="flex items-center gap-1.5 font-medium">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Bukti dukung lengkap &amp; valid. Indikator ini siap diubah ke status 'Selesai'.</span>
                          </span>
                        </div>
                      )}

                      {/* Baris Status Bar Visual & Tombol Aksi Simpan untuk Asesi/Admin */}
                      {canEditAsesiNotes && (
                        <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-slate-100">
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-slate-500">Status Pengisian Asesi:</span>
                            <select
                              value={form.status_verifikasi}
                              onChange={(e) => handleStatusVerifikasiChange(ind.id, e.target.value as StatusVerifikasi, ind.kode)}
                              className="text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-slate-700 font-medium focus:outline-none focus:ring-1 focus:ring-emerald-600"
                            >
                              <option value="Draf">Draf (Sedang Disusun)</option>
                              <option value="Belum Diunggah">Belum Diunggah</option>
                              <option value="Perlu Perbaikan">Perlu Perbaikan</option>
                              <option value="Selesai">✅ Selesai (Pengisian &amp; Bukti Lengkap)</option>
                              {isAdmin && <option value="Terverifikasi Valid">Terverifikasi Valid (Admin)</option>}
                            </select>
                          </div>

                          <div className="flex flex-wrap items-center gap-3 self-end sm:self-auto">
                            {/* Visual Feedback Status Bar per Indikator */}
                            {isAutoSaveEnabled && (
                              <div className="text-xs">
                                {autoSaveInfo.state === 'saving' ? (
                                  <span className="inline-flex items-center gap-1.5 text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-md font-medium">
                                    <Loader2 className="w-3 h-3 animate-spin" />
                                    <span>Menyimpan otomatis...</span>
                                  </span>
                                ) : autoSaveInfo.state === 'pending' ? (
                                  <span className="inline-flex items-center gap-1.5 text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-md font-medium animate-pulse">
                                    <Clock className="w-3 h-3" />
                                    <span>Menyimpan dalam 500ms...</span>
                                  </span>
                                ) : autoSaveInfo.state === 'saved' ? (
                                  <span className="inline-flex items-center gap-1.5 text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-md font-medium">
                                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                    <span>Tersimpan otomatis ({autoSaveInfo.lastSaved})</span>
                                  </span>
                                ) : autoSaveInfo.state === 'error' ? (
                                  <span className="inline-flex items-center gap-1.5 text-rose-700 bg-rose-50 border border-rose-200 px-2.5 py-1 rounded-md font-medium">
                                    <AlertCircle className="w-3 h-3" />
                                    <span>{autoSaveInfo.error || 'Gagal simpan otomatis'}</span>
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1.5 text-slate-500 bg-slate-50 border border-slate-200 px-2 py-1 rounded-md text-[11px]">
                                    <Zap className="w-3 h-3 text-emerald-600" />
                                    <span>Auto-Save Siap</span>
                                  </span>
                                )}
                              </div>
                            )}

                            {currentFeedback && (
                              <span className={`text-xs font-medium flex items-center gap-1 ${
                                currentFeedback.type === 'success' ? 'text-emerald-700' : 'text-rose-600'
                              }`}>
                                {currentFeedback.type === 'success' ? (
                                  <Check className="w-3.5 h-3.5" />
                                ) : (
                                  <AlertCircle className="w-3.5 h-3.5" />
                                )}
                                <span>{currentFeedback.text}</span>
                              </span>
                            )}

                            <button
                              type="button"
                              onClick={() => handleSave(ind.id)}
                              disabled={isSaving}
                              className={`flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold rounded-xl text-white transition-all ${
                                isSaving
                                  ? 'bg-orange-300 cursor-not-allowed'
                                  : 'bg-[#FF5722] hover:bg-[#E64A19] shadow-xs active:scale-[0.98]'
                              }`}
                              title="Simpan evaluasi secara manual & verifikasi validasi"
                            >
                              <Save className="w-3.5 h-3.5" />
                              <span>{isSaving ? 'Menyimpan...' : 'Simpan Manual'}</span>
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Footer Informasi Audit Log & Pengedit Terakhir */}
                      <div className="pt-3 border-t border-slate-100/80 flex flex-wrap items-center justify-between gap-2 text-xs">
                        <div className="flex items-center gap-1.5 text-slate-500">
                          <User className="w-3.5 h-3.5 text-slate-400" />
                          <span>Terakhir diubah oleh:</span>
                          <span className="font-semibold text-slate-800">
                            {savedEval?.last_edited_by || savedEval?.verified_by || 'Belum ada perubahan'}
                          </span>
                          {savedEval?.last_edited_role && (
                            <span className="text-slate-400 text-[11px]">({savedEval.last_edited_role})</span>
                          )}
                          <span className="text-slate-300">·</span>
                          <span className="text-slate-400 font-mono text-[11px]">
                            {formatTimestamp(savedEval?.updated_at)}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => toggleLogView(ind.id)}
                          className="flex items-center gap-1.5 text-xs font-medium text-indigo-700 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100/80 px-2.5 py-1 rounded-md transition-colors"
                        >
                          <History className="w-3.5 h-3.5" />
                          <span>Log Aktivitas ({indicatorLogs.length})</span>
                          {isLogOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                        </button>
                      </div>

                      {/* Expandable Activity Log Drawer */}
                      {isLogOpen && (
                        <div className="mt-3 p-4 bg-slate-100/70 border border-slate-200 rounded-xl space-y-3">
                          <div className="flex items-center justify-between">
                            <h5 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                              <History className="w-4 h-4 text-indigo-700" />
                              <span>Riwayat Pengeditan &amp; Audit Trail ({ind.kode})</span>
                            </h5>
                            <span className="text-[11px] text-slate-500">
                              Total {indicatorLogs.length} riwayat tercatat
                            </span>
                          </div>

                          <ActivityLogTimeline
                            logs={indicatorLogs}
                            indikatorKode={ind.kode}
                            emptyMessage={`Belum ada log aktivitas untuk indikator ${ind.kode}.`}
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>

    {/* Panel Catatan Reviewer & Kolaborasi Tim */}
    <ReviewerNotesPanel
      isOpen={isReviewerPanelOpen}
      onClose={() => setIsReviewerPanelOpen(false)}
      isPinned={isReviewerPanelPinned}
      onTogglePin={() => setIsReviewerPanelPinned(!isReviewerPanelPinned)}
      notes={reviewerNotes}
      onNotesChange={setReviewerNotes}
      currentUser={currentUser}
      komponenList={komponenList}
      selectedKomponenId={selectedKomponenId}
      activeIndikatorId={selectedIndikatorId !== 'all' ? selectedIndikatorId : null}
      onSelectIndikator={handleSelectIndikatorFromNotes}
    />
  </div>

  {/* Floating Button Akses Cepat Catatan Reviewer saat Panel Tertutup */}
  {!isReviewerPanelOpen && (
    <button
      type="button"
      onClick={() => setIsReviewerPanelOpen(true)}
      title="Buka Panel Catatan Reviewer & Kolaborasi"
      className="fixed right-5 bottom-6 z-40 inline-flex items-center gap-2.5 px-4 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-full shadow-2xl border border-slate-700 hover:scale-105 active:scale-95 transition-all text-xs font-bold group cursor-pointer"
    >
      <div className="relative">
        <MessageSquare className="w-4 h-4 text-amber-400 group-hover:rotate-12 transition-transform" />
        {reviewerNotes.filter((n) => n.komponen_id === selectedKomponenId && n.status !== 'selesai').length > 0 && (
          <span className="absolute -top-1 -right-1.5 w-2 h-2 bg-rose-500 rounded-full animate-ping" />
        )}
      </div>
      <span>Catatan Reviewer</span>
      {reviewerNotes.filter((n) => n.komponen_id === selectedKomponenId && n.status !== 'selesai').length > 0 && (
        <span className="bg-amber-400 text-slate-950 px-2 py-0.5 rounded-full text-[10px] font-black">
          {reviewerNotes.filter((n) => n.komponen_id === selectedKomponenId && n.status !== 'selesai').length}
        </span>
      )}
    </button>
  )}

      {/* Modal Asisten Pintar AI */}
      {aiAssistantIndikator && (() => {
        const indForm = getFormState(aiAssistantIndikator.id);
        const selectedCapaian = indForm.capaian;
        const levelNum = 
          selectedCapaian === 'Sangat Baik' ? 4 :
          selectedCapaian === 'Baik' ? 3 :
          selectedCapaian === 'Cukup Baik' ? 2 : 1;
        const kategoriText =
          selectedCapaian === 'Sangat Baik' ? 'Kinerja Unggul' :
          selectedCapaian === 'Baik' ? 'Kinerja Baik' :
          selectedCapaian === 'Cukup Baik' ? 'Kinerja Cukup' : 'Kinerja Kurang';
        const deskripsiRubrik = aiAssistantIndikator.rubrik_penilaian?.find(
          (r) => r.kategori === selectedCapaian || r.level === levelNum
        )?.deskripsi || '';

        return (
          <AsistenPintarModal
            isOpen={Boolean(aiAssistantIndikator)}
            onClose={() => setAiAssistantIndikator(null)}
            indikator={aiAssistantIndikator}
            levelCapaian={levelNum}
            kategoriCapaian={kategoriText}
            deskripsiRubrik={deskripsiRubrik}
            buktiChecklist={indForm.bukti_checklist || {}}
            currentCatatan={indForm.catatan || ''}
            onApplySuggestion={handleApplyAiSuggestion}
            canEdit={canEditAsesiNotes}
          />
        );
      })()}
      {/* Modal Riwayat Versi Dokumen Bukti Fisik */}
      <RiwayatVersiBuktiModal
        isOpen={isVersionModalOpen}
        onClose={() => setIsVersionModalOpen(false)}
        buktiFisik={activeVersionBukti}
        indikatorKode={activeVersionIndikatorKode}
        indikatorNama={activeVersionIndikatorNama}
        currentStatus={activeVersionStatus}
        currentUser={currentUser}
        onStatusUpdated={handleVersionStatusUpdated}
      />

      {/* Modal Pratinjau Cetak Formal (Print Preview Dokumen Formal) */}
      <InstrumenPrintPreviewModal
        isOpen={isPrintPreviewOpen}
        onClose={() => setIsPrintPreviewOpen(false)}
        komponenList={komponenList}
        evaluasiMap={evaluasiMap}
        currentKomponenId={selectedKomponenId}
        currentUser={currentUser}
      />
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { DashboardOverview } from './components/DashboardOverview';
import { InstrumenEvaluasi } from './components/InstrumenEvaluasi';
import { SqlStudio } from './components/SqlStudio';
import { VanillaCodeStudio } from './components/VanillaCodeStudio';
import { SupabaseConnectModal } from './components/SupabaseConnectModal';
import { ExportReportModal } from './components/ExportReportModal';
import { INITIAL_KOMPONEN_DATA, INITIAL_EVALUASI_DATA } from './data/akreditasiData';
import { 
  getAllStoredEvaluasi, 
  initLocalStorage, 
  getStoredConfig,
  getCurrentUser,
  setCurrentUser
} from './services/evaluasiService';
import { startAppTour, TourType } from './services/tourService';
import { EvaluasiAsesi, Komponen, UserProfile } from './types/akreditasi';

export default function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'instrumen' | 'sql' | 'vanilla'>('dashboard');
  const [komponenList] = useState<Komponen[]>(INITIAL_KOMPONEN_DATA);
  const [selectedKomponenId, setSelectedKomponenId] = useState<string>(INITIAL_KOMPONEN_DATA[0].id);
  const [evaluasiMap, setEvaluasiMap] = useState<Record<string, EvaluasiAsesi>>({});
  const [isConnectModalOpen, setIsConnectModalOpen] = useState<boolean>(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);
  const [isSupabaseLive, setIsSupabaseLive] = useState<boolean>(false);
  const [isFocusMode, setIsFocusMode] = useState<boolean>(false);
  const [currentUser, setAppCurrentUser] = useState<UserProfile>(() => getCurrentUser());

  const handleStartTour = (type: TourType = 'full') => {
    startAppTour({
      type,
      activeTab,
      setActiveTab,
    });
  };

  // Inisialisasi storage
  useEffect(() => {
    initLocalStorage(INITIAL_EVALUASI_DATA);
    const stored = getAllStoredEvaluasi();
    setEvaluasiMap(stored);

    const cfg = getStoredConfig();
    setIsSupabaseLive(cfg.isActive && !!cfg.url && !!cfg.anonKey);
    setAppCurrentUser(getCurrentUser());
  }, []);

  const handleUserChanged = (user: UserProfile) => {
    setCurrentUser(user);
    setAppCurrentUser(user);
  };

  const handleConfigChanged = () => {
    const cfg = getStoredConfig();
    setIsSupabaseLive(cfg.isActive && !!cfg.url && !!cfg.anonKey);
    const stored = getAllStoredEvaluasi();
    setEvaluasiMap(stored);
  };

  const handleEvaluasiUpdated = (item: EvaluasiAsesi) => {
    setEvaluasiMap((prev) => ({
      ...prev,
      [item.indikator_id]: item,
    }));
  };

  const handleSelectKomponenFromDashboard = (kompId: string) => {
    setSelectedKomponenId(kompId);
    setActiveTab('instrumen');
  };

  // Keyboard shortcut Esc untuk keluar dari Focus Mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFocusMode) {
        setIsFocusMode(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFocusMode]);

  const showFocusView = isFocusMode && activeTab === 'instrumen';

  return (
    <div className={`min-h-screen bg-[#F4F7FC] flex flex-col font-sans overflow-x-hidden max-w-full ${showFocusView ? 'bg-[#EEF2F8]' : ''}`}>
      {/* Top Bar Contract (Wordmark, Nav tabs, Actions) - Sembunyikan saat Focus View aktif */}
      {!showFocusView && (
        <Header
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenConnect={() => setIsConnectModalOpen(true)}
          onOpenExport={() => setIsExportModalOpen(true)}
          isSupabaseLive={isSupabaseLive}
          currentUser={currentUser}
          onUserChanged={handleUserChanged}
          onStartTour={() => handleStartTour('full')}
        />
      )}

      {/* Main Content Viewport */}
      <main className={`flex-1 w-full mx-auto ${
        showFocusView 
          ? 'p-0 max-w-none' 
          : 'max-w-7xl px-4 sm:px-6 lg:px-8 py-6'
      }`}>
        {activeTab === 'dashboard' && (
          <DashboardOverview
            komponenList={komponenList}
            evaluasiMap={evaluasiMap}
            onSelectKomponen={handleSelectKomponenFromDashboard}
            onNavigateToSql={() => setActiveTab('sql')}
            onNavigateToVanilla={() => setActiveTab('vanilla')}
            onStartTour={() => handleStartTour('dashboard')}
          />
        )}

        {activeTab === 'instrumen' && (
          <InstrumenEvaluasi
            komponenList={komponenList}
            selectedKomponenId={selectedKomponenId}
            setSelectedKomponenId={setSelectedKomponenId}
            evaluasiMap={evaluasiMap}
            onEvaluasiUpdated={handleEvaluasiUpdated}
            isFocusMode={isFocusMode}
            setIsFocusMode={setIsFocusMode}
            currentUser={currentUser}
            onUserChanged={handleUserChanged}
            onStartTour={() => handleStartTour('instrumen')}
          />
        )}

        {activeTab === 'sql' && <SqlStudio />}

        {activeTab === 'vanilla' && <VanillaCodeStudio />}
      </main>

      {/* Footer Bersih - Sembunyikan saat Focus View aktif */}
      {!showFocusView && (
        <footer className="bg-white border-t border-slate-200 mt-12 py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
            <div>
              <span>© 2026 SMK IT Ibnul Qayyim Makassar</span>
              <span aria-hidden="true" className="mx-2">·</span>
              <span>Instrumen Akreditasi BAN-PDM SMK/MAK 2024 (Versi 2025)</span>
            </div>
            <div className="flex items-center gap-4 text-xs font-medium">
              <button
                onClick={() => setActiveTab('sql')}
                className="hover:text-slate-900 transition-colors"
              >
                Skema SQL DDL
              </button>
              <button
                onClick={() => setActiveTab('vanilla')}
                className="hover:text-slate-900 transition-colors"
              >
                Vanilla JS Supabase
              </button>
              <button
                onClick={() => setIsConnectModalOpen(true)}
                className="hover:text-slate-900 transition-colors"
              >
                Koneksi BaaS
              </button>
            </div>
          </div>
        </footer>
      )}

      {/* Modals */}
      <SupabaseConnectModal
        isOpen={isConnectModalOpen}
        onClose={() => setIsConnectModalOpen(false)}
        onConfigChanged={handleConfigChanged}
      />

      <ExportReportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        komponenList={komponenList}
        evaluasiMap={evaluasiMap}
      />
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { Header, AppNavTab } from './components/Header';
import { DashboardOverview } from './components/DashboardOverview';
import { InstrumenEvaluasi } from './components/InstrumenEvaluasi';
import { SqlStudio } from './components/SqlStudio';
import { VanillaCodeStudio } from './components/VanillaCodeStudio';
import { LoginPage } from './components/LoginPage';
import { PengaturanMenu } from './components/PengaturanMenu';
import { SupabaseConnectModal } from './components/SupabaseConnectModal';
import { ExportReportModal } from './components/ExportReportModal';
import { InstrumenPrintPreviewModal } from './components/InstrumenPrintPreviewModal';
import { INITIAL_KOMPONEN_DATA, INITIAL_EVALUASI_DATA } from './data/akreditasiData';
import { 
  getAllStoredEvaluasi, 
  initLocalStorage, 
  getStoredConfig,
  setCurrentUser
} from './services/evaluasiService';
import { 
  getAuthSession, 
  logoutUser, 
  switchUserDirectly 
} from './services/authService';
import { UserAccount } from './types/auth';
import { getAllDeadlineAlerts, getDeadlineSummaryMetrics } from './services/deadlineService';
import { startAppTour, TourType } from './services/tourService';
import { EvaluasiAsesi, Komponen, UserProfile } from './types/akreditasi';

export default function App() {
  const [activeTab, setActiveTab] = useState<AppNavTab>('login');
  const [komponenList] = useState<Komponen[]>(INITIAL_KOMPONEN_DATA);
  const [selectedKomponenId, setSelectedKomponenId] = useState<string>(INITIAL_KOMPONEN_DATA[0].id);
  const [targetIndikatorId, setTargetIndikatorId] = useState<string | null>(null);
  const [evaluasiMap, setEvaluasiMap] = useState<Record<string, EvaluasiAsesi>>({});
  const [isConnectModalOpen, setIsConnectModalOpen] = useState<boolean>(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);
  const [isGlobalPrintPreviewOpen, setIsGlobalPrintPreviewOpen] = useState<boolean>(false);
  const [isSupabaseLive, setIsSupabaseLive] = useState<boolean>(false);
  const [isFocusMode, setIsFocusMode] = useState<boolean>(false);
  
  // Auth & User Session
  const [currentAccount, setCurrentAccount] = useState<UserAccount>(() => getAuthSession().currentUser);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => getAuthSession().isLoggedIn);

  // Kalkulasi ringkasan peringatan jatuh tempo untuk notifikasi global
  const deadlineMetrics = React.useMemo(() => {
    const alerts = getAllDeadlineAlerts(komponenList, evaluasiMap);
    return getDeadlineSummaryMetrics(alerts);
  }, [komponenList, evaluasiMap]);

  const handleNavigateToAlerts = () => {
    setActiveTab('dashboard');
    setTimeout(() => {
      const el = document.getElementById('dashboard-deadline-alerts');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const handleSelectIndikatorFromDashboard = (kompId: string, indId: string) => {
    setSelectedKomponenId(kompId);
    setTargetIndikatorId(indId);
    setActiveTab('instrumen');
  };

  const handleStartTour = (type: TourType = 'full') => {
    if (isFocusMode && type !== 'instrumen') {
      setIsFocusMode(false);
    }
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

    const sess = getAuthSession();
    setCurrentAccount(sess.currentUser);
    setIsLoggedIn(sess.isLoggedIn);
    setCurrentUser(sess.currentUser);
  }, []);

  const handleUserChanged = (user: UserProfile) => {
    setCurrentUser(user);
    const updated = switchUserDirectly(user.id || '');
    if (updated) {
      setCurrentAccount(updated);
    } else {
      setCurrentAccount((prev) => ({ ...prev, ...user }));
    }
  };

  const handleLoginSuccess = (account: UserAccount) => {
    setCurrentAccount(account);
    setIsLoggedIn(true);
    setCurrentUser(account);
    setActiveTab('dashboard');
  };

  const handleLogout = () => {
    logoutUser();
    const sess = getAuthSession();
    setCurrentAccount(sess.currentUser);
    setIsLoggedIn(false);
    setActiveTab('login');
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
  const isLoginPage = activeTab === 'login';

  return (
    <div className={`min-h-screen flex flex-col font-sans overflow-x-hidden max-w-full ${
      isLoginPage 
        ? 'bg-[#062c24]' 
        : showFocusView 
          ? 'bg-[#EEF2F8]' 
          : 'bg-[#F4F7FC]'
    }`}>
      {/* Top Bar Contract (Wordmark, Nav tabs, Actions) - Sembunyikan saat Focus View atau Login Page aktif */}
      {!showFocusView && !isLoginPage && (
        <Header
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenConnect={() => setIsConnectModalOpen(true)}
          onOpenExport={() => setIsExportModalOpen(true)}
          isSupabaseLive={isSupabaseLive}
          currentUser={currentAccount}
          isLoggedIn={isLoggedIn}
          onUserChanged={handleUserChanged}
          onLogout={handleLogout}
          onStartTour={() => handleStartTour('full')}
          urgentDeadlineCount={deadlineMetrics.urgentTotal}
          onNavigateToAlerts={handleNavigateToAlerts}
        />
      )}

      {/* Main Content Viewport */}
      <main className={`flex-1 w-full mx-auto ${
        showFocusView || isLoginPage
          ? 'p-0 max-w-none' 
          : 'max-w-7xl px-4 sm:px-6 lg:px-8 py-6'
      }`}>
        {activeTab === 'login' && (
          <LoginPage
            currentUser={currentAccount}
            isLoggedIn={isLoggedIn}
            onLoginSuccess={handleLoginSuccess}
            onLogout={handleLogout}
            onNavigateToDashboard={() => setActiveTab('dashboard')}
            onNavigateToPengaturan={() => setActiveTab('pengaturan')}
          />
        )}

        {activeTab === 'pengaturan' && (
          <PengaturanMenu
            currentUser={currentAccount}
            onUserChanged={(acc) => {
              setCurrentAccount(acc);
              setCurrentUser(acc);
            }}
            onLogout={handleLogout}
            onNavigateToLogin={() => setActiveTab('login')}
            onNavigateToDashboard={() => setActiveTab('dashboard')}
          />
        )}

        {activeTab === 'dashboard' && (
          <DashboardOverview
            komponenList={komponenList}
            evaluasiMap={evaluasiMap}
            onSelectKomponen={handleSelectKomponenFromDashboard}
            onSelectIndikator={handleSelectIndikatorFromDashboard}
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
            targetIndikatorId={targetIndikatorId}
            setTargetIndikatorId={setTargetIndikatorId}
            evaluasiMap={evaluasiMap}
            onEvaluasiUpdated={handleEvaluasiUpdated}
            isFocusMode={isFocusMode}
            setIsFocusMode={setIsFocusMode}
            currentUser={currentAccount}
            onUserChanged={handleUserChanged}
            onStartTour={() => handleStartTour('instrumen')}
          />
        )}

        {activeTab === 'sql' && <SqlStudio />}

        {activeTab === 'vanilla' && <VanillaCodeStudio />}
      </main>

      {/* Footer Bersih - Sembunyikan saat Focus View atau Login Page aktif */}
      {!showFocusView && !isLoginPage && (
        <footer className="bg-white border-t border-slate-200 mt-12 py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
            <div>
              <span>© 2026 SMK IT Ibnul Qayyim Makassar</span>
              <span aria-hidden="true" className="mx-2">·</span>
              <span>Instrumen Akreditasi BAN-PDM SMK/MAK 2024 (Versi 2025)</span>
            </div>
            <div className="flex items-center gap-4 text-xs font-medium">
              <button
                onClick={() => setActiveTab('pengaturan')}
                className="hover:text-blue-600 transition-colors font-semibold text-slate-700"
              >
                Pengaturan & Sandi Akses
              </button>
              <button
                onClick={() => setActiveTab('login')}
                className="hover:text-blue-600 transition-colors"
              >
                Portal Login
              </button>
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
        onOpenPrintPreview={() => {
          setIsExportModalOpen(false);
          setIsGlobalPrintPreviewOpen(true);
        }}
      />

      {/* Modal Pratinjau Cetak Formal (Print Preview Global) */}
      <InstrumenPrintPreviewModal
        isOpen={isGlobalPrintPreviewOpen}
        onClose={() => setIsGlobalPrintPreviewOpen(false)}
        komponenList={komponenList}
        evaluasiMap={evaluasiMap}
        currentKomponenId={selectedKomponenId}
        currentUser={currentAccount}
      />
    </div>
  );
}

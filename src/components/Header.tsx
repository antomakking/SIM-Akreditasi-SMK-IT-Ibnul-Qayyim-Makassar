import React, { useState, useRef, useEffect } from 'react';
import { 
  Database, 
  FileCode2, 
  LayoutDashboard, 
  ClipboardCheck, 
  Settings, 
  Download, 
  Shield, 
  Crown, 
  Edit3, 
  Eye, 
  ChevronDown, 
  Check,
  Menu,
  X,
  Compass,
  Bell,
  KeyRound,
  LogOut,
  LogIn
} from 'lucide-react';
import { UserProfile, UserRole } from '../types/akreditasi';
import { DEFAULT_TEAM_USERS } from '../services/evaluasiService';

export type AppNavTab = 'dashboard' | 'instrumen' | 'sql' | 'vanilla' | 'pengaturan' | 'login';

interface HeaderProps {
  activeTab: AppNavTab;
  setActiveTab: (tab: AppNavTab) => void;
  onOpenConnect: () => void;
  onOpenExport: () => void;
  isSupabaseLive: boolean;
  currentUser: UserProfile;
  isLoggedIn?: boolean;
  onUserChanged: (user: UserProfile) => void;
  onLogout?: () => void;
  onStartTour?: () => void;
  urgentDeadlineCount?: number;
  onNavigateToAlerts?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenConnect,
  onOpenExport,
  isSupabaseLive = true,
  currentUser,
  isLoggedIn = true,
  onUserChanged,
  onLogout,
  onStartTour,
  urgentDeadlineCount,
  onNavigateToAlerts,
}) => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const mobileNavRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
      if (mobileNavRef.current && !mobileNavRef.current.contains(e.target as Node)) {
        setIsMobileNavOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'Admin':
        return {
          icon: <Crown className="w-3 h-3 text-amber-600" />,
          label: 'Admin',
          badgeClass: 'bg-amber-50 text-amber-700 border-amber-200',
        };
      case 'Validator':
        return {
          icon: <Shield className="w-3 h-3 text-purple-600" />,
          label: 'Validator',
          badgeClass: 'bg-purple-50 text-purple-700 border-purple-200',
        };
      case 'Asesi':
        return {
          icon: <Edit3 className="w-3 h-3 text-emerald-600" />,
          label: 'Asesi',
          badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        };
      case 'Viewer':
      default:
        return {
          icon: <Eye className="w-3 h-3 text-slate-500" />,
          label: 'Viewer',
          badgeClass: 'bg-slate-100 text-slate-600 border-slate-200',
        };
    }
  };

  const currentBadge = getRoleBadge(currentUser.role);

  const navItems: {
    id: AppNavTab;
    label: string;
    shortLabel: string;
    icon: React.ReactNode;
  }[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      shortLabel: 'Dashboard',
      icon: <LayoutDashboard className="w-3.5 h-3.5 shrink-0" />,
    },
    {
      id: 'instrumen',
      label: 'Instrumen Asesi',
      shortLabel: 'Instrumen',
      icon: <ClipboardCheck className="w-3.5 h-3.5 shrink-0" />,
    },
    {
      id: 'pengaturan',
      label: 'Pengaturan & Password',
      shortLabel: 'Pengaturan',
      icon: <Settings className="w-3.5 h-3.5 shrink-0" />,
    },
    {
      id: 'sql',
      label: 'Skema SQL',
      shortLabel: 'SQL (DDL)',
      icon: <Database className="w-3.5 h-3.5 shrink-0" />,
    },
    {
      id: 'vanilla',
      label: 'Supabase.js',
      shortLabel: 'Modular JS',
      icon: <FileCode2 className="w-3.5 h-3.5 shrink-0" />,
    },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 w-full overflow-visible">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
        <div className="flex items-center justify-between h-14 sm:h-16 gap-1 sm:gap-2">
          
          {/* Zone 1: Brand Wordmark (Adaptive) */}
          <div id="header-brand" className="flex items-center gap-2 sm:gap-2.5 shrink-0 min-w-0">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-[#0084FF] to-[#0066CC] text-white flex items-center justify-center font-black text-sm sm:text-base shadow-xs shrink-0">
              IQ
            </div>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setActiveTab('dashboard');
              }}
              className="text-xs sm:text-sm md:text-base font-bold tracking-tight text-slate-900 hover:text-[#0084FF] transition-colors flex items-center gap-1"
            >
              <span>SIM Akreditasi</span>
              <span className="hidden xl:inline text-slate-600 font-semibold">SMK IT Ibnul Qayyim</span>
              <span className="hidden sm:inline xl:hidden text-slate-600 font-medium">SMK IT</span>
            </a>
          </div>

          {/* Zone 2: Navigation Links (Desktop/Laptop) */}
          <nav id="header-nav-tabs" className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`header-tab-${item.id}`}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-xl transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-orange-50/90 text-[#FF5722] font-bold shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 font-medium'
                  }`}
                >
                  {item.icon}
                  <span className="hidden xl:inline">{item.label}</span>
                  <span className="xl:hidden">{item.shortLabel}</span>
                </button>
              );
            })}
          </nav>

          {/* Medium Screen Nav (md only - Icon only with tooltip or compact badges) */}
          <nav className="hidden md:flex lg:hidden items-center gap-1">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`header-tab-md-${item.id}`}
                  onClick={() => setActiveTab(item.id)}
                  title={item.label}
                  className={`flex items-center gap-1 px-2.5 py-1.5 text-xs rounded-xl transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-orange-50 text-[#FF5722] font-bold shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-medium'
                  }`}
                >
                  {item.icon}
                  <span className="text-[11px]">{item.shortLabel}</span>
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Actions & Role Selector */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            
            {/* Tour Interaktif Button */}
            {onStartTour && (
              <button
                type="button"
                id="header-tour-btn"
                onClick={onStartTour}
                className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 text-xs font-semibold rounded-xl border border-indigo-200 bg-indigo-50/80 text-indigo-700 hover:bg-indigo-100 hover:border-indigo-300 transition-all cursor-pointer shadow-2xs group"
                title="Mulai Panduan Tour Interaktif Sistem"
              >
                <Compass className="w-3.5 h-3.5 text-indigo-600 group-hover:rotate-45 transition-transform" />
                <span className="hidden sm:inline">Panduan Tour</span>
              </button>
            )}

            {/* User & Role Dropdown Switcher */}
            <div id="header-role-selector" className="relative" ref={menuRef}>
              <button
                type="button"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className={`flex items-center gap-1.5 px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-xl border text-xs font-medium transition-all ${
                  isUserMenuOpen ? 'border-slate-400 bg-slate-50' : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
                title="Ganti Peran Pengguna (Admin, Asesi, Validator, Viewer)"
              >
                <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-bold border ${currentBadge.badgeClass}`}>
                  {currentBadge.icon}
                  <span>{currentBadge.label}</span>
                </span>
                <span className="font-semibold text-slate-800 hidden 2xl:inline truncate max-w-[110px]">
                  {currentUser.name.split(',')[0]}
                </span>
                <ChevronDown className="w-3 h-3 text-slate-400 shrink-0" />
              </button>

              {/* User Dropdown Menu */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white rounded-2xl shadow-xl border border-slate-200/80 py-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                  <div className="px-3 py-2 border-b border-slate-100">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Sistem Hak Akses & Peran Pengguna
                    </p>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Pilih profil pengguna untuk kontrol hak akses:
                    </p>
                  </div>

                  <div className="max-h-72 overflow-y-auto py-1 divide-y divide-slate-50">
                    {DEFAULT_TEAM_USERS.map((user) => {
                      const isSelected = currentUser.name === user.name;
                      const badge = getRoleBadge(user.role);

                      return (
                        <button
                          key={user.name}
                          type="button"
                          onClick={() => {
                            onUserChanged(user);
                            setIsUserMenuOpen(false);
                          }}
                          className={`w-full text-left px-3 py-2 flex items-start justify-between gap-2 hover:bg-slate-50 transition-colors ${
                            isSelected ? 'bg-orange-50/70' : ''
                          }`}
                        >
                          <div className="space-y-0.5 flex-1 min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className={`inline-flex items-center gap-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold border ${badge.badgeClass}`}>
                                {badge.icon}
                                {user.role}
                              </span>
                              <span className={`text-xs font-semibold truncate ${isSelected ? 'text-[#FF5722]' : 'text-slate-900'}`}>
                                {user.name}
                              </span>
                            </div>
                            <p className="text-[10px] text-slate-500 line-clamp-1">
                              {user.title}
                            </p>
                          </div>
                          {isSelected && (
                            <Check className="w-4 h-4 text-[#FF5722] shrink-0 mt-0.5" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  <div className="px-3 pt-2 pb-1 border-t border-slate-100 bg-slate-50/60 text-[10px] text-slate-500 space-y-1">
                    <div className="flex items-center gap-1">
                      <Crown className="w-3 h-3 text-amber-600 shrink-0" />
                      <span><strong>Admin:</strong> Akses penuh kelola seluruh data.</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Edit3 className="w-3 h-3 text-emerald-600 shrink-0" />
                      <span><strong>Asesi:</strong> Isi catatan evaluasi & bukti fisik.</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Shield className="w-3 h-3 text-purple-600 shrink-0" />
                      <span><strong>Validator:</strong> Review & verifikasi status.</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="w-3 h-3 text-slate-500 shrink-0" />
                      <span><strong>Viewer:</strong> Mode baca saja (Read-Only).</span>
                    </div>
                  </div>

                  {/* Actions in User Menu: Pengaturan & Login/Logout */}
                  <div className="p-2 border-t border-slate-100 bg-white space-y-1">
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab('pengaturan');
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors text-left"
                    >
                      <Settings className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                      <span>Menu Pengaturan & Sandi Akses</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab('login');
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors text-left"
                    >
                      <KeyRound className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span>Halaman Login Pengguna</span>
                    </button>

                    {onLogout && isLoggedIn && (
                      <button
                        type="button"
                        onClick={() => {
                          onLogout();
                          setActiveTab('login');
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors text-left"
                      >
                        <LogOut className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                        <span>Keluar (Logout)</span>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Notification Bell Button */}
            {onNavigateToAlerts && (
              <button
                id="header-notification-bell"
                onClick={onNavigateToAlerts}
                className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer border border-slate-200"
                title={urgentDeadlineCount && urgentDeadlineCount > 0 ? `${urgentDeadlineCount} Indikator Mendekati Jatuh Tempo Akreditasi` : 'Notifikasi Jatuh Tempo'}
              >
                <Bell className="w-4 h-4 text-slate-600" />
                {urgentDeadlineCount !== undefined && urgentDeadlineCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 min-w-[16px] px-1 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white font-mono shadow-xs">
                    {urgentDeadlineCount}
                  </span>
                )}
              </button>
            )}

            {/* Supabase Connect / Status Button */}
            <button
              onClick={onOpenConnect}
              className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 text-xs font-medium rounded-xl border transition-colors whitespace-nowrap ${
                isSupabaseLive
                  ? 'border-blue-200 bg-blue-50 text-[#0084FF] hover:bg-blue-100'
                  : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
              }`}
              title="Konfigurasi Koneksi Supabase Database"
            >
              <Settings className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <span className="hidden xl:inline">
                {isSupabaseLive ? 'Supabase Live' : 'Koneksi DB'}
              </span>
              <span className={`w-2 h-2 rounded-full xl:hidden ${isSupabaseLive ? 'bg-[#0084FF]' : 'bg-slate-300'}`} />
            </button>

            {/* Export Button */}
            <button
              id="header-export-btn"
              onClick={onOpenExport}
              className="flex items-center gap-1 sm:gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 text-xs font-bold text-white bg-[#FF5722] hover:bg-[#E64A19] rounded-xl transition-all whitespace-nowrap shadow-xs active:scale-[0.98]"
              title="Ekspor Laporan Akreditasi"
            >
              <Download className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden sm:inline">Ekspor</span>
            </button>

            {/* Mobile Hamburger Menu Button (for < md screens) */}
            <div className="relative md:hidden" ref={mobileNavRef}>
              <button
                type="button"
                onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
                className="p-1.5 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                aria-label="Buka Menu Navigasi"
              >
                {isMobileNavOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </button>

              {/* Mobile Navigation Dropdown */}
              {isMobileNavOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                  <div className="px-3 py-1.5 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Menu Navigasi
                  </div>
                  <div className="py-1">
                    {navItems.map((item) => {
                      const isActive = activeTab === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => {
                            setActiveTab(item.id);
                            setIsMobileNavOpen(false);
                          }}
                          className={`w-full flex items-center gap-2 px-3 py-2 text-xs font-medium transition-colors ${
                            isActive
                              ? 'bg-orange-50 text-[#FF5722] font-bold'
                              : 'text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          {item.icon}
                          <span>{item.label}</span>
                        </button>
                      );
                    })}

                    {onStartTour && (
                      <div className="pt-1 mt-1 border-t border-slate-100">
                        <button
                          onClick={() => {
                            onStartTour();
                            setIsMobileNavOpen(false);
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-indigo-700 hover:bg-indigo-50 transition-colors"
                        >
                          <Compass className="w-4 h-4 text-indigo-600" />
                          <span>Mulai Panduan Tour</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </header>
  );
};


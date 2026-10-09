import React, { useState } from 'react';
import { 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  KeyRound, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  Building2, 
  Clock, 
  FileText, 
  ShieldCheck, 
  Sparkles,
  MapPin,
  Check,
  Shield,
  Layers,
  Crown,
  Edit3,
  Eye as EyeIcon,
  HelpCircle,
  X
} from 'lucide-react';
import { UserAccount } from '../types/auth';
import { 
  loginUser, 
  switchUserDirectly, 
  getStoredAccounts 
} from '../services/authService';
import { UserRole } from '../types/akreditasi';

interface LoginPageProps {
  currentUser: UserAccount;
  isLoggedIn: boolean;
  onLoginSuccess: (account: UserAccount) => void;
  onLogout: () => void;
  onNavigateToDashboard: () => void;
  onNavigateToPengaturan: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  currentUser,
  isLoggedIn,
  onLoginSuccess,
  onLogout,
  onNavigateToDashboard,
  onNavigateToPengaturan,
}) => {
  const [identifier, setIdentifier] = useState<string>('admin');
  const [password, setPassword] = useState<string>('admin@iq2026');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState<boolean>(false);

  const accounts = getStoredAccounts();

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const result = loginUser(identifier, password, rememberMe);
    if (result.success && result.account) {
      setSuccessToast(`Berhasil masuk sebagai ${result.account.name} (${result.account.role})`);
      setTimeout(() => {
        onLoginSuccess(result.account!);
      }, 350);
    } else {
      setErrorMessage(result.error || 'Terjadi kesalahan saat masuk.');
    }
  };

  const handleQuickSelect = (acc: UserAccount) => {
    setIdentifier(acc.username);
    setPassword(acc.password);
    setErrorMessage(null);
  };

  const handleQuickDirectLogin = (acc: UserAccount) => {
    const logged = switchUserDirectly(acc.id);
    if (logged) {
      setSuccessToast(`Masuk instan sebagai ${logged.name} (${logged.role})`);
      setTimeout(() => {
        onLoginSuccess(logged);
      }, 300);
    }
  };

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case 'Admin':
        return <Crown className="w-3.5 h-3.5 text-amber-500" />;
      case 'Validator':
        return <Shield className="w-3.5 h-3.5 text-purple-400" />;
      case 'Asesi':
        return <Edit3 className="w-3.5 h-3.5 text-emerald-400" />;
      case 'Viewer':
      default:
        return <EyeIcon className="w-3.5 h-3.5 text-slate-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#062c24] text-white font-sans flex flex-col justify-between selection:bg-[#10b981] selection:text-[#062c24] relative overflow-hidden">
      {/* Background Decorative Radial Glows */}
      <div className="absolute top-0 left-1/4 -mt-32 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-10 -mb-20 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Toast Notification */}
      {successToast && (
        <div className="fixed top-6 right-6 z-50 bg-[#057A55] text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 animate-in fade-in slide-in-from-top-4 duration-200 border border-emerald-400/40">
          <CheckCircle2 className="w-5 h-5 text-emerald-200" />
          <span className="text-sm font-semibold">{successToast}</span>
        </div>
      )}

      {/* TOP HEADER BAR (Sesuai Screenshot Gambar) */}
      <header className="w-full px-6 sm:px-10 lg:px-12 py-5 flex items-center justify-between border-b border-white/5 relative z-10">
        {/* Brand Left */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#0D9488] text-white flex items-center justify-center font-black text-base shadow-md">
            IQ
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm sm:text-base tracking-tight text-white uppercase">
                SIM AKREDITASI
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                v2.5 BAN-PDM
              </span>
            </div>
            <p className="text-xs text-emerald-200/70 font-medium">
              SMK IT Ibnul Qayyim Makassar
            </p>
          </div>
        </div>

        {/* Badges Right */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0a3a30] border border-emerald-500/20 text-emerald-300 text-xs font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Enkripsi Data AES-256</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0a3a30] border border-emerald-500/20 text-emerald-300 text-xs font-medium">
            <Building2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Tahun Ajaran 2025/2026</span>
          </div>
        </div>
      </header>

      {/* MAIN VIEWPORT (Split 2 Columns: Left info cards, Right white login box) */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 sm:px-10 lg:px-12 py-8 sm:py-12 flex items-center relative z-10">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* LEFT COLUMN: HERO HEADLINE & 4 FEATURE CARDS (Disembunyikan pada layar kecil/mobile) */}
          <div className="hidden lg:block lg:col-span-7 space-y-7">
            {/* Tag Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0a3a30] border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Sistem Akreditasi & Tata Kelola Penjaminan Mutu</span>
            </div>

            {/* Huge Headline */}
            <div className="space-y-1">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
                Portal Akreditasi
              </h1>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-[#34D399] leading-tight">
                SMK IT Ibnul Qayyim
              </h2>
            </div>

            {/* Description */}
            <p className="text-emerald-100/80 text-xs sm:text-sm max-w-xl leading-relaxed">
              Sistem terpadu evaluasi diri asesi, pembuktian fisik kinerja mutu vokasi, 
              rekap capaian 4 level rubrik BAN-PDM 2024 (Revisi 2025), dan alur verifikasi multi-peran 
              asesor internal & penjaminan mutu Yayasan.
            </p>

            {/* 4 Feature Cards (2x2 Grid) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl">
              {/* Card 1 */}
              <div className="bg-[#09372e] border border-emerald-500/20 rounded-2xl p-4 space-y-2 hover:border-emerald-400/40 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-[#0e483b] text-[#34D399] flex items-center justify-center">
                  <Layers className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-sm text-white">2-Tier Validasi</h3>
                <p className="text-[11px] text-emerald-100/70 leading-relaxed">
                  Asesor Internal & Validator BAN-PDM sebelum penetapan status final
                </p>
              </div>

              {/* Card 2 */}
              <div className="bg-[#09372e] border border-emerald-500/20 rounded-2xl p-4 space-y-2 hover:border-emerald-400/40 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-[#0e483b] text-[#34D399] flex items-center justify-center">
                  <Clock className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-sm text-white">Target & Jatuh Tempo Riil</h3>
                <p className="text-[11px] text-emerald-100/70 leading-relaxed">
                  Sinkronisasi otomatis peringatan H-7 & H-14 target unggah dokumen bukti
                </p>
              </div>

              {/* Card 3 */}
              <div className="bg-[#09372e] border border-emerald-500/20 rounded-2xl p-4 space-y-2 hover:border-emerald-400/40 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-[#0e483b] text-[#34D399] flex items-center justify-center">
                  <FileText className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-sm text-white">Laporan Formal Otomatis</h3>
                <p className="text-[11px] text-emerald-100/70 leading-relaxed">
                  Distribusi formulir evaluasi digital terenkripsi via cetak formal & Excel
                </p>
              </div>

              {/* Card 4 */}
              <div className="bg-[#09372e] border border-emerald-500/20 rounded-2xl p-4 space-y-2 hover:border-emerald-400/40 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-[#0e483b] text-[#34D399] flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-sm text-white">Audit Trail Lengkap</h3>
                <p className="text-[11px] text-emerald-100/70 leading-relaxed">
                  Pelacakan riwayat versi berkas bukti fisik & histori verifikasi
                </p>
              </div>
            </div>

            {/* School Address Footer info */}
            <div className="pt-2 flex items-start gap-2 text-xs text-emerald-200/70 max-w-lg">
              <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>
                Jl. Goa Ria Taman Bunga 2, Laikang, Kec. Biringkanaya, Kota Makassar, Sulawesi Selatan 90242
              </span>
            </div>
          </div>

          {/* RIGHT COLUMN: FLOATING WHITE LOGIN CARD (Sesuai Mockup Gambar) */}
          <div className="w-full lg:col-span-5 flex justify-center lg:justify-end">
            <div className="bg-white text-slate-900 rounded-3xl p-7 sm:p-9 shadow-2xl w-full max-w-md border border-slate-100 space-y-6">
              
              {/* Card Header */}
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    Masuk ke SIM AKREDITASI
                  </h2>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Gunakan akun terdaftar Anda untuk mengakses portal instrumen dan evaluasi akreditasi.
                  </p>
                </div>
                <div className="w-10 h-10 rounded-2xl bg-[#ecfdf5] border border-[#a7f3d0] text-[#059669] flex items-center justify-center shrink-0">
                  <KeyRound className="w-5 h-5" />
                </div>
              </div>

              {/* Error Alert */}
              {errorMessage && (
                <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 flex items-start gap-2.5 text-rose-800 text-xs">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <div className="leading-tight">{errorMessage}</div>
                </div>
              )}

              {/* Form Input */}
              <form onSubmit={handleLoginSubmit} className="space-y-4 text-left">
                {/* Username Input */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    USERNAME / EMAIL PEGAWAI
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <User className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder="Contoh: admin atau fadhil.rpl"
                      className="w-full pl-10 pr-3.5 py-3 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#057A55] focus:border-transparent transition-all"
                      required
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    KATA SANDI
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-10 py-3 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#057A55] focus:border-transparent transition-all font-mono"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Remember Me & Help Link */}
                <div className="flex items-center justify-between text-xs pt-0.5">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 text-[#057A55] rounded-sm border-slate-300 focus:ring-[#057A55]"
                    />
                    <span className="text-slate-600 text-xs">Ingat sesi saya di perangkat ini</span>
                  </label>

                  <button
                    type="button"
                    onClick={() => setIsHelpModalOpen(true)}
                    className="text-[#057A55] hover:text-[#046c4e] font-bold hover:underline cursor-pointer"
                  >
                    Bantuan Masuk?
                  </button>
                </div>

                {/* Primary Green Submit Button */}
                <button
                  type="submit"
                  className="w-full py-3.5 px-4 bg-[#057A55] hover:bg-[#046c4e] active:bg-[#03543f] text-white rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
                >
                  <span>Masuk ke Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              {/* Card Footer Bar */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" />
                  <span className="text-slate-600 font-medium">Server Akreditasi Online & Siap</span>
                </div>
                <span className="font-semibold text-emerald-800">
                  BAN-PDM Vokasi Terintegrasi
                </span>
              </div>

            </div>
          </div>

        </div>
      </main>

      {/* FOOTER BAR */}
      <footer className="w-full px-6 sm:px-10 lg:px-12 py-4 border-t border-white/5 text-xs text-emerald-200/50 flex flex-col sm:flex-row items-center justify-between gap-2 relative z-10">
        <div>
          <span>© 2026 SMK IT Ibnul Qayyim Makassar</span>
          <span className="mx-2">·</span>
          <span>Instrumen BAN-PDM SMK/MAK 2024 (Revisi 2025)</span>
        </div>
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={onNavigateToPengaturan}
            className="hover:text-emerald-300 transition-colors text-emerald-300 font-medium"
          >
            Menu Pengaturan & Sandi Akses
          </button>
          <span>·</span>
          <span>Sistem Informasi Manajemen Akreditasi</span>
        </div>
      </footer>

      {/* MODAL BANTUAN MASUK & DAFTAR KREDENSIAL LENGKAP */}
      {isHelpModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white text-slate-900 rounded-3xl p-6 sm:p-7 max-w-xl w-full border border-slate-200 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150 max-h-[85vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900">Bantuan Akses & Kredensial Pengguna</h3>
                  <p className="text-xs text-slate-500">Pilih salah satu akun di bawah ini untuk mengisi form otomatis:</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsHelpModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2.5">
              {accounts.map((acc) => (
                <div
                  key={acc.id}
                  className="p-3 bg-slate-50 hover:bg-emerald-50/60 border border-slate-200 rounded-2xl flex items-center justify-between gap-3 transition-colors"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                        acc.role === 'Admin' ? 'bg-amber-100 text-amber-800' :
                        acc.role === 'Asesi' ? 'bg-emerald-100 text-emerald-800' :
                        acc.role === 'Validator' ? 'bg-purple-100 text-purple-800' :
                        'bg-slate-200 text-slate-700'
                      }`}>
                        {acc.role}
                      </span>
                      <span className="font-bold text-xs text-slate-900 truncate">{acc.name}</span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-3">
                      <span>User: <strong className="font-mono text-slate-700">{acc.username}</strong></span>
                      <span>Sandi: <strong className="font-mono text-emerald-700">{acc.password}</strong></span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        handleQuickSelect(acc);
                        setIsHelpModalOpen(false);
                      }}
                      className="px-2.5 py-1 text-xs bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-xl font-semibold transition-colors"
                    >
                      Isi Form
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        handleQuickDirectLogin(acc);
                        setIsHelpModalOpen(false);
                      }}
                      className="px-2.5 py-1 text-xs bg-[#057A55] hover:bg-[#046c4e] text-white rounded-xl font-bold transition-colors shadow-xs"
                    >
                      Masuk Langsung
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500">Seluruh sandi dapat dikelola di Menu Pengaturan.</span>
              <button
                type="button"
                onClick={() => {
                  setIsHelpModalOpen(false);
                  onNavigateToPengaturan();
                }}
                className="font-bold text-emerald-700 hover:underline"
              >
                Buka Menu Pengaturan →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

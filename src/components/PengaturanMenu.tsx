import React, { useState } from 'react';
import { 
  KeyRound, 
  Users, 
  ShieldCheck, 
  Copy, 
  Check, 
  Eye, 
  EyeOff, 
  Edit3, 
  Crown, 
  Shield, 
  Eye as EyeIcon, 
  Search, 
  Filter, 
  RotateCcw, 
  UserPlus, 
  Lock, 
  CheckCircle2, 
  AlertCircle, 
  Building2, 
  Calendar, 
  Bell, 
  ArrowRight, 
  LogOut, 
  X,
  FileCheck2,
  Sparkles,
  Info,
  Sliders,
  Settings
} from 'lucide-react';
import { UserAccount, RolePermissionDetail } from '../types/auth';
import { UserRole } from '../types/akreditasi';
import { 
  getStoredAccounts, 
  updateAccountPassword, 
  resetAllAccountsToDefault, 
  addNewAccount, 
  switchUserDirectly, 
  ROLE_PERMISSIONS_MATRIX,
  logoutUser
} from '../services/authService';

interface PengaturanMenuProps {
  currentUser: UserAccount;
  onUserChanged: (user: UserAccount) => void;
  onLogout: () => void;
  onNavigateToLogin: () => void;
  onNavigateToDashboard: () => void;
}

export const PengaturanMenu: React.FC<PengaturanMenuProps> = ({
  currentUser,
  onUserChanged,
  onLogout,
  onNavigateToLogin,
  onNavigateToDashboard,
}) => {
  const [activeTab, setActiveTab] = useState<'daftar-akun' | 'profil-saya' | 'matriks-akses' | 'sistem'>('daftar-akun');
  const [accounts, setAccounts] = useState<UserAccount[]>(() => getStoredAccounts());
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  
  // State per-akun untuk visibilitas password
  const [revealedPasswords, setRevealedPasswords] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  // Modal Ubah Password
  const [editingAccount, setEditingAccount] = useState<UserAccount | null>(null);
  const [newPasswordInput, setNewPasswordInput] = useState<string>('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState<string>('');
  const [editPasswordError, setEditPasswordError] = useState<string | null>(null);

  // Modal Tambah Akun
  const [isAddAccountModalOpen, setIsAddAccountModalOpen] = useState<boolean>(false);
  const [newAccName, setNewAccName] = useState<string>('');
  const [newAccUsername, setNewAccUsername] = useState<string>('');
  const [newAccPassword, setNewAccPassword] = useState<string>('');
  const [newAccRole, setNewAccRole] = useState<UserRole>('Asesi');
  const [newAccTitle, setNewAccTitle] = useState<string>('');
  const [newAccDept, setNewAccDept] = useState<string>('');
  const [newAccEmail, setNewAccEmail] = useState<string>('');
  const [addAccountError, setAddAccountError] = useState<string | null>(null);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const togglePasswordVisibility = (id: string) => {
    setRevealedPasswords((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleCopyPassword = (acc: UserAccount) => {
    navigator.clipboard.writeText(acc.password);
    setCopiedId(acc.id);
    showToast(`Password untuk ${acc.name} (${acc.password}) berhasil disalin!`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleOpenEditPassword = (acc: UserAccount) => {
    setEditingAccount(acc);
    setNewPasswordInput('');
    setConfirmPasswordInput('');
    setEditPasswordError(null);
  };

  const handleSavePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAccount) return;

    if (!newPasswordInput || newPasswordInput.length < 4) {
      setEditPasswordError('Password baru minimal harus 4 karakter.');
      return;
    }

    if (newPasswordInput !== confirmPasswordInput) {
      setEditPasswordError('Konfirmasi password tidak cocok.');
      return;
    }

    const ok = updateAccountPassword(editingAccount.id, newPasswordInput);
    if (ok) {
      const refreshed = getStoredAccounts();
      setAccounts(refreshed);
      if (currentUser.id === editingAccount.id) {
        onUserChanged({ ...currentUser, password: newPasswordInput });
      }
      showToast(`Password untuk akun ${editingAccount.name} berhasil diperbarui.`);
      setEditingAccount(null);
    } else {
      setEditPasswordError('Gagal memperbarui password.');
    }
  };

  const handleDirectSwitch = (acc: UserAccount) => {
    const switched = switchUserDirectly(acc.id);
    if (switched) {
      onUserChanged(switched);
      showToast(`Beralih peran aktif sebagai: ${switched.name} (${switched.role})`);
    }
  };

  const handleResetDefaults = () => {
    if (window.confirm('Kembalikan seluruh password akun ke pengaturan default awal? Akun kustom yang dibuat tidak akan terhapus.')) {
      resetAllAccountsToDefault();
      const refreshed = getStoredAccounts();
      setAccounts(refreshed);
      showToast('Seluruh password akun telah dikembalikan ke default bawaan sistem.');
    }
  };

  const handleAddAccountSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAddAccountError(null);

    if (!newAccName.trim() || !newAccUsername.trim() || !newAccPassword.trim()) {
      setAddAccountError('Nama, Username, dan Password wajib diisi.');
      return;
    }

    // Cek duplikasi username
    const exists = accounts.some(
      (a) => a.username.toLowerCase() === newAccUsername.trim().toLowerCase()
    );
    if (exists) {
      setAddAccountError(`Username "${newAccUsername}" sudah digunakan. Gunakan username lain.`);
      return;
    }

    const defaultPerms: Record<UserRole, string[]> = {
      Admin: ['Full Control Sistem', 'Kelola Pengguna & Password', 'Validasi Final Nilai', 'Ekspor Laporan'],
      Asesi: ['Isi Evaluasi Diri Asesi', 'Penentuan Level Rubrik Capaian', 'Unggah Bukti Fisik', 'Kelola Riwayat Versi'],
      Validator: ['Review Skor Kinerja', 'Verifikasi Dokumen Bukti', 'Catatan Reviewer & Rekomendasi'],
      Viewer: ['Melihat Dashboard Progres', 'Pratinjau Cetak Formal', 'Mode Baca Saja']
    };

    const created = addNewAccount({
      username: newAccUsername.trim().toLowerCase(),
      password: newAccPassword.trim(),
      name: newAccName.trim(),
      role: newAccRole,
      title: newAccTitle.trim() || `Personil Tim ${newAccRole}`,
      department: newAccDept.trim() || 'Tim Akreditasi Sekolah',
      email: newAccEmail.trim() || `${newAccUsername.trim().toLowerCase()}@smkitibnulqayyim.sch.id`,
      avatarBg: newAccRole === 'Admin' ? 'bg-amber-600' : newAccRole === 'Asesi' ? 'bg-emerald-600' : newAccRole === 'Validator' ? 'bg-purple-600' : 'bg-slate-600',
      permissions: defaultPerms[newAccRole] || ['Akses Standar']
    });

    setAccounts(getStoredAccounts());
    setIsAddAccountModalOpen(false);
    showToast(`Akun baru "${created.name}" berhasil ditambahkan.`);
    
    // Reset form
    setNewAccName('');
    setNewAccUsername('');
    setNewAccPassword('');
    setNewAccTitle('');
    setNewAccDept('');
    setNewAccEmail('');
  };

  const filteredAccounts = accounts.filter((acc) => {
    const matchRole = roleFilter === 'all' || acc.role === roleFilter;
    const q = searchQuery.toLowerCase();
    const matchSearch = 
      acc.name.toLowerCase().includes(q) ||
      acc.username.toLowerCase().includes(q) ||
      (acc.email && acc.email.toLowerCase().includes(q)) ||
      acc.title.toLowerCase().includes(q);
    return matchRole && matchSearch;
  });

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case 'Admin':
        return <Crown className="w-4 h-4 text-amber-600" />;
      case 'Validator':
        return <Shield className="w-4 h-4 text-purple-600" />;
      case 'Asesi':
        return <Edit3 className="w-4 h-4 text-emerald-600" />;
      case 'Viewer':
      default:
        return <EyeIcon className="w-4 h-4 text-slate-500" />;
    }
  };

  const getRoleBadgeClass = (role: UserRole) => {
    switch (role) {
      case 'Admin':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Validator':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Asesi':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Viewer':
      default:
        return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  return (
    <div className="py-2 sm:py-6 max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 animate-in fade-in slide-in-from-top-4 duration-200 border border-slate-700">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span className="text-xs sm:text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200/80 text-indigo-700 text-xs font-bold">
            <Settings className="w-3.5 h-3.5" />
            <span>Pusat Kendali Pengaturan Sistem</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Pengaturan & Hak Akses Pengguna
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm max-w-2xl">
            Kelola daftar akun, sandi/password akses setiap peran (Admin, Asesi, Validator, Viewer),
            matriks kewenangan sistem, dan preferensi evaluasi akreditasi SMK IT Ibnul Qayyim.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={onNavigateToDashboard}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            ← Kembali ke Dashboard
          </button>
          <button
            type="button"
            onClick={onNavigateToLogin}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>Halaman Login</span>
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab('daftar-akun')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'daftar-akun'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Daftar Akun & Password</span>
          <span className={`px-2 py-0.5 rounded-full text-[11px] font-mono ${
            activeTab === 'daftar-akun' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'
          }`}>
            {accounts.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('matriks-akses')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'matriks-akses'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Matriks Kewenangan Peran</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('profil-saya')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'profil-saya'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Edit3 className="w-4 h-4" />
          <span>Profil Sesi Aktif</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('sistem')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'sistem'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Identitas Satuan Pendidikan</span>
        </button>
      </div>

      {/* TAB 1: DAFTAR AKUN & PASSWORD (UTAMA) */}
      {activeTab === 'daftar-akun' && (
        <div className="space-y-6">
          {/* Top Control Bar: Search, Role Filter, Actions */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="flex-1 relative">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari nama pengguna, username, email, atau jabatan..."
                  className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsAddAccountModalOpen(true)}
                  className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Tambah Akun</span>
                </button>

                <button
                  type="button"
                  onClick={handleResetDefaults}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
                  title="Kembalikan semua password ke default"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Reset Default</span>
                </button>
              </div>
            </div>

            {/* Filter Buttons */}
            <div className="flex items-center gap-1.5 pt-2 border-t border-slate-100 overflow-x-auto text-xs">
              <span className="text-slate-400 font-medium mr-1 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5" />
                <span>Filter:</span>
              </span>
              {[
                { id: 'all', label: 'Semua Peran' },
                { id: 'Admin', label: 'Admin' },
                { id: 'Asesi', label: 'Asesi' },
                { id: 'Validator', label: 'Validator' },
                { id: 'Viewer', label: 'Viewer' },
              ].map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setRoleFilter(f.id)}
                  className={`px-3 py-1 rounded-xl font-bold transition-colors cursor-pointer ${
                    roleFilter === f.id
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Alert Info Banner */}
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex items-start gap-3 text-xs text-blue-900">
            <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-bold">Informasi Akses & Sandi Akreditasi</p>
              <p className="text-blue-800 leading-relaxed text-[11px]">
                Di bawah ini adalah <strong>daftar lengkap akun pengguna beserta password resminya</strong>. 
                Anda dapat melihat password asli dengan menekan ikon mata, menyalinnya secara instan, mengubah password jika diperlukan, 
                atau menekan tombol <strong>&ldquo;Masuk Sebagai Akun Ini&rdquo;</strong> untuk langsung berganti peran aktif dalam evaluasi akreditasi.
              </p>
            </div>
          </div>

          {/* Cards Grid of Accounts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredAccounts.map((acc) => {
              const roleIcon = getRoleIcon(acc.role);
              const badgeClass = getRoleBadgeClass(acc.role);
              const isRevealed = !!revealedPasswords[acc.id];
              const isCopied = copiedId === acc.id;
              const isCurrent = currentUser.id === acc.id;

              return (
                <div
                  key={acc.id}
                  className={`bg-white rounded-2xl p-5 border transition-all relative flex flex-col justify-between ${
                    isCurrent
                      ? 'border-blue-500 ring-2 ring-blue-500/20 shadow-md'
                      : 'border-slate-200 hover:border-slate-300 shadow-xs'
                  }`}
                >
                  <div>
                    {/* Header Bar */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className={`w-11 h-11 rounded-2xl ${acc.avatarBg || 'bg-slate-600'} text-white flex items-center justify-center font-bold text-sm shadow-xs shrink-0`}>
                          {acc.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${badgeClass}`}>
                              {roleIcon}
                              <span>{acc.role}</span>
                            </span>
                            {isCurrent && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700">
                                <Check className="w-3 h-3" />
                                <span>Akun Aktif</span>
                              </span>
                            )}
                          </div>
                          <h3 className="font-bold text-sm text-slate-900 mt-1 truncate" title={acc.name}>
                            {acc.name}
                          </h3>
                          <p className="text-xs text-slate-500 line-clamp-1 mt-0.5" title={acc.title}>
                            {acc.title}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Meta info & Department */}
                    <div className="mt-3 text-[11px] text-slate-500 space-y-1 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 font-medium">Unit / Divisi:</span>
                        <span className="font-semibold text-slate-700 truncate max-w-[200px]">{acc.department || '-'}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 font-medium">Email Satuan:</span>
                        <span className="font-mono text-slate-700 truncate max-w-[200px]">{acc.email || '-'}</span>
                      </div>
                    </div>

                    {/* BOX PASSWORD UTAMA */}
                    <div className="mt-3 p-3 bg-indigo-50/70 rounded-xl border border-indigo-200/80 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-900">
                          <KeyRound className="w-3.5 h-3.5 text-indigo-600" />
                          <span>Kredensial Akses</span>
                        </div>
                        <span className="text-[10px] text-indigo-600 font-medium">
                          Username: <strong className="font-mono">{acc.username}</strong>
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-2 bg-white px-3 py-2 rounded-lg border border-indigo-200">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="text-xs text-slate-400 font-medium">Password:</span>
                          <span className="font-mono text-xs sm:text-sm font-bold text-slate-900 tracking-wider">
                            {isRevealed ? acc.password : '••••••••••••'}
                          </span>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => togglePasswordVisibility(acc.id)}
                            className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                            title={isRevealed ? 'Sembunyikan password' : 'Lihat password'}
                          >
                            {isRevealed ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>

                          <button
                            type="button"
                            onClick={() => handleCopyPassword(acc)}
                            className="p-1.5 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
                            title="Salin password ke clipboard"
                          >
                            {isCopied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                          </button>

                          <button
                            type="button"
                            onClick={() => handleOpenEditPassword(acc)}
                            className="p-1.5 text-amber-600 hover:text-amber-800 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
                            title="Ubah password akun ini"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Permissions tags */}
                    <div className="mt-3">
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                        Hak Akses Utama
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {acc.permissions.slice(0, 3).map((perm, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-100 text-slate-600 border border-slate-200/60"
                          >
                            <Check className="w-2.5 h-2.5 text-emerald-600" />
                            <span>{perm}</span>
                          </span>
                        ))}
                        {acc.permissions.length > 3 && (
                          <span className="px-1.5 py-0.5 rounded-md text-[10px] font-medium bg-slate-100 text-slate-500">
                            +{acc.permissions.length - 3} lainnya
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Action Switch button */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <span className="text-[11px] text-slate-400">
                      ID: <span className="font-mono">{acc.id}</span>
                    </span>

                    {isCurrent ? (
                      <span className="text-xs font-bold text-blue-600 flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" />
                        <span>Sedang Digunakan</span>
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleDirectSwitch(acc)}
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
                      >
                        <span>Masuk Sebagai Akun Ini</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {filteredAccounts.length === 0 && (
            <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 text-slate-500">
              <Users className="w-10 h-10 mx-auto text-slate-300 mb-2" />
              <p className="font-semibold text-slate-700">Tidak ada akun yang sesuai pencarian.</p>
              <p className="text-xs text-slate-400 mt-1">Coba kata kunci pencarian lain atau ubah filter peran.</p>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: MATRIKS KEWENANGAN PERAN */}
      {activeTab === 'matriks-akses' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-indigo-600" />
              <span>Matriks Kewenangan & Izin Peran Akreditasi BAN-PDM</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Perbandingan izin hak akses sistem antara Administrator, Tim Asesi Sekolah, Validator/Asesor Mutu, dan Pengunjung Tamu:
            </p>

            <div className="mt-6 overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                    <th className="p-3 rounded-tl-xl">Kewenangan / Tindakan Sistem</th>
                    <th className="p-3 text-center">Admin</th>
                    <th className="p-3 text-center">Asesi</th>
                    <th className="p-3 text-center">Validator</th>
                    <th className="p-3 text-center rounded-tr-xl">Viewer</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  <tr className="hover:bg-slate-50/80">
                    <td className="p-3 font-semibold text-slate-800">
                      Pengisian Evaluasi Diri & Catatan Kinerja
                      <p className="text-[10px] text-slate-400 font-normal">Mengisi uraian bukti dan refleksi asesi pada tiap indikator</p>
                    </td>
                    <td className="p-3 text-center font-bold text-emerald-600">✓ Ya</td>
                    <td className="p-3 text-center font-bold text-emerald-600">✓ Ya (Utama)</td>
                    <td className="p-3 text-center text-rose-500">✗ Tidak</td>
                    <td className="p-3 text-center text-rose-500">✗ Tidak</td>
                  </tr>

                  <tr className="hover:bg-slate-50/80">
                    <td className="p-3 font-semibold text-slate-800">
                      Penetapan Level Rubrik Capaian (Level 1-4)
                      <p className="text-[10px] text-slate-400 font-normal">Memilih skor capaian Kurang, Cukup Baik, Baik, atau Sangat Baik</p>
                    </td>
                    <td className="p-3 text-center font-bold text-emerald-600">✓ Ya</td>
                    <td className="p-3 text-center font-bold text-emerald-600">✓ Ya</td>
                    <td className="p-3 text-center text-amber-600">Audit / Review</td>
                    <td className="p-3 text-center text-rose-500">✗ Tidak</td>
                  </tr>

                  <tr className="hover:bg-slate-50/80">
                    <td className="p-3 font-semibold text-slate-800">
                      Unggah Bukti Fisik & Kelola Riwayat Versi
                      <p className="text-[10px] text-slate-400 font-normal">Upload dokumen KOSP, modul, MoU DUDIKA, foto sarpras, dll.</p>
                    </td>
                    <td className="p-3 text-center font-bold text-emerald-600">✓ Ya</td>
                    <td className="p-3 text-center font-bold text-emerald-600">✓ Ya</td>
                    <td className="p-3 text-center text-rose-500">✗ Tidak</td>
                    <td className="p-3 text-center text-rose-500">✗ Tidak</td>
                  </tr>

                  <tr className="hover:bg-slate-50/80">
                    <td className="p-3 font-semibold text-slate-800">
                      Verifikasi & Validasi Status Bukti
                      <p className="text-[10px] text-slate-400 font-normal">Mengubah status ke &apos;Terverifikasi Valid&apos; atau &apos;Perlu Perbaikan&apos;</p>
                    </td>
                    <td className="p-3 text-center font-bold text-emerald-600">✓ Ya</td>
                    <td className="p-3 text-center text-rose-500">✗ Tidak</td>
                    <td className="p-3 text-center font-bold text-emerald-600">✓ Ya (Utama)</td>
                    <td className="p-3 text-center text-rose-500">✗ Tidak</td>
                  </tr>

                  <tr className="hover:bg-slate-50/80">
                    <td className="p-3 font-semibold text-slate-800">
                      Pemberian Catatan Reviewer & Umpan Balik
                      <p className="text-[10px] text-slate-400 font-normal">Memberikan catatan revisi berkas akreditasi untuk perbaikan asesi</p>
                    </td>
                    <td className="p-3 text-center font-bold text-emerald-600">✓ Ya</td>
                    <td className="p-3 text-center text-slate-400">Hanya Membaca</td>
                    <td className="p-3 text-center font-bold text-emerald-600">✓ Ya</td>
                    <td className="p-3 text-center text-rose-500">✗ Tidak</td>
                  </tr>

                  <tr className="hover:bg-slate-50/80">
                    <td className="p-3 font-semibold text-slate-800">
                      Manajemen Akun Pengguna & Password
                      <p className="text-[10px] text-slate-400 font-normal">Menambah personil, mengubah password, dan mengatur hak akses</p>
                    </td>
                    <td className="p-3 text-center font-bold text-emerald-600">✓ Ya (Penuh)</td>
                    <td className="p-3 text-center text-rose-500">✗ Tidak</td>
                    <td className="p-3 text-center text-rose-500">✗ Tidak</td>
                    <td className="p-3 text-center text-rose-500">✗ Tidak</td>
                  </tr>

                  <tr className="hover:bg-slate-50/80">
                    <td className="p-3 font-semibold text-slate-800">
                      Ekspor Laporan Resmi & Cetak Formal
                      <p className="text-[10px] text-slate-400 font-normal">Mengunduh format PDF, Excel, atau pratinjau cetak instrumen</p>
                    </td>
                    <td className="p-3 text-center font-bold text-emerald-600">✓ Ya</td>
                    <td className="p-3 text-center font-bold text-emerald-600">✓ Ya</td>
                    <td className="p-3 text-center font-bold text-emerald-600">✓ Ya</td>
                    <td className="p-3 text-center font-bold text-emerald-600">✓ Ya</td>
                  </tr>

                  <tr className="hover:bg-slate-50/80">
                    <td className="p-3 font-semibold text-slate-800">
                      Konfigurasi Database BaaS (Supabase)
                      <p className="text-[10px] text-slate-400 font-normal">Pengaturan URL proyek Supabase, Anon Key, dan skema SQL DDL</p>
                    </td>
                    <td className="p-3 text-center font-bold text-emerald-600">✓ Ya</td>
                    <td className="p-3 text-center text-rose-500">✗ Tidak</td>
                    <td className="p-3 text-center text-rose-500">✗ Tidak</td>
                    <td className="p-3 text-center text-rose-500">✗ Tidak</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Cards Peran Detail */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ROLE_PERMISSIONS_MATRIX.map((mat) => (
              <div key={mat.role} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getRoleIcon(mat.role)}
                    <h3 className="font-bold text-sm text-slate-900">{mat.label}</h3>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${mat.badgeColor}`}>
                    {mat.role}
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{mat.deskripsi}</p>
                <div className="pt-2 border-t border-slate-100">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    Modul yang Dapat Diakses:
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {mat.aksesModul.map((mod, i) => (
                      <span key={i} className="px-2 py-0.5 bg-slate-100 text-slate-700 text-[10px] font-medium rounded-md">
                        {mod}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: PROFIL SAYA */}
      {activeTab === 'profil-saya' && (
        <div className="max-w-2xl bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Profil Sesi Masuk Saat Ini</h2>
            <p className="text-xs text-slate-500 mt-0.5">Informasi akun yang sedang aktif digunakan di sistem.</p>
          </div>

          <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
            <div className={`w-14 h-14 rounded-2xl ${currentUser.avatarBg || 'bg-blue-600'} text-white flex items-center justify-center font-bold text-lg shadow-sm shrink-0`}>
              {currentUser.name.slice(0, 2).toUpperCase()}
            </div>
            <div className="space-y-1 min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border ${getRoleBadgeClass(currentUser.role)}`}>
                  {getRoleIcon(currentUser.role)}
                  <span>{currentUser.role}</span>
                </span>
                <span className="font-mono text-xs text-slate-400">@{currentUser.username}</span>
              </div>
              <h3 className="font-bold text-base text-slate-900">{currentUser.name}</h3>
              <p className="text-xs text-slate-600">{currentUser.title}</p>
              <p className="text-xs text-slate-500">{currentUser.department}</p>
            </div>
          </div>

          {/* Form Ganti Password Akun Aktif */}
          <div className="pt-4 border-t border-slate-200 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Lock className="w-4 h-4 text-indigo-600" />
              <span>Ganti Password Akun Saya</span>
            </h3>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <div>
                <span className="text-xs text-slate-500">Password Aktif Sekarang: </span>
                <span className="font-mono font-bold text-indigo-700 bg-white px-2 py-0.5 rounded-md border border-slate-200 text-xs">
                  {currentUser.password}
                </span>
              </div>

              <button
                type="button"
                onClick={() => handleOpenEditPassword(currentUser)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Ubah Password Ini</span>
              </button>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
            <button
              type="button"
              onClick={onLogout}
              className="px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Keluar dari Akun (Logout)</span>
            </button>

            <button
              type="button"
              onClick={onNavigateToDashboard}
              className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              Lanjut ke Dashboard →
            </button>
          </div>
        </div>
      )}

      {/* TAB 4: SATUAN PENDIDIKAN & SISTEM */}
      {activeTab === 'sistem' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-black text-xl border border-blue-100">
                IQ
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">Identitas Satuan Pendidikan & Instrumen</h2>
                <p className="text-xs text-slate-500">Konfigurasi sasaran akreditasi sekolah vokasi.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <span className="text-slate-400 font-medium">Nama Satuan Pendidikan</span>
                <p className="font-bold text-slate-900 text-sm">SMK IT Ibnul Qayyim Makassar</p>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <span className="text-slate-400 font-medium">Nomor Pokok Sekolah Nasional (NPSN)</span>
                <p className="font-bold text-slate-900 font-mono text-sm">69989025</p>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <span className="text-slate-400 font-medium">Program / Konsentrasi Keahlian</span>
                <p className="font-bold text-slate-900 text-sm">Rekayasa Perangkat Lunak (RPL) - Vokasi 3 Tahun</p>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <span className="text-slate-400 font-medium">Pedoman Instrumen BAN-PDM</span>
                <p className="font-bold text-slate-900 text-sm">Instrumen BAN-PDM SMK/MAK 2024 (Revisi 2025)</p>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <span className="text-slate-400 font-medium">Target Nilai Akreditasi</span>
                <p className="font-bold text-emerald-700 text-sm">Peringkat Unggul (A) — Nilai &ge; 91</p>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <span className="text-slate-400 font-medium">Tahun Evaluasi Mutu</span>
                <p className="font-bold text-slate-900 text-sm">Tahun Ajaran 2025 / 2026</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL EDIT PASSWORD */}
      {editingAccount && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full border border-slate-200 shadow-2xl space-y-5 animate-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">Ubah Sandi Akun</span>
                <h3 className="text-lg font-bold text-slate-900 mt-0.5">{editingAccount.name}</h3>
                <p className="text-xs text-slate-500 font-mono">@{editingAccount.username} ({editingAccount.role})</p>
              </div>
              <button
                type="button"
                onClick={() => setEditingAccount(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {editPasswordError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{editPasswordError}</span>
              </div>
            )}

            <form onSubmit={handleSavePassword} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Password Baru
                </label>
                <input
                  type="text"
                  value={newPasswordInput}
                  onChange={(e) => setNewPasswordInput(e.target.value)}
                  placeholder="Ketik password baru (min 4 karakter)..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-mono focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Konfirmasi Password Baru
                </label>
                <input
                  type="text"
                  value={confirmPasswordInput}
                  onChange={(e) => setConfirmPasswordInput(e.target.value)}
                  placeholder="Ketik ulang password baru..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-mono focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingAccount(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Simpan Perubahan Password</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL TAMBAH AKUN BARU */}
      {isAddAccountModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-lg w-full border border-slate-200 shadow-2xl space-y-5 animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-emerald-600" />
                  <h3 className="text-lg font-bold text-slate-900">Tambah Akun Pengguna Baru</h3>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Daftarkan personil baru tim akreditasi sekolah beserta peran dan passwordnya.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsAddAccountModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {addAccountError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{addAccountError}</span>
              </div>
            )}

            <form onSubmit={handleAddAccountSubmit} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nama Lengkap & Gelar *</label>
                  <input
                    type="text"
                    value={newAccName}
                    onChange={(e) => setNewAccName(e.target.value)}
                    placeholder="Contoh: Siti Rahma, S.Pd"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Peran Akses (Role) *</label>
                  <select
                    value={newAccRole}
                    onChange={(e) => setNewAccRole(e.target.value as UserRole)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 font-semibold"
                  >
                    <option value="Admin">Admin (Penuh)</option>
                    <option value="Asesi">Asesi (Isi Bukti & Nilai)</option>
                    <option value="Validator">Validator (Review & Verifikasi)</option>
                    <option value="Viewer">Viewer (Read-Only)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Username Unik *</label>
                  <input
                    type="text"
                    value={newAccUsername}
                    onChange={(e) => setNewAccUsername(e.target.value)}
                    placeholder="Contoh: rahma.guru"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono focus:bg-white focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Password Akses *</label>
                  <input
                    type="text"
                    value={newAccPassword}
                    onChange={(e) => setNewAccPassword(e.target.value)}
                    placeholder="Contoh: rahma@2026"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono focus:bg-white focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Jabatan di Sekolah</label>
                <input
                  type="text"
                  value={newAccTitle}
                  onChange={(e) => setNewAccTitle(e.target.value)}
                  placeholder="Contoh: Guru Pembimbing Vokasi / Anggota Asesi"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Divisi / Unit Kerja</label>
                  <input
                    type="text"
                    value={newAccDept}
                    onChange={(e) => setNewAccDept(e.target.value)}
                    placeholder="Contoh: Kejuruan RPL"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Email Satuan</label>
                  <input
                    type="email"
                    value={newAccEmail}
                    onChange={(e) => setNewAccEmail(e.target.value)}
                    placeholder="rahma@smkitibnulqayyim.sch.id"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddAccountModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Simpan & Daftarkan Akun</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

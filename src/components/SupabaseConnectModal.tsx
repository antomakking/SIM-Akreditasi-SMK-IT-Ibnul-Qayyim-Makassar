import React, { useState } from 'react';
import { 
  getStoredConfig, 
  saveStoredConfig, 
  resetClient, 
  StoredSupabaseConfig 
} from '../services/evaluasiService';
import { createClient } from '@supabase/supabase-js';
import { X, Database, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';

interface SupabaseConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfigChanged: () => void;
}

export const SupabaseConnectModal: React.FC<SupabaseConnectModalProps> = ({
  isOpen,
  onClose,
  onConfigChanged,
}) => {
  const [config, setConfig] = useState<StoredSupabaseConfig>(getStoredConfig());
  const [testing, setTesting] = useState<boolean>(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  if (!isOpen) return null;

  const handleTestConnection = async () => {
    if (!config.url || !config.anonKey) {
      setTestResult({
        success: false,
        message: 'Harap lengkapi Project URL dan Anon Key terlebih dahulu.',
      });
      return;
    }

    setTesting(true);
    setTestResult(null);

    try {
      const testClient = createClient(config.url.trim(), config.anonKey.trim());
      // Test query sederhana ke tabel komponen
      const { data, error } = await testClient.from('komponen').select('id, kode').limit(1);

      if (error) {
        setTestResult({
          success: false,
          message: `Koneksi ditolak Supabase: ${error.message} (${error.code})`,
        });
      } else {
        setTestResult({
          success: true,
          message: `Koneksi Supabase aktif berhasil terhubung! Tabel 'komponen' terdeteksi.`,
        });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setTestResult({
        success: false,
        message: `Gagal menghubungi server Supabase: ${msg}`,
      });
    } finally {
      setTesting(false);
    }
  };

  const handleSave = () => {
    saveStoredConfig({
      ...config,
      isActive: true,
    });
    resetClient();
    onConfigChanged();
    onClose();
  };

  const handleUseMock = () => {
    saveStoredConfig({
      url: '',
      anonKey: '',
      isActive: false,
    });
    setConfig({ url: '', anonKey: '', isActive: false });
    resetClient();
    onConfigChanged();
    setTestResult({
      success: true,
      message: 'Mode Local Reactive Storage (Offline) diaktifkan.',
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
      <div className="bg-white rounded-xl border border-slate-200 shadow-xl max-w-lg w-full overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-emerald-700" />
            <h3 className="text-sm font-bold text-slate-900">
              Pengaturan Koneksi Backend Supabase
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-md"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4">
          <p className="text-xs text-slate-600 leading-relaxed">
            Secara bawaan, aplikasi ini beroperasi dalam <strong>Mode Offline Safe / Pratinjau Terintegrasi</strong>. Jika Anda telah mengeksekusi skrip SQL DDL di proyek Supabase Anda, masukkan kredensial di bawah untuk beralih ke PostgreSQL Cloud Supabase secara langsung:
          </p>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Supabase Project URL:
              </label>
              <input
                type="text"
                placeholder="https://xyzabcdefg.supabase.co"
                value={config.url}
                onChange={(e) => setConfig({ ...config, url: e.target.value })}
                className="w-full px-3 py-2 text-xs font-mono bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-600 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Supabase Anon (Public) Key:
              </label>
              <textarea
                rows={3}
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                value={config.anonKey}
                onChange={(e) => setConfig({ ...config, anonKey: e.target.value })}
                className="w-full p-2.5 text-xs font-mono bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-600 focus:bg-white"
              />
            </div>
          </div>

          {testResult && (
            <div className={`p-3 rounded-lg border text-xs flex items-start gap-2 ${
              testResult.success
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : 'bg-rose-50 text-rose-800 border-rose-200'
            }`}>
              {testResult.success ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              )}
              <span className="leading-relaxed">{testResult.message}</span>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2">
          <button
            type="button"
            onClick={handleUseMock}
            className="text-xs text-slate-600 hover:text-slate-900 underline"
          >
            Gunakan Mode Offline Local
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleTestConnection}
              disabled={testing}
              className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-1.5"
            >
              {testing ? <RefreshCw className="w-3 h-3 animate-spin" /> : null}
              <span>{testing ? 'Menguji...' : 'Uji Koneksi'}</span>
            </button>

            <button
              type="button"
              onClick={handleSave}
              className="px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition-colors shadow-xs"
            >
              Simpan &amp; Terapkan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

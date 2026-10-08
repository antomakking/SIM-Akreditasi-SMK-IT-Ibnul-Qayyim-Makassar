import React from 'react';
import { Komponen, EvaluasiAsesi } from '../types/akreditasi';
import { X, Download, FileSpreadsheet, FileJson, Printer, CheckCircle } from 'lucide-react';

interface ExportReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  komponenList: Komponen[];
  evaluasiMap: Record<string, EvaluasiAsesi>;
}

export const ExportReportModal: React.FC<ExportReportModalProps> = ({
  isOpen,
  onClose,
  komponenList,
  evaluasiMap,
}) => {
  if (!isOpen) return null;

  const handleExportJson = () => {
    const reportData = {
      sekolah: 'SMK IT Ibnul Qayyim Makassar',
      npsn: '69984920',
      instrumen: 'BAN-PDM SMK/MAK 2024 (Versi 2025)',
      exported_at: new Date().toISOString(),
      evaluasi: evaluasiMap,
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `evaluasi_akreditasi_smkit_ibnul_qayyim_${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleExportCsv = () => {
    const rows = [
      ['Kode Komponen', 'Komponen', 'Kode Butir', 'Nama Butir', 'Kode Indikator', 'Nama Indikator', 'Capaian', 'Skor', 'Catatan Evaluasi', 'Status Verifikasi', 'Bukti Link']
    ];

    komponenList.forEach((k) => {
      k.butir?.forEach((b) => {
        b.indikator?.forEach((ind) => {
          const evalItem = evaluasiMap[ind.id];
          const capaian = evalItem ? evalItem.capaian : 'Belum Diisi';
          const skor = evalItem ? String(evalItem.skor) : '0';
          const catatan = evalItem ? `"${evalItem.catatan.replace(/"/g, '""')}"` : '""';
          const status = evalItem ? evalItem.status_verifikasi : 'Belum Diunggah';
          const links = evalItem?.bukti_urls ? `"${evalItem.bukti_urls.join(' ; ')}"` : '""';

          rows.push([
            k.kode,
            `"${k.nama.replace(/"/g, '""')}"`,
            b.kode,
            `"${b.nama.replace(/"/g, '""')}"`,
            ind.kode,
            `"${ind.nama.replace(/"/g, '""')}"`,
            capaian,
            skor,
            catatan,
            status,
            links
          ]);
        });
      });
    });

    const csvContent = rows.map((r) => r.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `rekap_dia_banpdm_smkit_ibnul_qayyim_${Date.now()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
      <div className="bg-white rounded-xl border border-slate-200 shadow-xl max-w-2xl w-full overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Download className="w-4 h-4 text-emerald-700" />
            <h3 className="text-sm font-bold text-slate-900">
              Ekspor Laporan Evaluasi Diri (DIA BAN-PDM)
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
        <div className="p-6 space-y-4 overflow-y-auto">
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-1">
            <h4 className="text-xs font-bold text-slate-900">
              Data Isian Akreditasi (DIA) SMK IT Ibnul Qayyim Makassar
            </h4>
            <p className="text-xs text-slate-500">
              Dokumen rekapitulasi capaian 4 komponen dan 16 butir standar akreditasi BAN-PDM SMK/MAK 2024 (Versi 2025).
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={handleExportCsv}
              className="p-4 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition-colors text-left flex items-start gap-3 shadow-xs"
            >
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                <FileSpreadsheet className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 block mb-0.5">
                  Format Spreadsheet (.CSV / Excel)
                </span>
                <p className="text-[11px] text-slate-500 leading-snug">
                  Daftar komprehensif kolom per indikator, rubrik yang dipilih, catatan evaluasi, dan link bukti fisik.
                </p>
              </div>
            </button>

            <button
              onClick={handleExportJson}
              className="p-4 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition-colors text-left flex items-start gap-3 shadow-xs"
            >
              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center shrink-0">
                <FileJson className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 block mb-0.5">
                  Format Raw Data (.JSON)
                </span>
                <p className="text-[11px] text-slate-500 leading-snug">
                  Struktur data JSON lengkap untuk sinkronisasi, migrasi database Supabase, atau backup asesi.
                </p>
              </div>
            </button>
          </div>

          <div className="pt-2">
            <button
              onClick={handlePrint}
              className="w-full py-2.5 px-3 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
            >
              <Printer className="w-4 h-4 text-slate-500" />
              <span>Cetak / Cetak PDF (Browser Print)</span>
            </button>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};

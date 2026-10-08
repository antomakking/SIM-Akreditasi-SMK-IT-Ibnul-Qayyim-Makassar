import React from 'react';
import { X, Award, ShieldCheck, Calendar, FileText, CheckCircle2, Download, Printer, QrCode, Building2, MapPin } from 'lucide-react';
import { DATA_SEKOLAH_AKREDITASI } from '../data/akreditasiData';

interface SertifikatAkreditasiModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SertifikatAkreditasiModal: React.FC<SertifikatAkreditasiModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-3xl w-full overflow-hidden flex flex-col my-6 animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Top Control Bar */}
        <div className="px-6 py-3.5 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <span className="text-xs sm:text-sm font-bold tracking-tight">
              Salinan Digital Sertifikat Akreditasi BAN-PDM
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors text-xs flex items-center gap-1 font-medium"
              title="Cetak Sertifikat"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">Cetak</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Certificate Paper Canvas */}
        <div className="p-6 sm:p-10 bg-gradient-to-b from-amber-50/30 via-white to-amber-50/20 flex flex-col items-center text-center space-y-6 border-b border-slate-200">
          {/* Logo BAN-PDM Badge */}
          <div className="flex flex-col items-center space-y-1.5">
            <div className="w-16 h-16 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-2xl shadow-md border-4 border-amber-300">
              IQ
            </div>
            <div className="text-xs font-black tracking-widest text-emerald-800 uppercase">
              BAN-PDM
            </div>
            <div className="text-[11px] font-medium text-slate-500 max-w-md leading-tight">
              Badan Akreditasi Nasional Pendidikan Anak Usia Dini, Pendidikan Dasar, dan Pendidikan Menengah
            </div>
          </div>

          {/* Judul & Nomor Sertifikat */}
          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 uppercase">
              Sertifikat Akreditasi
            </h2>
            <p className="text-xs sm:text-sm font-mono font-bold text-slate-700">
              {DATA_SEKOLAH_AKREDITASI.noSertifikat}
            </p>
          </div>

          {/* Keterangan SK */}
          <div className="max-w-xl text-xs sm:text-sm text-slate-600 leading-relaxed">
            <p>
              Keputusan Ketua Badan Akreditasi Nasional Pendidikan Anak Usia Dini, Pendidikan Dasar, dan Pendidikan Menengah
            </p>
            <p className="font-semibold text-slate-800 mt-0.5 font-mono">
              Nomor: {DATA_SEKOLAH_AKREDITASI.nomorSk}
            </p>
            <p className="mt-2 text-xs italic text-slate-500">
              menyatakan bahwa:
            </p>
          </div>

          {/* Identitas Satuan Pendidikan */}
          <div className="bg-white/80 p-5 rounded-xl border border-amber-200 shadow-xs max-w-lg w-full space-y-1.5">
            <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
              {DATA_SEKOLAH_AKREDITASI.nama}
            </h3>
            <p className="text-xs sm:text-sm font-mono font-bold text-emerald-800">
              (NPSN {DATA_SEKOLAH_AKREDITASI.npsn})
            </p>
            <p className="text-xs text-slate-600 uppercase font-medium leading-normal pt-1">
              {DATA_SEKOLAH_AKREDITASI.alamat}
            </p>
          </div>

          {/* Peringkat Akreditasi Utama */}
          <div className="space-y-2">
            <div className="inline-block px-8 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white font-black text-2xl sm:text-3xl shadow-lg border-2 border-emerald-300 tracking-wide">
              {DATA_SEKOLAH_AKREDITASI.statusAkreditasi}
            </div>
            <div className="text-xs sm:text-sm text-slate-700 max-w-md font-medium leading-relaxed">
              Sertifikat ini berlaku sampai dengan tanggal{' '}
              <strong className="text-emerald-800 underline font-bold">
                {DATA_SEKOLAH_AKREDITASI.tanggalMasaBerlaku}
              </strong>
              .
            </div>
            <p className="text-[11px] text-slate-500 max-w-md italic">
              Peringkat akreditasi ini diberikan berdasarkan asesmen lapangan atas kinerja satuan pendidikan.
            </p>
          </div>

          {/* Tanda Tangan Elektronik & QR Code */}
          <div className="pt-4 border-t border-slate-200/80 w-full max-w-md flex flex-col sm:flex-row items-center justify-between gap-4 text-left">
            <div className="space-y-1 text-center sm:text-left">
              <p className="text-[11px] text-slate-500">
                Ditetapkan di Jakarta, Pada tanggal {DATA_SEKOLAH_AKREDITASI.tanggalPenetapan}
              </p>
              <p className="text-[11px] font-medium text-slate-600">
                Ditandatangani secara elektronik oleh:
              </p>
              <p className="text-xs font-bold text-slate-800">
                Ketua BAN-PDM
              </p>
              <p className="text-xs font-black text-slate-900 pt-1">
                {DATA_SEKOLAH_AKREDITASI.pejabatPenandatangan}
              </p>
            </div>

            <div className="flex flex-col items-center p-2 bg-white rounded-lg border border-slate-200 shadow-2xs shrink-0">
              <div className="w-16 h-16 bg-slate-900 text-white flex items-center justify-center rounded p-1">
                <QrCode className="w-14 h-14 text-white" />
              </div>
              <span className="text-[9px] text-slate-400 font-mono mt-1">BSrE Verified</span>
            </div>
          </div>

          {/* Legalitas BSrE Footer Note */}
          <div className="text-[10px] text-slate-400 max-w-xl text-center leading-normal pt-2">
            Dokumen ini ditandatangani secara elektronik dengan menggunakan sertifikat elektronik yang diterbitkan oleh BSrE. Berdasarkan UU ITE Tahun 2008 Pasal 5 Ayat 1, "Informasi Elektronik dan/atau Dokumen Elektronik dan/atau hasil cetaknya merupakan alat bukti hukum yang sah".
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="px-6 py-4 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Status Data Terverifikasi Resmi BAN-PDM Kemendikbudristek</span>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-xs w-full sm:w-auto"
          >
            Tutup Pratinjau
          </button>
        </div>
      </div>
    </div>
  );
};

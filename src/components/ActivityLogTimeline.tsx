import React from 'react';
import { ActivityLog } from '../types/akreditasi';
import { History, User, Clock, ArrowRight, FileText, CheckCircle2, ShieldCheck, Edit3, PlusCircle, Check } from 'lucide-react';

interface ActivityLogTimelineProps {
  logs: ActivityLog[];
  indikatorKode?: string;
  maxItems?: number;
  emptyMessage?: string;
}

export const ActivityLogTimeline: React.FC<ActivityLogTimelineProps> = ({
  logs,
  indikatorKode,
  maxItems = 10,
  emptyMessage = 'Belum ada riwayat aktivitas pengeditan tercatat.',
}) => {
  const displayLogs = logs.slice(0, maxItems);

  if (displayLogs.length === 0) {
    return (
      <div className="p-6 bg-slate-50/70 border border-slate-200/80 rounded-xl text-center text-xs text-slate-500 flex flex-col items-center justify-center gap-2">
        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
          <History className="w-5 h-5" />
        </div>
        <span className="font-medium">{emptyMessage}</span>
      </div>
    );
  }

  const formatRelativeOrDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / (1000 * 60));
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      if (diffMins < 1) return 'Baru saja';
      if (diffMins < 60) return `${diffMins} mnt lalu`;
      if (diffHours < 24) return `${diffHours} jam lalu`;
      if (diffDays === 1) return 'Kemarin';
      if (diffDays < 7) return `${diffDays} hari lalu`;

      return new Intl.DateTimeFormat('id-ID', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      }).format(date);
    } catch {
      return isoString;
    }
  };

  const getActionConfig = (action: ActivityLog['action']) => {
    switch (action) {
      case 'CREATE':
        return {
          icon: <PlusCircle className="w-3.5 h-3.5 text-white" />,
          circleBg: 'bg-[#10B981]', // Vibrant Emerald
          badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          label: 'Isian Baru Dibuat',
        };
      case 'VALIDATION_REVIEW':
        return {
          icon: <ShieldCheck className="w-3.5 h-3.5 text-white" />,
          circleBg: 'bg-[#8B5CF6]', // Vibrant Purple
          badgeBg: 'bg-purple-50 text-purple-700 border-purple-200',
          label: 'Review Validator',
        };
      case 'STATUS_CHANGE':
        return {
          icon: <Check className="w-3.5 h-3.5 text-white" />,
          circleBg: 'bg-[#0084FF]', // Electric Sky Blue
          badgeBg: 'bg-blue-50 text-blue-700 border-blue-200',
          label: 'Verifikasi Status',
        };
      case 'EVIDENCE_UPDATE':
        return {
          icon: <FileText className="w-3.5 h-3.5 text-white" />,
          circleBg: 'bg-[#FFB300]', // Warm Sunflower Yellow
          badgeBg: 'bg-amber-50 text-amber-700 border-amber-200',
          label: 'Pembaruan Bukti Fisik',
        };
      case 'UPDATE':
      default:
        return {
          icon: <Edit3 className="w-3.5 h-3.5 text-white" />,
          circleBg: 'bg-[#FF5722]', // Coral / Pink
          badgeBg: 'bg-orange-50 text-orange-700 border-orange-200',
          label: 'Perubahan Evaluasi',
        };
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative pl-7 space-y-4 before:absolute before:left-3.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200/80">
        {displayLogs.map((log) => {
          const config = getActionConfig(log.action);
          return (
            <div key={log.id} className="relative group">
              {/* Vibrant Circular Icon Badge matching reference image */}
              <div className={`absolute -left-7 top-1.5 w-7 h-7 rounded-full ${config.circleBg} flex items-center justify-center shadow-xs ring-4 ring-white`}>
                {config.icon}
              </div>

              <div className="bg-white hover:bg-slate-50/80 transition-all p-3.5 rounded-xl border border-slate-200/80 shadow-2xs text-xs space-y-2">
                {/* Baris Judul Tindakan & Waktu */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-xs sm:text-sm">
                      {config.label}
                    </span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${config.badgeBg}`}>
                      {log.user_role}
                    </span>
                  </div>
                  <span className="text-[11px] font-medium text-slate-400 font-mono">
                    {formatRelativeOrDate(log.timestamp)}
                  </span>
                </div>

                {/* Info Pengguna */}
                <div className="flex items-center gap-1.5 text-xs text-slate-600">
                  <span className="font-medium text-slate-800">{log.user_name}</span>
                  <span className="text-slate-400">·</span>
                  <span className="text-slate-500">Peran: {log.user_role}</span>
                </div>

                {/* Perubahan Capaian atau Status */}
                {(log.previous_capaian || log.new_capaian || log.previous_status || log.new_status) && (
                  <div className="flex flex-wrap items-center gap-2 text-[11px] bg-slate-50 p-2 rounded-lg border border-slate-100">
                    {log.new_capaian && (
                      <div className="flex items-center gap-1">
                        <span className="text-slate-500">Capaian:</span>
                        {log.previous_capaian && log.previous_capaian !== log.new_capaian && (
                          <>
                            <span className="line-through text-slate-400">{log.previous_capaian}</span>
                            <ArrowRight className="w-2.5 h-2.5 text-slate-400" />
                          </>
                        )}
                        <span className="font-bold text-[#FF5722]">{log.new_capaian}</span>
                      </div>
                    )}

                    {log.new_status && (
                      <div className="flex items-center gap-1 pl-2 border-l border-slate-200">
                        <span className="text-slate-500">Status:</span>
                        {log.previous_status && log.previous_status !== log.new_status && (
                          <>
                            <span className="line-through text-slate-400">{log.previous_status}</span>
                            <ArrowRight className="w-2.5 h-2.5 text-slate-400" />
                          </>
                        )}
                        <span className="font-bold text-[#0084FF]">{log.new_status}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Cuplikan Catatan */}
                {log.notes_snippet && (
                  <p className="text-slate-600 text-[11px] italic leading-relaxed bg-slate-50/50 p-2 rounded border border-slate-100">
                    "{log.notes_snippet}"
                  </p>
                )}

                {/* Catatan Validator */}
                {log.validator_notes && (
                  <div className="mt-1.5 p-2.5 bg-purple-50/90 border border-purple-200 rounded-lg text-[11px] text-purple-950 space-y-0.5">
                    <span className="font-bold text-purple-900 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-purple-700" />
                      Rekomendasi / Catatan Validator:
                    </span>
                    <p className="text-purple-800 leading-relaxed">{log.validator_notes}</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};


import { ReviewerNote, ReviewerNoteReply, UserRole, UserProfile } from '../types/akreditasi';

const STORAGE_KEY = 'sim_akreditasi_reviewer_notes_v1';

// Initial seeded collaboration notes between asesi, admin, and reviewer
const DEFAULT_REVIEWER_NOTES: ReviewerNote[] = [
  {
    id: 'note-1',
    komponen_id: 'komp-1',
    indikator_id: 'ind-1.1.1',
    indikator_kode: 'IND-1.1.1',
    target_audience: 'admin',
    category: 'catatan_admin',
    priority: 'tinggi',
    author_name: 'Ahmad Fadhil, S.Kom',
    author_role: 'Asesi',
    author_title: 'Ketua Tim Asesi',
    message: 'Mohon bantuan Kepala Sekolah/Admin untuk mengunggah SK Penetapan Kurikulum Konsentrasi Keahlian RPL 2024/2025 yang telah ditandatangani basah dan dicap resmi oleh Pengawas Cabang Dinas Pendidikan Wilayah I.',
    status: 'terbuka',
    created_at: new Date(Date.now() - 3600000 * 26).toISOString(), // ~1 day ago
    replies: [
      {
        id: 'rep-1-1',
        author_name: 'Drs. H. M. Said, M.Pd',
        author_role: 'Admin',
        author_title: 'Kepala Satuan Pendidikan',
        message: 'Sudah ditandatangani kemarin sore. Dokumen scan PDF resolusi tinggi sedang diunggah staf TU ke folder Google Drive resmi.',
        created_at: new Date(Date.now() - 3600000 * 18).toISOString(),
      }
    ]
  },
  {
    id: 'note-2',
    komponen_id: 'komp-1',
    indikator_id: 'ind-1.1.2',
    indikator_kode: 'IND-1.1.2',
    target_audience: 'asesi',
    category: 'reviu_dokumen',
    priority: 'sedang',
    author_name: 'Dr. Ir. H. Abdurrahman, M.T',
    author_role: 'Validator',
    author_title: 'Asesor Internal BAN-PDM',
    message: 'Checklist bukti catatan guru & komunikasi orang tua sudah bagus. Namun perlu dilengkapi tangkapan layar log komunikasi WhatsApp grup wali murid dan buku penghubung murid bermasalah semester lalu.',
    status: 'proses',
    created_at: new Date(Date.now() - 3600000 * 42).toISOString(),
    replies: [
      {
        id: 'rep-2-1',
        author_name: 'Nur Hidayah, S.Pd',
        author_role: 'Asesi',
        author_title: 'Waka Kurikulum',
        message: 'Siap Pak Auditor, berkas dokumentasi konseling dan buku bimbingan BK sedang dikompilasi oleh tim Guru BK untuk disematkan pada link bukti.',
        created_at: new Date(Date.now() - 3600000 * 12).toISOString(),
      }
    ]
  },
  {
    id: 'note-3',
    komponen_id: 'komp-2',
    indikator_id: 'ind-2.1.1',
    indikator_kode: 'IND-2.1.1',
    target_audience: 'semua',
    category: 'diskusi_asesi',
    priority: 'tinggi',
    author_name: 'Fatimah Az-Zahra, S.Sos',
    author_role: 'Asesi',
    author_title: 'Koordinator BKK & Kemitraan',
    message: 'Terkait butir kemitraan industri: Dokumen MoU dengan 12 Mitra DUDIKA Software House telah lengkap dengan lampiran silabus sinkronisasi pembelajaran praktikum.',
    status: 'selesai',
    created_at: new Date(Date.now() - 3600000 * 72).toISOString(),
    resolved_by: 'Ahmad Fadhil, S.Kom (Ketua Tim Asesi)',
    resolved_at: new Date(Date.now() - 3600000 * 20).toISOString(),
    replies: [
      {
        id: 'rep-3-1',
        author_name: 'Muh. Yusuf, S.T',
        author_role: 'Asesi',
        author_title: 'Kepala Lab IT',
        message: 'Terima kasih Bu Fatimah, lampiran MoU juga sudah disinkronkan dengan program teaching factory lab komputer.',
        created_at: new Date(Date.now() - 3600000 * 30).toISOString(),
      }
    ]
  },
  {
    id: 'note-4',
    komponen_id: 'komp-3',
    indikator_id: 'ind-3.1.1',
    indikator_kode: 'IND-3.1.1',
    target_audience: 'admin',
    category: 'tindak_lanjut',
    priority: 'sedang',
    author_name: 'Nur Hidayah, S.Pd',
    author_role: 'Asesi',
    author_title: 'Waka Kurikulum',
    message: 'Untuk Rencana Pembelajaran Berdiferensiasi, dibutuhkan pengesahan kurikulum operasional satuan pendidikan (KOSP) tahun berjalan.',
    status: 'terbuka',
    created_at: new Date(Date.now() - 3600000 * 14).toISOString(),
    replies: []
  }
];

export function getStoredReviewerNotes(): ReviewerNote[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Error loading reviewer notes from storage:', e);
  }
  // Initialize with seed data
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_REVIEWER_NOTES));
  } catch {}
  return DEFAULT_REVIEWER_NOTES;
}

export function saveReviewerNotes(notes: ReviewerNote[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  } catch (e) {
    console.error('Error saving reviewer notes to storage:', e);
  }
}

export function addReviewerNote(
  noteInput: Omit<ReviewerNote, 'id' | 'created_at' | 'replies' | 'status' | 'author_name' | 'author_role' | 'author_title' | 'author_id'>,
  currentUser: UserProfile
): ReviewerNote {
  const notes = getStoredReviewerNotes();
  const newNote: ReviewerNote = {
    ...noteInput,
    id: `note-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    author_name: currentUser.name,
    author_role: currentUser.role,
    author_title: currentUser.title,
    author_id: currentUser.id,
    status: 'terbuka',
    created_at: new Date().toISOString(),
    replies: []
  };

  const updated = [newNote, ...notes];
  saveReviewerNotes(updated);
  return newNote;
}

export function addNoteReply(
  noteId: string,
  message: string,
  currentUser: UserProfile
): ReviewerNote | null {
  const notes = getStoredReviewerNotes();
  const noteIndex = notes.findIndex(n => n.id === noteId);
  if (noteIndex === -1) return null;

  const newReply: ReviewerNoteReply = {
    id: `rep-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    author_id: currentUser.id,
    author_name: currentUser.name,
    author_role: currentUser.role,
    author_title: currentUser.title,
    message: message.trim(),
    created_at: new Date().toISOString()
  };

  const currentReplies = notes[noteIndex].replies || [];
  notes[noteIndex] = {
    ...notes[noteIndex],
    replies: [...currentReplies, newReply],
    updated_at: new Date().toISOString()
  };

  saveReviewerNotes(notes);
  return notes[noteIndex];
}

export function updateNoteStatus(
  noteId: string,
  newStatus: ReviewerNote['status'],
  currentUser: UserProfile
): ReviewerNote | null {
  const notes = getStoredReviewerNotes();
  const noteIndex = notes.findIndex(n => n.id === noteId);
  if (noteIndex === -1) return null;

  const note = notes[noteIndex];
  notes[noteIndex] = {
    ...note,
    status: newStatus,
    updated_at: new Date().toISOString(),
    ...(newStatus === 'selesai'
      ? {
          resolved_by: `${currentUser.name} (${currentUser.role})`,
          resolved_at: new Date().toISOString()
        }
      : {
          resolved_by: undefined,
          resolved_at: undefined
        })
  };

  saveReviewerNotes(notes);
  return notes[noteIndex];
}

export function deleteReviewerNote(noteId: string): boolean {
  const notes = getStoredReviewerNotes();
  const filtered = notes.filter(n => n.id !== noteId);
  if (filtered.length !== notes.length) {
    saveReviewerNotes(filtered);
    return true;
  }
  return false;
}

export function getNotesSummary(notes: ReviewerNote[], komponenId?: string, indikatorId?: string) {
  const relevant = notes.filter(n => {
    if (komponenId && n.komponen_id !== komponenId) return false;
    if (indikatorId && n.indikator_id && n.indikator_id !== indikatorId) return false;
    return true;
  });

  const total = relevant.length;
  const terbuka = relevant.filter(n => n.status === 'terbuka').length;
  const proses = relevant.filter(n => n.status === 'proses').length;
  const selesai = relevant.filter(n => n.status === 'selesai').length;
  const untukAdmin = relevant.filter(n => n.target_audience === 'admin' && n.status !== 'selesai').length;
  const prioritasTinggi = relevant.filter(n => n.priority === 'tinggi' && n.status !== 'selesai').length;

  return {
    total,
    terbuka,
    proses,
    selesai,
    unresolved: terbuka + proses,
    untukAdmin,
    prioritasTinggi
  };
}

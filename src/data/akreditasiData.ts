import { Komponen, EvaluasiAsesi } from '../types/akreditasi';

export interface ProfilSekolahAkreditasi {
  nama: string;
  npsn: string;
  alamat: string;
  kelurahan: string;
  kecamatan: string;
  kota: string;
  provinsi: string;
  noSertifikat: string;
  nomorSk: string;
  peringkat: string;
  statusAkreditasi: string;
  tanggalPenetapan: string;
  tanggalMasaBerlaku: string;
  masaBerlakuTahun: number;
  pejabatPenandatangan: string;
  jabatanPenandatangan: string;
  lembagaAkreditasi: string;
}

export const DATA_SEKOLAH_AKREDITASI: ProfilSekolahAkreditasi = {
  nama: 'SMK IT IBNUL QAYYIM MAKASSAR',
  npsn: '70031494',
  alamat: 'JL. PERINTIS KEMERDEKAAN KM. 15, P A I, BIRINGKANAYA, KOTA MAKASSAR, SULAWESI SELATAN',
  kelurahan: 'Pai',
  kecamatan: 'Biringkanaya',
  kota: 'Kota Makassar',
  provinsi: 'Sulawesi Selatan',
  noSertifikat: 'No. SA00399/73/SMK/2024',
  nomorSk: '031/BAN-PDM/SK/2025',
  peringkat: 'A',
  statusAkreditasi: 'Terakreditasi A',
  tanggalPenetapan: '06 Januari 2025',
  tanggalMasaBerlaku: '31 Desember 2029',
  masaBerlakuTahun: 2029,
  pejabatPenandatangan: 'Totok Suprayitno, Ph.D.',
  jabatanPenandatangan: 'Ketua Badan Akreditasi Nasional Pendidikan Anak Usia Dini, Pendidikan Dasar, dan Pendidikan Menengah',
  lembagaAkreditasi: 'BAN-PDM',
};

export const INITIAL_KOMPONEN_DATA: Komponen[] = [
  {
    id: 'a1111111-1111-4111-a111-111111111111',
    kode: 'K1',
    nomor: 1,
    nama: 'Kinerja Pendidik dalam Mengelola Proses Pembelajaran yang Berpusat pada Peserta Didik',
    deskripsi: 'Mengukur kapasitas guru dalam memfasilitasi pembelajaran, interaksi aktif dan empatik, penciptaan suasana belajar yang aman dan nyaman, serta membangun kompetensi dan karakter murid.',
    bobot: 25,
    butir: [
      {
        id: 'b1',
        komponen_id: 'a1111111-1111-4111-a111-111111111111',
        nomor: 1,
        kode: 'Butir 1',
        nama: 'Pendidik menyediakan dukungan sosial emosional bagi peserta didik dalam proses pembelajaran',
        deskripsi: 'Membangun suasana interaksi yang setara, menghargai murid, memberikan perhatian ekstra, serta menerapkan pola pikir bertumbuh (growth mindset).',
        indikator: [
          {
            id: 'ind-1.1.1',
            butir_id: 'b1',
            nomor: 1,
            kode: '1.1.1',
            nama: 'Interaksi guru dan murid yang setara dan menghargai',
            definisi_operasional: 'Mengukur kinerja guru dalam berinteraksi dengan murid selama proses pembelajaran yang membuat murid merasa aman untuk bertanya, berpendapat, berdiskusi, dan tidak takut salah.',
            penjelasan: 'Interaksi positif membuat murid nyaman. Guru mendengarkan seksama, menanggapi relevan, memberi kesempatan minimal pada 3 murid, dan tidak merendahkan.',
            rubrik_penilaian: [
              { id: 'r111-1', indikator_id: 'ind-1.1.1', level: 1, kategori: 'Kurang', deskripsi: 'Guru mengabaikan/tidak menanggapi komentar murid atau tanggapannya bersifat merendahkan/stigma negatif.' },
              { id: 'r111-2', indikator_id: 'ind-1.1.1', level: 2, kategori: 'Cukup Baik', deskripsi: 'Guru memberi kesempatan bertanya, namun hanya mendengar sepintas dan merespons tergesa-gesa sekadarnya.' },
              { id: 'r111-3', indikator_id: 'ind-1.1.1', level: 3, kategori: 'Baik', deskripsi: 'Guru mendengarkan dengan seksama, memberi tanggapan relevan, dan memberi kesempatan pada 3 atau lebih murid.' },
              { id: 'r111-4', indikator_id: 'ind-1.1.1', level: 4, kategori: 'Sangat Baik', deskripsi: 'Guru menggali maksud murid lebih lanjut, memberi tanggapan relevan dengan bahasa yang membangun semangat kepada 3 atau lebih murid.' }
            ],
            bukti_fisik: [
              { id: 'bf111-1', indikator_id: 'ind-1.1.1', kode: 'BF-1.1.1-A', nama: 'Observasi kelas saat proses pembelajaran', jenis: 'Observasi', deskripsi: 'Interaksi tanya jawab guru-murid dan dorongan aktif.', wajib: true },
              { id: 'bf111-2', indikator_id: 'ind-1.1.1', kode: 'BF-1.1.1-B', nama: 'Telaah dokumen RPP / Modul Ajar', jenis: 'Dokumen', deskripsi: 'RPP dirancang mendorong interaksi aktif dan diskusi.', wajib: true },
              { id: 'bf111-3', indikator_id: 'ind-1.1.1', kode: 'BF-1.1.1-C', nama: 'Hasil wawancara guru dan murid', jenis: 'Wawancara', deskripsi: 'Konfirmasi rasa aman berpendapat dan tidak takut salah.', wajib: true }
            ]
          },
          {
            id: 'ind-1.1.2',
            butir_id: 'b1',
            nomor: 2,
            kode: '1.1.2',
            nama: 'Perhatian kepada murid yang memerlukan dukungan lebih/ekstra dalam pembelajaran',
            definisi_operasional: 'Mengukur kinerja guru dalam mengidentifikasi murid yang memerlukan dukungan lebih/ekstra dalam pembelajaran dan memberikan pendampingan agar murid dapat mencapai tujuan pembelajaran.',
            penjelasan: 'Identifikasi murid dengan capaian di bawah standar atau kendala belajar, kemudian memberikan bimbingan terencana/berkesinambungan.',
            rubrik_penilaian: [
              { id: 'r112-1', indikator_id: 'ind-1.1.2', level: 1, kategori: 'Kurang', deskripsi: 'Guru belum mengidentifikasi murid yang butuh dukungan ekstra dan belum ada upaya pendampingan.' },
              { id: 'r112-2', indikator_id: 'ind-1.1.2', level: 2, kategori: 'Cukup Baik', deskripsi: 'Guru telah mengidentifikasi murid, namun belum ada upaya memberi pendampingan nyata.' },
              { id: 'r112-3', indikator_id: 'ind-1.1.2', level: 3, kategori: 'Baik', deskripsi: 'Guru mengidentifikasi murid, mencari info dari ortu/guru lain, dan memberi dukungan insidental.' },
              { id: 'r112-4', indikator_id: 'ind-1.1.2', level: 4, kategori: 'Sangat Baik', deskripsi: 'Guru mengidentifikasi, berdiskusi dengan orang tua/guru lain, memberi dukungan berkesinambungan mencakup aspek belajar dan sosial emosional.' }
            ],
            bukti_fisik: [
              { id: 'bf112-1', indikator_id: 'ind-1.1.2', kode: 'BF-1.1.2-A', nama: 'Dokumentasi bimbingan/pendampingan (foto/daftar hadir/laporan)', jenis: 'Dokumen', deskripsi: 'Bukti pelaksanaan remedial/pendampingan khusus.', wajib: true },
              { id: 'bf112-2', indikator_id: 'ind-1.1.2', kode: 'BF-1.1.2-B', nama: 'Catatan guru & komunikasi orang tua/wali', jenis: 'Wawancara', deskripsi: 'Log bimbingan dan tangkapan layar/surat komunikasi.', wajib: true }
            ]
          },
          {
            id: 'ind-1.1.3',
            butir_id: 'b1',
            nomor: 3,
            kode: '1.1.3',
            nama: 'Guru menerapkan pola pikir bertumbuh untuk menguatkan keterampilan sosial emosional murid dalam proses belajar',
            definisi_operasional: 'Mengukur kinerja guru dalam menerapkan berbagai strategi untuk membangun efikasi diri murid saat belajar sehingga murid memiliki pola pikir bertumbuh, keterampilan sosial emosional, dan mandiri mengatasi tantangan.',
            penjelasan: 'Guru berempati pada emosi negatif murid (bosan, frustrasi), membangun efikasi diri bertahap, dan memberi keteladanan mengelola masalah.',
            rubrik_penilaian: [
              { id: 'r113-1', indikator_id: 'ind-1.1.3', level: 1, kategori: 'Kurang', deskripsi: 'Guru belum memahami pola pikir bertumbuh dan belum mampu berempati saat murid mengekspresikan emosi negatif/kesulitan.' },
              { id: 'r113-2', indikator_id: 'ind-1.1.3', level: 2, kategori: 'Cukup Baik', deskripsi: 'Guru menunjukkan pengertian growth mindset, sebagian berempati, namun belum mampu membimbing kemandirian murid.' },
              { id: 'r113-3', indikator_id: 'ind-1.1.3', level: 3, kategori: 'Baik', deskripsi: 'Guru menerapkan pola pikir bertumbuh, berempati pada kesulitan murid, dan membimbing kemandirian mengelola emosi.' },
              { id: 'r113-4', indikator_id: 'ind-1.1.3', level: 4, kategori: 'Sangat Baik', deskripsi: 'Guru memberi keteladanan growth mindset, memahami akar masalah, dan menguatkan kemandirian murid secara sistematis.' }
            ],
            bukti_fisik: [
              { id: 'bf113-1', indikator_id: 'ind-1.1.3', kode: 'BF-1.1.3-A', nama: 'Observasi kelas frekuensi umpan balik positif & penanganan kesalahan', jenis: 'Observasi', deskripsi: 'Kesempatan mencoba kembali dan interaksi motivatif.', wajib: true },
              { id: 'bf113-2', indikator_id: 'ind-1.1.3', kode: 'BF-1.1.3-B', nama: 'Jurnal refleksi murid & portofolio keterampilan', jenis: 'Produk Siswa', deskripsi: 'Refleksi berkala dan catatan perkembangan karya.', wajib: true }
            ]
          }
        ]
      },
      {
        id: 'b2',
        komponen_id: 'a1111111-1111-4111-a111-111111111111',
        nomor: 2,
        kode: 'Butir 2',
        nama: 'Pendidik mengelola kelas untuk menciptakan suasana belajar yang aman, nyaman, dan mendukung tercapainya tujuan pembelajaran',
        deskripsi: 'Pengelolaan kelas kondusif melalui kesepakatan kelas partisipatif, penegakan disiplin positif tanpa tindakan agresif, dan manajemen waktu pembelajaran yang efektif.',
        indikator: [
          {
            id: 'ind-1.2.1',
            butir_id: 'b2',
            nomor: 1,
            kode: '1.2.1',
            nama: 'Penggunaan kesepakatan kelas yang dirumuskan secara partisipatif untuk mengelola suasana belajar yang kondusif',
            definisi_operasional: 'Mengukur kinerja guru dalam mengelola kelas agar suasana belajar kondusif menggunakan kesepakatan kelas yang disusun dengan memperhatikan aspirasi murid.',
            penjelasan: 'Dokumen kesepakatan kelas dipajang, dibuat partisipatif, dievaluasi berkala, dan murid sukarela saling mengingatkan.',
            rubrik_penilaian: [
              { id: 'r121-1', indikator_id: 'ind-1.2.1', level: 1, kategori: 'Kurang', deskripsi: 'Tidak ada kesepakatan kelas atau tidak dapat dijelaskan dengan konsisten.' },
              { id: 'r121-2', indikator_id: 'ind-1.2.1', level: 2, kategori: 'Cukup Baik', deskripsi: 'Ada kesepakatan kelas namun penyusunannya tidak melibatkan aspirasi murid.' },
              { id: 'r121-3', indikator_id: 'ind-1.2.1', level: 3, kategori: 'Baik', deskripsi: 'Disusun melibatkan murid, namun sebagian murid belum optimal menjadikannya acuan perilaku.' },
              { id: 'r121-4', indikator_id: 'ind-1.2.1', level: 4, kategori: 'Sangat Baik', deskripsi: 'Disusun bermakna bersama murid, murid memahami arti pentingnya dan sukarela aktif menegakkannya.' }
            ],
            bukti_fisik: [
              { id: 'bf121-1', indikator_id: 'ind-1.2.1', kode: 'BF-1.2.1-A', nama: 'Poster/dokumen tertulis kesepakatan kelas', jenis: 'Dokumen', deskripsi: 'Bukti fisik kesepakatan kelas terpajang di ruang kelas/lab.', wajib: true },
              { id: 'bf121-2', indikator_id: 'ind-1.2.1', kode: 'BF-1.2.1-B', nama: 'Telaah supervisi & jurnal refleksi guru', jenis: 'Dokumen', deskripsi: 'Catatan penerapan disiplin positif dan review aturan.', wajib: true }
            ]
          },
          {
            id: 'ind-1.2.2',
            butir_id: 'b2',
            nomor: 2,
            kode: '1.2.2',
            nama: 'Tidak ada penggunaan tindakan agresif dalam pengelolaan kelas',
            definisi_operasional: 'Mengukur kinerja guru dalam mengelola kelas secara santun, tegas dan tidak agresif.',
            penjelasan: 'Guru tidak membentak, tidak menggunakan hukuman fisik/verbal, dan mengajak dialog reflektif mengenai dampak perilaku buruk.',
            rubrik_penilaian: [
              { id: 'r122-1', indikator_id: 'ind-1.2.2', level: 1, kategori: 'Kurang', deskripsi: 'Guru menggunakan bahasa kasar/kurang sopan, ancaman, atau menerapkan hukuman fisik.' },
              { id: 'r122-2', indikator_id: 'ind-1.2.2', level: 2, kategori: 'Cukup Baik', deskripsi: 'Tidak ada hukuman fisik, namun masih mengandalkan ancaman non-fisik/sanksi tidak relevan tanpa penjelasan edukatif.' },
              { id: 'r122-3', indikator_id: 'ind-1.2.2', level: 3, kategori: 'Baik', deskripsi: 'Memberi teguran santun, menjelaskan dampak negatif perilaku, dan memberi konsekuensi relevan tanpa hukuman fisik.' },
              { id: 'r122-4', indikator_id: 'ind-1.2.2', level: 4, kategori: 'Sangat Baik', deskripsi: 'Tidak lagi memberi ancaman, selalu mengajak murid berdialog reflektif menyadarkan dampak perilaku, bebas kekerasan verbal/fisik.' }
            ],
            bukti_fisik: [
              { id: 'bf122-1', indikator_id: 'ind-1.2.2', kode: 'BF-1.2.2-A', nama: 'Kode etik/tata tertib guru & SOP perlindungan murid', jenis: 'Dokumen', deskripsi: 'Larangan kekerasan dan pedoman disiplin positif.', wajib: true },
              { id: 'bf122-2', indikator_id: 'ind-1.2.2', kode: 'BF-1.2.2-B', nama: 'Wawancara murid tentang rasa aman dan perlakuan guru', jenis: 'Wawancara', deskripsi: 'Konfirmasi tidak adanya tindakan agresif dari guru.', wajib: true }
            ]
          },
          {
            id: 'ind-1.2.3',
            butir_id: 'b2',
            nomor: 3,
            kode: '1.2.3',
            nama: 'Efektivitas penggunaan jam pembelajaran',
            definisi_operasional: 'Mengukur kinerja guru dalam mengelola suasana belajar yang tertib, tanpa gangguan yang mengalihkan perhatian murid dari aktivitas belajar, sesuai dengan materi dan jadwal mengajar yang telah ditetapkan.',
            penjelasan: 'Memaksimalkan time on task, memulai/mengakhiri tepat waktu, minim gangguan, dan materi tuntas sesuai jadwal.',
            rubrik_penilaian: [
              { id: 'r123-1', indikator_id: 'ind-1.2.3', level: 1, kategori: 'Kurang', deskripsi: 'Guru membiarkan murid beraktivitas di luar pembelajaran, kelas tidak tertib, dan materi sering melenceng dari jadwal.' },
              { id: 'r123-2', indikator_id: 'ind-1.2.3', level: 2, kategori: 'Cukup Baik', deskripsi: 'Materi sesuai jadwal, namun suasana kelas belum selalu tertib dan belum semua murid aktif terlibat.' },
              { id: 'r123-3', indikator_id: 'ind-1.2.3', level: 3, kategori: 'Baik', deskripsi: 'Suasana kelas tertib sepanjang waktu belajar, materi sesuai jadwal, dan mayoritas murid fokus.' },
              { id: 'r123-4', indikator_id: 'ind-1.2.3', level: 4, kategori: 'Sangat Baik', deskripsi: 'Kelas sangat tertib dan hidup, seluruh murid aktif fokus pada pembelajaran, waktu terkelola optimal sesuai silabus.' }
            ],
            bukti_fisik: [
              { id: 'bf123-1', indikator_id: 'ind-1.2.3', kode: 'BF-1.2.3-A', nama: 'Jurnal harian mengajar & daftar hadir kelas', jenis: 'Dokumen', deskripsi: 'Rekap kehadiran tepat waktu dan keterlaksanaan materi.', wajib: true },
              { id: 'bf123-2', indikator_id: 'ind-1.2.3', kode: 'BF-1.2.3-B', nama: 'Observasi kelas/lab mengenai ketertiban & alokasi waktu', jenis: 'Observasi', deskripsi: 'Pemanfaatan waktu belajar tanpa jam kosong.', wajib: true }
            ]
          }
        ]
      },
      {
        id: 'b3',
        komponen_id: 'a1111111-1111-4111-a111-111111111111',
        nomor: 3,
        kode: 'Butir 3',
        nama: 'Pendidik mengelola proses pembelajaran secara efektif dan bermakna',
        deskripsi: 'Penerapan siklus pembelajaran terpadu (perencanaan, pelaksanaan berbasis kompetensi, asesmen formatif-sumatif) dan pemanfaatan hasil asesmen untuk perbaikan berkelanjutan.',
        indikator: [
          {
            id: 'ind-1.3.1',
            butir_id: 'b3',
            nomor: 1,
            kode: '1.3.1',
            nama: 'Pembelajaran yang memfasilitasi murid mencapai kompetensi yang ditetapkan sesuai perencanaan pembelajaran',
            definisi_operasional: 'Mengukur kinerja guru dalam menerapkan berbagai praktik pedagogis yang sesuai sehingga murid mencapai kompetensi yang ditetapkan berdasarkan perencanaan pembelajaran.',
            penjelasan: 'Penerapan metode aktif (PjBL, Teaching Factory, Problem-Based Learning), modul ajar, job sheet, dan sarana praktik terintegrasi.',
            rubrik_penilaian: [
              { id: 'r131-1', indikator_id: 'ind-1.3.1', level: 1, kategori: 'Kurang', deskripsi: 'Guru belum melaksanakan siklus pembelajaran lengkap, pedagogis terbatas, asesmen belum lengkap.' },
              { id: 'r131-2', indikator_id: 'ind-1.3.1', level: 2, kategori: 'Cukup Baik', deskripsi: 'Siklus dilaksanakan lengkap, namun pengalaman belajar belum beragam dan baru sebagian soft skills tercapai.' },
              { id: 'r131-3', indikator_id: 'ind-1.3.1', level: 3, kategori: 'Baik', deskripsi: 'Siklus utuh, praktik pedagogis beragam, asesmen lengkap, memandu murid memahami cara belajarnya.' },
              { id: 'r131-4', indikator_id: 'ind-1.3.1', level: 4, kategori: 'Sangat Baik', deskripsi: 'Siklus lengkap sangat efektif, pedagogis inovatif berstandar industri, memandu kemandirian belajar dan ragam soft skills kejuruan.' }
            ],
            bukti_fisik: [
              { id: 'bf131-1', indikator_id: 'ind-1.3.1', kode: 'BF-1.3.1-A', nama: 'Modul ajar kurikulum terintegrasi industri & job sheet', jenis: 'Dokumen', deskripsi: 'Rencana pembelajaran memuat PjBL/TeFa dan link & match.', wajib: true },
              { id: 'bf131-2', indikator_id: 'ind-1.3.1', kode: 'BF-1.3.1-B', nama: 'Hasil asesmen penguasaan kompetensi vokasional & soft skills', jenis: 'Produk Siswa', deskripsi: 'Portofolio karya proyek dan lembar observasi unjuk kerja.', wajib: true }
            ]
          },
          {
            id: 'ind-1.3.2',
            butir_id: 'b3',
            nomor: 2,
            kode: '1.3.2',
            nama: 'Hasil asesmen dimanfaatkan untuk perbaikan perencanaan dan proses pembelajaran',
            definisi_operasional: 'Mengukur kinerja guru dalam memanfaatkan dan menindaklanjuti hasil asesmen pembelajaran untuk perbaikan perencanaan dan proses pembelajaran.',
            penjelasan: 'Pemanfaatan exit ticket, analisis remedial/pengayaan, modifikasi RPP berdasarkan hasil capaian murid.',
            rubrik_penilaian: [
              { id: 'r132-1', indikator_id: 'ind-1.3.2', level: 1, kategori: 'Kurang', deskripsi: 'Guru belum memanfaatkan hasil asesmen untuk umpan balik maupun perbaikan proses belajar.' },
              { id: 'r132-2', indikator_id: 'ind-1.3.2', level: 2, kategori: 'Cukup Baik', deskripsi: 'Pemanfaatan hasil asesmen masih sangat terbatas untuk umpan balik sederhana.' },
              { id: 'r132-3', indikator_id: 'ind-1.3.2', level: 3, kategori: 'Baik', deskripsi: 'Menindaklanjuti hasil asesmen untuk perbaikan proses dan memberi umpan balik terstruktur.' },
              { id: 'r132-4', indikator_id: 'ind-1.3.2', level: 4, kategori: 'Sangat Baik', deskripsi: 'Hasil asesmen didokumentasikan dalam revisi perencanaan dan menjadi umpan balik rinci untuk kemajuan murid.' }
            ],
            bukti_fisik: [
              { id: 'bf132-1', indikator_id: 'ind-1.3.2', kode: 'BF-1.3.2-A', nama: 'Rekap nilai asesmen & analisis butir soal/praktik', jenis: 'Dokumen', deskripsi: 'Data diagnostik kesulitan belajar dan analisis capaian.', wajib: true },
              { id: 'bf132-2', indikator_id: 'ind-1.3.2', kode: 'BF-1.3.2-B', nama: 'Rencana Tindak Lanjut (RTL) remedial & pengayaan', jenis: 'Dokumen', deskripsi: 'Jadwal dan dokumentasi materi pengayaan/remedial.', wajib: true }
            ]
          }
        ]
      },
      {
        id: 'b4',
        komponen_id: 'a1111111-1111-4111-a111-111111111111',
        nomor: 4,
        kode: 'Butir 4',
        nama: 'Pendidik memfasilitasi pembelajaran yang efektif dalam membangun keimanan, ketakwaan, komitmen kebangsaan, kemampuan bernalar dan memecahkan masalah, serta karakter dan kompetensi lainnya yang relevan bagi peserta didik',
        deskripsi: 'Penguatan nilai spiritual, kecintaan tanah air, nalar kritis pemecahan masalah, dan pembangunan karakter unggul yang menjadi misi utama sekolah kejuruan.',
        indikator: [
          {
            id: 'ind-1.4.1',
            butir_id: 'b4',
            nomor: 1,
            kode: '1.4.1',
            nama: 'Pembelajaran yang efektif menguatkan keimanan dan ketakwaan murid pada Tuhan YME untuk membentuk akhlak yang mulia',
            definisi_operasional: 'Kinerja dalam membangun keimanan dan ketakwaan murid pada Tuhan YME serta akhlak yang mulia sebagai nilai yang dimiliki murid, dan tidak sekedar sebagai pengetahuan.',
            penjelasan: 'Integrasi akhlak dalam intra, kokurikuler, pembiasaan ibadah, dan etika profesional.',
            rubrik_penilaian: [
              { id: 'r141-1', indikator_id: 'ind-1.4.1', level: 1, kategori: 'Kurang', deskripsi: 'Terbatas pada hafalan mata pelajaran agama secara satu arah tanpa refleksi kehidupan nyata.' },
              { id: 'r141-2', indikator_id: 'ind-1.4.1', level: 2, kategori: 'Cukup Baik', deskripsi: 'Mendorong pemahaman dan refleksi perilaku akhlak mulia dalam pembelajaran di kelas.' },
              { id: 'r141-3', indikator_id: 'ind-1.4.1', level: 3, kategori: 'Baik', deskripsi: 'Meluaskan upaya pembentukan akhlak melalui kegiatan kokurikuler dan ekstrakurikuler terarah.' },
              { id: 'r141-4', indikator_id: 'ind-1.4.1', level: 4, kategori: 'Sangat Baik', deskripsi: 'Lingkungan belajar dan pembiasaan konsisten membentuk adab, sopan santun, kepedulian sosial, dan akhlak kerja.' }
            ],
            bukti_fisik: [
              { id: 'bf141-1', indikator_id: 'ind-1.4.1', kode: 'BF-1.4.1-A', nama: 'Dokumentasi pembiasaan ibadah & adab keseharian', jenis: 'Observasi', deskripsi: 'Sholat berjamaah, doa bersama, dan kegiatan keagamaan rutin.', wajib: true },
              { id: 'bf141-2', indikator_id: 'ind-1.4.1', kode: 'BF-1.4.1-B', nama: 'Modul ajar bermuatan integrasi nilai spiritual dan etika profesi', jenis: 'Dokumen', deskripsi: 'Keterkaitan materi ajar dengan integritas moral.', wajib: true }
            ]
          },
          {
            id: 'ind-1.4.2',
            butir_id: 'b4',
            nomor: 2,
            kode: '1.4.2',
            nama: 'Pembelajaran yang efektif dalam menguatkan kecintaan terhadap tanah air, kekayaan budaya, alam Indonesia, pemikiran, dan karya anak bangsa',
            definisi_operasional: 'Kinerja dalam mengenalkan sejarah, kekayaan budaya, alam Indonesia, pemikiran, dan karya anak bangsa sebagai hal yang positif sehingga terbangun rasa bangga.',
            penjelasan: 'Pembelajaran mendalam (diskusi, studi kasus karya lokal) dan kegiatan kokurikuler cinta tanah air.',
            rubrik_penilaian: [
              { id: 'r142-1', indikator_id: 'ind-1.4.2', level: 1, kategori: 'Kurang', deskripsi: 'Materi budaya dan kebangsaan sebatas hafalan tanpa kegiatan kokurikuler penguatan.' },
              { id: 'r142-2', indikator_id: 'ind-1.4.2', level: 2, kategori: 'Cukup Baik', deskripsi: 'Guru mengaitkan materi dengan kekayaan bangsa dan ada kegiatan kokurikuler terpisah.' },
              { id: 'r142-3', indikator_id: 'ind-1.4.2', level: 3, kategori: 'Baik', deskripsi: 'Metode mendalam menganalisis karya bangsa dan kegiatan kokurikuler membangun identitas positif.' },
              { id: 'r142-4', indikator_id: 'ind-1.4.2', level: 4, kategori: 'Sangat Baik', deskripsi: 'Pembelajaran mendalam berkesinambungan, kokurikuler terhubung intrakurikuler, murid aktif refleksi & inovasi produk lokal.' }
            ],
            bukti_fisik: [
              { id: 'bf142-1', indikator_id: 'ind-1.4.2', kode: 'BF-1.4.2-A', nama: 'Dokumentasi peringatan hari nasional & apresiasi budaya lokal', jenis: 'Dokumen', deskripsi: 'Pameran karya anak bangsa dan upacara kebangsaan.', wajib: true }
            ]
          },
          {
            id: 'ind-1.4.3',
            butir_id: 'b4',
            nomor: 3,
            kode: '1.4.3',
            nama: 'Pembelajaran yang efektif dalam memfasilitasi murid untuk mengembangkan kemampuan bernalar dan memecahkan masalah',
            definisi_operasional: 'Kinerja dalam mengembangkan kemampuan murid untuk bernalar dan memecahkan masalah melalui strategi pembelajaran yang relevan.',
            penjelasan: 'Praktik, simulasi, proyek, dan studi kasus yang menyerupai situasi kerja industri nyata.',
            rubrik_penilaian: [
              { id: 'r143-1', indikator_id: 'ind-1.4.3', level: 1, kategori: 'Kurang', deskripsi: 'Praktik pengajaran fokus memberi materi tanpa kesempatan mengaitkan dengan isu riil sekitar.' },
              { id: 'r143-2', indikator_id: 'ind-1.4.3', level: 2, kategori: 'Cukup Baik', deskripsi: 'Memberi kesempatan pemecahan masalah namun proses dan jawaban sepenuhnya didikte guru.' },
              { id: 'r143-3', indikator_id: 'ind-1.4.3', level: 3, kategori: 'Baik', deskripsi: 'Kegiatan dirancang berbasis kebutuhan murid dan menerapkan pembelajaran mendalam pada mata pelajaran relevan.' },
              { id: 'r143-4', indikator_id: 'ind-1.4.3', level: 4, kategori: 'Sangat Baik', deskripsi: 'Secara konsisten di semua mapel menerapkan metode mendalam (studi kasus, PjBL) memecahkan masalah nyata dunia kerja.' }
            ],
            bukti_fisik: [
              { id: 'bf143-1', indikator_id: 'ind-1.4.3', kode: 'BF-1.4.3-A', nama: 'Dokumen kurikulum selaras dunia kerja & RPP berbasis studi kasus nyata', jenis: 'Dokumen', deskripsi: 'Jobsheet problem-solving dan laporan proyek siswa.', wajib: true }
            ]
          },
          {
            id: 'ind-1.4.4',
            butir_id: 'b4',
            nomor: 4,
            kode: '1.4.4',
            nama: 'Pembelajaran yang efektif dalam membangun kompetensi dan/atau karakter yang menjadi misi utama SMK/MAK',
            definisi_operasional: 'Kompetensi dan atau karakter yang menjadi misi utama tidak sebatas pernyataan di kurikulum, melainkan dibangun secara konsisten melalui ragam strategi.',
            penjelasan: 'Kekhasan karakter unggul sekolah (disiplin, budaya kerja industri, integritas) tercermin di intra, ko, dan ekstrakurikuler.',
            rubrik_penilaian: [
              { id: 'r144-1', indikator_id: 'ind-1.4.4', level: 1, kategori: 'Kurang', deskripsi: 'Misi utama tercantum dalam dokumen namun tidak ada rancangan pembiasaan nyata.' },
              { id: 'r144-2', indikator_id: 'ind-1.4.4', level: 2, kategori: 'Cukup Baik', deskripsi: 'Misi dibangun melalui beberapa upaya insidental yang belum sistematis.' },
              { id: 'r144-3', indikator_id: 'ind-1.4.4', level: 3, kategori: 'Baik', deskripsi: 'Terlihat kesinambungan yang jelas antara misi utama dengan intrakurikuler, kokurikuler, dan ekstrakurikuler.' },
              { id: 'r144-4', indikator_id: 'ind-1.4.4', level: 4, kategori: 'Sangat Baik', deskripsi: 'Dokumentasi lengkap pembiasaan budaya kerja unggul, konsisten diterapkan guru di semua mapel dan bermitra dengan IDUKA.' }
            ],
            bukti_fisik: [
              { id: 'bf144-1', indikator_id: 'ind-1.4.4', kode: 'BF-1.4.4-A', nama: 'KOSP, tata tertib karakter kerja, dan MoU IDUKA', jenis: 'Dokumen', deskripsi: 'Bukti internalisasi budaya kerja dan profil lulusan.', wajib: true }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'a2222222-2222-4222-a222-222222222222',
    kode: 'K2',
    nomor: 2,
    nama: 'Kepemimpinan Kepala Satuan Pendidikan dalam Pengelolaan Satuan Pendidikan',
    deskripsi: 'Mengukur peran kepala SMK/MAK sebagai instructional leader, memimpin budaya refleksi, manajemen GTK, tata kelola visi-misi partisipatif, akuntabilitas anggaran, pengelolaan sarpras, dan penyelarasan kurikulum bersama industri.',
    bobot: 25,
    butir: [
      {
        id: 'b5',
        komponen_id: 'a2222222-2222-4222-a222-222222222222',
        nomor: 5,
        kode: 'Butir 5',
        nama: 'Kepala satuan pendidikan menerapkan budaya refleksi untuk perbaikan pembelajaran yang berpusat pada peserta didik, serta evaluasi kinerja untuk rencana pengembangan profesional bagi pendidik dan tenaga kependidikan',
        deskripsi: 'Siklus evaluasi kinerja (PKG/PKKS), tindak lanjut pengembangan keprofesian berkelanjutan (PKB), dan pemberian reward/punishment berbasis kinerja.',
        indikator: [
          {
            id: 'ind-2.5.1',
            butir_id: 'b5',
            nomor: 1,
            kode: '2.5.1',
            nama: 'Memimpin pelaksanaan evaluasi kinerja secara berkala dalam rangka refleksi untuk perbaikan pembelajaran',
            definisi_operasional: 'Kepala SMK/MAK memimpin evaluasi kinerja secara berkala mencakup menginisiasi, mengoordinasikan, dan melaksanakan penilaian kinerja guru dan tenaga kependidikan secara terjadwal.',
            penjelasan: 'Hasil penilaian kinerja digunakan sebagai refleksi bersama dan umpan balik peningkatan mutu pengajaran.',
            rubrik_penilaian: [
              { id: 'r251-1', indikator_id: 'ind-2.5.1', level: 1, kategori: 'Kurang', deskripsi: 'Kepala SMK/MAK belum melakukan evaluasi kinerja guru secara terencana tanpa refleksi tindak lanjut.' },
              { id: 'r251-2', indikator_id: 'ind-2.5.1', level: 2, kategori: 'Cukup Baik', deskripsi: 'Evaluasi dilakukan sebatas formalitas administratif (pengisian formulir) tanpa tindak lanjut nyata.' },
              { id: 'r251-3', indikator_id: 'ind-2.5.1', level: 3, kategori: 'Baik', deskripsi: 'Mengevaluasi berkala melalui supervisi akademik/PKG dan hasilnya menjadi dasar perbaikan pembelajaran.' },
              { id: 'r251-4', indikator_id: 'ind-2.5.1', level: 4, kategori: 'Sangat Baik', deskripsi: 'Memimpin evaluasi sistematis terjadwal, refleksi lintas guru mapel, dan diintegrasikan dalam program PKB/pelatihan industri.' }
            ],
            bukti_fisik: [
              { id: 'bf251-1', indikator_id: 'ind-2.5.1', kode: 'BF-2.5.1-A', nama: 'Pedoman PKG/PKKS, jadwal supervisi, & laporan hasil penilaian kinerja', jenis: 'Dokumen', deskripsi: 'Rekap skor evaluasi dan SK Tim Penilai.', wajib: true },
              { id: 'bf251-2', indikator_id: 'ind-2.5.1', kode: 'BF-2.5.1-B', nama: 'Dokumen tindak lanjut hasil evaluasi (program IHT/workshop)', jenis: 'Dokumen', deskripsi: 'Notula rapat refleksi dan jadwal pelatihan guru.', wajib: true }
            ]
          },
          {
            id: 'ind-2.5.2',
            butir_id: 'b5',
            nomor: 2,
            kode: '2.5.2',
            nama: 'Melaksanakan program pengembangan kompetensi guru dan tenaga kependidikan untuk peningkatan kualitas pembelajaran dan layanan pendidikan',
            definisi_operasional: 'Kepala SMK/MAK melakukan peningkatan kompetensi guru secara terencana dan berkelanjutan, dan pemanfaatan hasil peningkatan kompetensi dalam pembelajaran.',
            penjelasan: 'Fasilitasi pelatihan, upskilling industri, sertifikasi kompetensi, dan evaluasi dampak terhadap prestasi belajar murid.',
            rubrik_penilaian: [
              { id: 'r252-1', indikator_id: 'ind-2.5.2', level: 1, kategori: 'Kurang', deskripsi: 'Belum memiliki program peningkatan kompetensi guru dan tenaga kependidikan.' },
              { id: 'r252-2', indikator_id: 'ind-2.5.2', level: 2, kategori: 'Cukup Baik', deskripsi: 'Melaksanakan kegiatan peningkatan namun belum terencana dan dampak pada pembelajaran belum terlihat.' },
              { id: 'r252-3', indikator_id: 'ind-2.5.2', level: 3, kategori: 'Baik', deskripsi: 'Melaksanakan program PKB sesuai kebutuhan dan dampak penerapannya di kelas mulai terlihat.' },
              { id: 'r252-4', indikator_id: 'ind-2.5.2', level: 4, kategori: 'Sangat Baik', deskripsi: 'Peningkatan kompetensi terstruktur berkelanjutan dan terbukti meningkatkan kualitas pembelajaran serta layanan sekolah.' }
            ],
            bukti_fisik: [
              { id: 'bf252-1', indikator_id: 'ind-2.5.2', kode: 'BF-2.5.2-A', nama: 'Program PKB & data keikutsertaan sertifikasi/pelatihan 3 tahun terakhir', jenis: 'Sertifikat', deskripsi: 'Sertifikat kompetensi keahlian guru dari BBPPMPV / LSP.', wajib: true }
            ]
          },
          {
            id: 'ind-2.5.3',
            butir_id: 'b5',
            nomor: 3,
            kode: '2.5.3',
            nama: 'Mengelola guru dan tenaga kependidikan secara efektif dan akuntabel dalam hal pemberian penghargaan atau sanksi berbasis kinerja',
            definisi_operasional: 'Kepala SMK/MAK melaksanakan manajemen guru dan tenaga kependidikan (GTK) dengan mengacu pada hasil penilaian kinerja untuk penghargaan atau pembinaan/sanksi.',
            penjelasan: 'Pemberian reward bagi guru berprestasi dan pembinaan/sanksi transparan bagi yang belum memenuhi target.',
            rubrik_penilaian: [
              { id: 'r253-1', indikator_id: 'ind-2.5.3', level: 1, kategori: 'Kurang', deskripsi: 'Belum memiliki sistem penilaian kinerja GTK, reward/sanksi diberikan tanpa dasar jelas.' },
              { id: 'r253-2', indikator_id: 'ind-2.5.3', level: 2, kategori: 'Cukup Baik', deskripsi: 'Ada dokumen kebijakan namun pemberian reward/sanksi belum berbasis data kinerja rutin.' },
              { id: 'r253-3', indikator_id: 'ind-2.5.3', level: 3, kategori: 'Baik', deskripsi: 'Melaksanakan penilaian kinerja teratur, menerapkan reward/sanksi, dan menjalankan proses pembinaan.' },
              { id: 'r253-4', indikator_id: 'ind-2.5.3', level: 4, kategori: 'Sangat Baik', deskripsi: 'Manajemen GTK akuntabel dan transparan, penilaian berkala memberi dampak positif nyata pada motivasi kerja.' }
            ],
            bukti_fisik: [
              { id: 'bf253-1', indikator_id: 'ind-2.5.3', kode: 'BF-2.5.3-A', nama: 'SK reward/apresiasi guru berprestasi & laporan pembinaan GTK', jenis: 'Dokumen', deskripsi: 'Catatan transparansi evaluasi kinerja dan pembinaan.', wajib: true }
            ]
          }
        ]
      },
      {
        id: 'b6',
        komponen_id: 'a2222222-2222-4222-a222-222222222222',
        nomor: 6,
        kode: 'Butir 6',
        nama: 'Kepala satuan pendidikan menghadirkan layanan belajar yang partisipatif dan kolaboratif untuk tercapainya visi dan misi',
        deskripsi: 'Sosialisasi visi-misi, perencanaan tahunan berbasis data Rapor Pendidikan, wawasan kejuruan dan bisnis, serta kemitraan strategis dengan dunia kerja.',
        indikator: [
          {
            id: 'ind-2.6.1',
            butir_id: 'b6',
            nomor: 1,
            kode: '2.6.1',
            nama: 'Ada pemahaman guru dan tenaga kependidikan tentang visi dan misi SMK/MAK dan tercermin dalam proses pembelajaran',
            definisi_operasional: 'Pemahaman GTK tentang visi misi tercapai jika mampu menjelaskan dan mengintegrasikannya dalam perencanaan, pelaksanaan, serta evaluasi pembelajaran.',
            penjelasan: 'Internalisasi visi misi kejuruan dalam penguatan karakter dan budaya kerja industri.',
            rubrik_penilaian: [
              { id: 'r261-1', indikator_id: 'ind-2.6.1', level: 1, kategori: 'Kurang', deskripsi: 'GTK belum memahami visi misi dan tidak tampak penerapannya dalam pembelajaran.' },
              { id: 'r261-2', indikator_id: 'ind-2.6.1', level: 2, kategori: 'Cukup Baik', deskripsi: 'GTK mengetahui isi visi misi tetapi belum menghubungkannya dalam aktivitas belajar mengajar.' },
              { id: 'r261-3', indikator_id: 'ind-2.6.1', level: 3, kategori: 'Baik', deskripsi: 'Sekitar 50% GTK memahami dan menerapkannya dalam pembelajaran (budaya kerja).' },
              { id: 'r261-4', indikator_id: 'ind-2.6.1', level: 4, kategori: 'Sangat Baik', deskripsi: 'Lebih dari separuh GTK konsisten menerapkan visi misi (budaya industri, kemandirian, keunggulan vokasi).' }
            ],
            bukti_fisik: [
              { id: 'bf261-1', indikator_id: 'ind-2.6.1', kode: 'BF-2.6.1-A', nama: 'SK Tim Pengembang Kurikulum, notula perumusan visi-misi, & modul ajar', jenis: 'Dokumen', deskripsi: 'Dokumentasi internalisasi visi misi sekolah kejuruan.', wajib: true }
            ]
          },
          {
            id: 'ind-2.6.2',
            butir_id: 'b6',
            nomor: 2,
            kode: '2.6.2',
            nama: 'Perencanaan kegiatan tahunan dilakukan berdasarkan hasil evaluasi/refleksi berbasis data untuk mewujudkan visi dan misi SMK/MAK',
            definisi_operasional: 'Perencanaan kegiatan tahunan disusun berdasarkan hasil evaluasi berbasis data tahun sebelumnya dengan mempertimbangkan capaian, tantangan, dan kebutuhan sekolah.',
            penjelasan: 'Penyusunan RKT/RKAS melibatkan pemangku kepentingan (komite, industri) berbasis Rapor Pendidikan.',
            rubrik_penilaian: [
              { id: 'r262-1', indikator_id: 'ind-2.6.2', level: 1, kategori: 'Kurang', deskripsi: 'Perencanaan tahunan tidak berdasarkan data evaluasi dan tidak mengacu visi misi.' },
              { id: 'r262-2', indikator_id: 'ind-2.6.2', level: 2, kategori: 'Cukup Baik', deskripsi: 'Mempertimbangkan evaluasi namun belum sistematis dan belum terhubung jelas dengan visi misi.' },
              { id: 'r262-3', indikator_id: 'ind-2.6.2', level: 3, kategori: 'Baik', deskripsi: 'Disusun berdasarkan refleksi data (hasil belajar, tracer study) dan diarahkan mendukung visi misi.' },
              { id: 'r262-4', indikator_id: 'ind-2.6.2', level: 4, kategori: 'Sangat Baik', deskripsi: 'Dilakukan sistematis berbasis data lengkap, melibatkan multi-stakeholder, dan mendukung visi misi berkelanjutan.' }
            ],
            bukti_fisik: [
              { id: 'bf262-1', indikator_id: 'ind-2.6.2', kode: 'BF-2.6.2-A', nama: 'Dokumen RKT, RKJM, & laporan evaluasi diri berbasis Rapor Pendidikan', jenis: 'Dokumen', deskripsi: 'Perencanaan berbasis data terpadu.', wajib: true }
            ]
          },
          {
            id: 'ind-2.6.3',
            butir_id: 'b6',
            nomor: 3,
            kode: '2.6.3',
            nama: 'Memiliki wawasan bidang kejuruan dan ketajaman bisnis yang berkaitan dengan lapangan kerja',
            definisi_operasional: 'Kepala SMK/MAK memahami perkembangan teknologi, tren industri, dan peluang usaha, serta mampu menganalisis potensi pasar dunia kerja.',
            penjelasan: 'Pengembangan unit produksi/Teaching Factory (TeFa), technopark, dan program keahlian adaptif.',
            rubrik_penilaian: [
              { id: 'r263-1', indikator_id: 'ind-2.6.3', level: 1, kategori: 'Kurang', deskripsi: 'Belum memahami tren bidang keahlian dan belum ada upaya membaca peluang kerja/industri.' },
              { id: 'r263-2', indikator_id: 'ind-2.6.3', level: 2, kategori: 'Cukup Baik', deskripsi: 'Mulai mengikuti info industri namun belum strategis dan kontribusi pada program keahlian belum jelas.' },
              { id: 'r263-3', indikator_id: 'ind-2.6.3', level: 3, kategori: 'Baik', deskripsi: 'Memahami tren industri, menjalin kerja sama DU/DI, menyusun unit usaha TeFa pada kurikulum.' },
              { id: 'r263-4', indikator_id: 'ind-2.6.3', level: 4, kategori: 'Sangat Baik', deskripsi: 'Business acumen mendalam, aktif membangun TeFa/unit usaha komersial berdaya saing tinggi.' }
            ],
            bukti_fisik: [
              { id: 'bf263-1', indikator_id: 'ind-2.6.3', kode: 'BF-2.6.3-A', nama: 'Proposal unit usaha TeFa, pemetaan tren industri, & portofolio produk kejuruan', jenis: 'Produk Siswa', deskripsi: 'Bukti operasional unit produksi dan kerja sama pasar.', wajib: true }
            ]
          },
          {
            id: 'ind-2.6.4',
            butir_id: 'b6',
            nomor: 4,
            kode: '2.6.4',
            nama: 'Membangun jejaring kemitraan dengan berbagai pihak (termasuk orang tua/wali, mitra dunia kerja, alumni, dst)',
            definisi_operasional: 'Menjalin hubungan kerja sama yang terencana dan berkelanjutan dengan berbagai pihak untuk mendukung penyelenggaraan pendidikan dan pengembangan SMK/MAK.',
            penjelasan: 'Kemitraan berdampak pada kurikulum, TeFa, penyerapan lulusan, dan beasiswa industri.',
            rubrik_penilaian: [
              { id: 'r264-1', indikator_id: 'ind-2.6.4', level: 1, kategori: 'Kurang', deskripsi: 'Belum melakukan upaya membangun jejaring kemitraan terstruktur.' },
              { id: 'r264-2', indikator_id: 'ind-2.6.4', level: 2, kategori: 'Cukup Baik', deskripsi: 'Mulai membangun kemitraan namun sebatas informal/insidental tanpa tindak lanjut strategis.' },
              { id: 'r264-3', indikator_id: 'ind-2.6.4', level: 3, kategori: 'Baik', deskripsi: 'Aktif menjalin kemitraan, ada MoU/PKS (magang, CSR), walau belum merata ke semua mitra.' },
              { id: 'r264-4', indikator_id: 'ind-2.6.4', level: 4, kategori: 'Sangat Baik', deskripsi: 'Membangun jejaring strategis menyeluruh (dunia kerja, alumni, komunitas) berdampak nyata pada kurikulum, TeFa, dan serapan kerja.' }
            ],
            bukti_fisik: [
              { id: 'bf264-1', indikator_id: 'ind-2.6.4', kode: 'BF-2.6.4-A', nama: 'Naskah MoU/PKS kemitraan industri, program kerja komite & alumni', jenis: 'MoU', deskripsi: 'Dokumen kerja sama link and match yang masih berlaku.', wajib: true }
            ]
          }
        ]
      },
      {
        id: 'b7',
        komponen_id: 'a2222222-2222-4222-a222-222222222222',
        nomor: 7,
        kode: 'Butir 7',
        nama: 'Kepala satuan pendidikan memastikan pengelolaan anggaran dilakukan sesuai perencanaan berdasarkan refleksi yang berbasis data secara transparan dan akuntabel',
        deskripsi: 'Penganggaran berbasis kebutuhan peningkatan mutu proses belajar dan sarpras, serta monitoring dan akuntabilitas publik pengelolaan anggaran.',
        indikator: [
          {
            id: 'ind-2.7.1',
            butir_id: 'b7',
            nomor: 1,
            kode: '2.7.1',
            nama: 'Penggunaan anggaran mengacu pada perencanaan yang disusun berdasarkan data hasil evaluasi untuk mencapai tujuan',
            definisi_operasional: 'Perencanaan anggaran disusun berdasarkan analisis kebutuhan dari data refleksi dan evaluasi program sebelumnya untuk mendukung mutu pembelajaran dan manajemen.',
            penjelasan: 'RKAS memprioritaskan peningkatan mutu bahan praktik, pelatihan guru, dan digitalisasi sekolah.',
            rubrik_penilaian: [
              { id: 'r271-1', indikator_id: 'ind-2.7.1', level: 1, kategori: 'Kurang', deskripsi: 'Perencanaan anggaran rutin tanpa data refleksi/evaluasi capaian sebelumnya.' },
              { id: 'r271-2', indikator_id: 'ind-2.7.1', level: 2, kategori: 'Cukup Baik', deskripsi: 'Menyebut data evaluasi umum tetapi belum konkret untuk prioritas pembelajaran vokasi.' },
              { id: 'r271-3', indikator_id: 'ind-2.7.1', level: 3, kategori: 'Baik', deskripsi: 'Merujuk hasil evaluasi tahunan (e-RKAS, BOS, Rapor Pendidikan) sesuai kebutuhan aktual.' },
              { id: 'r271-4', indikator_id: 'ind-2.7.1', level: 4, kategori: 'Sangat Baik', deskripsi: 'Berbasis data refleksi menyeluruh (capaian murid, masukan industri, SPMI) diarahkan strategis ke TeFa & mutu lulusan.' }
            ],
            bukti_fisik: [
              { id: 'bf271-1', indikator_id: 'ind-2.7.1', kode: 'BF-2.7.1-A', nama: 'Dokumen RKAS/RKJM berbasis Rapor Pendidikan & notula rapat komite', jenis: 'Dokumen', deskripsi: 'Analisis gap kebutuhan dan rincian alokasi mutu.', wajib: true }
            ]
          },
          {
            id: 'ind-2.7.2',
            butir_id: 'b7',
            nomor: 2,
            kode: '2.7.2',
            nama: 'Monitoring dan evaluasi penggunaan anggaran dilakukan secara transparan dan akuntabel untuk mengukur efektivitasnya',
            definisi_operasional: 'Penggunaan anggaran mengacu pada rencana yang disepakati bersama pemangku kepentingan dan tercatat dalam laporan keuangan transparan.',
            penjelasan: 'Laporan pertanggungjawaban BOS/BOP dapat diakses pemangku kepentingan secara terbuka dan teraudit.',
            rubrik_penilaian: [
              { id: 'r272-1', indikator_id: 'ind-2.7.2', level: 1, kategori: 'Kurang', deskripsi: 'Realisasi anggaran tidak mengacu perencanaan dan sering berubah tanpa dokumentasi persetujuan.' },
              { id: 'r272-2', indikator_id: 'ind-2.7.2', level: 2, kategori: 'Cukup Baik', deskripsi: 'Sebagian besar sesuai rencana, namun ada perubahan tanpa konsultasi lengkap.' },
              { id: 'r272-3', indikator_id: 'ind-2.7.2', level: 3, kategori: 'Baik', deskripsi: 'Konsisten dengan rencana yang disepakati dan revisi melalui prosedur musyawarah resmi.' },
              { id: 'r272-4', indikator_id: 'ind-2.7.2', level: 4, kategori: 'Sangat Baik', deskripsi: 'Sepenuhnya mengikuti rencana, penyesuaian tercatat transparan, akuntabilitas publik terbuka dan dapat diakses.' }
            ],
            bukti_fisik: [
              { id: 'bf272-1', indikator_id: 'ind-2.7.2', kode: 'BF-2.7.2-A', nama: 'Laporan pertanggungjawaban keuangan & publikasi papan transparansi dana', jenis: 'Dokumen', deskripsi: 'Laporan realisasi anggaran dan bukti monev berkala.', wajib: true }
            ]
          }
        ]
      },
      {
        id: 'b8',
        komponen_id: 'a2222222-2222-4222-a222-222222222222',
        nomor: 8,
        kode: 'Butir 8',
        nama: 'Kepala satuan pendidikan memimpin pengelolaan sarana dan prasarana sesuai dengan kebutuhan pembelajaran yang berpusat pada peserta didik',
        deskripsi: 'Pemenuhan sarpras sesuai kebutuhan kerja (mandiri/resource sharing), pemeliharaan efisien, dan tata letak optimal berstandar keselamatan kerja (K3).',
        indikator: [
          {
            id: 'ind-2.8.1',
            butir_id: 'b8',
            nomor: 1,
            kode: '2.8.1',
            nama: 'Pemenuhan sarana dan prasarana yang sesuai dengan kebutuhan belajar murid untuk mencapai kompetensi yang dibutuhkan dunia kerja (dapat disediakan secara mandiri maupun berbagi sumber)',
            definisi_operasional: 'Memastikan ketersediaan sarpras pembelajaran sesuai kebutuhan murid dan industri, baik mandiri maupun kerja sama berbagi sumber (resource sharing).',
            penjelasan: 'Pemanfaatan lab, bengkel, BLK mitra, atau fasilitas industri untuk melengkapi alat praktik kejuruan.',
            rubrik_penilaian: [
              { id: 'r281-1', indikator_id: 'ind-2.8.1', level: 1, kategori: 'Kurang', deskripsi: 'Belum melakukan pemetaan kebutuhan sarpras dan belum ada upaya nyata pemenuhan.' },
              { id: 'r281-2', indikator_id: 'ind-2.8.1', level: 2, kategori: 'Cukup Baik', deskripsi: 'Pemetaan ada tetapi pemenuhan terbatas dan belum melibatkan kerja sama pihak luar.' },
              { id: 'r281-3', indikator_id: 'ind-2.8.1', level: 3, kategori: 'Baik', deskripsi: 'Memenuhi kebutuhan sarpras secara bertahap termasuk menjalin kemitraan berbagi sumber.' },
              { id: 'r281-4', indikator_id: 'ind-2.8.1', level: 4, kategori: 'Sangat Baik', deskripsi: 'Secara aktif dan berkelanjutan mengelola dan mengembangkan sarpras mutakhir sesuai standar industri terkini.' }
            ],
            bukti_fisik: [
              { id: 'bf281-1', indikator_id: 'ind-2.8.1', kode: 'BF-2.8.1-A', nama: 'Analisis kebutuhan sarpras dalam RKAS & MoU resource sharing dengan industri/BLK', jenis: 'MoU', deskripsi: 'Daftar inventaris alat praktik utama sesuai kurikulum.', wajib: true }
            ]
          },
          {
            id: 'ind-2.8.2',
            butir_id: 'b8',
            nomor: 2,
            kode: '2.8.2',
            nama: 'Pengelolaan sarana dan prasarana efisien untuk memastikan keberfungsian dan kesesuaian dengan kebutuhan belajar murid',
            definisi_operasional: 'Pengelolaan sarpras dilakukan secara terencana, teratur, dan berkelanjutan untuk memastikan ketersediaan, keberfungsian, dan kesesuaian.',
            penjelasan: 'Jadwal pemeliharaan berkala, log book pemakaian mesin/lab, dan perbaikan tepat waktu.',
            rubrik_penilaian: [
              { id: 'r282-1', indikator_id: 'ind-2.8.2', level: 1, kategori: 'Kurang', deskripsi: 'Tidak ada sistem pengelolaan sarpras, banyak alat rusak/tidak berfungsi.' },
              { id: 'r282-2', indikator_id: 'ind-2.8.2', level: 2, kategori: 'Cukup Baik', deskripsi: 'Pengelolaan seadanya, ada pendataan namun belum optimal difungsikan untuk praktik.' },
              { id: 'r282-3', indikator_id: 'ind-2.8.2', level: 3, kategori: 'Baik', deskripsi: 'Dikelola cukup efisien, inventarisasi tertib, pemeliharaan rutin berbasis data kebutuhan.' },
              { id: 'r282-4', indikator_id: 'ind-2.8.2', level: 4, kategori: 'Sangat Baik', deskripsi: 'Pengelolaan efisien optimal berbasis data refleksi, sarpras termanfaatkan maksimal untuk PjBL/TeFa.' }
            ],
            bukti_fisik: [
              { id: 'bf282-1', indikator_id: 'ind-2.8.2', kode: 'BF-2.8.2-A', nama: 'Buku inventaris, jadwal perawatan mesin/lab, & kartu riwayat perbaikan', jenis: 'Dokumen', deskripsi: 'Log book keberfungsian sarpras.', wajib: true }
            ]
          },
          {
            id: 'ind-2.8.3',
            butir_id: 'b8',
            nomor: 3,
            kode: '2.8.3',
            nama: 'Tata letak sarana dan prasarana secara optimal sesuai dengan persyaratan keamanan kerja',
            definisi_operasional: 'Tata letak diatur efisien sesuai fungsi ruang dan memenuhi standar keselamatan dan kesehatan kerja (K3).',
            penjelasan: 'Jalur evakuasi jelas, penempatan APAR, ventilasi, pencahayaan, dan denah tata letak bengkel terstandar.',
            rubrik_penilaian: [
              { id: 'r283-1', indikator_id: 'ind-2.8.3', level: 1, kategori: 'Kurang', deskripsi: 'Tata letak tidak teratur, sempit, atau membahayakan tanpa mempertimbangkan K3.' },
              { id: 'r283-2', indikator_id: 'ind-2.8.3', level: 2, kategori: 'Cukup Baik', deskripsi: 'Cukup rapi namun belum sepenuhnya memperhatikan standar ergonomi dan pengawasan K3.' },
              { id: 'r283-3', indikator_id: 'ind-2.8.3', level: 3, kategori: 'Baik', deskripsi: 'Sesuai fungsi ruang, mendukung keamanan dasar, ventilasi dan ruang gerak memadai.' },
              { id: 'r283-4', indikator_id: 'ind-2.8.3', level: 4, kategori: 'Sangat Baik', deskripsi: 'Sangat optimal berstandar keselamatan industri, SOP K3 terpasang, jalur evakuasi aman, evaluasi berkala.' }
            ],
            bukti_fisik: [
              { id: 'bf283-1', indikator_id: 'ind-2.8.3', kode: 'BF-2.8.3-A', nama: 'Denah tata letak bengkel/lab disahkan kepala sekolah, SOP K3, & foto APAR', jenis: 'Observasi', deskripsi: 'Bukti tata letak aman dan rambu K3.', wajib: true }
            ]
          }
        ]
      },
      {
        id: 'b9',
        komponen_id: 'a2222222-2222-4222-a222-222222222222',
        nomor: 9,
        kode: 'Butir 9',
        nama: 'Kepala satuan pendidikan mengembangkan kurikulum di tingkat satuan pendidikan yang selaras dengan kurikulum nasional',
        deskripsi: 'Penyelarasan kurikulum bersama industri sesuai Standar Kompetensi Kerja (SKK), penyelenggaraan PKL terstruktur, dan fungsi Bursa Kerja (BK/BKK).',
        indikator: [
          {
            id: 'ind-2.9.1',
            butir_id: 'b9',
            nomor: 1,
            kode: '2.9.1',
            nama: 'Kurikulum di SMK/MAK dikembangkan berdasarkan kurikulum nasional dan hasil evaluasi yang disusun bersama dunia kerja sesuai dengan standar kompetensi kerja (SKK)',
            definisi_operasional: 'Kurikulum mengacu kurikulum nasional, disusun melalui evaluasi internal, dan diselaraskan bersama dunia kerja sesuai SKK.',
            penjelasan: 'Penyelarasan materi ajar, penetapan capaian kompetensi industri, dan pengesahan kurikulum KOSP bersama mitra industri.',
            rubrik_penilaian: [
              { id: 'r291-1', indikator_id: 'ind-2.9.1', level: 1, kategori: 'Kurang', deskripsi: 'Kurikulum tidak selaras dengan kurikulum nasional.' },
              { id: 'r291-2', indikator_id: 'ind-2.9.1', level: 2, kategori: 'Cukup Baik', deskripsi: 'Tersusun lengkap namun belum selaras penuh atau belum memperhatikan SKK dunia kerja.' },
              { id: 'r291-3', indikator_id: 'ind-2.9.1', level: 3, kategori: 'Baik', deskripsi: 'Tersusun lengkap, selaras kurikulum nasional, dan memperhatikan kebutuhan kerja sesuai SKK.' },
              { id: 'r291-4', indikator_id: 'ind-2.9.1', level: 4, kategori: 'Sangat Baik', deskripsi: 'Lengkap dan selaras kurikulum nasional, sepenuhnya berbasis evaluasi dan SKK industri, serta direvisi rutin sistematis.' }
            ],
            bukti_fisik: [
              { id: 'bf291-1', indikator_id: 'ind-2.9.1', kode: 'BF-2.9.1-A', nama: 'Dokumen KOSP, berita acara lokakarya penyelarasan kurikulum bersama industri', jenis: 'Dokumen', deskripsi: 'Matriks penyelarasan SKKNI/standar industri dengan mapel kejuruan.', wajib: true }
            ]
          },
          {
            id: 'ind-2.9.2',
            butir_id: 'b9',
            nomor: 2,
            kode: '2.9.2',
            nama: 'Menyelenggarakan program Praktik Kerja Lapangan (PKL) sesuai program keahliannya',
            definisi_operasional: 'PKL merupakan pelaksanaan pembelajaran di dunia kerja yang dirancang dan dilaksanakan sesuai kompetensi inti dan program keahlian serta melibatkan mitra industri relevan.',
            penjelasan: 'Pelaksanaan PKL minimal 6 bulan dengan pembimbing sekolah & instruktur industri, jurnal harian, dan evaluasi hasil.',
            rubrik_penilaian: [
              { id: 'r292-1', indikator_id: 'ind-2.9.2', level: 1, kategori: 'Kurang', deskripsi: 'Tidak memiliki perencanaan PKL, dilaksanakan sporadis pada industri yang tidak relevan.' },
              { id: 'r292-2', indikator_id: 'ind-2.9.2', level: 2, kategori: 'Cukup Baik', deskripsi: 'PKL sesuai rencana namun belum mengacu panduan PKL atau di industri yang kurang relevan.' },
              { id: 'r292-3', indikator_id: 'ind-2.9.2', level: 3, kategori: 'Baik', deskripsi: 'Sesuai rencana dan panduan PKL di industri relevan, namun hasil PKL belum dipakai perbaikan pembelajaran.' },
              { id: 'r292-4', indikator_id: 'ind-2.9.2', level: 4, kategori: 'Sangat Baik', deskripsi: 'PKL sangat terstruktur di industri relevan, pendampingan instruktur aktif, dan evaluasi hasil PKL dijadikan umpan balik pembelajaran.' }
            ],
            bukti_fisik: [
              { id: 'bf292-1', indikator_id: 'ind-2.9.2', kode: 'BF-2.9.2-A', nama: 'Program kerja PKL, jurnal harian siswa, & sertifikat PKL dari industri mitra', jenis: 'Dokumen', deskripsi: 'Laporan monitoring dan evaluasi bersama pembimbing DUDI.', wajib: true }
            ]
          },
          {
            id: 'ind-2.9.3',
            butir_id: 'b9',
            nomor: 3,
            kode: '2.9.3',
            nama: 'Memfungsikan lembaga/unit pelaksana bursa kerja untuk penempatan kerja alumni',
            definisi_operasional: 'Upaya sistematis melalui Bursa Kerja (BK/BKK) yang berfungsi aktif menyalurkan alumni, menjalin kemitraan industri, dan menjadi instrumen evaluasi kurikulum.',
            penjelasan: 'Penyelenggaraan job matching, bimbingan karier, pelatihan pembuatan CV/interview, dan penelusuran tracer study.',
            rubrik_penilaian: [
              { id: 'r293-1', indikator_id: 'ind-2.9.3', level: 1, kategori: 'Kurang', deskripsi: 'Tidak ada unit bursa kerja atau unit bursa kerja tidak aktif beroperasi.' },
              { id: 'r293-2', indikator_id: 'ind-2.9.3', level: 2, kategori: 'Cukup Baik', deskripsi: 'Unit bursa kerja ada secara administratif namun belum berfungsi optimal menyalurkan alumni.' },
              { id: 'r293-3', indikator_id: 'ind-2.9.3', level: 3, kategori: 'Baik', deskripsi: 'Aktif memberikan layanan info lowongan kerja dan menjalin hubungan kerja sama penempatan.' },
              { id: 'r293-4', indikator_id: 'ind-2.9.3', level: 4, kategori: 'Sangat Baik', deskripsi: 'Berfungsi optimal berbasis sistem informasi digital, kemitraan luas, pembekalan karier intensif, serapan tinggi.' }
            ],
            bukti_fisik: [
              { id: 'bf293-1', indikator_id: 'ind-2.9.3', kode: 'BF-2.9.3-A', nama: 'SK BKK dari Disnaker/Kepsek, dokumentasi rekrutmen di sekolah, & laporan tracer study', jenis: 'Dokumen', deskripsi: 'Data keterserapan alumni dan kerja sama penempatan kerja.', wajib: true }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'a3333333-3333-4333-a333-333333333333',
    kode: 'K3',
    nomor: 3,
    nama: 'Iklim Lingkungan Belajar',
    deskripsi: 'Mewujudkan suasana belajar yang kondusif, aman dan nyaman secara fisik dan psikis bagi murid, guru dan tenaga kependidikan, mencakup kebinekaan, inklusivitas, pencegahan kekerasan/perundungan, keselamatan fisik & P3K, kesehatan fisik/mental, serta pembelajaran relevan dunia kerja.',
    bobot: 30,
    butir: [
      {
        id: 'b10',
        komponen_id: 'a3333333-3333-4333-a333-333333333333',
        nomor: 10,
        kode: 'Butir 10',
        nama: 'Satuan pendidikan memastikan terbangunnya iklim kebinekaan bagi peserta didik, pendidik, dan tenaga kependidikan',
        deskripsi: 'Sikap saling menghargai perbedaan latar belakang, kesetaraan gender, serta pemenuhan hak beribadah dan berbudaya.',
        indikator: [
          {
            id: 'ind-3.10.1',
            butir_id: 'b10',
            nomor: 1,
            kode: '3.10.1',
            nama: 'Iklim lingkungan belajar membangun sikap saling menghargai, terbuka, dan kesetaraan termasuk kesetaraan gender',
            definisi_operasional: 'Kinerja SMK/MAK dalam menciptakan lingkungan belajar yang membiasakan warga sekolah menerima dan saling menghargai perbedaan tanpa diskriminasi.',
            penjelasan: 'Suasana terbuka, bebas perlakuan diskriminatif, dan perlakuan setara bagi semua warga sekolah.',
            rubrik_penilaian: [
              { id: 'r3101-1', indikator_id: 'ind-3.10.1', level: 1, kategori: 'Kurang', deskripsi: 'Tidak ada upaya menciptakan iklim inklusif, warga minoritas tidak merasa aman/dihargai.' },
              { id: 'r3101-2', indikator_id: 'ind-3.10.1', level: 2, kategori: 'Cukup Baik', deskripsi: 'Ada aturan umum namun implementasi sikap menghargai keberagaman belum konsisten.' },
              { id: 'r3101-3', indikator_id: 'ind-3.10.1', level: 3, kategori: 'Baik', deskripsi: 'Membangun lingkungan terbuka, memiliki program yang melibatkan seluruh warga secara adil.' },
              { id: 'r3101-4', indikator_id: 'ind-3.10.1', level: 4, kategori: 'Sangat Baik', deskripsi: 'Konsisten menciptakan iklim inklusif, mendorong dialog terbuka, menangani pelanggaran secara adil.' }
            ],
            bukti_fisik: [
              { id: 'bf3101-1', indikator_id: 'ind-3.10.1', kode: 'BF-3.10.1-A', nama: 'Panduan budaya sekolah, tata tertib non-diskriminasi, & laporan penanganan adil', jenis: 'Dokumen', deskripsi: 'Bukti perlakuan setara seluruh warga sekolah.', wajib: true }
            ]
          },
          {
            id: 'ind-3.10.2',
            butir_id: 'b10',
            nomor: 2,
            kode: '3.10.2',
            nama: 'Iklim lingkungan belajar yang memfasilitasi warga SMK/MAK untuk beribadah dan berbudaya',
            definisi_operasional: 'Kinerja dalam memenuhi hak murid mendapatkan pendidikan agama dari guru seagama, serta hak warga sekolah untuk beribadah dan berbudaya.',
            penjelasan: 'Fasilitas tempat ibadah, kesempatan menjalankan hari besar keagamaan, dan penghormatan hak sipil.',
            rubrik_penilaian: [
              { id: 'r3102-1', indikator_id: 'ind-3.10.2', level: 1, kategori: 'Kurang', deskripsi: 'Belum ada kesadaran hak murid minoritas atas guru agama seagama dan belum memberi waktu beribadah.' },
              { id: 'r3102-2', indikator_id: 'ind-3.10.2', level: 2, kategori: 'Cukup Baik', deskripsi: 'Memberi kesempatan beribadah namun belum aktif memfasilitasi akses guru agama seagama.' },
              { id: 'r3102-3', indikator_id: 'ind-3.10.2', level: 3, kategori: 'Baik', deskripsi: 'Mengakomodasi kebutuhan ibadah dan hak libur keagamaan warga secara mandiri/bermitra.' },
              { id: 'r3102-4', indikator_id: 'ind-3.10.2', level: 4, kategori: 'Sangat Baik', deskripsi: 'Fasilitas ibadah lengkap, guru agama kompeten seagama, integrasi kurikulum dan perlakuan setara.' }
            ],
            bukti_fisik: [
              { id: 'bf3102-1', indikator_id: 'ind-3.10.2', kode: 'BF-3.10.2-A', nama: 'Sarana tempat ibadah, jadwal kegiatan keagamaan, & SK guru agama', jenis: 'Observasi', deskripsi: 'Fasilitas ibadah bersih dan jadwal layanan keagamaan.', wajib: true }
            ]
          }
        ]
      },
      {
        id: 'b11',
        komponen_id: 'a3333333-3333-4333-a333-333333333333',
        nomor: 11,
        kode: 'Butir 11',
        nama: 'Satuan pendidikan menyediakan lingkungan belajar yang inklusif untuk memenuhi kebutuhan belajar peserta didik yang beragam',
        deskripsi: 'Kebijakan penerimaan dan layanan murid berkebutuhan khusus sesuai karakteristik program keahlian vokasi.',
        indikator: [
          {
            id: 'ind-3.11.1',
            butir_id: 'b11',
            nomor: 1,
            kode: '3.11.1',
            nama: 'Kebijakan untuk menghadirkan lingkungan belajar yang inklusif dalam penerimaan murid berkebutuhan khusus dengan mempertimbangkan kebutuhan dan persyaratan program keahlian',
            definisi_operasional: 'Menilai adanya kebijakan dan prosedur pembelajaran yang memastikan semua murid dapat belajar secara adil sesuai tuntutan program keahlian.',
            penjelasan: 'Penerapan Universal Design for Learning (UDL), asesmen awal non-kognitif, dan adaptasi materi.',
            rubrik_penilaian: [
              { id: 'r3111-1', indikator_id: 'ind-3.11.1', level: 1, kategori: 'Kurang', deskripsi: 'Pembelajaran inklusif belum diterapkan atau ada perlakuan diskriminatif.' },
              { id: 'r3111-2', indikator_id: 'ind-3.11.1', level: 2, kategori: 'Cukup Baik', deskripsi: 'Inklusif mulai diterapkan, kebutuhan murid mulai diidentifikasi pada beberapa mapel.' },
              { id: 'r3111-3', indikator_id: 'ind-3.11.1', level: 3, kategori: 'Baik', deskripsi: 'Diterapkan rutin tanpa diskriminasi dan strategi disesuaikan sebagian program keahlian.' },
              { id: 'r3111-4', indikator_id: 'ind-3.11.1', level: 4, kategori: 'Sangat Baik', deskripsi: 'Diterapkan menyeluruh tanpa diskriminasi, identifikasi rutin, dan strategi disesuaikan tiap konsentrasi keahlian.' }
            ],
            bukti_fisik: [
              { id: 'bf3111-1', indikator_id: 'ind-3.11.1', kode: 'BF-3.11.1-A', nama: 'SOP PPDB Inklusif, data profil asesmen awal murid, & modul berdiferensiasi', jenis: 'Dokumen', deskripsi: 'Bukti asesmen awal kebutuhan belajar.', wajib: true }
            ]
          },
          {
            id: 'ind-3.11.2',
            butir_id: 'b11',
            nomor: 2,
            kode: '3.11.2',
            nama: 'Kebijakan SMK/MAK untuk menghadirkan lingkungan belajar yang inklusif bagi murid berkebutuhan khusus yang sudah diterima di sekolah/madrasah',
            definisi_operasional: 'Kinerja dalam menyiapkan kapasitas guru, orang tua/wali, dan murid untuk memfasilitasi kebutuhan belajar murid yang memerlukan dukungan khusus.',
            penjelasan: 'Penyiapan sarpras pokok, pendampingan guru BK, dan pembiasaan empati antarteman sebaya.',
            rubrik_penilaian: [
              { id: 'r3112-1', indikator_id: 'ind-3.11.2', level: 1, kategori: 'Kurang', deskripsi: 'Kebijakan menolak anak berkebutuhan khusus dan tidak ada pembekalan bagi guru/orang tua.' },
              { id: 'r3112-2', indikator_id: 'ind-3.11.2', level: 2, kategori: 'Cukup Baik', deskripsi: 'Menerima murid namun guru belum disiapkan dan strategi pelibatan orang tua belum ada.' },
              { id: 'r3112-3', indikator_id: 'ind-3.11.2', level: 3, kategori: 'Baik', deskripsi: 'Menyiapkan guru pendamping khusus namun komunikasi dengan orang tua lain belum intensif.' },
              { id: 'r3112-4', indikator_id: 'ind-3.11.2', level: 4, kategori: 'Sangat Baik', deskripsi: 'Guru dan sarpras pokok siap, komunikasi kerja sama erat dengan orang tua, seluruh murid paham kesetaraan hak belajar.' }
            ],
            bukti_fisik: [
              { id: 'bf3112-1', indikator_id: 'ind-3.11.2', kode: 'BF-3.11.2-A', nama: 'Program pendampingan guru BK & fasilitas aksesibilitas sarana belajar', jenis: 'Dokumen', deskripsi: 'Laporan bimbingan dan penerimaan inklusif.', wajib: true }
            ]
          }
        ]
      },
      {
        id: 'b12',
        komponen_id: 'a3333333-3333-4333-a333-333333333333',
        nomor: 12,
        kode: 'Butir 12',
        nama: 'Satuan pendidikan mewujudkan iklim lingkungan belajar yang aman secara psikis dan fisik bagi peserta didik, pendidik, dan tenaga kependidikan',
        deskripsi: 'Kebijakan, SOP pencegahan/penanganan, serta keberfungsian Tim Pencegahan dan Penanganan Kekerasan (TPPK) dari perundungan dan kekerasan.',
        indikator: [
          {
            id: 'ind-3.12.1',
            butir_id: 'b12',
            nomor: 1,
            kode: '3.12.1',
            nama: 'Kesiapan dan Komitmen SMK/MAK dalam pencegahan dan penanganan perundungan serta tindakan kekerasan',
            definisi_operasional: 'Komitmen untuk menolak, mencegah, dan menangani perundungan dan segala bentuk tindakan kekerasan di sekolah.',
            penjelasan: 'Penetapan SK TPPK resmi, kanal pengaduan aman, dan sosialisasi kebijakan anti perundungan.',
            rubrik_penilaian: [
              { id: 'r3121-1', indikator_id: 'ind-3.12.1', level: 1, kategori: 'Kurang', deskripsi: 'Belum menetapkan kebijakan, belum ada SOP, dan belum membentuk tim/satgas pencegahan kekerasan.' },
              { id: 'r3121-2', indikator_id: 'ind-3.12.1', level: 2, kategori: 'Cukup Baik', deskripsi: 'Kebijakan normatif, SOP belum dipahami warga sekolah, tim satgas belum berfungsi aktif.' },
              { id: 'r3121-3', indikator_id: 'ind-3.12.1', level: 3, kategori: 'Baik', deskripsi: 'Kebijakan dan SOP ada, tim satgas terbentuk namun masih berfungsi pasif menunggu laporan.' },
              { id: 'r3121-4', indikator_id: 'ind-3.12.1', level: 4, kategori: 'Sangat Baik', deskripsi: 'Kebijakan & SOP disosialisasikan ke seluruh warga/orang tua, tim satgas TPPK berfungsi sangat proaktif.' }
            ],
            bukti_fisik: [
              { id: 'bf3121-1', indikator_id: 'ind-3.12.1', kode: 'BF-3.12.1-A', nama: 'SK TPPK terdata di Dapodik, SOP alur pengaduan, & dokumentasi sosialisasi', jenis: 'Dokumen', deskripsi: 'SK resmi Satgas Anti Kekerasan dan banner alur pelaporan.', wajib: true }
            ]
          },
          {
            id: 'ind-3.12.2',
            butir_id: 'b12',
            nomor: 2,
            kode: '3.12.2',
            nama: 'Penerapan dalam pencegahan dan penanganan perundungan serta tindakan kekerasan',
            definisi_operasional: 'Kinerja melaksanakan program peningkatan kesadaran dampak negatif dan pencegahan perundungan/kekerasan.',
            penjelasan: 'Integrasi kurikulum (projek P5), pembekalan guru BK, dan layanan konseling perlindungan korban.',
            rubrik_penilaian: [
              { id: 'r3122-1', indikator_id: 'ind-3.12.2', level: 1, kategori: 'Kurang', deskripsi: 'Belum ada upaya penyadaran dan belum melatih guru/melibatkan orang tua.' },
              { id: 'r3122-2', indikator_id: 'ind-3.12.2', level: 2, kategori: 'Cukup Baik', deskripsi: 'Upaya penyadaran insidental dan pelatihan guru masih sangat terbatas.' },
              { id: 'r3122-3', indikator_id: 'ind-3.12.2', level: 3, kategori: 'Baik', deskripsi: 'Penyadaran melalui intrakurikuler/kokurikuler, guru dilatih, orang tua dilibatkan, personel konseling ditugaskan.' },
              { id: 'r3122-4', indikator_id: 'ind-3.12.2', level: 4, kategori: 'Sangat Baik', deskripsi: 'Sistematis dan terintegrasi, guru terlatih resolusi konflik, aspirasi orang tua diakomodasi, konseling aktif melindungi korban.' }
            ],
            bukti_fisik: [
              { id: 'bf3122-1', indikator_id: 'ind-3.12.2', kode: 'BF-3.12.2-A', nama: 'Materi sosialisasi anti cyberbullying, laporan bimbingan konseling, & notula forum orang tua', jenis: 'Dokumen', deskripsi: 'Catatan workshop anti kekerasan dan penanganan kasus.', wajib: true }
            ]
          }
        ]
      },
      {
        id: 'b13',
        komponen_id: 'a3333333-3333-4333-a333-333333333333',
        nomor: 13,
        kode: 'Butir 13',
        nama: 'Satuan pendidikan memastikan keselamatan peserta didik, pendidik, dan tenaga kependidikan',
        deskripsi: 'Kelayakan struktur bangunan dan sarana fisik, kesiapan peralatan & petugas terlatih P3K, serta SOP simulasi evakuasi bencana rutin.',
        indikator: [
          {
            id: 'ind-3.13.1',
            butir_id: 'b13',
            nomor: 1,
            kode: '3.13.1',
            nama: 'Lingkungan belajar yang menjaga keselamatan warga SMK/MAK',
            definisi_operasional: 'Kesiapan dalam memastikan kondisi sarana prasarana dan lingkungan fisik aman dan tidak membahayakan.',
            penjelasan: 'Bangunan kokoh, bebas material berbahaya, ada tanda peringatan bahaya, dan mitigasi risiko lingkungan sekitar.',
            rubrik_penilaian: [
              { id: 'r3131-1', indikator_id: 'ind-3.13.1', level: 1, kategori: 'Kurang', deskripsi: 'Sebagian besar bangunan/sarpras belum aman, ditemukan 3 atau lebih faktor kerusakan berbahaya.' },
              { id: 'r3131-2', indikator_id: 'ind-3.13.1', level: 2, kategori: 'Cukup Baik', deskripsi: 'Ditemukan maksimal 2 potensi bahaya yang belum tertangani.' },
              { id: 'r3131-3', indikator_id: 'ind-3.13.1', level: 3, kategori: 'Baik', deskripsi: 'Sebagian besar sarpras kokoh, tanda peringatan terpasang, jika ada kerusakan hanya rusak ringan.' },
              { id: 'r3131-4', indikator_id: 'ind-3.13.1', level: 4, kategori: 'Sangat Baik', deskripsi: 'Bangunan terawat sangat kokoh, material aman, tanda peringatan jelas, pencegahan bahaya lingkungan lengkap.' }
            ],
            bukti_fisik: [
              { id: 'bf3131-1', indikator_id: 'ind-3.13.1', kode: 'BF-3.13.1-A', nama: 'Dokumentasi pemeliharaan gedung, pagar pengaman lantai 2, & tanda peringatan bahaya', jenis: 'Observasi', deskripsi: 'Pemeriksaan fisik sarana aman bebas retak berisiko.', wajib: true }
            ]
          },
          {
            id: 'ind-3.13.2',
            butir_id: 'b13',
            nomor: 2,
            kode: '3.13.2',
            nama: 'Kesiapan dalam pemberian Pertolongan Pertama pada Kecelakaan (P3K)',
            definisi_operasional: 'Kesiapan menangani warga yang membutuhkan pertolongan pertama melalui petugas terlatih, sarana P3K lengkap, dan alur rujukan faskes.',
            penjelasan: 'Kotak P3K standar di bengkel/lab/UKS, sertifikat pelatihan PMI/Puskesmas, dan MOU rujukan fasilitas kesehatan.',
            rubrik_penilaian: [
              { id: 'r3132-1', indikator_id: 'ind-3.13.2', level: 1, kategori: 'Kurang', deskripsi: 'Belum menetapkan SOP P3K, belum ada personel terlatih, sarana P3K sangat terbatas.' },
              { id: 'r3132-2', indikator_id: 'ind-3.13.2', level: 2, kategori: 'Cukup Baik', deskripsi: 'Ada kotak P3K sederhana dan personel terlatih namun belum ada SOP rujukan resmi.' },
              { id: 'r3132-3', indikator_id: 'ind-3.13.2', level: 3, kategori: 'Baik', deskripsi: 'Peralatan P3K lengkap, personel terlatih siap, SOP rujukan faskes terdekat telah ditetapkan.' },
              { id: 'r3132-4', indikator_id: 'ind-3.13.2', level: 4, kategori: 'Sangat Baik', deskripsi: 'Ruang UKS/P3K khusus lengkap, personel tersertifikasi, dan ada kerja sama (MOU) resmi dengan faskes/puskesmas rujukan.' }
            ],
            bukti_fisik: [
              { id: 'bf3132-1', indikator_id: 'ind-3.13.2', kode: 'BF-3.13.2-A', nama: 'Sertifikat pelatihan P3K guru/staf, foto kotak P3K lab, & MoU faskes/Puskesmas', jenis: 'Dokumen', deskripsi: 'Daftar isi obat P3K dan sertifikat PMI/Kemenkes.', wajib: true }
            ]
          },
          {
            id: 'ind-3.13.3',
            butir_id: 'b13',
            nomor: 3,
            kode: '3.13.3',
            nama: 'Kesiapan SMK/MAK dalam menghadapi ragam potensi bencana',
            definisi_operasional: 'Kesiapan melalui pelaksanaan simulasi evakuasi bencana berkala dan prosedur evakuasi bencana yang disetujui pihak berwenang.',
            penjelasan: 'Simulasi evakuasi gempa/kebakaran minimal 2x setahun, jalur evakuasi, dan titik kumpul (assembly point).',
            rubrik_penilaian: [
              { id: 'r3133-1', indikator_id: 'ind-3.13.3', level: 1, kategori: 'Kurang', deskripsi: 'Belum menetapkan prosedur evakuasi bencana dan belum ada simulasi dalam setahun.' },
              { id: 'r3133-2', indikator_id: 'ind-3.13.3', level: 2, kategori: 'Cukup Baik', deskripsi: 'Prosedur evakuasi ada dan simulasi dilaksanakan minimal 2 kali setahun.' },
              { id: 'r3133-3', indikator_id: 'ind-3.13.3', level: 3, kategori: 'Baik', deskripsi: 'Prosedur direview instansi berwenang (BPBD/Damkar) dan simulasi rutin minimal 2 kali setahun.' },
              { id: 'r3133-4', indikator_id: 'ind-3.13.3', level: 4, kategori: 'Sangat Baik', deskripsi: 'Tata letak sarpras antisipatif bencana, SOP disahkan BPBD/Damkar, simulasi rutin 2x setahun diikuti seluruh warga.' }
            ],
            bukti_fisik: [
              { id: 'bf3133-1', indikator_id: 'ind-3.13.3', kode: 'BF-3.13.3-A', nama: 'Dokumen SOP Tanggap Darurat Bencana, denah titik kumpul, & foto simulasi evakuasi bersama BPBD/Damkar', jenis: 'Dokumen', deskripsi: 'Bukti pelaksanaan simulasi evakuasi kebencanaan.', wajib: true }
            ]
          }
        ]
      },
      {
        id: 'b14',
        komponen_id: 'a3333333-3333-4333-a333-333333333333',
        nomor: 14,
        kode: 'Butir 14',
        nama: 'Satuan pendidikan menjamin lingkungan yang sehat dan memiliki/melaksanakan program yang membangun kesehatan fisik dan mental pada peserta didik, pendidik, dan tenaga kependidikan',
        deskripsi: 'Pembiasaan Perilaku Hidup Bersih dan Sehat (PHBS), aktivitas olahraga kebugaran rutin, penguatan ketahanan mental, serta edukasi kesehatan reproduksi dan pencegahan adiksi (narkoba/gadget/judi online).',
        indikator: [
          {
            id: 'ind-3.14.1',
            butir_id: 'b14',
            nomor: 1,
            kode: '3.14.1',
            nama: 'SMK/MAK membiasakan pola hidup bersih dan sehat (PHBS)',
            definisi_operasional: 'Menciptakan lingkungan yang mendorong seluruh warga sekolah terbiasa menjaga kebersihan diri dan lingkungan secara konsisten.',
            penjelasan: 'Kantin sehat, sanitasi toilet bersih terpisah, tempat cuci tangan, dan keteladanan kepala sekolah/guru.',
            rubrik_penilaian: [
              { id: 'r3141-1', indikator_id: 'ind-3.14.1', level: 1, kategori: 'Kurang', deskripsi: 'Tidak terlihat upaya mewujudkan PHBS di lingkungan sekolah.' },
              { id: 'r3141-2', indikator_id: 'ind-3.14.1', level: 2, kategori: 'Cukup Baik', deskripsi: 'Mulai memperhatikan kebersihan namun belum inovatif dan belum melibatkan seluruh warga.' },
              { id: 'r3141-3', indikator_id: 'ind-3.14.1', level: 3, kategori: 'Baik', deskripsi: 'Menerapkan PHBS di sebagian besar lingkungan secara inovatif dan teratur.' },
              { id: 'r3141-4', indikator_id: 'ind-3.14.1', level: 4, kategori: 'Sangat Baik', deskripsi: 'PHBS menjadi budaya menyeluruh, inovatif, dan partisipatif melibatkan seluruh warga sekolah.' }
            ],
            bukti_fisik: [
              { id: 'bf3141-1', indikator_id: 'ind-3.14.1', kode: 'BF-3.14.1-A', nama: 'Dokumentasi sarana sanitasi, jadwal piket jumat bersih, & sertifikat kantin sehat', jenis: 'Observasi', deskripsi: 'Kondisi toilet higienis dan tempat cuci tangan mengalir.', wajib: true }
            ]
          },
          {
            id: 'ind-3.14.2',
            butir_id: 'b14',
            nomor: 2,
            kode: '3.14.2',
            nama: 'SMK/MAK membiasakan olahraga dan aktivitas fisik lainnya untuk meningkatkan kesehatan dan kebugaran murid',
            definisi_operasional: 'Mendorong kebiasaan berolahraga secara teratur selain jam PJOK untuk meningkatkan kebugaran dan stamina kerja.',
            penjelasan: 'Senam pagi mingguan, ekstrakurikuler olahraga, tes kebugaran jasmani Indonesia (TKJI) berkala.',
            rubrik_penilaian: [
              { id: 'r3142-1', indikator_id: 'ind-3.14.2', level: 1, kategori: 'Kurang', deskripsi: 'Tidak ada pembiasaan olahraga atau aktivitas fisik selain jam pelajaran PJOK.' },
              { id: 'r3142-2', indikator_id: 'ind-3.14.2', level: 2, kategori: 'Cukup Baik', deskripsi: 'Tambahan olahraga hanya dilaksanakan secara insidental.' },
              { id: 'r3142-3', indikator_id: 'ind-3.14.2', level: 3, kategori: 'Baik', deskripsi: 'Melaksanakan olahraga tambahan secara rutin terjadwal untuk seluruh murid.' },
              { id: 'r3142-4', indikator_id: 'ind-3.14.2', level: 4, kategori: 'Sangat Baik', deskripsi: 'Olahraga rutin terstruktur dan terintegrasi dilengkapi laporan rekap tes kebugaran tiap murid.' }
            ],
            bukti_fisik: [
              { id: 'bf3142-1', indikator_id: 'ind-3.14.2', kode: 'BF-3.14.2-A', nama: 'Jadwal senam/olahraga bersama & laporan hasil tes kebugaran murid (TKJI)', jenis: 'Dokumen', deskripsi: 'Rekapitulasi kebugaran jasmani peserta didik.', wajib: true }
            ]
          },
          {
            id: 'ind-3.14.3',
            butir_id: 'b14',
            nomor: 3,
            kode: '3.14.3',
            nama: 'SMK/MAK membangun ketahanan mental pada murid, guru, dan tenaga kependidikan',
            definisi_operasional: 'Suasana kehidupan sekolah kondusif membangun ketahanan mental murid dan staf dalam mengelola tekanan dan beradaptasi.',
            penjelasan: 'Akses konseling BK mudah, seminar motivasi/mindset, dan interaksi hangat kepemimpinan.',
            rubrik_penilaian: [
              { id: 'r3143-1', indikator_id: 'ind-3.14.3', level: 1, kategori: 'Kurang', deskripsi: 'Belum tampak suasana yang mendukung ketahanan mental dan psikologis.' },
              { id: 'r3143-2', indikator_id: 'ind-3.14.3', level: 2, kategori: 'Cukup Baik', deskripsi: 'Mulai menginisiasi upaya namun hasilnya belum tampak nyata.' },
              { id: 'r3143-3', indikator_id: 'ind-3.14.3', level: 3, kategori: 'Baik', deskripsi: 'Mulai membentuk kondisi psikologis yang mencerminkan ketahanan mengelola tekanan.' },
              { id: 'r3143-4', indikator_id: 'ind-3.14.3', level: 4, kategori: 'Sangat Baik', deskripsi: 'Kondisi psikologis prima: mampu mengelola stres, adaptif, optimal secara emosional di lingkungan kerja, dan bangkit dari kegagalan.' }
            ],
            bukti_fisik: [
              { id: 'bf3143-1', indikator_id: 'ind-3.14.3', kode: 'BF-3.14.3-A', nama: 'Program bimbingan konseling ketahanan mental & dokumentasi seminar mindset', jenis: 'Dokumen', deskripsi: 'Layanan konsultasi guru BK dan workshop motivasi.', wajib: true }
            ]
          },
          {
            id: 'ind-3.14.4',
            butir_id: 'b14',
            nomor: 4,
            kode: '3.14.4',
            nama: 'SMK/MAK melaksanakan edukasi tentang kesehatan reproduksi dan pencegahan adiksi',
            definisi_operasional: 'Peran aktif dalam mencegah adiksi (rokok, narkoba, judi online, game berlebih) dan edukasi kesehatan reproduksi remaja.',
            penjelasan: 'Penyuluhan bersama BNN/Puskesmas/Kepolisian dan materi kurikulum terintegrasi.',
            rubrik_penilaian: [
              { id: 'r3144-1', indikator_id: 'ind-3.14.4', level: 1, kategori: 'Kurang', deskripsi: 'Tidak mempunyai program edukasi pencegahan adiksi dan kesehatan reproduksi.' },
              { id: 'r3144-2', indikator_id: 'ind-3.14.4', level: 2, kategori: 'Cukup Baik', deskripsi: 'Pernah memberikan pembekalan salah satu topik namun belum berkala.' },
              { id: 'r3144-3', indikator_id: 'ind-3.14.4', level: 3, kategori: 'Baik', deskripsi: 'Memberikan pembekalan pencegahan adiksi dan kesehatan reproduksi secara berkala.' },
              { id: 'r3144-4', indikator_id: 'ind-3.14.4', level: 4, kategori: 'Sangat Baik', deskripsi: 'Pembekalan berkala beragam/variatif bekerja sama dengan BNN/Dinkes serta lingkungan sekolah aman bebas adiksi.' }
            ],
            bukti_fisik: [
              { id: 'bf3144-1', indikator_id: 'ind-3.14.4', kode: 'BF-3.14.4-A', nama: 'Dokumen kerja sama BNN/Puskesmas & foto kegiatan sosialisasi bahaya narkoba/judi online', jenis: 'Dokumen', deskripsi: 'Laporan seminar pencegahan adiksi digital dan NAPZA.', wajib: true }
            ]
          }
        ]
      },
      {
        id: 'b15',
        komponen_id: 'a3333333-3333-4333-a333-333333333333',
        nomor: 15,
        kode: 'Butir 15',
        nama: 'Satuan pendidikan menghadirkan pembelajaran yang relevan dengan dunia kerja',
        deskripsi: 'Internalisasi budaya kerja industri (K3 Lingkungan Kerja), penyelenggaraan model pembelajaran Teaching Factory (TeFa), serta keterlibatan praktisi industri mengajar.',
        indikator: [
          {
            id: 'ind-3.15.1',
            butir_id: 'b15',
            nomor: 1,
            kode: '3.15.1',
            nama: 'Internalisasi karakter kerja dan pembiasaan budaya kerja sesuai standar keselamatan, kesehatan, keamanan, dan lingkungan kerja (K3 Lingkungan Kerja)',
            definisi_operasional: 'Membentuk kebiasaan murid menerapkan budaya kerja industri (5R/5S, APD, briefing pagi/toolbox meeting, kedisiplinan dan tanggung jawab).',
            penjelasan: 'Integrasi K3L dalam modul ajar, apel pagi kejuruan, dan kepatuhan SOP lab/bengkel.',
            rubrik_penilaian: [
              { id: 'r3151-1', indikator_id: 'ind-3.15.1', level: 1, kategori: 'Kurang', deskripsi: 'Budaya kerja dan standar K3 belum diterapkan dalam pembelajaran praktik.' },
              { id: 'r3151-2', indikator_id: 'ind-3.15.1', level: 2, kategori: 'Cukup Baik', deskripsi: 'Mulai diperkenalkan namun masih parsial/insidental pada mapel tertentu saja.' },
              { id: 'r3151-3', indikator_id: 'ind-3.15.1', level: 3, kategori: 'Baik', deskripsi: 'Diterapkan pada sebagian besar kegiatan praktik secara terprogram dan terencana.' },
              { id: 'r3151-4', indikator_id: 'ind-3.15.1', level: 4, kategori: 'Sangat Baik', deskripsi: 'Menjadi identitas dan kebiasaan harian (briefing, 5S, APD konsisten) di seluruh bengkel/lab.' }
            ],
            bukti_fisik: [
              { id: 'bf3151-1', indikator_id: 'ind-3.15.1', kode: 'BF-3.15.1-A', nama: 'SOP Budaya Kerja Industri (5S/K3), foto apel/briefing pagi bengkel, & lembar penilaian sikap kerja', jenis: 'Observasi', deskripsi: 'Penerapan APD dan kedisiplinan kerja peserta didik.', wajib: true }
            ]
          },
          {
            id: 'ind-3.15.2',
            butir_id: 'b15',
            nomor: 2,
            kode: '3.15.2',
            nama: 'Penyelenggaraan model pembelajaran berbasis industri',
            definisi_operasional: 'Menyelenggarakan pembelajaran berbasis industri seperti teaching factory (unit usaha) yang meniru proses kerja industri nyata.',
            penjelasan: 'Pengerjaan work order nyata dari mitra industri atau unit produksi komersial sekolah.',
            rubrik_penilaian: [
              { id: 'r3152-1', indikator_id: 'ind-3.15.2', level: 1, kategori: 'Kurang', deskripsi: 'Pembelajaran berbasis industri belum dilaksanakan atau masih sebatas teori kelas.' },
              { id: 'r3152-2', indikator_id: 'ind-3.15.2', level: 2, kategori: 'Cukup Baik', deskripsi: 'Mulai dilaksanakan sebatas simulasi internal yang menghasilkan produk insidental.' },
              { id: 'r3152-3', indikator_id: 'ind-3.15.2', level: 3, kategori: 'Baik', deskripsi: 'Diterapkan terencana, produk/jasa dihasilkan, pengelolaan aspek bisnis dalam pendampingan.' },
              { id: 'r3152-4', indikator_id: 'ind-3.15.2', level: 4, kategori: 'Sangat Baik', deskripsi: 'Berjalan sangat efektif membentuk kompetensi kerja, produk bernilai komersial riil, dan dikelola sesuai prinsip bisnis profesional.' }
            ],
            bukti_fisik: [
              { id: 'bf3152-1', indikator_id: 'ind-3.15.2', kode: 'BF-3.15.2-A', nama: 'Buku panduan TeFa, katalog produk/jasa kejuruan, & laporan omset unit produksi', jenis: 'Produk Siswa', deskripsi: 'Portofolio hasil karya dan transaksi order industri.', wajib: true }
            ]
          },
          {
            id: 'ind-3.15.3',
            butir_id: 'b15',
            nomor: 3,
            kode: '3.15.3',
            nama: 'Keterlibatan praktisi dalam pembelajaran teori dan/atau praktik',
            definisi_operasional: 'Partisipasi aktif praktisi/profesional industri mengajar langsung di kelas/lab, coaching, mentoring, atau co-teaching berkala.',
            penjelasan: 'Program Guru Tamu Industri minimal 50 jam per semester per konsentrasi keahlian.',
            rubrik_penilaian: [
              { id: 'r3153-1', indikator_id: 'ind-3.15.3', level: 1, kategori: 'Kurang', deskripsi: 'Belum ada keterlibatan praktisi, pembelajaran sepenuhnya oleh guru internal.' },
              { id: 'r3153-2', indikator_id: 'ind-3.15.3', level: 2, kategori: 'Cukup Baik', deskripsi: 'Praktisi hanya sesekali/insidental tanpa jadwal terencana dalam kurikulum.' },
              { id: 'r3153-3', indikator_id: 'ind-3.15.3', level: 3, kategori: 'Baik', deskripsi: 'Dilibatkan dalam sebagian besar praktik dan terjadwal dalam program pembelajaran.' },
              { id: 'r3153-4', indikator_id: 'ind-3.15.3', level: 4, kategori: 'Sangat Baik', deskripsi: 'Berlangsung terstruktur, terjadwal di semua program keahlian, dan praktisi aktif mengajar sebagai co-teacher berkala.' }
            ],
            bukti_fisik: [
              { id: 'bf3153-1', indikator_id: 'ind-3.15.3', kode: 'BF-3.15.3-A', nama: 'MoU Guru Tamu, jadwal mengajar praktisi industri, daftar hadir, & foto kegiatan mengajar', jenis: 'Dokumen', deskripsi: 'Log book keterlibatan praktisi di kelas/bengkel.', wajib: true }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'a4444444-4444-4444-a444-444444444444',
    kode: 'K4',
    nomor: 4,
    nama: 'Kompetensi Hasil Pembelajaran Lulusan dan/atau Peserta Didik',
    deskripsi: 'Memastikan setiap murid meraih kompetensi spesifik okupasi kejuruan yang diakui dunia kerja (portofolio karya nyata & sertifikat BNSP/LSP) serta keterserapan lulusan (Bekerja, Wirausaha, Melanjutkan studi / BMW).',
    bobot: 20,
    butir: [
      {
        id: 'b16',
        komponen_id: 'a4444444-4444-4444-a444-444444444444',
        nomor: 16,
        kode: 'Butir 16',
        nama: 'Lulusan dan/atau pelajar memiliki kompetensi sesuai program keahliannya',
        deskripsi: 'Pengukuran luaran (output) hasil pendidikan kejuruan melalui portofolio karya nyata yang diakui industri dan persentase keterserapan lulusan (Tracer Study).',
        indikator: [
          {
            id: 'ind-4.16.1',
            butir_id: 'b16',
            nomor: 1,
            kode: '4.16.1',
            nama: 'Memiliki portofolio yang diakui di dunia kerja berupa karya dan/atau sertifikat kompetensi keahlian',
            definisi_operasional: 'Murid memiliki dokumen portofolio yang berisi bukti kompetensi dalam bentuk karya nyata (proyek, produk, prototipe, aplikasi) dan/atau sertifikat kompetensi resmi (BNSP/LSP).',
            penjelasan: 'Karya nyata terstruktur, terverifikasi mitra industri, dan kepemilikan sertifikat garuda BNSP.',
            rubrik_penilaian: [
              { id: 'r4161-1', indikator_id: 'ind-4.16.1', level: 1, kategori: 'Kurang', deskripsi: 'Tidak ada atau sangat sedikit lulusan yang memiliki portofolio/sertifikat kompetensi yang diakui.' },
              { id: 'r4161-2', indikator_id: 'ind-4.16.1', level: 2, kategori: 'Cukup Baik', deskripsi: 'Kurang dari separuh lulusan memiliki portofolio yang relevan dengan bidang keahlian.' },
              { id: 'r4161-3', indikator_id: 'ind-4.16.1', level: 3, kategori: 'Baik', deskripsi: 'Lebih dari separuh lulusan memiliki portofolio terstruktur dan diakui mitra dunia kerja.' },
              { id: 'r4161-4', indikator_id: 'ind-4.16.1', level: 4, kategori: 'Sangat Baik', deskripsi: 'Lebih dari separuh lulusan memiliki portofolio terstruktur dan bersertifikat BNSP/LSP yang diakui luas oleh industri.' }
            ],
            bukti_fisik: [
              { id: 'bf4161-1', indikator_id: 'ind-4.16.1', kode: 'BF-4.16.1-A', nama: 'Rekapitulasi sertifikat kompetensi BNSP/LSP siswa & link repositori portofolio digital/karya fisik', jenis: 'Sertifikat', deskripsi: 'Daftar nomor sertifikat garuda BNSP dan portofolio proyek siswa.', wajib: true }
            ]
          },
          {
            id: 'ind-4.16.2',
            butir_id: 'b16',
            nomor: 2,
            kode: '4.16.2',
            nama: 'Bekerja atau berwirausaha sesuai keahlian/minatnya atau melanjutkan kuliah',
            definisi_operasional: 'Mengukur keberhasilan lulusan SMK/MAK dalam meraih pekerjaan, berwirausaha atau mengikuti pendidikan lanjut setelah lulus (Tracer Study 3 tahun terakhir).',
            penjelasan: 'Persentase keterserapan BMW: Bekerja (linier), Wirausaha, Melanjutkan studi minimal 50% atau lebih dari total lulusan.',
            rubrik_penilaian: [
              { id: 'r4162-1', indikator_id: 'ind-4.16.2', level: 1, kategori: 'Kurang', deskripsi: 'Selama 3 tahun terakhir rata-rata kurang dari 25% lulusan bekerja/wirausaha/kuliah atau tidak ada data tracer study.' },
              { id: 'r4162-2', indikator_id: 'ind-4.16.2', level: 2, kategori: 'Cukup Baik', deskripsi: 'Selama 3 tahun terakhir rata-rata sekitar 30% lulusan bekerja/wirausaha/kuliah, pendataan belum lengkap.' },
              { id: 'r4162-3', indikator_id: 'ind-4.16.2', level: 3, kategori: 'Baik', deskripsi: 'Selama 3 tahun terakhir rata-rata sekitar 40% lulusan bekerja/wirausaha/kuliah dan ada kemitraan penempatan.' },
              { id: 'r4162-4', indikator_id: 'ind-4.16.2', level: 4, kategori: 'Sangat Baik', deskripsi: 'Selama 3 tahun terakhir rata-rata lebih dari 50% lulusan terserap (bekerja/wirausaha/kuliah), tracer study tertib dan lengkap.' }
            ],
            bukti_fisik: [
              { id: 'bf4162-1', indikator_id: 'ind-4.16.2', kode: 'BF-4.16.2-A', nama: 'Laporan eksekutif Tracer Study 3 tahun terakhir & bukti kontrak kerja/surat keterangan kuliah/wirausaha', jenis: 'Dokumen', deskripsi: 'Rekapitulasi data sebaran alumni di dunia kerja dan perguruan tinggi.', wajib: true }
            ]
          }
        ]
      }
    ]
  }
];

export const INITIAL_EVALUASI_DATA: Record<string, EvaluasiAsesi> = {
  'ind-1.1.1': {
    id: 'eval-1',
    indikator_id: 'ind-1.1.1',
    capaian: 'Sangat Baik',
    skor: 4,
    catatan: 'Pendidik di SMK IT Ibnul Qayyim Makassar secara konsisten membangun interaksi positif dua arah. Dalam setiap sesi teori maupun praktikum di Laboratorium IT, guru mendengarkan pendapat murid dengan seksama, menggali pemahaman lebih lanjut, dan menggunakan bahasa yang memotivasi siswa untuk berani berpendapat.',
    bukti_urls: [
      'https://drive.google.com/drive/folders/smkit-ibnulqayyim-modul-ajar-2025',
      'https://smkitibnulqayyim.sch.id/sop-lab-it'
    ],
    bukti_checklist: {
      'bf111-1': 'Tersedia',
      'bf111-2': 'Tersedia',
      'bf111-3': 'Tersedia'
    },
    status_verifikasi: 'Terverifikasi Valid',
    verified_by: 'Tim Asesor Internal',
    last_edited_by: 'Ahmad Fadhil, S.Kom',
    last_edited_role: 'Ketua Tim Asesi / Guru Produktif RPL',
    created_at: '2026-03-01T08:00:00.000Z',
    updated_at: '2026-03-15T09:30:00.000Z'
  },
  'ind-1.2.1': {
    id: 'eval-2',
    indikator_id: 'ind-1.2.1',
    capaian: 'Baik',
    skor: 3,
    catatan: 'Kesepakatan kelas disusun di awal semester ganjil melibatkan aspirasi seluruh murid kelas X, XI, dan XII. Poster tata tertib dan kesepakatan belajar terpajang di setiap ruang kelas dan lab komputer. Sedang ditingkatkan inisiatif mandiri antarmurid dalam saling mengingatkan.',
    bukti_urls: [
      'https://drive.google.com/drive/folders/kesepakatan-kelas-smkit-2025'
    ],
    bukti_checklist: {
      'bf121-1': 'Tersedia',
      'bf121-2': 'Dalam Proses'
    },
    status_verifikasi: 'Terverifikasi Valid',
    verified_by: 'Waka Kurikulum',
    last_edited_by: 'Nur Hidayah, S.Pd',
    last_edited_role: 'Waka Kurikulum & Pembelajaran',
    created_at: '2026-03-02T10:00:00.000Z',
    updated_at: '2026-03-16T11:00:00.000Z'
  },
  'ind-2.6.4': {
    id: 'eval-3',
    indikator_id: 'ind-2.6.4',
    capaian: 'Sangat Baik',
    skor: 4,
    catatan: 'SMK IT Ibnul Qayyim Makassar telah menjalin MoU strategis dengan 12 mitra dunia kerja (Software House, ISP di Sulawesi Selatan, Cloud Provider) yang aktif dalam sinkronisasi kurikulum, guru tamu, serta penyerapan magang dan lulusan.',
    bukti_urls: [
      'https://drive.google.com/drive/folders/mou-dudika-smkit-ibnulqayyim'
    ],
    bukti_checklist: {
      'bf264-1': 'Tersedia'
    },
    status_verifikasi: 'Terverifikasi Valid',
    verified_by: 'Kepala Satuan Pendidikan',
    last_edited_by: 'Drs. H. M. Said, M.Pd',
    last_edited_role: 'Kepala Satuan Pendidikan',
    created_at: '2026-03-05T07:30:00.000Z',
    updated_at: '2026-03-20T14:15:00.000Z'
  },
  'ind-3.15.2': {
    id: 'eval-4',
    indikator_id: 'ind-3.15.2',
    capaian: 'Baik',
    skor: 3,
    catatan: 'Unit produksi Teaching Factory (TeFa) software house dan jaringan komputer telah berjalan terencana menghasilkan produk aplikasi kasir UMKM dan jasa instalasi jaringan fiber optic lokal.',
    bukti_urls: [
      'https://drive.google.com/drive/folders/tefa-smkit-ibnulqayyim-2025'
    ],
    bukti_checklist: {
      'bf3152-1': 'Dalam Proses'
    },
    status_verifikasi: 'Draf',
    verified_by: 'Ketua Program Keahlian',
    last_edited_by: 'Muh. Yusuf, S.T',
    last_edited_role: 'Kepala Laboratorium & Bengkel IT',
    created_at: '2026-03-08T09:00:00.000Z',
    updated_at: '2026-03-22T10:00:00.000Z'
  },
  'ind-4.16.1': {
    id: 'eval-5',
    indikator_id: 'ind-4.16.1',
    capaian: 'Sangat Baik',
    skor: 4,
    catatan: 'Sebanyak 92% murid kelas XII telah memiliki portofolio digital berbasis GitHub/Figma dan 88% telah tersertifikasi kompetensi resmi skema Junior Web Developer dari BNSP/LSP P1.',
    bukti_urls: [
      'https://drive.google.com/drive/folders/sertifikat-bnsp-siswa-2025'
    ],
    bukti_checklist: {
      'bf4161-1': 'Tersedia'
    },
    status_verifikasi: 'Terverifikasi Valid',
    verified_by: 'Tim Asesor Internal',
    last_edited_by: 'Ahmad Fadhil, S.Kom',
    last_edited_role: 'Ketua Tim Asesi / Guru Produktif RPL',
    created_at: '2026-03-10T11:00:00.000Z',
    updated_at: '2026-03-25T13:30:00.000Z'
  }
};

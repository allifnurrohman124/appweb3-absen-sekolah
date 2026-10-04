# Presensi — Sistem Aplikasi Web Absensi Sekolah Berbasis Mobile-First

Sistem aplikasi web absensi sekolah modern dengan pendekatan desain **human-crafted**, minimalis, dan fungsional. Didesain secara ketat untuk **menghindari gaya AI slop** (tanpa glow berlebihan, tanpa gradasi neon murahan, tanpa rounded-corner berlebihan, dan tanpa drop shadow tebal).

---

## 🎨 Karakteristik Desain (Anti-AI Slop)
- **Tipografi Bersih**: Menggunakan font Inter dengan tracking rapi, hierarki bobot proporsional (400, 500, 600, 700), dan angka monospaced untuk NISN serta jam presensi.
- **Palet Warna Netral & Tenang**:
  - Background: Off-white / slate halus (`#f8fafc`, `#ffffff`).
  - Teks: Dark charcoal berkejelasan tinggi (`#0f172a`, `#334155`).
  - Aksen Utama: Deep refined navy (`#0f172a`, `#1e293b`).
  - Indikator Status Fungsional:
    - **Hadir**: Emerald redup (`bg-emerald-50`, `text-emerald-800`, `border-emerald-200`)
    - **Izin**: Amber tenang (`bg-amber-50`, `text-amber-800`, `border-amber-200`)
    - **Sakit**: Sky tenang (`bg-sky-50`, `text-sky-800`, `border-sky-200`)
    - **Alpa**: Rose tenang (`bg-rose-50`, `text-rose-800`, `border-rose-200`)
- **Struktur Komponen**: Border presisi 1px (`border-slate-200`), bayangan sangat halus (`shadow-2xs` / `shadow-xs`), tata letak berbasis grid fungsional.
- **Mobile-First Experience**: Dilengkapi *sticky bottom thumb-navigation* untuk kemudahan akses satu jempol di layar smartphone.

---

## 👥 2 Peran & Hak Akses (Role-Based Access Control)

### 1. Admin Sekolah (Guru Piket / Operator)
- **Dashboard Ringkasan Harian**:
  - Metrik kartu: Total Siswa, Hadir Hari Ini (disertai persentase kehadiran), Izin, Sakit, Alpa/Belum Presensi.
  - Tabel aktivitas kehadiran langsung (*live feed*) hari ini dengan tombol penyesuaian status cepat.
- **Pemindai Barcode / QR Code Kamera**:
  - Mengakses kamera perangkat (kamera belakang/depan) untuk memindai QR code unik siswa secara instan.
  - Umpan balik visual jelas: Notifikasi hijau dengan nama siswa, kelas, NISN, dan jam catat.
  - Umpan balik audio: Nada *chime* harmonis sintetis melalui browser Web Audio API tanpa aset eksternal.
  - Pencegahan pemindaian ganda: Memberi tahu jika siswa sudah tercatat hadir pada hari yang sama.
  - Alternatif input manual & simulator tombol cepat untuk pengujian tanpa webcam.
- **Manajemen Data Siswa**:
  - Tabel daftar siswa dengan filter kelas dan pencarian real-time (nama / NISN).
  - Preview & cetak/unduh **Kartu Pelajar Digital** lengkap dengan QR Code siap cetak.
  - Fitur ubah status kehadiran manual (*Manual Override*) dengan alasan/keterangan & jam masuk.
  - Form pendaftaran siswa baru.
- **Laporan Kehadiran**:
  - Filter berdasarkan tanggal presensi, kelas, dan status kehadiran.
  - Ringkasan angka rekapitulasi.
  - Ekspor ke berkas **CSV (Excel Ready)** dengan format standar RFC4180 dan UTF-8 BOM.
  - Format cetak ramah kertas (`Print-Ready CSS`).

### 2. Murid
- **Dashboard Murid**:
  - Status presensi hari ini: Penanda apakah sudah absen masuk beserta jam dan keterangannya.
  - **Kartu Tanda Siswa Digital**: Dilengkapi kop sekolah, identitas lengkap siswa, dan QR Code dinamis berkualitas tinggi untuk dipindai petugas.
  - Tombol simpan/unduh QR Code (PNG) dan cetak kartu.
  - Metrik kehadiran bulan berjalan (% kehadiran, total hadir, izin, sakit, alpa).
- **Riwayat Kehadiran Pribadi**:
  - Filter periode bulanan.
  - Daftar kronologis presensi harian per tanggal, jam masuk, status kehadiran, dan catatan.

---

## 🔑 Kredensial Demo Cepat (Satu Pintu / Unified Login)

Aplikasi menyediakan tombol klik langsung di halaman login untuk beralih akun secara instan:

| Peran | ID / NISN | Kata Sandi | Keterangan |
| :--- | :--- | :--- | :--- |
| **Admin Sekolah** | `admin` | `admin` | Hendra Wijaya, S.Pd. (Guru Piket) |
| **Murid 1** | `0072819201` | `123` | Ahmad Fauzi (Kelas X-MIPA 1) |
| **Murid 2** | `0072819202` | `123` | Siti Nurhaliza (Kelas X-MIPA 1) |
| **Murid 3** | `0072819203` | `123` | Budi Santoso (Kelas X-MIPA 2) |

*(Semua murid lainnya dapat login menggunakan NISN masing-masing dengan kata sandi `123`)*

---

## 🚀 Cara Menjalankan Proyek Secara Lokal

1. Buka terminal di direktori proyek:
   ```bash
   cd C:\Users\lipp\.gemini\antigravity\scratch\absensi-sekolah
   ```

2. Jalankan server pengembang Vite:
   ```bash
   npm run dev
   ```

3. Buka URL yang ditampilkan (biasanya `http://localhost:5173`) di peramban (browser) laptop atau ponsel Anda.

---

## 🛠️ Tumpukan Teknologi
- **React 19**
- **Vite**
- **Tailwind CSS v4**
- **Lucide Icons**
- **Html5-Qrcode** (Pemindai kamera QR/Barcode berkinerja tinggi)
- **qrcode.react** (Pembangkit SVG/Canvas QR Code)
- **Web Audio API** (Sintesis audio feedback responsif)
- **HTML5 LocalStorage** (Persistensi data offline & tombol reset bawaan)

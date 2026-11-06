# Catatan Produk – Toko Fissa

Aplikasi web sederhana untuk mencatat produk. Semua kode (HTML, CSS, dan JavaScript) digabung dalam satu file: `index.html`.

## Fitur

- **Jam, hari, dan tanggal.** Jam berjalan per detik, lengkap dengan ucapan sesuai waktu dan zona waktu (WIB, WITA, atau WIT) yang mengikuti perangkat.
- **Tanggal hijriah.** Dihitung otomatis. Jika berbeda satu hari dengan penetapan resmi, gunakan tombol Koreksi hijriah (−1 hari, Sesuai, +1 hari).
- **Catatan produk.** Tambah, edit, dan hapus produk dengan gambar, nama, kategori, harga jual, harga modal (opsional), stok, dan catatan.
- **Stok cepat.** Tombol + dan − langsung di daftar. Stok 5 atau kurang diberi tanda Menipis, stok 0 diberi tanda Habis.
- **Ringkasan.** Jumlah produk, total stok, nilai stok (harga jual × stok), dan jumlah produk yang stoknya menipis.
- **Kategori.** Bisa ditambah, diganti nama, dan dihapus lewat Kelola kategori. Kategori yang masih punya produk tidak bisa dihapus.
- **Pencarian, filter, dan urutan** berdasarkan terbaru, nama, stok tersedikit, atau harga tertinggi.
- **Tampilan responsif** untuk HP dan komputer, serta mode gelap otomatis.

## Cara memakai

1. Ekstrak file zip ini (jangan dibuka langsung dari dalam zip).
2. Buka `index.html` dengan browser (Chrome, Edge, Firefox, atau Safari).
3. Klik **Tambah produk** untuk mulai mencatat.

Tidak perlu instalasi dan tidak perlu server.

## Penyimpanan data

Data disimpan di `localStorage` browser dengan kunci `catatan-v1`.

- Data hanya ada di browser dan perangkat yang dipakai. Membuka file di perangkat lain berarti mulai dari kosong.
- Menghapus data situs atau riwayat browser akan menghapus catatan.
- Gambar produk dikecilkan otomatis (sisi terpanjang 640 px) agar muat. Jika penyimpanan penuh, aplikasi menampilkan peringatan.
- Untuk akses dari banyak perangkat, dibutuhkan server dan database (misalnya Node.js atau PHP), yang belum termasuk di sini.

## Teknologi

- HTML5, CSS3 (grid, flexbox, variabel CSS), dan JavaScript murni tanpa framework.
- Tanggal hijriah memakai `Intl.DateTimeFormat` dengan kalender `islamic-umalqura`.
- Font Plus Jakarta Sans dari Google Fonts. Jika offline, aplikasi memakai font bawaan perangkat dan tetap berfungsi.

## Mengubah isi

Semua pengaturan ada di `index.html`:

- **Warna dan tampilan:** bagian `<style>`, variabel di `:root` (misalnya `--br` untuk warna utama dan `--acc` untuk aksen).
- **Nama toko:** cari teks `Toko Fissa` dan `Catatan Produk` di bagian atas file.
- **Batas stok menipis:** cari `<=5` di bagian `<script>` dan ganti angkanya.
- **Produk contoh:** fungsi `seed()` di bagian `<script>`. Ubah atau kosongkan daftarnya sebelum data pertama tersimpan.

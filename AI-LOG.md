# AI-LOG

## W1–W4: Form tambah, daftar, hapus, dan simpan data persisten
- Prompt: Minta AI membuat aplikasi HTML/CSS/JS dipisah sesuai dokumen ETS untuk persona 3 (Pedagang kecil). Fokuskan kode untuk menangani W1 sampai W4 terlebih dahulu (tambah, tampil daftar, hapus, dan simpan `localStorage`).
- Dipakai: Kerangka `index.html`, `style.css` utuh, dan bagian logika `simpanData()`, `muatData()`, `buatItem()`, `renderDaftar()`, `hapusTransaksi()` di `app.js`.
- Diubah: Mengganti judul aplikasi menjadi "KasKuETS". Saya menghapus dulu kode AI yang menangani W5 (Ringkasan), W6 (Validasi), Fitur Khas, dan Bonus. Saya menyisakan murni fungsi manipulasi form, interaksi array `state.transaksi`, dan API `localStorage` agar alur penyimpanan datanya berjalan lancar tanpa terdistraksi bug dari fitur lain.
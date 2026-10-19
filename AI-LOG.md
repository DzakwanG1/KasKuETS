# AI-LOG

## W1–W4: Form tambah, daftar, hapus, dan simpan data persisten
- Prompt: Minta AI membuat aplikasi HTML/CSS/JS dipisah sesuai dokumen ETS untuk persona 3 (Pedagang kecil). Fokuskan kode untuk menangani W1 sampai W4 terlebih dahulu (tambah, tampil daftar, hapus, dan simpan `localStorage`).
- Dipakai: Kerangka `index.html`, `style.css` utuh, dan bagian logika `simpanData()`, `muatData()`, `buatItem()`, `renderDaftar()`, `hapusTransaksi()` di `app.js`.
- Diubah: Mengganti judul aplikasi menjadi "KasKuETS". Saya menghapus dulu kode AI yang menangani W5 (Ringkasan), W6 (Validasi), Fitur Khas, dan Bonus. Saya menyisakan murni fungsi manipulasi form, interaksi array `state.transaksi`, dan API `localStorage` agar alur penyimpanan datanya berjalan lancar tanpa terdistraksi bug dari fitur lain.

## W5–W6: Ringkasan saldo, Validasi, dan Fitur Khas Persona
- Prompt: Lanjutkan kode sebelumnya. Tambahkan validasi pada form transaksi agar tidak bisa input nominal kosong/minus (W6) dan buat bagian Ringkasan saldo yang otomatis update dari array transaksi (W5). Serta, implementasikan fitur khas: pemisahan dompet, pencatatan pindah dana, dan perhitungan untung usaha.
- Dipakai: Kerangka HTML dari `section` ringkasan dan pindah dompet, serta logika JS `hitungRingkasan()`, `saldoDompet()`, `cekTransaksi()`, dan event listener form pindah.
- Diubah: Agar kode lebih modular, saya mengubah sendiri logika `buatItem()` yang ada di tahap sebelumnya dengan menambahkan `if (t.jenis === "pindah")` agar riwayat transaksi bisa menampilkan gaya label berbeda khusus untuk perpindahan dompet, dan menyesuaikan properti object JS.
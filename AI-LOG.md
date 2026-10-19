# AI-LOG

## W1–W4: Form tambah, daftar, hapus, dan simpan data persisten
- Prompt: Pandu saya membuat aplikasi untuk Pedagang kecil yang uang pribadi dan uang usaha tercampur sehingga keuntungan tidak jelas. Fokuskan untuk menangani W1 sampai W4 terlebih dahulu (tambah, tampil daftar, hapus, dan simpan `localStorage`).
- Dipakai: Kerangka `index.html`, `style.css` utuh, dan bagian logika `simpanData()`, `muatData()`, `buatItem()`, `renderDaftar()`, `hapusTransaksi()` di `app.js`.
- Diubah: Mengganti judul aplikasi menjadi "KasKuETS".

## W5–W6: Ringkasan saldo, Validasi, dan Fitur Khas Persona
- Prompt: Pandu saya untuk menambahkan validasi pada form transaksi agar tidak bisa input nominal kosong/minus (W6) dan buat bagian Ringkasan saldo yang otomatis update dari array transaksi (W5). Serta, implementasikan fitur khas: pemisahan dompet, pencatatan pindah dana, dan perhitungan untung usaha.
- Dipakai: Kerangka HTML dari `section` ringkasan dan pindah dompet, serta logika JS `hitungRingkasan()`, `saldoDompet()`, `cekTransaksi()`, dan event listener form pindah.
- Diubah: Saya mengubah logika `buatItem()` yang ada di tahap sebelumnya dengan menambahkan `if (t.jenis === "pindah")` agar riwayat transaksi bisa menampilkan gaya label berbeda khusus untuk perpindahan dompet, dan menyesuaikan properti object JS.

## Bonus: Filter, Pencarian, dan Edit Transaksi
- Prompt: Pandu saya untuk mengerjakan fitur bonus: 1) Edit transaksi yang sudah tersimpan, dan 2) Filter/Pencarian list transaksi berdasarkan kategori, dompet, dan teks.
- Dipakai: Penambahan properti `filter` dan `editId` ke dalam object `state`, implementasi logika `.filter()` dan `.sort()` pada fungsi `ambilTampil()`, serta fungsi pembantu `mulaiUbah()`, `batalUbah()`, dan `renderFormMode()`.
- Diubah: Menyederhanakan penanganan *event listener* pada fitur *search*. Awalnya saya sedikit bingung dengan *event* "input" pada kotak *search* yang langsung jalan tanpa ditekan tombol *submit*, namun setelah melihat panduan AI, hal ini saya terapkan utuh di `app.js` karena UX-nya lebih bagus (tampilan daftar langsung berubah seketika saat user mengetik huruf per huruf).
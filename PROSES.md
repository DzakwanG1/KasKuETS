# PROSES

## Persona dan masalahnya
Saya mendapatkan persona 3 yaitu "Pedagang kecil". Masalah utama yang dihadapi pedagang kecil ini adalah uang untuk kebutuhan pribadi dan uang hasil/modal usaha yang seringkali disimpan di dompet yang sama (tercampur). Dampaknya, ia kesulitan mengetahui berapa keuntungan bersih dari usahanya, dan berisiko tanpa sadar menggunakan uang modal untuk belanja kebutuhan pribadi sehari-hari.

## Rancangan struktur data
Data disimpan di localStorage dengan kunci `KasKuETS:transaksi`, berupa array objek yang ditangani memakai `JSON.stringify` dan `JSON.parse`.

```js
{
  id: 1739251200000,       
  tanggal: "2026-10-19",
  jenis: "pemasukan",         
  dompet: "Usaha",            
  kategori: "Penjualan",
  nominal: 500000,       
  catatan: "Jual sayur"
}
## Satu keputusan desain dan alasannya
Saya memilih untuk mencatat aktivitas "pindah dana" sebagai satu transaksi saja dengan jenis "pindah". Saya tidak mencatatnya sebagai dua transaksi, yaitu satu pengeluaran dari dompet A, dan satu pemasukan ke dompet B.

Alasannya, memindahkan uang dari dompet Usaha ke Pribadi bukan pemasukan baru. Ini hanya perpindahan fisik. Jika dicatat sebagai dua transaksi, Ringkasan Pemasukan dan Pengeluaran bulanan akan tampak lebih besar dari aslinya. Dengan mencatatnya sebagai satu status "pindah", perhitungan saldo total dompet jadi lebih jelas tanpa mengubah riwayat omzet.

## Bug/Kendala dan Cara Mengatasinya
Halaman terus memuat ulang saat form dikirim. Saat mengetes form HTML bawaan, menekan submit langsung memuat ulang halaman. Akibatnya, data di memori terhapus sebelum bisa masuk ke localStorage. Cara mengatasinya, tambahkan event.preventDefault() di awal eksekusi event listener submit.

Data localStorage gagal dimuat saat pertama kali buka web. Awalnya, JSON.parse() melempar error karena localStorage.getItem() mengembalikan nilai null saat belum ada data sama sekali. Cara mengatasinya: Tambahkan pengecekan if (teks === null) return []; sebelum memanggil JSON.parse().

Pindah dana bisa menginput nominal negatif atau melebihi saldo. Pada awalnya, pengguna bisa mengelabui sistem dengan menginput nominal pindah dana yang minus atau memindahkan dana yang tidak ada. Cara mengatasinya, saya membuat fungsi cekPindah() yang mengecek apakah item.nominal lebih besar dari saldoAsal dan mengecek item.nominal kurang dari 0. Fungsi ini mengembalikan nilai pesan error yang langsung muncul di .pesan DOM.
# PROSES

## Persona dan masalahnya
Saya mendapatkan persona 3 yaitu "Pedagang kecil". Masalah utama yang dihadapi pedagang kecil ini adalah uang untuk kebutuhan pribadi dan uang hasil/modal usaha yang seringkali disimpan di dompet yang sama (tercampur). Dampaknya, ia kesulitan mengetahui berapa keuntungan bersih dari usahanya, dan berisiko tanpa sadar menggunakan uang modal untuk belanja kebutuhan pribadi sehari-hari.

## Rancangan struktur data
Data disimpan di localStorage dengan kunci `KasKuETS:transaksi`, berupa array objek yang ditangani memakai `JSON.stringify` dan `JSON.parse`.

```js
{
  id: 1739251200000,          // angka unik dari Date.now()
  tanggal: "2026-10-19",
  jenis: "pemasukan",         // "pemasukan" | "pengeluaran" 
  dompet: "Usaha",            // "Pribadi" | "Usaha"
  kategori: "Penjualan",
  nominal: 500000,            // Angka murni
  catatan: "Jual sayur"
}
const KUNCI_PENYIMPANAN = "KasKuETS:transaksi";
const MAKS_CATATAN = 100;
const KATEGORI = ["Penjualan", "Belanja stok", "Operasional", "Makan", "Transport", "Lainnya"];
const DOMPET = ["Pribadi", "Usaha"];

const formTransaksi  = document.querySelector("#form-transaksi");
const judulForm      = document.querySelector("#judul-form");
const inputTanggal   = document.querySelector("#tanggal");
const pilihDompet    = document.querySelector("#dompet");
const pilihKategori  = document.querySelector("#kategori");
const inputNominal   = document.querySelector("#nominal");
const inputCatatan   = document.querySelector("#catatan");
const pesanForm      = document.querySelector("#pesan-form");
const tombolSimpan   = document.querySelector("#tombol-simpan");
const tombolBatal    = document.querySelector("#tombol-batal");

const daftarEl       = document.querySelector("#daftar");
const kosongEl       = document.querySelector("#kosong");
const infoHasil      = document.querySelector("#info-hasil");

const elTotalMasuk   = document.querySelector("#total-masuk");
const elTotalKeluar  = document.querySelector("#total-keluar");
const elSaldoTotal   = document.querySelector("#saldo-total");
const elSaldoPribadi = document.querySelector("#saldo-pribadi");
const elSaldoUsaha   = document.querySelector("#saldo-usaha");
const elUntungUsaha  = document.querySelector("#untung-usaha");

const formPindah     = document.querySelector("#form-pindah");
const pindahDari     = document.querySelector("#pindah-dari");
const pindahKe       = document.querySelector("#pindah-ke");
const pindahTanggal  = document.querySelector("#pindah-tanggal");
const pindahNominal  = document.querySelector("#pindah-nominal");
const pindahCatatan  = document.querySelector("#pindah-catatan");
const pesanPindah    = document.querySelector("#pesan-pindah");

const filterJenis    = document.querySelector("#filter-jenis");
const filterKategori = document.querySelector("#filter-kategori");
const filterDompet   = document.querySelector("#filter-dompet");
const inputCari      = document.querySelector("#cari");

let state = {
  transaksi: [],
  filter: { jenis: "semua", kategori: "semua", dompet: "semua", kata: "" },
  editId: null
};

function hariIni() {
  const sekarang = new Date();
  const bulan = String(sekarang.getMonth() + 1).padStart(2, "0");
  const hari = String(sekarang.getDate()).padStart(2, "0");
  return `${sekarang.getFullYear()}-${bulan}-${hari}`;
}

function formatRupiah(angka) {
  return `Rp ${angka.toLocaleString("id-ID")}`;
}

function formatTanggal(iso) {
  const bagian = iso.split("-");
  return `${bagian[2]}/${bagian[1]}/${bagian[0]}`;
}

function buatSel(tag, teks, kelas) {
  const elemen = document.createElement(tag);
  elemen.textContent = teks;
  if (kelas) elemen.className = kelas;
  return elemen;
}

function tampilkanPesan(elemen, teks, jenis) {
  elemen.textContent = teks;
  elemen.className = `pesan ${jenis}`;
}

function simpanData() {
  try {
    localStorage.setItem(KUNCI_PENYIMPANAN, JSON.stringify(state.transaksi));
    return true;
  } catch (error) {
    return false;
  }
}

function transaksiValid(t) {
  if (typeof t !== "object" || t === null) return false;
  const jenisSah = t.jenis === "pemasukan" || t.jenis === "pengeluaran" || t.jenis === "pindah";
  return (
    jenisSah &&
    typeof t.id === "number" &&
    typeof t.tanggal === "string" && t.tanggal !== "" &&
    typeof t.nominal === "number" && t.nominal > 0 &&
    DOMPET.some(d => d === t.dompet) &&
    (t.jenis === "pindah" ? DOMPET.some(d => d === t.dompetTujuan) : KATEGORI.some(k => k === t.kategori))
  );
}

function muatData() {
  try {
    const teks = localStorage.getItem(KUNCI_PENYIMPANAN);
    if (teks === null) return [];
    const data = JSON.parse(teks);
    if (!Array.isArray(data)) return [];
    return data.filter(transaksiValid);
  } catch (error) {
    return [];
  }
}

function perbarui() {
  const berhasil = simpanData();
  render(state);
  return berhasil;
}

function jumlahkan(daftar) {
  return daftar.reduce((total, t) => total + t.nominal, 0);
}

function hitungRingkasan(daftar) {
  const masuk = jumlahkan(daftar.filter(t => t.jenis === "pemasukan"));
  const keluar = jumlahkan(daftar.filter(t => t.jenis === "pengeluaran"));
  return { masuk, keluar, saldo: masuk - keluar };
}

function saldoDompet(daftar, dompet) {
  let saldo = 0;
  for (const t of daftar) {
    if (t.jenis === "pemasukan" && t.dompet === dompet) saldo += t.nominal;
    if (t.jenis === "pengeluaran" && t.dompet === dompet) saldo -= t.nominal;
    if (t.jenis === "pindah") {
      if (t.dompet === dompet) saldo -= t.nominal;
      if (t.dompetTujuan === dompet) saldo += t.nominal;
    }
  }
  return saldo;
}

function hitungUntungUsaha(daftar) {
  const masuk = jumlahkan(daftar.filter(t => t.jenis === "pemasukan" && t.dompet === "Usaha"));
  const keluar = jumlahkan(daftar.filter(t => t.jenis === "pengeluaran" && t.dompet === "Usaha"));
  return masuk - keluar;
}

function isiAngka(elemen, angka) {
  elemen.textContent = formatRupiah(angka);
  elemen.className = angka < 0 ? "angka negatif" : "angka";
}

function renderRingkasan(daftar) {
  const r = hitungRingkasan(daftar);
  isiAngka(elTotalMasuk, r.masuk);
  isiAngka(elTotalKeluar, r.keluar);
  isiAngka(elSaldoTotal, r.saldo);
  isiAngka(elSaldoPribadi, saldoDompet(daftar, "Pribadi"));
  isiAngka(elSaldoUsaha, saldoDompet(daftar, "Usaha"));
  isiAngka(elUntungUsaha, hitungUntungUsaha(daftar));
}

function cekTransaksi(item) {
  if (item.tanggal === "") return "Tanggal wajib diisi.";
  if (!DOMPET.some(d => d === item.dompet)) return "Pilih dompet Pribadi atau Usaha.";
  if (item.kategori === "") return "Pilih kategori.";
  if (!item.nominal || item.nominal < 0 || item.nominal % 1 !== 0) return "Nominal harus bilangan bulat > 0.";
  if (item.catatan.length > MAKS_CATATAN) return `Catatan maks ${MAKS_CATATAN} karakter.`;
  return "";
}

function cekPindah(item, daftar) {
  if (item.tanggal === "") return "Tanggal wajib diisi.";
  if (item.dompet === item.dompetTujuan) return "Dompet asal & tujuan harus berbeda.";
  if (!item.nominal || item.nominal < 0 || item.nominal % 1 !== 0) return "Nominal bulat > 0.";
  
  const saldoAsal = saldoDompet(daftar, item.dompet);
  if (item.nominal > saldoAsal) {
    return `Saldo dompet ${item.dompet} tidak cukup (tersisa ${formatRupiah(saldoAsal)}).`;
  }
  return "";
}

function ambilTampil(data) {
  const kata = data.filter.kata.trim().toLowerCase();
  return data.transaksi
    .filter(t => {
      if (data.filter.jenis !== "semua" && t.jenis !== data.filter.jenis) return false;
      if (data.filter.kategori !== "semua" && t.kategori !== data.filter.kategori) return false;
      if (data.filter.dompet !== "semua" && t.dompet !== data.filter.dompet && t.dompetTujuan !== data.filter.dompet) return false;
      if (kata !== "" && !(t.catatan.toLowerCase().includes(kata) || t.kategori.toLowerCase().includes(kata))) return false;
      return true;
    })
    .sort((a, b) => b.tanggal.localeCompare(a.tanggal) || b.id - a.id);
}

function buatItem(t) {
  const item = document.createElement("li");
  item.className = `item ${t.jenis}`;

  const info = document.createElement("div");
  info.className = "item-info";
  if (t.jenis === "pindah") {
    info.appendChild(buatSel("strong", `Pindah dana: ${t.dompet} → ${t.dompetTujuan}`));
    info.appendChild(buatSel("span", t.catatan !== "" ? `${formatTanggal(t.tanggal)} · ${t.catatan}` : formatTanggal(t.tanggal), "meta"));
  } else {
    info.appendChild(buatSel("strong", t.catatan !== "" ? t.catatan : t.kategori));
    info.appendChild(buatSel("span", `${formatTanggal(t.tanggal)} · ${t.kategori} · ${t.dompet}`, "meta"));
  }
  item.appendChild(info);
  item.appendChild(buatSel("p", formatRupiah(t.nominal), `nominal ${t.jenis}`));

  const aksi = document.createElement("div");
  aksi.className = "item-aksi";

  if (t.jenis !== "pindah") {
    const tombolUbah = buatSel("button", "Ubah", "tombol-kecil");
    tombolUbah.type = "button";
    tombolUbah.addEventListener("click", () => mulaiUbah(t));
    aksi.appendChild(tombolUbah);
  }

  const tombolHapus = buatSel("button", "Hapus", "tombol-kecil hapus");
  tombolHapus.type = "button";
  tombolHapus.addEventListener("click", () => hapusTransaksi(t.id));
  aksi.appendChild(tombolHapus);

  item.appendChild(aksi);
  return item;
}

function renderDaftar(data) {
  const tampil = ambilTampil(data);
  daftarEl.innerHTML = "";
  for (const t of tampil) {
    daftarEl.appendChild(buatItem(t));
  }
  
  if (tampil.length === 0) {
    kosongEl.textContent = data.transaksi.length === 0
      ? "Belum ada transaksi. Isi formulir di atas untuk mulai mencatat."
      : "Tidak ada transaksi yang cocok dengan filter atau pencarian.";
  }
  kosongEl.hidden = tampil.length > 0;
  infoHasil.textContent = `Menampilkan ${tampil.length} dari ${data.transaksi.length} transaksi.`;
}

function hapusTransaksi(id) {
  if (!confirm("Hapus transaksi ini?")) return;
  state.transaksi = state.transaksi.filter(t => t.id !== id);
  if (state.editId === id) batalUbah();
  perbarui();
}

function mulaiUbah(t) {
  state.editId = t.id;
  inputTanggal.value = t.tanggal;
  document.querySelector(`input[name="jenis"][value="${t.jenis}"]`).checked = true;
  pilihDompet.value = t.dompet;
  pilihKategori.value = t.kategori;
  inputNominal.value = t.nominal;
  inputCatatan.value = t.catatan;
  pesanForm.textContent = "";
  renderFormMode(state);
  inputNominal.focus();
}

function batalUbah() {
  state.editId = null;
  formTransaksi.reset();
  inputTanggal.value = hariIni();
  pesanForm.textContent = "";
  renderFormMode(state);
}

function renderFormMode(data) {
  const modeUbah = data.editId !== null;
  judulForm.textContent = modeUbah ? "Ubah transaksi" : "Catat transaksi";
  tombolSimpan.textContent = modeUbah ? "Simpan perubahan" : "Simpan transaksi";
  tombolBatal.hidden = !modeUbah;
}

function render(data) {
  renderDaftar(data);
  renderRingkasan(data.transaksi);
  renderFormMode(data);
}

formTransaksi.addEventListener("submit", (event) => {
  event.preventDefault();
  const modeUbah = state.editId !== null;

  const item = {
    id: modeUbah ? state.editId : Date.now(),
    tanggal: inputTanggal.value,
    jenis: document.querySelector('input[name="jenis"]:checked').value,
    dompet: pilihDompet.value,
    kategori: pilihKategori.value,
    nominal: Number(inputNominal.value),
    catatan: inputCatatan.value.trim()
  };

  const galat = cekTransaksi(item);
  if (galat !== "") {
    tampilkanPesan(pesanForm, galat, "galat");
    return;
  }

  if (modeUbah) {
    state.transaksi = state.transaksi.map(t => (t.id === state.editId ? item : t));
  } else {
    state.transaksi.push(item);
  }

  state.editId = null;
  const tersimpan = perbarui();

  formTransaksi.reset();
  inputTanggal.value = hariIni();

  if (tersimpan) {
    tampilkanPesan(pesanForm, modeUbah ? "Perubahan disimpan." : "Transaksi disimpan.", "sukses");
  } else {
    tampilkanPesan(pesanForm, "Browser tidak bisa menyimpan permanen.", "galat");
  }
});

tombolBatal.addEventListener("click", () => {
  batalUbah();
  render(state);
});

formPindah.addEventListener("submit", (event) => {
  event.preventDefault();

  const item = {
    id: Date.now(),
    tanggal: pindahTanggal.value,
    jenis: "pindah",
    dompet: pindahDari.value,
    dompetTujuan: pindahKe.value,
    kategori: "Pindah dana",
    nominal: Number(pindahNominal.value),
    catatan: pindahCatatan.value.trim()
  };

  const galat = cekPindah(item, state.transaksi);
  if (galat !== "") {
    tampilkanPesan(pesanPindah, galat, "galat");
    return;
  }

  state.transaksi.push(item);
  const tersimpan = perbarui();
  
  formPindah.reset();
  pindahTanggal.value = hariIni();
  pindahKe.value = DOMPET[1]; 
  tampilkanPesan(pesanPindah, "Dana berhasil dipindahkan.", "sukses");
});

filterJenis.addEventListener("change", (event) => { state.filter.jenis = event.target.value; render(state); });
filterKategori.addEventListener("change", (event) => { state.filter.kategori = event.target.value; render(state); });
filterDompet.addEventListener("change", (event) => { state.filter.dompet = event.target.value; render(state); });
inputCari.addEventListener("input", (event) => { state.filter.kata = event.target.value; render(state); });

function isiPilihan(selectEl, daftar, awal) {
  if (awal) {
    const opsiAwal = document.createElement("option");
    opsiAwal.value = awal.nilai;
    opsiAwal.textContent = awal.teks;
    selectEl.appendChild(opsiAwal);
  }
  for (const nama of daftar) {
    const opsi = document.createElement("option");
    opsi.value = nama;
    opsi.textContent = nama;
    selectEl.appendChild(opsi);
  }
}

function mulai() {
  isiPilihan(pilihKategori, KATEGORI, { nilai: "", teks: "— Pilih kategori —" });
  isiPilihan(pilihDompet, DOMPET);
  isiPilihan(pindahDari, DOMPET);
  isiPilihan(pindahKe, DOMPET);
  pindahKe.value = DOMPET[1];

  isiPilihan(filterKategori, KATEGORI, { nilai: "semua", teks: "Semua" });
  isiPilihan(filterDompet, DOMPET, { nilai: "semua", teks: "Semua" });

  inputTanggal.value = hariIni();
  pindahTanggal.value = hariIni();
  
  state.transaksi = muatData();
  render(state);
}

mulai();
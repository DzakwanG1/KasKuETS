const KUNCI_PENYIMPANAN = "KasKuETS:transaksi";
const KATEGORI = ["Penjualan", "Belanja stok", "Operasional", "Makan", "Transport", "Lainnya"];
const DOMPET = ["Pribadi", "Usaha"];

const formTransaksi  = document.querySelector("#form-transaksi");
const inputTanggal   = document.querySelector("#tanggal");
const pilihDompet    = document.querySelector("#dompet");
const pilihKategori  = document.querySelector("#kategori");
const inputNominal   = document.querySelector("#nominal");
const inputCatatan   = document.querySelector("#catatan");
const pesanForm      = document.querySelector("#pesan-form");
const daftarEl       = document.querySelector("#daftar");
const kosongEl       = document.querySelector("#kosong");
const infoHasil      = document.querySelector("#info-hasil");

let state = {
  transaksi: []
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

/* ---------- W4: Data Persisten ---------- */
function simpanData() {
  try {
    localStorage.setItem(KUNCI_PENYIMPANAN, JSON.stringify(state.transaksi));
    return true;
  } catch (error) {
    console.warn("Gagal menyimpan:", error);
    return false;
  }
}

function transaksiValid(t) {
  if (typeof t !== "object" || t === null) return false;
  const jenisSah = t.jenis === "pemasukan" || t.jenis === "pengeluaran";
  return (
    jenisSah &&
    typeof t.id === "number" &&
    typeof t.tanggal === "string" && t.tanggal !== "" &&
    typeof t.nominal === "number" && t.nominal > 0 &&
    typeof t.catatan === "string" &&
    typeof t.kategori === "string" &&
    DOMPET.some(d => d === t.dompet) &&
    KATEGORI.some(k => k === t.kategori)
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
    console.warn("Data tersimpan rusak, memulai dari kosong:", error);
    return [];
  }
}

function perbarui() {
  const berhasil = simpanData();
  render(state);
  return berhasil;
}

/* ---------- W2: Daftar Transaksi ---------- */
function ambilTampil(data) {
  // Hanya sorting, belum ada filter di Batch 1
  return data.transaksi.sort((a, b) => b.tanggal.localeCompare(a.tanggal) || b.id - a.id);
}

function buatItem(t) {
  const item = document.createElement("li");
  item.className = `item ${t.jenis}`;

  const info = document.createElement("div");
  info.className = "item-info";
  info.appendChild(buatSel("strong", t.catatan !== "" ? t.catatan : t.kategori));
  info.appendChild(buatSel("span", `${formatTanggal(t.tanggal)} · ${t.kategori} · ${t.dompet}`, "meta"));
  item.appendChild(info);

  item.appendChild(buatSel("p", formatRupiah(t.nominal), `nominal ${t.jenis}`));

  const aksi = document.createElement("div");
  aksi.className = "item-aksi";

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
    kosongEl.textContent = "Belum ada transaksi. Isi formulir di atas untuk mulai mencatat.";
  }
  kosongEl.hidden = tampil.length > 0;
  infoHasil.textContent = `Menampilkan ${tampil.length} dari ${data.transaksi.length} transaksi.`;
}

/* ---------- W3: Hapus Transaksi ---------- */
function hapusTransaksi(id) {
  if (!confirm("Hapus transaksi ini?")) return;
  state.transaksi = state.transaksi.filter(t => t.id !== id);
  perbarui();
}

/* ---------- Render Utama ---------- */
function render(data) {
  renderDaftar(data);
}

/* ---------- Event & Mulai ---------- */
formTransaksi.addEventListener("submit", (event) => {
  event.preventDefault();

  const item = {
    id: Date.now(),
    tanggal: inputTanggal.value,
    jenis: document.querySelector('input[name="jenis"]:checked').value,
    dompet: pilihDompet.value,
    kategori: pilihKategori.value,
    nominal: Number(inputNominal.value),
    catatan: inputCatatan.value.trim()
  };

  state.transaksi.push(item);
  const tersimpan = perbarui();

  formTransaksi.reset();
  inputTanggal.value = hariIni();

  if (tersimpan) {
    tampilkanPesan(pesanForm, "Transaksi disimpan.", "sukses");
  } else {
    tampilkanPesan(pesanForm, "Tercatat, tetapi browser ini tidak bisa menyimpannya permanen.", "galat");
  }
});

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
  inputTanggal.value = hariIni();
  state.transaksi = muatData();
  render(state);
}

mulai();
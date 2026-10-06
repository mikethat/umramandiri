# UmraMandiri

Website statis (HTML, CSS, JavaScript) tanpa proses build. Siap di-deploy ke GitHub dan Vercel.

## Struktur
- `index.html` halaman utama
- `css/styles.css` tampilan
- `js/quiz.js` Peta Kesiapan Umroh dan animasi
- `js/calculator.js` kalkulator biaya, pengaturan tarif ada di bagian `CFG` paling atas
- `data/hotels.js` tarif hotel 1448H (SAR per kamar per malam, fullboard)
- `vercel.json`, `favicon.svg`

## Deploy
1. Buat repository baru di GitHub, lalu upload seluruh isi folder ini (atau `git init`, `git add .`, `git commit`, `git push`).
2. Buka vercel.com, pilih **Add New > Project**, impor repository tersebut.
3. Framework Preset: **Other**. Kosongkan Build Command dan Output Directory, lalu **Deploy**.
4. Domain sendiri: Project Settings > Domains.

## Yang perlu diperbarui rutin
- `CFG.kurs` di `js/calculator.js` (kurs 1 SAR ke Rupiah).
- `CFG.visa`, `tiket`, `handling`, `transport`, `muthawif` (saat ini angka contoh).
- `CFG.fee` jika ingin menambahkan biaya layanan per kamar per malam (SAR).
- Menambah hotel: salin satu blok di `data/hotels.js`. Tanggal ditulis YYMMDD, akhir periode tidak termasuk.

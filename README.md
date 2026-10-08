# UmraMandiri

Website statis (HTML, CSS, JavaScript) tanpa proses build. Siap di-deploy ke GitHub dan Vercel.

## Struktur
- `index.html` halaman utama
- `ebook.html` halaman ebook (lead magnet gratis dan daftar tunggu ebook berbayar); formulir diatur di `js/lead.js`
- `marketplace.html` halaman pemesanan layanan (tambahkan `logo.png` di folder utama; jika belum ada, tampil teks nama)
- `css/styles.css` tampilan
- `js/quiz.js` Peta Kesiapan Umroh dan animasi
- `kalkulator.html` kalkulator budget bertahap (10 langkah), logikanya di `js/kalkulator.js`
- `data/data.js` SATU SUMBER DATA: kurs, harga non-hotel, dan tarif hotel 1448H. Dipakai oleh marketplace, kalkulator, dan beranda
- `vercel.json`, `favicon.svg`

## Deploy
1. Buat repository baru di GitHub, lalu upload seluruh isi folder ini (atau `git init`, `git add .`, `git commit`, `git push`).
2. Buka vercel.com, pilih **Add New > Project**, impor repository tersebut.
3. Framework Preset: **Other**. Kosongkan Build Command dan Output Directory, lalu **Deploy**.
4. Domain sendiri: Project Settings > Domains.

## Yang perlu diperbarui rutin
Semua angka ada di satu file: `data/data.js`.
- Kurs: `RATE` dan `RATE_DATE`.
- Harga non-hotel: objek `PRICE` (tiket, visa, Hiace, muthawwif, handling).
- Tarif hotel: blok `HOTELS`. Format `Nama|bintang|ddmm-ddmm:double/triple/quad;...`. Menambah hotel: salin satu baris.
- Nomor WhatsApp: `WA` (nomor di tautan tombol pada file HTML dan di `js/lead.js` masih perlu diganti manual).

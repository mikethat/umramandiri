# UmraMandiri

Website statis (HTML, CSS, JavaScript) tanpa proses build. Siap di-deploy ke GitHub dan Vercel.

## Struktur
- `index.html` halaman utama
- `css/styles.css` tampilan
- `js/quiz.js` Peta Kesiapan Umroh dan animasi
- `kalkulator.html` kalkulator budget bertahap (10 langkah), logikanya di `js/kalkulator.js`
- `data/data.js` SATU SUMBER DATA untuk kalkulator: kurs, harga non-hotel, dan tarif hotel 1448H
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
- Nomor WhatsApp: `WA` (nomor di tautan tombol pada file HTML masih perlu diganti manual).

## Foto profil
Letakkan foto Anda di `assets/img/miqdad.jpg` (rasio 4:5, sisi panjang minimal 1000 px). Jika file belum ada, bagian profil menampilkan monogram MI secara otomatis.

## Marketplace
Marketplace sudah dipisah dari situs ini dan di-deploy sebagai proyek terpisah dengan domain sendiri. Situs ini sengaja tidak memuat tautan apa pun ke marketplace.

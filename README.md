# Project Based 1 API [Kelompok 5]
Pengembangan Aplikasi Berbasis API dari Hasil Praktikum

## Cara Pake
Karena ini interaksi antar-API, kita cuma perlu buka **dua terminal** ajh;
1. **Terminal Pertama (Server):**
   Buka terminal VSCODE dan pastikan sudah buka folder Project_Based_API_Kelompok_5 yang ini, terus ketik:
   ```bash
   node serverbuku.js
   ```
   *Kasi biar terminal ini terbuka.*

2. **Terminal Kedua (Client/Testing):**
   Buka terminal baru lagi di folder sama, terus ketik:
   ```bash
   node client.js
   ```
   *Nanti di sini bakal keliatan hasil pemanggilan API kita ke server.*


## Info Info Info (Biar Semua Paham)
**1. Ada berapa endpoint di API kita?**
Ada **5 endpoint** dengan operasi CRUD lengkap:
- `GET /buku` (Lihat semua buku)
- `POST /buku` (Tambah buku baru)
- `GET /buku/:id` (Lihat detail buku + *bonus data Penulisnya dari Open Library API*)
- `PUT /buku/:id` (Ubah data buku)
- `DELETE /buku/:id` (Hapus buku)

**2. Apakah ada penyimpanan datanyaa?**
Kita pake **File JSON** di `data/buku.json`. Terus pake module bawaan `fs/promises`. Jadi kalo misalnya server mati, data buku yang ditambah atau dihapus masi tetap tersimpan. Kita tidak pake MongoDB ya :]

**3. Posisi module `fs/promises` itu di mana dan bwat apa?**
Di `serverbuku.js` kita pake *promise* di dua tempat:
* Di baris atas: `const fs = require('fs/promises');`.
* Di fungsi `bacaBody()`: Kita bikin `new Promise(...)` manual buat ambil kiriman data dari user.
Promise ada supaya server kita tidak lag/freeze waktu lagi proses baca file atau terima data. Server di situ bisa nyambi kerja tugasnya yg lain.

**4. Kapan Integrasi API Publik ini terpakai...?**
Pas ada user yang minta detail buku (`GET /buku/:id`). Nanti server cek judul bukunya dulu, terus pergi ke **Open Library API** buat cari kira-kira siapa penulisnya. 

**5. Ada berapa pengujian atau test case?**
Di dalam file `client.js` sudah ada **4 skenario** (termasuk tes integrasi Public API dan error tanpa menampilkan stack trace).


## NEXT STEP
**Bikin Tabel Pengujian dari Postman** 
Di instruksi minta kita tes manual di Postman. Nah karena kita ada 5 endpoint, jadi harusnya kita bikin **10 test case di Postman** (1 sukses dan 1 gagal untuk masing-masing endpoint) terus hasilnya taro di tabel pas buat laporan.

Rencana Status Code di Postman nanti:
| Endpoint | Method | Skenario Berhasil (Status Code) | Skenario Gagal (Status Code) |
| :--- | :---: | :--- | :--- |
| `/buku` | **GET** | `200 OK`  | `405 Method Not Allowed` |
| `/buku` | **POST** | `201 Created`  | `400 Bad Request`  |
| `/buku/:id` | **GET** | `200 OK`  | `404 Not Found`  / `400`  |
| `/buku/:id` | **PUT** | `200 OK`  | `400 Bad Request`  / `404 Not Found`  |
| `/buku/:id` | **DELETE**| `204 No Content`  | `404 Not Found` |

# SEMANGATTT
console.log ("\nNama: Amisha || NIM: F5512510003")
console.log ("Nama: Rizka Dwi Zaliyanti || NIM: F5512510005")
console.log ("Nama: Cindy Novita Auliyah || NIM: F5512510021")
console.log ("Nama: Kasih Nurlianita || NIM: F5512510032")

const http = require('http');
const fs = require('fs/promises');
const path = require('path');
const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'data', 'buku.json');

// ---------- helper respons ----------
function kirimJSON(res, statusCode, data) {
    const body = JSON.stringify(data);
    res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(body)
    });
    res.end(body);
}
function kirimError(res, statusCode, pesan) {
    kirimJSON(res, statusCode, { error: pesan });
}

// ---------- helper data ----------
async function bacaData() {
    const isi = await fs.readFile(DATA_FILE, 'utf8');
    return JSON.parse(isi);
}
async function simpanData(data) {
    await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
}

// ---------- helper request ----------
const FIELD_WAJIB = ['judul', 'penerbit', 'stok'];
function buatError(statusCode, pesan) {
    const err = new Error(pesan);
    err.statusCode = statusCode;
    return err;
}
function bacaBody(req) {
    return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => { body += chunk; });
    req.on('end', () => {
        if (body === '') return resolve(null);
            try {
                resolve(JSON.parse(body));
            } catch (err) {
                reject(buatError(400, 'Body request bukan JSON yang valid'));
            }
        });
        req.on('error', reject);
    });
}
function cekFieldWajib(input) {
    if (input === null || typeof input !== 'object' || Array.isArray(input)) {
        return FIELD_WAJIB;
    }
    return FIELD_WAJIB.filter((field) => {
        
        if (field === 'stok') {
            return typeof input[field] !== 'number' || !Number.isFinite(input[field]) || input[field] < 0;
        }
        
        return typeof input[field] !== 'string' || input[field].trim() === '';
    });
}

// ---------- handler ----------
async function daftarBuku(req, res, url) {
    let data = await bacaData();
    const title = url.searchParams.get('judul');
    const terbit = url.searchParams.get('penerbit');
    const stock = url.searchParams.get('stok');
    if (title) {
    data = data.filter((item) => item.judul === title);
    }
    if (terbit) {
    data = data.filter((item) => item.penerbit === terbit);
    }
    if (stock) {
    data = data.filter((item) => item.stok === Number(stock));
    }
    kirimJSON(res, 200, data);
}

async function tambahBuku(req, res) {
    const input = await bacaBody(req);
    const kurang = cekFieldWajib(input);
    if (kurang.length > 0) {
    return kirimError(res, 400, `Field wajib belum diisi: ${kurang.join(', ')}`);
    }
    const data = await bacaData();
    const idBaru = data.length === 0 ? 1 : Math.max(...data.map((d) => d.id)) + 1;
    const item = {
    id: idBaru,
    judul: input.judul.trim(),
    penerbit: input.penerbit.trim(),
    stok: input.stok
    };
    data.push(item);
    await simpanData(data);
    res.setHeader('Location', `/buku/${idBaru}`);
    kirimJSON(res, 201, item);
}
async function ubahBuku(req, res, id) {
    const input = await bacaBody(req);
    const data = await bacaData();
    const index = data.findIndex((d) => d.id === id);
    if (index === -1) {
    return kirimError(res, 404, `Buku dengan id ${id} tidak ditemukan`);
    }
    const kurang = cekFieldWajib(input);
    if (kurang.length > 0) {
    return kirimError(res, 400, `Field wajib belum diisi: ${kurang.join(', ')}`);
    }
    data[index] = {
    id,
    judul: input.judul.trim(),
    penerbit: input.penerbit.trim(),
    stok: input.stok
    };
    await simpanData(data);
    kirimJSON(res, 200, data[index]);
}
async function hapusBuku(req, res, id) {
    const data = await bacaData();
    const index = data.findIndex((d) => d.id === id);
    if (index === -1) {
    return kirimError(res, 404, `Buku dengan id ${id} tidak ditemukan`);
    }
    data.splice(index, 1);
    await simpanData(data);
    res.writeHead(204);
    res.end();
}

async function detailBuku(req, res, id) {
    const data = await bacaData();
    const buku = data.find((d) => d.id === id);
    if (!buku) {
        return kirimError(res, 404, `Buku dengan id ${id} tidak ditemukan`);
    }

// Integrasi Public API (Open Library)
    try {
        // Server Anda (sebagai consumer) memanggil API luar
        const urlPencarian = `https://openlibrary.org/search.json?title=${encodeURIComponent(buku.judul)}&limit=1`;
        const responsEksternal = await fetch(urlPencarian);
        const dataEksternal = await responsEksternal.json();

        // Mengambil data penulis jika ditemukan
        if (dataEksternal.docs && dataEksternal.docs.length > 0) {
            buku.penulis = dataEksternal.docs[0].author_name ? dataEksternal.docs[0].author_name[0] : "Penulis tidak diketahui";
        } else {
            buku.penulis = "Buku tidak ditemukan di Open Library";
        }
    } catch (err) {
        buku.penulis = "Gagal mengambil data dari server eksternal";
    }
    // -------------------------------------------

    kirimJSON(res, 200, buku);
}

// ---------- router ----------
async function router(req, res) {
    const url = new URL(req.url, 'http://localhost');
    const segmen = url.pathname.split('/').filter(Boolean);
    if (segmen[0] !== 'buku' || segmen.length > 2) {
    return kirimError(res, 404, 'Endpoint tidak ditemukan');
    }

    if (segmen.length === 1) {
    if (req.method === 'GET') return daftarBuku(req, res, url);
    if (req.method === 'POST') return tambahBuku(req, res);
    res.setHeader('Allow', 'GET, POST');
    return kirimError(res, 405, `Method ${req.method} tidak didukung pada endpoint ini`);
    }

    const id = Number(segmen[1]);
    if (!Number.isInteger(id) || id < 1) {
    return kirimError(res, 400, 'id harus berupa bilangan bulat positif');
    }
    if (req.method === 'GET') return detailBuku(req, res, id);
    if (req.method === 'PUT') return ubahBuku(req, res, id);
    if (req.method === 'DELETE') return hapusBuku(req, res, id);
    res.setHeader('Allow', 'GET, PUT, DELETE');
    return kirimError(res, 405, `Method ${req.method} tidak didukung pada endpoint ini`);
}

// ---------- server ----------
const server = http.createServer(async (req, res) => {
    console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
    try {
    await router(req, res);
    } catch (err) {
    if (err.statusCode) {
    return kirimError(res, err.statusCode, err.message);
    }
    console.error(err);
    kirimError(res, 500, 'Terjadi kesalahan pada server');
    }
});
server.listen(PORT, () => {
    console.log(`\nServer berjalan di http://localhost:${PORT}`);
});
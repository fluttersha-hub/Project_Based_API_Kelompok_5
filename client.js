// client.js
// Pastikan serverbuku.js sudah jalan sebelum menjalankan file ini!

async function jalankanSkenario() {
    console.log("Memulai Uji Coba Client Console");

    try {
        // 1. Menguji GET (Menampilkan semua buku)
        console.log("\n1) Mengambil daftar semua buku...");
        let respons = await fetch('http://localhost:3000/buku');
        let data = await respons.json();
        console.log("Hasil:", data);

        // 2. Menguji POST (Menambah buku baru)
        console.log("\n2) Menambah buku baru (Harry Potter)...");
        respons = await fetch('http://localhost:3000/buku', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ judul: "Harry Potter", penerbit: "Bloomsbury", stok: 10 })
        });
        data = await respons.json();
        console.log("Status:", respons.status, "| Hasil:", data);
        const idBaru = data.id; // Menyimpan ID untuk diuji di langkah selanjutnya

        // 3. Menguji GET Detail & Integrasi Public API
        console.log(`\n3) Mengambil detail buku ID ${idBaru} (Harusnya memunculkan data Penulis dari Open Library)...`);
        respons = await fetch(`http://localhost:3000/buku/${idBaru}`);
        data = await respons.json();
        console.log("Hasil Detail:", data);

        // 4. Menguji Skenario Gagal (Sesuai Syarat: menangani gagal tanpa stack trace)
        console.log(`\n4) Menguji error: Mencari buku ID 9999 (Tidak ada)...`);
        respons = await fetch(`http://localhost:3000/buku/9999`);
        data = await respons.json();
        console.log("Status:", respons.status, "| Pesan Error:", data.error);

    } catch (error) {
        console.log("\n!!! GAGAL MENGHUBUNGI SERVER !!!");
        console.log("Pesan ramah: Pastikan Anda sudah menyalakan server dengan perintah 'node serverbuku.js' di terminal lain.");
    }
}

jalankanSkenario();
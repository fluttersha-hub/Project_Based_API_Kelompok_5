// client.js
// Pastikan serverbuku.js sudah jalan sebelum menjalankan file ini!

async function jalankanSkenario() {
    try {
        // GET
        console.log("\n[GET] Mengambil daftar semua buku:");
        let respons = await fetch('http://localhost:3000/buku');
        let data = await respons.json();
        console.log("Status:", respons.status, "\nHasil:", data);

        // POST
        console.log("\n[POST] Mengirim data buku Madilog:");
        respons = await fetch('http://localhost:3000/buku', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ judul: "Madilog", penerbit: "Penerbit Narasi", stok: 10 })
        });
        data = await respons.json();
        console.log("Status:", respons.status, "\nHasil:", data);
        const idBaru = data.id;

        // GET & Integrasi Public API
        console.log("\n[GET] Mengambil detail buku ID ${idBaru} dengan data penulis dari Public API:");
        respons = await fetch(`http://localhost:3000/buku/${idBaru}`);
        data = await respons.json();
        console.log("Status:", respons.status, "\nHasil:", data);

        // Skenario Gagal
        console.log("\nHasil Error saat mencari ID 999:");
        respons = await fetch(`http://localhost:3000/buku/9999`);
        data = await respons.json();
        console.log("Status:", respons.status, "\nPesan Error:", data.error);

    } catch (error) {
        console.log("\nGAGAL MENGHUBUNGI SERVER");
        console.log("Pastikan sudah menyalakan server dengan perintah di terminal lain.");
    }
}

jalankanSkenario();
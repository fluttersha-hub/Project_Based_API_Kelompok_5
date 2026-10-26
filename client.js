// client.js
// Pastikan serverBuku.js sudah jalan sebelum menjalankan file ini!

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
        console.log(`\n[GET] Mengambil detail buku ID ${idBaru} dengan data penulis dari Public API:`);
        respons = await fetch(`http://localhost:3000/buku/${idBaru}`);
        data = await respons.json();
        console.log("Status:", respons.status, "\nHasil:", data);

        // PUT
        console.log(`\n[PUT] Mengubah stok buku ID ${idBaru} menjadi 15:`);
        respons = await fetch(`http://localhost:3000/buku/${idBaru}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ judul: "Madilog", penerbit: "Penerbit Narasi", stok: 15 })
        });
        data = await respons.json();
        console.log("Status:", respons.status, "\nHasil:", data);

        // GET Filter
        console.log("\n[GET] Mencari buku dari penerbit 'Gramedia Pustaka Utama':");
        respons = await fetch('http://localhost:3000/buku?penerbit=Gramedia%20Pustaka%20Utama');
        data = await respons.json();
        console.log("Status:", respons.status, "\nHasil:", data);

        // DELETE
        console.log(`\n[DELETE] Menghapus buku ID ${idBaru}:`);
        respons = await fetch(`http://localhost:3000/buku/${idBaru}`, {
            method: 'DELETE'
        });
        console.log("Status:", respons.status);

        // Skenario Gagal POST
        console.log("\n[POST] Mengirim data tanpa stok:");
        respons = await fetch('http://localhost:3000/buku', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ judul: "Buku Anu", penerbit: "Penerbit Abal-abalan" })
        });
        data = await respons.json();
        console.log("Status:", respons.status, "\nPesan Error:", data.error);

        // Skenario Gagal GET
        console.log("\n[GET] Mencari ID 999:");
        respons = await fetch(`http://localhost:3000/buku/9999`);
        data = await respons.json();
        console.log("Status:", respons.status, "\nPesan Error:", data.error);

    } 
        catch (error) {
            console.log("\nGAGAL MENGHUBUNGI SERVER");
            console.log("Pastikan sudah menyalakan server dengan perintah di terminal lain.");
        }
}
jalankanSkenario();
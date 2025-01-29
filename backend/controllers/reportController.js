const db = require('../db');

// 🌟 Buat laporan baru
const createReport = (req, res) => {
    const { title, description, location } = req.body;

    if (!title || !description || !location) {
        return res.status(400).json({ message: 'Mohon lengkapi semua kolom laporan, termasuk judul, deskripsi, dan lokasi kejadian 🙏' });
    }

    if (!req.user || !req.user.id) {
        return res.status(401).json({ message: 'Anda belum terautentikasi. Silakan login terlebih dahulu untuk mengirim laporan ⚠️' });
    }

    const query = 'INSERT INTO reports (id_pelapor, title, description, status, location) VALUES (?, ?, ?, ?, ?)';
    db.query(query, [req.user.id, title, description, 'pending', location], (err, results) => {
        if (err) {
            console.error('⚠️ Terjadi kesalahan saat menyimpan laporan:', err);
            return res.status(500).json({ message: 'Maaf, laporan Anda tidak dapat dikirim saat ini. Silakan coba lagi nanti 🙏' });
        }
        console.log(`✅ Laporan baru dibuat oleh Pelapor ID: ${req.user.id}`);
        res.status(201).json({ message: 'Terima kasih telah melaporkan kejadian ini. Laporan Anda akan segera kami proses! 🕵️‍♂️✨' });
    });
};

// 📄 Ambil semua laporan milik user yang login
const getUserReports = (req, res) => {
    const query = 'SELECT * FROM reports WHERE id_pelapor = ? ORDER BY created_at DESC';
    db.query(query, [req.user.id], (err, results) => {
        if (err) {
            console.error('⚠️ Terjadi kesalahan saat mengambil laporan:', err);
            return res.status(500).json({ message: 'Gagal mengambil data laporan Anda. Mohon coba lagi nanti 🙏' });
        }
        res.json(results);
    });
};

// ✏️ Perbarui laporan (hanya bisa oleh pemilik laporan)
const updateReport = (req, res) => {
    const { id } = req.params;
    const { title, description } = req.body;

    if (!title || !description) {
        return res.status(400).json({ message: 'Judul dan deskripsi laporan tidak boleh kosong ✍️' });
    }

    const checkQuery = 'SELECT * FROM reports WHERE id = ? AND id_pelapor = ?';
    db.query(checkQuery, [id, req.user.id], (err, results) => {
        if (err) return res.status(500).json({ message: 'Terjadi kesalahan saat memeriksa laporan. Coba lagi ya! 😔' });
        if (results.length === 0) return res.status(403).json({ message: 'Anda tidak memiliki akses untuk mengedit laporan ini ❌' });

        const updateQuery = 'UPDATE reports SET title = ?, description = ? WHERE id = ?';
        db.query(updateQuery, [title, description, id], (err, results) => {
            if (err) {
                console.error('⚠️ Terjadi kesalahan saat memperbarui laporan:', err);
                return res.status(500).json({ message: 'Gagal memperbarui laporan. Mohon coba lagi ya 🙏' });
            }
            console.log(`✅ Laporan ID ${id} diperbarui oleh Pelapor ID: ${req.user.id}`);
            res.json({ message: 'Laporan Anda berhasil diperbarui! ✅' });
        });
    });
};

// 🗑️ Hapus laporan (hanya bisa oleh pemilik laporan)
const deleteReport = (req, res) => {
    const { id } = req.params;

    const checkQuery = 'SELECT * FROM reports WHERE id = ? AND id_pelapor = ?';
    db.query(checkQuery, [id, req.user.id], (err, results) => {
        if (err) return res.status(500).json({ message: 'Terjadi kesalahan saat memeriksa laporan 😔' });
        if (results.length === 0) return res.status(403).json({ message: 'Anda tidak memiliki izin untuk menghapus laporan ini 🚫' });

        const deleteQuery = 'DELETE FROM reports WHERE id = ?';
        db.query(deleteQuery, [id], (err, results) => {
            if (err) {
                console.error('⚠️ Terjadi kesalahan saat menghapus laporan:', err);
                return res.status(500).json({ message: 'Gagal menghapus laporan. Coba lagi nanti ya! 🙏' });
            }
            console.log(`🗑️ Laporan ID ${id} dihapus oleh Pelapor ID: ${req.user.id}`);
            res.json({ message: 'Laporan berhasil dihapus. Terima kasih telah berbagi informasi! 🗑️✅' });
        });
    });
};

// 🔍 Ambil semua laporan (hanya untuk Satgas)
const getAllReports = (req, res) => {
    const query = 'SELECT * FROM reports ORDER BY created_at DESC';
    db.query(query, (err, results) => {
        if (err) {
            console.error('⚠️ Terjadi kesalahan saat mengambil laporan:', err);
            return res.status(500).json({ message: 'Gagal mengambil laporan. Mohon coba lagi nanti 🙏' });
        }
        res.json(results);
    });
};

// 🔍 Ambil detail laporan berdasarkan ID (hanya untuk Satgas)
const getReportById = (req, res) => {
    const { id } = req.params;

    const query = 'SELECT * FROM reports WHERE id = ?';
    db.query(query, [id], (err, results) => {
        if (err) {
            console.error('⚠️ Terjadi kesalahan saat mengambil laporan:', err);
            return res.status(500).json({ message: 'Gagal mengambil laporan.' });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'Laporan tidak ditemukan' });
        }
        res.json(results[0]);
    });
};

// ✅ Satgas memproses laporan (Menerima / Menolak)
const processReport = (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!['diterima', 'ditolak'].includes(status)) {
        return res.status(400).json({ message: 'Status tidak valid. Gunakan "diterima" atau "ditolak".' });
    }

    const updateQuery = 'UPDATE reports SET status = ?, processed_by = ? WHERE id = ?';
    db.query(updateQuery, [status, req.user.id, id], (err, results) => {
        if (err) {
            console.error('⚠️ Terjadi kesalahan saat memperbarui status laporan:', err);
            return res.status(500).json({ message: 'Gagal memperbarui status laporan.' });
        }
        console.log(`✅ Laporan ID ${id} telah ${status} oleh Satgas ID: ${req.user.id}`);
        res.json({ message: `Laporan telah ${status} oleh Satgas. Terima kasih! ✅` });
    });
};

module.exports = {
    createReport,
    getUserReports,
    getAllReports,
    getReportById,
    processReport,
    updateReport,
    deleteReport
};


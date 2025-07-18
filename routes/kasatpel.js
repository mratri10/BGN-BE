// routes/kasatpel.js
const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', async (req, res) => {
  const { kecamatan } = req.query;
  if (!kecamatan) return res.status(403).json({ error: "Required Kecamatan ok" });

  try {
    const keyword = `%${kecamatan}%`; // ← wildcard disusun di sini
    const [rows] = await db.query('SELECT * FROM kasatpel WHERE kecamatan LIKE ?', [keyword]);
    res.json();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET by ID
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM kasatpel WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST (create new)
router.post('/', async (req, res) => {
  const {
    provinsi, kota, kecamatan, kelurahan,
    sppg, jenis, start_ops, kasatpel
  } = req.body;
  
  try {
    const [result] = await db.query(`
      INSERT INTO kasatpel 
      (provinsi, kota, kecamatan, kelurahan, sppg, jenis, start_ops, kasatpel)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [provinsi, kota, kecamatan, kelurahan, sppg, jenis, start_ops, kasatpel]);

    res.json({ id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT (update)
router.put('/:id', async (req, res) => {
  const {
    provinsi, kota, kecamatan, kelurahan,
    sppg, jenis, start_ops, kasatpel
  } = req.body;

  try {
    await db.query(`
      UPDATE kasatpel SET 
        provinsi = ?, kota = ?, kecamatan = ?, kelurahan = ?,
        sppg = ?, jenis = ?, start_ops = ?, kasatpel = ?
      WHERE id = ?
    `, [provinsi, kota, kecamatan, kelurahan, sppg, jenis, start_ops, kasatpel, req.params.id]);

    res.json({ message: 'Updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE
router.delete('/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM kasatpel WHERE id = ?', [req.params.id]);
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

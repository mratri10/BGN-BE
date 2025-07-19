// routes/regional.js
const express = require('express');
const router = express.Router();
const db = require('../db');

// GET all data
router.get('/', async (req, res) => {
    const { prov, kota } = req.query;

  let sql = 'SELECT * FROM regional';
  const params = [];

  if (prov) {
    sql = `SELECT 
            ANY_VALUE(provinsi) AS provinsi,
            id_kabkot,
            ANY_VALUE(kabupaten) AS kabupaten,
            ANY_VALUE(id_kec) AS id_kec,
            ANY_VALUE(kecamatan) AS kecamatan
          FROM bgn.regional
          WHERE id_prov = ?
          GROUP BY id_kabkot;`;
    params.push(prov);
  } else if (kota) {
    sql = `SELECT 
            r.provinsi, 
            r.kabupaten, 
            r.kecamatan, 
            r.pd_pop, 
            r.plan_kitchen_sum,
            CASE 
              WHEN k.kecamatan IS NOT NULL THEN 1 
              ELSE 0 
            END AS jumlah_kecamatan
          FROM bgn.regional r
          LEFT JOIN bgn.kasatpel k 
            ON r.kecamatan LIKE CONCAT('%', k.kecamatan, '%')
            AND k.kota LIKE '%CILACAP%'
            AND k.provinsi LIKE CONCAT('%', r.provinsi, '%')
          WHERE r.kabupaten LIKE '%CILACAP%';`;
    params.push(kota);
  }else{
    sql = `SELECT 
            provinsi,
            ANY_VALUE(id_prov) AS id_prov
          FROM bgn.regional
          GROUP BY provinsi;`
  }

  try {
    const [rows] = await db.query(sql, params);
    res.json(rows);
  } catch (err) {
    console.error('MySQL error:', err);
    res.status(500).json({ error: err.message });
  }
});

// DELETE
router.delete('/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM regional WHERE id = ?', [req.params.id]);
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

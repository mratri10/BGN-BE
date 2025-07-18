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
            ANY_VALUE(provinsi) AS provinsi,
            id_kabkot,
            ANY_VALUE(kabupaten) AS kabupaten,
            ANY_VALUE(id_kec) AS id_kec,
            ANY_VALUE(kecamatan) AS kecamatan,
            ANY_VALUE(pd_pop) AS pd_pop,
            ANY_VALUE(plan_kitchen_sum) AS plan_kitchen_sum
          FROM bgn.regional
          WHERE id_kabkot = ?
          GROUP BY id_kec;`;
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

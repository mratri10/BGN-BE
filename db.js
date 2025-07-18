// db.js
const mysql = require('mysql2');

const pool = mysql.createPool({
  host: '167.99.76.27',
  user: 'bgn_user',
  password: 'BGB_password2025',
  database: 'bgn',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool.promise();

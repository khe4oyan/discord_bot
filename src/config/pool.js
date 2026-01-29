const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.SQL_HOST,
  user: process.env.SQL_USER,
  database: process.env.SQL_DB_NAME,
  password: process.env.SQL_PASSWORD,
});

module.exports = pool;
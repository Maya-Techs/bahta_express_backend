const mysql = require("mysql2/promise");

// db configuration settings
const dbConfig = {
  connectionLimit: 10,
  password: process.env.DB_PASS,
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
};

// connection pool
const pool = mysql.createPool(dbConfig);

// a func that will execute the sql queries async..ly

async function query(sql, params) {
  const [rows, fields] = await pool.execute(sql, params);
  return rows;
}
module.exports = { query };

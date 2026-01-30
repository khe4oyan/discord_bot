require("dotenv").config();
const pool = require("../src/config/pool.js");

async function initDB() {
  try {
    await pool.execute(`SET time_zone = "+04:00"`);

    await pool.execute(`CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      discord_id TEXT,
      username TEXT NOT NULL UNIQUE,
      global_name TEXT,
      balance INT DEFAULT 0,
      items TEXT DEFAULT "[]",
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`);
    console.log("✅ Database initialized successfully");
  } catch (err) {
    console.error("❌ DB init error:", err);
  }
  
  await pool.end();
}

initDB();

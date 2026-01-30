const pool = require("../config/pool.js");

class UserRepo {
  static async #createUserIfNotExists(user) {
    await pool.execute(`
      INSERT IGNORE 
      INTO users (discord_id, username, global_name, balance, items)
      VALUES (?, ?, ?, ?, ?)`,
      [user.id, user.username, user.globalName, 0, "[]"]
    );
  }

  static async incrementBalance(user) {
    await UserRepo.#createUserIfNotExists(user);
    await pool.execute(`UPDATE users SET balance = balance + 1 WHERE discord_id = ?`, [user.id]);
  }

  static async getBalance(user) {
    await UserRepo.#createUserIfNotExists(user);

    const [result] = await pool.execute(`SELECT * FROM users WHERE discord_id = ?`, [user.id]);
    const userData = result[0];

    return userData.balance;
  }
};

module.exports = UserRepo;
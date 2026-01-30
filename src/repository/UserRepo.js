const pool = require("../config/pool.js");

class UserRepo {
  static async #createUserIfNotExists(user) {
    console.log("CHECK user exists", user.discord_id);
    try {
      await pool.execute(`
        INSERT IGNORE 
        INTO users (discord_id, username, global_name, balance, items)
        VALUES (?, ?, ?, ?, ?)`,
        [user.discord_id, user.username, user.globalName, 0, "[]"]
      );
    } catch (error) {
      console.log("EXISTS ERR", error.message);
    }
  }

  static async addBalance(user, amount) {
    await UserRepo.#createUserIfNotExists(user);
    await pool.execute(`UPDATE users SET balance = balance + ? WHERE discord_id = ?`, [amount, user.discord_id]);
  }

  static async getBalance(user) {
    await UserRepo.#createUserIfNotExists(user);

    const [result] = await pool.execute(`SELECT * FROM users WHERE discord_id = ?`, [user.discord_id]);
    const userData = result[0];

    return userData.balance;
  }

  static async getUserData(id) {
    const [result] = await pool.execute(`SELECT * FROM users WHERE discord_id = ?`, [id]);
    const userData = result[0];
    
    if (userData) {
      userData.items = JSON.parse(userData.items);
    }

    return userData;
  }
  
  static async removeBalance(user, amount) {
    await UserRepo.#createUserIfNotExists(user);
    console.log(user);
    await pool.execute(`UPDATE users SET balance = balance - ? WHERE discord_id = ?`, [amount, user.discord_id]);
  }

  static async updateInventory(user) {
    await UserRepo.#createUserIfNotExists(user);
    const inv = JSON.stringify(user.items);
    await pool.execute(`UPDATE users SET items = ? WHERE discord_id = ?`, [inv, user.discord_id]);
  }
};

module.exports = UserRepo;
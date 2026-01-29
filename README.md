# Discord Economy & Lootbox Bot 🤖📦

A feature-rich Discord bot designed to increase server engagement through a "chat-to-earn" economy. Users earn points by being active, which they can spend on loot boxes, item upgrades, and trading.

## ✨ Key Features
* **Activity-Based Economy**: Earn points automatically by sending messages.
* **Loot Box System**: Open boxes to drop items with 8 different rarity levels.
* **Item Quality System**: From Classic to Ultimate (Gold), each item has visual and economic value.
* **Crafting & Upgrades**: Specialized logic to upgrade items (e.g., the Rose leveling system).
* **In-Game Shop**: Buy seasonal and special items using earned currency.
* **Inventory Management**: Sell, view, and manage your collection via slash commands.

## 💎 Rarity Levels (Qualities)
| Quality | Color | Level |
| :--- | :--- | :--- |
| **Ultimate** | 🟡 Gold | Top Tier |
| **Legendary** | 🔴 Red | High Rarity |
| **Epic** | 🌸 Pink | Very Rare |
| **Elite** | 🟣 Purple | Rare |
| **Rare** | 🔵 Blue | Uncommon |
| **Special** | 🟢 Green | Common+ |
| **Classic** | ⚪ Gray | Basic |

## 🛠 Tech Stack
* **Runtime**: Node.js
* **Library**: Discord.js (v14+)
* **Graphics**: Custom Image Generation (logic in ImgManager.js)
* **Storage**: Local JSON/File System (via FileManager.js)

## 🚀 Getting Started

1. **Prerequisites**
* Node.js installed.
* A Discord Bot Token from the [Discord Developer Portal](https://discord.com/developers/applications).

2. **Installation**
  ```bash
    # Clone the repo
    git clone https://github.com/khe4oyan/discord_bot.git

    # Install dependencies
    npm install
  ```

3. **Configuration**
Rename `.env-example` to `.env` and add your credentials:
```
  DISCORD_TOKEN=your_discord_bot_token
  IS_LOCAL= 0 || 1
  OWNER_ID=your_account_id
  SQL_HOST=host
  SQL_DB_NAME=db_name
  SQL_USER=user_name
  SQL_PASSWORD=sql_password
```

4. **Run**
```bash
  # Initialize database
  npm run init

  # Run bot
  npm start
```

## 📖 Commands
* `/bal` — Check your current balance.
* `/shop` — Browse items available for purchase.
* `/open` — Open a loot box.
* `/inv` — View your inventory.
* `/upgrade` — Attempt to upgrade a "Growable" item.
* `/sell` — Convert items back into currency.

## 📁 Project Structure
* `src/classes/`: Core logic for `Box`, `Item`, `UserData`, and Image Management.
* `src/commands/`: Implementation of all slash commands.
* `src/events/`: Handlers for Discord events (messages, interactions).
* `src/assets/`: Visual assets for items and quality backgrounds.
* `photoshop/`: Source files for UI elements and item designs.


// libs
const fs = require("fs");
const path = require("path");
const { Collection } = require("discord.js");

let commansData = {
  commands: null,
  collection: null,
};

function commandsReader() {
  if (commansData.commands !== null && commansData.collection !== null) {
    return commansData;
  }

  commansData.commands = [];
  commansData.collection = new Collection();

  const commandFiles = fs
    .readdirSync(path.join(__dirname, "../commands"))
    .filter((file) => file.endsWith(".js"));

  for (const file of commandFiles) {
    const command = require(path.join(__dirname, `../commands/${file}`));
    commansData.collection.set(command.name, command);

    // Добавляем команду в массив для регистрации
    commansData.commands.push({
      name: command.name,
      description: command.description,
      execute: command.execute,
      options: command.options || [],
    });
  }

  return commansData;
}

module.exports = commandsReader;

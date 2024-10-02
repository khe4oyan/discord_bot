const fs = require('fs');
const path = require("path");

module.exports = async function commandsRegister(client) {
  // Загружаем команды из папки 'commands'
  const commandFiles = fs
    .readdirSync(path.join(__dirname, "../commands"))
    .filter((file) => file.endsWith(".js"));

  const commands = [];

  for (const file of commandFiles) {
    const command = require(path.join(__dirname, `../commands/${file}`));
    client.commands.set(command.name, command);

    // Добавляем команду в массив для регистрации
    commands.push({
      name: command.name,
      description: command.description,
      execute: command.execute,
      options: command.options || [],
    });
  }
  
  return; // for tests

  await client.application.commands.set([]).then(() => console.log("Все команды удалены."));
  await client.application.commands.set(commands).then(() => console.log("Новые команды зарегистрированы."));
}
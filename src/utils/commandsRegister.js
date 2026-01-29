
const commandsReader = require("./commandsReader.js");

module.exports = async function commandsRegister(client) {
  const { commands } = commandsReader();
  
  if (+process.env.IS_LOCAL) {
    return; // for tests
  }

  await client.application.commands.set([]).then(() => console.log("Все команды удалены."));
  await client.application.commands.set(commands).then(() => console.log("Новые команды зарегистрированы."));
}
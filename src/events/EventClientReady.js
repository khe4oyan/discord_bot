const commandsRegister = require('../utils/commandsRegister.js');

module.exports = async function EventClientReady(client) {
  console.log(`Бот ${client.user.tag} успешно запущен!`);
  await commandsRegister(client);
  // send me message about register commands
}
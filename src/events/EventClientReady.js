// utils
const commandsRegister = require('../utils/commandsRegister.js');

module.exports = async function EventClientReady(client) {
  console.log(`Бот ${client.user.username + "#" + client.user.discriminator} успешно запущен!`);
  await commandsRegister(client);
}
const UserData = require('../classes/UserData.js');

module.exports = async function EventMessageCreate(message) {
  if (message.author.bot) return;
  new UserData(message.author, message.guildId).incrementBalance();
};

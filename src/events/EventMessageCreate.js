const UserData = require('../classes/UserData.js');

const processingUsers = new Set();

module.exports = async function EventMessageCreate(message) {
  const userId = message.author.id;
  if (processingUsers.has(userId)) { return; }

  processingUsers.add(userId);

  if (message.author.bot) return;
  
  new UserData(message.author, message.guildId).incrementBalance();
  processingUsers.delete(userId);
};

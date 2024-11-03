const UserData = require('../classes/UserData.js');

const processingUsers = new Set();

module.exports = async function EventMessageCreate(message, client) {
  const userId = message.author.id;
  if (processingUsers.has(userId)) { return; }

  processingUsers.add(userId);

  if (userId === process.env.OWNER_ID) {
    if (message.content.includes('!дай денег')) {
      message.reply("Как я это сделаю? Гений..");
    }
  }

  if (message.author.bot) return;
  new UserData(message.author, message.guildId).incrementBalance();
  processingUsers.delete(userId);
};

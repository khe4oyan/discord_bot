const UserData = require('../classes/UserData.js');

module.exports = async function EventMessageCreate(message, client) {
  if (message.content === "res") {
    client.destroy();
    client.login(process.env.DISCORD_TOKEN);
  }

  if (message.author.bot) return;
  new UserData(message.author, message.guildId).incrementBalance();
};

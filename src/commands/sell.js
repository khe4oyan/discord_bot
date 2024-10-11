const commandOptionTypes = require("../utils/commandOptionTypes.js");
const UserData = require('../classes/UserData.js');

module.exports = {
  name: "sell",
  description: "Продать предмет",
  options: [
    {
      name: "item_id",
      description: "ID предмета, который хочешь продать",
      required: true,
      type: commandOptionTypes.INTEGER,
    }
  ],

  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });

    const item_id = interaction.options.getInteger("item_id");
    const userData = new UserData(interaction.user, interaction.guildId);
    const replyMessage = userData.removeItem(item_id);

    await interaction.editReply(replyMessage);
  }
}
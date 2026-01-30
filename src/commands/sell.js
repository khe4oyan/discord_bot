const UserRepo = require("../repository/UserRepo.js");
const commandOptionTypes = require("../utils/commandOptionTypes.js");
const removeItemFromInventory = require("../utils/removeItemFromInventory.js");

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
    const userData = await UserRepo.getUserData(interaction.user.id);
    
    if (!userData) {
      return await interaction.editReply("У тебя нету этого предмета\n\n-# /inv - чтобы открыть свой инвентарь");
    }
    
    const {  inv, msg } = await removeItemFromInventory(userData, item_id);
    userData.items = inv;

    if (userData.items) {
      await UserRepo.updateInventory(userData);
    }

    await interaction.editReply(msg);
  }
}
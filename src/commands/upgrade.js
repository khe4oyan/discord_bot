const commandOptionTypes = require("../utils/commandOptionTypes");
const UserData = require('../classes/UserData.js');
const getItemDataById = require("../utils/getItemDataById");

module.exports = {
  name: "upgrade",
  description: "прокачать предмет",
  options: [
    {
      name: "item_id",
      description: "ID предмета, который хочешь прокачать",
      required: true,
      type: commandOptionTypes.INTEGER,
    },
  ],

  async execute(interaction) {
    await interaction.deferReply();
    const upgradableItemId = interaction.options.getInteger("item_id");
    const user = new UserData(interaction.user, interaction.guildId);
    const userInv = user.inventory;

    // ищем индекс улучшаемого предмета в инвентаре
    let itemInd = -1;
    for (let i = 0; i < userInv.length; ++i) {
      if (userInv[i][0] === upgradableItemId) {
        itemInd = i;
        break;
      }
    }
    
    // предмет отсутствует в инвентаре
    if (itemInd < 0) {
      return await interaction.editReply("В инветаре нет такого предмета \n-# /inv - чтобы посмотреть какие предметы есть");
    }

    const globalItemDate = getItemDataById(upgradableItemId);

    // предмет не прокачиваемый
    if (!(globalItemDate?.upgrades)) {
      return await interaction.editReply("Этот предмет не улучшаемый");
    }

    // предмет может улучшаться
    if (userInv[itemInd][2] === globalItemDate.upgrades.length) {
      return await interaction.editReply("Этот предмет максимально прокачен");
    }
    
    // попытка удалить предмет для прокачки
    const {upgradeItemId, upgradeItemCount} = globalItemDate.upgrades[userInv[itemInd][2] - 1];
    if (!user.removeItemCountByInd(upgradeItemId, upgradeItemCount)) {
      return await interaction.editReply("Нет фрагментов для улучшения");
    }

    user.upgradeItemByInd(itemInd);
    // TODO: create and send upgrade image
    await interaction.editReply(`Предмет улучшен до ${userInv[itemInd][2]} уровня!`);
  }
};
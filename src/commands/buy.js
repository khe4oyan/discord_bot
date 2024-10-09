const commandOptionTypes = require("../utils/commandOptionTypes.js");
const {items, shop} = require("../data/itemsData.js");
const UserData = require("../classes/UserData.js");
const ImgManager = require("../classes/ImgManager.js");

module.exports = {
  name: "buy",
  description: "Купить предмет по ID",
  options: [
    {
      name: "item_id",
      description: "номер предмета",
      require: true,
      type: commandOptionTypes.INTEGER
    }
  ],

  async execute(interaction) {
    await interaction.deferReply();

    const itemId = interaction.options.getInteger("item_id");
    if (shop.includes(itemId)) {
      const user = new UserData(interaction.user, interaction.guildId);
      for (let i = 0; i < items.length; ++i) {
        const itemData = items[i];

        if (itemData.id === itemId) {
          const itemPrice = itemData.price;
          if (user.hasBalance(itemPrice)) {
            user.removeBalance(itemPrice);
            user.addItem(itemId);
            let itemImgBuffer = await itemData.createImage();
            itemImgBuffer = await ImgManager.extend(itemImgBuffer, {top: 12, bottom: 11});

            let replyText = "Новый предмет уже в инвентаре!\n";
            replyText += `## Название: ${itemData.name}\n`;
            replyText += `Качество: ${itemData.getTypeTitle()}\n`;
            replyText += `Цена: ${itemData.price} монет\n`;
            replyText += `ID: ${itemData.id}\n\n`;
            replyText += `-# /sell ${itemData.id} - чтобы продать этот предмет`;

            await interaction.editReply({content: replyText, files: [ImgManager.createAttachmentDiscord(itemImgBuffer)]});
          } else {
            await interaction.editReply(`Чтобы купить этот предмет, тебе нужно накопить еще ${itemPrice - user.balance} монет`);
          }
          return;
        }
      }
      await interaction.editReply("[ОШИБКА]: предмет в продаже, но не существует");
    } else {
      await interaction.editReply("Предмет с таким номером не продается \n-# /shop - чтобы посмотреть список продаваемых предметов");
    }
  }
}
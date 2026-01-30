const commandOptionTypes = require("../utils/commandOptionTypes.js");
const {shop} = require("../data/itemsData.js");
const ImgManager = require("../classes/ImgManager.js");
const getItemDataById = require("../utils/getItemDataById.js");
const UserRepo = require("../repository/UserRepo.js");
const addItemToInventory = require("../utils/addItemToInventory.js");

module.exports = {
  name: "buy",
  description: "Купить предмет по ID",
  options: [
    {
      name: "item_id",
      description: "ID предмета, который хочешь купить",
      required: true,
      type: commandOptionTypes.INTEGER
    }
  ],

  async execute(interaction) {
    await interaction.deferReply();

    const itemId = interaction.options.getInteger("item_id");
    if (shop.includes(itemId)) {
      const user = await UserRepo.getUserData(interaction.user.id);
      
      if (!user) {
        return await interaction.editReply(`У тебя нет манет`);
      }

      const generalItemData = getItemDataById(itemId);
      if (generalItemData) {
        const itemPrice = generalItemData.price;
        
        if (user.balance >= itemPrice) {
          await UserRepo.removeBalance(user, itemPrice);
          user.items = await addItemToInventory(user.items, itemId);
          await UserRepo.updateInventory(user);

          let itemImgBuffer = await generalItemData.createImage();
          itemImgBuffer = await ImgManager.extend(itemImgBuffer, {top: 12, bottom: 11});

          let replyText = "Новый предмет уже в инвентаре!\n";
          replyText += `## Название: ${generalItemData.name}\n`;
          replyText += `Качество: ${generalItemData.getTypeTitle()}\n`;
          replyText += `Цена: ${generalItemData.price} монет\n`;
          replyText += `ID: ${generalItemData.id}\n\n`;
          replyText += `-# /sell ${generalItemData.id} - чтобы продать этот предмет`;

          await interaction.editReply({content: replyText, files: [ImgManager.createAttachmentDiscord(itemImgBuffer)]});
        } else {
          await interaction.editReply(`Чтобы купить этот предмет, тебе нужно накопить еще ${itemPrice - user.balance} монет`);
        }
      } else {
        await interaction.editReply("[ОШИБКА]: предмет в продаже, но не существует");
      }
    } else {
      await interaction.editReply("Предмет с таким номером не продается \n-# /shop - чтобы посмотреть список продаваемых предметов");
    }
  }
}
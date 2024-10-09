const commandOptionTypes = require("../utils/commandOptionTypes.js");
const itemsData = require("../data/itemsData.js");
const boxesData = require("../data/boxesData.js");
const UserData = require("../classes/UserData.js");
const ImgManager = require("../classes/ImgManager.js");

module.exports = {
  name: "open",
  description: "Открыть ящик",
  options: [
    {
      name: "box_id",
      description: "номер ящика",
      required: true,
      type: commandOptionTypes.INTEGER,
    },
  ],

  async execute(interaction) {
    await interaction.deferReply();
    const boxNumber = interaction.options.getInteger("box_id");
    const { boxes } = boxesData;

    for (let i = 0; i < boxes.length; ++i) {
      if (boxes[i].id === boxNumber) {
        if (!boxes[i].isActive) { continue; }
        const userData = new UserData(interaction.user, interaction.guildId);
        const boxPrice = boxes[boxNumber].price;
        
				if (!userData.hasBalance(boxPrice)) {
					await interaction.editReply(`Этот ящик стоит ${boxPrice} монет.\n Тебе не хватает  ${boxPrice - userData.balance} монет.`);
        } else {
					userData.removeBalance(boxPrice);
          await openBox(interaction, boxes[boxNumber], userData);
        }

        return;
      }
    }

    await interaction.editReply(`Ящик с номером ${boxNumber} не существует\n-# /boxes - чтобы посмотреть список ящиков`);
  },
};

async function openBox(interaction, openBoxData, userData) {
  const itemId = openBoxData.dropItemId();

  for (let i = 0; i < itemsData.items.length; ++i) {
    if (itemsData.items[i].id === itemId) {
      const itemData = itemsData.items[i];
      userData.addItem(itemId);
    
      const imgBuffer = await ImgManager.extend(await itemData.createImage(), {top: 12, bottom: 11});
      const attachment = ImgManager.createAttachmentDiscord(imgBuffer);
      
      let contentData = `## ${itemData.name}\n`;
      contentData += `Качество: ${itemData.getTypeTitle()}\n`;
      contentData += `Цена: ${itemData.price} монет\n`;
      contentData += `ID: ${itemData.id}\n`;
    
      return await interaction.editReply({
        content: contentData,
        files: [attachment],
      });
    }
  }

  return await interaction.editReply("[ОШИБКА]: Выпал не существующий предмет");
}

const commandOptionTypes = require("../utils/commandOptionTypes.js");
const itemsData = require("../utils/itemsData.js");
const boxesData = require("../utils/boxesData.js");
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

  execute: async (interaction) => {
    await interaction.deferReply();
    const boxNumber = interaction.options.getInteger("box_id");
    const { boxes } = boxesData;

    for (let i = 0; i < boxes.length; ++i) {
      if (boxes[i].id === boxNumber) {
        if (!boxes[i].isActive) { continue; }
        const userData = new UserData(interaction.user, interaction.guildId);
        const boxPrice = boxes[boxNumber].price;
        
				if (!userData.hasBalance(boxPrice)) {
					await interaction.editReply(
						`Этот ящик стоит: ${boxPrice}.\n Твой баланс: ${userData.balance}.`
          );
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
  const itemData = itemsData.items[itemId];
  userData.addItem(itemId);

  const imgBuffer = ImgManager.extend(await itemData.createImage(), {top: 12, bottom: 11});
  const attachment = ImgManager.createAttachmentDiscord(imgBuffer);
  
  let contentData = `## ${itemData.name}\n`;
  contentData += `Качество: ${itemData.getTypeTitle()}\n`;
  contentData += `Цена: ${itemData.price}\n`;

  await interaction.editReply({
    content: contentData,
    files: [attachment],
  });
}

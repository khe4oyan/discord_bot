const UserData = require("../classes/UserData.js");
const ImgManager = require("../classes/ImgManager.js");
const commandOptionTypes = require("../utils/commandOptionTypes.js");
const boxesData = require("../data/boxesData.js");
const getItemDataById = require("../utils/getItemDataById.js");
const path = require("path");

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

  const generalItemData = getItemDataById(itemId);
  // TODO:
  // if upgrades check have itemId in inventory
  // if has try to drop again
  if (generalItemData) {
    userData.addItem(itemId);
  
    let imgBuffer = await ImgManager.extend(await generalItemData.createImage(), {top: 12, bottom: 11});

    if (generalItemData.upgrades) {
      const upgradeIcon = await ImgManager.loadImg(path.join(__dirname, "../assets/img/quality/upgrade.png")).toBuffer();
      const itemBufferMeta = await ImgManager.loadImg(imgBuffer).metadata();
      imgBuffer = await ImgManager.overlayImage(imgBuffer, upgradeIcon, itemBufferMeta.width - 40, 20, 35, 35);
    }

    const attachment = ImgManager.createAttachmentDiscord(imgBuffer);
    
    let contentData = `## ${generalItemData.name}\n`;
    contentData += `Качество: ${generalItemData.getTypeTitle()}\n`;
    contentData += `Цена: ${generalItemData.price} монет\n`;
    contentData += `ID: ${generalItemData.id}\n`;
  
    await interaction.editReply({
      content: contentData,
      files: [attachment],
    });
  } else {
    await interaction.editReply("[ОШИБКА]: Выпал не существующий предмет");
  }
}

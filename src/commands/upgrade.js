const commandOptionTypes = require("../utils/commandOptionTypes");
const ImgManager = require('../classes/ImgManager.js');
const path = require('path');
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
    // TODO: get user data
    const user = null;
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
    const {upgradeItemId, upgradeItemCount} = globalItemDate.upgrades[userInv[itemInd][2]];
    {
      const result = user.removeItemCountById(upgradeItemId, upgradeItemCount);
      if (!result) {
        const upgradeItemData = getItemDataById(upgradeItemId);
        
        let resultText = `Недостаточно фрагментов для улучшения.\n`;
        resultText += `Для следующего уровня нужно ${upgradeItemCount} шт. этого предмета.\n`;
        resultText += `### ${upgradeItemData.name} (ID: ${upgradeItemId})\n`;
        
        const upgradeItemImg = await upgradeItemData.createAttachment();
        return await interaction.editReply({content: resultText, files: [upgradeItemImg]});
      }
    }

    // улучшение предмета
  
    // создание фона
    let bgBuffer = await ImgManager.createImage(400, 200, '#123');
    const bgMeta = await ImgManager.loadImg(bgBuffer).metadata();
    
    // изображение предмета до улучшения
    const beforeUpgradeItemBuffer = await globalItemDate.createImage(userInv[itemInd][2]); 
    // const beforeUpgradeItemMeta = await ImgManager.loadImg(beforeUpgradeItemBuffer).metadata();

    user.upgradeItemByInd(itemInd);

    // изображение предмета после улучшения
    const afterUpgradeItemBuffer = await globalItemDate.createImage(userInv[itemInd][2]); 
    // const afterUpgradeItemMeta = await ImgManager.loadImg(afterUpgradeItemBuffer).metadata();
    
    // фрагмент для улучшения
    const upgradeItemBuffer = await getItemDataById(upgradeItemId).createImage();
    // const upgradeItemMeta = await ImgManager.loadImg(upgradeItemBuffer).metadata();

    // стрелочка прокачки
    const upgradeArrow = await ImgManager.loadImg(path.join(__dirname, `../assets/img/quality/arrow.png`)).toBuffer();

    // добавить предметы до и после на фон
    const imgMaxHeight = bgMeta.height * .8;
    bgBuffer = await ImgManager.overlayImage(bgBuffer, beforeUpgradeItemBuffer, 25, 25, bgMeta.width, imgMaxHeight);
    bgBuffer = await ImgManager.overlayImage(bgBuffer, afterUpgradeItemBuffer, bgMeta.width - 160, 25, bgMeta.width, imgMaxHeight);
    bgBuffer = await ImgManager.overlayImage(bgBuffer, upgradeItemBuffer, 140, 130, bgMeta.width, bgMeta.height * .3);
    bgBuffer = await ImgManager.overlayImage(bgBuffer, upgradeArrow, 170, 50, bgMeta.width, bgMeta.height * .25);

    
    let resultText = `## Предмет улучшен до ${userInv[itemInd][2]} уровня!\n`;

    if (upgradeItemCount === 1) {
      resultText += `Был использован ${upgradeItemCount} фрагмент для прокачки этого предмета.`;
    } else {
      resultText += `Было использовано ${upgradeItemCount} фрагмента для прокачки этого предмета.`;
    }

    await interaction.editReply({content: resultText, files: [ImgManager.createAttachmentDiscord(bgBuffer)]});
  }
};
const Item = require("./Item");
const path = require("path");
const ImgManager = require("./ImgManager.js");

// never expired
class ItemUpgrade extends Item {
  isUpgradeable;
  upgrades;

  constructor(name, price, type, img) {
    super(name, price, type, img);
    this.isUpgradeable = true;
    this.upgrades = [];
  }

  addLevel(upgradeItemId, upgradeItemCount, img) {
    this.upgrades.push({img, upgradeItemId, upgradeItemCount});
    return this;
  }

  async createImage(upgradeLevel = 0) {
    const upgrades = this.upgrades[upgradeLevel - 1];
    let img = this.img;

    if (upgrades) {
      img = upgrades.img;
    }
    
    const backgroundPath = path.join(__dirname, `../assets/img/quality/${this.type}.png`);
    const itemPath = path.join(__dirname, `../assets/img/items/${img}`);

    // Загрузка фона
    const background = ImgManager.loadImg(backgroundPath);
    const bgMetaData = await background.metadata();
    
    // Изменение размера предмета
    const resizedItemImg = await ImgManager.loadImg(itemPath)
    .resize({
      width: Math.floor(bgMetaData.width * 0.8),
      height: Math.floor(bgMetaData.height * 0.8),
      fit: "inside",
    })
    .toBuffer();
    
    // Наложение предмета на фон
    const finalImage = await background
      .composite([{ input: resizedItemImg, gravity: "center" }])
      .png()
      .toBuffer();

    return finalImage;
  }
}

module.exports = ItemUpgrade;
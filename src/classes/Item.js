const sharp = require("sharp");
const path = require("path");
const { AttachmentBuilder } = require("discord.js");
const ImgManager = require("./ImgManager.js");

class Item {
  id;
  name;
  buyFor;
  sellFor;
  type;
  img;
  craft;
  expiredAt;

  static indexCounter = 0;
  static quality = {
    ultimate: "ultimate", // gold
    legendary: "legendary", // red
    epic: "epic", // pink
    elite: "elite", // purple
    rare: "rare", // blue
    special: "special", // green
    classic: "classic", // gray
  };

  constructor( name, buyFor, sellFor, type, img, craft = null, expiredAt = null) {
    this.id = Item.indexCounter++;
    this.name = name;
    this.buyFor = buyFor;
    this.sellFor = sellFor;
    this.type = type;
    this.img = img;
    this.craft = craft;
    this.expiredAt = expiredAt;
  }

  async createAttachment() {
    const backgroundPath = path.join(__dirname, `../assets/img/quality/${this.type}.png`);
    const itemPath = path.join(__dirname, `../assets/img/items/${this.img}`);

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
      .toBuffer();  
    
    // TODO: check is temporary item or not
    
    // Создание вложения
    return ImgManager.createAttachmentDiscord(finalImage);
  }

  getTypeTitle() {
    const qualityTitle = {
      ultimate: "Золотой", // gold
      legendary: "Легендарный", // red
      epic: "Эпический", // pink
      elite: "Элитный", // purple
      rare: "Редкий", // blue
      special: "Специальный", // green
      classic: "Обычный", // gray
    };

    return qualityTitle[this.type];
  }
}

module.exports = Item;

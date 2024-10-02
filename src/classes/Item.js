const sharp = require("sharp");
const path = require("path");
const { AttachmentBuilder } = require("discord.js");

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
    const background = sharp(backgroundPath);
    const { width: bgWidth, height: bgHeight } = await background.metadata();

    // Вычисление размеров предмета
    const targetWidth = Math.floor(bgWidth * 0.8);
    const targetHeight = Math.floor(bgHeight * 0.8);

    // Изменение размера предмета
    const resizedItemImg = await sharp(itemPath)
      .resize({
        width: targetWidth,
        height: targetHeight,
        fit: "inside",
      })
      .toBuffer();

    // Наложение предмета на фон
    const finalImage = await background
      .composite([{ input: resizedItemImg, gravity: "center" }])
      .toBuffer();

    // TODO not Important: check is temporary item or not

    // Создание вложения
    return new AttachmentBuilder(finalImage, { name: "result.png" });
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

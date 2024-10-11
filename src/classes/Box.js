const ImgManager = require("./ImgManager.js");
const Item = require("./Item.js");
const getItemDataById = require("../utils/getItemDataById.js");
const path = require("path");

class Box {
  id;
  name;
  price;
  items;
  isActive;
  headerColor;
  headerTitleColor;
  availableBefore;
  
  static indexCounter = 0;

  constructor(boxName, headerColor = "#4C4E53", headerTitleColor = "#fff") {
    this.id = Box.indexCounter++;
    this.name = boxName;
    this.price = 0;
    this.items = new Map();
    this.isActive = false;
    this.headerColor = headerColor;
    this.headerTitleColor = headerTitleColor;
    this.availableBefore = null;
  }

  setPrice(price) {
    this.price = price;
    return this;
  }

  addNewItem(itemId, chance) {
    if (this.items.has(chance)) {
      const chanceArr = this.items.get(chance);
      chanceArr.push(itemId);
    } else {
      this.items.set(chance, [itemId]);
    }

    return this;
  }

  dropItemId() {
    // 1. Суммируем все шансы
    let totalChance = 0;
    for (let chance of this.items.keys()) {
      totalChance += chance;
    }

    // 2. Генерируем случайное число от 0 до totalChance
    let random = Math.random() * totalChance;

    // 3. Ищем, в какой диапазон попало случайное число
    let accumulatedChance = 0;
    for (let [chance, itemIds] of this.items.entries()) {
      accumulatedChance += chance;
      if (random < accumulatedChance) {
        // Возвращаем случайный предмет из массива предметов с данным шансом
        const randomIndex = Math.floor(Math.random() * itemIds.length);
        return itemIds[randomIndex];
      }
    }
  }

  setIsActive() {
    this.isActive = true;
    return this;
  }

  async createImage() {
    // calculate max chance
    let totalChance = 0;
    for (let [chance, itemIds] of this.items.entries()) {
      totalChance += chance * itemIds.length;
    }

    const maxItemsInLine = 4;

    // get items id
    const itemsId = [];
    let line = [];
    
    for (let [chance, itemIds] of this.items.entries()) {
      for (let i = 0; i < itemIds.length; ++i) {
        let prcentOfTotalChance = +((chance * 100) / totalChance).toFixed(2);
        if (prcentOfTotalChance > 1) {
          prcentOfTotalChance = Math.round(prcentOfTotalChance);
        }
        
        const generalItemData = getItemDataById(itemIds[i]);
        
        if (generalItemData) {
          line.push([generalItemData, prcentOfTotalChance]);
          if (line.length === maxItemsInLine) {
            itemsId.push(line);
            line = [];
          }
        }
      }
    }

    if (line.length > 0) {
      itemsId.push(line);
      line = [];
    }
    
    // get item image width, height
    const {width, height} = await (async () => {
      const image = await itemsId[0][0][0].createImage();
      return ImgManager.loadImg(image).metadata();
    })()

    const gap = 10;
    const colls = ((width * maxItemsInLine) + (maxItemsInLine * gap));
    const rows = (height * itemsId.length + (itemsId.length * gap));

    let background = await ImgManager.createImage(colls, rows, "#0000");
    
    for (let i = 0; i < itemsId.length; ++i) {
      for (let j = 0; j < itemsId[i].length; ++j) {
        const [itemData, chance] = itemsId[i][j];
        let itemBuffer = await itemData.createImage();
        itemBuffer = await ImgManager.addTextToImage(itemBuffer, `${chance}%`, width - 10, height - 40, 25, itemData.type === Item.quality.ultimate ? "#000" : "#fffa", "end");

        if (itemData.upgrades) {
          const upgradeIcon = await ImgManager.loadImg(path.join(__dirname, "../assets/img/quality/upgrade.png")).toBuffer();
          
          const itemBufferMeta = await ImgManager.loadImg(itemBuffer).metadata();
          itemBuffer = await ImgManager.overlayImage(itemBuffer, upgradeIcon, itemBufferMeta.width - 40, 10, 35, 35);
        }

        const x = j * width + j * gap;
        const y = i * height + i * gap;

        background = await ImgManager.overlayImage(background, itemBuffer, x, y, width, height);
      }
    }

    background = await ImgManager.extend(background, {top: 14, left: 13, right: 13, bottom: 14});
    background = await ImgManager.extend(background, {top: 100}, this.headerColor);

    if (Number.isInteger(this.isActive)) {
      background = await ImgManager.extend(background, {top: 35}, this.headerColor);
      const backgroundMeta = await ImgManager.loadImg(background).metadata();
      background = await ImgManager.addTextToImage(background, `————————`, 30, 85, 35, this.headerTitleColor);
      background = await ImgManager.addTextToImage(background, `————————| осталось ${this.isActive}дн.`, backgroundMeta.width - 30, 85, 35, this.headerTitleColor, 'end');
    }

    const backgroundMetaData = await ImgManager.loadImg(background).metadata();
    background = await ImgManager.addTextToImage(background, this.name, 30, 0, 50, this.headerTitleColor);
    background = await ImgManager.addTextToImage(background, `можно открыть за ${this.price} монет`, 30, 50, 35, this.headerTitleColor);
    background = await ImgManager.addTextToImage(background, `ID: ${this.id}`, backgroundMetaData.width - 30, 0, 50, this.headerTitleColor, "end");
    

    return background;
  }

  async createAttachment() {
    const finalImage = await this.createImage();
    return ImgManager.createAttachmentDiscord(finalImage);
  }

  setAvailable(day, month, year = new Date().getFullYear()) {
    this.availableBefore = new Date(`${month}.${day + 1}.${year}`);
    const differenceTime = this.availableBefore - new Date();
    const differenceDays = Math.round(differenceTime / (1000 * 3600 * 24));

    if (differenceDays > 0) {
      this.isActive = differenceDays;
    }

    return this;
  }
}

module.exports = Box;

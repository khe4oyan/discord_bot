const ImgManager = require("./ImgManager.js");
const itemsData = require("../utils/itemsData.js");

class Box {
  static indexCounter = 0;
  id;
  name;
  price;
  items;
  isActive;

  constructor(boxName) {
    this.id = Box.indexCounter++;
    this.name = boxName;
    this.price = 0;
    this.items = new Map();
    this.isActive = false;
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
    for (let chance of this.items.keys()) {
      totalChance += chance;
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
        
        line.push([itemsData.items[itemIds[i]], prcentOfTotalChance]);
        if (line.length === maxItemsInLine) {
          itemsId.push(line);
          line = [];
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
        const itemBuffer = await itemData.createImage();
        
        const itemResult = await ImgManager.addTextToImage(itemBuffer, `${chance}%`, width - 10, 4, 25, "#fffa", "end");

        const x = j * width + j * gap;
        const y = i * height + i * gap;

        background = await ImgManager.overlayImage(background, itemResult, x, y, width, height);
      }
    }

    return ImgManager.extend(background, {top: 14, left: 13, right: 13, bottom: 14});
  }

  async createAttachment() {
    const finalImage = await this.createImage();
    return ImgManager.createAttachmentDiscord(finalImage);
  }
}

module.exports = Box;

const ImgManager = require("./ImgManager.js");

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
    const background = ImgManager.createImage(200, 100, "#0fa");
    return background;
  }

  async createAttachment() {
    const finalImage = await this.createImage();
    return ImgManager.createAttachmentDiscord(finalImage);
  }
}

module.exports = Box;

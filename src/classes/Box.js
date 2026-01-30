// libs
const path = require("path");

// classes
const ImgManager = require("./ImgManager.js");
const Item = require("./Item.js");

// utils
const getItemDataById = require("../utils/getItemDataById.js");

class Box {
  id;
  name;
  price;
  items;
  isActive;
  headerColor;
  headerTitleColor;
  availableBefore;
  coolDown;
  showBoxNumber;
  
  static indexCounter = 0;

  constructor(boxName, showBoxNumber, headerColor = "#4C4E53", headerTitleColor = "#fff") {
    this.id = Box.indexCounter++;
    this.name = boxName;
    this.price = 0;
    this.items = new Map();
    this.isActive = false;
    this.headerColor = headerColor;
    this.headerTitleColor = headerTitleColor;
    this.availableBefore = null;
    this.coolDownMinutes = null;
    this.showBoxNumber = showBoxNumber;
  }

  setCoolDown(cooldownMinutes) {
    this.coolDownMinutes = cooldownMinutes;
    return this;
  }

  setAvailableBefore(day, month, year = new Date().getFullYear()) {
    this.availableBefore = new Date(`${month}.${day + 1}.${year}`);
    const differenceTime = this.availableBefore - new Date();
    const differenceDays = Math.round(differenceTime / (1000 * 3600 * 24));

    if (differenceDays > 0) {
      this.isActive = differenceDays;
    }

    return this;
  }

  setPrice(price) {
    this.price = price;
    return this;
  }

  setIsActive() {
    this.isActive = true;
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
  
  async createImage() {
    switch(this.showBoxNumber) {
      case 0: { return await this.createFullInnerItems(); }
      case 1: { return await this.createMainItemImg(); }
      default: { return await this.createFullInnerItems(); }
    }
  }

  async createMainItemImg() { 
    const maxItemsInLine = 4;
    const itemsId = this.#getDropableItemsIds(maxItemsInLine);

    const { width, height } = await this.#getItemImageSizes(itemsId[0][0][0]);

    const colls = 834;
    const rows = 310;

    let background = await ImgManager.createImage(colls, rows, "#0000");
    const [
      itemData, 
      // itemDropChance
    ] = itemsId[0][0];

    let upgadeLevel = 0;
    if (itemData.isUpgradeable) {
      upgadeLevel = itemData.upgrades.length;
    }

    const itemImg = await itemData.createImage(upgadeLevel);
    
    const thisHeaderColor = this.#getDarkHeaderColor(.7);

    background = await ImgManager.addRadialGradientToImage(background, this.headerColor, thisHeaderColor, 80, 50);
    background = await ImgManager.overlayImage(background, itemImg, 550, 25, width + 30, height + 30)
    background = await ImgManager.addTextToImage(background, 'ГЛАВНЫЙ', 20, 10, 100, this.headerTitleColor);    
    background = await ImgManager.addTextToImage(background, 'ПРИЗ', 20, 110, 100, this.headerTitleColor);    
    background = await ImgManager.addTextToImage(background, '————', 20, 180, 100, this.headerTitleColor);    
    background = await this.#createBoxHeader(background, false);

    return background;
  }

  #getDarkHeaderColor(percent) {
    const hex = this.headerColor.replace(/^#/, '');
    // Преобразуем шестнадцатеричный код в RGB
    let r = parseInt(hex.substring(0, 2), 16);
    let g = parseInt(hex.substring(2, 4), 16);
    let b = parseInt(hex.substring(4, 6), 16);

    // Затемняем каждый компонент цвета
    r = Math.floor(r * (1 - percent));
    g = Math.floor(g * (1 - percent));
    b = Math.floor(b * (1 - percent));

    // Собираем новый цвет обратно в шестнадцатеричном формате
    const darkenedHex = '#' + 
        ((1 << 24) + (r << 16) + (g << 8) + b)
        .toString(16)
        .slice(1)
        .toUpperCase();

    return darkenedHex;
  }

  async createFullInnerItems() {
    const maxItemsInLine = 4;
    const itemsId = this.#getDropableItemsIds(maxItemsInLine);

    const { width, height } = await this.#getItemImageSizes(itemsId[0][0][0]);

    const gap = 10;
    const [colls, rows] = this.#calculateCollsAndRows(itemsId, maxItemsInLine, gap, width, height);

    let background = await ImgManager.createImage(colls, rows, "#0000");
    background = await ImgManager.addLinearGradientToImage(background, "#000", this.headerColor);
    background = await this.#createDropableItemsImg(background, itemsId, width, height, gap);
    background = await this.#createBoxHeader(background);
    
    return background;
  }

  #calculateTotalChance() {
    let totalChance = 0;

    for (let [chance, itemIds] of this.items.entries()) {
      totalChance += chance * itemIds.length;
    }

    return totalChance;
  }

  #getDropableItemsIds(maxItemsInLine) {
    const itemsId = [];
    let line = [];

    let totalChance = this.#calculateTotalChance();

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
    
    return itemsId;
  }

  async #getItemImageSizes(item) {
    const image = await item.createImage();
    return ImgManager.loadImg(image).metadata();
  }

  async #createDropableItemsImg(background, itemsId, width, height, gap) {
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

    return background;
  }

  async #createBoxHeader(background, padding = true) {
    background = await ImgManager.extend(background, {top: padding ? 14 : 0, bottom: 14});
    background = await ImgManager.extend(background, {top: 100}, this.headerColor);

    const backgroundMeta = await ImgManager.loadImg(background).metadata();
    if (Number.isInteger(this.isActive)) {
      background = await ImgManager.extend(background, {top: 35}, this.headerColor);
      background = await ImgManager.addTextToImage(background, `————————`, 30, 85, 35, this.headerTitleColor);
      background = await ImgManager.addTextToImage(background, `————————| осталось ${this.isActive} дн.`, backgroundMeta.width - 30, 85, 35, this.headerTitleColor, 'end');
    }

    const backgroundMetaData = await ImgManager.loadImg(background).metadata();
    background = await ImgManager.addTextToImage(background, this.name, 30, 0, 50, this.headerTitleColor);
    background = await ImgManager.addTextToImage(background, `ID: ${this.id}`, backgroundMetaData.width - 30, 0, 50, this.headerTitleColor, "end");
    background = await ImgManager.addTextToImage(background, `можно открыть за ${this.price} монет`, 30, 50, 35, this.headerTitleColor);
    
    if (this.coolDownMinutes) {
      background = await ImgManager.addTextToImage(background, `кд ${this.coolDownMinutes} мин.`, backgroundMeta.width - 30, 50, 35, this.headerTitleColor, "end");
    }

    return background;
  }

  #calculateCollsAndRows(itemsId, maxItemsInLine, gap, width, height) { 
    const colls = ((width * maxItemsInLine) + (maxItemsInLine * gap)) - gap;
    const rows = (height * itemsId.length + (itemsId.length * gap)) - gap;

    return [colls, rows];
  }

  async createAttachment() {
    const finalImage = await this.createImage();
    return ImgManager.createAttachmentDiscord(finalImage);
  }
}

module.exports = Box;

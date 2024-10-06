const FileManager = require("./FileManager.js");
const ImgManager = require("./ImgManager.js");
const Item = require("./Item.js");
const itemsData = require("../data/itemsData.js");

class UserData {
  id;
  username;
  globalName;
  balance;
  registerDate;
  guildId;
  inventory;

  constructor(userData, guildId) {
    this.id = userData.id;
    this.username = userData.username;
    this.globalName = userData.globalName;
    this.balance = 0;
    this.registerDate = new Date().getTime();
    this.guildId = guildId;
    this.inventory = [];

    if (!this.#findUserDataById()) {
      this.#save();
    }
  }

  #findUserDataById() {
    const loadedData = FileManager.load(`../DB/guilds/${this.guildId}/${this.id}/data.txt`);
    if (loadedData) { 
      this.balance = loadedData?.balance;
      this.registerDate = loadedData?.registerDate;
      this.guildId = loadedData?.guildId;
      this.inventory = loadedData?.inventory ?? [];
      return true;
    } else {
      return false;
    }
  }

  #save() {
    FileManager.save(`../DB/guilds/${this.guildId}/${this.id}/data.txt`, this);
  }

  hasBalance(requireBalance) {
    return this.balance >= requireBalance;
  }

  removeBalance(count) {
    this.balance -= count;
    this.#save();
  }

  addItem(itemId) {
    let isNewItem = true;
    const qualities = Item.quality;

    // Получаем ключи от всех типов качеств
    const keys = Object.keys(qualities);
    const qualityArrays = {};
    // Создаем массивы для каждого качества
    for (let i = 0; i < keys.length; ++i) {
      qualityArrays[keys[i]] = [];
    }
    
    // Проходим по инвентарю
    for (let i = 0; i < this.inventory.length; ++i) {
      const [invItemId] = this.inventory[i];

      // Если предмет уже есть в инвентаре
      if (itemId === invItemId) {
        isNewItem = false;
        ++this.inventory[i][1]; // Увеличиваем количество
      }

      // Ищем предмет в данных всех предметов
      for (let j = 0; j < itemsData.items.length; ++j) {
        const itemData = itemsData.items[j];
        if (invItemId === itemData.id) {
          // Добавляем предмет в массив по его качеству
          qualityArrays[itemData.type].push(this.inventory[i]);
        }
      }
    }

    // Если это новый предмет, добавляем его
    if (isNewItem) {
      for (let j = 0; j < itemsData.items.length; ++j) {
        const itemData = itemsData.items[j];
        if (itemId === itemData.id) {
          qualityArrays[itemData.type].push([itemId, 1]); // Новый предмет с количеством 1
        }
      }
    }

    // Очищаем инвентарь и добавляем все элементы из qualityArrays
    this.inventory = [];
    for (let i = 0; i < keys.length; ++i) {
      this.inventory.push(...qualityArrays[keys[i]]);
    }

    // Сохраняем изменения
    this.#save();
  }
  
  removeItem(removingItemId) {
    const userInventory = this.inventory;

    if (!itemsData.items[removingItemId]) {
      return "Указан неверный ID предмета.\n-# /inv - чтобы посмотреть свой инвентарь";
    }

    const newInv = [];
    let returningMessage = "";
    let itemSold = false;

    for (let i = 0; i < userInventory.length; ++i) {
      const [itemId, count] = userInventory[i];
      if (itemId === removingItemId) {
        
        if (count > 1) {
          --userInventory[i][1];
          newInv.push(userInventory[i]);
        }

        const sellFor = itemsData.items[removingItemId].price;
        
        this.balance += sellFor;
        returningMessage += sellFor;
        itemSold = true;
      } else {
        newInv.push(userInventory[i]);
      }
    }

    if (itemSold) {
      this.inventory = newInv;
      this.#save();
      return `Предмет продан за: ${returningMessage}`;
    } else {
      return "Указан неверный ID предмета.\n-# /inv - чтобы посмотреть свой инвентарь";
    }
  }

  #removeItemsImportant(removingItemsId) {
    const userInventory = this.inventory;
    const newInv = [];

    for (let i = 0; i < userInventory.length; ++i) {
      const [invItemId] = userInventory[i];
      let isSaveThisIte = true;

      for (let i = 0; i < removingItemsId.length; ++i) {
        const removingItemId = removingItemsId[i];
        if (invItemId === removingItemId) {
          isSaveThisIte = false;
          break;
        }
      }

      isSaveThisIte && newInv.push(userInventory[i]);
    }

    this.inventory = newInv;
    this.#save();
  }

  incrementBalance() {
    ++this.balance;
    this.#save();
  }

  async createInvImage() {
    const inv = this.inventory;
    const itemsId = [];
    let line = [];
    const maxItemsInLine = inv.length > 5 ? 5 : inv.length;

    const removingItemsId = [];
    for (let [itemId, count] of inv) {
      if (!itemsData.items[itemId]) {
        removingItemsId.push(itemId);
        continue;
      }
      
      line.push([itemsData.items[itemId], count]);
      if (line.length === maxItemsInLine) {
        itemsId.push(line);
        line = [];
      }
    }

    removingItemsId.length && this.#removeItemsImportant(removingItemsId);

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
        const [itemData, count] = itemsId[i][j];
        
        let itemBuffer = await itemData.createImage();
        itemBuffer = await ImgManager.addTextToImage(itemBuffer, `${count}`, width - 10, height - 40, 25, "#fffa", "end");
        itemBuffer = await ImgManager.addTextToImage(itemBuffer, `ID: ${itemData.id}`, 10, 4, 23, "#fff5", "start");

        const x = j * width + j * gap;
        const y = i * height + i * gap;

        background = await ImgManager.overlayImage(background, itemBuffer, x, y, width, height);
      }
    }

    return ImgManager.extend(background, {top: 14, left: 13, right: 13, bottom: 14});
  }
};

module.exports = UserData;
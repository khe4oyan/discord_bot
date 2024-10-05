const FileManager = require("./FileManager.js");
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
      } else {
        newInv.push(userInventory[i]);
      }
    }

    this.inventory = newInv;
    this.#save();
    return `Предмет продан за: ${returningMessage}`;
  }

  removeItemImportant(removingItemId) {
    const userInventory = this.inventory;

    if (itemsData.items[removingItemId]) { return; }

    const newInv = [];
    for (let i = 0; i < userInventory.length; ++i) {
      const [itemId] = userInventory[i];
      if (itemId !== removingItemId) {
        newInv.push(userInventory[i]);
      }
    }

    this.inventory = newInv;
    this.#save();
  }

  incrementBalance() {
    ++this.balance;
    this.#save();
  }
};

module.exports = UserData;
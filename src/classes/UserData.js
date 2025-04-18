const FileManager = require("./FileManager.js");
const ImgManager = require("./ImgManager.js");
const Item = require("./Item.js");
const itemsData = require("../data/itemsData.js");
const getItemDataById = require("../utils/getItemDataById.js");
const path = require("path");

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
    
    this.#findUserDataById();
  }

  #findUserDataById() {
    const loadedData = FileManager.load(`../../DB/guilds/${this.guildId}/${this.id}/data.txt`);
    if (loadedData) { 
      this.balance = loadedData?.balance;
      this.registerDate = loadedData?.registerDate;
      this.guildId = loadedData?.guildId;
      this.inventory = loadedData?.inventory ?? [];
    }
  }

  #save() {
    FileManager.save(`../../DB/guilds/${this.guildId}/${this.id}/data.txt`, this);
  }

  loadBoxOpeningData() {
    const loadedData = FileManager.load(`../../DB/guilds/${this.guildId}/${this.id}/boxOpeningCoolDown.txt`);
    return Object(loadedData);
  }

  saveBoxOpeningData(openingData) {
    FileManager.save(`../../DB/guilds/${this.guildId}/${this.id}/boxOpeningCoolDown.txt`, openingData);
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
          const newItemData = [itemId, 1];

          if (itemData.isUpgradeable) {
            newItemData.push(0);
          }
          
          qualityArrays[itemData.type].push(newItemData); // Новый предмет с количеством 1
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

  addItemAndRemoveBalance(count, itemId) {
    this.balance -= count;
    this.addItem(itemId);
  }
  
  removeItem(removingItemId) {
    const userInventory = this.inventory;
    let removingItemInd = null;
    {
      let itemDoesNotHave = true;

      for (let i = 0; i < itemsData.items.length; ++i) {
        if (itemsData.items[i].id === removingItemId) {
          removingItemInd = i;
          itemDoesNotHave = false;
          break;
        }
      }
  
      if (itemDoesNotHave) {
        return "Указан неверный ID предмета.\n-# /inv - чтобы посмотреть свой инвентарь";
      }
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

        const sellFor = itemsData.items[removingItemInd].price;
        
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
      return `Предмет продан за ${returningMessage} монет \n-# /bal - чтобы узнать свой баланс`;
    } else {
      return "Указан неверный ID предмета.\n-# /inv - чтобы посмотреть свой инвентарь";
    }
  }

  #removeItemsImportant(removingItemsId) {
    const userInventory = this.inventory;
    const newInv = [];

    for (let i = 0; i < userInventory.length; ++i) {
      const [invItemId] = userInventory[i];
      let isSaveThisItem = true;

      for (let i = 0; i < removingItemsId.length; ++i) {
        const removingItemId = removingItemsId[i];
        if (invItemId === removingItemId) {
          isSaveThisItem = false;
          break;
        }
      }

      isSaveThisItem && newInv.push(userInventory[i]);
    }

    this.inventory = newInv;
    this.#save();
  }

  incrementBalance() {
    ++this.balance;
    this.#save();
  }

  upgradeItemByInd(itemInd) {
    ++this.inventory[itemInd][2];
    this.#save();
  }

  removeItemCountById(itemId, count) {
    const userInv = this.inventory;
    const newInv = [];

    let isItemValid = false;
    
    for (let i = 0; i < userInv.length; ++i) {
      if (userInv[i][0] === itemId) {

        if (userInv[i][1] < count) {
          break;
        } else {
          if (userInv[i][1] > count) {
            userInv[i][1] -= count;
            newInv.push(userInv[i]);
          }
          isItemValid = true;
        }
      } else {
        newInv.push(userInv[i]);
      }
    }

    this.inventory = newInv;
    this.#save();
    return isItemValid;
  }

  async createInvImage() {
    const inv = this.inventory;
    const itemsId = [];
    let line = [];
    const maxItemsInLine = inv.length > 5 ? 5 : inv.length;

    const removingItemsId = [];
    
   for (let [itemId, count, upgradeLvl] of inv) {
      let isRemovingItem = true;

      const generalItemData = getItemDataById(itemId);
      if (generalItemData) {
        isRemovingItem = false;
          
        const data = [generalItemData, count];
        // если предмет улучшаемый
        if (upgradeLvl > -1) { 
          data.push(upgradeLvl);
        }

        line.push(data);
        if (line.length === maxItemsInLine) {
          itemsId.push(line);
          line = [];
        }
      }

      if (isRemovingItem) {
        removingItemsId.push(itemId);
        continue;
      }
    }

    // remove game removed items in inventory
    removingItemsId.length && this.#removeItemsImportant(removingItemsId);

    if (line.length > 0) {
      itemsId.push(line);
      line = [];
    } else {
      if (itemsId.length < 1) {
        return null;
      }
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
        const [itemData, count, upgradeLevel] = itemsId[i][j];
        
        let itemBuffer = await itemData.createImage(upgradeLevel);

        if (Number.isInteger(upgradeLevel)) {
          itemBuffer = await ImgManager.addTextToImage(itemBuffer, `lvl`, width - 13, 45, 22, itemData.type === Item.quality.ultimate ? "#000" : "#fffa", "end");
          itemBuffer = await ImgManager.addTextToImage(itemBuffer, (upgradeLevel === itemData.upgrades.length ? "M" : upgradeLevel), width - 13, 70, 20, itemData.type === Item.quality.ultimate ? "#000" : "#fffa", "end");

          // добавить иконку прокачиваемого предмета на картинку
          const upgradeIcon = await ImgManager.loadImg(path.join(__dirname, "../assets/img/quality/upgrade.png")).toBuffer();

          const itemBufferMeta = await ImgManager.loadImg(itemBuffer).metadata();
          itemBuffer = await ImgManager.overlayImage(itemBuffer, upgradeIcon, itemBufferMeta.width - 40, 10, 35, 35);
        }

        itemBuffer = await ImgManager.addTextToImage(itemBuffer, `${count}`, width - 10, height - 40, 25, itemData.type === Item.quality.ultimate ? "#000" : "#fffa", "end");

        itemBuffer = await ImgManager.addTextToImage(itemBuffer, `ID: ${itemData.id}`, 10, 4, 23, itemData.type === Item.quality.ultimate ? "#000" : "#fffa");
        itemBuffer = await ImgManager.addTextToImage(itemBuffer, `${itemData.price}$`, 10, height - 40, 23, itemData.type === Item.quality.ultimate ? "#000" : "#fffa");

        const x = j * width + j * gap;
        const y = i * height + i * gap;

        background = await ImgManager.overlayImage(background, itemBuffer, x, y, width, height);
      }
    }

    return ImgManager.extend(background, {top: 14, left: 13, right: 13, bottom: 14});
  }
};

module.exports = UserData;
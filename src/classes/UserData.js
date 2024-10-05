const FileManager = require("./FileManager.js");
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
    
    for (let i = 0; i < this.inventory.length; ++i) {
      const [id] = this.inventory[i];
      if (id === itemId) {
        ++this.inventory[i][1];
        isNewItem = false;
        break;
      }
    }

    if (isNewItem) {
      this.inventory.push([itemId, 1]);
    }

    this.#save();
  }
  
  removeItem(removingItemId) {
    const userInventory = this.inventory;

    const newInv = [];
    let removingItemIdIsValid = false;
    let returningMessage = "";

    for (let i = 0; i < userInventory.length; ++i) {
      const [itemId, count] = userInventory[i];
      if (itemId === removingItemId) {
        removingItemIdIsValid = true;

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

    if (removingItemIdIsValid) {
      this.inventory = newInv;
      this.#save();
      returningMessage = `Предмет продан за: ${returningMessage}`;
    } else {
      returningMessage = "Указан неверный ID предмета.\n-# /inv - чтобы посмотреть свой инвентарь"
    }

    return returningMessage;
  }

  incrementBalance() {
    ++this.balance;
    this.#save();
  }
};

module.exports = UserData;
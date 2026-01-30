const FileManager = require("./FileManager.js");
const ImgManager = require("./ImgManager.js");
const Item = require("./Item.js");
const itemsData = require("../data/itemsData.js");
const getItemDataById = require("../utils/getItemDataById.js");
const path = require("path");

class UserData {
  #save() {
    FileManager.save(
      `../../DB/guilds/${this.guildId}/${this.id}/data.txt`,
      this,
    );
  }

  loadBoxOpeningData() {
    const loadedData = FileManager.load(
      `../../DB/guilds/${this.guildId}/${this.id}/boxOpeningCoolDown.txt`,
    );
    return Object(loadedData);
  }

  saveBoxOpeningData(openingData) {
    FileManager.save(
      `../../DB/guilds/${this.guildId}/${this.id}/boxOpeningCoolDown.txt`,
      openingData,
    );
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

}

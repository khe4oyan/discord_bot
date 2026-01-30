const itemsData = require("../data/itemsData");
const UserRepo = require("../repository/UserRepo");

async function removeItemFromInventory(user, removingItemId) {
  const userInventory = user.items;
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
      return {
        msg: "Указан неверный ID предмета.\n-# /inv - чтобы посмотреть свой инвентарь",
      }
    }
  }

  const newInv = [];
  let sellFor = null;
  let itemSold = false;

  for (let i = 0; i < userInventory.length; ++i) {
    const [itemId, count] = userInventory[i];
    if (itemId === removingItemId) {
      if (count > 1) {
        --userInventory[i][1];
        newInv.push(userInventory[i]);
      }

      sellFor = itemsData.items[removingItemInd].price;
      
      await UserRepo.addBalance(user, sellFor);
      itemSold = true;
    } else {
      newInv.push(userInventory[i]);
    }
  }

  if (itemSold) {
    return {
      inv: newInv,
      msg: `Предмет продан за ${sellFor} монет \n-# /bal - чтобы узнать свой баланс`
    }
  } else {
    return {
      msg: "Указан неверный ID предмета.\n-# /inv - чтобы посмотреть свой инвентарь"
    };
  }
}

module.exports = removeItemFromInventory;
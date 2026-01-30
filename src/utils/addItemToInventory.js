// classes
const Item = require("../classes/Item");

// constants
const itemsData = require("../data/itemsData");

async function addItemToInventory(inventory, itemId) {
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
  for (let i = 0; i < inventory.length; ++i) {
    const [invItemId] = inventory[i];

    // Если предмет уже есть в инвентаре
    if (itemId === invItemId) {
      isNewItem = false;
      ++inventory[i][1]; // Увеличиваем количество
    }

    // Ищем предмет в данных всех предметов
    for (let j = 0; j < itemsData.items.length; ++j) {
      const itemData = itemsData.items[j];
      if (invItemId === itemData.id) {
        // Добавляем предмет в массив по его качеству
        qualityArrays[itemData.type].push(inventory[i]);
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
  inventory = [];
  for (let i = 0; i < keys.length; ++i) {
    inventory.push(...qualityArrays[keys[i]]);
  }

  return inventory;
}

module.exports = addItemToInventory;

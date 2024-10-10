const {items} = require("../data/itemsData");

module.exports = function getItemDataById(itemId) {
  for (let i = 0; i < items.length; ++i) {
    if (items[i].id === itemId) {
      return items[i];
    }
  }

  return null;
}
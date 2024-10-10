const Box = require("../classes/Box.js");

const boxesData = {
  boxes: [
    new Box("Прокачиваемая Роза", "#B22B61", "#FFDDEE")
      .addNewItem(11, 5)
      .addNewItem(10, 100)
      .setAvailable(10, 12)
      .setPrice(500),

    new Box("Ящик с барахлом")
      .addNewItem(9, 5)
      .addNewItem(8, 5)
      .addNewItem(7, 10)
      .addNewItem(6, 10)
      .addNewItem(4, 15)
      .addNewItem(3, 15)
      .addNewItem(1, 15)
      .addNewItem(2, 15)
      .addNewItem(0, 15)
      .addNewItem(5, 16)
      .setIsActive()
      .setPrice(10),
  ],
};

module.exports = boxesData;

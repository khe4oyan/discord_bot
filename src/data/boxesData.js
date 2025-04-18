const Box = require("../classes/Box.js");

const boxesData = {
  boxes: [
    new Box("Прокачиваемая Роза", 1, "#B22B61", "#FFDDEE")
      .addNewItem(0, 11)
      .addNewItem(1, 100)
      .setAvailableBefore(10, 12)
      .setCoolDown(1)
      .setPrice(200),

    new Box("Ящик с барахлом", 0)
      .addNewItem(9, 40)
      .addNewItem(8, 70)
      .addNewItem(5, 100)
      .addNewItem(3, 100)
      .addNewItem(5, 100)
      .addNewItem(2, 100)
      .setCoolDown(.25)
      .setIsActive()
      .setPrice(50),
  ],
};

module.exports = boxesData;

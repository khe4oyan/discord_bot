const Box = require("../classes/Box.js");

const boxesData = {
  boxes: [
    new Box("Ящик с барахлом")
      .addNewItem(9, 5) // Кожаная куртка
      .addNewItem(8, 5) // Кожаная куртка
      .addNewItem(7, 10) // Кожаная куртка
      .addNewItem(6, 10) // Серебряная ложка
      .addNewItem(4, 15) // Старая лампочка
      .addNewItem(3, 15) // Глиняная кружка
      .addNewItem(1, 15) // Пластиковый стакан
      .addNewItem(2, 15) // Старая газета
      .addNewItem(0, 15) // Деревянная ложка
      .addNewItem(5, 15) // Кусок доски
      .setIsActive()
      .setPrice(10), // Цена открытия ящика
  ],
};

module.exports = boxesData;

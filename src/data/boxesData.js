const Box = require("../classes/Box.js");

const boxesData = {
  boxes: [
    new Box("Простой ящик")
      .addNewItem(7, 5) // Кожаная куртка
      .addNewItem(4, 10) // Старая лампочка
      .addNewItem(3, 15) // Глиняная кружка
      .addNewItem(1, 20) // Пластиковый стакан
      .addNewItem(2, 25) // Старая газета
      .addNewItem(0, 30) // Деревянная ложка
      .setIsActive()
      .setPrice(10), // Цена открытия ящика

    new Box("Антикварный ящик")
			.addNewItem(9, 15) // Золотое кольцо
			.addNewItem(8, 20) // Позолоченный браслет
			.addNewItem(6, 100) // Серебряная ложка
      .setIsActive()
      .setPrice(100), // Цена открытия ящика

    new Box("Строительный ящик")
			.addNewItem(5, 100) // Кусок доски
      .setIsActive()
      .setPrice(15), // Цена открытия ящика
  ],
};

module.exports = boxesData;

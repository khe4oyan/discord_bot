const Item = require("../classes/Item");

/*
  ultimate: "Золотой", // gold
  legendary: "Легендарный", // red
  epic: "Эпический", // pink
  elite: "Элитный", // purple
  rare: "Редкий", // blue
  special: "Специальный", // green
  classic: "Обычный", // gray
*/

const itemsData = {
  items: [
    // никогда не менять последовательность предметов
    new Item("Деревянная ложка", 10, Item.quality.classic, "lojka.png"),
    new Item("Пластиковый стакан", 5, Item.quality.classic, "plastic_stakan.png"),
    new Item("Старая газета", 1, Item.quality.classic, "newsPaper.png"),
    new Item("Глиняная кружка", 6, Item.quality.classic, "glin_stakan.png"),
    new Item("Старая лампочка", 4, Item.quality.classic, "lamp.png"),
    new Item("Кусок доски", 7, Item.quality.classic, "doska.png"),
    new Item("Серебряная ложка", 50, Item.quality.rare, "lojka_serebro.png"),
    new Item("Кожаная куртка", 60, Item.quality.rare, "kurtka.png"),
    new Item("Позолоченный браслет", 80, Item.quality.rare, "braslet.png"),
    new Item("Золотое кольцо", 100, Item.quality.rare, "kolco.png"),
  ],

  shop: [9, 8, 7, 6],
};

module.exports = itemsData;

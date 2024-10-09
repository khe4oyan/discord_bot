const Item = require("../classes/Item");
const ItemUpgrade = require("../classes/ItemUpgrade");

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
    new Item("Серебряная ложка", 50, Item.quality.special, "lojka_serebro.png"),
    new Item("Кожаная куртка", 60, Item.quality.special, "kurtka.png"),
    new Item("Позолоченный браслет", 70, Item.quality.rare, "braslet.png"),
    new Item("Золотое кольцо", 100, Item.quality.rare, "kolco.png"),

    // 10
    new Item("Лепестки Розы", 250, Item.quality.rare, "rose_upgrader.png"),
    new ItemUpgrade("Роза", 1000, Item.quality.elite)
      .addLevel(10, 5, "rose_level_1.png")
      .addLevel(10, 10, "rose_level_2.png")
      .addLevel(10, 20, "rose_level_3.png")
  ],

  shop: [9, 8, 7, 6],
};

module.exports = itemsData;

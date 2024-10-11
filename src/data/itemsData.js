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
    new Item("Старая лампочка", 4, Item.quality.classic, "lamp.png"),
    new Item("Кусок доски", 7, Item.quality.classic, "doska.png"),
    new Item("Серебряная ложка", 50, Item.quality.special, "lojka_serebro.png"),
    new Item("Кожаная куртка", 60, Item.quality.special, "kurtka.png"),
    new Item("Позолоченный браслет", 70, Item.quality.rare, "braslet.png"),
    new Item("Золотое кольцо", 100, Item.quality.rare, "kolco.png"),
    new Item("Лепестки Розы", 120, Item.quality.rare, "rose_upgrader.png"),

    // 10
    new ItemUpgrade("Роза", 500, Item.quality.elite)
      .addLevel(9, 1, "rose_level_1.png")
      .addLevel(9, 2, "rose_level_2.png")
      .addLevel(9, 4, "rose_level_3.png")
  ],

  // прокачиваемым предметам нельзя в магазин
  shop: [9, 8, 7, 6],
};

module.exports = itemsData;

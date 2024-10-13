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

// никогда не менять последовательность предметов
const itemsData = {
  // прокачиваемым предметам нельзя в магазин
  shop: [8, 7, 6],

  items: [
    // 0 - id
    new ItemUpgrade("Роза", 500, Item.quality.elite, "rose_level_0.png")
      .addLevel(8, 1, "rose_level_1.png")
      .addLevel(8, 2, "rose_level_2.png"),
    new Item("Лепестки Розы", 120, Item.quality.rare, "rose_upgrader.png"),
    new Item("Деревянная ложка", 10, Item.quality.classic, "lojka.png"),
    new Item("Пластиковый стакан", 5, Item.quality.classic, "plastic_stakan.png"),
    new Item("Старая газета", 1, Item.quality.classic, "newsPaper.png"),

    // 5 - id
    new Item("Старая лампочка", 4, Item.quality.classic, "lamp.png"),
    new Item("Кусок доски", 7, Item.quality.classic, "doska.png"),
    new Item("Серебряная ложка", 50, Item.quality.special, "lojka_serebro.png"),
    new Item("Кожаная куртка", 60, Item.quality.special, "kurtka.png"),
    new Item("Позолоченный браслет", 70, Item.quality.rare, "braslet.png"),
  ],
};

module.exports = itemsData;

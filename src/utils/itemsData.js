const Item = require("../classes/Item");
const Box = require("../classes/Box");

const itemsData = {
  items: [
		// никогда не менять последовательность предметов
    new Item("Кейс", 300, Item.quality.special, "case.png"),
    new Item("Цветок", 5, Item.quality.classic, "flower.png"),
    new Item("Ваза", 3, Item.quality.classic, "vase.png"),
    new Item("Цветок в вазе", 20, Item.quality.special, "flower_in_vase.png", [[2, 1], [3, 1]]),
  ],

	boxes: [
		new Box("Ящик с розой")
			.addNewItem(3, 10)
			.addNewItem(1, 100)
			.addNewItem(2, 100)
			.setIsActive()
			.setPrice(0),
	],
	
	shop: [], // TODO: implement only for infinity buy limit items id
};

module.exports = itemsData;

const Item = require("../classes/Item");
const Box = require("../classes/Box");

const itemsData = {
  items: [
		// никогда не менять последовательность предметов
    new Item("Кейс", 0, 500, Item.quality.special, "case.png"),
    new Item("Цветок", 2, 1, Item.quality.classic, "flower.png"),
    new Item("Ваза", 4, 3, Item.quality.classic, "vase.png"),
    new Item("Цветок в вазе", 0, 20, Item.quality.special, "flower_in_vase.png", [[2, 1], [3, 1]]),
  ],

	boxes: [
		new Box("Ящик с розой", "default")
			.addNewItem(3, 10)
			.addNewItem(1, 100)
			.addNewItem(2, 100)
			.setIsActive()
			.setPrice(10),
		],
	
	shop: [], // TODO: implement (use limit(Infinity - if unlimit))
};

module.exports = itemsData;

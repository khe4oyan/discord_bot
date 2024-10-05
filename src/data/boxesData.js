const Box = require('../classes/Box.js');

const boxesData = {
  boxes: [
		new Box("Ящик с цветами")
		.addNewItem(3, 10)
		.addNewItem(1, 100)
		.addNewItem(2, 100)
		.setIsActive()
		.setPrice(10),
	],
};

module.exports = boxesData;
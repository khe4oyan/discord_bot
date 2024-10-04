const Box = require('../classes/Box.js');

const boxesData = {
  boxes: [
		new Box("Ящик с розой")
			.addNewItem(3, 10)
			.addNewItem(1, 100)
			.addNewItem(2, 100)
			.setIsActive()
			.setPrice(0),
	],
};

module.exports = boxesData;
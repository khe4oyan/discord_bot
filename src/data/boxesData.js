const Box = require('../classes/Box.js');

const boxesData = {
  boxes: [
		new Box("Ящик с розой")
			.addNewItem(3, 10)
			.addNewItem(1, 100)
			.addNewItem(2, 100)
			.setIsActive()
			.setPrice(0),

		new Box("Всячина")
			.addNewItem(4, 1)
			.addNewItem(5, 10)
			.addNewItem(6, 100)
			.addNewItem(3, 1000)
			.addNewItem(1, 1000)
			.addNewItem(2, 1000)
			.setIsActive()
			.setPrice(0),
		
		new Box("Кейс")
			.addNewItem(0, 100)
			.setIsActive()
			.setPrice(0)
	],
};

module.exports = boxesData;
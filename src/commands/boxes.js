const itemsData = require("../utils/itemsData.js");
// const path = require("path");

module.exports = {
	name: 'boxes',
	description: 'Показать список ящиков',
	execute: async (interaction) => {
		if (itemsData.boxes.length > 0) {
			await interaction.deferReply();
			
			const boxImages = [];

			for (let i = 0; i < itemsData.boxes.length; ++i) {
				const box = itemsData.boxes[i];
				if (!box.isActive) { continue; }

				// showedBoxes += `## ${box.name} \`${box.id}\` \n`;
				// showedBoxes += `Цена: ${box.price}\n`;
				// showedBoxes += `-# /open ${box.id} - чтобы открыть этот ящик\n`;

				const boxImage = await box.createImage();
				boxImages.push(boxImage);
			}
			
			if (boxImages.length < 1) {
				return await interaction.editReply("Ящиков пока нет");
			}

			await interaction.editReply("(показать все ящики с их шансами выпадения предметов друг под другом)");

			// TODO: create image where entered image, price, id, and items(max 4 or 9)
			// await interaction.editReply({files: [imgPath]});
		} else {
			await interaction.reply("Нету активных ящиков");
		}
	},
};
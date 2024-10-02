const itemsData = require('../DB/itemsData.js');
// const path = require("path");

module.exports = {
	name: 'boxes',
	description: 'Показать список ящиков',
	execute: async (interaction) => {
		if (itemsData.boxes.length > 0) {
			await interaction.deferReply();
			let showedBoxes = '';
			
			for (let i = 0; i < itemsData.boxes.length; ++i) {
				const box = itemsData.boxes[i];
				if (!box.isActive) { continue; }

				showedBoxes += `## ${box.name} \`${box.id}\` \n`;
				showedBoxes += `Цена: ${box.price}\n`;
				showedBoxes += `-# /open ${box.id} - чтобы открыть этот ящик\n`;
			}
			
			await interaction.editReply(showedBoxes || "Ящиков пока нет");

			// TODO: create image where entered image, price, id, and items(max 4 or 9)
			// const imgPath = path.join(__dirname, `../assets/img/boxes/${itemsData.boxes[0]}`);
			// await interaction.editReply({files: [imgPath]});
		} else {
			await interaction.reply("Нету активных ящиков");
		}
	},
};
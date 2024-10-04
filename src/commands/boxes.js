const ImgManager = require("../classes/ImgManager.js");
const boxesData = require("../utils/boxesData.js");

module.exports = {
	name: 'boxes',
	description: 'Показать список ящиков',
	execute: async (interaction) => {
		if (boxesData.boxes.length > 0) {
			await interaction.deferReply();
			
			const boxImages = [];

			for (let i = 0; i < boxesData.boxes.length; ++i) {
				const box = boxesData.boxes[i];
				if (!box.isActive) { continue; }

				const boxImage = await box.createImage();
				boxImages.push(boxImage);
			}
			
			if (boxImages.length < 1) {
				return await interaction.editReply("Ящиков пока нет");
			}

			// TODO: join all boxes
			await interaction.editReply({files: [ImgManager.createAttachmentDiscord(boxImages[0])]});
		} else {
			await interaction.reply("Нету активных ящиков");
		}
	},
};
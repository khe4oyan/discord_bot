const ImgManager = require("../classes/ImgManager.js");
const boxesData = require("../data/boxesData.js");

module.exports = {
	name: 'boxes',
	description: 'Показать список ящиков',
	async execute(interaction) {
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

			const boxExampleMeta = await ImgManager.loadImg(boxImages[0]).metadata();

			let result = await ImgManager.createImage(boxExampleMeta.width, 1, "#0000");

			for (let i = 0; i < boxImages.length; ++i) {
				const metaData = await ImgManager.loadImg(boxImages[i]).metadata();
				result = await ImgManager.extend(result, {bottom: metaData.height});
				const resultData = await ImgManager.loadImg(result).metadata();
				result = await ImgManager.overlayImage(result, boxImages[i], 0, resultData.height - metaData.height, resultData.width, metaData.height);
			}

			await interaction.editReply({ content: "## Ящики \n-# /open [id] - чтобы открыть ящик", files: [ImgManager.createAttachmentDiscord(result)]});
		} else {
			await interaction.reply("Нету активных ящиков");
		}
	},
};
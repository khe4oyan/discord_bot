// classes
const ImgManager = require("../classes/ImgManager.js");
const UserRepo = require("../repository/UserRepo.js");

// utils
const createInvImage = require("../utils/createInvImage.js");

module.exports = {
	name: 'inv',
	description: 'Показать инвентарь',
	async execute(interaction) {
		await interaction.deferReply();
		const user = await UserRepo.getUserData(interaction.user.id);

		if (user.items.length > 0) {
			const invImage = await createInvImage(user.items);

			if (invImage) {
				const attachment = ImgManager.createAttachmentDiscord(invImage);
				await interaction.editReply({ content: "## Инвентарь \n-# /sell [id] - чтобы продать предмет", files: [attachment]});
			} else {
				await interaction.editReply("В инвентаре пусто");
			}
		} else {
			await interaction.editReply('В инвентаре пусто');
		}
	}
};
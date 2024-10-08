const UserData = require("../classes/UserData.js");
const ImgManager = require("../classes/ImgManager.js");

module.exports = {
	name: 'inv',
	description: 'Показать инвентарь',
	async execute(interaction) {
		await interaction.deferReply();
		const user = new UserData(interaction.user, interaction.guildId);

		if (user.inventory.length > 0) {
			const invImage = await user.createInvImage();
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
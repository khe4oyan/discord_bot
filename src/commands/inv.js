const UserData = require("../classes/UserData.js");
const ImgManager = require("../classes/ImgManager.js");

module.exports = {
	name: 'inv',
	description: 'Показать инвентарь',
	async execute(interaction) {
		await interaction.deferReply();
		const user = new UserData(interaction.user, interaction.guildId);

		if (user.inventory.length > 0) {
      const attachment = ImgManager.createAttachmentDiscord(await user.createInvImage());
	    await interaction.editReply({ content: "## Инвентарь \n-# /sell [id] - чтобы продать предмет", files: [attachment]});
		} else {
			await interaction.editReply('В инвентаре пусто');
		}
	}
};
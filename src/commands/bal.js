const UserData = require("../classes/UserData.js");

module.exports = {
	name: 'bal',
	description: 'Показать баланс',
	async execute(interaction) {
		await interaction.deferReply();
		const balance = new UserData(interaction.user, interaction.guildId).balance;
		await interaction.editReply(`Баланс: ${balance}`);
	}
};
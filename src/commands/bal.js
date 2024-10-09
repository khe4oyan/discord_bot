const UserData = require("../classes/UserData.js");

module.exports = {
	name: 'bal',
	description: 'Узнай сколько у тебя монет',
	async execute(interaction) {
		await interaction.deferReply();
		const balance = new UserData(interaction.user, interaction.guildId).balance;
		await interaction.editReply(`У тебя ${balance} монет`);
	}
};
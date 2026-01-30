// repo
const UserRepo = require("../repository/UserRepo.js");

module.exports = {
	name: 'bal',
	description: 'Узнай сколько у тебя монет',
	async execute(interaction) {
		await interaction.deferReply();
		const balance = await UserRepo.getBalance(interaction.user) ?? 0;

		await interaction.editReply(`У тебя ${balance} монет`);
	}
};
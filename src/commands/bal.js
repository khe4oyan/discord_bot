module.exports = {
	name: 'bal',
	description: 'Узнай сколько у тебя монет',
	async execute(interaction) {
		await interaction.deferReply();
		// TODO: get user balance
		// interaction.user.id
		const balance = 0;

		await interaction.editReply(`У тебя ${balance} монет`);
	}
};
const UserData = require("../classes/UserData");
const itemsData = require("../utils/itemsData.js");

module.exports = {
	name: 'inv',
	description: 'Показать инвентарь',
	execute: async (interaction) => {
		await interaction.deferReply();
		const user = new UserData(interaction.user, interaction.guildId);

		if (user.inventory.length > 0) {
			await showInventory(interaction, user.inventory);
		} else {
			await interaction.editReply('В инвентаре пусто');
		}
	}
};

async function showInventory(interaction, inv) {
	const allItemsData = itemsData.items;

	let inventoryStr = "";

	for (const itemInv of inv) {
		const [itemId, count] = itemInv;

		for (const allItemData of allItemsData) {
			if (itemId === allItemData.id) {
				inventoryStr += `### ${allItemData.name} (x${count})\n`;
				inventoryStr += `-# /sell ${itemId} - чтобы продать за ${allItemData.price}\n`;
				break;
			}
		}
	}

	// TODO: create image with user inventory

	await interaction.editReply(inventoryStr);
}
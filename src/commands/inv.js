const itemsData = require("../data/itemsData.js");
const UserData = require("../classes/UserData.js");
const ImgManager = require("../classes/ImgManager.js");

module.exports = {
	name: 'inv',
	description: 'Показать инвентарь',
	execute: async (interaction) => {
		await interaction.deferReply();
		const user = new UserData(interaction.user, interaction.guildId);

		if (user.inventory.length > 0) {
			await showInventory(interaction, user);
		} else {
			await interaction.editReply('В инвентаре пусто');
		}
	}
};

async function showInventory(interaction, inv) {
	const attachment = ImgManager.createAttachmentDiscord(await createInvImage(inv));
	await interaction.editReply({ content: "## Инвентарь \n-# /sell [id] - чтобы продать предмет", files: [attachment]});
}

async function createInvImage(user) {
  const inv = user.inventory;
	const itemsId = [];
    let line = [];
		const maxItemsInLine = inv.length > 5 ? 5 : inv.length;

    const removingItemsId = [];
    for (let [itemId, count] of inv) {
      if (!itemsData.items[itemId]) {
        removingItemsId.push(itemId);
        continue;
      }
      
			line.push([itemsData.items[itemId], count]);
			if (line.length === maxItemsInLine) {
				itemsId.push(line);
				line = [];
			}
    }

    removingItemsId.length && user.removeItemsImportant(removingItemsId);

    if (line.length > 0) {
      itemsId.push(line);
      line = [];
    }
    
    // get item image width, height
    const {width, height} = await (async () => {
      const image = await itemsId[0][0][0].createImage();
      return ImgManager.loadImg(image).metadata();
    })()
    

    const gap = 10;
    const colls = ((width * maxItemsInLine) + (maxItemsInLine * gap));
    const rows = (height * itemsId.length + (itemsId.length * gap));

    let background = await ImgManager.createImage(colls, rows, "#0000");
    
    for (let i = 0; i < itemsId.length; ++i) {
      for (let j = 0; j < itemsId[i].length; ++j) {
        const [itemData, count] = itemsId[i][j];
        
        let itemBuffer = await itemData.createImage();
        itemBuffer = await ImgManager.addTextToImage(itemBuffer, `${count}`, width - 10, height - 40, 25, "#fffa", "end");
        itemBuffer = await ImgManager.addTextToImage(itemBuffer, `ID: ${itemData.id}`, 10, 4, 23, "#fff5", "start");

        const x = j * width + j * gap;
        const y = i * height + i * gap;

        background = await ImgManager.overlayImage(background, itemBuffer, x, y, width, height);
      }
    }

    return ImgManager.extend(background, {top: 14, left: 13, right: 13, bottom: 14});
}
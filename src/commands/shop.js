const { items, shop } = require("../data/itemsData"); 
const ImgManager = require("../classes/ImgManager.js");

// shop is items index array

module.exports = {
  name: "shop",
  description: "Показать какие предметы в продаже",
  async execute(interaction) {
    await interaction.deferReply();

    const itemsId = [];
    let line = [];
    const maxItemsInLine = shop.length > 4 ? 4 : shop.length;

    for (let i = 0; i < shop.length; ++i) {
      for (let j = 0; j < items.length; ++j) {
        if (items[j].id === shop[i]) {
          line.push(items[shop[i]]);
          if (line.length === maxItemsInLine) {
            itemsId.push(line);
            line = [];
          }
          break;
        }
      }
    }

    if (line.length > 0) {
      itemsId.push(line);
      line = [];
    }
    
    // get item image width, height
    const {width, height} = await (async () => {
      const image = await itemsId[0][0].createImage();
      return ImgManager.loadImg(image).metadata();
    })()

    const gap = 10;
    const colls = ((width * maxItemsInLine) + (maxItemsInLine * gap));
    const rows = (height * itemsId.length + (itemsId.length * gap));

    let result = await ImgManager.createImage(colls, rows, "#0000");
    
    for (let i = 0; i < itemsId.length; ++i) {
      for (let j = 0; j < itemsId[i].length; ++j) {
        const itemData = itemsId[i][j];
        let itemBuffer = await itemData.createImage();
        itemBuffer = await ImgManager.addTextToImage(itemBuffer, `${itemData.price}$`, 10, height - 40, 25, "#fffa");
        itemBuffer = await ImgManager.addTextToImage(itemBuffer, `ID: ${itemData.id}`, 10, 4, 23, "#fff5");

        const x = j * width + j * gap;
        const y = i * height + i * gap;

        result = await ImgManager.overlayImage(result, itemBuffer, x, y, width, height);
      }
    }

    result = await ImgManager.extend(result, {top: 14, left: 13, bottom: 14, right: 13});
    await interaction.editReply({content: "## Магазин \n-# /buy [id] - чтобы купить предмет", files: [result]});
  }
}
// classes
const ImgManager = require("../classes/ImgManager.js");
const Item = require("../classes/Item.js");

// utils
const getItemDataById = require("../utils/getItemDataById.js");

async function createInvImage(inputInv) {
  const inv = [...inputInv];
  const itemsId = [];
  let line = [];
  const maxItemsInLine = inv.length > 5 ? 5 : inv.length;
  const removingItemsId = [];

  for (let [itemId, count, upgradeLvl] of inv) {
    let isRemovingItem = true;

    const generalItemData = getItemDataById(itemId);
    if (generalItemData) {
      isRemovingItem = false;

      const data = [generalItemData, count];
      // если предмет улучшаемый
      if (upgradeLvl > -1) {
        data.push(upgradeLvl);
      }

      line.push(data);
      if (line.length === maxItemsInLine) {
        itemsId.push(line);
        line = [];
      }
    }

    if (isRemovingItem) {
      removingItemsId.push(itemId);
      continue;
    }
  }

  // remove game removed items in inventory
  if (removingItemsId.length ){ 
    inv = removeItemsImportant(inv, removingItemsId);
  }

  if (line.length > 0) {
    itemsId.push(line);
    line = [];
  } else {
    if (itemsId.length < 1) {
      return null;
    }
  }

  // get item image width, height
  const { width, height } = await (async () => {
    const image = await itemsId[0][0][0].createImage();
    return ImgManager.loadImg(image).metadata();
  })();

  const gap = 10;
  const colls = width * maxItemsInLine + maxItemsInLine * gap;
  const rows = height * itemsId.length + itemsId.length * gap;

  let background = await ImgManager.createImage(colls, rows, "#0000");

  for (let i = 0; i < itemsId.length; ++i) {
    for (let j = 0; j < itemsId[i].length; ++j) {
      const [itemData, count, upgradeLevel] = itemsId[i][j];

      let itemBuffer = await itemData.createImage(upgradeLevel);

      if (Number.isInteger(upgradeLevel)) {
        itemBuffer = await ImgManager.addTextToImage(
          itemBuffer,
          `lvl`,
          width - 13,
          45,
          22,
          itemData.type === Item.quality.ultimate ? "#000" : "#fffa",
          "end",
        );
        itemBuffer = await ImgManager.addTextToImage(
          itemBuffer,
          upgradeLevel === itemData.upgrades.length ? "M" : upgradeLevel,
          width - 13,
          70,
          20,
          itemData.type === Item.quality.ultimate ? "#000" : "#fffa",
          "end",
        );

        // добавить иконку прокачиваемого предмета на картинку
        const upgradeIcon = await ImgManager.loadImg(
          path.join(__dirname, "../assets/img/quality/upgrade.png"),
        ).toBuffer();

        const itemBufferMeta = await ImgManager.loadImg(itemBuffer).metadata();
        itemBuffer = await ImgManager.overlayImage(
          itemBuffer,
          upgradeIcon,
          itemBufferMeta.width - 40,
          10,
          35,
          35,
        );
      }

      itemBuffer = await ImgManager.addTextToImage(
        itemBuffer,
        `${count}`,
        width - 10,
        height - 40,
        25,
        itemData.type === Item.quality.ultimate ? "#000" : "#fffa",
        "end",
      );

      itemBuffer = await ImgManager.addTextToImage(
        itemBuffer,
        `ID: ${itemData.id}`,
        10,
        4,
        23,
        itemData.type === Item.quality.ultimate ? "#000" : "#fffa",
      );
      itemBuffer = await ImgManager.addTextToImage(
        itemBuffer,
        `${itemData.price}$`,
        10,
        height - 40,
        23,
        itemData.type === Item.quality.ultimate ? "#000" : "#fffa",
      );

      const x = j * width + j * gap;
      const y = i * height + i * gap;

      background = await ImgManager.overlayImage(
        background,
        itemBuffer,
        x,
        y,
        width,
        height,
      );
    }
  }

  return ImgManager.extend(background, {
    top: 14,
    left: 13,
    right: 13,
    bottom: 14,
  });
}

function removeItemsImportant(inv, removingItemsId) {
  const newInv = [];

  for (let i = 0; i < inv.length; ++i) {
    const [invItemId] = inv[i];
    let isSaveThisItem = true;

    for (let i = 0; i < removingItemsId.length; ++i) {
      const removingItemId = removingItemsId[i];
      if (invItemId === removingItemId) {
        isSaveThisItem = false;
        break;
      }
    }

    isSaveThisItem && newInv.push(inv[i]);
  }

  return newInv;
}

module.exports = createInvImage;
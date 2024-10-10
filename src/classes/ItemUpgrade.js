const Item = require("./Item");

// never expired
class ItemUpgrade extends Item {
  isUpgradeable;
  upgrades;

  constructor(name, price, type) {
    super(name, price, type, null);
    this.isUpgradeable = true;
    this.upgrades = [];
  }

  addLevel(upgradeItemId, upgradeItemCount, img) {
    if (this.img === null) {this.img = img;}
    this.upgrades.push({img, upgradeItemId, upgradeItemCount});
    return this;
  }

  async createImage(upgradeLevel) {
    const upgrade = this.upgrades[upgradeLevel - 1];
    
    if (upgrade) {
      this.img = upgrade.img;
    }
    
    return await super.createImage();
  }
}

module.exports = ItemUpgrade;
class Box {
  static indexCounter = 0;
  id;
  name;
  img;
  price;
  items;
  isActive;

  constructor(boxName, img) {
    this.id = Box.indexCounter++;
    this.name = boxName;
    this.img = img;
    this.price = 0;
    this.items = new Map();
    this.isActive = false;
  }

  setPrice(price) {
    this.price = price;
    return this;
  }

  addNewItem(itemId, chance) {
    if (this.items.has(chance)) {
      const chanceArr = this.items.get(chance);
      chanceArr.push(itemId);
    } else {
      this.items.set(chance, [itemId]);
    }

    return this;
  }

  dropItemId() {
    // 1. Суммируем все шансы
    let totalChance = 0;
    for (let chance of this.items.keys()) {
      totalChance += chance;
    }

    // 2. Генерируем случайное число от 0 до totalChance
    let random = Math.random() * totalChance;

    // 3. Ищем, в какой диапазон попало случайное число
    let accumulatedChance = 0;
    for (let [chance, itemIds] of this.items.entries()) {
      accumulatedChance += chance;
      if (random < accumulatedChance) {
        // Возвращаем случайный предмет из массива предметов с данным шансом
        const randomIndex = Math.floor(Math.random() * itemIds.length);
        return itemIds[randomIndex];
      }
    }
  }

  setIsActive() {
    this.isActive = true;
    return this;
  }
}

module.exports = Box;

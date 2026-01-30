function removeItemCountById(user, itemId, count) {
  const userInv = user.items;
  const newInv = [];

  let isItemValid = false;

  for (let i = 0; i < userInv.length; ++i) {
    if (userInv[i][0] === itemId) {
      if (userInv[i][1] < count) {
        break;
      } else {
        if (userInv[i][1] > count) {
          userInv[i][1] -= count;
          newInv.push(userInv[i]);
        }
        isItemValid = true;
      }
    } else {
      newInv.push(userInv[i]);
    }
  }

  return { isItemValid, newInv };
}

module.exports = removeItemCountById;
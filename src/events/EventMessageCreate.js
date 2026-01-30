// repo
const UserRepo = require("../repository/UserRepo.js");

const processingUsers = new Set();

module.exports = async function EventMessageCreate(message) {
  console.log("[EVENT]: Message");
  
  const userId = message.author.id;
  if (message.content[0] === "/") return;

  if (processingUsers.has(userId)) { return; }
  processingUsers.add(userId);

  if (message.author.bot) return;

  try {
    await UserRepo.incrementBalance(message.author);
  } catch (error) {
    console.log("[CRITICAL ERROR]", error.message);
  }
  
  processingUsers.delete(userId);
};

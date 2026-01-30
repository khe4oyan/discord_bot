// repo
const UserRepo = require("../repository/UserRepo.js");

// users processes
const processingUsers = new Set();

module.exports = async function EventMessageCreate(message) {
  console.log("[EVENT]: Message");
  
  const userId = message.author.id;
  if (message.content[0] === "/") return;

  if (processingUsers.has(userId)) { return; }
  processingUsers.add(userId);

  if (message.author.bot) return;

  try {
    const user = {...message.author};
    user.discord_id = message.author.id;
    await UserRepo.addBalance(user, 1);
  } catch (error) {
    console.log("[CRITICAL ERROR]", error.message, error.stack);
  }
  
  processingUsers.delete(userId);
};

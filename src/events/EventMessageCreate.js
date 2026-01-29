const processingUsers = new Set();

module.exports = async function EventMessageCreate(message) {
  const userId = message.author.id;

  if (processingUsers.has(userId)) { return; }
  processingUsers.add(userId);

  if (message.author.bot) return;
  
  // TODO: increment balance
  console.log(message.author.id);
  
  processingUsers.delete(userId);
};

const processingUsers = new Set();
const commandsReader = require("../utils/commandsReader.js");

module.exports = async function EventInteractionCreate(interaction) {  
  // direct message check
  if (!interaction.member) {
    return await interaction.reply("Не работает в личных собщениях");
  }

  // check user in processing
  const userId = interaction.user.id;
  if (processingUsers.has(userId)) {
    return await interaction.reply({content: "Предыдущий запрос еще обрабатывается", ephemeral: true});
  }

  processingUsers.add(userId);

  // command
  if (interaction.isCommand()) {
    const { collection } = commandsReader();
    const command = collection.get(interaction.commandName);
    if (!command) return;

    await command.execute(interaction);
  }

  // button
  else if (interaction.isButton()) {
    console.log("[Interaction:button]");
  }

  processingUsers.delete(userId);
}

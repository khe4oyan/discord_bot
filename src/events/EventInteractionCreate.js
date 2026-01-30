const commandsReader = require("../utils/commandsReader.js");

const processingUsers = new Set();

module.exports = async function EventInteractionCreate(interaction) {  
  console.log("[EVENT]: Interaction");
  
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
    
    try {
      await command.execute(interaction);
    } catch (error) {
      interaction.editReply({ content: "(Произошла какая-то ошибка)", ephemeral: true });
      console.log("[CRITYCAL ERROR]", error.message, error.stack);      
    }
  }else if (interaction.isButton()) {
    console.log("[Interaction:button]");
  }

  processingUsers.delete(userId);
}

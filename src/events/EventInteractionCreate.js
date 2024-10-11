const processingUsers = new Set();

module.exports = async function EventInteractionCreate(interaction, client) {
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
    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
      await command.execute(interaction);
    } catch (error) {
      await interaction.reply({
        content: "Произошла ошибка при выполнении команды.",
        ephemeral: true,
      });
    }
  }

  // button
  else if (interaction.isButton()) {
    console.log("[Interaction:button]");
  }

  processingUsers.delete(userId);
}

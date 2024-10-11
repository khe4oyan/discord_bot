module.exports = async function EventInteractionCreate(interaction, client) {
  // direct message check
  if (!interaction.member) {
    await interaction.reply("Не работает в личных собщениях");
    return;
  }
  
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
}

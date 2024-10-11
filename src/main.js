require("dotenv").config();
const { Client, GatewayIntentBits, Collection, Events } = require("discord.js");

// events
const EventInteractionCreate = require("./events/EventInteractionCreate.js");
const EventMessageCreate = require("./events/EventMessageCreate.js");
const EventClientReady = require("./events/EventClientReady.js");
const EventGuildDelete = require("./events/EventGuildDelete.js");

// Создаем новый клиент
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.commands = new Collection();

client.once(Events.ClientReady, async () => {
  await EventClientReady(client);
});

const processingUsers = new Set();
client.on(Events.MessageCreate, async (message) => {
  const userId = message.author.id;
  
  if (processingUsers.has(userId)) { return; }

  processingUsers.add(userId);
  await EventMessageCreate(message, client);
  processingUsers.delete(userId);
});

client.on(Events.InteractionCreate, async (interaction) => {
  const userId = interaction.user.id;
  if (processingUsers.has(userId)) {
    return await interaction.reply({content: "Предыдущий запрос еще обрабатывается", ephemeral: true});
  }

  processingUsers.add(userId);
  await EventInteractionCreate(interaction, client);
  processingUsers.delete(userId);
});

client.on(Events.GuildDelete, async (guildId) => {
  await EventGuildDelete(guildId);
});

client.login(process.env.DISCORD_TOKEN);

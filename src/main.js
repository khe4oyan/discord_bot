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
  EventClientReady(client);
});

client.on(Events.MessageCreate, async (message) => {
  EventMessageCreate(message, client);
});

client.on(Events.InteractionCreate, async (interaction) => {
  EventInteractionCreate(interaction, client);
});

client.on(Events.GuildDelete, async (guildId) => {
  EventGuildDelete(guildId);
});

client.login(process.env.DISCORD_TOKEN);

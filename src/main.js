require("dotenv").config();
const { Client, GatewayIntentBits, Events } = require("discord.js");

// events
const EventInteractionCreate = require("./events/EventInteractionCreate.js");
const EventMessageCreate = require("./events/EventMessageCreate.js");
const EventClientReady = require("./events/EventClientReady.js");
const EventGuildDelete = require("./events/EventGuildDelete.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildPresences,
  ],
});

client.once(Events.ClientReady, EventClientReady);
client.on(Events.MessageCreate, EventMessageCreate);
client.on(Events.InteractionCreate, EventInteractionCreate);
client.on(Events.GuildDelete, EventGuildDelete);

client.login(process.env.DISCORD_TOKEN);

process.on("SIGINT", () => {
  client.destroy();
});
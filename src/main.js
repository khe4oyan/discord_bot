require("dotenv").config();
const {
  Client,
  GatewayIntentBits,
  Collection,
  Events,
} = require("discord.js");

// events
const EventInteractionCreate = require("./events/EventInteractionCreate.js");
const EventMessageCreate = require("./events/EventMessageCreate.js");
const EventClientReady = require("./events/EventClientReady.js");
const EventGuildDelete = require("./events/EventGuildDelete.js");

let client = null;

// Создаем новый клиент
client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildPresences,
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

// для проверки статуса
// client.on(Events.PresenceUpdate, (oldPresence, newPresence) => {
//   // Проверяем, если старое присутствие существует
//   if (oldPresence) {
//       // Если статус изменился
//       if (oldPresence.status !== newPresence.status) {
//           // Логируем изменение статуса
//           console.log(`${newPresence.user.tag} изменил статус: ${oldPresence.status} -> ${newPresence.status}`);

//           // Проверяем, если пользователь стал онлайн
//           if (newPresence.status === 'online') {
//               console.log(`${newPresence.user.tag} теперь в сети!`);
//           }
//           // Проверяем, если пользователь стал оффлайн
//           if (newPresence.status === 'offline') {
//               console.log(`${newPresence.user.tag} вышел из сети.`);
//           }
//       }
//   }
// });

client.login(process.env.DISCORD_TOKEN);
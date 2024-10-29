require("dotenv").config();
const {
  Client,
  GatewayIntentBits,
  Collection,
  Events,
} = require("discord.js");
const express = require("express");
const app = express();
const path = require("path");

// events
const EventInteractionCreate = require("./events/EventInteractionCreate.js");
const EventMessageCreate = require("./events/EventMessageCreate.js");
const EventClientReady = require("./events/EventClientReady.js");
const EventGuildDelete = require("./events/EventGuildDelete.js");

let client = null;

// Создаем новый клиент
function onBot() {
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
}

function offBot() {
  client.destroy();
  client = null;
}

const port = process.env.SERVER_PORT;

app.use(express.static(path.join(__dirname, "../html")));
app.use(express.json());

app.get("/", (_, res) => {
  res.sendFile(path.join(__dirname, "../html/index.html"));
});

app.get("/status", (_, res) => {
  if (client) {
    res.send({ status: 200, message: "Bot online" });
  } else {
    res.send({ status: 201, message: "Bot offline" });
  }
});

app.post("/on", (req, res) => {
  if (!passValidation(req.body.password, res)) {
    return;
  }

  if (client) {
    res.send({ status: 404, message: "Bot already online" });
    return;
  }

  onBot();
  res.send({ status: 200, message: "Bot now is online" });
});

app.post("/off", (req, res) => {
  if (!passValidation(req.body.password, res)) {
    return;
  }

  if (!client) {
    res.send({ status: 404, message: "Bot already is offline" });
    return;
  }

  offBot();
  res.send({ status: 200, message: "Bot now is offline" });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

function passValidation(password, res) {
  if (password !== process.env.PASSWORD) {
    res.send({ status: 444, message: "Invalid password" });
    return false;
  }

  return true;
}

onBot();

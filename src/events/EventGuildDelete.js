const FileManager = require("../classes/FileManager.js");

module.exports = async function EventGuildDelete(guildData) {
  const guildId = guildData.id;
  FileManager.deleteDir(guildId);
}
const fs = require("fs");
const path = require("path");

class FileManager {
  static save(folderPath, data) {
    const dirPath = path.join(__dirname, folderPath);

    const createDirectoryIfNotExists = (filePath) => {
      const dirPath = path.dirname(filePath); // Получаем путь к директории
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true }); // Создаём директорию
      }
    };

    createDirectoryIfNotExists(dirPath);

    fs.writeFile(dirPath, JSON.stringify(data, null, 2), () => {});
  }

  static load(folderPath) {
    const dirPath = path.join(__dirname, folderPath);

    if (fs.existsSync(dirPath)) {
      try {
        const data = fs.readFileSync(dirPath, 'utf8');
        return JSON.parse(data);
      } catch (err) {
        return null;
      }
    }
  }

  static deleteDir(guildId) {
    const guildPath = path.join(__dirname, `../../DB/guilds/${guildId}`);
    fs.rm(guildPath, { recursive: true, force: true}, () => {});
  }
};

module.exports = FileManager;
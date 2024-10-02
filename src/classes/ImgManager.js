const { AttachmentBuilder } = require("discord.js");
const sharp = require("sharp");

class ImgManager {
  /**
   * Создает изображение с указанными параметрами
   * @param {number} width - Ширина изображения
   * @param {number} height - Высота изображения
   * @param {string} color - Цвет изображения (например, '#FF0000')
   * @returns {Promise<Buffer>} - Буфер изображения
   */
  static async createImage(width, height, color) {
    return await sharp({
      create: {
        width,
        height,
        channels: 4,
        background: color,
      },
    })
      .png()
      .toBuffer();
  }

  /**
   * Добавляет изображение поверх другого изображения с сохранением соотношения сторон
   * @param {Buffer} baseImageBuffer - Буфер базового изображения
   * @param {Buffer} overlayImageBuffer - Буфер накладываемого изображения
   * @param {number} posX - Позиция X для накладываемого изображения
   * @param {number} posY - Позиция Y для накладываемого изображения
   * @param {number} maxOverlayWidth - Максимальная ширина накладываемого изображения
   * @param {number} maxOverlayHeight - Максимальная высота накладываемого изображения
   * @returns {Promise<Buffer>} - Буфер объединенного изображения
   */
  static async overlayImage( baseImageBuffer, overlayImageBuffer, posX, posY, maxOverlayWidth, maxOverlayHeight ) {
    // Масштабируем изображение, сохраняя соотношение сторон
    const overlayResized = await sharp(overlayImageBuffer)
      .resize({
        width: maxOverlayWidth,
        height: maxOverlayHeight,
        fit: "inside", // Сохраняем соотношение сторон
      })
      .toBuffer();

    return await sharp(baseImageBuffer)
      .composite([{ input: overlayResized, left: posX, top: posY }])
      .png()
      .toBuffer();
  }

  
  static loadImg(imagePath) {
    return sharp(imagePath);
  }
  
  static async joinTwoImg(baseImageBuffer, overlayImageBuffer) {
    return baseImageBuffer
    .composite([{ input: overlayImageBuffer, gravity: "center" }])
    .toBuffer();
  }
 
  /**
   * Создает attachment для отправки изображения пользователю
   * @param {Buffer} imageBuffer - Буфер изображения для отправки
   */
  static createAttachmentDiscord(imageBuffer) {
    return new AttachmentBuilder(imageBuffer, {
      name: "result.png",
    });
  }
}

module.exports = ImgManager;

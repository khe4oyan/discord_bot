// libs
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
 
  /**
   * Создает attachment для отправки изображения пользователю
   * @param {Buffer} imageBuffer - Буфер изображения для отправки
   */
  static createAttachmentDiscord(imageBuffer) {
    return new AttachmentBuilder(imageBuffer, {
      name: "r.png",
    });
  }

  /**
   * Добавляет текст к изображению на указанных координатах.
   *
   * @param {Buffer} imageBuffer - Буфер изображения, к которому нужно добавить текст.
   * @param {string} text - Текст, который будет добавлен на изображение.
   * @param {number} x - Координата X для начала текста.
   * @param {number} y - Координата Y для начала текста.
   * @param {number} [fontSize=16] - Размер шрифта для текста (по умолчанию 16).
   * @param {string} [color="white"] - Цвет текста (по умолчанию белый).
   * @param {string} [textAnchor="start"] - Положение текста относительно координаты X (например, "start", "middle", "end").
   * @returns {Promise<Buffer>} - Возвращает новый буфер изображения с добавленным текстом.
   */
  static async addTextToImage(imageBuffer, text, x, y, fontSize = 16, color = "white", textAnchor = "start") {
    try {
      const bgMetaData = await sharp(imageBuffer).metadata();

      const svgText = `
        <svg width="${bgMetaData.width}" height="${bgMetaData.height}">
          <text 
            x="${x}" 
            y="${y + fontSize}" 
            font-size="${fontSize}" 
            font-family="Arial" 
            fill="${color}" 
            font-weight="bold" 
            text-anchor="${textAnchor}" 
            alignment-baseline="middle"
          >
            ${text}
          </text>
        </svg>

      `;

      return sharp(imageBuffer)
        .composite([
          {
            input: Buffer.from(svgText),
            top: 0, // Позиция наложения текста может быть изменена здесь
            left: 0,
          },
        ])
        .png()
        .toBuffer();
    } catch (err) {
      console.error("Ошибка при добавлении текста:", err);
      throw err;
    }
  }

  static async #addGradientToImage(imageBuffer, defs){ 
    try {
      const bgMetaData = await sharp(imageBuffer).metadata();

      const svgGradient = `
        <svg width="${bgMetaData.width}" height="${bgMetaData.height}">
          ${defs}
          <rect width="${bgMetaData.width}" height="${bgMetaData.height}" fill="url(#grad1)" />
        </svg>
      `;

      return sharp(imageBuffer)
        .composite([
          {
            input: Buffer.from(svgGradient),
            top: 0,
            left: 0,
          },
        ])
        .png()
        .toBuffer();
    } catch (err) {
      console.error("Ошибка при добавлении текста:", err);
      throw err;
    }
  }

  /**
   * Добавляет градиент к изображению в полный экран.
   *
   * @param {Buffer} imageBuffer - Буфер изображения, к которому нужно добавить текст.
   * @param {string} [color="red"] - Цвет текста (по умолчанию белый).
   * @param {string} [color2="blue"] - Положение текста относительно координаты X (например, "start", "middle", "end").
   * @returns {Promise<Buffer>} - Возвращает новый буфер изображения с добавленным текстом.
   */
  static async addLinearGradientToImage(imageBuffer, color = "red", color2 = "blue") {
    return await ImgManager.#addGradientToImage(imageBuffer, `
      <defs>
        <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${color};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${color2};stop-opacity:1" />
        </linearGradient>
      </defs>
    `);
  }

  /**
   * Добавляет градиент к изображению в полный экран.
   *
   * @param {Buffer} imageBuffer - Буфер изображения, к которому нужно добавить текст.
   * @param {string} [color="red"] - Цвет текста (по умолчанию белый).
   * @param {string} [color2="blue"] - Положение текста относительно координаты X (например, "start", "middle", "end").
   * @returns {Promise<Buffer>} - Возвращает новый буфер изображения с добавленным текстом.
  */
  static async addRadialGradientToImage(imageBuffer, color = "red", color2 = "blue", posX = '50', posY = '50') {
    return await ImgManager.#addGradientToImage(imageBuffer,`
      <defs>
        <radialGradient id="grad1" cx="${posX}%" cy="${posY}%" r="50%" fx="${posX}%" fy="${posY}%" gradientUnits="userSpaceOnUse">
          <stop offset="0%" style="stop-color:${color};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${color2};stop-opacity:1" />
        </radialGradient>
      </defs>
    `)
  }

  static async extend(imgBuffer, sides, background = "#0000") {
    return sharp(imgBuffer)
      .extend({
        ...sides,
        background,
      })
      .png()
      .toBuffer()
  }
}

module.exports = ImgManager;

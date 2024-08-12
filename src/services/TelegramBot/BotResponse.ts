import { SendMessageOptions } from "node-telegram-bot-api"
import bot from "./telegramBot"
import logger from "../../utils/logger"

export default async function SendBotResponse(
  chatId: number,
  text: string,
  options?: SendMessageOptions
) {
  try {
    const sendMessageOptions: SendMessageOptions = {
      parse_mode: "HTML",
      ...options, // Spread the provided options to keep any custom settings
    }

    await bot.sendMessage(chatId, text, sendMessageOptions)
  } catch (error) {
    logger.error("Error sending bot response", { error, chatId, text })
  }
}

import dotenv from "dotenv"
dotenv.config()
import TelegramBot from "node-telegram-bot-api"
import logger from "../../utils/logger"

const token = process.env.TELEGRAM_BOT_TOKEN

if (token === undefined) {
  logger.error("TELEGRAM_BOT_TOKEN is not set")
  process.exit(1)
}

const bot = new TelegramBot(token, { polling: true })

logger.info("\nBot is running...")

export default bot

import { CallbackQuery, Message } from "node-telegram-bot-api"
import { ensureUser } from "./services/PrismaClient/Models/Users.prisma"
import { onStart } from "./services/TelegramBot/commands/onStart"
import bot from "./services/TelegramBot/telegramBot"
import logger from "./utils/logger"
import {
  handleSubscription,
  manageSubscriptions,
} from "./services/TelegramBot/mainMenu/manageSubscriptions"

try {
  bot.on("polling_error", (error) => {
    logger.error("Polling Errors", error)
  })

  bot.on("message", async (msg: Message) => {
    await ensureUser(msg)
    switch (msg.text) {
      case "⚙️ Manage Subscriptions":
        await manageSubscriptions(msg)
        break
    }
  })

  bot.on("callback_query", async (query: CallbackQuery) => {
    const [query_type] = query.data!.split("/")
    switch (query_type) {
      case "subscription":
        await handleSubscription(query)
        break
    }
  })

  bot.onText(/\/start/, async (msg: Message) => {
    await onStart(msg)
  })
} catch (error) {
  logger.error("Error at bot.on", error)
  process.exit(1)
}

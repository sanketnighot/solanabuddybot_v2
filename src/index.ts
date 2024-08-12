import { CallbackQuery, Message } from "node-telegram-bot-api"
import { ensureUser } from "./services/PrismaClient/Models/Users.prisma"
import { onStart } from "./services/TelegramBot/commands/onStart"
import bot from "./services/TelegramBot"
import logger from "./utils/logger"
import {
  handleSubscription,
  manageSubscriptions,
} from "./services/TelegramBot/mainMenu/manageSubscriptions"
import sendAboutMessage from "./services/TelegramBot/mainMenu/aboutMessage"
import SendBotResponse from "./services/TelegramBot/utils/BotResponse"
import { createAccountKeyboard } from "./services/TelegramBot/utils/keyboards"
import { manageAccount } from "./services/TelegramBot/mainMenu/manageAccount"

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
      case "🔑 Create/Import Account":
        await SendBotResponse(
          msg.chat.id,
          "Select an option from the menu below",
          {
            reply_markup: createAccountKeyboard,
          }
        )
        break
      case "ℹ️ About":
        await sendAboutMessage(msg)
        break
    }
  })

  bot.on("callback_query", async (query: CallbackQuery) => {
    const [query_type] = query.data!.split("/")
    switch (query_type) {
      case "subscription":
        bot.answerCallbackQuery(query.id)
        await handleSubscription(query)
        break
      case "account":
        bot.answerCallbackQuery(query.id)
        await manageAccount(query)
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

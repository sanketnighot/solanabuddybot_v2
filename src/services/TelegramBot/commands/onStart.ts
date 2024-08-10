import { Message } from "node-telegram-bot-api"
import SendBotResponse from "../BotResponse"
import logger from "../../../utils/logger"
import { getWelcomeMessage } from "../../../utils/messages"

export function onStart(msg: Message) {
  try {
    const message = getWelcomeMessage(msg.chat.username || "User")
    SendBotResponse(msg.chat.id, message)
  } catch (error) {
    logger.error("Error at onStart", error)
    SendBotResponse(
      msg.chat.id,
      "Something went wrong. Please try again later."
    )
  }
}

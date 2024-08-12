import SendBotResponse from "../BotResponse"
import { getAboutMessage } from "../../../utils/messages"
import { Message } from "node-telegram-bot-api"

export default async function sendAboutMessage(msg: Message) {
  const message = getAboutMessage(msg.chat.username || "User")
  await SendBotResponse(msg.chat.id, message)
}

import { Message } from "node-telegram-bot-api"
import SendBotResponse from "../utils/BotResponse"
import logger from "../../../utils/logger"
import { getHelpMessage } from "../utils/messages"
import { getUser } from "../../PrismaClient/Models/Users.prisma"
import { mainMenuWithoutWallets, mainMenuWithWallets } from "../utils/keyboards"

export default async function onHelp(msg: Message) {
  try {
    const userInfo = await getUser(BigInt(msg.from?.id || 0))
    let keyboard
    if (userInfo.data?.SolWallets.length === 0 || userInfo.success === false) {
      keyboard = mainMenuWithoutWallets
    } else {
      keyboard = mainMenuWithWallets
    }
    const message = getHelpMessage(msg.chat.username || "User")
    SendBotResponse(msg.chat.id, message, { reply_markup: keyboard })
  } catch (error) {
    logger.error("Error at onStart", error)
    SendBotResponse(
      msg.chat.id,
      "Something went wrong. Please try again later."
    )
  }
}

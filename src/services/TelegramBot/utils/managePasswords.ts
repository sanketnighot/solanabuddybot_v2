import { passwordGenerationState } from "./globalStates"
import SendBotResponse from "./BotResponse"
import { getUser, updateUser } from "../../PrismaClient/Models/Users.prisma"
import { Message } from "node-telegram-bot-api"
import bcrypt from "bcrypt"
import bot from ".."

export async function confirmUserHasPassword(msg: Message) {
  const chatId = msg.from?.id || 0
  const userData = await getUser(BigInt(chatId))
  if (!userData) {
    return false
  }
  if (!userData.data?.password) {
    return false
  }
  return true
}

export async function generatePassword(msg: Message) {
  const chatId = msg.from?.id || 0
  let password = passwordGenerationState.get(chatId)
  if (!password) {
    passwordGenerationState.set(chatId, {
      status: "initial",
    })
    password = passwordGenerationState.get(chatId)
  }
  switch (password?.status) {
    case "initial": {
      const response = await SendBotResponse(
        chatId,
        "Lets setup a password for your account.\nEnter a password"
      )
      await bot.deleteMessage(chatId, msg.message_id)
      passwordGenerationState.set(chatId, {
        status: "created",
        prevChatId: response?.message_id,
      })
      break
    }
    case "created": {
      await bot.deleteMessage(chatId, password.prevChatId!)
      await bot.deleteMessage(chatId, msg.message_id)
      const response = await SendBotResponse(
        chatId,
        "Enter the password again to confirm"
      )
      passwordGenerationState.set(chatId, {
        status: "confirming",
        password: msg.text,
        prevChatId: response?.message_id,
      })
      break
    }
    case "confirming":
      if (msg.text === password.password) {
        const hashedPassword = await bcrypt.hash(msg.text!, 10)
        await updateUser(BigInt(chatId), { password: hashedPassword })
        SendBotResponse(
          chatId,
          "Congratulation! Password Set Successfully.\nNow you can avail other services seamlessly"
        )
        await bot.deleteMessage(chatId, password.prevChatId!)
        await bot.deleteMessage(chatId, msg.message_id)
        passwordGenerationState.delete(chatId)
      } else {
        await bot.deleteMessage(chatId, password.prevChatId!)
        await bot.deleteMessage(chatId, msg.message_id)
        SendBotResponse(
          chatId,
          "Confirm Password did not match to the password previously provided. \nPlease try again to create a password"
        )
        passwordGenerationState.delete(chatId)
      }
      break
    default:
      SendBotResponse(chatId, "Password Creation Failed")
      break
  }
}

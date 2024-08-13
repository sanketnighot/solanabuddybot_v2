import { CallbackQuery } from "node-telegram-bot-api"
import logger from "../../../utils/logger"
import {
  createAccountUsingKeypair,
  importAccountUsingKeypair,
} from "./manageWallets"
import SendBotResponse from "../utils/BotResponse"
import { mainMenuWithWallets } from "../utils/keyboards"
import bot from ".."

export const manageAccount = async (query: CallbackQuery) => {
  try {
    //  eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_, query_action, query_info, query_status, password, del] =
      query.data!.split("/")
    switch (query_info) {
      case "seed":
        if (query_action === "create") {
          // await createAccountUsingSeedPhrase()
          await SendBotResponse(
            query.message?.chat.id,
            "This feature is not available yet"
          )
        } else if (query_action === "import") {
          // await importAccountUsingSeedPhrase()
          await SendBotResponse(
            query.message?.chat.id,
            "This feature is not available yet"
          )
        }
        break
      case "keypair":
        if (query_status === "c") {
          if (query_action === "create") {
            if (
              password === undefined ||
              (password && password.length < 6) ||
              del === "del"
            ) {
              if (del === "del") {
                await bot.deleteMessage(
                  query.message?.chat.id || 0,
                  query.message?.message_id || 0
                )
                return
              }
              const inline_keyboard = [
                [
                  {
                    text: "1️⃣",
                    callback_data:
                      password === undefined
                        ? "account/create/keypair/c/1"
                        : "account/create/keypair/c/" + password + "1",
                  },
                  {
                    text: "2️⃣",
                    callback_data:
                      password === undefined
                        ? "account/create/keypair/c/2"
                        : "account/create/keypair/c/" + password + "2",
                  },
                  {
                    text: "3️⃣",
                    callback_data:
                      password === undefined
                        ? "account/create/keypair/c/3"
                        : "account/create/keypair/c/" + password + "3",
                  },
                ],
                [
                  {
                    text: "4️⃣",
                    callback_data:
                      password === undefined
                        ? "account/create/keypair/c/4"
                        : "account/create/keypair/c/" + password + "4",
                  },
                  {
                    text: "5️⃣",
                    callback_data:
                      password === undefined
                        ? "account/create/keypair/c/5"
                        : "account/create/keypair/c/" + password + "5",
                  },
                  {
                    text: "6️⃣",
                    callback_data:
                      password === undefined
                        ? "account/create/keypair/c/6"
                        : "account/create/keypair/c/" + password + "6",
                  },
                ],
                [
                  {
                    text: "7️⃣",
                    callback_data:
                      password === undefined
                        ? "account/create/keypair/c/7"
                        : "account/create/keypair/c/" + password + "7",
                  },
                  {
                    text: "8️⃣",
                    callback_data:
                      password === undefined
                        ? "account/create/keypair/c/8"
                        : "account/create/keypair/c/" + password + "8",
                  },
                  {
                    text: "9️⃣",
                    callback_data:
                      password === undefined
                        ? "account/create/keypair/c/9"
                        : "account/create/keypair/c/" + password + "9",
                  },
                ],
                [
                  {
                    text: "🔄",
                    callback_data: "account/create/keypair/c/",
                  },
                  {
                    text: "0️⃣",
                    callback_data:
                      password === undefined
                        ? "account/create/keypair/c/0"
                        : "account/create/keypair/c/" + password + "0",
                  },
                  {
                    text: "❌",
                    callback_data: "account/create/keypair/c//del",
                  },
                ],
              ]
              let pinMessage = "Enter Password for this Account\n\n"
              pinMessage +=
                password === undefined
                  ? "⭕️".repeat(6)
                  : "⛔️".repeat(password.length) +
                    "⭕️".repeat(6 - password.length)
              await bot.deleteMessage(
                query.message?.chat.id || 0,
                query.message?.message_id || 0
              )
              await SendBotResponse(query.message?.chat.id, pinMessage, {
                reply_markup: {
                  inline_keyboard,
                },
              })
              return
            }
            console.log({ password })
            const createAccountResponse = await createAccountUsingKeypair(
              BigInt(query.message?.chat.id || 0),
              password
            )
            if (!createAccountResponse.success) {
              await SendBotResponse(
                query.message?.chat.id,
                "Error Creating Account Using Keypair"
              )
              return
            }
            let message = createAccountResponse.message
            message += `\n\nYour Public Key: <code>${createAccountResponse.data?.publicKey}</code>`
            await bot.deleteMessage(
              query.message?.chat.id || 0,
              query.message?.message_id || 0
            )
            await SendBotResponse(query.message?.chat.id, message, {
              reply_markup: mainMenuWithWallets,
            })
          } else if (query_action === "import") {
            await importAccountUsingKeypair()
            await SendBotResponse(
              query.message?.chat.id,
              "Importing Account Using Keypair"
            )
          }
        } else if (query_status === "nc") {
          if (query_action === "create") {
            const inline_keyboard = [
              [
                {
                  text: "✅ Confirm Transaction",
                  callback_data: "account/create/keypair/c",
                },
              ],
            ]
            await SendBotResponse(
              query.message?.chat.id,
              "Creating Account Using Keypair",
              {
                reply_markup: {
                  inline_keyboard,
                },
              }
            )
          } else if (query_action === "import") {
            const inline_keyboard = [
              [
                {
                  text: "✅ Confirm Transaction",
                  callback_data: "account/import/keypair/c",
                },
              ],
            ]
            await SendBotResponse(
              query.message?.chat.id,
              "Importing Account Using Keypair",
              {
                reply_markup: {
                  inline_keyboard,
                },
              }
            )
          }
        }
        break
    }
  } catch (error) {
    logger.error("Error in manageAccount", error)
  }
}

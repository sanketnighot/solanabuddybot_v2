import { Message } from "node-telegram-bot-api"
import SendBotResponse from "../utils/BotResponse"
import { getUser } from "../../PrismaClient/Models/Users.prisma"
import logger from "../../../utils/logger"
import { getAccountDashboardMessage } from "../utils/messages"
import { getBalance } from "../../Solana/wallets"

export const sendAccountDashboard = async (msg: Message) => {
  try {
    const chatId = BigInt(msg.chat.id)
    const user = await getUser(chatId)
    if (!user) {
      await SendBotResponse(Number(chatId), "You are not registered")
      return
    }
    let dashboardMessage = await getAccountDashboardMessage(
      user.data?.username || "User"
    )
    const defaultSolWallet = user.data?.SolWallets.filter(
      (wallet) => wallet.id === user.data?.defaultWalletId
    )

    const defaultSolWalletBalance = await getBalance(
      // @ts-expect-error it will be fixed
      defaultSolWallet[0].publicKey
    )
    if ((defaultSolWallet?.length ?? 0) > 0) {
      // @ts-expect-error it will be fixed
      dashboardMessage += `💳 <b><u>Default Wallet</u></b>: <code>${defaultSolWallet[0].publicKey}</code>\n`
      dashboardMessage += `💰 <b><u>Balance</u></b>: ${defaultSolWalletBalance} SOL`
    }
    if ((user.data?.SolWallets?.length ?? 0) > 1) {
      dashboardMessage += `\n\n<b><u>📂 Other Wallets:</u></b>\n`
      user.data?.SolWallets.forEach((wallet) => {
        if (wallet.id !== user.data?.defaultWalletId) {
          dashboardMessage += `→ <code>${wallet.publicKey}</code>\n`
        }
      })
    }

    const inlineKeyboard = [
      [
        {
          text: "🔗 Open Solscan",
          web_app: {
            // @ts-expect-error it will be fixed
            url: `https://solscan.io/account/${defaultSolWallet[0].publicKey}`,
          },
        },
        {
          text: "⚙️ Manage Wallets",
          callback_data: "dashboard/changeDefaultWallet",
        },
      ],
      [
        {
          text: "↗️ Export Private Key",
          callback_data: "dashboard/exportPrivateKey",
        },
      ],
    ]

    await SendBotResponse(Number(chatId), dashboardMessage, {
      reply_markup: { inline_keyboard: inlineKeyboard },
    })
  } catch (error) {
    logger.error("Error sending account dashboard", error)
    await SendBotResponse(msg.chat.id, "Something went wrong")
  }
}

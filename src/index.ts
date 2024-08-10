// import { onStart } from "./services/TelegramBot/commands/onStart"
// import bot from "./services/TelegramBot/telegramBot"
// import logger from "./utils/logger"
import { getWalletsForUser } from "./services/PrismaClient/Models/SolWallets.prisma"

// Error handling
// try {
//   bot.on("polling_error", (error) => {
//     logger.error("Polling Error", error)
//   })
//   bot.onText(/\/start/, async (msg) => {
//     await onStart(msg)
//   })
// } catch (error) {
//   logger.error("Error at bot.on", error)
//   process.exit(1)
// }

async function main() {
  const result = await getWalletsForUser(BigInt(32424))
  console.log(result)
  console.log(result.data?.SolWallets)
}

main()

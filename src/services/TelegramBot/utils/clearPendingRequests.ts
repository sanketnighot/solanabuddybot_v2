import TelegramBot from "node-telegram-bot-api"
import logger from "../../../utils/logger"

export const clearPendingUpdates = async (bot: TelegramBot): Promise<void> => {
  try {
    const updates = await bot.getUpdates()
    if (updates.length > 0) {
      const latestUpdateId = Math.max(
        ...updates.map((update) => update.update_id)
      )
      await bot.getUpdates({ offset: latestUpdateId + 1 })
      logger.info(`Cleared ${updates.length} pending updates`)
    } else {
      logger.info("No pending updates to clear")
    }
  } catch (error) {
    logger.error("Error clearing pending updates", { error })
  }
}

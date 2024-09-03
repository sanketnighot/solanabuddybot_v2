import dotenv from "dotenv"
dotenv.config()
import TelegramBot from "node-telegram-bot-api"
import logger from "../../utils/logger"
import app from "../Express/app"

const token = process.env.TELEGRAM_BOT_TOKEN
const url = "https://webhook.therapix.in"
const port = process.env.PORT || 8000

if (token === undefined) {
  logger.error("TELEGRAM_BOT_TOKEN is not set")
  process.exit(1)
}

app.post(`/bot${token}`, (req, res) => {
  console.log(req.body)
  bot.processUpdate(req.body)
  res.sendStatus(200)
})

app.listen(port, () => {
  console.log(`Bot server is listening on ${port}`)
})

const bot = new TelegramBot(token)
bot.setWebHook(`${url}/bot${token}`).then((data) => {
  console.log({ webhook: data })
})

logger.info("\nBot is running...")

export default bot

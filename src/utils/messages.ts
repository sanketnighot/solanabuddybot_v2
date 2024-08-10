export const getWelcomeMessage = (username: string): string => {
  let message = `Hello <b>${username === "User" ? "" : "@"}${username}</b>! 👋 Welcome to Solana Buddy Bot. \n\n`

  message +=
    "I'm here to help you interact with the Solana blockchain. Here's what I can do for you: \n\n"
  message += "🔑 Create and manage Solana wallets \n"
  message += "💰 Check your SOL balance \n"
  message += "🪙 Create and transfer tokens \n"
  message += "🎮 Play mini-games \n\n"
  message += "Need help? Just type /help anytime! \n\n"
  return message
}

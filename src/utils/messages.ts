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

export const getAboutMessage = (username: string): string => {
  let message = `Hello <b>${username === "User" ? "" : "@"}${username}</b>👋! Thank you for choosing Solana Buddy Bot 🙏. \n\n`
  // We need to tell about the team and vision of the bot
  message +=
    "📱 Its a telegram bot rather a super bot that does almost everything that your  Dapps and Wallets do with the same rather more security. \n"
  message +=
    "💡 Idea is to create a super bot for web3 which users can use to do all activity regarding Web3.\n\n"
  message +=
    "🤝 If you have any questions or suggestions, please feel free to contact us.\n"

  return message
}

import {
  ReplyKeyboardMarkup,
  InlineKeyboardMarkup,
} from "node-telegram-bot-api"

export const mainMenuWithoutWallets: ReplyKeyboardMarkup = {
  keyboard: [
    [{ text: "🔑 Create/Import Account" }, { text: "⚙️ Manage Subscriptions" }],
    [{ text: "ℹ️ About" }],
  ],
  resize_keyboard: true,
  is_persistent: true,
  input_field_placeholder: "Select option from below",
}

export const mainMenuWithWallets: ReplyKeyboardMarkup = {
  keyboard: [
    [{ text: "🏦 My Account" }, { text: "🔑 Create/Import Account" }],
    [{ text: "⚙️ Manage Subscriptions" }, { text: "💰 Airdrop (Devnet)" }],
    [{ text: "🎮 Play Mini Games" }, { text: "🖼️ NFT Gallery" }],
    [{ text: "ℹ️ About" }],
  ],
  resize_keyboard: true,
  is_persistent: true,
  input_field_placeholder: "Select option from below",
}

export const createAccountKeyboard: InlineKeyboardMarkup = {
  inline_keyboard: [
    [
      {
        text: "🔑 Create Account using Keypair",
        callback_data: "account/create/keypair/nc",
      },
    ],
    [
      {
        text: "🔑 Import Account using Keypair",
        callback_data: "account/import/keypair/nc",
      },
    ],
    [
      {
        text: "🔑 Create Account using Seed Phrase (Coming Soon)",
        callback_data: "account/create/seed/nc",
      },
    ],
    [
      {
        text: "🔑 Import Account using Seed Phrase (Coming Soon)",
        callback_data: "account/import/seed/nc",
      },
    ],
  ],
}

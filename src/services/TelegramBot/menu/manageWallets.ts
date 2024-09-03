import logger from "../../../utils/logger"
import { createSolWallet } from "../../PrismaClient/Models/SolWallets.prisma"
import { generateNewKeypair } from "../../Solana/wallets"
import { encryptPrivateKey } from "../utils/Cryptography"

export const createAccountUsingSeedPhrase = async () => {
  console.log("Creating account using seed phrase")
}

export const createAccountUsingKeypair = async (
  chatId: bigint,
  password: string
): Promise<{
  success: boolean
  message: string
  data?: { chatId: bigint; publicKey: string }
  error?: unknown
}> => {
  try {
    if (!chatId || chatId === BigInt(0)) {
      return { success: false, message: "Invalid chatId" }
    }
    const { publicKey, privateKey, success } = await generateNewKeypair()
    if (!privateKey || !success || !publicKey) {
      return { success: false, message: "Error creating account using keypair" }
    }
    const encryptedPrivateKeyResult = await encryptPrivateKey(
      privateKey,
      password
    )
    if (
      !encryptedPrivateKeyResult.success ||
      !encryptedPrivateKeyResult.encryptedPrivateKey
    ) {
      return { success: false, message: "Error creating account using keypair" }
    }
    const createAccountResponse = await createSolWallet(
      chatId,
      publicKey,
      encryptedPrivateKeyResult.encryptedPrivateKey
    )
    if (!createAccountResponse.success) {
      return { success: false, message: "Error creating account using keypair" }
    }
    return {
      success: true,
      message: "Account created successfully",
      data: { chatId, publicKey },
    }
  } catch (error) {
    logger.error(
      "An Error Occured while creating account using keypair: ",
      error
    )
    return {
      success: false,
      message: "Error creating account using keypair",
      error,
    }
  }
}

export const importAccountUsingSeedPhrase = async () => {
  console.log("Importing account using seed phrase")
}

export const importAccountUsingKeypair = async () => {
  console.log("Importing account using keypair")
}

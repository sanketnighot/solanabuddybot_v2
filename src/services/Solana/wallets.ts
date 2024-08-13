import {
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
} from "@solana/web3.js"
import bs58 from "bs58"
import logger from "../../utils/logger"

export async function generateNewKeypair(): Promise<{
  publicKey?: string
  privateKey?: string
  success: boolean
  error?: string
}> {
  try {
    const keypair = await Keypair.generate()
    const publicKey = await keypair.publicKey.toString()
    const privateKey = await bs58.encode(keypair.secretKey)
    return { publicKey, privateKey, success: true }
  } catch (error) {
    logger.error("An Error Occured while generating Keypair: ", error)
    return { success: false, error: "Error generating Keypair" }
  }
}

export async function generateKeypairFromPrivateKey(
  privateKey: string
): Promise<{
  publicKey?: string
  privateKey?: string
  success: boolean
  error?: string
}> {
  try {
    const keypair = await Keypair.fromSecretKey(bs58.decode(privateKey))
    const publicKey = await keypair.publicKey.toString()
    return { publicKey, privateKey, success: true }
  } catch (error) {
    logger.error("An Error Occured while generating Keypair: ", error)
    return { success: false, error: "Error generating Keypair" }
  }
}

export async function requestAirdrop(
  publicKey: string,
  amount: number = 1
): Promise<string> {
  try {
    const rpcUrl = process.env.SOLANA_RPC || ""
    const connection = new Connection(rpcUrl, "confirmed")
    const publicKeyObj = new PublicKey(publicKey)

    const signature = await connection.requestAirdrop(
      publicKeyObj,
      amount * LAMPORTS_PER_SOL
    )
    await connection.confirmTransaction(signature)

    return `💸 Airdrop of <b>${amount} $SOL</b> to <code>${publicKey}</code> successful!`
  } catch (error) {
    console.error("Airdrop error:", error)
    return "❌ Airdrop Failed. \n\nProbably due to rate limiting. \nTry again after some time"
  }
}

export async function getBalance(publicKey: string): Promise<number> {
  try {
    const rpcUrl = process.env.SOLANA_RPC || ""
    const connection = new Connection(rpcUrl, "confirmed")
    const publicKeyObj = new PublicKey(publicKey)
    const balance = await connection.getBalance(publicKeyObj)
    return balance / LAMPORTS_PER_SOL // Convert lamports to SOL
  } catch (error) {
    console.error("Get balance error:", error)
    throw error
  }
}

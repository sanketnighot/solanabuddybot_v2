import { User, SolWallet } from "@prisma/client"
import logger from "../../../utils/logger"
import prisma from "../prismaClient"
import { getUser } from "./Users.prisma"

export const createSolWallet = async (
  chatId: bigint,
  publicKey: string,
  privateKey: string
): Promise<{
  success: boolean
  data?: Partial<User & SolWallet>
  error?: unknown
  message: string
}> => {
  try {
    const userResult = await getUser(chatId)
    if (!userResult.success || !userResult.data) {
      return {
        success: false,
        message: "User not found.",
      }
    }

    const solWallet = await prisma.solWallet.create({
      data: {
        publicKey,
        privateKey,
        userId: userResult.data.id!,
      },
      include: {
        user: true,
      },
    })
    return {
      success: true,
      data: solWallet,
      message: "Solana wallet created successfully.",
    }
  } catch (error) {
    logger.error("Error at createSolWallet", error)
    return {
      success: false,
      error: error,
      message: "Something went wrong. Please try again later.",
    }
  }
}

export const getSolWallet = async (
  chatId: bigint
): Promise<{
  success: boolean
  data?: Partial<User & SolWallet>
  error?: unknown
  message: string
}> => {
  try {
    const userResult = await getUser(chatId)
    if (!userResult.success || !userResult.data) {
      return {
        success: false,
        message: "User not found.",
      }
    }

    const solWallet = await prisma.solWallet.findFirst({
      where: {
        userId: userResult.data.id!,
      },
      include: {
        user: true,
      },
    })
    return {
      success: true,
      data: solWallet || undefined,
      message: solWallet
        ? "Solana wallet retrieved successfully."
        : "No Solana wallet found.",
    }
  } catch (error) {
    logger.error("Error at getSolWallet", error)
    return {
      success: false,
      error: error,
      message: "Something went wrong. Please try again later.",
    }
  }
}

export const getSolWalletUsingPublicKey = async (
  publicKey: string,
  chatId: bigint
): Promise<{
  success: boolean
  data?: Partial<User & SolWallet>
  error?: unknown
  message: string
}> => {
  try {
    const userResult = await getUser(chatId)
    if (!userResult.success || !userResult.data) {
      return {
        success: false,
        message: "User not found.",
      }
    }
    const solWallets = await prisma.solWallet.findFirst({
      where: {
        publicKey,
        userId: userResult.data.id,
      },
      include: {
        user: true,
      },
    })
    if (!solWallets) {
      return {
        success: false,
        message: "No Solana wallet found.",
      }
    }
    return {
      success: true,
      data: solWallets,
      message: "Solana wallet retrieved successfully.",
    }
  } catch (error) {
    logger.error("Error at getSolWalletUsingPublicKey", error)
    return {
      success: false,
      error: error,
      message: "Something went wrong. Please try again later.",
    }
  }
}

export const getSolWallets = async (
  chatId: bigint
): Promise<{
  success: boolean
  data?: Partial<User & { SolWallets: SolWallet[] }>
  error?: unknown
  message: string
}> => {
  try {
    const userResult = await prisma.user.findFirst({
      where: {
        chatId,
      },
      include: {
        SolWallets: true,
      },
    })
    if (!userResult) {
      return {
        success: false,
        message: "User not found.",
      }
    }

    if (!userResult.SolWallets) {
      return {
        success: false,
        message: "No Solana wallets found.",
      }
    }

    return {
      success: true,
      data: userResult,
      message: "Solana wallets retrieved successfully.",
    }
  } catch (error) {
    logger.error("Error at getSolWallets", error)
    return {
      success: false,
      error: error,
      message: "Something went wrong. Please try again later.",
    }
  }
}

export const getWalletsForUser = async (
  chatId: bigint
): Promise<{
  success: boolean
  data?: Partial<User & { SolWallets: SolWallet[] }>
  error?: unknown
  message: string
}> => {
  try {
    const userResult = await prisma.user.findFirst({
      where: {
        chatId,
      },
      include: {
        SolWallets: true,
      },
    })
    if (!userResult) {
      return {
        success: false,
        message: "User not found.",
      }
    }
    return {
      success: true,
      data: userResult,
      message: "Solana wallets retrieved successfully.",
    }
  } catch (error) {
    logger.error("Error at getWalletsForUser", error)
    return {
      success: false,
      error: error,
      message: "Something went wrong. Please try again later.",
    }
  }
}

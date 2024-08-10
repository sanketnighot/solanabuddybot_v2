import { Subscription, User } from "@prisma/client"
import logger from "../../../utils/logger"
import prisma from "../prismaClient"

export const createSubscription = async (
  subscription: Partial<Subscription>
): Promise<{
  success: boolean
  data?: Subscription
  message: string
  error?: unknown
}> => {
  try {
    const result = await prisma.subscription.create({
      data: {
        name: subscription.name!,
        description: subscription.description!,
        price: subscription.price!,
      },
    })
    if (!result) {
      return {
        success: false,
        message: "Failed to create subscription.",
      }
    }
    return {
      success: true,
      data: result,
      message: "Subscription created successfully.",
    }
  } catch (error) {
    logger.error("Failed to create subscription.", error)
    return {
      success: false,
      message: "Failed to create subscription.",
      error,
    }
  }
}

export const updateSubscription = async (
  subscription: Partial<Subscription>
): Promise<{
  success: boolean
  data?: Subscription
  message: string
  error?: unknown
}> => {
  try {
    const result = await prisma.subscription.update({
      where: {
        id: subscription.id,
      },
      data: {
        name: subscription.name,
        description: subscription.description,
        price: subscription.price,
      },
    })
    if (!result) {
      return {
        success: false,
        message: "Failed to update subscription.",
      }
    }
    return {
      success: true,
      data: result,
      message: "Subscription updated successfully.",
    }
  } catch (error) {
    logger.error("Failed to update subscription.", error)
    return {
      success: false,
      message: "Failed to update subscription.",
      error,
    }
  }
}

export const getSubscription = async (
  id: string
): Promise<{
  success: boolean
  data?: (Subscription & { users: User[] }) | null
  message: string
  error?: unknown
}> => {
  try {
    const result = await prisma.subscription.findUnique({
      where: {
        id,
      },
      include: {
        users: true,
      },
    })
    if (!result) {
      return {
        success: false,
        message: "Failed to get subscription.",
      }
    }
    return {
      success: true,
      data: result,
      message: "Subscription retrieved successfully.",
    }
  } catch (error) {
    logger.error("Failed to get subscription.", error)
    return {
      success: false,
      message: "Failed to get subscription.",
      error,
    }
  }
}

export const getAllSubscriptions = async (): Promise<{
  success: boolean
  data?: (Subscription & { users: User[] })[]
  message: string
  error?: unknown
}> => {
  try {
    const result = await prisma.subscription.findMany({
      include: {
        users: true,
      },
    })
    if (!result) {
      return {
        success: false,
        message: "Failed to get all subscriptions.",
      }
    }
    return {
      success: true,
      data: result,
      message: "Subscriptions retrieved successfully.",
    }
  } catch (error) {
    logger.error("Failed to get all subscriptions.", error)
    return {
      success: false,
      message: "Failed to get all subscriptions.",
      error,
    }
  }
}

export const getSubscriptionsForUser = async (
  chatId: bigint
): Promise<{
  success: boolean
  data?: Subscription[]
  message: string
  error?: unknown
}> => {
  try {
    const result = await prisma.subscription.findMany({
      where: {
        users: {
          some: {
            chatId,
          },
        },
      },
    })
    if (!result) {
      return {
        success: false,
        message: "Failed to get subscription for user.",
      }
    }
    return {
      success: true,
      data: result,
      message: "Subscription retrieved successfully.",
    }
  } catch (error) {
    logger.error("Failed to get subscription for user.", error)
    return {
      success: false,
      message: "Failed to get subscription for user.",
      error,
    }
  }
}

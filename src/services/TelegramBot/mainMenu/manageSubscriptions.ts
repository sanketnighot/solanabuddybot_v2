import { CallbackQuery, Message } from "node-telegram-bot-api"
import prisma from "../../PrismaClient/prismaClient"
import logger from "../../../utils/logger"
import { Subscription } from "@prisma/client"
import SendBotResponse from "../utils/BotResponse"
import {
  handleSubscribeForUser,
  handleUnsubscribeForUser,
} from "../../PrismaClient/Models/Subscriptions.prisma"

export const manageSubscriptions = async (
  msg: Message
): Promise<{
  status: string
  message: string
  error?: unknown
}> => {
  if (!msg.from) {
    return {
      status: "error",
      message: "Error in parameters",
    }
  }
  try {
    const chatId = msg.from.id
    const allSubscriptions = await prisma.subscription.findMany()
    const userSubscriptions = await prisma.user.findUnique({
      where: { chatId: chatId },
      select: { subscriptions: { select: { id: true } } },
    })

    const userSubscriptionIds = new Set(
      userSubscriptions?.subscriptions.map((a: { id: string }) => a.id) || []
    )

    const userSubscriptionsWithStatus = allSubscriptions.map(
      (subscription: Subscription) => ({
        ...subscription,
        isSubscribed: userSubscriptionIds.has(subscription.id),
      })
    )
    if (userSubscriptionsWithStatus === null) {
      SendBotResponse(chatId, "Error Fetching Subscriptions")
      return {
        status: "error",
        message: "Error Fetching Subscriptions",
      }
    }
    for (const subscription of userSubscriptionsWithStatus) {
      const keyboard = {
        inline_keyboard: [
          [
            {
              text: subscription.isSubscribed
                ? "❌ Unsubscribe"
                : "✅ Subscribe",
              callback_data: `subscription/${subscription.isSubscribed ? "unsubscribe" : "subscribe"}/${subscription.id}/nc`,
              one_time_keyboard: true,
            },
          ],
        ],
      }
      let subscriptionMessage = `<b><u>Subscription Name</u></b>: ${subscription.name
        .replace(/_/g, " ")
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")}\n`
      subscriptionMessage += `<b><u>Description</u></b>: ${subscription.description}\n`
      subscriptionMessage += `<b><u>Price</u></b>: ${subscription.price} SOL\n`
      subscriptionMessage += `<b><u>Status</u></b>: ${subscription.isSubscribed ? "Subscribed" : "Not subscribed"}`

      await SendBotResponse(chatId, subscriptionMessage, {
        reply_markup: keyboard,
      })
    }
    return {
      status: "success",
      message: "Subscriptions fetched successfully",
    }
  } catch (error) {
    logger.error("Error in manageSubscriptions", error)
    return {
      status: "error",
      message: "Error in manageSubscriptions",
      error: error,
    }
  }
}

export const handleSubscription = async (query: CallbackQuery) => {
  try {
    //  eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_, query_action, query_info, query_status] = query.data!.split("/")
    switch (query_action) {
      case "subscribe": {
        if (query_status === "nc") {
          const inline_keyboard = [
            [
              {
                text: "✅ Confirm Transaction",
                callback_data: `subscription/subscribe/${query_info}/c`,
                one_time_keyboard: true,
              },
            ],
          ]
          SendBotResponse(
            query.from.id,
            "Are you sure you want to Subscribe?",
            { reply_markup: { inline_keyboard } }
          )
        } else if (query_status === "c") {
          await handleSubscribeForUser(query)
        }
        break
      }
      case "unsubscribe": {
        if (query_status === "nc") {
          const inline_keyboard = [
            [
              {
                text: "✅ Confirm Transaction",
                callback_data: `subscription/unsubscribe/${query_info}/c`,
                one_time_keyboard: true,
              },
            ],
          ]
          SendBotResponse(
            query.from.id,
            "Are you sure you want to Unsubscribe?",
            { reply_markup: { inline_keyboard } }
          )
        } else if (query_status === "c") {
          await handleUnsubscribeForUser(query)
        }
        break
      }
    }
  } catch (error) {
    logger.error("Error in handleSubscription", error)
    return {
      status: "error",
      message: "Error in handleSubscription",
      error: error,
    }
  }
}

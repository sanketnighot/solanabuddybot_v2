import { Request, Response } from "express"

export function testBot(req: Request, res: Response) {
  try {
    return res.status(200).json({ message: "Bot is working", statusCode: 200 })
  } catch (error) {
    return res
      .status(400)
      .json({ message: "Error sending Message", error, statusCode: 400 })
  }
}

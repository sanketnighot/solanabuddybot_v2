import crypto from "crypto"
import logger from "../../../utils/logger"

export const encryptPrivateKey = (
  privateKey: string,
  password: string
): Promise<{
  success: boolean
  message: string
  encryptedPrivateKey?: string
  error?: unknown
}> => {
  return new Promise((resolve) => {
    try {
      const algorithm = "aes-256-cbc"
      const key = Buffer.from(process.env.MSG_ENCRYPTION_KEY ?? "", "hex")
      const iv = Buffer.from(process.env.MSG_ENCRYPTION_IV ?? "", "hex")
      const salt = Buffer.from(password, "hex")
      if (!key || !iv || !salt) {
        logger.error(
          "MSG_ENCRYPTION_KEY, MSG_ENCRYPTION_IV, MSG_ENCRYPTION_SALT are required"
        )
        resolve({
          success: false,
          message:
            "MSG_ENCRYPTION_KEY, MSG_ENCRYPTION_IV, MSG_ENCRYPTION_SALT are required",
        })
      }
      const cipher = crypto.createCipheriv(algorithm, key, iv)
      let encrypted = cipher.update(privateKey, "utf8", "hex")
      encrypted += cipher.final("hex")

      resolve({
        success: true,
        message: "Private Key Encrypted Successfully",
        encryptedPrivateKey: encrypted,
      })
    } catch (error) {
      logger.error("An Error Occured while encrypting private key: ", error)
      resolve({
        success: false,
        message: "An Error Occured while encrypting private key",
        error,
      })
    }
  })
}

export const decryptPrivateKey = (
  encryptedPrivateKey: string,
  password: string
): Promise<{
  success: boolean
  message: string
  decryptedPrivateKey?: string
  error?: unknown
}> => {
  return new Promise((resolve) => {
    try {
      const algorithm = "aes-256-cbc"
      const key = Buffer.from(process.env.MSG_ENCRYPTION_KEY ?? "", "hex")
      const iv = Buffer.from(process.env.MSG_ENCRYPTION_IV ?? "", "hex")
      const salt = Buffer.from(password, "hex")
      if (!key || !iv || !salt) {
        logger.error(
          "MSG_ENCRYPTION_KEY, MSG_ENCRYPTION_IV, MSG_ENCRYPTION_SALT are required"
        )
        resolve({
          success: false,
          message:
            "MSG_ENCRYPTION_KEY, MSG_ENCRYPTION_IV, MSG_ENCRYPTION_SALT are required",
        })
      }
      const decipher = crypto.createDecipheriv(algorithm, key, iv)
      let decrypted = decipher.update(encryptedPrivateKey, "hex", "utf8")
      decrypted += decipher.final("utf8")

      resolve({
        success: true,
        message: "Private Key Decrypted Successfully",
        decryptedPrivateKey: decrypted,
      })
    } catch (error) {
      logger.error("An Error Occured while decrypting private key: ", error)
      resolve({
        success: false,
        message: "An Error Occured while decrypting private key",
        error,
      })
    }
  })
}

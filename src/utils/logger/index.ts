import winston from "winston"

const { combine, timestamp, errors, splat, json, colorize, printf } =
  winston.format

// Custom format for console output
const consoleFormat = printf(({ level, message, timestamp, ...rest }) => {
  // Exclude 'service' from the rest of the metadata
  //   eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { service, ...metadata } = rest

  // If there's additional metadata, stringify it
  const metadataStr = Object.keys(metadata).length
    ? `\n${JSON.stringify(metadata, null, 2)}`
    : ""

  return `\n\n${timestamp} ${level}: ${message}${metadataStr}`
})

const logger = winston.createLogger({
  level: "debug",
  format: combine(timestamp(), errors({ stack: true }), splat(), json()),
  defaultMeta: { service: "solana-buddy-bot" },
  transports: [
    new winston.transports.File({
      filename: "logs/error.log",
      level: "error",
    }),
    new winston.transports.File({ filename: "logs/combined.log" }),
  ],
})

if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: combine(colorize(), timestamp(), consoleFormat),
    })
  )
}

export default logger

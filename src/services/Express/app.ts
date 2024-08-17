import express from "express"
import cors from "cors"
import router from "./routes"
import bodyParser from "body-parser"

const app = express()

app.use(cors())
app.use(express.json({ limit: "16kb" }))
app.use(express.urlencoded({ extended: true }))
app.use(express.static("public"))
app.use(bodyParser.json())

app.get("/", (req, res) => {
  try {
    res.status(200).json({ message: "Connected to Solana Buddy Bot API" })
  } catch (error: unknown) {
    res.status(500).json({
      message: (error as Error).message || "Error connecting to server",
    })
  }
})

app.use("/api/v1", router)

export default app

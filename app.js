const CustomError = require("./utils/error")
const express = require("express")
const path = require("path")
const session = require("express-session")
// const MongoDBStore = require("connect-mongodb-session")(session)
const cookieParser = require("cookie-parser")
const logger = require("morgan")
const globalErrorHandler = require("./middleware/error")
const cors = require("cors")
const indexRouter = require("./routes/index")
const usersRouter = require("./routes/users")
const produceRouter = require("./routes/produce")

const app = express()
require("dotenv").config()
app.use(
  cors({
    origin: [
      "http://localhost:3001",
      "http://localhost:3000",
      "https://farminsights.onrender.com/",
    ],
    credentials: true,
  })
)
app.set("views", path.join(__dirname, "views"))
app.set("view engine", "pug")
app.use(logger("dev"))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, "public")))

// var store = new MongoDBStore({
//   uri: "mongodb://localhost:27017/connect_mongodb_session_test",
//   collection: "mySessions",
// })

// store.on("error", function (error) {
//   console.log(error)
// })

// app.use(
//   session({
//     // httpOnly: true,
//     // secure: true,
//     secret: process.env.JWT_SECRET,
//     resave: true,
//     saveUninitialized: false,
//     store,
//     cookie: { maxAge: 1000 * 60 * 60 * 24 * 30 },
//   })
// ) Remove sessions because hosting provider does not support

app.use("/api/v1", indexRouter)
app.use("/api/v1/users", usersRouter)
app.use("/api/v1/produce", produceRouter)

app.all("*", (req, _, next) => {
  next(
    new CustomError(
      `CANNOT ${req.method} ${req.originalUrl} on this server!`,
      404
    )
  )
})
app.use(globalErrorHandler)
module.exports = app

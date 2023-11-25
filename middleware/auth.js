const { routeTryCatcher } = require("../utils/controller")
const CustomError = require("../utils/error")
const { validateToken } = require("../utils/security")

module.exports.protect = routeTryCatcher(async function (req, _res, next) {
  const authHeader = req.headers["authorization"]
  let token
  if (authHeader) {
    token = authHeader.split("Bearer ")[1]
  }
  console.log(token, "Line: 11")
  console.log("Line: 12")
  if (!token) return next(new CustomError("Not allowed!", 403))
  user = await validateToken(token)
  if (!user) return next(new CustomError("Not allowed!", 403))
  req.user = user
  console.log("Line: 17")
  next()
})

const { routeTryCatcher } = require("../utils/controller")
const CustomError = require("../utils/error")
const { validateToken } = require("../utils/security")

module.exports.authenticate = async (socket, next) => {
  try {
    const token = socket.handshake.auth?.token
    if (!token) return next(new Error("Unauthorized!!!"))
    const user = await validateToken(token)
    if (!user) return next(new Error("Unauthorized!!!"))
    socket.user = user
    next()
  } catch (err) {
    next(err)
  }
}
module.exports.protect = routeTryCatcher(async function (req, _res, next) {
  const authHeader = req.headers["authorization"]
  let token
  if (authHeader) {
    token = authHeader.split("Bearer ")[1]
  }
  if (!token) return next(new CustomError("Not allowed!", 403))
  user = await validateToken(token)
  if (!user) return next(new CustomError("Not allowed!", 403))
  req.user = user
  next()
})

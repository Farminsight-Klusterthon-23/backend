const { routeTryCatcher } = require("../utils/controller")
const CustomError = require("../utils/error")
const { validateToken } = require("../utils/security")

module.exports.protect = routeTryCatcher(async function (req, _res, next) {
  let token
  if ((req.session && !req.session.access_token) || !req.session) {
    const authHeader = req.headers["Authorization"]
    if (authHeader) {
      const token = authHeader.split("Bearer ")[1]
      console.log(token, "dafjkfskd")
    }
  } else token = req.session.access_token
  if (!token) return next(new CustomError("Not allowed!", 403))
  user = await validateToken(token)
  if (!user) return next(new CustomError("Not allowed!", 403))
  req.user = user
  next()
})

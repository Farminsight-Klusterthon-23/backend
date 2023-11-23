const User = require("../models/user")
const { routeTryCatcher } = require("../utils/controller")
const {
  hashValue,
  compareValueToHash,
  signJwt,
  validateToken,
} = require("../utils/security")

module.exports.signup = routeTryCatcher(async function (req, _res, next) {
  const { email, password, firstName, lastName, latitude, longitude } = req.body
  const user = new User({
    email,
    password: await hashValue(password),
    firstName,
    lastName,
    location: {
      type: "Point",
      coordinates: [longitude, latitude],
    },
  })
  req.response = {
    user: await user.save(),
    message: "Account created successfully!",
    status: 200,
  }
  next()
})

module.exports.login = routeTryCatcher(async function (req, _res, next) {
  const { email, password } = req.body
  let user
  if (req.session.access_token) {
    user = await validateToken(req.session.access_token)
    if (user) {
      req.response = {
        user,
        message: "Logged in!",
        status: 200,
      }
      return next()
    }
  } else user = await User.findOne({ email: email.toLowerCase() })

  req.response = {
    message: "Invalid credentials!",
    status: 400,
  }
  if (!user) return next()
  const isMatchingPassword = await compareValueToHash(password, user.password)
  if (!isMatchingPassword) next()
  const token = signJwt({ _id: user._id.toString() })
  req.session.access_token = token
  req.response = {
    user,
    message: "Logged in!",
    status: 200,
  }
  next()
})

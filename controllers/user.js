const User = require("../models/user")
const { routeTryCatcher } = require("../utils/controller")
const CustomError = require("../utils/error")
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
  } else user = await User.findOne({ email: email?.toLowerCase() })

  console.log(req.body, email, password)
  req.response = {
    message: "Invalid credentials!",
    status: 400,
  }
  if (!user) return next()
  console.log(user, "da")
  const isMatchingPassword = await compareValueToHash(password, user.password)
  if (!isMatchingPassword) return next()
  const token = signJwt({ _id: user._id.toString() })
  req.session.access_token = token
  req.response = {
    user,
    message: "Logged in!",
    status: 200,
  }
  next()
})
module.exports.logout = routeTryCatcher(async function (req, res, next) {
  if (req.session) req.session.destroy()
  req.response = {
    message: "Logged Out!",
    status: 200,
  }
  next()
})

module.exports.compareUserIdToParamId = routeTryCatcher(async function (
  req,
  res,
  next
) {
  if (req.user._id.toString() !== req.params.id)
    return next(new CustomError("Not allowed!", 403))
  return next()
})

module.exports.getUserBySession = routeTryCatcher(async function (
  req,
  res,
  next
) {
  req.response = {
    user: req.user,
    message: "Success",
    status: 200,
  }
  next()
})

module.exports.getUserById = routeTryCatcher(async function (req, res, next) {
  req.response = {
    user: await User.findById(req.params.id),
    message: "Success",
    status: 200,
  }
  next()
})

module.exports.updateUserBySession = routeTryCatcher(async function (
  req,
  res,
  next
) {
  const {
    profileImage,
    email,
    password,
    firstName,
    lastName,
    latitude,
    longitude,
  } = req.body
  const user = await User.findOneAndUpdate(
    { _id: req.user._id },
    {
      profileImage,
      email,
      password,
      firstName,
      lastName,
      latitude,
      longitude,
    },
    { new: true }
  )
  req.response = {
    user,
    message: "Success",
    status: 201,
  }
  next()
})

module.exports.deleteUserBySession = routeTryCatcher(async function (
  req,
  res,
  next
) {
  await User.findOneAndUpdate(
    { _id: req.user._id, isActive: true },
    {
      isActive: false,
    },
    {}
  )
  req.response = {
    message: "Success",
    status: 204,
  }
  next()
})

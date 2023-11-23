const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const User = require("../models/user")

module.exports.hashValue = async function (value) {
  const salt = await bcrypt.genSalt(10)
  return await bcrypt.hash(value, salt)
}
module.exports.compareValueToHash = async function (value, hash) {
  return await bcrypt.compare(value, hash)
}

module.exports.signJwt = function (payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1d" })
}
module.exports.verifyJwt = function (payload) {
  return jwt.verify(payload, process.env.JWT_SECRET)
}

module.exports.validateToken = async function (token) {
  const payload = module.exports.verifyJwt(token)
  if (new Date(Date.now()) - new Date(payload.iat * 1000) > 8.64e7) return null
  // return await User.findById(payload._id)
  return await User.findById({ _id: payload._id })
}

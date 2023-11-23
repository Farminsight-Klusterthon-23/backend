const User = require("../models/user")
const { routeTryCatcher } = require("../utils/controller")

module.exports.signup = routeTryCatcher(async function (req, res, next) {
  const { email, password, firstName, lastName, location, } = req.body
  const user = new User({
      email, password, firstName, lastName, location
    })
  req.response = {
    user: await user.save(),
    message: "Account created successfully!",
    status: 200
  }
})

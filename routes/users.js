const express = require("express")
const router = express.Router()
const { sendResponse } = require("../utils/controller")
const { signup } = require("../controllers/user")

router.post("/", signup, sendResponse)

module.exports = router

const express = require("express")
const router = express.Router()
const { sendResponse } = require("../utils/controller")
const { signup, login } = require("../controllers/user")

router.post("/", signup, sendResponse)
router.post("/login", login, sendResponse)

module.exports = router

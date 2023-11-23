const express = require("express")
const router = express.Router()
const { sendResponse } = require("../utils/controller")
const {
  signup,
  login,
  logout,
  getUserById,
  getUserBySession,
  updateUserBySession,
  deleteUserBySession,
} = require("../controllers/user")
const { protect } = require("../middleware/auth")

router
  .get("/me", protect, getUserBySession, sendResponse)
  .put("/me", protect, updateUserBySession, sendResponse)
  .delete("/me", protect, deleteUserBySession, sendResponse)

router.post("/", signup, sendResponse)
router.post("/login", login, sendResponse)
router.get("/logout", logout, sendResponse)
router.get("/:id", protect, getUserById, sendResponse)

module.exports = router

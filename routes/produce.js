const express = require("express")
const router = express.Router()
const { sendResponse } = require("../utils/controller")
const {
  createProduce,
  updateProduce,
  getSingleProduce,
  getMultipleProduce,
  deleteProduce,
  generateInfoOnCrop,
} = require("../controllers/produce")
const { protect } = require("../middleware/auth")

router.get("/crops/:crop", generateInfoOnCrop, sendResponse)
router.post("/", protect, createProduce, sendResponse)
router.put("/:id", protect, updateProduce, sendResponse)
router.get("/:id", protect, getSingleProduce, sendResponse)
router.delete("/:id", protect, deleteProduce, sendResponse)
router.get("/", protect, getMultipleProduce, sendResponse)

module.exports = router

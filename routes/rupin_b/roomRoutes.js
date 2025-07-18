const express = require("express");
const router = express.Router();
const { isAuthenticated } = require("../../middleware/auth");
const {
  addRoom,
  getRoomsByClient,
  deleteRoom,
  getRoomById,
} = require("../../controllers/rupin_b/roomController");

router.post("/", isAuthenticated, addRoom);
router.get("/by-client/:clientId", isAuthenticated, getRoomsByClient);
router.get("/by-id/:id", isAuthenticated, getRoomById);
router.delete("/:id", isAuthenticated, deleteRoom);

module.exports = router;

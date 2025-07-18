const express = require("express");
const router = express.Router();
const { isAuthenticated } = require("../../middleware/auth");
const {
  saveBlind,
  getBlindByWindow,
  deleteBlind,
  toggleBlindComplete,
  updateBlind,
} = require("../../controllers/rupin_b/blindController");

router.post("/blinds/:windowId", isAuthenticated, saveBlind);
router.get("/blinds/by-window/:windowId", isAuthenticated, getBlindByWindow);
router.delete("/blinds/:id", isAuthenticated, deleteBlind);
router.patch("/blinds/complete/:id", isAuthenticated, toggleBlindComplete);
router.put("/blinds/:id", isAuthenticated, updateBlind);

module.exports = router;

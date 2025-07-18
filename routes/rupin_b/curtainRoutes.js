const express = require("express");
const router = express.Router();
const { isAuthenticated } = require("../../middleware/auth");
const {
    saveCurtain,
    getCurtainByWindow,
    deleteCurtain,
    toggleCurtainComplete,
    updateCurtain,

  } = require("../../controllers/rupin_b/curtainController");


router.post("/curtains/:windowId", isAuthenticated, saveCurtain);
router.get("/curtains/by-window/:windowId", isAuthenticated, getCurtainByWindow);
router.delete("/curtains/:id", isAuthenticated, deleteCurtain);
router.patch("/curtains/complete/:id", isAuthenticated, toggleCurtainComplete);
router.put("/curtains/:id", isAuthenticated, updateCurtain);


module.exports = router;

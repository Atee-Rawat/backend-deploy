const express = require("express");
const router = express.Router();
const bookingCtrl = require("../controllers/bookingController");

router.post("/", bookingCtrl.createOrUpdateBooking);
router.get("/date/:date", bookingCtrl.getBookingByDate);
router.get("/client/:clientId", bookingCtrl.getBookingsByClientId);

module.exports = router;

const mongoose = require("mongoose");

const CalendarSchema = new mongoose.Schema({
  date: { type: String, required: true },
  slots: [{ type: mongoose.Schema.Types.ObjectId, ref: "Slot" }],
  client: { type: mongoose.Schema.Types.ObjectId, ref: "Client", required: true },
});

CalendarSchema.index({ date: 1, client: 1 }, { unique: true });

module.exports = mongoose.model("Calendar", CalendarSchema);

const mongoose = require('mongoose');

const SlotSchema = new mongoose.Schema({
  calendar: { type: mongoose.Schema.Types.ObjectId, ref: "Calendar", required: true },
  date: { type: String, required: true },
  timeRange: { type: mongoose.Schema.Types.ObjectId, ref: "TimeRange", required: true },
  isBooked: { type: Boolean, default: false },
  client: { type: mongoose.Schema.Types.ObjectId, ref: "Client", required: true },
});

SlotSchema.index({ date: 1, timeRange: 1, client: 1 }, { unique: true });

module.exports = mongoose.model("Slot", SlotSchema);

const mongoose = require("mongoose");

const TimeRangeSchema = new mongoose.Schema({
  label: { type: String, required: true, unique: true },
});

module.exports = mongoose.model("TimeRange", TimeRangeSchema);

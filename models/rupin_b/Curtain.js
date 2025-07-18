const mongoose = require("mongoose");

const curtainSchema = new mongoose.Schema({
  windowId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Window",
    required: true,
  },
  mechanism: {
    type: String,
    enum: ["Manual", "Motorised"],
    required: true,
  },
  catalogueRef: String,
  curtainWidth: {
    type: String,
    enum: ["48 inch", "54 inch"],
  },
  curtainCount: Number,
  totalLength: Number,
  type: {
    type: String,
    enum: ["Sheer", "Main", ""],
  },
  surface: {
    type: String,
    enum: ["Concrete", "Wood", "False Ceiling", "Not Required"],
    required: true,
  },
  bracket: {
    type: String,
    enum: ["Ceiling Bracket", "Single L Bracket", "Double L Bracket"],
    required: true,
  },
  installationHeight: {
    type: String,
    enum: ["Single", "Double", "Triple"],
    required: true,
  },
  trackLength: {
    type: Number,
    required: false,
  },
  isCompleted: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

module.exports = mongoose.model("curtain", curtainSchema);

const mongoose = require("mongoose");

const blindSchema = new mongoose.Schema({
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
  type: {
    type: String,
    enum: ["Roller", "Zebra", "Roman", "Wooden", "Venetian"],
  },
  surface: {
    type: String,
    enum: ["Concrete", "Pelmet"],
    required: true,
  },
  fitting: {
    type: String,
    enum: ["Inside Window", "Outside Window"],
    required: true,
  },
  area: {
    type: Number,
    required: true,
  },
  width: {
    type: Number,
    required: true,
  },
  height: {
    type: Number,
    required: true,
  },
  isCompleted: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

module.exports = mongoose.model("blind", blindSchema);

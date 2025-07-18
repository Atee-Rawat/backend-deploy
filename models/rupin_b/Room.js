const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Client",
    required: true,
  },
  roomName: {
    type: String,
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model("Room", roomSchema);

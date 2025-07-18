const mongoose = require('mongoose');

const windowSchema = new mongoose.Schema(
  {
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Client',
      required: true,
    },
    roomId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Room",
    },
    roomName: {
      type: String,
      required: true,
    },
    windowName: {
      type: String,
      required: true,
    },
    widthCm: {
      type: Number,
      required: true,
    },
    heightCm: {
      type: Number,
      required: true,
    },
    areaSqft: {
      type: Number,
      required: true,
    },
    hasCurtains: {
      type: Boolean,
      default: false,
    },
    hasBlinds: {
      type: Boolean,
      default: false,
    },
    additionalNotes: {
      type: String,
      default: '',
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Window', windowSchema);

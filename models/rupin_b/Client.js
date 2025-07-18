const mongoose = require('mongoose');
const Calendar = require("../Booking/Calendar");
const Slot = require("../Booking/Slot");

const ClientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },


  manualAddress: {
    type: String,
    required: true,
    trim: true,
  },

 
  address: {
    type: String,
    required: true,
    trim: true,
  },

  phoneNumber: {
    type: String,
    required: true,
    trim: true,
  },

  gpsLocation: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  timestamps: true,
});

ClientSchema.index({ gpsLocation: '2dsphere' });

ClientSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    const clientId = doc._id;
    await Calendar.deleteMany({ client: clientId });
    await Slot.deleteMany({ client: clientId });
  }
});

module.exports = mongoose.model('Client', ClientSchema);

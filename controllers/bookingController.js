const Calendar = require("../models/Booking/Calendar");
const Slot = require("../models/Booking/Slot");
const TimeRange = require("../models/Booking/TimeRange");
const Client = require('../models/rupin_b/Client');

const createOrUpdateBooking = async (req, res) => {
  const { date, selectedTimeLabels, clientId } = req.body;

  if (!date || !selectedTimeLabels || !clientId) {
    return res.status(400).json({ message: "Missing data" });
  }

  try {
    const allSlotLabels = ['10am–2pm', '3pm–6pm', '7pm–10pm'];

    const timeRanges = await Promise.all(
      allSlotLabels.map(async (label) => {
        let range = await TimeRange.findOne({ label });
        if (!range) {
          range = await TimeRange.create({ label });
        }
        return range;
      })
    );

    let calendar = await Calendar.findOneAndUpdate(
      { date, client: clientId },
      { date, client: clientId },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    const createdSlots = [];

    for (const range of timeRanges) {
      const label = range.label;
      const shouldBook = selectedTimeLabels.includes(label);

      const existingSlot = await Slot.findOne({ date, timeRange: range._id });

      if (shouldBook) {
        if (existingSlot) {
          if (existingSlot.client.toString() !== clientId) {
            continue;
          } else {
            createdSlots.push(existingSlot);
            continue;
          }
        }

        const newSlot = await Slot.create({
          calendar: calendar._id,
          date,
          timeRange: range._id,
          isBooked: true,
          client: clientId,
        });

        createdSlots.push(newSlot);
      } else {
        if (existingSlot && existingSlot.client.toString() === clientId) {
          await Slot.deleteOne({ _id: existingSlot._id });
        }
      }
    }

    const finalSlots = await Slot.find({ calendar: calendar._id });
    calendar.slots = finalSlots.map((s) => s._id);
    await calendar.save();

    res.status(200).json(calendar);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const getBookingsByClientId = async (req, res) => {
  const { clientId } = req.params;

  try {
    const bookings = await Calendar.find({ client: clientId }).populate({
      path: "slots",
      populate: { path: "timeRange" },
    });

    const formatted = bookings
      .map((booking) => {
        const bookedSlots = booking.slots
          .filter((slot) => slot.isBooked && slot.timeRange)
          .map((slot) => slot.timeRange.label);

        return {
          date: booking.date,
          slots: bookedSlots,
        };
      })
      .filter((entry) => entry.slots.length > 0);

    res.status(200).json(formatted);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


const getBookingByDate = async (req, res) => {
  try {
    const date = req.params.date;

    const slots = await Slot.find({ date })
      .populate("timeRange", "label")
      .populate("client", "name");

    const result = slots.map((slot) => ({
      id: slot._id,
      timeRange: slot.timeRange.label,
      isBooked: slot.isBooked,
      clientName: slot.client?.name || null,
      clientId: slot.client?._id || null, 
    }));

    res.status(200).json(result);
  } catch (err) {
    console.error("Error in getBookingByDate:", err);
    res.status(500).json({ message: "Failed to fetch bookings by date" });
  }
};

module.exports = {
  createOrUpdateBooking,
  getBookingByDate,
  getBookingsByClientId,
};
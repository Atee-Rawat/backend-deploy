const Room = require('../../models/rupin_b/Room');

const addRoom = async (req, res) => {
  try {
    const { clientId, roomName } = req.body;
    const room = new Room({ clientId, roomName });
    await room.save();
    res.status(201).json(room);
  } catch (err) {
    res.status(500).json({ error: "Error adding room" });
  }
};

const getRoomsByClient = async (req, res) => {
  try {
    const rooms = await Room.find({ clientId: req.params.clientId });
    res.status(200).json(rooms);
  } catch (err) {
    res.status(500).json({ error: "Error fetching rooms" });
  }
};

const deleteRoom = async (req, res) => {
  try {
    const deleted = await Room.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Room not found" });
    res.status(200).json({ message: "Room deleted" });
  } catch (err) {
    res.status(500).json({ error: "Error deleting room" });
  }
};

const getRoomById = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) return res.status(404).json({ message: "Room not found" });
    res.status(200).json(room);
  } catch (error) {
    console.error("Error fetching room by ID:", error);
    res.status(500).json({ message: "Server error" });
  }
};


module.exports = {
  addRoom,
  getRoomsByClient,
  deleteRoom,
  getRoomById,
};

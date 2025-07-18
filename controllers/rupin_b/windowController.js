const Window = require('../../models/rupin_b/Window');
const Curtain = require('../../models/rupin_b/Curtain');
const Blind = require('../../models/rupin_b/Blind');

const addWindow = async (req, res) => {
  try {
    const {
      clientId,
      roomId,
      roomName,
      windowName,
      widthCm,
      heightCm,
      areaSqft,
      hasCurtains,
      hasBlinds,
      additionalNotes,
    } = req.body;

    if (!clientId || !roomId || !roomName || !windowName ||
        widthCm === undefined || heightCm === undefined || areaSqft === undefined) {
      return res.status(400).json({ message: 'All required fields must be provided.' });
    }

    const newWindow = new Window({
      clientId,
      roomId,
      roomName,
      windowName,
      widthCm,
      heightCm,
      areaSqft,
      hasCurtains,
      hasBlinds,
      additionalNotes,
    });

    await newWindow.save();
    res.status(201).json({ message: 'Window added successfully.', window: newWindow });
  } catch (error) {
    console.error("Error saving window:", error);
    res.status(500).json({ message: 'Server error' });
  }
};


const getWindowsByClient = async (req, res) => {
  try {
    const { clientId } = req.params;
    const windows = await Window.find({ clientId }).sort({ createdAt: -1 });
    res.json(windows);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getWindowsByRoomId = async (req, res) => {
  try {
    const { roomId } = req.params;
    const windows = await Window.find({ roomId }).sort({ createdAt: -1 });
    res.status(200).json(windows);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getWindowById = async (req, res) => {
  try {
    const window = await Window.findById(req.params.id);
    if (!window) {
      return res.status(404).json({ message: 'Window not found.' });
    }
    res.status(200).json(window);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteWindow = async (req, res) => {
  try {
    const windowId = req.params.id;

    const deletedWindow = await Window.findByIdAndDelete(windowId);
    if (!deletedWindow) {
      return res.status(404).json({ message: 'Window not found.' });
    }

    await Curtain.deleteOne({ windowId });
    await Blind.deleteOne({ windowId });

    res.status(200).json({ message: 'Window and associated data deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const updateWindow = async (req, res) => {
  try {
    const updatedWindow = await Window.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedWindow);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  addWindow,
  getWindowsByClient,
  getWindowById,
  deleteWindow,
  updateWindow,
  getWindowsByRoomId,
};

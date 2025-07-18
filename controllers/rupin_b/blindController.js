const Blind = require("../../models/rupin_b/Blind");

const saveBlind = async (req, res) => {
  try {
    const { windowId } = req.params;
    const newBlind = new Blind({ ...req.body, windowId });
    await newBlind.save();
    return res.status(201).json(newBlind);
  } catch (error) {
    res.status(500).json({ message: "Server error saving blind" });
  }
};

const getBlindByWindow = async (req, res) => {
  try {
    const { windowId } = req.params;
    const blinds = await Blind.find({ windowId });
    res.status(200).json(blinds);
  } catch (error) {
    res.status(500).json({ message: "Server error getting blinds" });
  }
};

const deleteBlind = async (req, res) => {
  try {
    const { id } = req.params;
    await Blind.findByIdAndDelete(id);
    res.json({ message: "Blind deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error deleting blind" });
  }
};

const toggleBlindComplete = async (req, res) => {
  try {
    const { id } = req.params;
    const blind = await Blind.findById(id);
    if (!blind) return res.status(404).json({ message: "Blind not found" });

    blind.isCompleted = !blind.isCompleted;
    await blind.save();
    res.json(blind);
  } catch (error) {
    res.status(500).json({ message: "Server error updating blind" });
  }
};

const updateBlind = async (req, res) => {
  try {
    const updated = await Blind.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ error: "Failed to update blind" });
  }
};

module.exports = {
  saveBlind,
  getBlindByWindow,
  deleteBlind,
  toggleBlindComplete,
  updateBlind,
};

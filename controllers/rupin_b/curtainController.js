const Curtain = require("../../models/rupin_b/Curtain");

const saveCurtain = async (req, res) => {
  try {
    const { windowId } = req.params;
    const newCurtain = new Curtain({ ...req.body, windowId });
    await newCurtain.save();
    return res.status(201).json(newCurtain);
  } catch (error) {
    res.status(500).json({ message: "Server error saving curtain" });
  }
};

const getCurtainByWindow = async (req, res) => {
  try {
    const { windowId } = req.params;
    const curtains = await Curtain.find({ windowId });
    return res.status(200).json(curtains);
  } catch (error) {
    res.status(500).json({ message: "Server error getting curtains" });
  }
};

const deleteCurtain = async (req, res) => {
  try {
    const { id } = req.params;
    await Curtain.findByIdAndDelete(id);
    res.json({ message: "Curtain deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error deleting curtain" });
  }
};

const toggleCurtainComplete = async (req, res) => {
  try {
    const { id } = req.params;
    const curtain = await Curtain.findById(id);
    if (!curtain) return res.status(404).json({ message: "Curtain not found" });

    curtain.isCompleted = !curtain.isCompleted;
    await curtain.save();
    res.json(curtain);
  } catch (error) {
    res.status(500).json({ message: "Server error updating curtain" });
  }
};

const updateCurtain = async (req, res) => {
  try {
    const updated = await Curtain.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ error: "Failed to update curtain" });
  }
};

module.exports = {
  saveCurtain,
  getCurtainByWindow,
  deleteCurtain,
  toggleCurtainComplete,
  updateCurtain,
};

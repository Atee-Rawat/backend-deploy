const Client = require("../../models/rupin_b/Client");


const addClient = async (req, res) => {
  try {
    const { name, manualAddress, address, phoneNumber, gpsLocation } = req.body;

    if (!name || !manualAddress || !address || !phoneNumber || !gpsLocation) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    if (
      typeof gpsLocation !== 'object' ||
      gpsLocation.type !== 'Point' ||
      !Array.isArray(gpsLocation.coordinates) ||
      gpsLocation.coordinates.length !== 2 ||
      gpsLocation.coordinates.some((val) => typeof val !== 'number')
    ) {
      return res.status(400).json({
        message: 'Invalid GPS location format. Expected GeoJSON { type: "Point", coordinates: [lng, lat] }',
      });
    }

    const client = new Client({
      name,
      manualAddress,
      address,
      phoneNumber,
      gpsLocation,
      createdBy: req.user.id,
    });

    const savedClient = await client.save();

    res.status(201).json({
      message: 'Client added successfully.',
      client: savedClient,
    });
  } catch (error) {
    console.error('Error adding client:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


const getAllClients = async (req, res) => {
  try {
    const clients = await Client.find().sort({ createdAt: -1 }); // no populate
    res.json(clients);
  } catch (error) {
    console.error('Error fetching clients:', error);
    res.status(500).json({ message: 'Server error' });
  }
};



const getClientById = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id)
      .populate('createdBy', 'firstName lastName');

    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }

    res.json(client);
  } catch (error) {
    console.error('Error fetching client by ID:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


const updateClient = async (req, res) => {
  try {
    const { name, manualAddress, address, phoneNumber, gpsLocation } = req.body;

    const updatedFields = {
      name,
      manualAddress,
      address,
      phoneNumber,
    };

    if (
      gpsLocation &&
      typeof gpsLocation === 'object' &&
      gpsLocation.type === 'Point' &&
      Array.isArray(gpsLocation.coordinates) &&
      gpsLocation.coordinates.length === 2 &&
      gpsLocation.coordinates.every((val) => typeof val === 'number')
    ) {
      updatedFields.gpsLocation = gpsLocation;
    }

    const updatedClient = await Client.findByIdAndUpdate(req.params.id, updatedFields, {
      new: true,
    });

    if (!updatedClient) {
      return res.status(404).json({ message: 'Client not found' });
    }

    res.status(200).json({
      message: 'Client updated successfully.',
      client: updatedClient,
    });
  } catch (error) {
    console.error('Error updating client:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


const deleteClient = async (req, res) => {
  try {
    const deletedClient = await Client.findByIdAndDelete(req.params.id);

    if (!deletedClient) {
      return res.status(404).json({ message: 'Client not found' });
    }

    res.status(200).json({ message: 'Client deleted successfully.' });
  } catch (error) {
    console.error('Error deleting client:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  addClient,
  getAllClients,
  getClientById,
  updateClient,
  deleteClient,
};

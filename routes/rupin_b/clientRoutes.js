const express = require('express');
const router = express.Router();

const {
  addClient,
  getAllClients,
  getClientById,
  updateClient,
  deleteClient,
} = require('../../controllers/rupin_b/clientController');

const { isAuthenticated } = require('../../middleware/auth');


router.post('/clients', isAuthenticated, addClient);
router.get('/clients', isAuthenticated, getAllClients);
router.get('/clients/:id', isAuthenticated, getClientById);
router.put('/clients/:id', isAuthenticated, updateClient);
router.delete('/clients/:id', isAuthenticated, deleteClient);

module.exports = router;

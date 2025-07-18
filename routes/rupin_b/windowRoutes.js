const express = require('express');
const router = express.Router();
const {
  addWindow,
  getWindowsByClient,
  getWindowById,
  deleteWindow,
  updateWindow,
  getWindowsByRoomId
} = require('../../controllers/rupin_b/windowController');
const { isAuthenticated } = require('../../middleware/auth');

router.post('/', isAuthenticated, addWindow);
router.get('/by-client/:clientId', isAuthenticated, getWindowsByClient);
router.get('/by-room/:roomId', isAuthenticated, getWindowsByRoomId);
router.get('/:id', isAuthenticated, getWindowById);
router.put('/:id', isAuthenticated, updateWindow);
router.delete('/:id', isAuthenticated, deleteWindow);

module.exports = router;

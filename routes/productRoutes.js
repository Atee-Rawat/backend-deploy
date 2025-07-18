const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

router.post('/add', productController.addProduct);
router.put('/update/:productID', productController.updateProduct);
router.delete('/delete/:productID', productController.deleteProduct);
router.get('/list', productController.getAllProducts);

module.exports = router;

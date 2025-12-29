import React, { useState } from 'react';
import styles from './styles.module.css';
import { Modal, TextField, Button, Typography, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { ADDPRODUCT } from '../../apis/apisUtils';

const AddProductModal = ({ open, onClose }) => {
  const [productData, setProductData] = useState({
    product_Name: '',
    description: '',
    price: '',
    unit: '',
    currency: ''
  });

  const handleChange = (e) => {
    setProductData({
      ...productData,
      [e.target.name]: e.target.value,
    });
  };
  const handleSubmit = async () => {
    try {
      const response = await fetch(ADDPRODUCT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData), 
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const Data = await response.json();
      console.log("Product Data Submitted: ", Data);
      onClose(); // Close the modal after submitting
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="modal-title">
      <div className={styles.modalContainer}>
        <div className={styles.modalHeader}>
          <Typography id="modal-title" variant="h6" component="h2">
            Add New Product
          </Typography>
          <IconButton onClick={onClose} className={styles.closeButton}>
            <CloseIcon />
          </IconButton>
        </div>

        <TextField
          label="Product Name"
          name="product_Name"
          value={productData.product_Name}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Description"
          name="description"
          value={productData.description}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Price"
          name="price"
          type="number"
          value={productData.price}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Unit"
          name="unit"
          type="number"
          value={productData.unit}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Currency"
          name="currency"
          value={productData.currency}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />

        <div className={styles.buttonContainer}>
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Add Product
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default AddProductModal;

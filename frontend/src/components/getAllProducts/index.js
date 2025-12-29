import React, { useEffect, useState } from 'react';
import { Modal, Button, Card, Typography } from '@mui/material';
import styles from './styles.module.css';
import { DELETEPRODUCT, GETALLPRODUCT } from '../../apis/apisUtils';

const GetProduct = ({ open, onClose }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch products from the API
  useEffect(() => {
    if (open) {
      fetchProducts();
    }
  }, [open]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch(GETALLPRODUCT); // Replace with actual API URL
      const data = await response.json();
      setProducts(data.data); // Assuming 'data' contains the list of products
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    console.log(id,"APNI ID");
    try {
      await fetch(DELETEPRODUCT(id), {
        method: 'DELETE',
      }); // Replace with actual API URL
      setProducts(products.filter(product => product.productID !== id)); // Update local state after deletion
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <div className={styles.modalContainer}>
        <Typography id="modal-title" variant="h6" component="h2">
          Product List
        </Typography>

        {loading ? (
          <Typography>Loading...</Typography>
        ) : (
          <div className={styles.scrollableContainer}>
            {products.length > 0 ? (
              products.map((product) => (
                <Card key={product.productID} className={styles.productCard}>
                  <div className={styles.cardHeader}>
                    <Typography variant="h6">
                      {product.product_Name}
                    </Typography>
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={() => handleDeleteProduct(product.productID)}
                    >
                      Delete
                    </Button>
                  </div>
                </Card>
              ))
            ) : (
              <Typography>No Products Available</Typography>
            )}
          </div>
        )}

        <Button onClick={onClose} variant="outlined" color="primary">
          Close
        </Button>
      </div>
    </Modal>
  );
};

export default GetProduct;

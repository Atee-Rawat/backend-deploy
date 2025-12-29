import React, { useEffect, useState } from "react";
import {
  Modal,
  Button,
  Card,
  Typography,
  TextField,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import styles from "./styles.module.css";
import { UPDATEPRODUCT, GETALLPRODUCT } from "../../apis/apisUtils";

const UpdateProductModal = ({ open, onClose }) => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [productData, setProductData] = useState({
    product_Name: "",
    description: "",
    price: "",
    unit: "",
    currency: "",
  });

  const handleChange = (e) => {
    setProductData({
      ...productData,
      [e.target.name]: e.target.value,
    });
  };

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
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateClick = (product) => {
    setSelectedProduct(product);
    setProductData(product);
  };

  const handleSubmit = async () => {
    if (!selectedProduct) return;
    try {
      const response = await fetch(UPDATEPRODUCT(selectedProduct.productID), {

        method: "PUT", // Use the PUT method for updating
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      });

      if (response.ok) {
        const updatedProduct = await response.json();
        console.log("Product updated successfully:", updatedProduct);
        onClose(); // Close the modal after successful update
      } else {
        console.error("Failed to update product");
      }
    } catch (error) {
      console.error("Error updating product:", error);
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
        {!selectedProduct ? (
          <>
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
                        <Typography variant="h6">{product.product_Name}</Typography>
                        <Button
                          variant="outlined"
                          color="success"
                          onClick={() => handleUpdateClick(product)}
                        >
                          Update
                        </Button>
                      </div>
                    </Card>
                  ))
                ) : (
                  <Typography>No Products Available</Typography>
                )}
              </div>
            )}
          </>
        ) : (
          <>
            <div className={styles.modalHeader}>
              <Typography id="modal-title" variant="h6" component="h2">
                Update Product
              </Typography>
              <IconButton onClick={() => setSelectedProduct(null)} className={styles.closeButton}>
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
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
              >
                Update Product
              </Button>
            </div>
          </>
        )}
        
        <Button onClick={()=>{onClose()}} variant="outlined" color="primary">
          Close
        </Button>
      </div>
    </Modal>
  );
};

export default UpdateProductModal;

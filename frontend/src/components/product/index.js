import React, { useState } from "react";
import { Link } from "react-router-dom";
import styles from "./styles.module.css"; // Importing CSS module
import AddProductModal from "../addProductCard";
import UpdateProductModal from "../updateProduct";
import GetProduct from "../getAllProducts";

const ProjectOverviewCard = () => {
  const [addProductModalOpen, setAddProductModalOpen] = useState(false);
  const [updateProductModalOpen, setUpdateProductModalOpen] = useState(false);
  const [getAllProductsModalOpen, setGetAllProductsModalOpen] = useState(false);

  // Handlers for Add Product Modal
  const handleOpenAddProductModal = () => setAddProductModalOpen(true);
  const handleCloseAddProductModal = () => setAddProductModalOpen(false);

  // Handlers for Update Product Modal
  const handleOpenUpdateProductModal = () => setUpdateProductModalOpen(true);
  const handleCloseUpdateProductModal = () => setUpdateProductModalOpen(false);

  // Handlers for Get All Products Modal
  const handleOpenGetAllProductsModal = () => setGetAllProductsModalOpen(true);
  const handleCloseGetAllProductsModal = () => setGetAllProductsModalOpen(false);

  return (
    <div className={styles.cardContainer}>
      <h2 className={styles.heading}>Project Overview</h2>

      <div className={styles.linkContainer}>
        {/* Add Product */}
        <div>
          <Link onClick={handleOpenAddProductModal} className={styles.link}>
            Add Product
          </Link>
          <AddProductModal open={addProductModalOpen} onClose={handleCloseAddProductModal} />
        </div>

        {/* Update Product */}
        <div>
          <Link onClick={handleOpenUpdateProductModal} className={styles.link}>
            Update Product
          </Link>
          <UpdateProductModal open={updateProductModalOpen} onClose={handleCloseUpdateProductModal} />
        </div>

        {/* Get All Products */}
        <div>
          <Link onClick={handleOpenGetAllProductsModal} className={styles.link}>
            Get All Products
          </Link>
          <GetProduct open={getAllProductsModalOpen} onClose={handleCloseGetAllProductsModal} />
        </div>
      </div>
    </div>
  );
};

export default ProjectOverviewCard;

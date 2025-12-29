import React, { useState, useEffect } from "react";
import { Button, Typography, Box, Dialog, DialogTitle, DialogContent } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import AddClient from "../../components/addClient/AddClient";
import axios from "axios";
import "./Rupin.css";

const Rupin = () => {
  const [clients, setClients] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editClient, setEditClient] = useState(null);
  const navigate = useNavigate();

  const fetchClients = async () => {
    try {
      const res = await axios.get("https://backend-deploy-dxwh.onrender.com/api/rupin/clients", {
        withCredentials: true,
      });
      
      setClients(res.data);
    } catch (err) {
      console.error("Error fetching clients:", err);
    }
  };

  const handleAddClient = async (newClient) => {
    try {
      if (editClient) {
        await axios.put(
          `${process.env.REACT_APP_API_BASE_URL}/api/rupin/clients/${editClient._id}`,
          newClient,
          { withCredentials: true }
        );
      } else {
        await axios.post("https://backend-deploy-dxwh.onrender.com/api/rupin/clients", newClient, {
          withCredentials: true,
        });
        
      }
      fetchClients();
      setShowForm(false);
      setEditClient(null);
    } catch (err) {
      console.error("Error saving client:", err);
    }
  };

  const handleDeleteClient = async (id) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/api/rupin/clients/${id}`, {
        withCredentials: true,
      });
      fetchClients();
    } catch (err) {
      console.error("Error deleting client:", err);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  return (
    <>
      <Navbar />
      <div className="rupin-container">
        <header className="rupin-header">
          <Typography variant="h4" className="rupin-title">
            Customers:
          </Typography>
          <Button
            variant="contained"
            className="add-customer-btn"
            onClick={() => {
              setEditClient(null);
              setShowForm(true);
            }}
          >
            + Add Customer
          </Button>
        </header>

        <Dialog
          open={showForm}
          onClose={() => setShowForm(false)}
          fullWidth
          maxWidth="sm"
          PaperProps={{
            sx: {
              backgroundColor: "#fff !important",
              color: "#000 !important",
              borderRadius: "12px !important",
              boxShadow: "none !important",
              border: "none !important",
              m: 0,
              p: 0,
              overflow: "hidden !important",
            },
          }}
        >
          <DialogTitle
            sx={{
              color: "#000 !important",
              fontWeight: 600,
              p: "16px !important",
              m: 0,
            }}
          >
            {editClient ? "Edit Customer" : "Add Customer"}
          </DialogTitle>

          <DialogContent
            sx={{
              p: "16px !important",
              m: 0,
              pb: 0,
              overflowY: "visible",
            }}
          >
            <AddClient
              onClose={() => {
                setShowForm(false);
                setEditClient(null);
              }}
              onSave={handleAddClient}
              initialData={editClient}
            />
          </DialogContent>
        </Dialog>

        <main className="rupin-customer-list">
          {clients.length > 0 ? (
            clients.map((customer, idx) => (
              <Box
                key={customer._id}
                className="customer-card"
                onClick={() => navigate(`/customers/${customer._id}`)}
                sx={{ cursor: "pointer" }}
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <Typography variant="h6" sx={{ color: "white" }}>
                  {customer.name}
                </Typography>
                <Typography variant="body2" className="customer-address">
                  {customer.address}
                </Typography>

                {customer.createdBy && (
                  <Typography variant="caption" className="customer-handler">
                    Handled by – {customer.createdBy.firstName}{" "}
                    {customer.createdBy.lastName}{" "}
                  </Typography>
                )}

                {customer.createdAt && (
                  <Typography variant="caption" sx={{ color: "gray" }}>
                    Created on –{" "}
                    {new Date(customer.createdAt).toLocaleDateString("en-IN", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </Typography>
                )}
                <br></br>
                <br></br>

                <Button
  variant="contained"
  className="edit-btn"
  onClick={(e) => {
    e.stopPropagation();
    setEditClient(customer);
    setShowForm(true);
  }}
>
  Edit
</Button>
<Button
  variant="contained"
  className="delete-btn"
  onClick={(e) => {
    e.stopPropagation();
    handleDeleteClient(customer._id);
  }}
>
  Delete
</Button>

              </Box>
            ))
          ) : (
            <Typography variant="body1" sx={{ mt: 2, color: "white" }}>
              No customers found.
            </Typography>
          )}
        </main>
      </div>
    </>
  );
};

export default Rupin;

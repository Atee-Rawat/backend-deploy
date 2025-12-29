import React, { useEffect, useRef, useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import "./AddClient.css";

const AddClient = ({ onSave, initialData = {}, onClose }) => {
  const [client, setClient] = useState({
    name: initialData?.name || "",
    phone: initialData?.phoneNumber || "",
    manualAddress: initialData?.manualAddress || "",
    address: initialData?.address || "",
    location: initialData?.gpsLocation || { type: "Point", coordinates: [0, 0] },
  });

  const autocompleteRef = useRef(null);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      const el = document.querySelector("gmpx-place-autocomplete");
      if (!el) return;

      el.addEventListener("gmpx-placeautocomplete-placechange", (event) => {
        const place = event.detail;
        const lat = place?.geometry?.location?.lat;
        const lng = place?.geometry?.location?.lng;
        const formatted = place?.formatted_address || place?.displayName?.text;

        if (lat && lng && formatted) {
          setClient((prev) => ({
            ...prev,
            address: formatted,
            location: {
              type: "Point",
              coordinates: [lng, lat],
            },
          }));
        }
      });

      observer.disconnect();
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, []);

  const handleUseCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setClient((prev) => ({
          ...prev,
          address: "Current Location",
          location: { type: "Point", coordinates: [longitude, latitude] },
        }));
      },
      (err) => {
        alert("Error fetching location.");
        console.error(err);
      }
    );
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setClient((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (!client.name || !client.phone || !client.manualAddress || !client.address) {
      alert("Please fill all required fields.");
      return;
    }

    if (typeof onSave === "function") {
      onSave({
        name: client.name,
        manualAddress: client.manualAddress,
        address: client.address,
        phoneNumber: client.phone,
        gpsLocation: client.location,
      });
    }
  };

  return (
    <Box className="add-client-dialog">
      <Box className="add-client-form">
        <label className="fixed-label">Name</label>
        <input
          name="name"
           className="custom-input"
          value={client.name}
          onChange={handleChange}
          placeholder="Enter full name"
        />

        <label className="fixed-label">Phone</label>
        <input
          name="phone"
           className="custom-input"
          value={client.phone}
          onChange={handleChange}
          placeholder="Enter phone number"
        />

        <label className="fixed-label">Address</label>
        <input
          name="manualAddress"
           className="custom-input"
          value={client.manualAddress}
          onChange={handleChange}
          placeholder="Enter address"
        />

        {/* <label className="fixed-label">Search Address (Google Autocomplete)</label>
        <gmpx-place-autocomplete
          style={{ display: "block", width: "100%", marginBottom: "1rem" }}
        >
          <input
            slot="input"
            placeholder="Search address"
            style={{
              width: "100%",
              padding: "10px",
              fontSize: "16px",
              border: "1px solid #000",
              borderRadius: "6px",
              marginTop: "0.5rem",
              backgroundColor: "#fff",
              color: "#000",
            }}
          />
        </gmpx-place-autocomplete> */}

        <Button variant="outlined" onClick={handleUseCurrentLocation} className="location-btn">
          Use Current Location
        </Button>

        <Typography className="coords">
          Coordinates: {client.location.coordinates[1]}, {client.location.coordinates[0]}
        </Typography>

        <Box className="buttons">
          <Button variant="text" onClick={onClose} className="cancel-btn">
            Cancel
          </Button>
          <Button variant="contained" color="warning" onClick={handleSubmit} className="submit-btn">
            Save Client
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default AddClient;

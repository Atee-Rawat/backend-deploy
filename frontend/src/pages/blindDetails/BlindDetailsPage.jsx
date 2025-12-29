import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import "./BlindDetailsPage.css";

const BlindDetailsPage = () => {
  const { windowId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const isAddMode = location.pathname.includes("/add/");

  const [form, setForm] = useState({
    mechanism: "",
    catalogueRef: "",
    type: "",
    surface: "",
    fitting: "",
    width: "",
    height: "",
    area: "",
  });

  const [existingBlinds, setExistingBlinds] = useState([]);
  const [windowDetails, setWindowDetails] = useState({ widthCm: 0, heightCm: 0 });

  const fetchWindowDetails = useCallback(async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/rupin/windows/${windowId}`, {
        withCredentials: true,
      });
      setWindowDetails({
        widthCm: res.data.widthCm || 0,
        heightCm: res.data.heightCm || 0,
      });
    } catch (err) {
      console.error("Error fetching window details:", err);
    }
  }, [windowId]);

  const fetchBlinds = useCallback(async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/api/rupin/blinds/by-window/${windowId}`,
        { withCredentials: true }
      );
      setExistingBlinds(res.data || []);
    } catch (err) {
      if (err.response?.status === 404) {
        setExistingBlinds([]);
      } else {
        console.error("Error fetching blind:", err);
      }
    }
  }, [windowId]);

  useEffect(() => {
    fetchWindowDetails();
    if (!isAddMode) {
      fetchBlinds();
    }
  }, [windowId, isAddMode, fetchWindowDetails, fetchBlinds]);

  useEffect(() => {
    const { widthCm, heightCm } = windowDetails;
    if (form.fitting === "Inside Window") {
      setForm((prev) => ({
        ...prev,
        width: (widthCm - 1).toFixed(2),
        height: heightCm.toFixed(2),
      }));
    } else if (form.fitting === "Outside Window") {
      setForm((prev) => ({
        ...prev,
        width: (widthCm + 10).toFixed(2),
        height: (heightCm + 10).toFixed(2),
      }));
    }
  }, [form.fitting, windowDetails]);

  useEffect(() => {
    const width = parseFloat(form.width);
    const height = parseFloat(form.height);
    if (!isNaN(width) && !isNaN(height)) {
      const areaSqft = (width * height) / 929.0304;
      setForm((prev) => ({
        ...prev,
        area: areaSqft.toFixed(2),
      }));
    }
  }, [form.width, form.height]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/api/rupin/blinds/${windowId}`,
        form,
        { withCredentials: true }
      );
      navigate(`/windows/${windowId}`);
    } catch (err) {
      console.error("Error saving blind:", err);
    }
  };

  return (
    <Box className="blind-details-container">
      <h2 className="blind-details-title">
        {isAddMode ? "Add New Blind" : "Blind Details"}
      </h2>

      <FormControl fullWidth margin="dense">
        <InputLabel>Mechanism</InputLabel>
        <Select name="mechanism" value={form.mechanism} onChange={handleChange}>
          <MenuItem value="Manual">Manual</MenuItem>
          <MenuItem value="Motorised">Motorised</MenuItem>
        </Select>
      </FormControl>

      <TextField
        label="Catalogue Reference"
        name="catalogueRef"
        value={form.catalogueRef}
        onChange={handleChange}
        fullWidth
        margin="dense"
      />

      <FormControl fullWidth margin="dense">
        <InputLabel>Type (Optional)</InputLabel>
        <Select name="type" value={form.type} onChange={handleChange}>
          <MenuItem value="Roller Blind">Roller Blind</MenuItem>
          <MenuItem value="Zebra Blind">Zebra Blind</MenuItem>
          <MenuItem value="Roman Blind">Roman Blind</MenuItem>
          <MenuItem value="Wooden Blind">Wooden Blind</MenuItem>
          <MenuItem value="Venetian Blind">Venetian Blind</MenuItem>
        </Select>
      </FormControl>

      <FormControl fullWidth margin="dense">
        <InputLabel>Installation Surface</InputLabel>
        <Select name="surface" value={form.surface} onChange={handleChange}>
          <MenuItem value="Concrete">Concrete</MenuItem>
          <MenuItem value="Pelmet">Pelmet</MenuItem>
        </Select>
      </FormControl>

      <FormControl fullWidth margin="dense">
        <InputLabel>Fitting</InputLabel>
        <Select name="fitting" value={form.fitting} onChange={handleChange}>
          <MenuItem value="Inside Window">Inside Window</MenuItem>
          <MenuItem value="Outside Window">Outside Window</MenuItem>
        </Select>
      </FormControl>

      <TextField
        label="Width (cm)"
        name="width"
        type="number"
        value={form.width}
        onChange={handleChange}
        fullWidth
        margin="dense"
      />

      <TextField
        label="Height (cm)"
        name="height"
        type="number"
        value={form.height}
        onChange={handleChange}
        fullWidth
        margin="dense"
      />

      <TextField
        label="Area (sqft)"
        name="area"
        type="number"
        value={form.area}
        fullWidth
        margin="dense"
        disabled
      />

      <Button
        variant="contained"
        color="warning"
        className="blind-submit-btn"
        onClick={handleSubmit}
      >
        Save Blind Details
      </Button>

      {!isAddMode && existingBlinds.length > 0 && (
        <Button
          variant="contained"
          className="blind-add-another-btn"
          onClick={() => navigate(`/blinds/add/${windowId}`)}
        >
          Add Another Blind
        </Button>
      )}
    </Box>
  );
};

export default BlindDetailsPage;

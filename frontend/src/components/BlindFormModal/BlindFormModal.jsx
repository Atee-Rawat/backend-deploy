import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Select,
  MenuItem,
  Box,
  Typography,
} from "@mui/material";
import axios from "axios";
import "./BlindFormModal.css";

const BlindFormModal = ({
  windowId,
  windowWidth = 0,
  windowHeight = 0,
  onClose,
  editMode = false,
  existingData = {},
  blindId = null,
}) => {
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

  useEffect(() => {
    if (editMode && existingData) {
      setForm({
        mechanism: existingData.mechanism || "",
        catalogueRef: existingData.catalogueRef || "",
        type: existingData.type || "",
        surface: existingData.surface || "",
        fitting: existingData.fitting || "",
        width: existingData.width || "",
        height: existingData.height || "",
        area: existingData.area || "",
      });
    }
  }, [editMode, existingData]);

  useEffect(() => {
    if (!editMode && form.fitting) {
      const w = parseFloat(windowWidth);
      const h = parseFloat(windowHeight);
      let width = w;
      let height = h;

      if (form.fitting === "Inside Window") {
        width = w - 1;
        height = h;
      } else if (form.fitting === "Outside Window") {
        width = w + 10;
        height = h + 10;
      }

      const area = ((width / 100) * (height / 100)).toFixed(2);
      const sqft = (area * 10.7639).toFixed(2);

      setForm((prev) => ({
        ...prev,
        width: width.toFixed(1),
        height: height.toFixed(1),
        area: sqft,
      }));
    }
  }, [form.fitting, windowWidth, windowHeight, editMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      if (editMode && blindId) {
        await axios.put(
          `${process.env.REACT_APP_API_BASE_URL}/api/rupin/blinds/${blindId}`,
          form,
          { withCredentials: true }
        );
      } else {
        await axios.post(
          `${process.env.REACT_APP_API_BASE_URL}/api/rupin/blinds/${windowId}`,
          form,
          { withCredentials: true }
        );
      }
      onClose();
    } catch (err) {
      console.error("Error saving blind:", err);
    }
  };

  return (
    <Dialog
      open
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        className: "blind-modal-paper",
      }}
    >
      <DialogTitle className="blind-modal-title">
        {editMode ? "Edit Blind Details" : "Add Blind Details"}
      </DialogTitle>
      <DialogContent className="blind-modal-content">
        <Box className="blind-form-box">
          <Typography className="blind-label">Mechanism</Typography>
          <Select
            name="mechanism"
            value={form.mechanism}
            onChange={handleChange}
            fullWidth
            className="blind-input"
          >
            <MenuItem value="Manual" className="blind-option">
              Manual
            </MenuItem>
            <MenuItem value="Motorised" className="blind-option">
              Motorised
            </MenuItem>
          </Select>

          <Typography className="blind-label">Catalogue Reference</Typography>
          <TextField
            name="catalogueRef"
            value={form.catalogueRef}
            onChange={handleChange}
            fullWidth
            margin="dense"
            className="blind-input"
          />

          <Typography className="blind-label">Type</Typography>
          <Select
            name="type"
            value={form.type}
            onChange={handleChange}
            fullWidth
            className="blind-input"
          >
            <MenuItem value="Roller" className="blind-option">
              Roller Blind
            </MenuItem>
            <MenuItem value="Zebra" className="blind-option">
              Zebra Blind
            </MenuItem>
            <MenuItem value="Roman" className="blind-option">
              Roman Blind
            </MenuItem>
            <MenuItem value="Wooden" className="blind-option">
              Wooden Blind
            </MenuItem>
            <MenuItem value="Venetian" className="blind-option">
              Venetian Blind
            </MenuItem>
          </Select>

          <Typography className="blind-label">Surface</Typography>
          <Select
            name="surface"
            value={form.surface}
            onChange={handleChange}
            fullWidth
            className="blind-input"
          >
            <MenuItem value="Concrete" className="blind-option">
              Concrete
            </MenuItem>
            <MenuItem value="Pelmet" className="blind-option">
              Pelmet
            </MenuItem>
          </Select>

          <Typography className="blind-label">Fitting</Typography>
          <Select
            name="fitting"
            value={form.fitting}
            onChange={handleChange}
            fullWidth
            className="blind-input"
          >
            <MenuItem value="Inside Window" className="blind-option">
              Inside Window
            </MenuItem>
            <MenuItem value="Outside Window" className="blind-option">
              Outside Window
            </MenuItem>
          </Select>

          <Typography className="blind-label">Width (in cms)</Typography>
          <TextField
            name="width"
            type="number"
            value={form.width}
            onChange={handleChange}
            fullWidth
            margin="dense"
            className="blind-input"
            disabled={!editMode}
          />

          <Typography className="blind-label">Height (in cms)</Typography>
          <TextField
            name="height"
            type="number"
            value={form.height}
            onChange={handleChange}
            fullWidth
            margin="dense"
            className="blind-input"
            disabled={!editMode}
          />

          <Typography className="blind-label">Area (in sqft)</Typography>
          <TextField
            name="area"
            type="number"
            value={form.area}
            onChange={handleChange}
            fullWidth
            margin="dense"
            className="blind-input"
            disabled={!editMode}
          />
        </Box>
      </DialogContent>
      <DialogActions className="blind-modal-actions">
        <Button
          onClick={onClose}
          variant="outlined"
          className="blind-cancel-button"
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          className="blind-submit-button"
        >
          {editMode ? "Update" : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BlindFormModal;

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  DialogActions,
  Box,
  Typography,
} from "@mui/material";
import axios from "axios";
import "./WindowPopupForm.css";

const WindowPopupForm = ({
  open,
  onClose,
  roomId,
  roomName,
  clientId,
  onWindowAdded,
  initialData = null,
  windowId = null,
}) => {
  const [form, setForm] = useState({
    windowName: "",
    widthCm: "",
    heightCm: "",
    areaSqft: "",
    hasCurtains: false,
    hasBlinds: false,
    additionalNotes: "",
  });

  const resetForm = () => {
    setForm({
      windowName: "",
      widthCm: "",
      heightCm: "",
      areaSqft: "",
      hasCurtains: false,
      hasBlinds: false,
      additionalNotes: "",
    });
  };

  useEffect(() => {
    if (open) {
      if (initialData) setForm(initialData);
      else resetForm();
    }
  }, [open, initialData]);

  useEffect(() => {
    const widthFeet = parseFloat(form.widthCm) / 30.48;
    const heightFeet = parseFloat(form.heightCm) / 30.48;

    if (!isNaN(widthFeet) && !isNaN(heightFeet)) {
      const area = widthFeet * heightFeet;
      setForm((prev) => ({ ...prev, areaSqft: area.toFixed(2) }));
    } else {
      setForm((prev) => ({ ...prev, areaSqft: "" }));
    }
  }, [form.widthCm, form.heightCm]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSave = async () => {
    try {
      const payload = {
        ...form,
        roomId,
        clientId,
        roomName,
        widthCm: Number(form.widthCm),
        heightCm: Number(form.heightCm),
        areaSqft: Number(form.areaSqft),
      };

      if (windowId) {
        await axios.put(
          `https://backend-deploy-dxwh.onrender.com/api/rupin/windows/${windowId}`,
          payload,
          { withCredentials: true }
        );
      } else {
        await axios.post("https://backend-deploy-dxwh.onrender.com/api/rupin/windows", payload, {
          withCredentials: true,
        });

      }

      onClose();
      if (onWindowAdded) onWindowAdded();
    } catch (error) {
      console.error("Error saving window:", error.response?.data || error.message);
    }
  };

  const renderInput = (label, name, type = "text", multiline = false, rows = 1) => (
    <Box className="input-box">
      <Typography className="input-label">{label}</Typography>
      <TextField
        name={name}
        value={form[name]}
        onChange={handleChange}
        fullWidth
        type={type}
        multiline={multiline}
        rows={rows}
        placeholder={label}
        InputProps={{
          className: "input-field",
        }}
      />
    </Box>
  );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        className: "window-dialog-paper",
      }}
    >
      <DialogTitle className="dialog-title">
        {windowId ? "Edit Window" : "Add Window"}
      </DialogTitle>
      <DialogContent>
        {renderInput("Window Name", "windowName")}
        {renderInput("Width (cm)", "widthCm", "number")}
        {renderInput("Height (cm)", "heightCm", "number")}
        {renderInput("Area (sqft)", "areaSqft", "number")}
        {renderInput("Additional Notes", "additionalNotes", "text", true, 3)}
      </DialogContent>
      <DialogActions className="dialog-actions">
        <Button className="save-btn" onClick={handleSave}>
          {windowId ? "Update" : "Save"}
        </Button>
        <Button className="cancel-btn" onClick={onClose}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default WindowPopupForm;

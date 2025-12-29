import React, { useState, useEffect } from "react";
import axios from "axios";
import { Box, Typography, TextField, Button, Divider, Checkbox, FormControlLabel } from "@mui/material";
import { useNavigate } from "react-router-dom";
import "./WindowsSection.css";

const WindowsSection = ({ clientId }) => {
  const [windows, setWindows] = useState([]);
  const [form, setForm] = useState({
    roomName: "",
    windowName: "",
    widthCm: "",
    heightCm: "",
    areaSqft: "",
    hasCurtains: false,
    hasBlinds: false,
    additionalNotes: "",
  });

  const navigate = useNavigate();

  const fetchWindows = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/api/rupin/windows/by-client/${clientId}`,
        { withCredentials: true }
      );
      setWindows(res.data);
    } catch (error) {
      console.error("Error fetching windows:", error);
    }
  };

  useEffect(() => {
    if (clientId) fetchWindows();
  }, [clientId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAddWindow = async () => {
    try {
      const res = await axios.post(
        "https://backend-deploy-dxwh.onrender.com/api/rupin/windows",
        { ...form, clientId },
        { withCredentials: true }
      );
      
      const newWindow = res.data.window;
      setForm({
        roomName: "",
        windowName: "",
        widthCm: "",
        heightCm: "",
        areaSqft: "",
        hasCurtains: false,
        hasBlinds: false,
        additionalNotes: "",
      });

      if (newWindow.hasCurtains) {
        if (newWindow.hasBlinds) {
          navigate(`/curtains/${newWindow._id}`, {
            state: { redirectToBlinds: true },
          });
        } else {
          navigate(`/curtains/${newWindow._id}`);
        }
      } else if (newWindow.hasBlinds) {
        navigate(`/blinds/${newWindow._id}`);
      } else {
        fetchWindows();
      }
    } catch (error) {
      console.error("Error adding window:", error);
    }
  };

  const handleDeleteWindow = async (windowId) => {
    if (!window.confirm("Are you sure you want to delete this window?")) return;

    try {
      await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/api/rupin/windows/${windowId}`, {
        withCredentials: true,
      });
      setWindows((prev) => prev.filter((w) => w._id !== windowId));
    } catch (error) {
      console.error("Error deleting window:", error);
    }
  };

  return (
    <Box className="windows-section">
      <Typography variant="h6" className="section-heading">Windows Details</Typography>

      <Box className="window-form">
        <TextField fullWidth label="Room Name" name="roomName" value={form.roomName} onChange={handleChange} margin="dense" />
        <TextField fullWidth label="Window Name" name="windowName" value={form.windowName} onChange={handleChange} margin="dense" />
        <TextField fullWidth label="Width (cm)" name="widthCm" value={form.widthCm} onChange={handleChange} margin="dense" />
        <TextField fullWidth label="Height (cm)" name="heightCm" value={form.heightCm} onChange={handleChange} margin="dense" />
        <TextField fullWidth label="Area (sqft)" name="areaSqft" value={form.areaSqft} onChange={handleChange} margin="dense" />
        <FormControlLabel control={<Checkbox checked={form.hasCurtains} name="hasCurtains" onChange={handleChange} />} label="Curtains" />
        <FormControlLabel control={<Checkbox checked={form.hasBlinds} name="hasBlinds" onChange={handleChange} />} label="Blinds" />
        <TextField fullWidth label="Additional Notes" name="additionalNotes" value={form.additionalNotes} onChange={handleChange} multiline rows={2} margin="dense" />

        <Button variant="contained" color="warning" onClick={handleAddWindow} className="submit-btn">
          Add Window
        </Button>
      </Box>

      <Divider className="section-divider" />

      <Typography variant="subtitle1" className="existing-title">Existing Windows:</Typography>
      {windows.length > 0 ? (
        windows.map((win) => (
          <Box key={win._id} className="window-card">
            <Typography className="window-room">{win.roomName}</Typography>
            <Typography variant="body2">
              Window: {win.windowName}, {win.widthCm}cm x {win.heightCm}cm ({win.areaSqft} sqft)
            </Typography>
            <Typography variant="body2">
              {win.hasCurtains && "Curtains"}
              {win.hasCurtains && win.hasBlinds && " | "}
              {win.hasBlinds && "Blinds"}
            </Typography>
            {win.additionalNotes && (
              <Typography variant="body2">Notes: {win.additionalNotes}</Typography>
            )}

            <Box className="card-buttons">
              <Button variant="outlined" color="primary" onClick={() => navigate(`/windows/${win._id}`)}>View Details</Button>
              <Button variant="outlined" color="error" onClick={() => handleDeleteWindow(win._id)}>Delete</Button>
            </Box>
          </Box>
        ))
      ) : (
        <Typography variant="body2">No windows added yet.</Typography>
      )}
    </Box>
  );
};

export default WindowsSection;

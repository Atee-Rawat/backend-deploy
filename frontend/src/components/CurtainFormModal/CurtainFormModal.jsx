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

const CurtainFormModal = ({ windowId, onClose, existingCurtain = null, windowWidth }) => {
  const [form, setForm] = useState({
    mechanism: "",
    catalogueRef: "",
    curtainWidth: "",
    curtainCount: "",
    totalLength: "",
    type: "",
    surface: "",
    bracket: "",
    installationHeight: "",
    trackLength: "",
  });

  useEffect(() => {
    if (existingCurtain) {
      setForm({
        mechanism: existingCurtain.mechanism || "",
        catalogueRef: existingCurtain.catalogueRef || "",
        curtainWidth: existingCurtain.curtainWidth || "",
        curtainCount: existingCurtain.curtainCount || "",
        totalLength: existingCurtain.totalLength || "",
        type: existingCurtain.type || "",
        surface: existingCurtain.surface || "",
        bracket: existingCurtain.bracket || "",
        installationHeight: existingCurtain.installationHeight || "",
        trackLength: existingCurtain.trackLength || "",
      });
    }
  }, [existingCurtain]);

  useEffect(() => {
    if (!existingCurtain && form.mechanism && windowWidth) {
      const width = parseFloat(windowWidth);
      if (!isNaN(width)) {
        const trackLength = form.mechanism === "Motorised"
          ? width - 1.27
          : width;
        setForm((prev) => ({
          ...prev,
          trackLength: trackLength.toFixed(2),
        }));
      }
    }
  }, [form.mechanism, windowWidth, existingCurtain]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      if (existingCurtain?._id) {
        await axios.put(
          `${process.env.REACT_APP_API_BASE_URL}/api/rupin/curtains/${existingCurtain._id}`,
          form,
          { withCredentials: true }
        );
      } else {
        await axios.post(
          `${process.env.REACT_APP_API_BASE_URL}/api/rupin/curtains/${windowId}`,
          form,
          { withCredentials: true }
        );
      }
      onClose();
    } catch (err) {
      console.error("Error saving curtain:", err);
    }
  };

  const fieldStyle = {
    backgroundColor: "#fff !important",
    color: "#000 !important",
    mb: 2,
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: "#aaa !important",
    },
    "& input": {
      color: "#000 !important",
    },
    "& .MuiSelect-select": {
      color: "#000 !important",
    },
    "& .MuiSelect-icon": {
      color: "#000 !important",
    },
  };

  const labelStyle = {
    color: "#000 !important",
    mb: 0.5,
    fontSize: 14,
    fontWeight: 500,
  };

  return (
    <Dialog
      open
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          backgroundColor: "#fff !important",
          color: "#000 !important",
          borderRadius: "12px",
          border: "1px solid #000 !important",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        },
      }}
    >
      <DialogTitle sx={{ color: "#000 !important", fontWeight: 600 }}>
        {existingCurtain ? "Edit Curtain Details" : "Add Curtain Details"}
      </DialogTitle>
      <DialogContent sx={{ color: "#000 !important" }}>
        <Box sx={{ mt: 1 }}>
          <Typography sx={labelStyle}>Mechanism</Typography>
          <Select
            name="mechanism"
            value={form.mechanism}
            onChange={handleChange}
            fullWidth
            sx={fieldStyle}
          >
            <MenuItem value="Manual">Manual</MenuItem>
            <MenuItem value="Motorised">Motorised</MenuItem>
          </Select>

          <Typography sx={labelStyle}>Catalogue Reference</Typography>
          <TextField
            name="catalogueRef"
            value={form.catalogueRef}
            onChange={handleChange}
            fullWidth
            margin="dense"
            sx={fieldStyle}
          />

          <Typography sx={labelStyle}>Curtain Width</Typography>
          <Select
            name="curtainWidth"
            value={form.curtainWidth}
            onChange={handleChange}
            fullWidth
            sx={fieldStyle}
          >
            <MenuItem value="48 inch">48 inch</MenuItem>
            <MenuItem value="54 inch">54 inch</MenuItem>
          </Select>

          <Typography sx={labelStyle}>Curtain Count</Typography>
          <TextField
            name="curtainCount"
            type="number"
            value={form.curtainCount}
            onChange={handleChange}
            fullWidth
            margin="dense"
            sx={fieldStyle}
          />

          <Typography sx={labelStyle}>Total Length</Typography>
          <TextField
            name="totalLength"
            type="number"
            value={form.totalLength}
            onChange={handleChange}
            fullWidth
            margin="dense"
            sx={fieldStyle}
          />

          <Typography sx={labelStyle}>Curtain Type</Typography>
          <Select
            name="type"
            value={form.type}
            onChange={handleChange}
            fullWidth
            sx={fieldStyle}
          >
            <MenuItem value="Sheer">Sheer</MenuItem>
            <MenuItem value="Main">Main</MenuItem>
          </Select>

          <Typography sx={labelStyle}>Surface</Typography>
          <Select
            name="surface"
            value={form.surface}
            onChange={handleChange}
            fullWidth
            sx={fieldStyle}
          >
            <MenuItem value="Concrete">Concrete</MenuItem>
            <MenuItem value="Wood">Wood</MenuItem>
            <MenuItem value="False Ceiling">False Ceiling</MenuItem>
            <MenuItem value="Not Required">Not Required</MenuItem>
          </Select>

          <Typography sx={labelStyle}>Bracket</Typography>
          <Select
            name="bracket"
            value={form.bracket}
            onChange={handleChange}
            fullWidth
            sx={fieldStyle}
          >
            <MenuItem value="Ceiling Bracket">Ceiling Bracket</MenuItem>
            <MenuItem value="Single L Bracket">Single L Bracket</MenuItem>
            <MenuItem value="Double L Bracket">Double L Bracket</MenuItem>
          </Select>

          <Typography sx={labelStyle}>Installation Height</Typography>
          <Select
            name="installationHeight"
            value={form.installationHeight}
            onChange={handleChange}
            fullWidth
            sx={fieldStyle}
          >
            <MenuItem value="Single">Single</MenuItem>
            <MenuItem value="Double">Double</MenuItem>
            <MenuItem value="Triple">Triple</MenuItem>
          </Select>

          <Typography sx={labelStyle}>Curtain Track Length (cm)</Typography>
          <TextField
            name="trackLength"
            type="number"
            value={form.trackLength}
            onChange={handleChange}
            fullWidth
            margin="dense"
            sx={fieldStyle}
            InputProps={{
              readOnly: true, 
            }}
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            borderColor: "#000 !important",
            color: "#000 !important",
            fontWeight: 500,
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          sx={{
            backgroundColor: "black !important",
            color: "#fff !important",
            fontWeight: 600,
            "&:hover": {
              backgroundColor: "#e69500 !important",
            },
          }}
        >
          {existingCurtain ? "Update" : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CurtainFormModal;

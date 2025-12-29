import React, { useState } from "react";
import axios from "axios";
import {
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import "./CurtainDetailsPage.css";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#000",
      paper: "#121212",
    },
    text: {
      primary: "#fff",
    },
  },
  components: {
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: "#fff",
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          color: "#fff",
          backgroundColor: "#121212",
        },
        notchedOutline: {
          borderColor: "#666",
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        icon: {
          color: "#fff",
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          backgroundColor: "#121212",
          color: "#fff",
        },
      },
    },
  },
});

const CurtainDetailsPage = ({ windowId, onClose, onSuccess }) => {
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
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/api/rupin/curtains/${windowId}`,
        form,
        { withCredentials: true }
      );
      onSuccess();
    } catch (err) {
      console.error("Error saving curtain:", err);
    }
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <Box className="curtain-form-box">
        <FormControl fullWidth margin="dense">
          <InputLabel>Mechanism</InputLabel>
          <Select name="mechanism" value={form.mechanism} onChange={handleChange}>
            <MenuItem value="Manual">Manual</MenuItem>
            <MenuItem value="Motorised">Motorised</MenuItem>
          </Select>
        </FormControl>

        <TextField
          label="Catalogue Reference"
          fullWidth
          margin="dense"
          name="catalogueRef"
          value={form.catalogueRef}
          onChange={handleChange}
        />

        <FormControl fullWidth margin="dense">
          <InputLabel>Curtain Width</InputLabel>
          <Select name="curtainWidth" value={form.curtainWidth} onChange={handleChange}>
            <MenuItem value="48 inch">48 inch</MenuItem>
            <MenuItem value="54 inch">54 inch</MenuItem>
          </Select>
        </FormControl>

        <TextField
          label="Curtain Count"
          fullWidth
          margin="dense"
          name="curtainCount"
          type="number"
          value={form.curtainCount}
          onChange={handleChange}
        />

        <TextField
          label="Total Curtain Length"
          fullWidth
          margin="dense"
          name="totalLength"
          type="number"
          value={form.totalLength}
          onChange={handleChange}
        />

        <FormControl fullWidth margin="dense">
          <InputLabel>Curtain Type</InputLabel>
          <Select name="type" value={form.type} onChange={handleChange}>
            <MenuItem value="Sheer">Sheer</MenuItem>
            <MenuItem value="Main">Main</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth margin="dense">
          <InputLabel>Installation Surface</InputLabel>
          <Select name="surface" value={form.surface} onChange={handleChange}>
            <MenuItem value="Concrete">Concrete</MenuItem>
            <MenuItem value="Wood">Wood</MenuItem>
            <MenuItem value="False Ceiling">False Ceiling</MenuItem>
            <MenuItem value="Not Required">Not Required</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth margin="dense">
          <InputLabel>Installation Bracket</InputLabel>
          <Select name="bracket" value={form.bracket} onChange={handleChange}>
            <MenuItem value="Ceiling Bracket">Ceiling Bracket</MenuItem>
            <MenuItem value="Single L Bracket">Single L Bracket</MenuItem>
            <MenuItem value="Double L Bracket">Double L Bracket</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth margin="dense">
          <InputLabel>Installation Height</InputLabel>
          <Select
            name="installationHeight"
            value={form.installationHeight}
            onChange={handleChange}
          >
            <MenuItem value="Single">Single</MenuItem>
            <MenuItem value="Double">Double</MenuItem>
            <MenuItem value="Triple">Triple</MenuItem>
          </Select>
        </FormControl>

        <Button
          variant="contained"
          color="warning"
          className="curtain-submit-button"
          onClick={handleSubmit}
        >
          Save Curtain Details
        </Button>
      </Box>
    </ThemeProvider>
  );
};

export default CurtainDetailsPage;

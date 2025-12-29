import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Typography,
  Button,
  Divider,
  Paper,
  IconButton,
} from "@mui/material";
import { Delete } from "@mui/icons-material";
import Navbar from "../../components/Navbar";
import WindowPopupForm from "../../components/windowPopupForm/WindowPopupForm";
import "./RoomWindowsPage.css";

const RoomWindowsPage = () => {
  const { roomId } = useParams();
  const [windows, setWindows] = useState([]);
  const [roomName, setRoomName] = useState("");
  const [clientId, setClientId] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();

  const fetchWindows = useCallback(async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/api/rupin/windows/by-room/${roomId}`,
        { withCredentials: true }
      );
      setWindows(res.data);
    } catch (error) {
      console.error("Error fetching windows:", error);
    }
  }, [roomId]);

  const fetchRoomName = useCallback(async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/api/rupin/rooms/by-id/${roomId}`,
        { withCredentials: true }
      );
      setRoomName(res.data.roomName);
      setClientId(res.data.clientId);
    } catch (err) {
      console.error("Error fetching room name:", err);
    }
  }, [roomId]);

  const handleDeleteWindow = async (e, windowId) => {
    e.stopPropagation();
    const confirm = window.confirm("Are you sure you want to delete this window?");
    if (!confirm) return;
    try {
      await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/api/rupin/windows/${windowId}`, {
        withCredentials: true,
      });
      fetchWindows();
    } catch (err) {
      console.error("Error deleting window:", err);
    }
  };

  useEffect(() => {
    fetchWindows();
    fetchRoomName();
  }, [fetchWindows, fetchRoomName]);

  return (
    <>
      <Navbar />
      <Box
        sx={{
          p: 2,
          mt: "60px",
          backgroundColor: "#fff !important",
          color: "#000 !important",
          minHeight: "100vh",
        }}
      >
        <Typography variant="h5" gutterBottom sx={{ color: "#000 !important" }}>
          Windows:
        </Typography>

        {windows.length === 0 ? (
          <Typography sx={{ color: "#000 !important" }}>
            No windows added yet for this room.
          </Typography>
        ) : (
          windows.map((window) => (
            <Paper
              key={window._id}
              className={window.isCompleted ? "completed-window" : "window-card"}
              sx={{
                p: 2,
                my: 2,
                border: "1px solid #000 !important",
                borderRadius: "8px",
                position: "relative",
                cursor: "pointer",
                transition: "background-color 0.3s ease",
                color: "#000 !important",
              }}
              onClick={() => navigate(`/windows/${window._id}`)}
            >
              <Typography><strong>Name:</strong> {window.windowName}</Typography>
              <Typography><strong>Width:</strong> {window.widthCm} cm</Typography>
              <Typography><strong>Height:</strong> {window.heightCm} cm</Typography>
              <Typography><strong>Area:</strong> {window.areaSqft} sqft</Typography>

              <Box
                sx={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  display: "flex",
                  gap: 1,
                }}
              >
                <IconButton
                  size="small"
                  onClick={(e) => handleDeleteWindow(e, window._id)}
                  sx={{ color: "#000 !important" }}
                >
                  <Delete fontSize="small" />
                </IconButton>
              </Box>
            </Paper>
          ))
        )}

        <Button
          variant="outlined"
          onClick={() => setShowPopup(true)}
          sx={{
            borderColor: "#000 !important",
            color: "#000 !important",
            backgroundColor: "#fff !important",
            "&:hover": {
              backgroundColor: "#f5f5f5 !important",
              borderColor: "#333 !important",
              color: "#000 !important",
            },
            mt: 4,
          }}
        >
          + Add Window
        </Button>

        <Divider sx={{ my: 3, borderColor: "#ccc" }} />

        <Button
          variant="outlined"
          onClick={() => navigate(-1)}
          sx={{
            borderColor: "#000 !important",
            color: "#000 !important",
            "&:hover": {
              borderColor: "#333 !important",
              backgroundColor: "#f5f5f5 !important",
            },
          }}
        >
          Back to Rooms
        </Button>
      </Box>

      <WindowPopupForm
        open={showPopup}
        onClose={() => setShowPopup(false)}
        roomId={roomId}
        roomName={roomName}
        clientId={clientId}
        onWindowAdded={fetchWindows}
      />
    </>
  );
};

export default RoomWindowsPage;

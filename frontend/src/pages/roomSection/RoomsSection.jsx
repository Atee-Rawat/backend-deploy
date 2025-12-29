import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Typography,
  Divider,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const RoomsSection = ({ clientId, refreshTrigger = 0 }) => {
  const [rooms, setRooms] = useState([]);
  const navigate = useNavigate();

  const fetchRooms = useCallback(async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/api/rupin/rooms/by-client/${clientId}`,
        { withCredentials: true }
      );
      setRooms(res.data);
    } catch (error) {
      console.error("Error fetching rooms:", error);
    }
  }, [clientId]);

  useEffect(() => {
    if (clientId) fetchRooms();
  }, [clientId, refreshTrigger, fetchRooms]);

  const handleDeleteRoom = async (e, roomId) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this room?")) return;

    try {
      await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/api/rupin/rooms/${roomId}`, {
        withCredentials: true,
      });
      setRooms((prev) => prev.filter((room) => room._id !== roomId));
    } catch (error) {
      console.error("Error deleting room:", error);
    }
  };

  return (
    <Box
      sx={{
        backgroundColor: "transparent",
        color: "initial", // prevent white inheritance
      }}
    >
      <Divider sx={{ my: 3, backgroundColor: "#ccc" }} />

      <Typography
        variant="subtitle1"
        sx={{ color: "#000 !important", mb: 2 }}
      >
        Existing Rooms:
      </Typography>

      {rooms.length > 0 ? (
        rooms.map((room) => (
          <Box
            key={room._id}
            sx={{
              p: 2,
              mb: 2,
              border: "1px solid #000 !important",
              borderRadius: 2,
              backgroundColor: "#fff !important",
              color: "#000 !important",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              cursor: "pointer",
              transition: "background 0.3s",
              "&:hover": {
                backgroundColor: "#f0f0f0 !important",
              },
            }}
            onClick={() => navigate(`/rooms/${room._id}/windows`)}
          >
            <Typography
              fontWeight="bold"
              sx={{ color: "#000 !important" }}
            >
              {room.roomName}
            </Typography>

            <IconButton
              aria-label="delete"
              onClick={(e) => handleDeleteRoom(e, room._id)}
              sx={{
                color: "#000 !important",
              }}
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        ))
      ) : (
        <Typography variant="body2" sx={{ color: "#000 !important" }}>
          No rooms added yet.
        </Typography>
      )}
    </Box>
  );
};

export default RoomsSection;

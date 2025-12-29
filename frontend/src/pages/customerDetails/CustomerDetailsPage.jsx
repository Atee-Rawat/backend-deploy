import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import dayjs from "dayjs";
import {
  Box,
  Typography,
  Divider,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import Navbar from "../../components/Navbar";
import { useParams, useNavigate } from "react-router-dom";
import RoomsSection from "../roomSection/RoomsSection";
import CalendarBooking from "../../components/calendarBooking/CalendarBooking";

const CustomerDetailsPage = () => {
  const { id: clientId } = useParams();
  const [client, setClient] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [roomName, setRoomName] = useState("");
  const [roomRefreshTrigger, setRoomRefreshTrigger] = useState(0);
  const [customerBookings, setCustomerBookings] = useState([]);

  const navigate = useNavigate();

  const fetchClient = useCallback(async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/api/rupin/clients/${clientId}`,
        { withCredentials: true }
      );
      setClient(res.data);
    } catch (error) {
      console.error("Error fetching client:", error);
    }
  }, [clientId]);

  const fetchCustomerBookings = useCallback(async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/bookings/client/${clientId}`);
      setCustomerBookings(res.data || []);
    } catch (error) {
      console.error("Error fetching customer's bookings:", error);
    }
  }, [clientId]);

  useEffect(() => {
    if (clientId) {
      fetchClient();
      fetchCustomerBookings();
    }
  }, [clientId, fetchClient, fetchCustomerBookings]);

  const openInGoogleMaps = () => {
    if (
      client?.gpsLocation?.coordinates &&
      client.gpsLocation.coordinates.length === 2
    ) {
      const [lng, lat] = client.gpsLocation.coordinates;
      const mapUrl = `https://www.google.com/maps?q=${lat},${lng}`;
      window.open(mapUrl, "_blank");
    } else {
      alert("No valid GPS coordinates available.");
    }
  };

  const handleAddRoom = async () => {
    if (!roomName.trim()) {
      alert("Room name is required");
      return;
    }

    try {
      await axios.post(
        "https://backend-deploy-dxwh.onrender.com/api/rupin/rooms",
        { clientId, roomName },
        { withCredentials: true }
      );
      
      setRoomName("");
      setOpenDialog(false);
      setRoomRefreshTrigger((prev) => prev + 1);
    } catch (error) {
      console.error("Error adding room:", error.response?.data || error.message);
    }
  };

  if (!client)
    return (
      <Box
        sx={{
          textAlign: "center",
          padding: "40px",
          fontSize: "18px",
          color: "#000 !important",
          backgroundColor: "#fff",
          minHeight: "100vh",
        }}
      >
        Loading customer details...
      </Box>
    );

  return (
    <>
      <Navbar />
      <Box
        sx={{
          backgroundColor: "#fff",
          color: "#000 !important",
          minHeight: "100vh",
          padding: 4,
          paddingTop: "100px",
        }}
      >
        <Box sx={{ mb: 3 }}>
          <Typography sx={{ color: "#000 !important" }}>
            <strong>Customer Name:</strong> {client.name}
          </Typography>
          <Typography sx={{ color: "#000 !important" }}>
            <strong>Address:</strong> {client.manualAddress || client.address || "N/A"}
          </Typography>
          <Typography sx={{ color: "#000 !important" }}>
            <strong>Phone:</strong> {client.phoneNumber}
          </Typography>
          <Typography sx={{ color: "#000 !important" }}>
            <strong>Handled By:</strong> {client.createdBy?.firstName} {client.createdBy?.lastName}
          </Typography>

          {client.gpsLocation?.coordinates && (
            <Button
              variant="outlined"
              sx={{ mt: 1, color: "#000 !important", borderColor: "#000 !important" }}
              onClick={openInGoogleMaps}
            >
              📍 View Location on Google Maps
            </Button>
          )}

          <Button
            variant="outlined"
            sx={{ mt: 2, color: "#000 !important", borderColor: "#000 !important" }}
            onClick={() => setCalendarOpen(true)}
          >
            📅 Schedule Installation
          </Button>

          {customerBookings.length > 0 ? (
            <Box mt={2}>
              <Typography variant="subtitle1" sx={{ color: "#000 !important" }}>
                Booked Slots:
              </Typography>
              <ul style={{ paddingLeft: "1rem", marginTop: "0.5rem" }}>
                {customerBookings.map((booking, index) => (
                  <li key={index} style={{ color: "#000", marginBottom: "4px" }}>
                    {dayjs(booking.date).format("DD MMM YYYY")} - {booking.slots.join(", ")}
                  </li>
                ))}
              </ul>
            </Box>
          ) : (
            <Typography variant="body2" sx={{ color: "#000 !important", mt: 1 }}>
              No installation slots booked yet.
            </Typography>
          )}
        </Box>

        <Divider sx={{ my: 3, backgroundColor: "#ccc" }} />

        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6" sx={{ color: "#000 !important" }}>
            Rooms
          </Typography>
          <Button
            variant="outlined"
            sx={{ color: "#000 !important", borderColor: "#000 !important" }}
            onClick={() => setOpenDialog(true)}
          >
            + Add Room
          </Button>
        </Box>

        <RoomsSection clientId={client._id} refreshTrigger={roomRefreshTrigger} />

        <Dialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          fullWidth
          maxWidth="sm"
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
          <DialogTitle sx={{ color: "#000 !important", mt: 4 }}>Add Room</DialogTitle>

          <DialogContent>
            <Typography variant="subtitle1" sx={{ mb: 1, color: "#000 !important" }}>
              Room Name:
            </Typography>
            <TextField
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              fullWidth
              placeholder="Enter room name"
              margin="dense"
              InputProps={{
                sx: {
                  color: "#000 !important",
                  border: "1px solid black !important",
                  borderRadius: "4px",
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "black !important",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#333 !important",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#000 !important",
                  },
                },
              }}
            />
          </DialogContent>

          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={() => setOpenDialog(false)} sx={{ color: "#000 !important" }}>
              Cancel
            </Button>
            <Button variant="contained" color="warning" onClick={handleAddRoom}>
              Add Room
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={calendarOpen}
          onClose={() => setCalendarOpen(false)}
          fullWidth
          maxWidth="sm"
          PaperProps={{
            sx: {
              backgroundColor: "#fff !important",
              color: "#000 !important",
              width: "100%", // ✅ add this
      maxWidth: "100%",// ✅ add this
            },
          }}
        >
          <DialogTitle sx={{ color: "#000 !important" }}>
            Schedule Installation
          </DialogTitle>
          <DialogContent>
          <CalendarBooking
  clientId={client._id}
  clientName={client.name}
  onBookingSuccess={fetchCustomerBookings}
/>

          </DialogContent>
          <DialogActions>
            <Button onClick={() => setCalendarOpen(false)} sx={{ color: "#000 !important" }}>
              Close
            </Button>
          </DialogActions>
        </Dialog>

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
          Back to Customers
        </Button>
      </Box>
    </>
  );
};

export default CustomerDetailsPage;

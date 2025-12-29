import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../../components/Navbar";
import CurtainFormModal from "../../components/CurtainFormModal/CurtainFormModal";
import BlindFormModal from "../../components/BlindFormModal/BlindFormModal";
import { Button, Box, Typography, IconButton } from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import "./WindowDetailsPage.css";
import WindowPopupForm from "../../components/windowPopupForm/WindowPopupForm";

const WindowDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [window, setWindow] = useState(null);
  const [editWindowPopup, setEditWindowPopup] = useState(false);
  const [curtainData, setCurtainData] = useState([]);
  const [blindData, setBlindData] = useState([]);
  const [showCurtainModal, setShowCurtainModal] = useState(false);
  const [showBlindModal, setShowBlindModal] = useState(false);
  const [editBlindId, setEditBlindId] = useState(null);
  const [editBlindData, setEditBlindData] = useState(null);
  const [editCurtainId, setEditCurtainId] = useState(null);
  const [editCurtainData, setEditCurtainData] = useState(null);

  const fetchCurtain = useCallback(async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/api/rupin/curtains/by-window/${id}`,
        { withCredentials: true }
      );
      setCurtainData(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      if (err.response?.status !== 404) console.error("Curtain error:", err);
    }
  }, [id]);

  const fetchBlind = useCallback(async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/api/rupin/blinds/by-window/${id}`,
        { withCredentials: true }
      );
      setBlindData(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      if (err.response?.status !== 404) console.error("Blind error:", err);
    }
  }, [id]);

  const fetchWindow = useCallback(async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/rupin/windows/${id}`, {
        withCredentials: true,
      });
      setWindow(res.data);
      fetchCurtain();
      fetchBlind();
    } catch (error) {
      console.error("Error fetching window:", error);
    }
  }, [id, fetchCurtain, fetchBlind]);

  useEffect(() => {
    fetchWindow();
  }, [fetchWindow]);

  const deleteBlind = async (blindId) => {
    await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/api/rupin/blinds/${blindId}`, { withCredentials: true });
    fetchBlind();
  };

  const deleteCurtain = async (curtainId) => {
    await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/api/rupin/curtains/${curtainId}`, { withCredentials: true });
    fetchCurtain();
  };

  const handleEditBlind = (blind) => {
    setEditBlindData({ ...blind });
    setEditBlindId(blind._id);
    setShowBlindModal(true);
  };

  const handleEditCurtain = (curtain) => {
    setEditCurtainData({ ...curtain });
    setEditCurtainId(curtain._id);
    setShowCurtainModal(true);
  };

  if (!window) return <div>Loading window details...</div>;

  return (
    <>
      <Navbar />
      <div className="window-details-container" style={{ marginTop: "70px", backgroundColor: "#fff", color: "#000", minHeight: "100vh", padding: "16px" }}>
        <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ mt: 2 }}>
          <Typography sx={{ color: "#000 !important", fontWeight: "bold !important", fontSize: "1.75rem !important" }}>
            Window Details:
          </Typography>

          <Button
            variant="outlined"
            onClick={() => setEditWindowPopup(true)}
            sx={{
              borderColor: "#000 !important",
              color: "#000 !important",
              backgroundColor: "#fff !important",
              padding: "6px 12px !important",
              fontSize: "0.875rem !important",
              minWidth: "auto !important",
              "&:hover": {
                borderColor: "#333 !important",
                backgroundColor: "#f5f5f5 !important",
                color: "#000 !important",
              },
            }}
          >
            Edit Window
          </Button>
        </Box>

        <Box className="window-grid" sx={{ mt: 1 }}>
          <Box className="left-column">
            <Typography><strong>Room:</strong> {window.roomName}</Typography>
            <Typography><strong>Window:</strong> {window.windowName}</Typography>
          </Box>
          <Box className="right-column">
            <Typography><strong>Width:</strong> {window.widthCm} cm</Typography>
            <Typography><strong>Height:</strong> {window.heightCm} cm</Typography>
            <Typography><strong>Area:</strong> {window.areaSqft} sqft</Typography>
          </Box>
          <Box className="notes-row" sx={{ mt: 1 }}>
            <Typography><strong>Notes:</strong> {window.additionalNotes}</Typography>
          </Box>

          <Box className="window-button-row" sx={{ display: "flex", gap: 2, mt: 2 }}>
            <Button
              variant="outlined"
              onClick={() => {
                setEditCurtainData(null);
                setEditCurtainId(null);
                setShowCurtainModal(true);
              }}
              sx={{
                borderColor: "#000 !important",
                color: "#000 !important",
                backgroundColor: "#fff !important",
                "&:hover": {
                  borderColor: "#333 !important",
                  backgroundColor: "#f5f5f5 !important",
                  color: "#000 !important",
                },
              }}
            >
              Add Curtain
            </Button>
            <Button
              variant="outlined"
              onClick={() => {
                setEditBlindData(null);
                setEditBlindId(null);
                setShowBlindModal(true);
              }}
              sx={{
                borderColor: "#000 !important",
                color: "#000 !important",
                backgroundColor: "#fff !important",
                "&:hover": {
                  borderColor: "#333 !important",
                  backgroundColor: "#f5f5f5 !important",
                  color: "#000 !important",
                },
              }}
            >
              Add Blind
            </Button>
          </Box>
        </Box>

        {curtainData.length > 0 && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" sx={{ color: "orange !important" }}>Curtain Details</Typography>
            {curtainData.map((curtain, index) => (
              <Box
                key={curtain._id || index}
                sx={{
                  border: "1px solid #333",
                  p: 2,
                  my: 1,
                  borderRadius: 2,
                  backgroundColor: curtain.isCompleted ? "#c8f7c5" : "#fff",
                  color: "#000 !important",
                  position: "relative",
                }}
              >
                <Box sx={{ position: "absolute", top: 8, right: 8, display: "flex", gap: 1 }}>
                  <IconButton size="small" color="primary" onClick={() => handleEditCurtain(curtain)}>
                    <Edit />
                  </IconButton>
                  <IconButton size="small" color="error" onClick={() => deleteCurtain(curtain._id)}>
                    <Delete />
                  </IconButton>
                </Box>
                <Box sx={{ pt: 4 }}>
                  <Typography><strong>Curtain {index + 1}</strong></Typography>
                  <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
                    <Typography><strong>Mechanism:</strong> {curtain.mechanism}</Typography>
                    <Typography><strong>Catalogue Ref:</strong> {curtain.catalogueRef}</Typography>
                    <Typography><strong>Width:</strong> {curtain.curtainWidth}</Typography>
                    <Typography><strong>Count:</strong> {curtain.curtainCount}</Typography>
                    <Typography><strong>Length:</strong> {curtain.totalLength}</Typography>
                    <Typography><strong>Type:</strong> {curtain.type}</Typography>
                    <Typography><strong>Surface:</strong> {curtain.surface}</Typography>
                    <Typography><strong>Bracket:</strong> {curtain.bracket}</Typography>
                    <Typography><strong>Installation Height:</strong> {curtain.installationHeight}</Typography>
                    <Typography>
                      <strong>Track Length :</strong> {curtain.trackLength ? `${curtain.trackLength} cm` : "N/A"}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            ))}
          </Box>
        )}

        {blindData.length > 0 && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" sx={{ color: "orange !important" }}>Blind Details</Typography>
            {blindData.map((blind, index) => (
              <Box
                key={blind._id || index}
                sx={{
                  border: "1px solid #333",
                  p: 2,
                  my: 1,
                  borderRadius: 2,
                  backgroundColor: blind.isCompleted ? "#c8f7c5" : "#fff",
                  color: "#000 !important",
                  position: "relative"
                }}
              >
                <Box sx={{ position: "absolute", top: 8, right: 8, display: "flex", gap: 1 }}>
                  <IconButton size="small" color="primary" onClick={() => handleEditBlind(blind)}>
                    <Edit />
                  </IconButton>
                  <IconButton size="small" color="error" onClick={() => deleteBlind(blind._id)}>
                    <Delete />
                  </IconButton>
                </Box>
                <Box sx={{ pt: 4 }}>
                  <Typography><strong>Blind {index + 1}</strong></Typography>
                  <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, mt: 1 }}>
                    <Typography><strong>Mechanism:</strong> {blind.mechanism}</Typography>
                    <Typography><strong>Catalogue Ref:</strong> {blind.catalogueRef}</Typography>
                    <Typography><strong>Type:</strong> {blind.type || "N/A"}</Typography>
                    <Typography><strong>Surface:</strong> {blind.surface}</Typography>
                    <Typography><strong>Fitting:</strong> {blind.fitting}</Typography>
                    <Typography><strong>Width:</strong> {blind.width ? `${blind.width} cm` : "N/A"}</Typography>
                    <Typography><strong>Height:</strong> {blind.height ? `${blind.height} cm` : "N/A"}</Typography>
                    <Typography><strong>Area:</strong> {blind.area ? `${blind.area} sqft` : "N/A"}</Typography>
                  </Box>
                </Box>
              </Box>
            ))}
          </Box>
        )}

        <Button
          variant="outlined"
          onClick={() => navigate(-1)}
          sx={{
            borderColor: "#000 !important",
            color: "#000 !important",
            backgroundColor: "#fff !important",
            "&:hover": {
              borderColor: "#333 !important",
              backgroundColor: "#f5f5f5 !important",
              color: "#000 !important",
            },
            mt: 4,
          }}
        >
          Back to Windows
        </Button>
      </div>

      {editWindowPopup && (
        <WindowPopupForm
          open={editWindowPopup}
          onClose={() => setEditWindowPopup(false)}
          windowId={window._id}
          roomId={window.roomId}
          roomName={window.roomName}
          clientId={window.clientId}
          initialData={{
            windowName: window.windowName || "",
            widthCm: window.widthCm || "",
            heightCm: window.heightCm || "",
            areaSqft: window.areaSqft || "",
            hasCurtains: window.hasCurtains || false,
            hasBlinds: window.hasBlinds || false,
            additionalNotes: window.additionalNotes || "",
          }}
          onWindowAdded={() => {
            setEditWindowPopup(false);
            fetchWindow();
          }}
        />
      )}

      {showCurtainModal && (
        <CurtainFormModal
          windowId={id}
          curtainId={editCurtainId}
          existingCurtain={editCurtainData}
          windowWidth={window?.widthCm}
          onClose={() => {
            setShowCurtainModal(false);
            setEditCurtainId(null);
            setEditCurtainData(null);
            fetchCurtain();
          }}
        />
      )}

      {showBlindModal && (
        <BlindFormModal
          windowId={id}
          blindId={editBlindId}
          existingData={editBlindData}
          editMode={!!editBlindData}
          onClose={() => {
            setShowBlindModal(false);
            setEditBlindId(null);
            setEditBlindData(null);
            fetchBlind();
          }}
          windowWidth={window.widthCm}
          windowHeight={window.heightCm}
        />
      )}
    </>
  );
};

export default WindowDetailsPage;

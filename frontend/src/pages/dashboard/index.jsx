import * as React from "react";
import {
  Typography,
  Box,
  Grid,
  Paper
} from "@mui/material";

import Navbar from "../../components/Navbar";
import CalendarBooking from "../../components/calendarBooking/DashboardCalendar";
import { useEffect } from "react";

const Dashboard = () => {
  const userId = "685a764dd28ff9521c346b43";

  useEffect(() => {
    // Inject pwaless script
    const script = document.createElement("script");
    script.src = "https://cdn.mobsted.com/pwaless.js";
    script.async = true;
    document.body.appendChild(script);
  
    window.pwaless = window.pwaless || {};
    window.pwaless.config = {
      accountId: "d8a9a945",
      server: "mobsted.com",
      projectId: 17,
    };
  
    let deferredPrompt;
  
    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault(); // Prevent automatic prompt
      deferredPrompt = e;
  
      // OPTIONAL: Show your own install UI or auto prompt after delay
      setTimeout(() => {
        if (deferredPrompt) {
          deferredPrompt.prompt();
          deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === "accepted") {
              console.log("✅ User accepted the A2HS prompt");
            } else {
              console.log("❌ User dismissed the A2HS prompt");
            }
            deferredPrompt = null;
          });
        }
      }, 3000); // Auto-prompt after 3 seconds
    };
  
    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
  
    return () => {
      document.body.removeChild(script);
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);
  

  return (
    <>
      <Navbar />
      <Box
        sx={{
          paddingTop: { xs: "90px", sm: "90px" },
          paddingX: { xs: 2, sm: 3 },
          paddingBottom: 4,
          minHeight: "100vh",
          boxSizing: "border-box",
          backgroundColor: "#fff"
        }}
      >
        <Typography variant="h4" gutterBottom sx={{ color: "#000 !important" }}>
          Welcome to the Otomator ERP Dashboard
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={4}>
            <Paper
              elevation={3}
              sx={{
                padding: 3,
                backgroundColor: "#f5f5f5",
                borderRadius: 2,
                boxShadow: "0px 2px 8px rgba(0,0,0,0.1)"
              }}
            >
              <Typography variant="h6" sx={{ color: "#000 !important", mb: 1 }}>
                Projects Overview
              </Typography>
              <Typography sx={{ color: "#000 !important" }}>
                Details about current projects...
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <Paper
              elevation={3}
              sx={{
                padding: 3,
                backgroundColor: "#f5f5f5",
                borderRadius: 2,
                boxShadow: "0px 2px 8px rgba(0,0,0,0.1)"
              }}
            >
              <Typography variant="h6" sx={{ color: "#000 !important", mb: 1 }}>
                Tasks
              </Typography>
              <Typography sx={{ color: "#000 !important" }}>
                List of ongoing tasks...
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <Paper
              elevation={3}
              sx={{
                padding: 3,
                backgroundColor: "#f5f5f5",
                borderRadius: 2,
                boxShadow: "0px 2px 8px rgba(0,0,0,0.1)"
              }}
            >
              <Typography variant="h6" sx={{ color: "#000 !important", mb: 1 }}>
                Analytics
              </Typography>
              <Typography sx={{ color: "#000 !important" }}>
                Performance and analytics data...
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Paper
              elevation={3}
              sx={{
                padding: 3,
                backgroundColor: "#f5f5f5",
                borderRadius: 2,
                boxShadow: "0px 2px 8px rgba(0,0,0,0.1)"
              }}
            >
              <Typography variant="h6" gutterBottom sx={{ color: "#000 !important" }}>
                Calendar Booking
              </Typography>
              <CalendarBooking userId={userId} />
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default Dashboard;

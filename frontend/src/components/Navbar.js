import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

const Navbar = () => {
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const handleLogout = () => {
    window.localStorage.clear();
    navigate("/");
  };

  const menuItems = [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Customers", path: "/rupin" },
    { label: "Projects", path: "/projects" },
    { label: "Settings", path: "/settings" },
    { label: "Log out", action: handleLogout },
  ];

  const linkStyle = {
    color: "white",
    fontSize: "18px",
    fontWeight: "bold",
    textDecoration: "none",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    padding: "8px",
    display: "inline-block",
  };

  const handleHoverIn = (e) => {
    e.currentTarget.style.boxShadow = "0px 10px 20px rgba(0, 0, 0, 0.3)";
  };

  const handleHoverOut = (e) => {
    e.currentTarget.style.boxShadow = "none";
  };

  const handleDrawerToggle = () => setDrawerOpen(!drawerOpen);

  return (
    <>
      <AppBar sx={{ background: "#000000", padding: 1 }}>

        <Toolbar sx={{ justifyContent: "space-between", alignItems: "center" }}>
        <Box sx={{ cursor: "pointer" }} onClick={() => navigate("/dashboard")}>
  <img
    src="/logo.png"
    alt="Otomator Logo"
    style={{ height: "50px", objectFit: "contain" }}
  />
</Box>


{isMobile ? (
  <IconButton color="inherit" edge="end" onClick={handleDrawerToggle}>
    <MenuIcon fontSize="large" /> {/* ⬅️ Increased size */}
  </IconButton>
) : (
  <Box sx={{ display: "flex", gap: "20px" }}>
    {menuItems.map((item) =>
      item.label === "Log out" ? (
        <div
          key={item.label}
          onClick={item.action}
          style={{
            ...linkStyle,
            backgroundColor: "white",
            color: "black",
            borderRadius: "4px",
            cursor: "pointer",
          }}
          onMouseOver={handleHoverIn}
          onMouseOut={handleHoverOut}
        >
          {item.label}
        </div>
      ) : (
        <Link
          key={item.label}
          to={item.path}
          style={linkStyle}
          onMouseOver={handleHoverIn}
          onMouseOut={handleHoverOut}
        >
          {item.label}
        </Link>
      )
    )}
  </Box>
)}

        </Toolbar>
      </AppBar>

      
      <Drawer anchor="left" open={drawerOpen} onClose={handleDrawerToggle}>
  <Box
    sx={{
      width: 250,
      // mt: 2,
      height: "100%",
      backgroundColor: "#000000", 
      color: "#ffffff",          
    }}
  >
    <List>
      {menuItems.map((item) => (
        <ListItem
          button
          key={item.label}
          onClick={() => {
            if (item.action) {
              item.action();
            } else {
              navigate(item.path);
            }
            setDrawerOpen(false);
          }}
          sx={{
            "&:hover": {
              backgroundColor: "#222",
            },
          }}
        >
          <ListItemText
            primary={item.label}
            primaryTypographyProps={{ style: { color: "#ffffff" } }}
          />
        </ListItem>
      ))}
    </List>
  </Box>
</Drawer>

    </>
  );
};

export default Navbar;

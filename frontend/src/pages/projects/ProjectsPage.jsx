import React from "react";
import { Box, Typography } from "@mui/material";
import Navbar from "../../components/Navbar";
import ProjectOverviewCard from "../../components/product";

const Projects = () => {
  return (
    <>
      <Navbar />
      <Box sx={{ paddingTop: { xs: '60px', sm: '600px' },p: 3, marginTop: 8 }}>
        <Typography variant="h4" gutterBottom>
          Projects
        </Typography>
        <ProjectOverviewCard />
      </Box>
    </>
  );
};

export default Projects;

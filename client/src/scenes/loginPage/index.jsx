import React from 'react';
import { Box, Typography, useTheme, useMediaQuery } from "@mui/material";
import Form from "./Form";
import "./Form.css";

const LoginPage = () => {
  const theme = useTheme();
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  return (
    <Box className={`container ${isNonMobileScreens ? "desktop" : "mobile"}`}>
      <Box className="panels-container">
        <Box className="panel left-panel">
          <Box className="content">
            <Typography variant="h3" className="title">Hello, Friend!</Typography>
            <Typography variant="body1">Register with your personal details to use all of the site features</Typography>
            <button className="btn transparent" id="sign-up-btn">Sign up</button>
          </Box>
        </Box>
        <Box className="panel right-panel">
          <Box className="content">
            <Typography variant="h3" className="title">Sign In</Typography>
            <Form />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default LoginPage;

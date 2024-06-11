import React from 'react';
import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import HomePage from "scenes/homePage";
import LoginPage from "scenes/loginPage";
import ProfilePage from "scenes/profilePage";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { CssBaseline, ThemeProvider, Box } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { themeSettings } from "./theme";
import ChatPage from "./components/ChatPage";
import Navbar from "./scenes/navbar"; // Import the Navbar component

function App() {
  const mode = useSelector((state) => state.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  const isAuth = Boolean(useSelector((state) => state.token));
  const user = useSelector((state) => state.user);

  // Debugging
  console.log("User Data:", user);

  const userSecret = user ? user.password : "";

  return (
    <div className="app">
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {isAuth && <Navbar />} {/* Only render Navbar if authenticated */}
          <Box style={{ paddingTop: isAuth ? '70px' : '0px' }}> {/* Adjust the padding based on authentication status */}
            <Routes>
              <Route path="/" element={<LoginPage />} />
              <Route
                path="/chat"
                element={
                  isAuth ? (
                    <ChatPage user={user?.email} userSecret={userSecret} />
                  ) : (
                    <Navigate to="/" />
                  )
                }
              />
              <Route
                path="/home"
                element={isAuth ? <HomePage /> : <Navigate to="/" />}
              />
              <Route
                path="/profile/:userId"
                element={isAuth ? <ProfilePage /> : <Navigate to="/" />}
              />
            </Routes>
          </Box>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;

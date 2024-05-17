// ChatHeader.jsx
import React from "react";
import { Typography, IconButton } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import "./ChatHeader.css";

const ChatHeader = ({ user }) => {
  const navigate = useNavigate();

  return (
    <div className="chat-header">
      <IconButton onClick={() => navigate(-1)}>
        <ArrowBack />
      </IconButton>
      <Typography variant="h6">Chat with {user}</Typography>
    </div>
  );
};

export default ChatHeader;

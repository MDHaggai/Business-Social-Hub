// StoryWidget.jsx
import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  Dialog,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import { VisibilityOutlined, DeleteOutline } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { setStories, setStory, removeStory } from "../../state";
import axios from "axios";
import Dropzone from "react-dropzone";

const StoryWidget = () => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const stories = useSelector((state) => state.stories);
  const userId = useSelector((state) => state.user._id);
  const [currentStory, setCurrentStory] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [file, setFile] = useState(null);

  const fetchStories = async () => {
    try {
      const response = await axios.get("http://localhost:3001/stories", {
        headers: { Authorization: `Bearer ${token}` },
      });
      dispatch(setStories({ stories: response.data }));
    } catch (error) {
      console.error("Failed to fetch stories:", error);
    }
  };

  const viewStory = async (storyId) => {
    try {
      const response = await axios.post(
        `http://localhost:3001/stories/view/${storyId}`,
        { userId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      dispatch(setStory({ story: response.data }));
      setCurrentStory(response.data);
      setIsDialogOpen(true);
    } catch (error) {
      console.error("Failed to view story:", error);
    }
  };

  const deleteStory = async (storyId) => {
    try {
      await axios.delete(`http://localhost:3001/stories/${storyId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      dispatch(removeStory({ storyId }));
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Failed to delete story:", error);
    }
  };

  const handleDrop = (acceptedFiles) => {
    setFile(acceptedFiles[0]);
  };

  const handlePostStory = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("userId", userId);
    formData.append("picture", file);

    try {
      await axios.post("http://localhost:3001/stories", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchStories();
      setFile(null);
    } catch (error) {
      console.error("Failed to post story:", error);
    }
  };

  useEffect(() => {
    fetchStories();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Box>
      <Box display="flex" justifyContent="center" mt="1rem" mb="2rem">
        {stories.map((story) => (
          <Box
            key={story._id}
            m="0 1rem"
            onClick={() => viewStory(story._id)}
            sx={{ cursor: "pointer", position: "relative" }}
          >
            <img
              src={`http://localhost:3001/assets/${story.picturePath}`}
              alt="story"
              style={{
                width: "100px",
                height: "100px",
                borderRadius: "50%",
                objectFit: "cover",
              }}
            />
          </Box>
        ))}

        <Dropzone
          acceptedFiles=".jpg,.jpeg,.png"
          multiple={false}
          onDrop={handleDrop}
        >
          {({ getRootProps, getInputProps }) => (
            <Box
              {...getRootProps()}
              m="0 1rem"
              sx={{
                cursor: "pointer",
                width: "100px",
                height: "100px",
                borderRadius: "50%",
                border: "2px dashed #1976d2",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <input {...getInputProps()} />
              <Typography>Add Story</Typography>
            </Box>
          )}
        </Dropzone>

        {file && (
          <Box mt="1rem" textAlign="center">
            <Typography>{file.name}</Typography>
            <Button variant="contained" color="primary" onClick={handlePostStory}>
              Post Story
            </Button>
          </Box>
        )}
      </Box>

      <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
        {currentStory && (
          <>
            <DialogContent>
              <Typography variant="h6">{currentStory.userName}</Typography>
              <img
                src={`http://localhost:3001/assets/${currentStory.picturePath}`}
                alt="story"
                style={{
                  width: "100%",
                  borderRadius: "10px",
                }}
              />
              {currentStory.userId === userId && (
                <Box
                  sx={{
                    position: "absolute",
                    bottom: "10px",
                    left: "10px",
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    borderRadius: "5px",
                    padding: "5px",
                  }}
                >
                  <VisibilityOutlined sx={{ color: "white" }} />
                  <Typography sx={{ color: "white" }}>
                    {currentStory.views.length} views
                  </Typography>
                </Box>
              )}
            </DialogContent>
            {currentStory.userId === userId && (
              <DialogActions>
                <IconButton
                  onClick={() => deleteStory(currentStory._id)}
                  color="secondary"
                >
                  <DeleteOutline />
                </IconButton>
              </DialogActions>
            )}
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default StoryWidget;

import React, { useState } from "react";
import {
  ChatBubbleOutlineOutlined,
  FavoriteBorderOutlined,
  FavoriteOutlined,
  ShareOutlined,
  DeleteOutline,
} from "@mui/icons-material";
import {
  Box,
  Divider,
  IconButton,
  Typography,
  useTheme,
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import FlexBetween from "components/FlexBetween";
import Friend from "components/Friend";
import WidgetWrapper from "components/WidgetWrapper";
import { useDispatch, useSelector } from "react-redux";
import { setPost, removePost, addNotification } from "../../state";
import { Link } from "react-router-dom";

const PostWidget = ({
  postId,
  postUserId,
  name,
  description,
  location,
  picturePath,
  videoPath,
  filePath,
  audioPath,
  userPicturePath,
  likes,
  comments,
}) => {
  const [isComments, setIsComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const loggedInUserId = useSelector((state) => state.user._id);
  const loggedInUserName = useSelector((state) => `${state.user.firstName} ${state.user.lastName}`);
  const isLiked = Boolean(likes[loggedInUserId]);
  const likeCount = Object.keys(likes).length;

  const { palette } = useTheme();
  const main = palette.neutral.main;
  const primary = palette.primary.main;

  const patchLike = async () => {
    const response = await fetch(`http://localhost:3001/posts/${postId}/like`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: loggedInUserId }),
    });
    const updatedPost = await response.json();
    dispatch(setPost({ post: updatedPost }));

    // Notify post owner of the like if someone else liked their post
    if (postUserId !== loggedInUserId) {
      const notification = {
        userId: postUserId,
        postId: postId,
        userName: loggedInUserName,
        type: 'liked',
        date: new Date().toLocaleString(),
      };
      dispatch(addNotification(notification));
    }
  };

  const postComment = async () => {
    const response = await fetch(`http://localhost:3001/posts/${postId}/comment`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: loggedInUserId, comment: newComment }),
    });
    const updatedPost = await response.json();
    dispatch(setPost({ post: updatedPost }));

    // Notify post owner of the comment if someone else commented on their post
    if (postUserId !== loggedInUserId) {
      const notification = {
        userId: postUserId,
        postId: postId,
        userName: loggedInUserName,
        type: 'commented on',
        date: new Date().toLocaleString(),
      };
      dispatch(addNotification(notification));
    }

    setNewComment("");
  };

  const handleDelete = async () => {
    const response = await fetch(`http://localhost:3001/posts/${postId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (response.ok) {
      dispatch(removePost({ postId }));
      handleClose();
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <WidgetWrapper m="2rem 0">
      <Friend
        friendId={postUserId}
        name={name}
        subtitle={location}
        userPicturePath={userPicturePath}
      />
      <Typography color={main} sx={{ mt: "1rem" }}>
        {description}
      </Typography>
      {picturePath && (
        <img
          width="100%"
          height="auto"
          alt="post"
          style={{ borderRadius: "0.75rem", marginTop: "0.75rem" }}
          src={`http://localhost:3001/assets/${picturePath}`}
        />
      )}
      {videoPath && (
        <video
          width="100%"
          height="auto"
          controls
          style={{ borderRadius: "0.75rem", marginTop: "0.75rem" }}
        >
          <source src={`http://localhost:3001/assets/${videoPath}`} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}
      {audioPath && (
        <audio
          controls
          style={{ width: "100%", marginTop: "0.75rem" }}
        >
          <source src={`http://localhost:3001/assets/${audioPath}`} type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
      )}
      {filePath && (
        <a
          href={`http://localhost:3001/assets/${filePath}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{ display: "block", marginTop: "0.75rem" }}
        >
          Download File
        </a>
      )}
      <FlexBetween mt="0.25rem">
        <FlexBetween gap="1rem">
          <FlexBetween gap="0.3rem">
            <IconButton onClick={patchLike}>
              {isLiked ? (
                <FavoriteOutlined sx={{ color: primary }} />
              ) : (
                <FavoriteBorderOutlined />
              )}
            </IconButton>
            <Typography>{likeCount}</Typography>
          </FlexBetween>

          <FlexBetween gap="0.3rem">
            <IconButton onClick={() => setIsComments(!isComments)}>
              <ChatBubbleOutlineOutlined />
            </IconButton>
            <Typography>{comments.length}</Typography>
          </FlexBetween>
        </FlexBetween>

        <FlexBetween gap="0.3rem">
          {loggedInUserId === postUserId && (
            <IconButton onClick={handleClickOpen}>
              <DeleteOutline />
            </IconButton>
          )}
          <IconButton>
            <ShareOutlined />
          </IconButton>
        </FlexBetween>
      </FlexBetween>
      {isComments && (
        <Box mt="0.5rem">
          {comments.map((comment, i) => (
            <Box key={`${name}-${i}`}>
              <Divider />
              <Typography sx={{ color: main, m: "0.5rem 0", pl: "1rem" }}>
                <Link to={`/profile/${comment.userId}`} style={{ textDecoration: 'none', color: primary }}>
                  <strong>{comment.userName}</strong>
                </Link>: {comment.comment}
              </Typography>
            </Box>
          ))}
          <Divider />
          <Box mt="1rem">
            <TextField
              fullWidth
              multiline
              rows={2}
              variant="outlined"
              placeholder="Write a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <Button
              variant="contained"
              color="primary"
              sx={{ mt: "0.5rem" }}
              onClick={postComment}
            >
              Comment
            </Button>
          </Box>
        </Box>
      )}

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Delete Post"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this post?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            No
          </Button>
          <Button onClick={handleDelete} color="primary" autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </WidgetWrapper>
  );
};

export default PostWidget;

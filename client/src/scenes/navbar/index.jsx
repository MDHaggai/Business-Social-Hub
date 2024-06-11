import React, { useEffect, useState } from 'react';
import {
  Box,
  IconButton,
  InputBase,
  Typography,
  Select,
  MenuItem,
  FormControl,
  useTheme,
  useMediaQuery,
  Badge,
  Menu,
  MenuItem as DropdownMenuItem,
} from "@mui/material";
import {
  Search,
  Message,
  DarkMode,
  LightMode,
  Notifications,
  Help,
  Menu as MenuIcon,
  Close,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { setMode, setLogout, resetNotificationCount, resetUnreadMessages } from "../../state";
import FlexBetween from "components/FlexBetween";
import { fetchUnreadMessages, markMessagesAsRead } from "../utils/unreadMessages";
import StoryWidget from "../widgets/StoryWidget"; //

const Navbar = () => {
  const [isMobileMenuToggled, setIsMobileMenuToggled] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const notifications = useSelector((state) => state.notifications);
  const unreadMessages = useSelector((state) => state.unreadMessages);
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");

  const theme = useTheme();
  const neutralLight = theme.palette.neutral.light;
  const dark = theme.palette.neutral.dark;
  const background = theme.palette.background.default;
  const primaryLight = theme.palette.primary.light;
  const alt = theme.palette.background.alt;

  useEffect(() => {
    if (token) {
      fetchUnreadMessages(dispatch, token);
    }
  }, [dispatch, token]);

  if (!user) {
    return null; 
  }

  const fullName = `${user.firstName} ${user.lastName}`;

  const handleChatNavigation = async () => {
    await markMessagesAsRead(dispatch, token); 
    const username = `${user.firstName} ${user.lastName}`;
    dispatch(resetUnreadMessages()); 
    window.location.href = `http://localhost:5173/?username=${encodeURIComponent(username)}`;
  };

  const handleNotificationsClick = (event) => {
    setAnchorEl(event.currentTarget);
    dispatch(resetNotificationCount());
  };

  const handleNotificationsClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box style={{ position: 'fixed', top: 0, width: '100%', zIndex: 1000 }}>
      <FlexBetween padding="1rem 6%" backgroundColor={alt}>
        <FlexBetween gap="1.75rem">
          <Typography
            fontWeight="bold"
            fontSize="clamp(1rem, 2rem, 2.25rem)"
            color="primary"
            onClick={() => window.location.href = "/home"}
            sx={{
              "&:hover": {
                color: primaryLight,
                cursor: "pointer",
              },
            }}
          >
            Sociol Business Hub
          </Typography>
          {isNonMobileScreens && (
            <FlexBetween
              backgroundColor={neutralLight}
              borderRadius="9px"
              gap="3rem"
              padding="0.1rem 1.5rem"
            >
              <InputBase placeholder="Search..." />
              <IconButton>
                <Search />
              </IconButton>
            </FlexBetween>
          )}
        </FlexBetween>

        {isNonMobileScreens ? (
          <FlexBetween gap="2rem">
            <IconButton onClick={() => dispatch(setMode())}>
              {theme.palette.mode === "dark" ? <DarkMode sx={{ fontSize: "25px" }} /> : <LightMode sx={{ color: dark, fontSize: "25px" }} />}
            </IconButton>
            <IconButton onClick={handleChatNavigation}>
              <Badge badgeContent={unreadMessages} color="secondary">
                <Message sx={{ fontSize: "25px" }} />
              </Badge>
            </IconButton>
            <IconButton onClick={handleNotificationsClick}>
              <Badge badgeContent={notifications.filter(notification => !notification.viewed).length} color="secondary">
                <Notifications sx={{ fontSize: "25px" }} />
              </Badge>
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleNotificationsClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              PaperProps={{
                style: {
                  maxHeight: 500,
                  width: 350,
                },
              }}
            >
              {notifications.length === 0 ? (
                <DropdownMenuItem>No new notifications</DropdownMenuItem>
              ) : (
                notifications.map((notification, index) => (
                  <DropdownMenuItem key={index}>
                    <Typography variant="body2">
                      {notification.userName} {notification.type} your post
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      {notification.date}
                    </Typography>
                  </DropdownMenuItem>
                ))
              )}
            </Menu>
            <Help sx={{ fontSize: "25px" }} />
            <FormControl variant="standard" value={fullName}>
              <Select
                value={fullName}
                sx={{
                  backgroundColor: neutralLight,
                  width: "150px",
                  borderRadius: "0.25rem",
                  p: "0.25rem 1rem",
                  "& .MuiSvgIcon-root": {
                    pr: "0.25rem",
                    width: "3rem",
                  },
                  "& .MuiSelect-select:focus": {
                    backgroundColor: neutralLight,
                  },
                }}
                input={<InputBase />}
              >
                <MenuItem value={fullName}><Typography>{fullName}</Typography></MenuItem>
                <MenuItem onClick={() => dispatch(setLogout())}>Log Out</MenuItem>
              </Select>
            </FormControl>
          </FlexBetween>
        ) : (
          <IconButton onClick={() => setIsMobileMenuToggled(!isMobileMenuToggled)}>
            <MenuIcon />
          </IconButton>
        )}

        {!isNonMobileScreens && isMobileMenuToggled && (
          <Box
            position="fixed"
            right="0"
            bottom="0"
            height="100%"
            zIndex="10"
            maxWidth="500px"
            minWidth="300px"
            backgroundColor={background}
          >
            <Box display="flex" justifyContent="flex-end" p="1rem">
              <IconButton onClick={() => setIsMobileMenuToggled(!isMobileMenuToggled)}>
                <Close />
              </IconButton>
            </Box>
            <FlexBetween flexDirection="column" alignItems="center" gap="3rem">
              <IconButton onClick={() => dispatch(setMode())}>
                {theme.palette.mode === "dark" ? <DarkMode sx={{ fontSize: "25px" }} /> : <LightMode sx={{ color: dark, fontSize: "25px" }} />}
              </IconButton>
              <IconButton onClick={handleChatNavigation}>
                <Badge badgeContent={unreadMessages} color="secondary">
                  <Message sx={{ fontSize: "25px" }} />
                </Badge>
              </IconButton>
              <IconButton onClick={handleNotificationsClick}>
                <Badge badgeContent={notifications.filter(notification => !notification.viewed).length} color="secondary">
                  <Notifications sx={{ fontSize: "25px" }} />
                </Badge>
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleNotificationsClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                PaperProps={{
                  style: {
                    maxHeight: 500,
                    width: 350,
                  },
                }}
              >
                {notifications.length === 0 ? (
                  <DropdownMenuItem>No new notifications</DropdownMenuItem>
                ) : (
                  notifications.map((notification, index) => (
                    <DropdownMenuItem key={index}>
                      <Typography variant="body2">
                        {notification.userName} {notification.type} your post
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {notification.date}
                      </Typography>
                    </DropdownMenuItem>
                  ))
                )}
              </Menu>
              <Help sx={{ fontSize: "25px" }} />
              <FormControl variant="standard" value={fullName}>
                <Select
                  value={fullName}
                  sx={{
                    backgroundColor: neutralLight,
                    width: "150px",
                    borderRadius: "0.25rem",
                    p: "0.25rem 1rem",
                    "& .MuiSvgIcon-root": {
                      pr: "0.25rem",
                      width: "3rem",
                    },
                    "& .MuiSelect-select:focus": {
                      backgroundColor: neutralLight,
                    },
                  }}
                  input={<InputBase />}
                >
                  <MenuItem value={fullName}><Typography>{fullName}</Typography></MenuItem>
                  <MenuItem onClick={() => dispatch(setLogout())}>Log Out</MenuItem>
                </Select>
              </FormControl>
            </FlexBetween>
          </Box>
        )}
      </FlexBetween>
      <StoryWidget /> {/* Add StoryWidget here */}
    </Box>
  );
};

export default Navbar;

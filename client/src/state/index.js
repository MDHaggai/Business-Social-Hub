import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  mode: "light",
  user: null,
  token: null,
  posts: [],
  notifications: [],
  unreadMessages: 0,
  stories: [], // Add stories to the initial state
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setMode: (state) => {
      state.mode = state.mode === "light" ? "dark" : "light";
    },
    setLogin: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    setLogout: (state) => {
      state.user = null;
      state.token = null;
    },
    setFriends: (state, action) => {
      if (state.user) {
        state.user.friends = action.payload.friends;
      } else {
        console.error("User friends not available");
      }
    },
    setPosts: (state, action) => {
      state.posts = action.payload.posts;
    },
    setPost: (state, action) => {
      const updatedPosts = state.posts.map((post) => {
        if (post._id === action.payload.post._id) return action.payload.post;
        return post;
      });
      state.posts = updatedPosts;
    },
    removePost: (state, action) => {
      state.posts = state.posts.filter(post => post._id !== action.payload.postId);
    },
    addNotification: (state, action) => {
      state.notifications.push(action.payload);
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
    resetNotificationCount: (state) => {
      state.notifications = state.notifications.map((notification) => ({ ...notification, viewed: true }));
    },
    setUnreadMessages: (state, action) => {
      state.unreadMessages = action.payload;
    },
    resetUnreadMessages: (state) => {
      state.unreadMessages = 0;
    },
    setStories: (state, action) => {
      state.stories = action.payload.stories;
    },
    setStory: (state, action) => {
      const updatedStories = state.stories.map((story) => {
        if (story._id === action.payload.story._id) return action.payload.story;
        return story;
      });
      state.stories = updatedStories;
    },
    removeStory: (state, action) => {
      state.stories = state.stories.filter(story => story._id !== action.payload.storyId);
    },
  },
});

export const {
  setMode,
  setLogin,
  setLogout,
  setFriends,
  setPosts,
  setPost,
  removePost,
  addNotification,
  clearNotifications,
  resetNotificationCount,
  setUnreadMessages,
  resetUnreadMessages,
  setStories,
  setStory,
  removeStory,
} = authSlice.actions;

export default authSlice.reducer;

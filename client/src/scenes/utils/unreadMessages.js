import axios from 'axios';
import { setUnreadMessages } from '../../state';

export const fetchUnreadMessages = async (dispatch, token) => {
  try {
    console.log("Fetching unread messages with token:", token);
    const response = await axios.get('http://localhost:4000/api/unread-messages', {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log("Unread messages response:", response.data);
    dispatch(setUnreadMessages(response.data.unreadMessages));
  } catch (error) {
    console.error('Failed to fetch unread messages:', error);
  }
};

export const markMessagesAsRead = async (dispatch, token) => {
  try {
    console.log("Marking messages as read with token:", token);
    await axios.post('http://localhost:4000/api/mark-messages-as-read', {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
    dispatch(setUnreadMessages(0)); // Reset unread messages count to 0
  } catch (error) {
    console.error('Failed to mark messages as read:', error);
  }
};

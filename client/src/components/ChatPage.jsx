import React, { useEffect, useState } from "react";
import { ChatEngine } from "react-chat-engine";
import ChatHeader from "./ChatHeader";
import "./ChatPage.css";

const ChatPage = ({ user }) => {
  const [chatTitle, setChatTitle] = useState("");
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    fetchFriends();
  }, [user]);

  const fetchFriends = async () => {
    try {
      const response = await fetch(`http://localhost:3001/users/${user._id}/friends`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`,  // Ensure you have a token management system
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch friends');
      }

      const friendsData = await response.json();
      setFriends(friendsData);
    } catch (error) {
      console.error("Error fetching friends:", error);
    }
  };

  const createNewChat = async () => {
    if (!chatTitle) return;

    try {
      const response = await fetch("http://localhost:6001/api/create-chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: chatTitle,
          usernames: friends.map(friend => friend.email),  // This needs to match with your backend logic
        }),
      });

      const chatData = await response.json();
      console.log("New chat created:", chatData);
    } catch (error) {
      console.error("Error creating chat:", error);
    }
  };

  return (
    <div className="chat-container">
      <ChatHeader user={user} />
      <div>
        <input
          type="text"
          placeholder="New Chat Title"
          value={chatTitle}
          onChange={(e) => setChatTitle(e.target.value)}
        />
        <button onClick={createNewChat}>Create New Chat</button>
      </div>
      <div className="friends-list">
        <h2>Friends</h2>
        <ul>
          {friends.map(friend => (
            <li key={friend._id} onClick={() => console.log(`Start chat with ${friend.firstName}`)}>
              {friend.firstName} {friend.lastName}
            </li>
          ))}
        </ul>
      </div>
      <ChatEngine
        height="calc(100vh - 60px)"
        projectID={process.env.REACT_APP_CHAT_ENGINE_PROJECT_ID}
        userName="Ngwa-Haggai"  // Universal Chat Engine username
        userSecret="123456"  // Universal Chat Engine password
        renderChatFeed={(chatAppProps) => <ChatFeed {...chatAppProps} currentUser={user} />}
      />
    </div>
  );
};

// Custom Chat Feed to display user's name instead of universal account name
const ChatFeed = (props) => {
  const { currentUser } = props;

  return (
    <div>
      <h1>Chat as {currentUser.firstName} {currentUser.lastName}</h1>
      {/* Render the rest of your chat feed components here */}
    </div>
  );
};

export default ChatPage;

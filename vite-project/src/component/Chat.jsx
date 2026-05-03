import React from 'react';
import './Chat.css';

const Chat = () => {
  return (
    <div className="chat-container">
      <div className="inbox-list">
        <h3>Messages</h3>
        <div className="chat-user-item active">
          <div className="mini-avatar"></div>
          <div className="user-info">
            <p className="name">Arun Kumar</p>
            <p className="last-msg">Is the harvest ready?</p>
          </div>
        </div>
        {/* More users... */}
      </div>

      <div className="chat-window">
        <div className="chat-empty">
          <div className="chat-icon">💬</div>
          <h3>Your Messages</h3>
          <p>Send photos and messages to a buyer or farmer.</p>
          <button className="action-btn">Send Message</button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
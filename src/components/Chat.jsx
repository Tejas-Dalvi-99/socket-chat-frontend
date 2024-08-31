import { useEffect, useRef, useState } from "react";
import io from 'socket.io-client';
import "./Chat.scss";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { FaUserAlt } from "react-icons/fa";


const socket = io.connect(import.meta.env.VITE_PUBLIC_URL);

function Chat() {
  
  const [allMessages, setAllMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [onlineUsers, setOnlineUsers] = useState(0);

  const handleSendMessage = (e) => {
  e.preventDefault();
  const newMessage = message.trim();
  if (!newMessage) return;
  // setAllMessages((prevMessages) => [...prevMessages, newMessage]);
  socket.emit('send-message', {message: newMessage, username: localStorage.getItem('name'), id: socket.id});
  setMessage("");
};

  const messageRef = useRef(null);
  const scrollToBottom = () => {
    if (messageRef.current) {
      messageRef.current.scrollTop = messageRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [allMessages]);

  useEffect(() => {
    const username = localStorage.getItem('name');
    if (username) {
      socket.emit('user-connected', username);
    }
  }, []);

  useEffect(() => {
    socket.on('user-connected', (username) => {
      toast.success(`${username} joined the chat`)
      // setAllMessages((prev) => [...prev, `${username} joined the chat`]);
    });

    socket.on('send-message', (msg) => {
      setAllMessages((prevMessages) => [...prevMessages, msg]);
    });

    socket.on('user-disconnected', (username) => {
      toast.error(`${username} left the chat`)
      // setAllMessages((prevMessages) => [...prevMessages, `${username} left the chat`]);
    });

    socket.on('update-user-count', (count)=>{
      setOnlineUsers(count);
    })

    return () => {
      socket.off('user-connected');
      socket.off('send-message');
      socket.off('user-disconnected');
      socket.off('update-user-count');
    };
  }, []);

  return (
    <>
    <div className="online-count">
    <FaUserAlt/> &nbsp;Online : {onlineUsers}
    </div>
    <div className="chat">
      <div className="messages" ref={messageRef}>
        {allMessages.map((msg, index) => (
          <div key={index} className={`message-outer ${msg.id == socket.id ? 'message-right' : 'message-left'}`}>
            <div className="message-content">
              <p className={`name ${msg.id == socket.id ? 'name1' : ''}`}>{msg.username}</p>
              <p className="msg">{msg.message}</p>
              </div>
          </div>
        ))}
      </div>
      <form onSubmit={handleSendMessage}>
        <input
          type="text"
          placeholder="Enter your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          />
        <button type="submit">Send</button>
      </form>
    </div>
    {
      <ToastContainer position="top-right" theme="dark" autoClose="1500"/>
    }
</>
  );
}

export default Chat;

'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { io } from 'socket.io-client';
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
} from '@chatscope/chat-ui-kit-react';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { getUserFromLocalStorage } from '../../../utils';

// Connect to the Socket.IO server
const socket = io('http://localhost:1337');

const ChatClient = ({ id }) => {
  const searchParams = useSearchParams();
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [username, setUsername] = useState('');
  const messageListRef = useRef(null);

  useEffect(() => {
    const user = getUserFromLocalStorage();
    if (user?.username) {
      setUsername(user.username);
    }
  }, []);

  // ✅ Fetch chat history via Socket.IO on room join
  useEffect(() => {
    if (!id || !username) return;

    // Emit joinRoom event to the server
    socket.emit('joinRoom', id);

    // Listen for the chatHistory event from the server
    socket.on('chatHistory', (history) => {
        console.log("his",history);
        
      const formattedMessages = history.map((msg) => ({
        message: msg.message,
        sender: msg.sender,
        direction: msg.sender === username ? 'outgoing' : 'incoming',
      }));

      setMessages(formattedMessages);
    });

    socket.on('receiveMessage', (data) => {
      setMessages((prev) => [
        ...prev,
        {
          message: data.message,
          sender: data.sender,
          direction: data.sender === username ? 'outgoing' : 'incoming',
        },
      ]);
    });

    // Cleanup listeners when component unmounts
    return () => {
      socket.off('chatHistory');
      socket.off('receiveMessage');
    };
  }, [id, username]);

  const handleSend = () => {
    if (inputValue.trim() === '') return;

    const messageData = {
      roomId: id,
      sender: username,
      message: inputValue,
    };

    socket.emit('sendMessage', messageData); // Emit the sendMessage event to the server
    setInputValue(''); // Clear the input after sending
  };

  return (
    <div className="h-screen p-4">
      <MainContainer>
        <ChatContainer>
          <MessageList typingIndicator={null} ref={messageListRef}>
            {messages.map((msg, index) => (
              <Message
                key={index}
                model={{
                  message: msg.message,
                  sentTime: 'just now',
                  sender: msg.sender, // Display the sender's name
                  direction: msg.direction,
                  position: 'single',
                }}
              />
            ))}
          </MessageList>
          <MessageInput
            placeholder="Type your message..."
            value={inputValue}
            onChange={(val) => setInputValue(val)}
            onSend={handleSend}
          />
        </ChatContainer>
      </MainContainer>
    </div>
  );
};

export default ChatClient;

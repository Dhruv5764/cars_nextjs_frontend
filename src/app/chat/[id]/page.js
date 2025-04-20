// src/app/chat/[id]/page.js

import ChatClient from './ChatClient';

export default async function ChatPage({ params }) {
  const { id } = await params;
  
  return <ChatClient id={id} />;
}

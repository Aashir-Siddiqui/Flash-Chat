import React from "react";
import ChatHeader from "./components/chat-header";
import MessageBar from "./components/message-bar";

function ChatContainer() {
  return (
    <div className="fixed top-0 h-[100vh] w-[100vw] bg-[#1b1c24] flex flex-col">
      <ChatHeader />
      <ChatContainer />
      <MessageBar />
    </div>
  );
}

export default ChatContainer;

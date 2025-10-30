import { useAppStore } from "@/store";
import { Host } from "@/utils/constant";
import { createContext, useContext, useRef, useEffect } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext(null);

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const socket = useRef();
  const { userInfo } = useAppStore();

  useEffect(() => {
    if (userInfo) {
      socket.current = io(Host, {
        withCredentials: true,
        query: { userId: userInfo.id },
      });

      // socket.current.on("connect", () => {
      //   console.log("Connected to socket server");
      // });

      const handleReceiveMessage = (message) => {
        const { selectedChatData, selectedChatType, addMessage } =
          useAppStore.getState();

        if (
          selectedChatType !== undefined &&
          selectedChatData &&
          (selectedChatData._id === message.sender._id ||
            selectedChatData._id === message.recipient._id)
        ) {
          console.log("Adding message to chat:", message);
          addMessage(message);
        } else {
          console.log("Message not for current chat, ignoring");
        }
      };

      const handleReiveChannelMessage = (message) => {
        const { selectedChatData, selectedChatType, addMessage } =
          useAppStore.getState();

        if (
          selectedChatType !== undefined &&
          selectedChatData._id === message.channelId
        ) {
          addMessage(message);
        }
      };

      socket.current.on("recieveMessage", handleReceiveMessage);
      socket.current.on("recieve-channel-message", handleReiveChannelMessage);

      const handleDisconnect = () => {
        if (socket.current) {
          socket.current.disconnect();
        }
      };

      return handleDisconnect;
    }
  }, [userInfo]);

  return (
    <SocketContext.Provider value={socket.current}>
      {children}
    </SocketContext.Provider>
  );
};

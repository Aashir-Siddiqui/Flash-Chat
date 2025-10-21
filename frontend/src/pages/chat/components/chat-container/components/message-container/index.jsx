import React, { useEffect, useRef } from "react";
import { useAppStore } from "@/store";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { GET_ALL_MESSAGES_ROUTE, Host } from "@/utils/constant";
import { getColor } from "@/lib/utils";
import moment from "moment";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { apiClient } from "@/lib/api-client";
import { CheckCheck } from "lucide-react";

function MessageContainer() {
  const scrollRef = useRef();
  const {
    selectedChatType,
    selectedChatData,
    selectedChatMessages,
    setSelectedChatMessages,
    userInfo,
  } = useAppStore();

  // ✅ Fixed: useEffect structure
  useEffect(() => {
    const getMessages = async () => {
      try {
        const response = await apiClient.post(
          GET_ALL_MESSAGES_ROUTE,
          { id: selectedChatData._id },
          { withCredentials: true }
        );
        if (response.data.messages) {
          setSelectedChatMessages(response.data.messages); // ✅ Fixed: function call
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    // ✅ Fixed: Proper condition check
    if (selectedChatData?._id && selectedChatType === "contact") {
      getMessages();
    }
  }, [selectedChatData, selectedChatType, setSelectedChatMessages]);

  // Auto scroll to bottom when new message arrives
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedChatMessages]);

  const renderMessages = () => {
    let lastDate = null;

    return selectedChatMessages.map((message, index) => {
      const messageDate = moment(message.timestamp).format("YYYY-MM-DD");
      const showDate = messageDate !== lastDate;
      lastDate = messageDate;

      return (
        <div key={message._id || index}>
          {/* Date Divider */}
          {showDate && (
            <div className="flex items-center justify-center my-4">
              <div className="bg-[#2a2b33] text-gray-400 text-xs px-3 py-1 rounded-full shadow-md">
                {moment(message.timestamp).calendar(null, {
                  sameDay: "[Today]",
                  lastDay: "[Yesterday]",
                  lastWeek: "dddd",
                  sameElse: "MMMM DD, YYYY",
                })}
              </div>
            </div>
          )}

          {selectedChatType === "contact" && renderDMMessages(message)}
        </div>
      );
    });
  };

  const renderDMMessages = (message) => {
    // ✅ Fixed: Better sender check
    const isSender =
      message.sender?._id === userInfo.id || message.sender === userInfo.id;

    // ✅ Get user's selected color
    const senderColor = getColor(userInfo.color);

    return (
      <div
        className={`flex items-start gap-2 mb-4 ${
          isSender ? "flex-row-reverse" : "flex-row"
        }`}
      >
        {/* Avatar */}
        <Avatar className="w-9 h-9 flex-shrink-0 ring-2 ring-[#2f303b] transition-transform hover:scale-110">
          {isSender ? (
            userInfo.picture ? (
              <AvatarImage
                src={`${Host}/${userInfo.picture}`}
                alt="Profile"
                className="object-cover"
              />
            ) : (
              <AvatarFallback
                className="text-xs font-bold text-white"
                style={{ backgroundColor: senderColor }}
              >
                {userInfo.firstName && userInfo.lastName
                  ? `${userInfo.firstName[0]}${userInfo.lastName[0]}`.toUpperCase()
                  : userInfo.email[0].toUpperCase()}
              </AvatarFallback>
            )
          ) : selectedChatData.picture ? (
            <AvatarImage
              src={`${Host}/${selectedChatData.picture}`}
              alt="Profile"
              className="object-cover"
            />
          ) : (
            <AvatarFallback
              className="text-xs font-bold text-white"
              style={{ backgroundColor: getColor(selectedChatData.color) }}
            >
              {selectedChatData.firstName && selectedChatData.lastName
                ? `${selectedChatData.firstName[0]}${selectedChatData.lastName[0]}`.toUpperCase()
                : selectedChatData.email[0].toUpperCase()}
            </AvatarFallback>
          )}
        </Avatar>

        {/* Message Bubble */}
        <div className={`flex flex-col gap-1 max-w-[70%] sm:max-w-[60%]`}>
          <div
            className={`px-4 py-2.5 rounded-2xl shadow-lg transition-all hover:shadow-xl text-white ${
              isSender ? "rounded-tr-none" : "bg-[#2a2b33] rounded-tl-none"
            }`}
            style={isSender ? { backgroundColor: senderColor } : {}}
          >
            {message.messageType === "text" ? (
              <p className="text-sm leading-relaxed break-words whitespace-pre-wrap">
                {message.content}
              </p>
            ) : (
              <div className="flex items-center gap-2">
                <a
                  href={`${Host}/${message.fileUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm underline hover:opacity-80 transition-opacity"
                >
                  📎 View File
                </a>
              </div>
            )}
          </div>

          {/* Timestamp with Read Receipt */}
          <div
            className={`flex items-center gap-1 ${
              isSender ? "justify-end mr-2" : "ml-2"
            }`}
          >
            <span className="text-xs text-gray-500">
              {moment(message.timestamp).format("LT")}
            </span>
            {isSender && (
              <CheckCheck size={14} style={{ color: senderColor }} />
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#1c1d25] scrollbar-thin scrollbar-thumb-[#2f303b] scrollbar-track-transparent">
      {selectedChatMessages && selectedChatMessages.length > 0 ? (
        <div className="flex flex-col">
          {renderMessages()}
          <div ref={scrollRef} />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-full text-center">
          <DotLottieReact
            src="/src/assets/noChat.lottie"
            loop
            autoplay
            style={{ width: 250, height: 250 }}
          />
          <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">
            No messages yet
          </h3>
          <p className="text-gray-400 text-sm">
            Start the conversation by sending a message!
          </p>
        </div>
      )}
    </div>
  );
}

export default MessageContainer;

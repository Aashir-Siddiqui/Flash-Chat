import React, { useEffect, useRef, useState } from "react";
import { useAppStore } from "@/store";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { GET_ALL_MESSAGES_ROUTE, Host } from "@/utils/constant";
import { getColor } from "@/lib/utils";
import moment from "moment";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { apiClient } from "@/lib/api-client";
import { X, Download, FileIcon, ImageOff } from "lucide-react";
import { Button } from "@/components/ui/button";

function MessageContainer() {
  const scrollRef = useRef();
  const [imagePreview, setImagePreview] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const {
    selectedChatType,
    selectedChatData,
    selectedChatMessages,
    setSelectedChatMessages,
    userInfo,
    setIsDownloading,
    setFileDownloadingProgress,
  } = useAppStore();

  useEffect(() => {
    const getMessages = async () => {
      try {
        const response = await apiClient.post(
          GET_ALL_MESSAGES_ROUTE,
          { id: selectedChatData._id },
          { withCredentials: true }
        );
        if (response.data.messages) {
          setSelectedChatMessages(response.data.messages);
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    if (selectedChatData?._id && selectedChatType === "contact") {
      getMessages();
    }
  }, [selectedChatData, selectedChatType, setSelectedChatMessages]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedChatMessages]);

  const checkImage = (filePath) => {
    const imageRegex =
      /\.(jpg|jpeg|png|gif|bmp|tiff|tif|webp|svg|ico|heic|heif)$/i;
    return imageRegex.test(filePath);
  };

  const downloadFile = async (url) => {
    try {
      setIsDownloading(true);
      setFileDownloadingProgress(0);

      // ✅ Smart URL handling
      const downloadUrl = url.includes(Host) ? url : `${Host}/${url}`;

      const response = await apiClient.get(downloadUrl, {
        responseType: "blob",
        onDownloadProgress: (progressEvent) => {
          const { loaded, total } = progressEvent;
          const percentageCompleted = Math.round((100 * loaded) / total);
          setFileDownloadingProgress(percentageCompleted);
        },
      });

      const blobUrl = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = url.split("/").pop();
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Download failed:", error);
    } finally {
      setIsDownloading(false);
      setFileDownloadingProgress(0);
    }
  };

  const renderMessages = () => {
    let lastDate = null;

    return selectedChatMessages.map((message, index) => {
      const messageDate = moment(message.timestamp).format("YYYY-MM-DD");
      const showDate = messageDate !== lastDate;
      lastDate = messageDate;

      return (
        <div key={message._id || index}>
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
    const isSender =
      message.sender?._id === userInfo.id || message.sender === userInfo.id;
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
              style={{
                backgroundColor: getColor(selectedChatData.color),
              }}
            >
              {selectedChatData.firstName && selectedChatData.lastName
                ? `${selectedChatData.firstName[0]}${selectedChatData.lastName[0]}`.toUpperCase()
                : selectedChatData.email[0].toUpperCase()}
            </AvatarFallback>
          )}
        </Avatar>

        {/* Message Bubble */}
        <div className={`flex flex-col gap-1 max-w-[70%] sm:max-w-[60%]`}>
          {/* Text Message */}
          {message.messageType === "text" && (
            <div
              className={`px-4 py-2.5 rounded-2xl shadow-lg transition-all hover:shadow-xl text-white ${
                isSender ? "rounded-tr-none" : "bg-[#2a2b33] rounded-tl-none"
              }`}
              style={isSender ? { backgroundColor: senderColor } : {}}
            >
              <p className="text-sm leading-relaxed break-words whitespace-pre-wrap">
                {message.content}
              </p>
            </div>
          )}

          {/* File/Image Message */}
          {message.messageType === "file" && (
            <div
              className={`rounded-2xl overflow-hidden shadow-lg ${
                isSender ? "rounded-tr-none" : "rounded-tl-none"
              }`}
            >
              {checkImage(message.fileUrl) ? (
                // Image Preview
                <div className="relative group">
                  <img
                    src={`${Host}/${message.fileUrl}`}
                    alt="Shared image"
                    className="max-w-[250px] sm:max-w-[300px] max-h-[250px] sm:max-h-[300px] cursor-pointer rounded-2xl transition-all hover:brightness-75"
                    onClick={() => {
                      setImagePreview(true);
                      setImageUrl(`${Host}/${message.fileUrl}`);
                    }}
                    onError={(e) => {
                      console.error("Image load error:", message.fileUrl);
                      console.error("Full URL:", `${Host}/${message.fileUrl}`);
                      e.target.onerror = null;
                      e.target.src = { ImageOff };
                    }}
                  />
                </div>
              ) : (
                // File Download Card
                <div
                  className={`flex items-center gap-3 px-4 py-3 rounded-2xl cursor-pointer transition-all hover:shadow-xl ${
                    isSender
                      ? "rounded-tr-none"
                      : "bg-[#2a2b33] rounded-tl-none"
                  }`}
                  style={isSender ? { backgroundColor: senderColor } : {}}
                  onClick={() => downloadFile(`${Host}/${message.fileUrl}`)}
                >
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                    <FileIcon size={20} className="text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">
                      {message.fileUrl.split("/").pop()}
                    </p>
                    <p className="text-white/70 text-xs">Click to download</p>
                  </div>
                  <Download size={18} className="text-white/70 flex-shrink-0" />
                </div>
              )}
            </div>
          )}

          {/* Timestamp */}
          <div
            className={`flex items-center gap-1 ${
              isSender ? "justify-end mr-2" : "ml-2"
            }`}
          >
            <span className="text-xs text-gray-500">
              {moment(message.timestamp).format("LT")}
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
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

      {/* Image Preview Modal */}
      {imagePreview && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4"
          onClick={() => setImagePreview(false)}
        >
          <div className="relative max-w-[90vw] max-h-[90vh]">
            {/* Close Button */}
            <Button
              size="icon"
              className="absolute -top-12 right-0 cursor-pointer bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-sm"
              onClick={() => setImagePreview(false)}
            >
              <X size={24} className="text-white" />
            </Button>

            {/* Download Button - ✅ FIXED */}
            <Button
              size="icon"
              className="absolute -top-12 right-14 cursor-pointer bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-sm"
              onClick={(e) => {
                e.stopPropagation();
                downloadFile(imageUrl); // ✅ Fixed: Remove curly braces
              }}
            >
              <Download size={20} className="text-white" />
            </Button>

            {/* Image */}
            <img
              src={imageUrl}
              alt="Preview"
              className="max-w-full max-h-[70vh] rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </>
  );
}

export default MessageContainer;

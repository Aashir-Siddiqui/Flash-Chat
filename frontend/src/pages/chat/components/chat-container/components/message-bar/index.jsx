import React, { useRef, useState, useEffect } from "react";
import { Send, Paperclip, Smile, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import EmojiPicker from "emoji-picker-react";
import { useAppStore } from "@/store";
import { useSocket } from "@/context/socketContext";
import { apiClient } from "@/lib/api-client";
import { UPLOAD_FILE_ROUTE } from "@/utils/constant";

function MessageBar() {
  const emojiRef = useRef();
  const inputFileRef = useRef();
  const [message, setMessage] = useState("");
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);
  const {
    selectedChatType,
    selectedChatData,
    userInfo,
    setIsUploading,
    setFileUploadingProgress,
  } = useAppStore();
  const socket = useSocket();

  useEffect(() => {
    function handleClickOutside(event) {
      if (emojiRef.current && !emojiRef.current.contains(event.target)) {
        setEmojiPickerOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleEmoji = (emoji) => {
    setMessage((msg) => msg + emoji.emoji);
  };

  const handleSend = async () => {
    if (message.trim() && socket) {
      if (selectedChatType === "contact") {
        console.log("Sending message:", {
          sender: userInfo.id,
          recipient: selectedChatData._id,
          content: message,
        });

        socket.emit("sendMessage", {
          sender: userInfo.id,
          content: message,
          recipient: selectedChatData._id,
          messageType: "text",
          fileUrl: undefined,
        });
      }
      setMessage("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleAttachmentClick = () => {
    if (inputFileRef.current) {
      inputFileRef.current.click();
    }
  };

  const handleAttachmentChange = async (event) => {
    try {
      const file = event.target.files[0];
      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        setIsUploading(true);
        const response = await apiClient.post(UPLOAD_FILE_ROUTE, formData, {
          withCredentials: true,
          onUploadProgress: (data) => {
            setFileUploadingProgress(
              Math.round((100 * data.loaded) / data.total)
            );
          },
        });
        if (response.status === 200 && response.data) {
          setIsUploading(false);
          if (selectedChatType == "contact") {
            socket.emit("sendMessage", {
              sender: userInfo.id,
              content: undefined,
              recipient: selectedChatData._id,
              messageType: "file",
              fileUrl: response.data.filePath,
            });
          }
        }
      }
      console.log({ file });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="h-[82px] bg-[#1b1c24] border-t-2 border-[#2f303b] px-3 sm:px-6 flex items-center gap-2 sm:gap-4">
      <Button
        variant="ghost"
        size="icon"
        className="text-gray-400 hover:text-teal-400 hover:bg-[#2f303b] rounded-full flex-shrink-0"
        onClick={handleAttachmentClick}
      >
        <input
          type="file"
          className="hidden"
          ref={inputFileRef}
          onChange={handleAttachmentChange}
        />
        <Paperclip size={20} className="sm:w-[22px] sm:h-[22px]" />
      </Button>

      <div className="flex-1 relative">
        <Input
          type="text"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          className="w-full bg-[#2a2b33] border-none text-white placeholder:text-gray-500 focus-visible:ring-2 focus-visible:ring-teal-500 rounded-full px-4 sm:px-5 py-5 sm:py-6 pr-12"
        />

        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-yellow-400 hover:bg-transparent rounded-full"
          onClick={() => setEmojiPickerOpen(!emojiPickerOpen)}
        >
          <Smile size={20} />
        </Button>

        {emojiPickerOpen && (
          <div
            ref={emojiRef}
            className="absolute bottom-14 -right-3 z-50 animate-in fade-in slide-in-from-bottom-2 duration-200"
          >
            <div className="relative bg-[#1e1f28] rounded-2xl shadow-2xl border border-[#2f303b] overflow-hidden">
              <div className="absolute top-2 right-3 z-10">
                <Button
                  size="icon"
                  className="bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 rounded-full w-7 h-7 cursor-pointer shadow-lg border-2 border-[#1e1f28] transition-transform hover:scale-110"
                  onClick={() => setEmojiPickerOpen(false)}
                >
                  <X size={16} className="text-white" />
                </Button>
              </div>

              <div className="px-4 py-3 bg-gradient-to-r from-[#2a2b33] to-[#1e1f28] border-b border-[#2f303b]">
                <h3 className="text-white font-semibold text-sm flex items-center gap-2">
                  <Smile size={16} className="text-yellow-400" />
                  Choose Emoji
                </h3>
              </div>

              <EmojiPicker
                theme="dark"
                onEmojiClick={handleEmoji}
                autoFocusSearch={false}
                width={window.innerWidth < 640 ? 300 : 380}
                height={window.innerWidth < 640 ? 380 : 420}
                previewConfig={{ showPreview: false }}
                searchPlaceHolder="Search emoji..."
                emojiStyle="native"
              />
            </div>

            <div className="absolute -bottom-2 right-8 w-4 h-4 bg-[#1e1f28] border-r border-b border-[#2f303b] transform rotate-45"></div>
          </div>
        )}
      </div>

      <Button
        onClick={handleSend}
        disabled={!message.trim()}
        className="bg-teal-500 hover:bg-teal-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-full w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center flex-shrink-0 shadow-lg transition-all"
      >
        <Send size={18} className="sm:w-[20px] sm:h-[20px]" />
      </Button>

      {emojiPickerOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 sm:hidden"
          onClick={() => setEmojiPickerOpen(false)}
        />
      )}
    </div>
  );
}

export default MessageBar;

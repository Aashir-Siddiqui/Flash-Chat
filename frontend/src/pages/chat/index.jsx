import { useAppStore } from "@/store";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import ContactsContainer from "./components/contacts-container";
import ChatContainer from "./components/chat-container";
import EmptyChatContainer from "./components/empty-chat-container";
import { Upload, Download, Loader2 } from "lucide-react";

function Chat() {
  const {
    userInfo,
    selectedChatType,
    isUploading,
    isDownloading,
    fileUploadingProgress,
    fileDownloadingProgress,
  } = useAppStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!userInfo.profileSetup) {
      toast.error("Please complete your profile setup", { duration: 4000 });
      navigate("/profile");
    }
  }, [userInfo, navigate]);

  return (
    <div className="flex h-[100vh] text-white overflow-hidden">
      {/* Upload Progress Overlay */}
      {isUploading && (
        <div className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-[#1e1f28] rounded-3xl shadow-2xl border border-[#2f303b] p-8 max-w-md w-full mx-4">
            {/* Icon */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-teal-500/20 flex items-center justify-center">
                  <Upload className="w-10 h-10 text-teal-400 animate-bounce" />
                </div>
                <div className="absolute inset-0 rounded-full border-4 border-teal-500/30 animate-ping"></div>
              </div>
            </div>

            {/* Title */}
            <h3 className="text-2xl font-bold text-white text-center mb-2">
              Uploading File
            </h3>
            <p className="text-gray-400 text-center text-sm mb-6">
              Please wait while we upload your file...
            </p>

            {/* Progress Bar */}
            <div className="relative">
              <div className="h-3 bg-[#2a2b33] rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-teal-500 to-teal-400 rounded-full transition-all duration-300 ease-out relative"
                  style={{ width: `${fileUploadingProgress}%` }}
                >
                  <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                </div>
              </div>

              {/* Percentage */}
              <div className="flex justify-between items-center mt-3">
                <span className="text-gray-400 text-sm font-medium">
                  Progress
                </span>
                <span className="text-teal-400 text-lg font-bold">
                  {fileUploadingProgress}%
                </span>
              </div>
            </div>

            {/* Loading Dots */}
            <div className="flex justify-center gap-2 mt-6">
              <div
                className="w-2 h-2 bg-teal-400 rounded-full animate-bounce"
                style={{ animationDelay: "0ms" }}
              ></div>
              <div
                className="w-2 h-2 bg-teal-400 rounded-full animate-bounce"
                style={{ animationDelay: "150ms" }}
              ></div>
              <div
                className="w-2 h-2 bg-teal-400 rounded-full animate-bounce"
                style={{ animationDelay: "300ms" }}
              ></div>
            </div>
          </div>
        </div>
      )}

      {/* Download Progress Overlay */}
      {isDownloading && (
        <div className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-[#1e1f28] rounded-3xl shadow-2xl border border-[#2f303b] p-8 max-w-md w-full mx-4">
            {/* Icon */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <Download className="w-10 h-10 text-blue-400 animate-bounce" />
                </div>
                <div className="absolute inset-0 rounded-full border-4 border-blue-500/30 animate-ping"></div>
              </div>
            </div>

            {/* Title */}
            <h3 className="text-2xl font-bold text-white text-center mb-2">
              Downloading File
            </h3>
            <p className="text-gray-400 text-center text-sm mb-6">
              Your file is being downloaded...
            </p>

            {/* Progress Bar */}
            <div className="relative">
              <div className="h-3 bg-[#2a2b33] rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full transition-all duration-300 ease-out relative"
                  style={{ width: `${fileDownloadingProgress}%` }}
                >
                  <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                </div>
              </div>

              {/* Percentage */}
              <div className="flex justify-between items-center mt-3">
                <span className="text-gray-400 text-sm font-medium">
                  Progress
                </span>
                <span className="text-blue-400 text-lg font-bold">
                  {fileDownloadingProgress}%
                </span>
              </div>
            </div>

            {/* Loading Spinner */}
            <div className="flex justify-center mt-6">
              <Loader2 className="w-6 h-6 text-blue-400 animate-spin" />
            </div>
          </div>
        </div>
      )}

      <ContactsContainer />
      {selectedChatType === undefined ? (
        <EmptyChatContainer />
      ) : (
        <ChatContainer />
      )}
    </div>
  );
}

export default Chat;

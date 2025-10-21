import React from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/store";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getColor } from "@/lib/utils";
import { Host } from "@/utils/constant";

function ChatHeader() {
  const { closeChat, selectedChatData, selectedChatType } = useAppStore();

  return (
    <div className="h-[70px] border-b-2 border-[#2f303b] flex items-center justify-between px-6 bg-[#1b1c24]">
      <div className="flex items-center gap-4 min-w-0 flex-grow">
        {" "}
        <div className="flex items-center justify-center text-white font-bold text-lg shadow-lg flex-shrink-0">
          <div className="relative">
            <Avatar className="w-12 h-12 ring-2 ring-[#2f303b] transition-all">
              {selectedChatData.picture ? (
                <AvatarImage
                  src={`${Host}/${selectedChatData.picture}`}
                  alt="Profile"
                  className="object-cover"
                />
              ) : (
                <AvatarFallback
                  className="text-lg font-bold text-white"
                  style={{ backgroundColor: getColor(selectedChatData.color) }}
                >
                  {selectedChatData.firstName && selectedChatData.lastName
                    ? `${selectedChatData.firstName[0]}${selectedChatData.lastName[0]}`.toUpperCase()
                    : selectedChatData.email[0].toUpperCase()}
                </AvatarFallback>
              )}
            </Avatar>
          </div>
        </div>
        {/* Name Container */}
        <div className="min-w-0 sm:max-w-[200px] md:max-w-xs overflow-hidden">
          <h3 className="text-white font-semibold text-lg --font-poppins truncate">
            {selectedChatType === "contact" && selectedChatData.firstName
              ? `${selectedChatData.firstName} ${selectedChatData.lastName}`
              : `${selectedChatData.email}`}
          </h3>
        </div>
      </div>

      {/* Right: Action Buttons (Fixed positioning removed to keep it inside ChatHeader) */}
      <div className="flex-shrink-0">
        {" "}
        {/* 👈 Position the button correctly */}
        <Button
          variant="ghost"
          size="icon"
          className="text-gray-400 hover:text-red-500 cursor-pointer hover:bg-[#2f303b] rounded-full ml-2"
          onClick={() => closeChat()}
        >
          <X size={20} />
        </Button>
      </div>
    </div>
  );
}

export default ChatHeader;

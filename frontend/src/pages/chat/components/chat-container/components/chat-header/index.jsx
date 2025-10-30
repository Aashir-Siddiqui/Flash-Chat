import React from "react";
import { Hash, X, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/store";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getColor } from "@/lib/utils";
import { Host } from "@/utils/constant";

function ChatHeader() {
  const { closeChat, selectedChatData, selectedChatType } = useAppStore();

  return (
    <div className="h-[70px] border-b-2 border-[#2f303b] flex items-center justify-between px-4 sm:px-6 bg-[#1b1c24]">
      <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-grow">
        <div className="flex items-center justify-center flex-shrink-0">
          {selectedChatType === "contact" ? (
            <Avatar className="w-10 h-10 sm:w-12 sm:h-12 ring-2 ring-[#2f303b] transition-all">
              {selectedChatData.picture ? (
                <AvatarImage
                  src={`${Host}/${selectedChatData.picture}`}
                  alt="Profile"
                  className="object-cover"
                />
              ) : (
                <AvatarFallback
                  className="text-base sm:text-lg font-bold text-white"
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
          ) : (
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-teal-500/20 to-teal-600/20 border-2 border-teal-500/40 flex items-center justify-center">
              <Hash
                className="w-5 h-5 sm:w-6 sm:h-6 text-teal-400"
                strokeWidth={2.5}
              />
            </div>
          )}
        </div>

        <div className="min-w-0 max-w-[250px] sm:max-w-lg overflow-hidden flex-1">
          <h3 className="text-white font-semibold text-base sm:text-lg truncate flex items-center gap-2">
            {selectedChatType === "channel"
              ? selectedChatData.name
              : selectedChatData.firstName
              ? `${selectedChatData.firstName} ${selectedChatData.lastName}`
              : selectedChatData.email}
          </h3>
          {selectedChatType === "contact" ? (
            <p className="text-gray-400 text-xs sm:text-sm truncate">
              {selectedChatData.email}
            </p>
          ) : (
            <p className="text-gray-400 text-xs sm:text-sm flex items-center gap-1">
              <Users className="w-3 h-3" />
              {selectedChatData.members?.length || 0}{" "}
              {selectedChatData.members?.length === 1 ? "member" : "members"}
            </p>
          )}
        </div>
      </div>

      <div className="flex-shrink-0">
        <Button
          variant="ghost"
          size="icon"
          className="text-gray-400 hover:text-red-500 cursor-pointer hover:bg-[#2f303b] rounded-full w-9 h-9 sm:w-10 sm:h-10"
          onClick={() => closeChat()}
        >
          <X size={18} className="sm:w-5 sm:h-5" />
        </Button>
      </div>
    </div>
  );
}

export default ChatHeader;

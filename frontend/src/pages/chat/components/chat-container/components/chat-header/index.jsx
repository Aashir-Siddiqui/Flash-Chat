import React from "react";
import { X, Phone, Video, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";

function ChatHeader() {
  return (
    <div className="h-[70px] border-b-2 border-[#2f303b] flex items-center justify-between px-6 bg-[#1b1c24]">
      {/* Left: Contact Info */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
          JD
        </div>
        <div>
          <h3 className="text-white font-semibold text-lg">John Doe</h3>
          <p className="text-gray-400 text-sm">Online</p>
        </div>
      </div>

      {/* Right: Action Buttons */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="text-gray-400 hover:text-white hover:bg-[#2f303b] rounded-full"
        >
          <Phone size={20} />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="text-gray-400 hover:text-white hover:bg-[#2f303b] rounded-full"
        >
          <Video size={20} />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="text-gray-400 hover:text-white hover:bg-[#2f303b] rounded-full"
        >
          <MoreVertical size={20} />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="text-gray-400 hover:text-red-500 hover:bg-[#2f303b] rounded-full ml-2"
        >
          <X size={20} />
        </Button>
      </div>
    </div>
  );
}

export default ChatHeader;

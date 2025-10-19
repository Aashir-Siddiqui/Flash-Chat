import React from "react";

function MessageContainer() {
  return (
    <div className="flex-1 overflow-y-auto p-6 bg-[#1c1d25] scrollbar-thin scrollbar-thumb-[#2f303b] scrollbar-track-transparent">
      {/* Messages will go here */}
      <div className="flex flex-col gap-4">
        {/* Received Message */}
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
            JD
          </div>
          <div className="flex flex-col gap-1 max-w-[70%]">
            <div className="bg-[#2a2b33] text-white px-4 py-3 rounded-2xl rounded-tl-none">
              <p className="text-sm">Hey! How are you doing?</p>
            </div>
            <span className="text-xs text-gray-500 ml-2">10:30 AM</span>
          </div>
        </div>

        {/* Sent Message */}
        <div className="flex items-start gap-3 flex-row-reverse">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
            ME
          </div>
          <div className="flex flex-col gap-1 max-w-[70%]">
            <div className="bg-teal-500 text-white px-4 py-3 rounded-2xl rounded-tr-none">
              <p className="text-sm">I'm doing great! Thanks for asking.</p>
            </div>
            <span className="text-xs text-gray-500 mr-2 text-right">
              10:31 AM
            </span>
          </div>
        </div>

        {/* Received Message */}
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
            JD
          </div>
          <div className="flex flex-col gap-1 max-w-[70%]">
            <div className="bg-[#2a2b33] text-white px-4 py-3 rounded-2xl rounded-tl-none">
              <p className="text-sm">That's awesome! Want to catch up later?</p>
            </div>
            <span className="text-xs text-gray-500 ml-2">10:32 AM</span>
          </div>
        </div>

        {/* Sent Message */}
        <div className="flex items-start gap-3 flex-row-reverse">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
            ME
          </div>
          <div className="flex flex-col gap-1 max-w-[70%]">
            <div className="bg-teal-500 text-white px-4 py-3 rounded-2xl rounded-tr-none">
              <p className="text-sm">Sure! Let's meet at 5 PM. 🎉</p>
            </div>
            <span className="text-xs text-gray-500 mr-2 text-right">
              10:33 AM
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MessageContainer;

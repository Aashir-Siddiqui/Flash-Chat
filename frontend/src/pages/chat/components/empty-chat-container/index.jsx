import React from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

function EmptyChatContainer() {
  return (
    <div className="flex-1 md:flex flex-col items-center bg-[#1b1c24] justify-center hidden duration-1000 transition-all">
      <DotLottieReact
        src="/src/assets/flash.lottie"
        loop
        autoplay
        style={{ width: 200, height: 200 }}
      />
      <div className="text-center mt-8 space-y-2">
        <h3 className="font-poppins text-3xl font-semibold text-white">
          Hi <span className="text-teal-500">!</span> Welcome to <span className="text-teal-500">Flash</span> Chat App.
        </h3>
        <p className="text-gray-500 font-poppins font-light">Select a contact to start messaging</p>
      </div>
    </div>
  );
}

export default EmptyChatContainer;

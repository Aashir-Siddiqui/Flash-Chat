import { Zap } from "lucide-react";
import React from "react";

function Logo() {
  return (
    <h1 className="font-poppins text-2xl font-semibold mb-3 flex items-center justify-start p-5">
      <Zap className="h-8 w-8 mr-2 text-teal-500" />
      Flash Chat
    </h1>
  );
}

export default Logo;

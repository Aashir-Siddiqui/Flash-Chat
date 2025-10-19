import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAppStore } from "@/store";
import { Host, LOGOUT_ROUTE } from "@/utils/constant";
import React from "react";
import { UserPen, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { apiClient } from "@/lib/api-client";
import { getColor } from "@/lib/utils"; // ✅ Import getColor function

function ProfileInfo() {
  const { userInfo, setUserInfo } = useAppStore();
  const navigate = useNavigate();

  // ✅ getColor function use karke color hex milega
  const avatarColor = getColor(userInfo?.color || 0);

  const getAvatarFallback = () => {
    if (userInfo.firstName && userInfo.lastName)
      return `${userInfo.firstName[0]}${userInfo.lastName[0]}`.toUpperCase();
    if (userInfo?.email) return userInfo.email[0].toUpperCase();
    return "U";
  };

  const logout = async () => {
    try {
      const response = await apiClient.post(
        LOGOUT_ROUTE,
        {},
        { withCredentials: true }
      );
      if (response.status === 200) {
        navigate("/auth");
        setUserInfo(null);
      }
    } catch (error) {
      console.log("Logout", error);
    }
  };

  return (
    <div className="absolute bottom-0 w-full border-t-2 border-[#2f303b] bg-[#16171d]">
      <div className="p-4 flex items-center justify-between gap-3">
        {/* Left: Avatar + User Info */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <Avatar className="w-12 h-12 ring-2 ring-[#2f303b]">
            {userInfo.picture ? (
              <AvatarImage
                src={`${Host}/${userInfo.picture}`}
                alt="Profile"
                className="object-cover"
              />
            ) : (
              <AvatarFallback
                className="text-xl font-bold text-white"
                style={{ backgroundColor: avatarColor }}
              >
                {getAvatarFallback()}
              </AvatarFallback>
            )}
          </Avatar>

          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-semibold truncate">
              {userInfo.firstName && userInfo.lastName
                ? `${userInfo.firstName} ${userInfo.lastName}`
                : "User Name"}
            </p>
            <p className="text-gray-400 text-xs truncate">
              {userInfo.email || "user@example.com"}
            </p>
          </div>
        </div>

        {/* Right: Action Buttons */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-400 hover:text-white hover:bg-[#2f303b] rounded-full w-9 h-9"
            onClick={() => navigate("/profile")}
            title="Edit Profile"
          >
            <UserPen size={18} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-400 hover:text-red-400 hover:bg-[#2f303b] rounded-full w-9 h-9"
            title="Logout"
            onClick={logout}
          >
            <LogOut size={18} />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ProfileInfo;

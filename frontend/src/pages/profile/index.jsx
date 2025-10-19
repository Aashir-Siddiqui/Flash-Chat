import { useAppStore } from "@/store";
import React, { useEffect, useRef, useState } from "react";
import { PlusCircle, Image, ChevronLeft, Check, CircleX } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client.js";
import {
  ADD_PROFILE_IMAGE,
  Host,
  UPDATE_PROFILE_ROUTE,
  REMOVE_PROFILE_IMAGE,
} from "@/utils/constant.js";
import { colors, getColor } from "@/lib/utils"; // ✅ Import colors and getColor

function Profile() {
  const navigate = useNavigate();
  const { userInfo, setUserInfo } = useAppStore();

  const [firstName, setFirstName] = useState(userInfo?.firstName || "");
  const [lastName, setLastName] = useState(userInfo?.lastName || "");
  const [image, setImage] = useState(null);
  const [hovered, setHovered] = useState(false);
  const [selectedColor, setSelectedColor] = useState(userInfo?.color || 0);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (userInfo.profileSetup) {
      setFirstName(userInfo.firstName);
      setLastName(userInfo.lastName);
      setSelectedColor(userInfo.color);
    }
    if (userInfo.picture) {
      setImage(`${Host}/${userInfo.picture}`);
    }
  }, [userInfo]);

  // ✅ getColor function use karke color hex milega
  const currentColorHex = getColor(selectedColor);
  const headerStyle = {
    backgroundColor: currentColorHex,
  };

  const getAvatarFallback = () => {
    if (firstName && lastName)
      return `${firstName[0]}${lastName[0]}`.toUpperCase();
    if (userInfo?.email) return userInfo.email[0].toUpperCase();
    return "U";
  };

  const profileValidate = () => {
    if (!firstName.trim()) {
      toast.error("FirstName is required.");
      return false;
    }
    if (!lastName.trim()) {
      toast.error("LastName is required.");
      return false;
    }
    return true;
  };

  const handleProfileUpdate = async () => {
    if (profileValidate()) {
      try {
        const response = await apiClient.post(
          UPDATE_PROFILE_ROUTE,
          { firstName, lastName, color: selectedColor },
          { withCredentials: true }
        );
        if (response.status === 200 && response.data) {
          setUserInfo({ ...response.data });
          toast.success("Profile updated successfully.");
          navigate("/chat");
        }
      } catch (error) {
        console.error("Profile update error:", error);
        toast.error("Failed to update profile");
      }
    }
  };

  const handleNavigate = () => {
    if (userInfo.profileSetup) {
      navigate("/chat");
    } else {
      toast.error("Please update profile.");
    }
  };

  const handleFileInputClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const formData = new FormData();
        formData.append("profile-image", file);

        const response = await apiClient.post(ADD_PROFILE_IMAGE, formData, {
          withCredentials: true,
        });

        if (response.status === 200 && response.data) {
          setUserInfo({ ...userInfo, picture: response.data.picture });
          setImage(`${Host}/${response.data.picture}`);
          toast.success("Image updated successfully.");
        }
      } catch (error) {
        console.error("Image upload error:", error);
        toast.error("Failed to upload image");
      }
    }
  };

  const handleImageDelete = async () => {
    try {
      const response = await apiClient.delete(REMOVE_PROFILE_IMAGE, {
        withCredentials: true,
      });

      if (response.status === 200) {
        setUserInfo({ ...userInfo, picture: null });
        setImage(null);
        toast.success("Image removed successfully.");
      }
    } catch (error) {
      console.error("Image delete error:", error);
      toast.error("Failed to delete image");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 sm:p-6 font-sans">
      <div className="w-full max-w-lg bg-white shadow-2xl rounded-xl overflow-hidden">
        {/* Header with Centered Title */}
        <div
          style={headerStyle}
          className="p-5 flex items-center justify-center relative shadow-md transition-colors duration-300"
        >
          <Button
            onClick={handleNavigate}
            variant="ghost"
            className="text-white hover:bg-white/10 p-2 h-auto absolute left-4 cursor-pointer"
            title="Go back to Chat"
          >
            <ChevronLeft size={24} />
          </Button>
          <h1 className="text-xl font-bold text-white tracking-wide">
            Profile Setup
          </h1>
        </div>

        {/* Content Area */}
        <div className="p-8 space-y-8">
          {/* Profile Picture Upload Section */}
          <div className="flex flex-col items-center justify-center space-y-4">
            <div
              className="relative w-32 h-32 rounded-full border-4 border-gray-200 shadow-lg group"
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
            >
              <Avatar className="w-full h-full">
                <AvatarImage
                  src={image}
                  alt="Profile"
                  className="object-cover transition-opacity duration-300"
                />
                <AvatarFallback
                  className="text-4xl font-bold text-white transition-opacity duration-300"
                  style={headerStyle}
                >
                  {getAvatarFallback()}
                </AvatarFallback>
              </Avatar>

              {/* Hover Overlay */}
              <div
                className={`absolute inset-0 bg-black bg-opacity-50 rounded-full flex flex-col items-center justify-center transition-opacity duration-300 ${
                  hovered ? "opacity-100" : "opacity-0"
                } z-0`}
                onClick={!image ? handleFileInputClick : undefined}
              >
                <Image className="w-6 h-6 text-white mb-1" />
                <span className="text-white text-xs font-medium">
                  {image ? "Change Photo" : "Upload Photo"}
                </span>
              </div>

              {/* Camera/Plus Icon or Delete Icon */}
              <div
                className="absolute bottom-0 right-0 p-1 rounded-full shadow-xl z-20 border-white border-2 cursor-pointer"
                style={headerStyle}
                onClick={image ? handleImageDelete : handleFileInputClick}
              >
                {image ? (
                  <CircleX className="w-6 h-6 text-white" />
                ) : (
                  <PlusCircle className="w-6 h-6 text-white" />
                )}

                {/* Hidden File Input */}
                <input
                  type="file"
                  ref={fileInputRef}
                  accept=".png, .jpg, .jpeg, .webp"
                  className="hidden"
                  name="profile-image"
                  onChange={handleImageChange}
                />
              </div>
            </div>

            <p className="text-gray-600 font-medium">Set Your Avatar</p>
          </div>

          {/* Name Input Fields */}
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                disabled
                value={userInfo.email || ""}
                className="focus-visible:ring-offset-0 focus-visible:ring-2"
                style={{ "--tw-ring-color": currentColorHex }}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                type="text"
                placeholder="e.g., Ali"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="focus-visible:ring-offset-0 focus-visible:ring-2"
                style={{ "--tw-ring-color": currentColorHex }}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                type="text"
                placeholder="e.g., Khan"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="focus-visible:ring-offset-0 focus-visible:ring-2"
                style={{ "--tw-ring-color": currentColorHex }}
              />
            </div>
          </div>

          {/* Color Picker Section */}
          <div className="space-y-3 pt-2">
            <p className="text-sm font-medium text-gray-700">
              Choose Profile Color (Theme)
            </p>
            <div className="flex space-x-3 justify-center">
              {colors.map((color) => (
                <div
                  key={color.id}
                  className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full cursor-pointer transition-transform duration-200 ease-in-out hover:scale-110 flex items-center justify-center shadow-md`}
                  style={{ backgroundColor: color.hex }}
                  onClick={() => setSelectedColor(color.id)}
                  title={`Color ${color.id}`}
                >
                  {selectedColor === color.id && (
                    <Check className="w-5 h-5 text-white" strokeWidth={3} />
                  )}
                </div>
              ))}
            </div>
          </div>

          <p className="text-center text-xs text-gray-500 mt-6">
            Your name and color will be visible to your chat contacts.
          </p>

          <Button
            onClick={handleProfileUpdate}
            style={{ backgroundColor: currentColorHex }}
            className={`w-full py-6 text-lg font-semibold text-white transition-colors duration-300 hover:opacity-90 shadow-lg`}
          >
            {userInfo.profileSetup ? "Update Profile" : "Complete Setup"}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Profile;

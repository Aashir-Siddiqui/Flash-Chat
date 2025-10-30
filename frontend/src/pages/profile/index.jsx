import { useAppStore } from "@/store";
import React, { useEffect, useRef, useState } from "react";
import {
  ChevronLeft,
  Check,
  Upload,
  Trash2,
  User,
  Mail,
  Palette,
  Camera,
  Shield,
  Sparkles,
} from "lucide-react";
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
import { colors, getColor } from "@/lib/utils";

function Profile() {
  const navigate = useNavigate();
  const { userInfo, setUserInfo } = useAppStore();

  const [firstName, setFirstName] = useState(userInfo?.firstName || "");
  const [lastName, setLastName] = useState(userInfo?.lastName || "");
  const [image, setImage] = useState(null);
  const [hovered, setHovered] = useState(false);
  const [selectedColor, setSelectedColor] = useState(userInfo?.color || 0);
  const [loading, setLoading] = useState(false);
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

  const currentColorHex = getColor(selectedColor);

  const getAvatarFallback = () => {
    if (firstName && lastName)
      return `${firstName[0]}${lastName[0]}`.toUpperCase();
    if (userInfo?.email) return userInfo.email[0].toUpperCase();
    return "U";
  };

  const profileValidate = () => {
    if (!firstName.trim()) {
      toast.error("First name is required");
      return false;
    }
    if (!lastName.trim()) {
      toast.error("Last name is required");
      return false;
    }
    if (firstName.trim().length < 2) {
      toast.error("First name must be at least 2 characters long");
      return false;
    }
    if (lastName.trim().length < 2) {
      toast.error("Last name must be at least 2 characters long");
      return false;
    }
    return true;
  };

  const handleProfileUpdate = async () => {
    if (!profileValidate()) return;

    setLoading(true);
    try {
      const response = await apiClient.post(
        UPDATE_PROFILE_ROUTE,
        {
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          color: selectedColor,
        },
        { withCredentials: true }
      );

      if (response.status === 200 && response.data) {
        setUserInfo({ ...response.data });
        toast.success("Profile updated successfully");
        navigate("/chat");
      }
    } catch (error) {
      console.error("Profile update error:", error);
      const errorMsg = error.response?.data?.msg || "Failed to update profile";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleNavigate = () => {
    if (userInfo.profileSetup) {
      navigate("/chat");
    } else {
      toast.error("Please complete your profile setup");
    }
  };

  const handleFileInputClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Only JPEG, PNG, and WebP images are allowed");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("profile-image", file);

      const response = await apiClient.post(ADD_PROFILE_IMAGE, formData, {
        withCredentials: true,
      });

      if (response.status === 200 && response.data) {
        setUserInfo({ ...userInfo, picture: response.data.picture });
        setImage(`${Host}/${response.data.picture}`);
        toast.success("Profile picture updated successfully");
      }
    } catch (error) {
      console.error("Image upload error:", error);
      const errorMsg = error.response?.data?.msg || "Failed to upload image";
      toast.error(errorMsg);
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
        toast.success("Profile picture removed successfully");
      }
    } catch (error) {
      console.error("Image delete error:", error);
      toast.error("Failed to remove profile picture");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f1419] via-[#1a1f2e] to-[#0f1419] flex items-center justify-center p-3 sm:p-6">
      <div className="w-full max-w-5xl">
        <div className="bg-[#1c1d25] rounded-3xl shadow-2xl overflow-hidden border border-[#2f303b]">
          <div className="relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: `radial-gradient(circle at 2px 2px, ${currentColorHex} 1px, transparent 0)`,
                  backgroundSize: "40px 40px",
                }}
              />
            </div>

            <div
              className="relative p-6 sm:p-8 transition-all duration-500"
              style={{
                background: `linear-gradient(135deg, ${currentColorHex}ee 0%, ${currentColorHex} 50%, ${currentColorHex}dd 100%)`,
              }}
            >
              <Button
                onClick={handleNavigate}
                variant="ghost"
                className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 rounded-full cursor-pointer w-10 h-10 sm:w-11 sm:h-11 p-0 transition-all duration-300 hover:scale-110"
                title="Back to Chat"
              >
                <ChevronLeft size={24} />
              </Button>

              <div className="flex flex-col items-center justify-center gap-2 sm:gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 sm:p-2.5 bg-white/20 rounded-xl backdrop-blur-sm">
                    <Sparkles size={28} className="text-white" />
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                    Profile Setup
                  </h1>
                </div>
                <p className="text-white/80 text-sm sm:text-base">
                  Personalize your chat experience
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-10 space-y-8 sm:space-y-10">
            <div className="flex flex-col items-center">
              <div className="relative">
                <div
                  className="absolute -inset-2 rounded-full blur-xl opacity-40 animate-pulse"
                  style={{ backgroundColor: currentColorHex }}
                />

                <div
                  className="relative group cursor-pointer"
                  onMouseEnter={() => setHovered(true)}
                  onMouseLeave={() => setHovered(false)}
                  onClick={handleFileInputClick}
                >
                  <div
                    className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-full border-4 shadow-2xl transition-all duration-300 group-hover:scale-105 overflow-hidden"
                    style={{ borderColor: currentColorHex }}
                  >
                    <Avatar className="w-full h-full">
                      <AvatarImage
                        src={image}
                        alt="Profile"
                        className="object-cover"
                      />
                      <AvatarFallback
                        className="text-4xl sm:text-5xl font-bold text-white"
                        style={{ backgroundColor: currentColorHex }}
                      >
                        {getAvatarFallback()}
                      </AvatarFallback>
                    </Avatar>

                    <div
                      className={`absolute inset-0 bg-black/70 backdrop-blur-sm flex flex-col items-center rounded-full justify-center transition-all duration-300 ${
                        hovered ? "opacity-100" : "opacity-0"
                      }`}
                    >
                      <Camera className="w-10 h-10 text-white mb-2" />
                      <span className="text-white text-sm font-semibold px-4 text-center">
                        {image ? "Change Photo" : "Upload Photo"}
                      </span>
                      <span className="text-white/60 text-xs mt-1 mb-6">
                        Click to select
                      </span>
                    </div>
                  </div>

                  <div
                    className="absolute bottom-2 right-2 p-3 rounded-full shadow-xl transition-all duration-300 group-hover:scale-110 border-4 border-[#1c1d25]"
                    style={{ backgroundColor: currentColorHex }}
                  >
                    <Camera className="w-5 h-5 text-white" />
                  </div>
                </div>

                <input
                  type="file"
                  ref={fileInputRef}
                  accept=".png,.jpg,.jpeg,.webp"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </div>

              <div className="flex items-center gap-3 mt-6">
                <Button
                  onClick={handleFileInputClick}
                  className="px-6 py-2.5 cursor-pointer rounded-xl font-medium shadow-lg transition-all duration-300 hover:scale-105"
                  style={{ backgroundColor: currentColorHex }}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Photo
                </Button>

                {image && (
                  <Button
                    onClick={handleImageDelete}
                    className="px-6 py-2.5 bg-red-500 hover:bg-red-600 rounded-xl font-medium shadow-lg transition-all cursor-pointer duration-300 hover:scale-105"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Remove
                  </Button>
                )}
              </div>

              <div className="text-center mt-6 space-y-2">
                <p className="text-gray-200 font-semibold text-xl">
                  {firstName && lastName
                    ? `${firstName} ${lastName}`
                    : "Complete Your Profile"}
                </p>
                <div className="flex items-center justify-center gap-2 text-gray-400">
                  <Mail size={14} />
                  <p className="text-sm">{userInfo.email}</p>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#2f303b]"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-[#1c1d25] text-gray-400">
                  Personal Information
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label className="text-gray-300 flex items-center gap-2 text-sm font-medium">
                  <User size={16} className="text-gray-400" />
                  First Name
                </Label>
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Enter your first name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    disabled={loading}
                    className="bg-[#2a2b33] border-[#3d3e47] text-white placeholder-gray-500 h-12 pl-4 pr-4 rounded-xl focus-visible:ring-2 disabled:opacity-50 transition-all"
                    style={{ "--tw-ring-color": currentColorHex }}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-gray-300 flex items-center gap-2 text-sm font-medium">
                  <User size={16} className="text-gray-400" />
                  Last Name
                </Label>
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Enter your last name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    disabled={loading}
                    className="bg-[#2a2b33] border-[#3d3e47] text-white placeholder-gray-500 h-12 pl-4 pr-4 rounded-xl focus-visible:ring-2 disabled:opacity-50 transition-all"
                    style={{ "--tw-ring-color": currentColorHex }}
                  />
                </div>
              </div>

              <div className="space-y-3 lg:col-span-2">
                <Label className="text-gray-300 flex items-center gap-2 text-sm font-medium">
                  <Mail size={16} className="text-gray-400" />
                  Email Address
                </Label>
                <div className="relative">
                  <Input
                    type="email"
                    disabled
                    value={userInfo.email || ""}
                    className="bg-[#2a2b33]/50 border-[#3d3e47] text-gray-400 h-12 pl-4 pr-4 rounded-xl cursor-not-allowed"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    <Shield size={18} className="text-gray-500" />
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#2f303b]"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-[#1c1d25] text-gray-400">
                  Theme Customization
                </span>
              </div>
            </div>

            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Palette size={20} className="text-gray-400" />
                  <p className="text-base font-medium text-gray-300">
                    Choose Your Theme Color
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-400">Selected:</span>
                  <div
                    className="w-10 h-10 rounded-xl border-2 border-white shadow-lg transition-all duration-300 hover:scale-110"
                    style={{ backgroundColor: currentColorHex }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-4 sm:grid-cols-8 gap-3 sm:gap-4 p-5 bg-[#2a2b33]/50 rounded-2xl border border-[#3d3e47]">
                {colors.map((color) => (
                  <button
                    key={color.id}
                    className={`w-full aspect-square rounded-xl cursor-pointer transition-all duration-300 hover:scale-110 flex items-center justify-center shadow-lg hover:shadow-xl relative group ${
                      selectedColor === color.id
                        ? "ring-4 ring-white scale-110"
                        : "hover:ring-2 hover:ring-gray-400"
                    }`}
                    style={{ backgroundColor: color.hex }}
                    onClick={() => setSelectedColor(color.id)}
                    title={`Color ${color.id}`}
                  >
                    {selectedColor === color.id && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Check
                          className="w-5 h-5 sm:w-6 sm:h-6 text-white drop-shadow-lg"
                          strokeWidth={3}
                        />
                      </div>
                    )}

                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-black/80 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                      Color {color.id + 1}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-r from-[#2a2b33] to-[#2a2b33]/50 border border-[#3d3e47] rounded-xl p-5">
              <div className="flex items-start gap-3">
                <div
                  className="p-2 rounded-lg"
                  style={{ backgroundColor: `${currentColorHex}20` }}
                >
                  <Shield size={20} style={{ color: currentColorHex }} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-300 mb-1">
                    Privacy Notice
                  </p>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    Your profile information and theme preferences will be
                    visible to your chat contacts. We keep your data secure and
                    never share it with third parties.
                  </p>
                </div>
              </div>
            </div>

            <Button
              onClick={handleProfileUpdate}
              disabled={loading}
              className="w-full py-6 text-lg cursor-pointer font-semibold text-white shadow-xl hover:shadow-2xl rounded-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none relative overflow-hidden group"
              style={{
                background: loading
                  ? "#6b7280"
                  : `linear-gradient(135deg, ${currentColorHex} 0%, ${currentColorHex}dd 100%)`,
              }}
            >
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />

              <span className="relative flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Check size={20} />
                    {userInfo.profileSetup
                      ? "Update Profile"
                      : "Complete Setup"}
                  </>
                )}
              </span>
            </Button>
          </div>
        </div>

        <p className="text-center text-gray-500 text-sm mt-6">
          Need help? Contact support at support@flashchat.com
        </p>
      </div>
    </div>
  );
}

export default Profile;

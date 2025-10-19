import React, { useState } from "react";
import { LogIn, UserPlus, Zap, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client.js";
import { LOGIN_ROUTE, SIGNUP_ROUTE } from "@/utils/constant.js";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "@/store";

// Custom, self-contained Auth component using internal state for tabs
const Auth = () => {
  const { userInfo, setUserInfo } = useAppStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("login");

  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const validateSignup = () => {
    if (!email.length) {
      toast.error("Email is required");
      return false;
    }
    if (!password.length) {
      toast.error("Password is required");
      return false;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateSignup()) {
      const response = await apiClient.post(
        SIGNUP_ROUTE,
        {
          email,
          password,
        },
        { withCredentials: true }
      );
      if (response.status === 201) {
        setUserInfo(response.data.user);
        toast.success("Account created successfully!", {
          icon: <CheckCircle className="h-5 w-5 text-white" />,
          duration: 4000,
          navigate: "/profile-setup",
        });
        navigate("/profile-setup");
      }
      console.log(response);
    }
  };

  const validateLogin = () => {
    if (!email.length) {
      toast.error("Email is required");
      return false;
    }
    if (!password.length) {
      toast.error("Password is required");
      return false;
    }
    return true;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (validateLogin()) {
      const response = await apiClient.post(
        LOGIN_ROUTE,
        {
          email,
          password,
        },
        { withCredentials: true }
      );
      if (response.data.user) {
        setUserInfo(response.data.user);
        if (response.data.user.profileSetup) {
          navigate("/chat");
        } else {
          navigate("/profile");
        }
      }
      console.log("Login", response);
    }
  };

  const ThemedAnimatedSVG = (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-48 h-48 drop-shadow-lg animate-pulse-slow"
    >
      <style>
        {`
          /* Custom CSS Animation to mimic subtle Lottie movement */
          @keyframes pulse-slow {
            0%, 100% { transform: scale(1) translateY(0px); opacity: 0.9; }
            50% { transform: scale(1.05) translateY(-5px); opacity: 1; }
          }
          .animate-pulse-slow {
            animation: pulse-slow 6s infinite ease-in-out;
          }
        `}
      </style>

      {/* Main Shield Body (Emerald Dark) */}
      <path
        d="M50 0 L10 20 V50 C10 75 50 100 50 100 S90 75 90 50 V20 L50 0 Z"
        fill="#047857"
      />

      {/* Shield Highlight/Trim (Teal/Emerald Light) */}
      <path
        d="M50 2 L12 21 V49 C12 73 50 97 50 97 S88 73 88 49 V21 L50 2 Z"
        fill="#10B981"
        opacity="0.8"
      />

      {/* Checkmark (White) */}
      <path
        d="M30 50 L45 65 L70 35"
        stroke="#FFFFFF"
        strokeWidth="8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Minimal Chat Icon Overlay */}
      <path
        d="M35 15 L65 15 Q75 15 75 25 L75 45 Q75 55 65 55 L50 55 L35 70 V55 Q25 55 25 45 L25 25 Q25 15 35 15 Z"
        fill="#FFFFFF"
        opacity="0.1"
      />
    </svg>
  );

  const LoginForm = (
    <form onSubmit={handleLogin} className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-900">Sign In</h2>
      <div className="space-y-4">
        <div>
          <label
            className="block text-sm font-medium text-gray-700 mb-1"
            htmlFor="email"
          >
            Email Address
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-emerald-500 focus:border-emerald-500 transition duration-150"
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label
            className="block text-sm font-medium text-gray-700 mb-1"
            htmlFor="password"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-emerald-500 focus:border-emerald-500 transition duration-150"
            placeholder="••••••••"
          />
        </div>
      </div>
      <button
        type="submit"
        className="w-full py-3 px-4 bg-emerald-600 text-white font-semibold rounded-xl shadow-lg hover:bg-emerald-700 transition duration-300"
      >
        Sign In
      </button>
      <p className="text-center text-sm text-gray-500">
        Forgot password?{" "}
        <a
          href="#"
          className="font-medium text-emerald-600 hover:text-emerald-500"
        >
          Reset it
        </a>
      </p>
    </form>
  );

  const RegisterForm = (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-900">Create Account</h2>
      <div className="space-y-4">
        <div>
          <label
            className="block text-sm font-medium text-gray-700 mb-1"
            htmlFor="reg_email"
          >
            Email Address
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-green-500 focus:border-green-500 transition duration-150"
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label
            className="block text-sm font-medium text-gray-700 mb-1"
            htmlFor="reg_password"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-green-500 focus:border-green-500 transition duration-150"
            placeholder="••••••••"
          />
        </div>
        <div>
          <label
            className="block text-sm font-medium text-gray-700 mb-1"
            htmlFor="reg_password"
          >
            Confirm Password
          </label>
          <input
            id="confirmpassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-green-500 focus:border-green-500 transition duration-150"
            placeholder="••••••••"
          />
        </div>
      </div>
      <button
        type="submit"
        className="w-full py-3 px-4 bg-green-600 text-white font-semibold rounded-xl shadow-lg hover:bg-green-700 transition duration-300"
      >
        Create Account
      </button>
    </form>
  );

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 font-inter">
      <style>{`
        /* Import Inter font (for the 'font-inter' utility) */
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap');
        .font-inter {
            font-family: 'Inter', sans-serif;
        }
      `}</style>

      <div className="bg-white shadow-2xl rounded-3xl w-full max-w-6xl overflow-hidden grid xl:grid-cols-2">
        {/* --- Left Side: Welcome & Animated SVG Panel (Hidden on Mobile) --- */}
        <div
          className="hidden xl:flex flex-col items-center justify-center p-12 
                     bg-gradient-to-br from-emerald-700 to-teal-600 text-white relative 
                     transition duration-500 ease-in-out space-y-6"
        >
          {/* Animated SVG Placeholder */}
          {ThemedAnimatedSVG}

          <div className="relative z-10 text-center">
            <h1 className="text-5xl font-extrabold mb-3 flex items-center justify-center">
              <Zap className="h-8 w-8 mr-2 text-emerald-300" />
              Flash Chat
            </h1>
            <p className="text-lg font-light max-w-xs opacity-90">
              Securely connect and chat with the world, powered by Firebase.
            </p>
          </div>
        </div>

        {/* --- Right Side: Auth Forms & Tabs --- */}
        <div className="flex flex-col items-center justify-center p-8 md:p-12">
          {/* Custom Tabs List */}
          <div className="w-full max-w-sm mb-8">
            <div className="flex border-b border-gray-200">
              {/* Login Tab Trigger */}
              <button
                onClick={() => setActiveTab("login")}
                className={`flex-1 py-3 text-lg font-semibold border-b-2 transition-colors duration-300 ${
                  activeTab === "login"
                    ? "border-emerald-600 text-emerald-600" // Primary Green
                    : "border-transparent text-gray-500 hover:text-emerald-600"
                } flex items-center justify-center space-x-2`}
              >
                <LogIn className="w-5 h-5" />
                <span>Login</span>
              </button>
              {/* Register Tab Trigger */}
              <button
                onClick={() => setActiveTab("register")}
                className={`flex-1 py-3 text-lg font-semibold border-b-2 transition-colors duration-300 ${
                  activeTab === "register"
                    ? "border-green-600 text-green-600" // Accent Green
                    : "border-transparent text-gray-500 hover:text-green-600"
                } flex items-center justify-center space-x-2`}
              >
                <UserPlus className="w-5 h-5" />
                <span>Register</span>
              </button>
            </div>
          </div>

          {/* Tabs Content */}
          <div className="w-full max-w-sm">
            {activeTab === "login" ? LoginForm : RegisterForm}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;

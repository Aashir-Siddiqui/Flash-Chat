import React, { useState } from "react";
import {
  LogIn,
  UserPlus,
  MessageCircle,
  Shield,
  Eye,
  EyeOff,
  Zap,
} from "lucide-react";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client.js";
import { LOGIN_ROUTE, SIGNUP_ROUTE } from "@/utils/constant.js";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "@/store";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

const Auth = () => {
  const { setUserInfo } = useAppStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("login");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const getPasswordStrength = (pwd) => {
    if (!pwd) return { strength: 0, label: "", color: "" };

    let strength = 0;
    if (pwd.length >= 8) strength++;
    if (/[a-z]/.test(pwd)) strength++;
    if (/[A-Z]/.test(pwd)) strength++;
    if (/\d/.test(pwd)) strength++;
    if (/[@$!%*?&]/.test(pwd)) strength++;

    const labels = ["Very Weak", "Weak", "Fair", "Good", "Strong"];
    const colors = ["#ef4444", "#f97316", "#eab308", "#22c55e", "#10b981"];

    return {
      strength: (strength / 5) * 100,
      label: labels[strength - 1] || "",
      color: colors[strength - 1] || "#ef4444",
    };
  };

  const passwordStrength = getPasswordStrength(password);

  const validateSignup = () => {
    if (!email.trim()) {
      toast.error("Email is required");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please provide a valid email address");
      return false;
    }

    if (!password) {
      toast.error("Password is required");
      return false;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return false;
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      toast.error(
        "Password must contain uppercase, lowercase, number, and special character (@$!%*?&)"
      );
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
    if (!validateSignup()) return;

    setLoading(true);
    try {
      const response = await apiClient.post(
        SIGNUP_ROUTE,
        { email: email.toLowerCase().trim(), password },
        { withCredentials: true }
      );

      if (response.status === 201) {
        setUserInfo(response.data.user);
        toast.success("Account created successfully!");
        navigate("/profile");
      }
    } catch (error) {
      console.error("Signup error:", error);
      const errorMsg = error.response?.data?.msg || "Failed to create account";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const validateLogin = () => {
    if (!email.trim()) {
      toast.error("Email is required");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please provide a valid email address");
      return false;
    }

    if (!password) {
      toast.error("Password is required");
      return false;
    }

    return true;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateLogin()) return;

    setLoading(true);
    try {
      const response = await apiClient.post(
        LOGIN_ROUTE,
        { email: email.toLowerCase().trim(), password },
        { withCredentials: true }
      );

      if (response.data.user) {
        setUserInfo(response.data.user);
        toast.success("Welcome back!");

        if (response.data.user.profileSetup) {
          navigate("/chat");
        } else {
          navigate("/profile");
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      const errorMsg = error.response?.data?.msg || "Invalid credentials";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const LoginForm = (
    <form onSubmit={handleLogin} className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
        <p className="text-gray-400">Sign in to continue chatting</p>
      </div>

      <div className="space-y-5">
        <div>
          <label
            className="block text-sm font-medium text-gray-300 mb-2"
            htmlFor="email"
          >
            Email Address
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            className="w-full px-4 py-3 bg-[#2a2b33] border border-[#3d3e47] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all disabled:opacity-50"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label
            className="block text-sm font-medium text-gray-300 mb-2"
            htmlFor="password"
          >
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              className="w-full px-4 py-3 bg-[#2a2b33] border border-[#3d3e47] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all disabled:opacity-50 pr-12"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute cursor-pointer right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3.5 px-4 cursor-pointer bg-gradient-to-r from-teal-400 to-teal-500 text-white font-semibold rounded-xl shadow-lg hover:from-teal-500 hover:to-teal-600 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
      >
        {loading ? "Signing in..." : "Sign In"}
      </button>

      <p className="text-center text-sm text-gray-400">
        Don't have an account?{" "}
        <button
          type="button"
          onClick={() => setActiveTab("register")}
          className="font-medium cursor-pointer text-teal-500 hover:text-teal-400 transition-colors"
        >
          Sign up
        </button>
      </p>
    </form>
  );

  const RegisterForm = (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Create Account</h2>
        <p className="text-gray-400">Join and start chatting today</p>
      </div>

      <div className="space-y-5">
        <div>
          <label
            className="block text-sm font-medium text-gray-300 mb-2"
            htmlFor="reg_email"
          >
            Email Address
          </label>
          <input
            id="reg_email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            className="w-full px-4 py-3 bg-[#2a2b33] border border-[#3d3e47] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all disabled:opacity-50"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label
            className="block text-sm font-medium text-gray-300 mb-2"
            htmlFor="reg_password"
          >
            Password
          </label>
          <div className="relative">
            <input
              id="reg_password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              className="w-full px-4 py-3 bg-[#2a2b33] border border-[#3d3e47] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all disabled:opacity-50 pr-12"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 cursor-pointer top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* Password Strength Indicator */}
          {password && (
            <div className="mt-2 space-y-1">
              <div className="h-1.5 bg-[#2a2b33] rounded-full overflow-hidden">
                <div
                  className="h-full transition-all duration-300"
                  style={{
                    width: `${passwordStrength.strength}%`,
                    backgroundColor: passwordStrength.color,
                  }}
                />
              </div>
              <p className="text-xs" style={{ color: passwordStrength.color }}>
                {passwordStrength.label}
              </p>
            </div>
          )}

          <p className="mt-2 text-xs text-gray-400">
            Must contain 8+ characters, uppercase, lowercase, number & special
            character
          </p>
        </div>

        <div>
          <label
            className="block text-sm font-medium text-gray-300 mb-2"
            htmlFor="confirm_password"
          >
            Confirm Password
          </label>
          <div className="relative">
            <input
              id="confirm_password"
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={loading}
              className="w-full px-4 py-3 bg-[#2a2b33] border border-[#3d3e47] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all disabled:opacity-50 pr-12"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute cursor-pointer right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3.5 px-4 cursor-pointer bg-gradient-to-r from-teal-500 to-teal-600 text-white font-semibold rounded-xl shadow-lg hover:from-teal-600 hover:to-teal-700 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
      >
        {loading ? "Creating account..." : "Create Account"}
      </button>

      <p className="text-center text-sm text-gray-400">
        Already have an account?{" "}
        <button
          type="button"
          onClick={() => setActiveTab("login")}
          className="font-medium cursor-pointer text-teal-500 hover:text-teal-400 transition-colors"
        >
          Sign in
        </button>
      </p>
    </form>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f1419] via-[#1a1f2e] to-[#0f1419] flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-4 items-center">
        {/* Left Side - Branding */}
        <div className="hidden lg:flex flex-col items-center justify-center space-y-8 text-center">
          <div className="relative">
            <div className="absolute inset-0 bg-teal-500/20 blur-3xl rounded-full" />
            <DotLottieReact
              src="/src/assets/authChatbot.lottie"
              loop
              autoplay
              style={{ width: 350, height: 350 }}
            />
          </div>

          <div className="space-y-4">
            <h1 className="text-5xl font-semibold text-white flex items-center justify-center">
              <Zap className="h-12 w-12 mr-2 text-teal-500" />
              Flash Chat
            </h1>
            <p className="text-xl text-gray-300 max-w-md">
              Connect instantly with friends and colleagues in a secure
              environment
            </p>
          </div>

          <div className="flex items-center gap-8 text-gray-400">
            <div className="flex items-center gap-2">
              <Shield size={20} className="text-teal-500" />
              <span className="text-sm">End-to-End Encryption</span>
            </div>
            <div className="flex items-center gap-2">
              <MessageCircle size={20} className="text-teal-500" />
              <span className="text-sm">Real-time Messaging</span>
            </div>
          </div>
        </div>

        {/* Right Side - Auth Forms */}
        <div className="w-full max-w-md mx-auto">
          <div className="bg-[#1c1d25] backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-[#2f303b]">
            {/* Mobile Logo */}
            <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
              <h1 className="text-4xl font-semibold text-white flex items-center justify-center">
                <Zap className="h-10 w-10 mr-2 text-teal-500" />
                Flash Chat
              </h1>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-8 bg-[#2a2b33] p-1.5 rounded-xl">
              <button
                onClick={() => setActiveTab("login")}
                className={`flex-1 py-2.5 text-sm font-semibold cursor-pointer rounded-lg transition-all duration-300 flex items-center justify-center gap-2 ${
                  activeTab === "login"
                    ? "bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-lg"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <LogIn size={18} />
                <span>Login</span>
              </button>
              <button
                onClick={() => setActiveTab("register")}
                className={`flex-1 py-2.5 text-sm font-semibold cursor-pointer rounded-lg transition-all duration-300 flex items-center justify-center gap-2 ${
                  activeTab === "register"
                    ? "bg-gradient-to-r from-teal-700 to-teal-600 text-white shadow-lg"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <UserPlus size={18} />
                <span>Register</span>
              </button>
            </div>

            {/* Forms */}
            {activeTab === "login" ? LoginForm : RegisterForm}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;

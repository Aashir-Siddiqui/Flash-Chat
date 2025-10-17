import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import Auth from "./pages/auth";
import Chat from "./pages/chat";
import Profile from "./pages/profile";
import { useAppStore } from "./store";
import { useEffect, useState } from "react";
import { apiClient } from "./lib/api-client.js";
import { GET_USER_INFO } from "./utils/constant.js";
import { AxiosError } from "axios";

const PrivateRoute = ({ children }) => {
  const { userInfo } = useAppStore();
  const isAuthenticated = !!userInfo;
  return isAuthenticated ? children : <Navigate to="/auth" />;
};

const AuthRoute = ({ children }) => {
  const { userInfo } = useAppStore();
  const isAuthenticated = !!userInfo;
  return isAuthenticated ? <Navigate to="/chat" /> : children;
};

function App() {
  const { userInfo, setUserInfo } = useAppStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUserData = async () => {
      try {
        // Line 29: GET http://localhost:3000/api/auth/userInfo
        const response = await apiClient.get(GET_USER_INFO, {
          withCredentials: true,
        });
        if (response.status === 200 && response.data.id) {
          setUserInfo(response.data);
        } else {
          setUserInfo(undefined);
        }
        // console.log("User info response:", response); // Console log hata sakte hain
      } catch (error) {
        // FIX: Unauthorized errors ko console mein log karne se rokna
        if (
          error instanceof AxiosError &&
          (error.response?.status === 401 || error.response?.status === 403)
        ) {
          // Expected behavior: User is not logged in, server returned unauthorized.
          console.log(
            "Initial auth check: User not logged in (Status 401/403 handled gracefully)."
          );
        } else {
          // Baaki serious errors ko log karo
          console.error("Error fetching user info:", error);
        }
      } finally {
        setLoading(false);
      }
    };
    if (!userInfo) {
      getUserData(); // .finally() ki zarurat nahi, finally block function ke andar hai.
    } else {
      setLoading(false);
    }
  }, [userInfo, setUserInfo]);

  if (loading) {
    return <div>Loading...</div>;
  }
  // ... existing return statement
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/auth"
          element={
            <AuthRoute>
              <Auth />
            </AuthRoute>
          }
        />
        <Route
          path="/chat"
          element={
            <PrivateRoute>
              <Chat />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
        <Route
          path="*"
          element={<Navigate to={userInfo ? "/chat" : "/auth"} />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

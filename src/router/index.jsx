import { createBrowserRouter } from "react-router-dom";
import RootLayout from "../layout/RootLayout";
import SignupPage from "../pages/SignupPage.jsx";
import LoginPage from "../pages/LoginPage.jsx";
import KakaoCallback from "../pages/KakaoCallback.jsx";
import ChatListPage from "../pages/ChatListPage.jsx"; // ChatListPage import
import ChatRoomPage from "../pages/ChatRoomPage.jsx"; // ChatRoomPage import
import ProfilePage from "../pages/ProfilePage.jsx";
import ProfileEditPage from "../pages/ProfileEditPage.jsx";
import { PublicRoute, PrivateRoutes } from "./ProtectedRoute.jsx";
import { AuthProvider } from "../contexts/AuthContext.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <AuthProvider>
        <RootLayout />
      </AuthProvider>
    ),
    children: [
      {
        path: "login",
        element: (
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        ),
      },
      {
        path: "signup",
        element: (
          <PublicRoute>
            <SignupPage />
          </PublicRoute>
        ),
      },
      {
        path: "oauth/kakao/callback",
        element: <KakaoCallback />,
      },
      {
        path: "/",
        element: <PrivateRoutes />, // PrivateRoutes로 보호
        children: [
          {
            path: "chat",
            element: <ChatListPage />,
          },
          {
            path: "chat/:roomId",
            element: <ChatRoomPage />,
          },
          {
            path: "profile/edit", 
            element: <ProfileEditPage />,
          },
          {
            path: "profile", 
            element: <ProfilePage />,
          },
          {
            path: "profile/:username", 
            element: <ProfilePage />,
          },
        ],
      },
    ],
  },
]);

export default router;

import { createBrowserRouter } from "react-router-dom";
import RootLayout from "../layout/RootLayout";
import SignupPage from "../pages/SignupPage.jsx";
import LoginPage from "../pages/LoginPage.jsx";
import KakaoCallback from "../pages/KakaoCallback.jsx";
import PostCreatePage from "../pages/PostCreatePage.jsx";  // 새 글 작성 
import RecentPostListPage from "../pages/RecentPostListPage.jsx";  // 최신 게시글 목록
import PostDetailPage from "../pages/PostDetailPage.jsx";  // 게시글 상세
import { PublicRoute, PrivateRoutes } from "./ProtectedRoute.jsx";
import { AuthProvider } from "../contexts/AuthContext.jsx";
import { ChatProvider } from "../contexts/ChatContext.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <AuthProvider>
        <ChatProvider>
          <RootLayout />
        </ChatProvider>
      </AuthProvider>
    ),
    children: [
      {
        index: true,
        element: <RecentPostListPage />,  // 홈("/")도 게시글 목록
      },
      {
        path: "posts",
        element: <RecentPostListPage />,  // "/posts"도 게시글 목록
      },
      {
        path: "posts/:id",
        element: <PostDetailPage />,  // 게시글 상세
      },
      {
        path: "posts/:id/edit",
        element: (
          <PrivateRoutes>
            <PostCreatePage />
          </PrivateRoutes>
        ),
      },
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
        path: "posts/new",
        element: (
          <PrivateRoutes>
            <PostCreatePage />
          </PrivateRoutes>
        ),
        path: "/",
        element: <PrivateRoutes />,
        children: [
          // Empty for now, can add other private routes here
        ],
      },
    ],
  },
]);

export default router;

import { createBrowserRouter } from "react-router-dom";
import RootLayout from "../layout/RootLayout";
import SignupPage from "../pages/SignupPage.jsx";
import LoginPage from "../pages/LoginPage.jsx";
import KakaoCallback from "../pages/KakaoCallback.jsx";
import { PublicRoute, PrivateRoutes } from "./ProtectedRoute.jsx";
import { AuthProvider } from "../contexts/AuthContext.jsx";
import RecruitDetailPage from "../pages/RecruitDetailPage.jsx";
import RecruitCreatePage from "../pages/RecruitCreatePage.jsx";
import RecruitMainPage from "../pages/RecruitMainPage.jsx";

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
			// 팀원 모집 목록
			{
				path: "recruits",
				element: <RecruitMainPage />,
			},
			// 팀원 모집글 생성
			{
				path: "recruits/create",
				element: <RecruitCreatePage />,
			},
			// 팀원 모집 상세
			{
				path: "recruits/:id",
				element: <RecruitDetailPage />,
			},
		],
	},
]);

export default router;

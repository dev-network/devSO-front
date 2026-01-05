import React from "react";
import { NavLink, Outlet, href } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useChat } from "../contexts/ChatContext";
import ChatBubble from "../components/ChatBubble";
import ChatWidget from "../components/ChatWidget";

export default function RootLayout() {
	const { isAuthenticated, logout, user } = useAuth(); // user 정보를 가져옵니다.
	const { toggleChat } = useChat();

	const navLinkStyle = ({ isActive }) => ({
		marginRight: "15px",
		fontWeight: isActive ? "bold" : "normal",
		color: isActive ? "blue" : "black",
		textDecoration: "none",
	});

	const buttonStyle = {
		marginRight: "15px",
		fontWeight: "normal",
		color: "black",
		background: "none",
		border: "none",
		cursor: "pointer",
		padding: 0,
		fontFamily: "inherit",
		fontSize: "inherit",
	};

	const handleChatClick = (e) => {
		e.preventDefault();
		toggleChat();
	};

	return (
		<div>
			<nav style={{ padding: "10px", backgroundColor: "#eee" }}>
				{/* --- 누구나 볼 수 있는 메뉴 (Public) --- */}
				<NavLink to="/" style={navLinkStyle}>
					SNS
				</NavLink>
				<NavLink to="/posts" style={navLinkStyle}>
					최신
				</NavLink>
				<NavLink to="/trending" style={navLinkStyle}>
					트렌딩
				</NavLink>
				{isAuthenticated && (
					<NavLink to="/feed" style={navLinkStyle}>
						피드
					</NavLink>
				)}
				<NavLink to="/recruits" style={navLinkStyle}>
					팀원 모집
				</NavLink>

				{/* --- 로그인 여부에 따라 바뀌는 메뉴 --- */}
				{isAuthenticated ? (
					<>
						<NavLink to="/profile" style={navLinkStyle} end>
							프로필
						</NavLink>

						<NavLink to="/profile/my/posts" style={navLinkStyle}>
							내 작성글
						</NavLink>

						<NavLink to="/posts/new" style={navLinkStyle}>
							새 글 작성
						</NavLink>

						<a
							href="#"
							onClick={handleChatClick}
							style={navLinkStyle({ isActive: false })}
						>
							채팅
						</a>
						<button onClick={logout} style={buttonStyle}>
							로그아웃
						</button>
					</>
				) : (
					<>
						<NavLink to="/login" style={navLinkStyle}>
							로그인
						</NavLink>
						<NavLink to="/signup" style={navLinkStyle}>
							회원가입
						</NavLink>
					</>
				)}
			</nav>

			<div style={{ padding: "20px" }}>
				<Outlet />
			</div>

			{isAuthenticated && (
				<>
					<ChatBubble />
					<ChatWidget />
				</>
			)}
		</div>
	);
}

import React from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useChat } from "../contexts/ChatContext";
import ChatBubble from "../components/ChatBubble";
import ChatWidget from "../components/ChatWidget";
import "../styles/Navbar.css";

export default function RootLayout() {
  // useAuth에서 user 객체를 추가로 구조 분해 할당합니다.
  const { isAuthenticated, logout, user } = useAuth();
  const { toggleChat } = useChat();
  const location = useLocation();

  // SNS 영역 관련 활성화 로직
  const isSnsActive =
    location.pathname.startsWith("/sns") ||
    location.pathname.startsWith("/posts") ||
    location.pathname.startsWith("/trending") ||
    location.pathname.startsWith("/feed");

  const handleChatClick = (e) => {
    e.preventDefault();
    toggleChat();
  };

  return (
    <div>
      <nav className="devso-nav">
        <div className="devso-nav-inner">
          {/* Left: Brand + navigation */}
          <div className="devso-nav-left">
            <NavLink to="/dashboard" className="devso-nav-brand">
              <span className="devso-nav-brand-text">DevSo</span>
            </NavLink>

            <div className="devso-nav-links">
              <NavLink
                to="/sns"
                className={() =>
                  `devso-nav-link ${isSnsActive ? "active" : ""}`
                }
                end
              >
                SNS
              </NavLink>
              <NavLink
                to="/recruits"
                className={({ isActive }) =>
                  `devso-nav-link ${isActive ? "active" : ""}`
                }
              >
                팀원 모집
              </NavLink>

              {isAuthenticated && (
                <>
                  <NavLink
                    to="/profile"
                    className={({ isActive }) =>
                      `devso-nav-link ${isActive ? "active" : ""}`
                    }
                    end
                  >
                    프로필
                  </NavLink>
                  <a
                    href="#"
                    onClick={handleChatClick}
                    className="devso-nav-link"
                  >
                    채팅
                  </a>
                </>
              )}
            </div>
          </div>

          {/* Right: auth actions + User ID */}
          <div
            className="devso-nav-right"
            style={{ display: "flex", alignItems: "center", gap: "15px" }}
          >
            {isAuthenticated ? (
              <>
                <span className="user-greeting">
                  안녕하세요?{"    "}
                  <span className="user-name-highlight">{user?.name}</span>
                  님
                </span>
                <button
                  onClick={logout}
                  className="devso-nav-btn devso-nav-btn-secondary"
                >
                  로그아웃
                </button>
              </>
            ) : (
              <>
                <NavLink
                  to="/login"
                  className={({ isActive }) =>
                    `devso-nav-btn ${
                      isActive
                        ? "devso-nav-btn-primary"
                        : "devso-nav-btn-secondary"
                    }`
                  }
                >
                  로그인
                </NavLink>
                <NavLink
                  to="/signup"
                  className={({ isActive }) =>
                    `devso-nav-btn ${
                      isActive
                        ? "devso-nav-btn-primary"
                        : "devso-nav-btn-secondary"
                    }`
                  }
                >
                  회원가입
                </NavLink>
              </>
            )}
          </div>
        </div>
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

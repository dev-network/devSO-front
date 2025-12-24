import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// 비로그인 전용 라우트
export const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div className="loading">로딩 중...</div>;
  }

  return !isAuthenticated ? children : <Navigate to="/" />;
};

// 로그인 전용 라우트
// - children이 있으면 children을 렌더링
// - 없으면 <Outlet />을 렌더링 (중첩 라우팅 지원)
export const PrivateRoutes = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div className="loading">로딩 중...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return children ? children : <Outlet />;
};

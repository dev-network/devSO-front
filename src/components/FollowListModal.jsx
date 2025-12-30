import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // useNavigate 추가
import { getFollowers, getFollowing, getImageUrl } from "../api";

const DEFAULT_AVATAR = "https://cdn-icons-png.flaticon.com/512/149/149071.png";

const FollowListModal = ({ isOpen, onClose, username, type }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // 페이지 이동을 위한 hook

  useEffect(() => {
    if (isOpen && username) {
      setLoading(true);
      const fetchApi = type === "followers" ? getFollowers : getFollowing;
      
      fetchApi(username)
        .then((res) => {
          // 백엔드 ApiResponse 구조(data.data)에 맞춰 안전하게 추출
          const fetchedList = res.data?.data || res.data || [];
          setUsers(Array.isArray(fetchedList) ? fetchedList : []);
        })
        .catch((err) => {
          console.error(`${type} fetch error:`, err);
          setUsers([]);
        })
        .finally(() => setLoading(false));
    }
  }, [isOpen, username, type]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      {/* 바깥 어두운 배경 클릭 시 닫기 */}
      <div className="absolute inset-0" onClick={onClose}></div>

      <div className="relative bg-white w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-white">
          <h3 className="font-black text-xl text-gray-800">
            {type === "followers" ? "팔로워" : "팔로잉"}
          </h3>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="max-h-[400px] overflow-y-auto custom-scrollbar bg-white">
          {loading ? (
            <div className="flex flex-col items-center py-20 space-y-3">
              <div className="w-8 h-8 border-4 border-[#6c5ce7] border-t-transparent rounded-full animate-spin"></div>
              <p className="text-sm text-gray-400 font-medium">불러오는 중...</p>
            </div>
          ) : users.length > 0 ? (
            <div className="divide-y divide-gray-50">
              {users.map((user) => (
                <div 
                  key={user.username} // id가 없을 경우를 대비해 고유한 username 사용
                  className="flex items-center gap-4 p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => {
                    onClose(); // 모달 닫기
                    navigate(`/profile/${user.username}`); // 리액트 라우터로 이동
                  }}
                >
                  {/* 프로필 이미지 출력부 */}
                  <img 
                    src={user.profileImageUrl ? getImageUrl(user.profileImageUrl) : DEFAULT_AVATAR} 
                    className="w-12 h-12 rounded-full object-cover border border-gray-100 shadow-sm" 
                    alt={user.username}
                    onError={(e) => { e.target.src = DEFAULT_AVATAR; }} // 이미지 로드 실패 시 기본 이미지
                  />
                  
                  <div className="flex-1">
                    <p className="font-bold text-gray-900 leading-tight">{user.name || user.username}</p>
                    <p className="text-xs text-gray-500 font-medium">@{user.username}</p>
                  </div>
                  
                  {/* 화살표 아이콘 */}
                  <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="mb-3 text-gray-200 flex justify-center">
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <p className="text-gray-400 font-medium text-sm">목록이 비어있습니다.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FollowListModal;
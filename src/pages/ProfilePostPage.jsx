import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { getProfile, getImageUrl, getTechStacks, getUserPostsByUsername } from "../api";

const DEFAULT_AVATAR = "https://cdn-icons-png.flaticon.com/512/149/149071.png";

const ProfilePostPage = () => {
  const { username: urlUsername } = useParams();
  const { user: currentUser, loading: authLoading } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (authLoading) return;
    const targetUsername = urlUsername || currentUser?.username;
    
    if (targetUsername) {
      setLoading(true);
      Promise.all([
        getProfile(targetUsername),
        getTechStacks(),
        getUserPostsByUsername(targetUsername)
      ])
        .then(([profileRes, techRes, postsRes]) => {
          setProfileData(profileRes.data?.data || profileRes.data);
          setUserPosts(postsRes.data?.data || []);
          setLoading(false);
        })
        .catch((err) => {
          console.error("데이터 로딩 실패:", err);
          setLoading(false);
        });
    }
  }, [urlUsername, currentUser, authLoading]);

  const renderImage = (path, isAvatar = false) => {
    if (!path) return isAvatar ? DEFAULT_AVATAR : null;
    if (path.startsWith("http")) return path;
    return getImageUrl(path);
  };

  if (loading) return <div className="text-center py-20 text-gray-400 font-bold">포스트를 불러오는 중입니다...</div>;

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 font-sans bg-[#fbfbfb]">
      {/* 1. 상단 프로필 요약 카드 (뒤로가기 포함) */}
      <section className="bg-gradient-to-r from-[#6c5ce7] to-[#a29bfe] text-white rounded-3xl p-8 mb-10 shadow-xl relative overflow-hidden">
        <button 
          onClick={() => navigate(-1)} 
          className="absolute top-6 left-6 text-white/80 hover:text-white transition-colors text-sm font-bold flex items-center gap-1"
        >
          ← 뒤로가기
        </button>
        
        <div className="flex flex-col items-center mt-4">
          <div className="relative group mb-4">
            <img 
              src={renderImage(profileData?.profileImageUrl || profileData?.avatarUrl, true)} 
              alt="Avatar" 
              className="w-24 h-24 rounded-full border-4 border-white/30 object-cover shadow-2xl"
            />
          </div>
          <h2 className="text-3xl font-black mb-2">{profileData?.username}님의 기록</h2>
          <p className="text-white/90 italic text-sm max-w-md text-center">
            "{profileData?.bio || "등록된 소개글이 없습니다."}"
          </p>
        </div>
      </section>

      {/* 2. 포스트 리스트 섹션 */}
      <section className="user-posts">
        <div className="flex items-center justify-between mb-8 px-2">
          <h3 className="text-2xl font-black text-gray-800 flex items-center gap-2">
            📝 작성한 포스트 
            <span className="text-[#6c5ce7] bg-[#6c5ce7]/10 px-3 py-1 rounded-full text-sm">
              {userPosts.length}
            </span>
          </h3>
        </div>

        {userPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userPosts.map((post) => (
              <div 
                key={post.id} 
                onClick={() => navigate(`/posts/${post.id}`)}
                className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
              >
                {/* 포스트 썸네일 */}
                <div className="relative h-48 overflow-hidden bg-gray-100">
                  {post.imageUrl ? (
                    <img 
                      src={renderImage(post.imageUrl)} 
                      alt="thumbnail" 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300 font-bold bg-gray-50">
                      No Image
                    </div>
                  )}
                  {/* 좋아요/조회수 배지 */}
                  <div className="absolute top-3 right-3 flex gap-2">
                    <span className="bg-black/50 backdrop-blur-md text-white text-[10px] px-2 py-1 rounded-lg font-bold">
                      👁️ {post.viewCount}
                    </span>
                  </div>
                </div>

                {/* 포스트 내용 */}
                <div className="p-5">
                  <h4 className="font-black text-lg text-gray-900 mb-2 line-clamp-1 group-hover:text-[#6c5ce7] transition-colors">
                    {post.title}
                  </h4>
                  <p className="text-gray-500 text-sm line-clamp-2 mb-4 h-10 leading-relaxed">
                    {/* post.content 가 마크다운이면 텍스트만 추출되도록 처리하거나 요약 표시 */}
                    {post.content?.replace(/[#*`]/g, '').substring(0, 60)}...
                  </p>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                    <span className="text-[11px] font-bold text-gray-400">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </span>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-[#ff7675] flex items-center gap-1">
                        ❤️ {post.likeCount || 0}
                      </span>
                      <span className="text-xs font-bold text-[#6c5ce7] flex items-center gap-1">
                        💬 {post.commentCount || 0}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-100">
            <p className="text-gray-400 font-medium">아직 작성한 게시글이 없습니다.</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default ProfilePostPage;
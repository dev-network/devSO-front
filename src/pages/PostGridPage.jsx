import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getImageUrl } from "../api";
import "../styles/PostList.css";

// RecentPostListPage와 동일한 미리보기/상대시간 로직
const extractTextFromMarkdown = (markdown) => {
  if (!markdown) return "";

  let text = markdown.replace(/!\[[^\]]*\]\([^)]*\)/g, "");
  text = text.replace(/```[\s\S]*?```/g, "");
  text = text.replace(/`[^`]*`/g, "");
  text = text.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");
  text = text.replace(/\*\*([^*]+)\*\*/g, "$1");
  text = text.replace(/\*([^*]+)\*/g, "$1");
  text = text.replace(/__([^_]+)__/g, "$1");
  text = text.replace(/_([^_]+)_/g, "$1");
  text = text.replace(/^#{1,6}\s+/gm, "");
  text = text.replace(/^[\s]*[-*+]\s+/gm, "");
  text = text.replace(/^[\s]*\d+\.\s+/gm, "");
  text = text.replace(/^>\s+/gm, "");
  text = text.replace(/^---$/gm, "");
  text = text.replace(/\n+/g, " ");
  text = text.replace(/\s+/g, " ").trim();

  return text;
};

const getPreviewText = (content, hasImage) => {
  const text = extractTextFromMarkdown(content);
  const maxLength = hasImage ? 80 : 150;
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
};

const getRelativeTime = (dateString) => {
  const now = new Date();
  const postDate = new Date(dateString);
  const diffInSeconds = Math.floor((now - postDate) / 1000);

  if (diffInSeconds < 60) return "방금 전";

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}분 전`;

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}시간 전`;

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays}일 전`;

  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) return `${diffInWeeks}주 전`;

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) return `${diffInMonths}개월 전`;

  const diffInYears = Math.floor(diffInDays / 365);
  return `${diffInYears}년 전`;
};

const PostGridPage = ({ title, fetcher, emptyText = "게시글이 없습니다." }) => {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await fetcher(0, 10);
        const pageData = response.data?.data || {};
        const newPosts = pageData.content || [];
        setPosts(newPosts);
        setHasMore(!pageData.last);
        setPage(0);
      } catch (err) {
        setError(err.response?.data?.error?.message || "게시글을 불러오는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;

    try {
      setLoading(true);
      const nextPage = page + 1;
      const response = await fetcher(nextPage, 10);
      const pageData = response.data?.data || {};
      const newPosts = pageData.content || [];

      if (newPosts.length === 0) {
        setHasMore(false);
      } else {
        setPosts((prev) => [...prev, ...newPosts]);
        setPage(nextPage);
        setHasMore(!pageData.last);
      }
    } catch (err) {
      setError(err.response?.data?.error?.message || "게시글을 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  }, [page, loading, hasMore, fetcher]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 100) {
        if (!loading && hasMore) {
          loadMore();
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading, hasMore, loadMore]);

  if (loading && posts.length === 0) {
    return (
      <div className="post-list-container">
        <div className="post-list-loading">로딩 중...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="post-list-container">
        <div style={{ padding: "20px", color: "red" }}>{error}</div>
      </div>
    );
  }

  return (
    <div className="post-list-container">
      <h1 className="post-list-title">{title}</h1>
      {posts.length === 0 ? (
        <div className="post-list-empty">{emptyText}</div>
      ) : (
        <>
          <div className="post-grid">
            {posts.map((post) => (
              <Link key={post.id} to={`/posts/${post.id}`} className="post-card">
                {post.imageUrl && (
                  <div className="post-card-image-wrapper">
                    <img src={post.imageUrl} alt={post.title} className="post-card-image" />
                  </div>
                )}
                <div className="post-card-content">
                  <div className="post-card-body">
                    <h2 className="post-card-title">{post.title}</h2>
                    {post.content && (
                      <p className="post-card-preview">{getPreviewText(post.content, !!post.imageUrl)}</p>
                    )}
                  </div>
                  <div className="post-card-relative-time">{getRelativeTime(post.createdAt)}</div>
                  <div className="post-card-footer">
                    <div className="post-card-footer-top">
                      <span className="post-card-footer-date">
                        {new Date(post.createdAt).toLocaleDateString("ko-KR", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                      <span className="post-card-footer-dot">·</span>
                      <span className="post-card-footer-comments">
                        {(post.commentCount ?? 0).toLocaleString("ko-KR")}개의 댓글
                      </span>
                    </div>

                    <div className="post-card-footer-bottom2">
                      <div className="post-card-footer-author">
                        <img
                          className="post-card-author-avatar"
                          src={
                            post.author?.profileImageUrl
                              ? getImageUrl(post.author.profileImageUrl)
                              : "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                          }
                          alt="author avatar"
                        />
                        <span className="post-card-author-by">by</span>
                        <span className="post-card-author-username">
                          {post.author?.username || post.author?.name || ""}
                        </span>
                      </div>
                      <div className="post-card-footer-stats">
                        <span className="post-card-footer-stat-item">
                          <span>👁️‍🗨️</span>
                          <span>{post.viewCount || 0}</span>
                        </span>
                        <span className="post-card-footer-stat-item">
                          <span>♥️</span>
                          <span>{post.likeCount ?? 0}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          {loading && posts.length > 0 && <div className="post-list-loading">더 불러오는 중...</div>}
          {!hasMore && posts.length > 0 && (
            <div className="post-list-end">모든 게시글을 불러왔습니다.</div>
          )}
        </>
      )}
    </div>
  );
};

export default PostGridPage;



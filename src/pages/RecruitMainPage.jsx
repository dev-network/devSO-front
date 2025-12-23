import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getRecruits, toggleBookmark } from "../api/index.js";
import "../styles/Recruit.css";
import RecruitCard from "../components/RecruitCard.jsx";

const RecruitMainPage = () => {
	const navigate = useNavigate();
	const [recruits, setRecruits] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		loadRecruits();
	}, []);

	const loadRecruits = async () => {
		setLoading(true);
		try {
			const response = await getRecruits();
			setRecruits(response.data.data);
		} catch (error) {
			console.error("팀원 모집 페이지 로드 실패:", error);
		} finally {
			setLoading(false);
		}
	};

	const handleBookmarkClick = async (recruitId) => {
		try {
			await toggleBookmark(recruitId);
			setRecruits((prev) =>
				prev.map((r) =>
					r.id === recruitId ? { ...r, bookmarked: !r.bookmarked } : r
				)
			);
		} catch (error) {
			console.error("북마크 토글 실패:", error);
		}
	};

	return (
		<div className="recruit-container">
			<section className="hero-section">
				<h1 className="hero-title">프로젝트 & 스터디 모집</h1>
				<p className="hero-subtitle">함께 성장할 팀원을 찾아보세요!</p>
				<button
					className="hero-btn"
					onClick={() => navigate("/recruits/create")}
				>
					팀원 모집글 작성
				</button>
			</section>

			{loading ? (
				<div className="loading">로딩 중...</div>
			) : recruits.length === 0 ? (
				<div className="no-posts">등록된 게시물이 없습니다.</div>
			) : (
				<div className="recruit-posts">
					{recruits.map((recruit) => (
						<RecruitCard
							key={recruit.id}
							recruit={recruit}
							onClick={() => navigate(`/recruits/${recruit.id}`)}
							onBookmarkClick={() => handleBookmarkClick(recruit.id)}
						/>
					))}
				</div>
			)}
		</div>
	);
};

export default RecruitMainPage;

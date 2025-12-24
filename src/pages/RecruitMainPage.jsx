import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
	getRecruits,
	toggleBookmark,
	getTypes,
	getPositions,
	getTechStacks,
} from "../api/index.js";
import "../styles/Recruit.css";
import RecruitCard from "../components/RecruitCard.jsx";

const RecruitMainPage = () => {
	const navigate = useNavigate();
	const [recruits, setRecruits] = useState([]);
	const [loading, setLoading] = useState(true);

	// 🌟 Enum 옵션들을 저장할 상태
	const [options, setOptions] = useState({
		types: [],
		positions: [],
		stacks: [],
	});

	useEffect(() => {
		// 페이지 로드 시 게시글과 Enum 정보를 동시에 가져옴
		loadInitialData();
	}, []);

	const loadInitialData = async () => {
		setLoading(true);
		try {
			// 🌟 게시글 리스트와 필터/라벨링에 필요한 Enum들을 병렬로 호출
			const [recruitRes, typeRes, posRes, stackRes] = await Promise.all([
				getRecruits(),
				getTypes(),
				getPositions(),
				getTechStacks(),
			]);

			setRecruits(recruitRes.data.data);

			// 🌟 서버에서 받아온 Enum 데이터를 options 상태에 저장
			setOptions({
				types: typeRes.data, // 예: [{value: 1, label: "스터디"}, ...]
				positions: posRes.data,
				stacks: stackRes.data,
			});
		} catch (error) {
			console.error("데이터 로드 실패:", error);
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
							// 🌟 수정된 RecruitCard에 options를 전달합니다.
							options={options}
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

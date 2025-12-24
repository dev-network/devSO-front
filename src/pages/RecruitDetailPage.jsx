import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
	getRecruitDetail,
	deleteRecruit,
	toggleStatus,
	toggleBookmark,
} from "../api";
import { useAuth } from "../contexts/AuthContext";
import { Icon } from "@iconify/react"; // ✅ Iconify 추가

import "react-quill-new/dist/quill.snow.css";

const LABEL_MAP = {
	type: {
		STUDY: "스터디",
		PROJECT: "프로젝트",
	},
	progressType: {
		ONLINE: "온라인",
		OFFLINE: "오프라인",
		HYBRID: "온/오프라인",
	},
	contactMethod: {
		OPEN_TALK: "오픈 톡",
		EMAIL: "이메일",
		GOOGLE_FORM: "구글 폼",
		OTHER: "기타",
	},
	totalCount: {
		1: "1명",
		2: "2명",
		3: "3명",
		4: "4명",
		5: "5명",
		6: "6명",
		7: "7명",
		8: "8명",
		9: "9명",
		10: "10명 이상",
	},
	duration: {
		ONE_MONTH: "1개월",
		TWO_MONTHS: "2개월",
		THREE_MONTHS: "3개월",
		FOUR_MONTHS: "4개월",
		FIVE_MONTHS: "5개월",
		SIX_MONTHS: "6개월",
		LONG_TERM: "장기",
	},
	positions: {
		0: "전체",
		1: "백엔드",
		2: "프론트엔드",
		3: "디자이너",
		4: "iOS",
		5: "안드로이드",
		6: "데브옵스",
		7: "PM",
		8: "기획자",
		9: "마케터",
	},
};

export default function RecruitDetailPage() {
	const { id } = useParams();
	const navigate = useNavigate();
	const { user } = useAuth();
	const [recruit, setRecruit] = useState(null);

	const fetchRecruit = async () => {
		try {
			const res = await getRecruitDetail(id);
			setRecruit(res.data.data);
		} catch (err) {
			console.error("데이터 로딩 실패", err);
		}
	};

	useEffect(() => {
		if (id) fetchRecruit();
	}, [id]);

	const handleBookmarkToggle = async () => {
		if (!user) {
			alert("로그인이 필요한 서비스입니다.");
			return;
		}
		try {
			await toggleBookmark(id);
			setRecruit((prev) => ({
				...prev,
				bookmarked: !prev.bookmarked,
				bookmarkCount: prev.bookmarked
					? prev.bookmarkCount - 1
					: prev.bookmarkCount + 1,
			}));
		} catch (err) {
			console.error("북마크 처리 실패", err);
		}
	};

	const handleDelete = async () => {
		if (window.confirm("정말 이 모집글을 삭제하시겠습니까?")) {
			try {
				await deleteRecruit(id);
				alert("삭제되었습니다.");
				navigate("/recruits", { replace: true });
			} catch (err) {
				alert("삭제에 실패했습니다.");
			}
		}
	};

	const handleToggleStatus = async () => {
		const isClosing = recruit.status === "OPEN";
		if (
			window.confirm(
				isClosing ? "모집을 마감하시겠습니까?" : "모집을 다시 시작하시겠습니까?"
			)
		) {
			try {
				await toggleStatus(id);
				alert("상태가 변경되었습니다.");
				fetchRecruit();
			} catch (err) {
				alert("상태 변경에 실패했습니다.");
			}
		}
	};

	if (!recruit)
		return (
			<div className="text-center py-20 text-gray-500 font-medium">
				데이터를 불러오는 중입니다...
			</div>
		);

	const isOwner = user && recruit.username === user.username;

	return (
		<div className="max-w-4xl mx-auto px-6 py-10 bg-white min-h-screen">
			{/* 목록으로 가기 버튼 */}
			<button
				onClick={() => navigate(-1)}
				className="mb-8 text-gray-400 hover:text-black transition flex items-center gap-1"
			>
				<Icon icon="mdi:arrow-left" width="20" height="20" />
				<span className="text-sm font-medium">목록으로</span>
			</button>

			<header className="mb-12">
				{/* 제목 섹션 */}
				<h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-8 flex items-center gap-3">
					{recruit.status === "CLOSED" && (
						<span className="bg-red-50 text-red-500 text-xs px-2 py-1 rounded font-bold uppercase shrink-0">
							마감
						</span>
					)}
					{recruit.title}
				</h1>

				{/* ✅ 프로필 영역 + 버튼 그룹 (작성자 정보 오른쪽에 배치) */}
				<div className="flex justify-between items-center pb-8 border-b border-gray-50">
					<div className="flex items-center gap-3">
						<div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center text-lg overflow-hidden border border-yellow-50">
							{recruit.userProfileImageUrl ? (
								<img
									src={recruit.userProfileImageUrl}
									alt="profile"
									className="w-full h-full object-cover"
								/>
							) : (
								"😊"
							)}
						</div>
						<div className="flex flex-col">
							<span className="font-bold text-sm text-gray-800">
								{recruit.username || "익명"}
							</span>
							<span className="text-xs text-gray-400">
								{new Date(recruit.createdAt).toLocaleDateString("ko-KR")}
							</span>
						</div>
					</div>

					{/* ✅ 버튼 그룹 (프로필 오른쪽 끝) */}
					{isOwner && (
						<div className="flex gap-2">
							<button
								onClick={() => navigate(`/recruits/${id}/edit`)}
								className="detail-action-btn"
							>
								수정
							</button>
							<button
								onClick={handleDelete}
								className="detail-action-btn hover:text-red-500"
							>
								삭제
							</button>
							<button
								onClick={handleToggleStatus}
								className="detail-action-btn text-blue-600 bg-blue-50 border-blue-100"
							>
								{recruit.status === "OPEN" ? "마감하기" : "마감취소"}
							</button>
						</div>
					)}
				</div>
			</header>

			{/* 2. 주요 정보 그리드 */}
			<section className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-16 pb-12 border-b border-gray-50">
				<InfoItem label="모집 구분" value={LABEL_MAP.type[recruit.type]} />
				<InfoItem
					label="진행 방식"
					value={LABEL_MAP.progressType[recruit.progressType]}
				/>
				<InfoItem
					label="모집 인원"
					value={LABEL_MAP.totalCount[recruit.totalCount]}
				/>
				<InfoItem label="시작 예정" value={recruit.deadLine} />
				<InfoItem
					label="연락 방법"
					value={LABEL_MAP.contactMethod[recruit.contactMethod]}
				/>
				<InfoItem
					label="예상 기간"
					value={LABEL_MAP.duration[recruit.duration]}
				/>
				<InfoItem
					label="모집 분야"
					value={recruit.positions?.map((p) => LABEL_MAP.positions[p])}
				/>
				<InfoItem label="사용 언어" value={recruit.stacks} isBadge />
			</section>

			{/* 3. 본문 */}
			<section className="py-12 border-b border-gray-50">
				<h2 className="text-xl font-bold mb-8 text-gray-900">프로젝트 소개</h2>
				<div className="ql-container ql-snow" style={{ border: "none" }}>
					<div
						className="ql-editor p-0! text-gray-700 leading-8 text-[17px]"
						dangerouslySetInnerHTML={{ __html: recruit.content }}
					/>
				</div>
			</section>

			{/* 4. 하단 액션 (북마크/지원) */}
			<footer className="py-8 flex justify-between items-center">
				<div className="flex items-center gap-6">
					<span className="text-gray-400 text-sm flex items-center gap-1">
						<Icon icon="mdi:eye-outline" width="18" height="18" />{" "}
						{recruit.viewCount || 0}
					</span>

					{/* ✅ 북마크 (요청하신 노란색 테마 적용) */}
					<button
						onClick={handleBookmarkToggle}
						className="flex items-center gap-1.5 transition-all active:scale-95"
					>
						<Icon
							icon={
								recruit.bookmarked ? "mdi:bookmark" : "mdi:bookmark-outline"
							}
							width="24"
							height="24"
							color={recruit.bookmarked ? "#fbbf24" : "#9ca3af"}
						/>
						<span
							className={`font-bold ${
								recruit.bookmarked ? "text-amber-500" : "text-gray-400"
							}`}
						>
							{recruit.bookmarkCount || 0}
						</span>
					</button>
				</div>

				{!isOwner && recruit.status === "OPEN" && (
					<button className="bg-black text-white px-14 py-4 rounded-full font-bold hover:bg-gray-800 transition shadow-xl active:scale-95">
						지원하기
					</button>
				)}
			</footer>

			{/* 5. 댓글 영역 */}
			<section className="mt-10 pb-20">
				<h3 className="font-bold mb-6 text-gray-900 text-lg border-t pt-10">
					댓글{" "}
					<span className="text-gray-400 ml-1">
						{recruit.commentCount || 0}
					</span>
				</h3>
				<div className="bg-gray-50 p-5 rounded-2xl flex items-center gap-4 border border-gray-100 shadow-sm">
					<div className="w-9 h-9 bg-white rounded-full flex items-center justify-center text-sm shadow-sm">
						{user ? "😊" : "👤"}
					</div>
					<input
						type="text"
						placeholder={
							user ? "댓글을 입력하세요..." : "로그인 후 이용 가능합니다."
						}
						disabled={!user}
						className="bg-transparent flex-1 focus:outline-none text-[15px]"
					/>
					<button
						disabled={!user}
						className="bg-gray-900 text-white px-6 py-2.5 rounded-xl text-sm font-bold disabled:bg-gray-200 transition"
					>
						등록
					</button>
				</div>
			</section>

			<style>{`
        .detail-action-btn {
          padding: 6px 14px;
          font-size: 13px;
          font-weight: 700;
          background-color: #f9fafb;
          border: 1px solid #e5e7eb;
          border-radius: 6px;
          color: #6b7280;
          transition: all 0.2s;
        }
        .detail-action-btn:hover {
          background-color: #ffffff;
          color: #111827;
          border-color: #d1d5db;
        }
      `}</style>
		</div>
	);
}

function InfoItem({ label, value, isBadge }) {
	const displayValue = Array.isArray(value)
		? value.filter(Boolean).join(", ")
		: value || "전체";
	return (
		<div className="flex items-start text-[15px]">
			<span className="w-24 text-gray-400 shrink-0 font-medium">{label}</span>
			<div className="flex flex-wrap gap-2">
				{isBadge && Array.isArray(value) ? (
					value.map((v) => (
						<span
							key={v}
							className="bg-gray-100 text-gray-600 px-2.5 py-1 rounded text-xs font-bold uppercase tracking-wide"
						>
							{v}
						</span>
					))
				) : (
					<span className="text-gray-800 font-semibold">{displayValue}</span>
				)}
			</div>
		</div>
	);
}

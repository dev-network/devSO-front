import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getRecruitDetail /*, deleteRecruit */ } from "../api";
import { useAuth } from "../contexts/AuthContext";

import "react-quill-new/dist/quill.snow.css";

// 1. 백엔드 Enum (Java) 데이터와 매핑되는 한글 라벨 객체
const LABEL_MAP = {
	type: { 1: "스터디", 2: "프로젝트" },
	progressType: { 1: "온라인", 2: "오프라인", 0: "온/오프라인" },
	contactMethod: { 1: "오픈 톡", 2: "이메일", 3: "구글 폼", 0: "기타" },
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
		1: "1개월",
		2: "2개월",
		3: "3개월",
		4: "4개월",
		5: "5개월",
		6: "6개월",
		0: "장기",
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

	useEffect(() => {
		fetchRecruit();
	}, [id]);

	const fetchRecruit = async () => {
		try {
			const res = await getRecruitDetail(id);
			setRecruit(res.data.data);
		} catch (err) {
			console.error("데이터 로딩 실패", err);
		}
	};

	if (!recruit)
		return (
			<div className="text-center py-20 text-gray-500">
				데이터를 불러오는 중입니다...
			</div>
		);

	const isOwner = user && recruit.username === user.username;

	return (
		<div className="max-w-4xl mx-auto px-6 py-10 bg-white">
			{/* 1. 상단 헤더 */}
			<header className="mb-12">
				<button
					onClick={() => navigate(-1)}
					className="mb-8 text-gray-400 hover:text-black transition"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						strokeWidth={2}
						stroke="currentColor"
						className="w-6 h-6"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M15.75 19.5L8.25 12l7.5-7.5"
						/>
					</svg>
				</button>

				<h1 className="text-3xl font-bold mb-6 tracking-tight text-gray-900">
					{recruit.title}
				</h1>

				<div className="flex items-center gap-3">
					<div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center text-lg overflow-hidden">
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
						<span className="font-bold text-sm">
							{recruit.username || "익명"}
						</span>
						<span className="text-xs text-gray-400">
							{new Date(recruit.createdAt).toLocaleDateString()}
						</span>
					</div>
				</div>
			</header>

			{/* 2. 주요 정보 그리드 - LABEL_MAP 적용 */}
			<section className="grid grid-cols-2 gap-y-5 gap-x-16 pb-12">
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
					isList
				/>
				<InfoItem label="사용 언어" value={recruit.stacks} isBadge />
			</section>

			{/* 3. 본문 */}
			<section className="pt-10 border-t border-gray-100">
				<h2 className="text-xl font-bold mb-8 text-gray-900">프로젝트 소개</h2>
				<div className="ql-container ql-snow" style={{ border: "none" }}>
					<div
						className="ql-editor p-0! text-gray-700 leading-8 text-[17px]"
						dangerouslySetInnerHTML={{ __html: recruit.content }}
					/>
				</div>
			</section>

			{/* 4. 액션 버튼 영역 */}
			<footer className="mt-20 pt-8 border-t border-gray-100 flex justify-between items-center">
				<div className="flex gap-6">
					{isOwner ? (
						<div className="flex gap-4">
							<span className="text-gray-300 text-sm italic">
								수정/삭제 기능 준비 중
							</span>
						</div>
					) : (
						<div className="flex items-center gap-4 text-gray-400 text-sm">
							<span>👁️ {recruit.viewCount || 0}</span>
							<span>🤍 0</span>
						</div>
					)}
				</div>

				{!isOwner && (
					<button className="bg-black text-white px-10 py-3 rounded-full font-bold hover:bg-gray-800 transition shadow-lg">
						지원하기
					</button>
				)}
			</footer>

			{/* 5. 댓글 입력창 */}
			<section className="mt-16 pb-20">
				<h3 className="font-bold mb-6 text-gray-900">
					댓글 <span className="text-gray-400 ml-1">0</span>
				</h3>
				<div className="bg-gray-50 p-4 rounded-xl flex items-center gap-3 border border-gray-100">
					<div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center text-sm">
						{user ? "😊" : "👤"}
					</div>
					<input
						type="text"
						placeholder={
							user ? "댓글을 입력하세요." : "로그인 후 이용 가능합니다."
						}
						disabled={!user}
						className="bg-transparent flex-1 focus:outline-none text-sm"
					/>
					<button
						disabled={!user}
						className="bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-bold disabled:bg-gray-300"
					>
						댓글 등록
					</button>
				</div>
			</section>
		</div>
	);
}

function InfoItem({ label, value, isBadge }) {
	// value가 배열이면 쉼표로 연결, 아니면 그대로 표시
	const displayValue = Array.isArray(value)
		? value.join(", ")
		: value || "전체";

	return (
		<div className="flex items-start text-[15px]">
			<span className="w-24 text-gray-400 shrink-0 font-medium">{label}</span>
			<div className="flex flex-wrap gap-2">
				{isBadge && Array.isArray(value) ? (
					value.map((v) => (
						<span
							key={v}
							className="bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded text-xs font-bold uppercase"
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

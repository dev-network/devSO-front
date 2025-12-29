import React from "react";
import { Icon } from "@iconify/react";

const RecruitCard = ({
	recruit = {},
	options = {}, // 🌟 부모로부터 전달받은 공통 Enum 옵션 객체
	onClick = () => {},
	onBookmarkClick = () => {},
}) => {
	const {
		type, // 이제 숫자로 들어옴 (예: 1)
		positions = [], // 이제 숫자 배열로 들어옴 (예: [1, 2])
		title = "",
		stacks = [], // 이제 숫자 배열로 들어옴 (예: [10, 11])
		username = "익명",
		viewCount = 0,
		status,
		deadLine,
		bookmarked = false,
	} = recruit;

	/**
	 * 1. 마감 여부 확인 로직 (추가됨)
	 */
	const today = new Date();
	today.setHours(0, 0, 0, 0); // 시간 제외 날짜만 비교
	const targetDate = new Date(deadLine);
	targetDate.setHours(0, 0, 0, 0);

	// 마감일이 오늘보다 이전이면 마감된 것으로 처리
	const isExpired = deadLine && targetDate < today;

	/**
	 * 헬퍼 함수: Enum 리스트에서 value와 일치하는 label을 찾아 반환
	 */
	const getLabel = (optionList, value) => {
		if (!optionList || optionList.length === 0) return value;
		const found = optionList.find((o) => String(o.value) === String(value));
		return found ? found.label : value;
	};

	// 날짜 포맷팅
	const formattedDeadline = deadLine
		? new Date(deadLine).toLocaleDateString("ko-KR")
		: "미정";

	// CSS 클래스용 (1: 스터디, 2: 프로젝트 가정)
	const typeClass = String(type) === "1" ? "study" : "project";

	/**
	 * 2. 클릭 핸들러 (수정됨)
	 */
	const handleCardClick = () => {
		if (isExpired) {
			alert("마감된 모집글입니다.");
			return;
		}
		onClick();
	};

	return (
		<div
			className={`recruit-card ${isExpired ? "expired" : ""}`}
			onClick={handleCardClick}
			style={{
				cursor: isExpired ? "not-allowed" : "pointer",
				position: "relative", // 마감 문구 배치를 위해 필요
			}}
		>
			{/* 3. 마감된 경우 나타나는 오버레이 (추가됨) */}
			{isExpired && (
				<div
					style={{
						position: "absolute",
						top: 0,
						left: 0,
						right: 0,
						bottom: 0,
						backgroundColor: "rgba(255, 255, 255, 0.7)",
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						zIndex: 5,
						borderRadius: "8px",
					}}
				>
					<span
						style={{
							background: "gray",
							color: "#fff",
							padding: "5px 10px",
							borderRadius: "4px",
							fontWeight: "bold",
							fontSize: "0.9rem",
						}}
					>
						모집 마감
					</span>
				</div>
			)}

			<div className="card-top-tags">
				{type !== undefined && (
					<span className={`category-tag category-${typeClass}`}>
						{getLabel(options.types, type)}
					</span>
				)}
				{/* 모집 중 상태이고 마감이 아닐 때만 '모집 중' 표시 */}
				{(status === "OPEN" || status === 1) && !isExpired && (
					<span className="category-tag category-new">🔥 모집 중</span>
				)}
			</div>

			<div className="deadline">마감일 | {formattedDeadline}</div>
			<h3 className="card-title">{title}</h3>

			<div className="tags">
				{positions.length > 0 && (
					<div
						className="positions"
						style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}
					>
						{positions.map((pos, idx) => (
							<span key={`pos-${idx}`} className="tag position-tag">
								{getLabel(options.positions, pos)}
							</span>
						))}
					</div>
				)}

				{stacks.length > 0 && (
					<div
						className="stacks"
						style={{
							display: "flex",
							flexWrap: "wrap",
							gap: "0.5rem",
							marginTop: "0.5rem",
						}}
					>
						{stacks.map((stack, idx) => (
							<span key={`stack-${idx}`} className="tag">
								{getLabel(options.stacks, stack)}
							</span>
						))}
					</div>
				)}
			</div>

			<hr />

			<div
				className="card-footer"
				style={{
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
				}}
			>
				<div className="author">
					<span className="author-icon">🐑</span>
					{username}
				</div>
				<div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
					<span className="views">👁️ {viewCount}</span>
					<button
						type="button"
						onClick={(e) => {
							e.stopPropagation();
							onBookmarkClick();
						}}
						style={{
							background: "none",
							border: "none",
							cursor: "pointer",
							display: "flex",
							alignItems: "center",
						}}
					>
						<Icon
							icon={bookmarked ? "mdi:bookmark" : "mdi:bookmark-outline"}
							width="20"
							height="20"
							color={bookmarked ? "#fbbf24" : "#9ca3af"}
						/>
					</button>
				</div>
			</div>
		</div>
	);
};

export default RecruitCard;

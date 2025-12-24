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
	 * 헬퍼 함수: Enum 리스트에서 value와 일치하는 label을 찾아 반환
	 */
	const getLabel = (optionList, value) => {
		if (!optionList || optionList.length === 0) return value;
		// 서버 숫자가 문자열로 올 수도 있으므로 유연하게 비교
		const found = optionList.find((o) => String(o.value) === String(value));
		return found ? found.label : value;
	};

	// 날짜 포맷팅
	const formattedDeadline = deadLine
		? new Date(deadLine).toLocaleDateString("ko-KR")
		: "미정";

	// CSS 클래스용 (1: 스터디, 2: 프로젝트 가정)
	const typeClass = String(type) === "1" ? "study" : "project";

	return (
		<div
			className="recruit-card"
			onClick={onClick}
			style={{ cursor: "pointer" }}
		>
			<div className="card-top-tags">
				{type !== undefined && (
					<span className={`category-tag category-${typeClass}`}>
						{/* 🌟 서버 API 기반 라벨 매핑 */}
						{getLabel(options.types, type)}
					</span>
				)}
				{/* 모집 상태가 OPEN(1)인 경우 */}
				{(status === "OPEN" || status === 1) && (
					<span className="category-tag category-new">🔥 모집 중</span>
				)}
			</div>

			<div className="deadline">마감일 | {formattedDeadline}</div>
			<h3 className="card-title">{title}</h3>

			<div className="tags">
				{/* 🌟 포지션 매핑: 숫자 배열 -> 라벨들 */}
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

				{/* 🌟 기술 스택 매핑: 숫자 배열 -> 라벨들 */}
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

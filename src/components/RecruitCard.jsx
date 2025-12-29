import React from "react";
import { Icon } from "@iconify/react";

const RecruitCard = ({
	recruit = {},
	options = {},
	onClick = () => {},
	onBookmarkClick = () => {},
}) => {
	const {
		type,
		positions = [],
		title = "",
		// 🌟 이제 stacks는 숫자 배열이 아니라 객체 배열입니다.
		stacks = [],
		username = "익명",
		viewCount = 0,
		status,
		deadLine,
		bookmarked = false,
	} = recruit;

	const today = new Date();
	today.setHours(0, 0, 0, 0);
	const targetDate = new Date(deadLine);
	targetDate.setHours(0, 0, 0, 0);

	const isExpired = deadLine && targetDate < today;

	/**
	 * 헬퍼 함수: Enum 리스트에서 value와 일치하는 label을 찾아 반환
	 * (type이나 positions는 아직 숫자일 수 있으므로 유지합니다)
	 */
	const getLabel = (optionList, value) => {
		if (!optionList || optionList.length === 0) return value;
		const found = optionList.find((o) => String(o.value) === String(value));
		return found ? found.label : value;
	};

	const formattedDeadline = deadLine
		? new Date(deadLine).toLocaleDateString("ko-KR")
		: "미정";

	const typeClass = String(type) === "1" ? "study" : "project";

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
				position: "relative",
			}}
		>
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
						style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}
					>
						{positions.map((pos, idx) => (
							<span key={`pos-${idx}`} className="tag position-tag">
								{getLabel(options.positions, pos)}
							</span>
						))}
					</div>
				)}

				{/* 🌟 스택 렌더링 부분 수정 */}
				{stacks.length > 0 && (
					<div
						className="stacks"
						style={{
							display: "flex",
							flexWrap: "wrap",
							gap: "0.5rem",
							marginTop: "0.8rem",
						}}
					>
						{stacks.map((stack, idx) => (
							<div
								key={`stack-${idx}`}
								className="stack-badge-item"
								style={{ display: "flex", alignItems: "center", gap: "4px" }}
							>
								{/* 🌟 백엔드에서 온 imageUrl이 있으면 아이콘 표시 */}
								{stack.imageUrl && (
									<img
										src={stack.imageUrl}
										alt={stack.label}
										style={{
											width: "16px",
											height: "16px",
											objectFit: "contain",
										}}
									/>
								)}
								{/* 🌟 stack 자체가 객체이므로 stack.label을 직접 출력 (에러 해결 핵심!) */}
								{/* <span className="tag">{stack.label}</span> */}
							</div>
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

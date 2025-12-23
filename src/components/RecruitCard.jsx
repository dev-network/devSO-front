import React from "react";
import { Icon } from "@iconify/react";
import bookmarkOutline from "@iconify/icons-mdi/bookmark-outline";
import bookmarkFilled from "@iconify/icons-mdi/bookmark";

const RecruitCard = ({
	recruit = {},
	onClick = () => {},
	onBookmarkClick = () => {},
}) => {
	const {
		type,
		positions = [],
		title = "",
		content = "",
		stacks = [],
		username = "익명",
		viewCount = 0,
		status,
		deadLine,
		bookmarked = false,
	} = recruit;

	// ---------------------------
	// 서버에서 오는 type/position/stacks 처리
	// ---------------------------
	const typeKey =
		type !== undefined && type !== null
			? typeof type === "string"
				? type
				: type.label !== undefined
				? String(type.label)
				: String(type)
			: "";

	const positionKey =
		Array.isArray(positions) && positions.length > 0
			? positions.map((p) =>
					p !== undefined && p !== null
						? typeof p === "string"
							? p
							: p.label !== undefined
							? String(p.label)
							: String(p)
						: ""
			  )
			: [];

	const typeLabel = { 1: "📚 스터디", 2: "📁 프로젝트" };
	const positionLabel = {
		0: "전체",
		1: "프론트엔드",
		2: "백엔드",
		3: "디자이너",
		4: "iOS",
		5: "안드로이드",
		6: "데브옵스",
		7: "PM",
		8: "기획자",
		9: "마케터",
	};

	const formattedDeadline = deadLine
		? new Date(deadLine).toLocaleDateString("ko-KR")
		: "미정";

	const typeClass = typeKey.toLowerCase();

	return (
		<div
			className="recruit-card"
			onClick={onClick}
			style={{ cursor: "pointer" }}
		>
			<div className="card-top-tags">
				{typeKey && (
					<span className={`category-tag category-${typeClass}`}>
						{typeLabel[typeKey] || typeKey}
					</span>
				)}
				{status && String(status).toUpperCase() === "OPEN" && (
					<span className="category-tag category-new">🔥 모집 중</span>
				)}
			</div>

			<div className="deadline">마감일 | {formattedDeadline}</div>

			<h3 className="card-title">{title}</h3>

			{/* Tags Section */}
			<div className="tags">
				{/* Positions */}
				{positionKey.length > 0 && (
					<div
						className="positions"
						style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}
					>
						{positionKey.map((pos, idx) => (
							<span key={`pos-${idx}`} className="tag position-tag">
								{positionLabel[pos] || pos}
							</span>
						))}
					</div>
				)}

				{/* Stacks */}
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
								{typeof stack === "string" ? stack : stack?.label || stack}
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
						style={{ background: "none", border: "none", cursor: "pointer" }}
					>
						<Icon
							icon={bookmarked ? bookmarkFilled : bookmarkOutline}
							width="20"
							height="20"
						/>
					</button>
				</div>
			</div>
		</div>
	);
};

export default RecruitCard;

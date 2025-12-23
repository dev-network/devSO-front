import React from "react";
import { Icon } from "@iconify/react";
import bookmarkOutline from "@iconify/icons-mdi/bookmark-outline";
import bookmarkFilled from "@iconify/icons-mdi/bookmark";

const RecruitCard = ({ recruit, onClick, onBookmarkClick }) => {
	const {
		type,
		position,
		title,
		content,
		stacks = [],
		username,
		viewCount,
		status,
		deadLine,
		bookmarked,
	} = recruit;

	const typeLabel = { PROJECT: "📁 프로젝트", STUDY: "📚 스터디" };
	const positionLabel = {
		FRONTEND: "프론트엔드",
		BACKEND: "백엔드",
		FULLSTACK: "풀스택",
	};
	const formattedDeadline = deadLine
		? new Date(deadLine).toLocaleDateString("ko-KR")
		: "미정";

	return (
		<div className="recruit-card" onClick={onClick}>
			<div className="card-top-tags">
				<span className={`category-tag category-${type?.toLowerCase()}`}>
					{typeLabel[type] || type}
				</span>
				<span className="position-tag">
					{positionLabel[position] || position}
				</span>
				{status === "OPEN" && (
					<span className="category-tag category-new">🔥 모집 중</span>
				)}
			</div>

			<div className="deadline">마감일 | {formattedDeadline}</div>

			<h3 className="card-title">{title}</h3>
			<p className="card-desc">{content?.slice(0, 100)}...</p>

			<div className="tags">
				{stacks.map((stack, idx) => (
					<span key={idx} className="tag">
						{stack}
					</span>
				))}
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
					{username || "익명"}
				</div>
				<div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
					<span className="views">👁️ {viewCount}</span>
					<button
						type="button"
						onClick={(e) => {
							e.stopPropagation(); // 카드 클릭 이벤트 막기
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

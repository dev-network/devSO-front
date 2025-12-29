import React, { useState, useRef, useEffect } from "react";
import "../styles/RecruitFilterBar.css";

const RecruitFilterBar = ({ options, filter, setFilter }) => {
	const { types = [], positions = [], stacks = [] } = options;
	const [isStackOpen, setIsStackOpen] = useState(false);
	const [activeCategory, setActiveCategory] = useState("ALL");
	const dropdownRef = useRef(null);

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
				setIsStackOpen(false);
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	const handleFilterChange = (key, value) => {
		setFilter((prev) => ({ ...prev, [key]: value }));
	};

	const handleStackToggle = (stackValue) => {
		const currentStacks = [...filter.stacks];
		const newStacks = currentStacks.includes(stackValue)
			? currentStacks.filter((s) => s !== stackValue)
			: [...currentStacks, stackValue];
		handleFilterChange("stacks", newStacks);
	};

	const getLabel = (item) =>
		item && typeof item === "object" ? item.label : item;
	const getValue = (item) =>
		item && typeof item === "object" ? item.value : item;

	return (
		<div className="filter-container">
			{/* 1. 상단 타입 탭 (Hola 스타일: 볼드한 텍스트와 언더라인) */}
			<div className="type-tabs">
				<button
					className={!filter.type ? "active" : ""}
					onClick={() => handleFilterChange("type", null)}
				>
					전체
				</button>
				{types.map((t) => (
					<button
						key={getValue(t)}
						className={filter.type === getValue(t) ? "active" : ""}
						onClick={() => handleFilterChange("type", getValue(t))}
					>
						{getLabel(t)}
					</button>
				))}
			</div>

			<div className="filter-controls">
				{/* 2. 기술 스택 드롭다운 */}
				<div className="dropdown-wrapper" ref={dropdownRef}>
					<button
						className={`dropdown-btn ${
							filter.stacks.length > 0 ? "selected" : ""
						}`}
						onClick={() => setIsStackOpen(!isStackOpen)}
					>
						기술 스택
						{filter.stacks.length > 0 && (
							<span className="count-badge">{filter.stacks.length}</span>
						)}
						<span className={`arrow-icon ${isStackOpen ? "open" : ""}`}>▼</span>
					</button>

					{isStackOpen && (
						<div className="stack-dropdown-panel">
							<div className="stack-category-tabs">
								{[
									"인기",
									"프론트엔드",
									"백엔드",
									"모바일",
									"기타",
									"모두보기",
								].map((cat) => (
									<button
										key={cat}
										className={activeCategory === cat ? "active" : ""}
										onClick={() => setActiveCategory(cat)}
									>
										{cat}
									</button>
								))}
							</div>
							<div className="stack-list">
								{stacks.map((s) => (
									<button
										key={getValue(s)}
										className={`stack-item ${
											filter.stacks.includes(getValue(s)) ? "active" : ""
										}`}
										onClick={() => handleStackToggle(getValue(s))}
									>
										{/* 임시 아이콘 (나중에 s.imageUrl 등으로 대체) */}
										<div className="stack-dot" />
										<span>{getLabel(s)}</span>
									</button>
								))}
							</div>
						</div>
					)}
				</div>

				{/* 3. 포지션 드롭다운 */}
				<div className="select-wrapper">
					<select
						className="select-filter"
						value={filter.position || ""}
						onChange={(e) =>
							handleFilterChange("position", e.target.value || null)
						}
					>
						<option value="">포지션 전체</option>
						{positions.map((p) => (
							<option key={getValue(p)} value={getValue(p)}>
								{getLabel(p)}
							</option>
						))}
					</select>
				</div>

				{/* 4. 내 북마크 / 모집중만 보기 (이미지 스타일 반영) */}
				<div className="toggle-group">
					<button
						className={`toggle-chip ${filter.onlyBookmarked ? "active" : ""}`}
						onClick={() =>
							handleFilterChange("onlyBookmarked", !filter.onlyBookmarked)
						}
					>
						<span className="emoji">👏</span> 내 북마크 보기
					</button>
					<button
						className={`toggle-chip ${filter.onlyOpen ? "active" : ""}`}
						onClick={() => handleFilterChange("onlyOpen", !filter.onlyOpen)}
					>
						<span className="emoji">👀</span> 모집 중만 보기
					</button>
				</div>

				{/* 5. 검색창 */}
				<div className="search-bar">
					<span className="search-icon">🔍</span>
					<input
						type="text"
						placeholder="제목, 글 내용을 검색해보세요."
						value={filter.search}
						onChange={(e) => handleFilterChange("search", e.target.value)}
					/>
				</div>
			</div>
		</div>
	);
};

export default RecruitFilterBar;

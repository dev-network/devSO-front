import React, { useState, useRef, useEffect } from "react";
import "../styles/RecruitFilterBar.css";

const RecruitFilterBar = ({ options, filter, setFilter, resetFilters }) => {
	const {
		types = [],
		positions = [],
		stacks = [],
		progressTypes = [],
	} = options;
	const [isStackOpen, setIsStackOpen] = useState(false);
	const [activeCategory, setActiveCategory] = useState("모두보기");
	const dropdownRef = useRef(null);

	console.log(progressTypes);

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

	/**
	 * 스택 토글 로직
	 * filter.stacks에 숫자(value) 배열로 저장한다고 가정합니다.
	 */
	const handleStackToggle = (stackValue) => {
		const currentStacks = [...(filter.stacks || [])];
		const isSelected = currentStacks.some(
			(s) => String(s) === String(stackValue)
		);

		const newStacks = isSelected
			? currentStacks.filter((s) => String(s) !== String(stackValue))
			: [...currentStacks, stackValue];

		handleFilterChange("stacks", newStacks);
	};

	// 객체인지 숫자인지 판별하여 값 추출
	const getLabel = (item) =>
		item && typeof item === "object" ? item.label : item;
	const getValue = (item) =>
		item && typeof item === "object" ? item.value : item;

	/**
	 * 🌟 카테고리 필터링 로직 수정
	 */
	const filteredStacks = stacks.filter((s) => {
		if (activeCategory === "모두보기") return true;

		const categoryMap = {
			프론트엔드: "FE",
			백엔드: "BE",
			모바일: "MOBILE",
			기타: "ETC",
		};

		const targetCategory = categoryMap[activeCategory];
		// 백엔드에서 s.category가 "FE" 등으로 오는지 확인하세요.
		return s.category === targetCategory;
	});

	return (
		<div className="filter-container">
			{/* 1. 상단 타입 탭 */}
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
						className={
							String(filter.type) === String(getValue(t)) ? "active" : ""
						}
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
							filter.stacks?.length > 0 ? "selected" : ""
						}`}
						onClick={() => setIsStackOpen(!isStackOpen)}
					>
						기술 스택
						{filter.stacks?.length > 0 && (
							<span className="count-badge">{filter.stacks.length}</span>
						)}
						<span className={`arrow-icon ${isStackOpen ? "open" : ""}`}>▼</span>
					</button>

					{isStackOpen && (
						<div className="stack-dropdown-panel">
							<div className="stack-category-tabs">
								{["모두보기", "프론트엔드", "백엔드", "모바일", "기타"].map(
									(cat) => (
										<button
											key={cat}
											className={activeCategory === cat ? "active" : ""}
											onClick={() => setActiveCategory(cat)}
										>
											{cat}
										</button>
									)
								)}
							</div>
							<div className="stack-list">
								{filteredStacks.length > 0 ? (
									filteredStacks.map((s) => {
										const val = getValue(s);
										const isSelected = filter.stacks?.some(
											(selectedVal) => String(selectedVal) === String(val)
										);

										return (
											<button
												key={val}
												className={`stack-item ${isSelected ? "active" : ""}`}
												onClick={() => handleStackToggle(val)}
											>
												{/* 🌟 이미지 출력부 확인: s.imageUrl이 존재해야 함 */}
												{s.imageUrl ? (
													<img
														src={s.imageUrl}
														alt={getLabel(s)}
														className="stack-icon-img"
														style={{
															width: "20px",
															height: "20px",
															objectFit: "contain",
														}}
													/>
												) : (
													<div className="stack-dot" />
												)}
												<span>{getLabel(s)}</span>
											</button>
										);
									})
								) : (
									<div
										className="no-stack-message"
										style={{
											padding: "20px",
											color: "#999",
											width: "100%",
											textAlign: "center",
										}}
									>
										등록된 스택이 없습니다.
									</div>
								)}
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

				{/* 4. 진행 방식 드롭다운  */}
				<div className="select-wrapper">
					<select
						className="select-filter"
						value={
							filter.progressType === null || filter.progressType === undefined
								? ""
								: filter.progressType
						}
						onChange={(e) => {
							const val = e.target.value;
							handleFilterChange(
								"progressType",
								val === "" ? null : Number(val)
							);
						}}
					>
						<option value="">진행 방식 전체</option>
						{progressTypes.map((pt) => (
							<option key={getValue(pt)} value={getValue(pt)}>
								{getLabel(pt)}
							</option>
						))}
					</select>
				</div>

				{/* 5. 내 북마크 / 모집중만 보기 */}
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

				{resetFilters && (
					<button className="reset-btn" onClick={resetFilters}>
						<span className="reset-icon">🔄</span> 초기화
					</button>
				)}

				{/* 6. 검색창 */}
				<div className="search-bar">
					<span className="search-icon">🔍</span>
					<input
						type="text"
						placeholder="제목, 글 내용을 검색해보세요."
						value={filter.search || ""}
						onChange={(e) => handleFilterChange("search", e.target.value)}
					/>
				</div>
			</div>
		</div>
	);
};

export default RecruitFilterBar;

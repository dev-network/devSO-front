export default function RecruitFilter({ filter, setFilter }) {
	return (
		<div className="flex gap-4 mb-4">
			{/* 포지션 드롭다운 */}
			<select
				value={filter.position}
				onChange={(e) => setFilter({ ...filter, position: e.target.value })}
			>
				<option value="">전체 포지션</option>
				<option value="FRONTEND">프론트엔드</option>
				<option value="BACKEND">백엔드</option>
				<option value="FULLSTACK">풀스택</option>
			</select>

			{/* 진행 방식 드롭다운 */}
			<select
				value={filter.progressType}
				onChange={(e) => setFilter({ ...filter, progressType: e.target.value })}
			>
				<option value="">전체 진행</option>
				<option value="ONLINE">온라인</option>
				<option value="OFFLINE">오프라인</option>
				<option value="HYBRID">혼합</option>
			</select>

			{/* 모집 중 체크박스 */}
			<label>
				<input
					type="checkbox"
					checked={filter.onlyOpen}
					onChange={(e) => setFilter({ ...filter, onlyOpen: e.target.checked })}
				/>
				모집 중만 보기
			</label>

			{/* 북마크 체크박스 */}
			<label>
				<input
					type="checkbox"
					checked={filter.onlyBookmarked}
					onChange={(e) =>
						setFilter({ ...filter, onlyBookmarked: e.target.checked })
					}
				/>
				관심목록만 보기
			</label>
		</div>
	);
}

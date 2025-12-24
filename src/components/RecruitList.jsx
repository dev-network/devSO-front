// 모집글 목록
export default function RecruitList({ recruits, refreshList }) {
	console.log("RecruitList props:", recruits);

	if (!recruits || recruits.length === 0) {
		return <p className="text-gray-500">모집글이 없습니다.</p>;
	}

	return (
		<div className="grid gap-4">
			{recruits.map((recruit) => (
				<div
					key={recruit.id}
					className="border p-4 rounded cursor-pointer hover:bg-gray-100"
					onClick={() => (window.location.href = `/recruits/${recruit.id}`)} // 간단하게 상세 페이지 이동
				>
					<h2 className="font-bold">{recruit.title || "제목 없음"}</h2>
					<p>{recruit.content?.slice(0, 50) || "내용 없음"}...</p>
				</div>
			))}
		</div>
	);
}

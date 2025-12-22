// 모집글 상세
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getRecruitDetail } from "../api";

export default function RecruitDetailPage() {
	const { id } = useParams();
	const [recruit, setRecruit] = useState(null);

	useEffect(() => {
		fetchRecruit();
	}, [id]);

	const fetchRecruit = async () => {
		const res = await getRecruitDetail(id);
		setRecruit(res.data);
	};

	if (!recruit) return <div>로딩 중...</div>;

	return (
		<div className="p-4">
			<h1 className="text-2xl font-bold">{recruit.title}</h1>
			<p>{recruit.content}</p>
			<p>
				모집 {recruit.currentCount}/{recruit.totalCount}
			</p>
			<p>
				포지션: {recruit.position} | 진행: {recruit.progressType}
			</p>
			<div className="flex gap-2 mt-2">
				{recruit.stacks.map((s) => (
					<span key={s} className="bg-gray-200 px-2 rounded">
						{s}
					</span>
				))}
			</div>
			{/* 댓글, 북마크 컴포넌트 추가 예정 */}
		</div>
	);
}

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getRecruitDetail } from "../api";

export default function RecruitDetailPage() {
	const { id } = useParams();
	const navigate = useNavigate();
	const [recruit, setRecruit] = useState(null);

	useEffect(() => {
		// StrictMode로 개발 환경에서 viewCount 2씩 증가
		// 배포 후 정상작동 된다고 함
		// console.log("useEffect 실행!", id);
		fetchRecruit();
	}, [id]);

	const fetchRecruit = async () => {
		const res = await getRecruitDetail(id);
		setRecruit(res.data.data);
	};

	if (!recruit) return <div>로딩 중...</div>;

	const isOwner = recruit.username === "현재 로그인 유저"; // AuthContext 활용 가능

	return (
		<div className="p-4 max-w-2xl mx-auto">
			<h1 className="text-2xl font-bold">{recruit.title}</h1>
			<p>{recruit.content}</p>
			<p>
				모집 {recruit.currentCount}/{recruit.totalCount}
			</p>
			<p>
				포지션: {recruit.position} | 진행: {recruit.progressType}
			</p>
			<p>마감: {recruit.deadLine}</p>
			<div className="flex gap-2 mt-2">
				{recruit.stacks.map((s) => (
					<span key={s} className="bg-gray-200 px-2 rounded">
						{s}
					</span>
				))}
			</div>

			{isOwner && (
				<div className="mt-4 flex gap-2">
					<button
						onClick={() => navigate(`/recruits/${id}/edit`)}
						className="bg-yellow-400 px-4 py-2 rounded"
					>
						수정
					</button>
					<button className="bg-red-500 px-4 py-2 rounded text-white">
						삭제
					</button>
				</div>
			)}

			{/* 댓글 컴포넌트 자리 */}
		</div>
	);
}

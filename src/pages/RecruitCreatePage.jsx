import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createRecruit } from "../api";

export default function RecruitCreatePage() {
	const navigate = useNavigate();
	const [title, setTitle] = useState("");
	const [content, setContent] = useState("");

	const handleSubmit = async (e) => {
		e.preventDefault();
		await createRecruit({ title, content });
		navigate("/recruits"); // 작성 후 목록 페이지로 이동
	};

	return (
		<div className="max-w-2xl mx-auto p-6">
			<h1 className="text-2xl font-bold mb-6">모집글 작성</h1>
			<form onSubmit={handleSubmit} className="space-y-4">
				<input
					type="text"
					placeholder="제목"
					value={title}
					onChange={(e) => setTitle(e.target.value)}
					className="border p-2 w-full rounded"
					required
				/>
				<textarea
					placeholder="내용"
					value={content}
					onChange={(e) => setContent(e.target.value)}
					className="border p-2 w-full rounded h-40"
					required
				/>
				<button
					type="submit"
					className="bg-blue-500 text-white px-4 py-2 rounded w-full"
				>
					등록
				</button>
			</form>
		</div>
	);
}

import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import ReactQuill, { Quill } from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

import {
	createRecruit,
	getPositions,
	getTypes,
	getProgress,
	getTechStacks,
	getContactTypes,
	getDurationTypes,
	getMemberCount,
} from "../api";

// -------------------
// Quill 포맷 등록 (중복 등록 방지)
// -------------------
const List = Quill.import("formats/list");
Quill.register(List, true);

export default function RecruitCreatePage() {
	const navigate = useNavigate();

	// ---------------------------
	// 폼 상태
	// ---------------------------
	const [title, setTitle] = useState("");
	const [content, setContent] = useState("");
	const [type, setType] = useState(null);
	const [position, setPosition] = useState([]);
	const [progressType, setProgressType] = useState(null);
	const [duration, setDuration] = useState(null);
	const [stacks, setStacks] = useState([]);
	const [totalCount, setTotalCount] = useState(null);
	const [deadLine, setDeadLine] = useState("");
	const [contactMethod, setContactMethod] = useState(null);
	const [contactInfo, setContactInfo] = useState("");

	// ---------------------------
	// enum 옵션 상태
	// ---------------------------
	const [typesOptions, setTypesOptions] = useState([]);
	const [positionsOptions, setPositionsOptions] = useState([]);
	const [progressOptions, setProgressOptions] = useState([]);
	const [stacksOptions, setStacksOptions] = useState([]);
	const [contactMethodsOptions, setContactMethodsOptions] = useState([]);
	const [durationOptions, setDurationOptions] = useState([]);
	const [memberCountOptions, setMemberCountOptions] = useState([]);

	// ---------------------------
	// 스타일 및 설정 (useMemo로 최적화)
	// ---------------------------
	const selectStyles = useMemo(
		() => ({
			control: (provided) => ({
				...provided,
				border: "1px solid #ccc",
				borderRadius: "0.375rem",
				padding: "0.2rem",
			}),
			multiValue: (provided) => ({
				...provided,
				backgroundColor: "#e0e7ff",
				color: "#1e3a8a",
			}),
			multiValueLabel: (provided) => ({
				...provided,
				color: "#1e3a8a",
				fontWeight: "500",
			}),
			multiValueRemove: (provided) => ({
				...provided,
				color: "#1e3a8a",
				":hover": { backgroundColor: "#c7d2fe", color: "#1e3a8a" },
			}),
		}),
		[]
	);

	const quillModules = useMemo(
		() => ({
			toolbar: [
				[{ header: [1, 2, 3, false] }],
				["bold", "italic", "underline", "strike"],
				[{ list: "ordered" }, { list: "bullet" }],
				[{ align: [] }],
				[{ color: [] }, { background: [] }],
				["link", "image"],
				["clean"],
			],
		}),
		[]
	);

	const quillFormats = [
		"header",
		"bold",
		"italic",
		"underline",
		"strike",
		"list",
		"align",
		"color",
		"background",
		"link",
		"image",
	];

	// ---------------------------
	// 데이터 불러오기
	// ---------------------------
	useEffect(() => {
		const fetchEnums = async () => {
			try {
				const [
					typesRes,
					positionsRes,
					progressRes,
					stacksRes,
					contactRes,
					durationRes,
					memberRes,
				] = await Promise.all([
					getTypes(),
					getPositions(),
					getProgress(),
					getTechStacks(),
					getContactTypes(),
					getDurationTypes(),
					getMemberCount(),
				]);

				setTypesOptions(
					typesRes.data.map((t) => ({ value: t.value, label: t.label }))
				);
				setPositionsOptions(
					positionsRes.data.map((p) => ({ value: p.value, label: p.label }))
				);
				setProgressOptions(
					progressRes.data.map((p) => ({ value: p.value, label: p.label }))
				);
				setStacksOptions(
					stacksRes.data.map((s) => ({ value: s.value, label: s.label }))
				);
				setContactMethodsOptions(
					contactRes.data.map((c) => ({ value: c.value, label: c.label }))
				);
				setDurationOptions(
					durationRes.data.map((d) => ({ value: d.value, label: d.label }))
				);
				setMemberCountOptions(
					memberRes.data.map((m) => ({ value: m.value, label: m.label }))
				);
			} catch (err) {
				console.error("옵션 데이터를 가져오는데 실패했습니다:", err);
			}
		};
		fetchEnums();
	}, []);

	// ---------------------------
	// 제출 로직 (디버깅 보강 버전)
	// ---------------------------
	const handleSubmit = async (e) => {
		e.preventDefault();

		// Quill 에디터 빈 값 체크
		const isContentEmpty =
			content.replace(/<(.|\n)*?>/g, "").trim().length === 0;
		if (isContentEmpty) {
			alert("내용을 입력해주세요.");
			return;
		}

		const payload = {
			title,
			content,
			type: type?.value ?? null,
			positions: position.map((p) => p.value),
			progressType: progressType?.value ?? null,
			duration: duration?.value ?? null,
			stacks: stacks.map((s) => s.value),
			totalCount: totalCount ? Number(totalCount.value) : 0,
			deadLine, // "YYYY-MM-DD" 형식
			contactMethod: contactMethod?.value ?? null,
			contactInfo,
			imageUrl: "",
		};

		console.log("서버로 전송하는 데이터:", payload);

		try {
			const res = await createRecruit(payload);
			navigate(`/recruits/${res.data.data.id}`);
		} catch (err) {
			console.error("발생한 에러 상세:", err);

			if (err.response) {
				// 서버가 응답을 줬을 때 (400, 500 등)
				const serverError = err.response.data;
				console.error("서버 응답 에러 내용:", serverError);

				// 에러 메시지가 구체적이라면 그 내용을, 없다면 객체 전체를 문자로 보여줌
				const errorMsg = serverError.message || JSON.stringify(serverError);
				alert(`작성 실패 (서버 에러): ${errorMsg}`);
			} else {
				// 아예 서버에 닿지 못했거나 네트워크 에러
				alert(`작성 실패: ${err.message}`);
			}
		}
	};

	const today = new Date().toISOString().split("T")[0];

	return (
		<div className="max-w-4xl mx-auto p-8">
			<h1 className="text-3xl font-bold mb-8">팀원 모집글 작성</h1>
			<form onSubmit={handleSubmit} className="space-y-10">
				{/* 1. 기본 정보 섹션 */}
				<section className="space-y-4">
					<h2 className="font-bold text-lg flex items-center gap-2">
						<span className="text-white bg-yellow-400 w-6 h-6 flex justify-center items-center rounded-full text-sm">
							1
						</span>
						프로젝트 기본 정보를 입력해주세요.
					</h2>
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
						<div>
							<label className="block mb-1 font-semibold">모집 구분</label>
							<Select
								options={typesOptions}
								value={type}
								onChange={setType}
								placeholder="선택"
								required
							/>
						</div>
						<div>
							<label className="block mb-1 font-semibold">모집 인원</label>
							<Select
								options={memberCountOptions}
								value={totalCount}
								onChange={setTotalCount}
								placeholder="인원 선택"
								required
							/>
						</div>
						<div>
							<label className="block mb-1 font-semibold">진행 방식</label>
							<Select
								options={progressOptions}
								value={progressType}
								onChange={setProgressType}
								placeholder="선택"
								required
							/>
						</div>
						<div>
							<label className="block mb-1 font-semibold">모집 마감일</label>
							<input
								type="date"
								value={deadLine}
								onChange={(e) => setDeadLine(e.target.value)}
								className="w-full border px-3 py-[0.38rem] rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
								required
								min={today}
							/>
						</div>
						<div>
							<label className="block mb-1 font-semibold">모집 포지션</label>
							<Select
								options={positionsOptions}
								isMulti
								value={position}
								onChange={setPosition}
								styles={selectStyles}
								placeholder="포지션 선택"
							/>
						</div>
						<div>
							<label className="block mb-1 font-semibold">연락 방법</label>
							<Select
								options={contactMethodsOptions}
								value={contactMethod}
								onChange={setContactMethod}
								placeholder="선택"
								required
							/>
						</div>
						<div>
							<label className="block mb-1 font-semibold">진행 기간</label>
							<Select
								options={durationOptions}
								value={duration}
								onChange={setDuration}
								placeholder="선택"
								required
							/>
						</div>
						<div>
							<label className="block mb-1 font-semibold">연락처</label>
							<input
								type="text"
								value={contactInfo}
								placeholder="카카오톡 링크, 이메일 등"
								onChange={(e) => setContactInfo(e.target.value)}
								className="w-full border px-3 py-[0.38rem] rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
								required
							/>
						</div>
					</div>
				</section>

				{/* 2. 기술 스택 섹션 */}
				<section>
					<label className="block mb-2 font-semibold">기술 스택</label>
					<Select
						options={stacksOptions}
						isMulti
						value={stacks}
						onChange={setStacks}
						styles={selectStyles}
						placeholder="기술 스택 선택"
					/>
				</section>

				{/* 3. 프로젝트 소개 섹션 */}
				<section className="space-y-4">
					<h2 className="font-bold text-lg flex items-center gap-2">
						<span className="text-white bg-yellow-400 w-6 h-6 flex justify-center items-center rounded-full text-sm">
							2
						</span>
						프로젝트에 대해 소개해주세요.
					</h2>
					<input
						type="text"
						placeholder="글 제목을 입력해주세요!"
						value={title}
						onChange={(e) => setTitle(e.target.value)}
						className="w-full border px-4 py-2 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
						required
					/>
					<div className="bg-white">
						<ReactQuill
							theme="snow"
							value={content}
							onChange={setContent}
							modules={quillModules}
							formats={quillFormats}
							placeholder="내용을 입력해주세요."
							className="h-80 mb-12" // 에디터 높이 설정 및 아래 여백 추가
						/>
					</div>
				</section>

				{/* 하단 버튼 */}
				<div className="flex justify-end gap-4 pt-4">
					<button
						type="button"
						onClick={() => navigate(-1)}
						className="px-6 py-2 border rounded-lg hover:bg-gray-100 transition"
					>
						취소
					</button>
					<button
						type="submit"
						className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition"
					>
						등록하기
					</button>
				</div>
			</form>
		</div>
	);
}

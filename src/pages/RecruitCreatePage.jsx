import { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Select from "react-select";
import ReactQuill, { Quill } from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

import {
	createRecruit,
	updateRecruit,
	getPositions,
	getTypes,
	getProgress,
	getTechStacks,
	getContactTypes,
	getDurationTypes,
	getMemberCount,
} from "../api";

// Quill 포맷 등록
const List = Quill.import("formats/list");
Quill.register(List, true);

export default function RecruitCreatePage() {
	const navigate = useNavigate();
	const location = useLocation();

	// 1. 수정 모드 확인 및 초기 데이터 설정
	const editData = location.state?.editData;
	const isEditMode = !!editData;

	// 폼 상태
	const [title, setTitle] = useState(editData?.title || "");
	const [content, setContent] = useState(editData?.content || "");
	const [deadLine, setDeadLine] = useState(
		editData?.deadLine ? editData.deadLine.split("T")[0] : ""
	);
	const [contactInfo, setContactInfo] = useState(editData?.contactInfo || "");

	// Select 컴포넌트용 객체 상태
	const [type, setType] = useState(null);
	const [position, setPosition] = useState([]);
	const [progressType, setProgressType] = useState(null);
	const [duration, setDuration] = useState(null);
	const [stacks, setStacks] = useState([]);
	const [totalCount, setTotalCount] = useState(null);
	const [contactMethod, setContactMethod] = useState(null);

	// enum 옵션 상태
	const [options, setOptions] = useState({
		types: [],
		positions: [],
		stacks: [],
		progress: [],
		contacts: [],
		durations: [],
		members: [],
	});

	// 2. 데이터 불러오기 및 수정 데이터 매핑
	useEffect(() => {
		const fetchEnumsAndSetData = async () => {
			try {
				const [t, p, s, pr, c, d, m] = await Promise.all([
					getTypes(),
					getPositions(),
					getTechStacks(),
					getProgress(),
					getContactTypes(),
					getDurationTypes(),
					getMemberCount(),
				]);

				// 🌟 백엔드에서 준 key(영문명)를 포함하여 매핑
				const mappedOptions = {
					types: t.data.map((v) => ({
						value: v.value,
						label: v.label,
						key: v.key,
					})),
					positions: p.data.map((v) => ({
						value: v.value,
						label: v.label,
						key: v.key,
					})),
					stacks: s.data.map((v) => ({
						value: v.value,
						label: v.label,
						key: v.key,
					})),
					progress: pr.data.map((v) => ({
						value: v.value,
						label: v.label,
						key: v.key,
					})),
					contacts: c.data.map((v) => ({
						value: v.value,
						label: v.label,
						key: v.key,
					})),
					durations: d.data.map((v) => ({
						value: v.value,
						label: v.label,
						key: v.key,
					})),
					members: m.data.map((v) => ({
						value: v.value,
						label: v.label,
						key: v.key,
					})),
				};
				setOptions(mappedOptions);

				// 🌟 수정 모드일 때 매핑 로직 (영문 Key와 숫자 Value 모두 대응)
				if (isEditMode && editData) {
					const findOption = (opts, val) => {
						if (!val) return null;
						return (
							opts.find(
								(o) =>
									String(o.value) === String(val) ||
									(o.key &&
										String(o.key).toUpperCase() === String(val).toUpperCase())
							) || null
						);
					};

					setType(findOption(mappedOptions.types, editData.type));
					setProgressType(
						findOption(mappedOptions.progress, editData.progressType)
					);
					setDuration(findOption(mappedOptions.durations, editData.duration));
					setContactMethod(
						findOption(mappedOptions.contacts, editData.contactMethod)
					);
					setTotalCount(findOption(mappedOptions.members, editData.totalCount));

					// Multi Select (포지션, 스택)
					if (Array.isArray(editData.positions)) {
						const posValues = editData.positions.map(String);
						setPosition(
							mappedOptions.positions.filter(
								(o) =>
									posValues.includes(String(o.value)) ||
									posValues.includes(String(o.key))
							)
						);
					}
					if (Array.isArray(editData.stacks)) {
						const stackValues = editData.stacks.map(String);
						setStacks(
							mappedOptions.stacks.filter(
								(o) =>
									stackValues.includes(String(o.value)) ||
									stackValues.includes(String(o.key))
							)
						);
					}
				}
			} catch (err) {
				console.error("데이터 로딩 실패", err);
			}
		};
		fetchEnumsAndSetData();
	}, [isEditMode, editData]);

	// 3. 제출 로직
	const handleSubmit = async (e) => {
		e.preventDefault();

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
			deadLine,
			contactMethod: contactMethod?.value ?? null,
			contactInfo,
			imageUrl: editData?.imageUrl || "",
		};

		try {
			if (isEditMode) {
				await updateRecruit(editData.id, payload);
				alert("수정되었습니다.");
				navigate(`/recruits/${editData.id}`, { replace: true });
			} else {
				const res = await createRecruit(payload);
				alert("등록되었습니다.");
				navigate(`/recruits/${res.data.data.id}`);
			}
		} catch (err) {
			console.error("전송 에러:", err);
			alert("처리에 실패했습니다.");
		}
	};

	const selectStyles = useMemo(
		() => ({
			control: (base) => ({
				...base,
				borderRadius: "0.375rem",
				borderColor: "#e5e7eb",
				padding: "0.1rem",
				"&:hover": { borderColor: "#a5b4fc" },
			}),
		}),
		[]
	);

	const quillModules = useMemo(
		() => ({
			toolbar: [
				[{ header: [1, 2, false] }],
				["bold", "italic", "underline", "strike"],
				[{ list: "ordered" }, { list: "bullet" }],
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

	return (
		<div className="max-w-4xl mx-auto p-8">
			<h1 className="text-3xl font-bold mb-8">
				{isEditMode ? "모집글 수정" : "팀원 모집글 작성"}
			</h1>

			<form onSubmit={handleSubmit} className="space-y-10">
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
								options={options.types}
								value={type}
								onChange={setType}
								placeholder="선택"
								required
							/>
						</div>
						<div>
							<label className="block mb-1 font-semibold">모집 인원</label>
							<Select
								options={options.members}
								value={totalCount}
								onChange={setTotalCount}
								placeholder="인원 선택"
								required
							/>
						</div>
						<div>
							<label className="block mb-1 font-semibold">진행 방식</label>
							<Select
								options={options.progress}
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
								className="w-full border px-3 py-[0.38rem] rounded-md focus:outline-none"
								required
							/>
						</div>
						<div>
							<label className="block mb-1 font-semibold">모집 포지션</label>
							<Select
								options={options.positions}
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
								options={options.contacts}
								value={contactMethod}
								onChange={setContactMethod}
								placeholder="선택"
								required
							/>
						</div>
						<div>
							<label className="block mb-1 font-semibold">진행 기간</label>
							<Select
								options={options.durations}
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
								placeholder="링크 또는 연락처"
								onChange={(e) => setContactInfo(e.target.value)}
								className="w-full border px-3 py-[0.38rem] rounded-md focus:outline-none"
								required
							/>
						</div>
					</div>
				</section>

				<section>
					<label className="block mb-2 font-semibold">기술 스택</label>
					<Select
						options={options.stacks}
						isMulti
						value={stacks}
						onChange={setStacks}
						styles={selectStyles}
						placeholder="기술 스택 선택"
					/>
				</section>

				<section className="space-y-4">
					<h2 className="font-bold text-lg flex items-center gap-2">
						<span className="text-white bg-yellow-400 w-6 h-6 flex justify-center items-center rounded-full text-sm">
							2
						</span>
						프로젝트에 대해 소개해주세요.
					</h2>
					<input
						type="text"
						placeholder="글 제목"
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
							className="h-80 mb-12"
						/>
					</div>
				</section>

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
						{isEditMode ? "수정하기" : "등록하기"}
					</button>
				</div>
			</form>
		</div>
	);
}

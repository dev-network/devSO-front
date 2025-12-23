import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
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

	const selectStyles = {
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
	};

	// ---------------------------
	// enum 데이터 불러오기
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

				// 모집 구분 (서버 value 사용)
				setTypesOptions(
					typesRes.data.map((t) => ({ value: t.value, label: t.label }))
				);
				setType(null);

				// 모집 포지션 (멀티, 서버 value 사용)
				setPositionsOptions(
					positionsRes.data.map((p) => ({ value: p.value, label: p.label }))
				);
				setPosition([]);

				// 진행 방식 (서버 value 사용)
				setProgressOptions(
					progressRes.data.map((p) => ({ value: p.value, label: p.label }))
				);
				setProgressType(null);

				// 기술 스택 (멀티)
				setStacksOptions(
					stacksRes.data.map((s) => ({ value: s.value, label: s.label }))
				);
				setStacks([]);

				// 연락 방법 (서버 value 사용)
				setContactMethodsOptions(
					contactRes.data.map((c) => ({ value: c.value, label: c.label }))
				);
				setContactMethod(null);

				// 진행 기간 (서버 value 사용)
				setDurationOptions(
					durationRes.data.map((d) => ({ value: d.value, label: d.label }))
				);
				setDuration(null);

				// 모집 인원 (서버 value 사용)
				setMemberCountOptions(
					memberRes.data.map((m) => ({ value: m.value, label: m.label }))
				);
				setTotalCount(null);
			} catch (err) {
				console.error("Enum 불러오기 실패:", err);
			}
		};

		fetchEnums();
	}, []);

	// ---------------------------
	// 제출
	// ---------------------------
	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const res = await createRecruit({
				title,
				content,
				type: type?.value,
				positions: position.map((p) => p.value),
				progressType: progressType?.value,
				duration: duration?.value,
				stacks: stacks.map((s) => s.value),
				totalCount: totalCount?.value,
				deadLine,
				contactMethod: contactMethod?.value,
				contactInfo,
				imageUrl: "",
			});
			navigate(`/recruits/${res.data.data.id}`);
		} catch (err) {
			console.error("모집글 작성 실패:", err);
		}
	};

	const today = new Date().toISOString().split("T")[0];

	// ---------------------------
	// 렌더
	// ---------------------------
	return (
		<div className="max-w-4xl mx-auto p-8">
			<h1 className="text-3xl font-bold mb-8">팀원 모집글 작성</h1>
			<form onSubmit={handleSubmit} className="space-y-10">
				{/* 기본 정보 */}
				<section className="space-y-4">
					<h2 className="font-bold text-lg flex items-center gap-2">
						<span className="text-white bg-yellow-400 w-6 h-6 flex justify-center items-center rounded-full">
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
								placeholder="스터디/프로젝트 선택"
								className="basic-select"
								classNamePrefix="select"
							/>
						</div>

						<div>
							<label className="block mb-1 font-semibold">모집 인원</label>
							<Select
								options={memberCountOptions}
								value={totalCount}
								onChange={setTotalCount}
								placeholder="인원 선택"
								className="basic-select"
								classNamePrefix="select"
							/>
						</div>

						<div>
							<label className="block mb-1 font-semibold">진행 방식</label>
							<Select
								options={progressOptions}
								value={progressType}
								onChange={setProgressType}
								placeholder="온라인/오프라인 선택"
								className="basic-select"
								classNamePrefix="select"
							/>
						</div>

						<div>
							<label className="block mb-1 font-semibold">모집 마감일</label>
							<input
								type="date"
								value={deadLine}
								onChange={(e) => setDeadLine(e.target.value)}
								className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
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
								placeholder="예: 프론트엔드, 백엔드"
								closeMenuOnSelect={false}
							/>
						</div>

						<div>
							<label className="block mb-1 font-semibold">연락 방법</label>
							<Select
								options={contactMethodsOptions}
								value={contactMethod}
								onChange={setContactMethod}
								placeholder="선택"
								className="basic-select"
								classNamePrefix="select"
							/>
						</div>

						<div>
							<label className="block mb-1 font-semibold">진행 기간</label>
							<Select
								options={durationOptions}
								value={duration}
								onChange={setDuration}
								placeholder="진행 기간 선택"
								className="basic-select"
								classNamePrefix="select"
							/>
						</div>

						<div>
							<label className="block mb-1 font-semibold">연락처</label>
							<input
								type="text"
								value={contactInfo}
								placeholder="링크, 이메일 주소, 전화번호 등 입력해주세요."
								onChange={(e) => setContactInfo(e.target.value)}
								className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
								required
							/>
						</div>
					</div>
				</section>

				{/* 기술 스택 선택 */}
				<section>
					<label className="block mb-2 font-semibold">기술 스택</label>
					<Select
						options={stacksOptions}
						isMulti
						value={stacks}
						onChange={setStacks}
						styles={selectStyles}
						placeholder="기술 스택을 선택해주세요"
						closeMenuOnSelect={false}
					/>
				</section>

				{/* 프로젝트 소개 */}
				<section className="space-y-2">
					<h2 className="font-bold text-lg flex items-center gap-2">
						<span className="text-white bg-yellow-400 w-6 h-6 flex justify-center items-center rounded-full">
							2
						</span>
						프로젝트에 대해 소개해주세요.
					</h2>
					<input
						type="text"
						placeholder="글 제목을 입력해주세요!"
						value={title}
						onChange={(e) => setTitle(e.target.value)}
						className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
						required
					/>
					<textarea
						placeholder="내용을 입력해주세요."
						value={content}
						onChange={(e) => setContent(e.target.value)}
						className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 h-56"
						required
					/>
				</section>

				{/* 버튼 */}
				<div className="flex justify-end gap-4">
					<button
						type="button"
						onClick={() => navigate(-1)}
						className="px-6 py-2 border rounded-lg hover:bg-gray-100"
					>
						취소
					</button>
					<button
						type="submit"
						className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
					>
						등록하기
					</button>
				</div>
			</form>
		</div>
	);
}

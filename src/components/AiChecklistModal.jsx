import React from "react";
import "./AiChecklistModal.css";

const AiChecklistModal = ({ isOpen, onClose, data, isLoading }) => {
	if (!isOpen) return null;

	return (
		<div className="ai-modal-overlay">
			<div className="ai-modal-container">
				<div className="ai-modal-header">
					<h2>🤖 AI 팀빌딩 자가진단</h2>
					<button className="close-x-btn" onClick={onClose}>
						&times;
					</button>
				</div>

				{isLoading ? (
					<div className="ai-modal-loading">
						<div className="ai-spinner"></div>
						<p>
							Gemini 2.0이 모집글을 분석하여
							<br />
							체크리스트를 생성하고 있습니다...
						</p>
					</div>
				) : (
					<div className="ai-modal-body">
						<p className="ai-welcome-text">
							지원하기 전, 팀의 요구사항과 나의 성향이 맞는지 체크해보세요!
						</p>

						<div className="ai-checklist-group">
							{data?.checkList?.map((item, index) => (
								<label key={index} className="ai-check-item">
									<input type="checkbox" />
									<div className="ai-check-content">
										<span className="ai-tag">#{item.target}</span>
										<span className="ai-question">{item.question}</span>
									</div>
								</label>
							))}
						</div>

						<div className="ai-match-tip">
							<strong>💡 AI의 한마디</strong>
							<p>{data?.matchTip}</p>
						</div>

						<button className="ai-done-btn" onClick={onClose}>
							확인 완료
						</button>
					</div>
				)}
			</div>
		</div>
	);
};

export default AiChecklistModal;

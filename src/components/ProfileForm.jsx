/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from "react";
import { uploadFile, getImageUrl } from "../api";

const ProfileForm = ({ initialData = {}, onDataChange }) => {
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    profileImageUrl: "",
    phone: "",
    portfolio: "",
    email: "",
  });

  const [errors, setErrors] = useState({ portfolio: "", image: "" });
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);

  // 부모로부터 받은 데이터를 상태에 동기화
  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      setFormData({
        name: initialData.name || "",
        bio: initialData.bio || "",
        profileImageUrl: initialData.profileImageUrl || "",
        phone: initialData.phone || "",
        portfolio: initialData.portfolio || "",
        email: initialData.email || "",
      });
      if (initialData.profileImageUrl) {
        setPreviewUrl(getImageUrl(initialData.profileImageUrl));
      }
    }
  }, [initialData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // 검증 로직
    let errorMsg = "";
    if (name === "portfolio" && value !== "" && !value.includes("@")) {
      errorMsg = "포트폴리오 주소에는 @가 포함되어야 합니다.";
    }
    setErrors((prev) => ({ ...prev, [name]: errorMsg }));

    // 객체 업데이트 시 다른 필드가 오염되지 않도록 확실히 처리
    const newFormData = { ...formData, [name]: value };
    setFormData(newFormData);
    onDataChange(newFormData);
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setErrors((prev) => ({ ...prev, image: "" }));

    // 용량 제한 체크
    const maxSize = 2 * 1024 * 1024;
    if (file.size > maxSize) {
      setErrors((prev) => ({
        ...prev,
        image: "파일 크기는 2MB를 초과할 수 없습니다.",
      }));
      return;
    }

    // 1. 미리보기 처리 (클라이언트 전용)
    const reader = new FileReader();
    reader.onloadend = () => setPreviewUrl(reader.result);
    reader.readAsDataURL(file);

    try {
      // 2. 서버 업로드 시도
      const response = await uploadFile(file);

      // API 응답 구조에 맞게 수정 (PostCreatePage와 동일한 구조)
      const relativeUrl = response.data?.data?.url || response.data?.url;

      if (relativeUrl) {
        // ✅ 가장 중요한 부분:
        // 기존 name, bio, phone, portfolio 등 모든 데이터를 유지하면서
        // 오직 profileImageUrl 필드만 새로운 경로로 업데이트합니다.
        const updatedFormData = {
          ...formData,
          profileImageUrl: relativeUrl,
        };

        setFormData(updatedFormData);

        // 부모(ProfileEditPage)에게 "완전한 객체"를 전달합니다.
        onDataChange(updatedFormData);
      }
    } catch (err) {
      console.error("이미지 업로드 실패:", err);
      setErrors((prev) => ({
        ...prev,
        image: "이미지 업로드에 실패했습니다.",
      }));
    }
  };

  return (
    <div className="form-section edit-profile-header">
      <div className="profile-image-section">
        <div
          className="profile-image-container"
          onClick={() => fileInputRef.current?.click()}
          style={{ cursor: "pointer", position: "relative" }}
        >
          <img
            src={previewUrl || "https://via.placeholder.com/150"}
            alt="Profile"
            className="profile-image"
          />
          <div className="image-overlay-text">사진 변경</div>
        </div>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          style={{ display: "none" }}
        />

        <div className="form-group" style={{ marginTop: "10px" }}>
          <label>프로필 사진</label>
          <p className="help-text">2MB 이하의 이미지만 가능합니다.</p>
          {errors.image && (
            <p
              className="error-text"
              style={{ color: "red", fontSize: "12px" }}
            >
              {errors.image}
            </p>
          )}
        </div>
      </div>

      <div className="profile-details-section">
        <div className="form-grid">
          <div className="form-group">
            <label>이름</label>
            {/* ✅ name 속성이 정확히 "name"인지 확인 */}
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label>이메일</label> {/* 추가된 섹션 */}
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="example@email.com"
            />
          </div>

          <div className="form-group">
            <label>전화번호</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group" style={{ gridColumn: "span 2" }}>
            <label>포트폴리오 / SNS 링크</label>
            <input
              type="text"
              name="portfolio"
              value={formData.portfolio}
              onChange={handleInputChange}
              style={{ borderColor: errors.portfolio ? "red" : "" }}
            />
            {errors.portfolio && (
              <p
                className="error-text"
                style={{ color: "red", fontSize: "12px" }}
              >
                {errors.portfolio}
              </p>
            )}
          </div>

          <div className="form-group" style={{ gridColumn: "span 2" }}>
            <label>자기 소개</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              rows="10"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileForm;

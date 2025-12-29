import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getProfile, updateProfile } from '../api';
import ProfileForm from '../components/ProfileForm';
import EducationForm from '../components/EducationForm';
import CareerForm from '../components/CareerForm';
import ActivityForm from '../components/ActivityForm';
import CertificateForm from '../components/CertificateForm';
import SkillsForm from '../components/SkillsForm';
import '../styles/ProfileForm.css';

const ProfileEditPage = () => {
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const [loading, setLoading] = useState(true);

  // 1. 백엔드 엔티티(User) 필드명과 일치시키기
  const [profileData, setProfileData] = useState({
    name: '',
    bio: '',
    profileImageUrl: '',
    phone: '',      // phoneNumber -> phone
    portfolio: '',  // blogUrl/githubUrl -> portfolio
    email: '',
  });

  const [educations, setEducations] = useState([]);
  const [careers, setCareers] = useState([]);
  const [activities, setActivities] = useState([]);
  const [certis, setCertis] = useState([]); // certificates -> certis (백엔드 필드명 일치)
  const [skills, setSkills] = useState([]);

 useEffect(() => {
    if (currentUser?.username) {
      getProfile(currentUser.username)
        .then((response) => {
          // ✅ 핵심 수정: response.data의 구조를 명확히 확인하여 매핑
          // 만약 서버 응답이 { data: { name: ... } } 식이라면 response.data.data를 사용하세요.
          const data = response.data.data || response.data; 
          
          setProfileData({
            name: data.name || '',
            bio: data.bio || '',
            profileImageUrl: data.profileImageUrl || '',
            phone: data.phone || '',
            portfolio: data.portfolio || '',
            email: data.email || '',
          });
          
          // 리스트 데이터들도 안전하게 설정
          setEducations(data.educations || []);
          setCareers(data.careers || []);
          setActivities(data.activities || []);
          setCertis(data.certis || []);
          setSkills(data.skills || []);
          setLoading(false);
        })
        .catch((err) => {
          console.error('Failed to fetch profile:', err);
          setLoading(false);
        });
    }
  }, [currentUser]);

  const handleSave = async () => {
    if (!currentUser?.username) return;

    // 포트폴리오 유효성 검사
    if (profileData.portfolio && !profileData.portfolio.includes('@')) {
      alert('포트폴리오 주소에는 @가 포함되어야 합니다.');
      return;
    }

    // ✅ 핵심 수정: totalData를 만들 때 profileData 안의 값들이 확실히 제자리에 있는지 재확인
    const totalData = {
      name: profileData.name,
      bio: profileData.bio,
      profileImageUrl: profileData.profileImageUrl,
      phone: profileData.phone,
      portfolio: profileData.portfolio,
      email: profileData.email,
      educations: educations,
      careers: careers,
      activities: activities,
      certis: certis,
      skills: skills,
    };

    console.log("최종 전송 데이터 확인:", totalData); 

    try {
      await updateProfile(currentUser.username, totalData);
      alert('프로필이 성공적으로 저장되었습니다.');
      navigate(`/profile/${currentUser.username}`);
    } catch (err) {
      console.error('Failed to save profile:', err);
      // ✅ 에러가 났을 때 DB 에러 메시지(Too long 등)를 확인할 수 있도록 함
      const errorMsg = err.response?.data?.message || err.response?.data || '저장 실패';
      alert(`저장 실패: ${errorMsg}`);
    }
  };

  return (
    <div className="profile-edit-container">
      <h1>프로필 수정</h1>
      
      {/* 각 폼에 전달되는 props 명칭 확인 */}
      <ProfileForm initialData={profileData} onDataChange={setProfileData} />
      <EducationForm initialData={educations} onDataChange={setEducations} />
      <CareerForm initialData={careers} onDataChange={setCareers} />
      <ActivityForm initialData={activities} onDataChange={setActivities} />
      {/* 백엔드와 맞춘 Certi 폼 전달 */}
      <CertificateForm initialData={certis} onDataChange={setCertis} />
      <SkillsForm initialData={skills} onDataChange={setSkills} />

      <div className="button-group">
        <button className="save-btn" onClick={handleSave}>저장하기</button>
        <button className="cancel-btn" onClick={() => navigate(-1)}>취소</button>
      </div>
    </div>
  );
};

export default ProfileEditPage;
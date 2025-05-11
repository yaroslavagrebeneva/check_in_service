import { useState, useRef } from 'react';
import Modal from './Modal';

const avatars = [
  { id: 'student_female', path: '/student.png', label: 'Студентка' },
  { id: 'student_male', path: '/male_student.png', label: 'Студент' },
  { id: 'teacher_female', path: '/prepod.png', label: 'Преподавательница' },
  { id: 'teacher_male', path: '/prepodman.png', label: 'Преподаватель' },
  { id: 'dean_female', path: '/dean1.png', label: 'Декан (ж)' },
  { id: 'dean_male', path: '/dean.png', label: 'Декан (м)' },
];

export default function AvatarSelector({ open, onClose, onSelect, currentAvatar, allowed }) {
  const [selectedAvatar, setSelectedAvatar] = useState(currentAvatar);
  const [customAvatar, setCustomAvatar] = useState(null);
  const fileInputRef = useRef();

  const filteredAvatars = allowed ? avatars.filter(a => allowed.includes(a.id)) : avatars;

  const handleSelect = (avatar) => {
    setSelectedAvatar(avatar.path);
    setCustomAvatar(null);
    onSelect(avatar.path);
    onClose();
  };

  const handleCustomClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setCustomAvatar(ev.target.result);
        setSelectedAvatar(ev.target.result);
        onSelect(ev.target.result);
        onClose();
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Выберите аватар">
      <div className="grid grid-cols-2 gap-4 p-4">
        {filteredAvatars.map((avatar) => (
          <div
            key={avatar.id}
            className={`cursor-pointer p-4 rounded-xl transition-all ${
              selectedAvatar === avatar.path
                ? 'bg-[#00D4FF]/20 border-2 border-[#00D4FF]'
                : 'bg-white/10 hover:bg-white/20'
            }`}
            onClick={() => handleSelect(avatar)}
          >
            <img
              src={avatar.path}
              alt={avatar.label}
              className="w-32 h-32 object-contain mx-auto mb-2"
            />
            <div className="text-center text-white/90">{avatar.label}</div>
          </div>
        ))}
        <div
          className={`cursor-pointer p-4 rounded-xl transition-all flex flex-col items-center justify-center border-2 border-dashed border-[#00D4FF] hover:bg-white/10`}
          onClick={handleCustomClick}
        >
          {customAvatar ? (
            <img src={customAvatar} alt="custom avatar" className="w-32 h-32 object-contain mx-auto mb-2 rounded-full" />
          ) : (
            <>
              <div className="w-32 h-32 flex items-center justify-center bg-[#2B1847] rounded-full mb-2 text-white/40 text-4xl">+</div>
              <div className="text-center text-white/90">Загрузить свой аватар</div>
            </>
          )}
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />
        </div>
      </div>
    </Modal>
  );
} 
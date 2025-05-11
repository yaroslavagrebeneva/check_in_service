import { useState } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { AlertCircleIcon, CalendarIcon, UsersIcon, EyeIcon, XCircleIcon, CheckCircleIcon, BookOpenIcon } from 'lucide-react';
import Modal from '../components/Modal';
import AvatarSelector from '../components/AvatarSelector';

// Мок-данные старосты
const starosta = {
  avatar: '/starosta.png',
  fullName: 'Петрова Мария Сергеевна',
  group: 'И-23',
};

const notifications = [
  { id: 1, message: 'Сегодня 2 студента отсутствуют', type: 'absence', date: '2024-06-10' },
  { id: 2, message: 'Завтра собрание старост', type: 'info', date: '2024-06-11' },
];

const subjects = [
  { id: 1, name: 'АиП', teacher: 'Сидоров А.П.' },
  { id: 2, name: 'БД', teacher: 'Петров В.И.' },
  { id: 3, name: 'ИоИМО', teacher: 'Смирнова Е.А.' },
];

const fakeSchedule = [
  { time: '09:00', subject: 'АиП', room: '101' },
  { time: '10:40', subject: 'БД', room: '202' },
  { time: '12:30', subject: 'ИоИМО', room: '303' },
];
const fakeAttendance = [
  { name: 'Иванов И.И.', present: true },
  { name: 'Смирнова А.А.', present: true },
  { name: 'Петров П.П.', present: true },
];

export default function StarostaDashboard() {
  const [modal, setModal] = useState(null); // 'schedule' | 'attendance' | 'mark' | 'subjects' | null
  const [attendance, setAttendance] = useState(fakeAttendance);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [avatarModal, setAvatarModal] = useState(false);
  const [currentAvatar, setCurrentAvatar] = useState(starosta.avatar);

  const handleTogglePresent = (index) => {
    setAttendance(prev => prev.map((item, i) => i === index ? { ...item, present: !item.present } : item));
  };

  const handleMarkAttendance = () => {
    setModal('subjects');
  };

  const handleSaveAttendance = () => {
    setModal(null);
    setSelectedSubject(null);
  };

  const handleAvatarSelect = (avatar) => {
    setCurrentAvatar(avatar);
  };

  return (
    <div className="min-h-screen flex items-center justify-center pt-24">
      <div className="flex flex-row items-start gap-8 bg-white/10 rounded-2xl p-8 shadow-xl max-w-3xl w-full">
        <div className="relative">
          <img 
            src={currentAvatar} 
            alt="avatar" 
            className="w-40 h-40 object-contain select-none cursor-pointer" 
            style={{background: 'none', borderRadius: 0, boxShadow: 'none'}}
            onClick={() => setAvatarModal(true)}
          />
          <div className="absolute bottom-0 right-0 bg-[#00D4FF] rounded-full p-1 cursor-pointer" onClick={() => setAvatarModal(true)}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
          </div>
        </div>
        <div className="flex-1 flex flex-col gap-4">
          <div>
            <div className="text-2xl font-bold text-white mb-1">{starosta.fullName}</div>
            <div className="text-lg text-[#00D4FF] font-semibold mb-4">Группа: {starosta.group}</div>
          </div>
          <div className="flex flex-wrap gap-3 mb-2">
            <Button onClick={() => setModal('schedule')} className="bg-gradient-to-r from-[#FF6A88] to-[#FF8E53] text-white font-semibold rounded-xl flex items-center gap-2">
              <CalendarIcon className="w-5 h-5" /> Посмотреть расписание
            </Button>
            <Button onClick={() => setModal('attendance')} className="bg-gradient-to-r from-[#00D4FF] to-[#B266FF] text-white font-semibold rounded-xl flex items-center gap-2">
              <EyeIcon className="w-5 h-5" /> Посмотреть посещаемость
            </Button>
            <Button onClick={handleMarkAttendance} className="bg-gradient-to-r from-[#B266FF] to-[#00D4FF] text-white font-semibold rounded-xl flex items-center gap-2">
              <UsersIcon className="w-5 h-5" /> Отметить посещаемость
            </Button>
          </div>
          <div className="w-full mt-2">
            <Card className="bg-white/10 border border-white/20 rounded-xl">
              <CardHeader>
                <CardTitle className="text-lg text-white">Уведомления</CardTitle>
              </CardHeader>
              <CardContent>
                {notifications.map((n) => (
                  <div key={n.id} className="flex items-center gap-2 mb-2 text-white/90">
                    <AlertCircleIcon className={n.type === 'absence' ? 'text-[#FF6A88]' : 'text-[#00D4FF]'} size={18} />
                    <span>{n.message}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
          <div className="w-full mt-4 flex flex-col items-start gap-2">
            <div className="text-white/80 text-base flex items-center gap-2">"Староста — это сердце группы!"</div>
            <div className="text-xs text-white/40">Совет: не забывай отмечать посещаемость вовремя.</div>
          </div>
        </div>
      </div>
      {/* Модальные окна */}
      <Modal open={modal === 'schedule'} onClose={() => setModal(null)} title="Расписание группы">
        <div className="flex flex-col gap-2">
          {fakeSchedule.map((item, i) => (
            <div key={i} className="flex gap-4 text-white/90 items-center">
              <span className="font-semibold w-16">{item.time}</span>
              <span className="flex-1">{item.subject}</span>
              <span className="text-[#00D4FF]">{item.room}</span>
            </div>
          ))}
        </div>
      </Modal>
      <Modal open={modal === 'attendance'} onClose={() => setModal(null)} title="Посещаемость студентов">
        <div className="flex flex-col gap-2">
          {attendance.map((item, i) => (
            <div key={i} className="flex gap-4 text-white/90 items-center">
              <span className="font-semibold w-32">{item.name}</span>
              <span className={item.present ? 'text-[#00D4FF]' : 'text-[#FF6A88]'}>{item.present ? 'Есть' : 'Отсутствует'}</span>
            </div>
          ))}
        </div>
      </Modal>
      <Modal open={modal === 'subjects'} onClose={() => setModal(null)} title="Выберите предмет">
        <div className="flex flex-col gap-3">
          {subjects.map((subject) => (
            <Button
              key={subject.id}
              onClick={() => {
                setSelectedSubject(subject);
                setModal('mark');
              }}
              className="bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl flex items-center justify-between p-4"
            >
              <span>{subject.name}</span>
              <span className="text-white/70">{subject.teacher}</span>
            </Button>
          ))}
        </div>
      </Modal>
      <Modal 
        open={modal === 'mark'} 
        onClose={() => setModal(null)} 
        title={`Отметить посещаемость: ${selectedSubject?.name || ''}`}
      >
        <div className="flex flex-col gap-2">
          {attendance.map((item, i) => (
            <div key={i} className="flex gap-4 items-center text-white/90">
              <span className="font-semibold w-32">{item.name}</span>
              <Button size="icon" variant={item.present ? 'default' : 'outline'} className={item.present ? 'bg-[#00D4FF] text-white' : 'bg-white/10 text-[#FF6A88]'} onClick={() => handleTogglePresent(i)}>
                {item.present ? <CheckCircleIcon /> : <XCircleIcon />}
              </Button>
              <span className={item.present ? 'text-[#00D4FF]' : 'text-[#FF6A88]'}>{item.present ? 'Есть' : 'Отсутствует'}</span>
            </div>
          ))}
        </div>
        <Button className="mt-4 w-full bg-gradient-to-r from-[#00D4FF] to-[#FF8E53] text-white font-semibold rounded-xl" onClick={handleSaveAttendance}>
          Сохранить
        </Button>
      </Modal>
      <AvatarSelector
        open={avatarModal}
        onClose={() => setAvatarModal(false)}
        onSelect={handleAvatarSelect}
        currentAvatar={currentAvatar}
        allowed={["student_female","student_male"]}
      />
    </div>
  );
}

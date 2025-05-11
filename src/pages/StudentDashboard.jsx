import { useState } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { AlertCircleIcon, CalendarIcon, SmileIcon, EyeIcon } from 'lucide-react';
import Modal from '../components/Modal';
import AvatarSelector from '../components/AvatarSelector';

// Мок-данные студента
const student = {
  avatar: '/student.png', // Положите PNG в public/
  fullName: 'Гребенева Ярослава Андреевна',
  group: 'И-23',
};

const notifications = [
  { id: 1, message: 'Сегодня 1 пропуск: База данных, 2 пара', type: 'absence', date: '2024-06-10' },
  { id: 2, message: 'Завтра зачет по курсу "Информационная безопасность"!', type: 'info', date: '2024-06-11' },
];

const fakeSchedule = [
  { time: '09:00', subject: 'База данных', room: '101' },
  { time: '10:40', subject: 'ИБ', room: '202' },
  { time: '12:30', subject: 'АиП', room: '303' },
];

const fakeAttendance = [
  { date: '2024-06-10', subject: 'База данных', status: 'Пропуск', reason: { type: 'medical', details: 'Был на приеме у врача', approved: null } },
  { date: '2024-06-09', subject: 'АиП', status: 'Был(а)' },
];

const reasonTypes = [
  { id: 'medical', label: 'Медицинская причина' },
  { id: 'respectful', label: 'Уважительная причина' },
  { id: 'other', label: 'Другая причина' },
];

export default function StudentDashboard() {
  const [selectedReasonType, setSelectedReasonType] = useState('');
  const [reasonDetails, setReasonDetails] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [message, setMessage] = useState('');
  const [modal, setModal] = useState(null); // 'schedule' | 'attendance' | 'reason' | null
  const [avatarModal, setAvatarModal] = useState(false);
  const [currentAvatar, setCurrentAvatar] = useState(student.avatar);

  const handleSendReason = () => {
    if (!selectedReasonType || !reasonDetails || !selectedSubject) {
      setMessage('Пожалуйста, заполните все поля');
      return;
    }
    setMessage('Причина отправлена!');
    setSelectedReasonType('');
    setReasonDetails('');
    setSelectedSubject('');
    setTimeout(() => setMessage(''), 2000);
    setModal(null);
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
            <div className="text-2xl font-bold text-white mb-1">{student.fullName}</div>
            <div className="text-lg text-[#00D4FF] font-semibold mb-4">Группа: {student.group}</div>
          </div>
          <div className="flex flex-wrap gap-3 mb-2">
            <Button onClick={() => setModal('schedule')} className="bg-gradient-to-r from-[#FF6A88] to-[#FF8E53] text-white font-semibold rounded-xl flex items-center gap-2">
              <CalendarIcon className="w-5 h-5" /> Посмотреть расписание
            </Button>
            <Button onClick={() => setModal('attendance')} className="bg-gradient-to-r from-[#00D4FF] to-[#B266FF] text-white font-semibold rounded-xl flex items-center gap-2">
              <EyeIcon className="w-5 h-5" /> Посещение
            </Button>
            <Button onClick={() => setModal('reason')} className="bg-gradient-to-r from-[#B266FF] to-[#FF6A88] text-white font-semibold rounded-xl flex items-center gap-2">
              <AlertCircleIcon className="w-5 h-5" /> Причина пропуска
            </Button>
          </div>
          {message && <div className="text-green-400 text-center mt-2">{message}</div>}
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
            <div className="text-white/80 text-base flex items-center gap-2"><SmileIcon className="text-[#00D4FF]" /> "Каждый день — новый шанс стать лучше!"</div>
            <div className="text-xs text-white/40">Совет: не забывай отмечать причину пропуска вовремя.</div>
          </div>
        </div>
      </div>
      {/* Модальные окна */}
      <Modal open={modal === 'schedule'} onClose={() => setModal(null)} title="Моё расписание">
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
      <Modal open={modal === 'attendance'} onClose={() => setModal(null)} title="Моя посещаемость">
        <div className="flex flex-col gap-2">
          {fakeAttendance.map((item, i) => (
            <div key={i} className="flex flex-col gap-1 bg-white/5 rounded-xl p-3">
              <div className="flex gap-4 text-white/90 items-center">
                <span className="font-semibold w-24">{item.date}</span>
                <span className="flex-1">{item.subject}</span>
                <span className={item.status === 'Пропуск' ? 'text-[#FF6A88]' : 'text-[#00D4FF]'}>{item.status}</span>
              </div>
              {item.reason && (
                <div className="ml-8 text-sm">
                  <div className="text-white/70">Причина: {item.reason.type === 'medical' ? 'Медицинская' : 
                    item.reason.type === 'respectful' ? 'Уважительная' : 'Другая'}</div>
                  <div className="text-white/70">Детали: {item.reason.details}</div>
                  {item.reason.approved !== null && (
                    <div className={item.reason.approved ? 'text-green-400' : 'text-red-400'}>
                      {item.reason.approved ? 'Причина принята' : 'Причина отклонена'}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </Modal>
      <Modal open={modal === 'reason'} onClose={() => setModal(null)} title="Указать причину пропуска">
        <div className="flex flex-col gap-4 max-w-md">
          <div className="flex flex-col gap-2">
            <label className="text-white/90">Предмет</label>
            <select
              className="rounded-xl p-3 bg-[#2B1847] border border-white/20 text-white focus:border-[#00D4FF] focus:ring-[#00D4FF] outline-none"
              value={selectedSubject}
              onChange={e => setSelectedSubject(e.target.value)}
            >
              <option value="">Выберите предмет</option>
              {fakeSchedule.map((item, i) => (
                <option key={i} value={item.subject}>{item.subject}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-white/90">Тип причины</label>
            <div className="flex flex-col gap-2">
              {reasonTypes.map((type) => (
                <Button
                  key={type.id}
                  variant={selectedReasonType === type.id ? 'default' : 'outline'}
                  className={`w-full justify-start ${selectedReasonType === type.id ? 'bg-[#00D4FF] text-white' : 'bg-white/10 text-white'}`}
                  onClick={() => setSelectedReasonType(type.id)}
                >
                  {type.label}
                </Button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-white/90">Подробности</label>
            <textarea
              className="rounded-xl p-3 bg-white/10 border border-white/20 text-white placeholder-white/60 focus:border-[#00D4FF] focus:ring-[#00D4FF] outline-none"
              placeholder="Опишите подробности..."
              value={reasonDetails}
              onChange={e => setReasonDetails(e.target.value)}
              rows={3}
            />
          </div>

          <Button 
            className="bg-gradient-to-r from-[#FF6A88] to-[#FF8E53] text-white font-semibold rounded-xl"
            onClick={handleSendReason}
          >
            Отправить
          </Button>
        </div>
      </Modal>
      <AvatarSelector
        open={avatarModal}
        onClose={() => setAvatarModal(false)}
        onSelect={handleAvatarSelect}
        currentAvatar={currentAvatar}
        allowed={['student_female','student_male']}
      />
    </div>
  );
}

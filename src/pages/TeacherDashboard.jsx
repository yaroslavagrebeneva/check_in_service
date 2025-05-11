import { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { AlertCircleIcon, CalendarIcon, UsersIcon, EyeIcon, InfoIcon, CheckCircleIcon, XCircleIcon } from 'lucide-react';
import Modal from '../components/Modal';
import AvatarSelector from '../components/AvatarSelector';
import { Link } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';

// Мок-данные преподавателя
const teacher = {
  avatar: '/prepod.png', // Положите PNG в public/
  fullName: 'Лебедева Полина Александровна',
  subject: 'База Данных (БД)',
};

const notifications = [
  { id: 1, message: 'Сегодня 2 студента отсутствуют', type: 'absence', date: '2024-06-10' },
  { id: 2, message: 'Завтра методсовет', type: 'info', date: '2024-06-11' },
];

const fakeSchedule = [
  { time: '09:00', group: 'И-21', subject: 'БД', room: '101' },
  { time: '10:40', group: 'И-22', subject: 'БД', room: '202' },
  { time: '12:30', group: 'И-23', subject: 'БД', room: '303' },
];
const fakeAttendance = [
  { 
    name: 'Иванов И.И.', 
    group: 'ПМИ-21', 
    status: 'Пропуск', 
    reason: { 
      type: 'medical', 
      details: 'Был на приеме у врача', 
      approved: null 
    }, 
    work: null 
  },
  { 
    name: 'Смирнова А.А.', 
    group: 'ПМИ-21', 
    status: 'Был', 
    reason: null, 
    work: null 
  },
  { 
    name: 'Петров П.П.', 
    group: 'ПМИ-21', 
    status: 'Пропуск', 
    reason: { 
      type: 'respectful', 
      details: 'Участвовал в олимпиаде', 
      approved: null 
    }, 
    work: null 
  },
  {
    name: 'Кузнецов Д.Д.',
    group: 'ПМИ-21',
    status: 'Пропуск',
    reason: null,
    work: null
  },
];

function calcPoints(status, work) {
  if (status === 'Был') return { p: 1, n: 0 };
  if (status === 'Пропуск' && work === 'done') return { p: 0.5, n: 0 };
  if (status === 'Пропуск') return { p: 0, n: -1 };
  return { p: 0, n: 0 };
}

export default function TeacherDashboard() {
  const [modal, setModal] = useState(null); // 'schedule' | 'attendance' | { type: 'reason', student: ... }
  const [selectedReason, setSelectedReason] = useState(null);
  const [reasonModal, setReasonModal] = useState(false);
  const [attendance, setAttendance] = useState(fakeAttendance);
  const [avatarModal, setAvatarModal] = useState(false);
  const [currentAvatar, setCurrentAvatar] = useState(teacher.avatar);
  const [notificationModal, setNotificationModal] = useState(null);
  const [qrModal, setQrModal] = useState(false);
  const [qrValue, setQrValue] = useState(Math.random().toString(36).substring(2, 15));

  useEffect(() => {
    const interval = setInterval(() => {
      setQrValue(Math.random().toString(36).substring(2, 15));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleShowReason = (student) => {
    setSelectedReason(student);
    setReasonModal(true);
  };

  const handleWorkChange = (index, value) => {
    setAttendance(prev => prev.map((item, i) => i === index ? { ...item, work: value } : item));
  };

  const handleReasonApproval = (student, approved) => {
    setAttendance(prev => prev.map(item => 
      item.name === student.name 
        ? { 
            ...item, 
            reason: { 
              ...item.reason, 
              approved 
            } 
          }
        : item
    ));
    setReasonModal(false);
  };

  const handleAvatarSelect = (avatar) => {
    setCurrentAvatar(avatar);
  };

  const handleSendNotification = (student, type) => {
    setNotificationModal({ student, type });
  };

  const handleCloseModal = () => {
    if (modal && modal.type === 'reason') {
      setModal(null);
    } else {
      setModal(null);
    }
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
            <div className="text-2xl font-bold text-white mb-1">{teacher.fullName}</div>
            <div className="text-lg text-[#00D4FF] font-semibold mb-4">Предмет: {teacher.subject}</div>
          </div>
          <div className="flex flex-wrap gap-3 mb-2">
            <Button onClick={() => setModal('schedule')} className="bg-gradient-to-r from-[#FF6A88] to-[#FF8E53] text-white font-semibold rounded-xl flex items-center gap-2">
              <CalendarIcon className="w-5 h-5" /> Посмотреть расписание
            </Button>
            <Button onClick={() => setModal('attendance')} className="bg-gradient-to-r from-[#00D4FF] to-[#B266FF] text-white font-semibold rounded-xl flex items-center gap-2">
              <EyeIcon className="w-5 h-5" /> Посмотреть посещаемость
            </Button>
            <Button onClick={() => setQrModal(true)} className="bg-gradient-to-r from-[#00D4FF] to-[#FF8E53] text-white font-semibold rounded-xl flex items-center gap-2">
              <InfoIcon className="w-5 h-5" /> Сгенерировать QR-код
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
            <div className="text-white/80 text-base flex items-center gap-2">"Учитель — это тот, кто вдохновляет!"</div>
            <div className="text-xs text-white/40">Совет: не забывайте отмечать посещаемость и поддерживать студентов.</div>
          </div>
        </div>
      </div>
      {/* Модальные окна */}
      <Modal open={modal === 'schedule'} onClose={handleCloseModal} title="Моё расписание">
        <div className="flex flex-col gap-2">
          {fakeSchedule.map((item, i) => (
            <div key={i} className="flex gap-4 text-white/90 items-center">
              <span className="font-semibold w-16">{item.time}</span>
              <span className="flex-1">{item.group}</span>
              <span className="flex-1">{item.subject}</span>
              <span className="text-[#00D4FF]">{item.room}</span>
            </div>
          ))}
        </div>
      </Modal>
      <Modal open={modal === 'attendance'} onClose={handleCloseModal} title="Посещаемость студентов">
        <div className="max-h-[60vh] overflow-y-auto flex flex-col gap-2">
          {attendance.map((item, i) => {
            const points = calcPoints(item.status, item.work);
            return (
              <div key={i} className="flex flex-col gap-1 bg-white/5 rounded-xl p-3 mb-2">
                <div className="flex flex-wrap gap-2 items-center">
                  <span className="font-semibold w-32">{item.name}</span>
                  <span className="flex-1">{item.group}</span>
                  <span className={item.status === 'Пропуск' ? 'text-[#FF6A88]' : 'text-[#00D4FF]'}>{item.status}</span>
                  {item.status === 'Пропуск' && (
                    <div className="flex flex-wrap gap-2 items-center">
                      <Button 
                        size="sm" 
                        className="bg-gradient-to-r from-[#B266FF] to-[#FF6A88] text-white rounded-lg px-3 py-1" 
                        onClick={() => handleShowReason(item)}
                      >
                        <InfoIcon className="w-4 h-4 mr-1" /> 
                        {item.reason?.approved === null ? 'Просмотреть причину' : 
                         item.reason?.approved ? 'Причина принята' : 'Причина отклонена'}
                      </Button>
                      {!item.reason && (
                        <Button 
                          size="sm" 
                          className="bg-gradient-to-r from-[#FF6A88] to-[#FF8E53] text-white rounded-lg px-3 py-1"
                          onClick={() => handleSendNotification(item, 'request_reason')}
                        >
                          <AlertCircleIcon className="w-4 h-4 mr-1" />
                          Отправить уведомление: дайте причину
                        </Button>
                      )}
                      {item.reason && item.reason.approved === null && (
                        <Button 
                          size="sm" 
                          className="bg-gradient-to-r from-[#00D4FF] to-[#B266FF] text-white rounded-lg px-3 py-1"
                          onClick={() => handleSendNotification(item, 'request_details')}
                        >
                          <AlertCircleIcon className="w-4 h-4 mr-1" />
                          Запросить подробности
                        </Button>
                      )}
                    </div>
                  )}
                </div>
                {item.status === 'Пропуск' && (
                  <div className="flex flex-wrap gap-2 items-center mt-2 ml-2">
                    <span className="text-white/70 text-sm">Отработка:</span>
                    <Button 
                      size="sm" 
                      variant={item.work === 'done' ? undefined : 'outline'} 
                      className="rounded-lg px-2 py-1" 
                      onClick={() => handleWorkChange(i, 'done')}
                    >
                      Отработка
                    </Button>
                    <Button 
                      size="sm" 
                      variant={item.work === 'notdone' ? undefined : 'outline'} 
                      className="rounded-lg px-2 py-1" 
                      onClick={() => handleWorkChange(i, 'notdone')}
                    >
                      Неотработка
                    </Button>
                  </div>
                )}
                <div className="flex gap-2 items-center mt-2 ml-2">
                  <span className="text-white/70 text-sm">Баллы:</span>
                  <span className="text-[#00D4FF]">П: {points.p}</span>
                  <span className="text-[#FF6A88]">Н: {points.n}</span>
                </div>
              </div>
            );
          })}
        </div>
      </Modal>
      <Modal 
        open={reasonModal} 
        onClose={() => setReasonModal(false)} 
        title={`Причина пропуска: ${selectedReason?.name || ''}`}
      >
        {selectedReason?.reason && (
          <div className="flex flex-col gap-4">
            <div className="bg-white/5 rounded-xl p-4">
              <div className="text-white/90 mb-2">
                <span className="font-semibold">Тип причины: </span>
                {selectedReason.reason.type === 'medical' ? 'Медицинская' : 
                 selectedReason.reason.type === 'respectful' ? 'Уважительная' : 'Другая'}
              </div>
              <div className="text-white/90">
                <span className="font-semibold">Подробности: </span>
                {selectedReason.reason.details}
              </div>
            </div>
            {selectedReason.reason.approved === null && (
              <div className="flex gap-3">
                <Button
                  className="flex-1 bg-gradient-to-r from-[#00D4FF] to-[#B266FF] text-white font-semibold rounded-xl"
                  onClick={() => handleReasonApproval(selectedReason, true)}
                >
                  <CheckCircleIcon className="w-5 h-5 mr-2" /> Принять
                </Button>
                <Button 
                  className="flex-1 bg-gradient-to-r from-[#FF6A88] to-[#FF8E53] text-white font-semibold rounded-xl"
                  onClick={() => handleReasonApproval(selectedReason, false)}
                >
                  <XCircleIcon className="w-5 h-5 mr-2" /> Отклонить
                </Button>
              </div>
            )}
            {selectedReason.reason.approved !== null && (
              <div className={`text-center p-3 rounded-xl ${selectedReason.reason.approved ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                {selectedReason.reason.approved ? 'Причина принята' : 'Причина отклонена'}
              </div>
            )}
          </div>
        )}
      </Modal>
      <Modal 
        open={notificationModal !== null} 
        onClose={() => setNotificationModal(null)} 
        title={notificationModal?.type === 'request_reason' ? 'Запрос причины пропуска' : 'Запрос подробностей'}
      >
        {notificationModal && (
          <div className="p-4">
            <div className="mb-4">
              <div className="text-white/90 mb-2">Студент: {notificationModal.student.name}</div>
              <div className="text-white/90 mb-4">Группа: {notificationModal.student.group}</div>
              <div className="bg-white/5 rounded-xl p-4">
                <div className="text-white/90 mb-2">
                  {notificationModal.type === 'request_reason' 
                    ? 'Пожалуйста, укажите причину вашего отсутствия на занятии.'
                    : 'Пожалуйста, предоставьте более подробную информацию о причине вашего отсутствия.'}
                </div>
                <Button className="w-full bg-gradient-to-r from-[#00D4FF] to-[#B266FF] text-white font-semibold rounded-xl">
                  Отправить уведомление
                </Button>
              </div>
            </div>
          </div>
        )}
      </Modal>
      <Modal open={qrModal} onClose={() => setQrModal(false)} title="QR-код для посещаемости">
        <div className="flex flex-col items-center justify-center p-6">
          <QRCodeSVG value={qrValue} size={200} bgColor="#fff" fgColor="#1A0B2E" />
        </div>
      </Modal>
      <AvatarSelector
        open={avatarModal}
        onClose={() => setAvatarModal(false)}
        onSelect={handleAvatarSelect}
        currentAvatar={currentAvatar}
        allowed={['teacher_female','teacher_male']}
      />
    </div>
  );
}

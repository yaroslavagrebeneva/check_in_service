import { useState, useEffect, useRef } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { AlertCircleIcon, CalendarIcon, UsersIcon, EyeIcon, InfoIcon, DownloadIcon, PlusIcon, BellIcon, FileTextIcon } from 'lucide-react';
import Modal from '../components/Modal';
import AvatarSelector from '../components/AvatarSelector';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import '../fonts/TimesNewRoman-normal.js';

const groups = [
  'И-21', 'И-22', 'И-23',
  'ПМИ-21', 'ПМИ-22', 'ПМИ-23',
  'ВМ-21', 'ВМ-22', 'ВМ-23'
];

const fakeAttendanceReport = {
  'И-21': {
    '2024-03': {
      total: 30,
      present: 25,
      absent: 5,
      details: [
        { name: 'Иванов И.И.', status: 'Пропуск', reason: { type: 'medical', details: 'Был на приеме у врача', approved: true } },
        { name: 'Петров П.П.', status: 'Пропуск', reason: { type: 'respectful', details: 'Участвовал в олимпиаде', approved: true } },
        { name: 'Сидоров С.С.', status: 'Пропуск', reason: null },
        { name: 'Смирнова А.А.', status: 'Пропуск', reason: null },
        { name: 'Козлова К.К.', status: 'Пропуск', reason: null },
      ]
    },
    '2024-02': {
      total: 30,
      present: 28,
      absent: 2,
      details: [
        { name: 'Иванов И.И.', status: 'Пропуск', reason: { type: 'medical', details: 'Был на приеме у врача', approved: true } },
        { name: 'Петров П.П.', status: 'Пропуск', reason: { type: 'respectful', details: 'Участвовал в олимпиаде', approved: true } },
      ]
    }
  },
  'И-22': {
    '2024-03': {
      total: 30,
      present: 8,
      absent: 22,
      details: [
        { name: 'Иванов И.И.', status: 'Пропуск', reason: { type: 'medical', details: 'Был на приеме у врача', approved: true } },
        { name: 'Петров П.П.', status: 'Пропуск', reason: { type: 'respectful', details: 'Участвовал в олимпиаде', approved: true } },
        { name: 'Сидоров С.С.', status: 'Пропуск', reason: null },
        { name: 'Смирнова А.А.', status: 'Пропуск', reason: null },
        { name: 'Козлова К.К.', status: 'Пропуск', reason: null },
        { name: 'Новиков Н.Н.', status: 'Пропуск', reason: null },
        { name: 'Морозов М.М.', status: 'Пропуск', reason: null },
        { name: 'Волков В.В.', status: 'Пропуск', reason: null },
        { name: 'Лебедев Л.Л.', status: 'Пропуск', reason: null },
        { name: 'Козлов К.К.', status: 'Пропуск', reason: null },
        { name: 'Ильин И.И.', status: 'Пропуск', reason: null },
        { name: 'Максимов М.М.', status: 'Пропуск', reason: null },
        { name: 'Поляков П.П.', status: 'Пропуск', reason: null },
        { name: 'Соколов С.С.', status: 'Пропуск', reason: null },
        { name: 'Воробьев В.В.', status: 'Пропуск', reason: null },
        { name: 'Горбачев Г.Г.', status: 'Пропуск', reason: null },
        { name: 'Кудрявцев К.К.', status: 'Пропуск', reason: null },
        { name: 'Борисов Б.Б.', status: 'Пропуск', reason: null },
        { name: 'Королев К.К.', status: 'Пропуск', reason: null },
        { name: 'Герасимов Г.Г.', status: 'Пропуск', reason: null },
        { name: 'Титов Т.Т.', status: 'Пропуск', reason: null },
        { name: 'Семенов С.С.', status: 'Пропуск', reason: null },
      ]
    },
    '2024-02': {
      total: 30,
      present: 15,
      absent: 15,
      details: [
        { name: 'Иванов И.И.', status: 'Пропуск', reason: { type: 'medical', details: 'Был на приеме у врача', approved: true } },
        { name: 'Петров П.П.', status: 'Пропуск', reason: { type: 'respectful', details: 'Участвовал в олимпиаде', approved: true } },
        { name: 'Сидоров С.С.', status: 'Пропуск', reason: null },
        { name: 'Смирнова А.А.', status: 'Пропуск', reason: null },
        { name: 'Козлова К.К.', status: 'Пропуск', reason: null },
        { name: 'Новиков Н.Н.', status: 'Пропуск', reason: null },
        { name: 'Морозов М.М.', status: 'Пропуск', reason: null },
        { name: 'Волков В.В.', status: 'Пропуск', reason: null },
        { name: 'Лебедев Л.Л.', status: 'Пропуск', reason: null },
        { name: 'Козлов К.К.', status: 'Пропуск', reason: null },
        { name: 'Ильин И.И.', status: 'Пропуск', reason: null },
        { name: 'Максимов М.М.', status: 'Пропуск', reason: null },
        { name: 'Поляков П.П.', status: 'Пропуск', reason: null },
        { name: 'Соколов С.С.', status: 'Пропуск', reason: null },
        { name: 'Воробьев В.В.', status: 'Пропуск', reason: null },
        { name: 'Горбачев Г.Г.', status: 'Пропуск', reason: null },
        { name: 'Кудрявцев К.К.', status: 'Пропуск', reason: null },
        { name: 'Борисов Б.Б.', status: 'Пропуск', reason: null },
        { name: 'Королев К.К.', status: 'Пропуск', reason: null },
        { name: 'Герасимов Г.Г.', status: 'Пропуск', reason: null },
        { name: 'Титов Т.Т.', status: 'Пропуск', reason: null },
        { name: 'Семенов С.С.', status: 'Пропуск', reason: null },
      ]
    }
  }
};

const events = [
  { id: 1, date: '2024-06-15', title: 'Защита дипломов', description: 'Аудитория 101' },
  { id: 2, date: '2024-06-20', title: 'Выпускной', description: 'Актовый зал' },
  { id: 3, date: '2024-09-01', title: 'День знаний', description: 'Актовый зал' },
];

const generateStrictTemplatePDF = (group, report, month, starosta = '', curator = '') => {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  doc.setFont('times', 'normal');
  doc.setFontSize(14);
  const monthNames = {
    '01': 'Январь', '02': 'Февраль', '03': 'Март', '04': 'Апрель',
    '05': 'Май', '06': 'Июнь', '07': 'Июль', '08': 'Август',
    '09': 'Сентябрь', '10': 'Октябрь', '11': 'Ноябрь', '12': 'Декабрь'
  };
  const [year, monthNum] = month.split('-');
  const monthName = monthNames[monthNum];

  // Заголовок по центру
  doc.text('Отчет по посещаемости', 105, 15, { align: 'center' });

  doc.setFontSize(12);
  const leftX = 10;
  const rightX = 200;
  let y = 25;
  doc.text(`Месяц: ${monthName} ${year}`, leftX, y);
  doc.line(leftX, y + 1, rightX, y + 1);
  y += 7;
  doc.text(`Группа: ${group}`, leftX, y);
  doc.line(leftX, y + 1, rightX, y + 1);
  y += 7;
  doc.text(`Общее количество проведённых занятий в месяц: ${report.total || ''}`, leftX, y);
  doc.line(leftX, y + 1, rightX, y + 1);

  // Таблица
  const tableHead = [[
    'ФИО обучающегося',
    'Общее количество пропущенных занятий',
    'Количество пропущенных занятий по уважительной причине'
  ]];

  // Формируем строки таблицы
  const tableBody = report.details.map(student => {
    const totalMissed = student.status === 'Пропуск' ? 1 : 0;
    const respectfulMissed = (student.status === 'Пропуск' && student.reason && student.reason.type !== null) ? 1 : 0;
    return [
      student.name,
      totalMissed.toString(),
      respectfulMissed.toString()
    ];
  });

  // Добавим пустые строки до 20 (или сколько нужно)
  while (tableBody.length < 20) {
    tableBody.push(['', '', '']);
  }

  autoTable(doc, {
    startY: y + 6,
    head: tableHead,
    body: tableBody,
    theme: 'plain',
    styles: { lineColor: [0,0,0], lineWidth: 0.2, fontSize: 12, font: 'times', halign: 'left', valign: 'middle' },
    headStyles: { fillColor: [255,255,255], textColor: [0,0,0], fontStyle: 'normal', lineWidth: 0.2, lineColor: [0,0,0], font: 'times', fontSize: 12 },
    tableLineColor: [0,0,0],
    tableLineWidth: 0.2,
    margin: { left: 10, right: 10 },
    didDrawPage: (data) => {
      // nothing
    }
  });

  // Подписи и линии
  let finalY = doc.lastAutoTable.finalY || y + 20 * 7;
  const signX = 70;
  const curatorX = 10;
  const curatorSignX = 70;
  const lineWidth = 60;
  const lineY1 = finalY + 15;
  const lineY2 = finalY + 25;

  doc.setFontSize(12);
  // ФИО старосты и подпись
  doc.text('ФИО старосты', leftX, lineY1);
  doc.text('подпись', signX, lineY1);
  // Линии под ФИО старосты и подписью
  doc.line(leftX, lineY1 + 2, leftX + lineWidth, lineY1 + 2); // под ФИО старосты
  doc.line(signX, lineY1 + 2, signX + lineWidth, lineY1 + 2); // под подписью старосты

  // ФИО куратора и подпись
  doc.text('ФИО куратора', curatorX, lineY2);
  doc.text('подпись', curatorSignX, lineY2);
  // Линии под ФИО куратора и подписью
  doc.line(curatorX, lineY2 + 2, curatorX + lineWidth, lineY2 + 2); // под ФИО куратора
  doc.line(curatorSignX, lineY2 + 2, curatorSignX + lineWidth, lineY2 + 2); // под подписью куратора

  return doc;
};

export default function DeanDashboard() {
  const [modal, setModal] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7)); // Format: YYYY-MM
  const [avatarModal, setAvatarModal] = useState(false);
  const [currentAvatar, setCurrentAvatar] = useState('/dean.png');
  const [newEvent, setNewEvent] = useState({ date: '', title: '', description: '' });
  const [calendarEvents, setCalendarEvents] = useState(events);
  const [warningModal, setWarningModal] = useState(null);
  const [previewModal, setPreviewModal] = useState(false);
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState(null);
  const pdfBlobUrlRef = useRef(null);

  const handleShowReport = (group) => {
    setSelectedGroup(group);
    setModal('report');
    
    // Проверяем посещаемость и показываем предупреждение если нужно
    const report = fakeAttendanceReport[group]?.[selectedMonth];
    if (report && (report.absent / report.total) > 0.3) { // Если больше 30% пропусков
      setWarningModal({
        group,
        absent: report.absent,
        total: report.total,
        percentage: Math.round((report.absent / report.total) * 100)
      });
    }
  };

  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value);
  };

  const handlePreviewPDF = () => {
    const report = fakeAttendanceReport[selectedGroup]?.[selectedMonth];
    if (!report) return;
    const doc = generateStrictTemplatePDF(selectedGroup, report, selectedMonth, 'Иванова М.С.', 'Петров В.И.');
    const pdfBlob = doc.output('blob');
    // Очищаем старый blob-URL
    if (pdfBlobUrlRef.current) {
      URL.revokeObjectURL(pdfBlobUrlRef.current);
    }
    const url = URL.createObjectURL(pdfBlob);
    pdfBlobUrlRef.current = url;
    setPdfPreviewUrl(url);
    setPreviewModal(true);
  };

  const handleDownloadPDF = () => {
    const report = fakeAttendanceReport[selectedGroup]?.[selectedMonth];
    if (!report) return;
    const doc = generateStrictTemplatePDF(selectedGroup, report, selectedMonth, 'Иванова М.С.', 'Петров В.И.');
    const monthNames = {
      '01': 'Январь', '02': 'Февраль', '03': 'Март', '04': 'Апрель',
      '05': 'Май', '06': 'Июнь', '07': 'Июль', '08': 'Август',
      '09': 'Сентябрь', '10': 'Октябрь', '11': 'Ноябрь', '12': 'Декабрь'
    };
    const [year, month] = selectedMonth.split('-');
    const monthName = monthNames[month];
    doc.save(`Посещаемость_за_${monthName}_${year}_${selectedGroup}.pdf`);
  };

  const handleAddEvent = () => {
    if (newEvent.date && newEvent.title) {
      setCalendarEvents([...calendarEvents, { id: Date.now(), ...newEvent }]);
      setNewEvent({ date: '', title: '', description: '' });
      setModal(null);
    }
  };

  const handleSendWarning = () => {
    // Здесь будет логика отправки уведомления старосте
    setWarningModal(null);
  };

  const handleAvatarSelect = (avatar) => {
    setCurrentAvatar(avatar);
  };

  // Очищаем blob-URL при закрытии предпросмотра
  useEffect(() => {
    return () => {
      if (pdfBlobUrlRef.current) {
        URL.revokeObjectURL(pdfBlobUrlRef.current);
      }
    };
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center pt-24">
      <div className="flex flex-row items-start gap-8 bg-white/10 rounded-2xl p-8 shadow-xl max-w-3xl w-full max-h-[80vh] overflow-y-auto">
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
            <div className="text-2xl font-bold text-white mb-1">Иванов Иван Иванович</div>
            <div className="text-lg text-[#00D4FF] font-semibold mb-4">Декан факультета информационных технологий</div>
          </div>
          <div className="flex flex-wrap gap-3 mb-2">
            <Button onClick={() => setModal('groups')} className="bg-gradient-to-r from-[#FF6A88] to-[#FF8E53] text-white font-semibold rounded-xl flex items-center gap-2">
              <UsersIcon className="w-5 h-5" /> Группы
            </Button>
            <Button onClick={() => setModal('calendar')} className="bg-gradient-to-r from-[#00D4FF] to-[#B266FF] text-white font-semibold rounded-xl flex items-center gap-2">
              <CalendarIcon className="w-5 h-5" /> Календарь событий
            </Button>
          </div>
          <div className="w-full mt-2">
            <Card className="bg-white/10 border border-white/20 rounded-xl">
              <CardHeader>
                <CardTitle className="text-lg text-white">Статистика посещаемости</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-white/5 rounded-xl p-4">
                    <div className="text-[#00D4FF] text-2xl font-bold">95%</div>
                    <div className="text-white/80">Средняя посещаемость</div>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4">
                    <div className="text-[#FF6A88] text-2xl font-bold">12</div>
                    <div className="text-white/80">Пропуски за неделю</div>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4">
                    <div className="text-[#B266FF] text-2xl font-bold">8</div>
                    <div className="text-white/80">Активных групп</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Модальные окна */}
      <Modal open={modal === 'groups'} onClose={() => setModal(null)} title="Группы">
        <div className="grid grid-cols-3 gap-4 p-4">
          {groups.map((group) => (
            <Button
              key={group}
              onClick={() => handleShowReport(group)}
              className="bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl p-4 h-auto"
            >
              {group}
            </Button>
          ))}
        </div>
      </Modal>

      <Modal open={modal === 'report'} onClose={() => setModal(null)} title={`Отчет по группе ${selectedGroup}`}>
        <div className="max-h-[60vh] overflow-y-auto p-4">
          {selectedGroup && (
            <>
              <div className="mb-4">
                <label className="text-white/90 block mb-2">Выберите месяц</label>
                <input
                  type="month"
                  value={selectedMonth}
                  onChange={handleMonthChange}
                  className="w-full rounded-xl p-3 bg-white/10 border border-white/20 text-white focus:border-[#00D4FF] focus:ring-[#00D4FF] outline-none"
                />
              </div>
              {fakeAttendanceReport[selectedGroup]?.[selectedMonth] ? (
                <>
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="bg-white/5 rounded-xl p-4">
                      <div className="text-[#00D4FF] text-2xl font-bold">{fakeAttendanceReport[selectedGroup][selectedMonth].total}</div>
                      <div className="text-white/80 break-words text-sm leading-tight max-w-[110px] truncate">Всего студентов</div>
                    </div>
                    <div className="bg-white/5 rounded-xl p-4">
                      <div className="text-[#B266FF] text-2xl font-bold">{fakeAttendanceReport[selectedGroup][selectedMonth].present}</div>
                      <div className="text-white/80 break-words text-sm leading-tight max-w-[110px] truncate">Присутствовало</div>
                    </div>
                    <div className="bg-white/5 rounded-xl p-4">
                      <div className="text-[#FF6A88] text-2xl font-bold">{fakeAttendanceReport[selectedGroup][selectedMonth].absent}</div>
                      <div className="text-white/80 break-words text-sm leading-tight max-w-[110px] truncate">Отсутствовало</div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {fakeAttendanceReport[selectedGroup][selectedMonth].details.map((student, index) => (
                      <div key={index} className="bg-white/5 rounded-xl p-4">
                        <div className="flex justify-between items-center">
                          <span className="text-white/90">{student.name}</span>
                          <span className={student.status === 'Пропуск' ? 'text-[#FF6A88]' : 'text-[#00D4FF]'}>
                            {student.status}
                          </span>
                        </div>
                        {student.reason && (
                          <div className="mt-2 text-sm text-white/70">
                            <div>Тип: {student.reason.type === 'medical' ? 'Медицинская' : 'Уважительная'}</div>
                            <div>Детали: {student.reason.details}</div>
                            <div className={student.reason.approved ? 'text-[#00D4FF]' : 'text-[#FF6A88]'}>
                              Статус: {student.reason.approved ? 'Принята' : 'Отклонена'}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-4 mt-4">
                    <Button 
                      onClick={handlePreviewPDF}
                      className="flex-1 bg-gradient-to-r from-[#00D4FF] to-[#B266FF] text-white font-semibold rounded-xl flex items-center justify-center gap-2"
                    >
                      <FileTextIcon className="w-5 h-5" /> Предпросмотр PDF
                    </Button>
                    <Button 
                      onClick={handleDownloadPDF}
                      className="flex-1 bg-gradient-to-r from-[#00D4FF] to-[#B266FF] text-white font-semibold rounded-xl flex items-center justify-center gap-2"
                    >
                      <DownloadIcon className="w-5 h-5" /> Скачать PDF
                    </Button>
                  </div>
                </>
              ) : (
                <div className="text-white/90 text-center py-8">
                  Нет данных за выбранный месяц
                </div>
              )}
            </>
          )}
        </div>
      </Modal>

      <Modal open={modal === 'calendar'} onClose={() => setModal(null)} title="Календарь событий">
        <div className="p-4">
          <div className="mb-4">
            <Button 
              onClick={() => setModal('add_event')} 
              className="w-full bg-gradient-to-r from-[#00D4FF] to-[#B266FF] text-white font-semibold rounded-xl flex items-center justify-center gap-2"
            >
              <PlusIcon className="w-5 h-5" /> Добавить событие
            </Button>
          </div>
          <div className="space-y-4">
            {calendarEvents.map((event) => (
              <div key={event.id} className="bg-white/5 rounded-xl p-4">
                <div className="text-[#00D4FF] font-semibold">{event.date}</div>
                <div className="text-white/90">{event.title}</div>
                {event.description && <div className="text-white/70 text-sm">{event.description}</div>}
              </div>
            ))}
          </div>
        </div>
      </Modal>

      <Modal open={modal === 'add_event'} onClose={() => setModal(null)} title="Добавить событие">
        <div className="p-4 space-y-4">
          <div>
            <label className="text-white/90 block mb-2">Дата</label>
            <input
              type="date"
              value={newEvent.date}
              onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
              className="w-full rounded-xl p-3 bg-white/10 border border-white/20 text-white focus:border-[#00D4FF] focus:ring-[#00D4FF] outline-none"
            />
          </div>
          <div>
            <label className="text-white/90 block mb-2">Название</label>
            <input
              type="text"
              value={newEvent.title}
              onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
              className="w-full rounded-xl p-3 bg-white/10 border border-white/20 text-white focus:border-[#00D4FF] focus:ring-[#00D4FF] outline-none"
              placeholder="Введите название события"
            />
          </div>
          <div>
            <label className="text-white/90 block mb-2">Описание</label>
            <textarea
              value={newEvent.description}
              onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
              className="w-full rounded-xl p-3 bg-white/10 border border-white/20 text-white focus:border-[#00D4FF] focus:ring-[#00D4FF] outline-none"
              placeholder="Введите описание события"
              rows={3}
            />
          </div>
          <Button
            onClick={handleAddEvent}
            className="w-full bg-gradient-to-r from-[#00D4FF] to-[#B266FF] text-white font-semibold rounded-xl"
          >
            Добавить
          </Button>
        </div>
      </Modal>

      <Modal 
        open={warningModal !== null} 
        onClose={() => setWarningModal(null)} 
        title={`Предупреждение: группа ${warningModal?.group}`}
      >
        <div className="p-4">
          <div className="bg-white/5 rounded-xl p-4 mb-4">
            <div className="text-[#FF6A88] text-lg font-semibold mb-2">
              Низкая посещаемость!
            </div>
            <div className="text-white/90">
              Пропущено: {warningModal?.absent} из {warningModal?.total} ({warningModal?.percentage}%)
            </div>
          </div>
          <Button
            onClick={handleSendWarning}
            className="w-full bg-gradient-to-r from-[#FF6A88] to-[#FF8E53] text-white font-semibold rounded-xl flex items-center justify-center gap-2"
          >
            <BellIcon className="w-5 h-5" /> Отправить предупреждение старосте
          </Button>
        </div>
      </Modal>

      <Modal 
        open={previewModal} 
        onClose={() => { setPreviewModal(false); setPdfPreviewUrl(null); }} 
        title="Предпросмотр PDF"
      >
        <div className="p-4" style={{ background: '#fff' }}>
          {pdfPreviewUrl ? (
            <iframe
              src={pdfPreviewUrl}
              title="PDF Preview"
              style={{ width: '100%', height: '70vh', border: '1px solid #ccc', background: '#fff' }}
            />
          ) : (
            <div className="text-black">Генерация PDF...</div>
          )}
          <Button 
            onClick={handleDownloadPDF}
            className="w-full mt-4 bg-gradient-to-r from-[#00D4FF] to-[#B266FF] text-white font-semibold rounded-xl flex items-center justify-center gap-2"
          >
            <DownloadIcon className="w-5 h-5" /> Скачать PDF
          </Button>
        </div>
      </Modal>

      <AvatarSelector
        open={avatarModal}
        onClose={() => setAvatarModal(false)}
        onSelect={handleAvatarSelect}
        currentAvatar={currentAvatar}
        allowed={['dean_female','dean_male']}
      />
    </div>
  );
} 
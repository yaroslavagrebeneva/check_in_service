"use client";
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { X, File } from 'lucide-react';

const missedList = [
  {
    id: 1,
    subject: 'База данных',
    teacher: 'Танишева С.С.',
    date: '20.05.25',
    time: '11:30 - 13:00',
    status: 'Причина не указана',
  },
  {
    id: 2,
    subject: 'Теория вероятности и математическая статистика',
    teacher: 'Умеров Э.А.',
    date: '21.05.25',
    time: '9:40 - 11:10',
    status: 'Причина отклонена',
  },
  {
    id: 3,
    subject: 'Алгоритмизация и программирование',
    teacher: 'Москалёва Ю.П.',
    date: '21.05.25',
    time: '9:40 - 11:10',
    status: 'Причина принята',
  },
  {
    id: 4,
    subject: 'Теория вероятности и математическая статистика',
    teacher: 'Умеров Э.А.',
    date: '21.05.25',
    time: '9:40 - 11:10',
    status: 'Причина в рассмотрении',
  },
];

function getStatusColor(status: string) {
  if (status.includes('принята')) return 'text-green-600';
  if (status.includes('рассмотрении')) return 'text-yellow-600';
  if (status.includes('отклонена')) return 'text-red-600';
  if (status.includes('не указана')) return 'text-gray-400';
  return 'text-gray-400';
}

export default function MissedPage() {
  const [selected, setSelected] = React.useState<number[]>([]);
  const [reason, setReason] = React.useState('');
  const [text, setText] = React.useState('');
  const [showReasonPanel, setShowReasonPanel] = React.useState(false);

  const toggleSelect = (id: number) => {
    setSelected((prev) => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const handleAddReason = () => {
    if (selected.length > 0) setShowReasonPanel(true);
  };

  const handleClosePanel = () => {
    setShowReasonPanel(false);
    setReason('');
    setText('');
  };

  return (
    <div className="flex gap-6 text-[17px]">
      {/* Список пропусков */}
      <div className="flex-1 max-w-3xl">
        <div className="flex items-center gap-2 mb-4">
          <Button variant="outline" size="sm">Все</Button>
          <Button variant="ghost" size="sm">Не отмеченные</Button>
          <div className="ml-auto flex items-center gap-2">
          <div className="border rounded-lg px-3 py-1 text-sm bg-white/80 text-black">Янв 20, 2023 - Фев 09, 2023</div>
          </div>
        </div>
        <div className="p-0">
          <input className="w-full mb-4 px-3 py-2 rounded-lg border border-violet-100 text-sm" placeholder="Поиск..." />
          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-violet-200 scrollbar-track-transparent">
            {missedList.slice(0, 3).map((item) => (
              <Card key={item.id} className={`flex items-start gap-3 p-4 border border-gray-200 rounded-xl shadow-sm transition-all duration-300 animate-fade-in ${selected.includes(item.id) ? 'border-violet-600' : ''}`}>
                <Checkbox checked={selected.includes(item.id)} onCheckedChange={() => toggleSelect(item.id)} className="mt-1" />
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <div className="font-semibold text-base flex items-center">
                      {item.subject}
                      <span className="text-sm text-muted-foreground ml-4">{item.date}, {item.time}</span>
                    </div>
                  </div>
                  <div className="text-base text-muted-foreground">Преподаватель: {item.teacher}</div>
                  <div className="text-sm mt-1">
                    Статус: <span className={`font-medium ${getStatusColor(item.status)}`}>{item.status}</span>
                  </div>
                  <div className="flex gap-2 mt-2">
                    {item.status.includes('не указана') ? (
                      <button className="border border-violet-500 text-violet-600 rounded-lg px-3 py-1 text-sm font-medium bg-transparent hover:bg-violet-50 transition-all duration-200 animate-fade-in">Указать причину</button>
                    ) : (
                      <button className="border border-violet-500 text-violet-600 rounded-lg px-3 py-1 text-sm font-medium bg-transparent hover:bg-violet-50 transition-all duration-200 animate-fade-in">Редактировать</button>
                    )}
                    <button className="border border-gray-200 text-gray-700 rounded-lg px-3 py-1 text-sm font-medium bg-transparent hover:bg-gray-100 transition-all duration-200">Подробнее</button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
        <div className="flex justify-between items-center mt-6">
          <span className="text-sm text-muted-foreground">Page 1 of 10</span>
          <button
            className={`px-6 h-10 rounded-lg font-semibold text-white bg-violet-600 transition-colors flex items-center justify-center ${selected.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={selected.length === 0}
            onClick={handleAddReason}
          >
            Добавить причину
            {selected.length > 0 && <span className="ml-2 text-xs font-normal">({selected.length})</span>}
          </button>
        </div>
      </div>
      {/* Правая панель причины */}
      {showReasonPanel && (
        <div className="w-[600px]">
          <Card className="p-6 border border-gray-200 rounded-xl relative animate-fade-in">
            {/* Крестик закрытия */}
            <button onClick={handleClosePanel} className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors">
              <X size={22} />
            </button>
            {/* Аватар и инфо */}
            <div className="flex items-center gap-3 mb-2">
              <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="avatar" className="w-10 h-10 rounded-full object-cover border border-gray-200" />
              <div>
                <div className="text-sm font-semibold">Кому: Танишева С.С.</div>
                <div className="text-xs text-muted-foreground">Преподаватель кафедры ПИ</div>
                <div className="text-xs text-muted-foreground">От кого: Иванов И.И.</div>
              </div>
            </div>
            <div className="mb-4 text-xs text-muted-foreground">Май 22, 2023, 9:00:00 AM</div>
            <div className="flex gap-2 mb-2">
              <Select value={reason} onValueChange={setReason}>
                <SelectTrigger className="w-[260px] font-medium">
                  <SelectValue placeholder="Укажите тип причины" className="font-medium" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="уважительная">Уважительная</SelectItem>
                  <SelectItem value="медицинская">Медицинская</SelectItem>
                  <SelectItem value="другое">Другое</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" className="w-[160px] flex gap-2 items-center justify-center h-10 font-medium">
                <span>Документ</span>
                <File size={20} strokeWidth={1} />
              </Button>
            </div>
            <textarea
              className="w-full border rounded-lg p-2 mb-4 text-sm min-h-[60px]"
              placeholder="Введите текст"
              value={text}
              onChange={e => setText(e.target.value)}
            />
            <div className="flex justify-center mt-4">
              <Button className="w-[200px] h-10 text-base rounded-lg bg-violet-600 text-white">Отправить</Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
} 
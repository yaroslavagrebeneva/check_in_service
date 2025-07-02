"use client";
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { X, File } from 'lucide-react';
import { MissedReasonPanel } from '@/components/missed-reason-panel';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Calendar as CalendarPicker } from '@/components/ui/calendar';
import { format, parse } from 'date-fns';
import { DateRange } from 'react-day-picker';

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
  const [panelMode, setPanelMode] = React.useState<'add' | 'edit' | 'view'>('add');
  const [currentMissed, setCurrentMissed] = React.useState<any | null>(null);
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>(undefined);
  const [popoverOpen, setPopoverOpen] = React.useState(false);
  const [search, setSearch] = React.useState('');
  const [filter, setFilter] = React.useState<'all' | 'unmarked'>('all');

  const toggleSelect = (id: number) => {
    setSelected((prev) => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const handleAddReason = () => {
    if (selected.length > 0) {
      setPanelMode('add');
      setCurrentMissed(missedList.find(m => m.id === selected[0]));
      setShowReasonPanel(true);
    }
  };

  const handleClosePanel = () => {
    setShowReasonPanel(false);
    setReason('');
    setText('');
    setCurrentMissed(null);
  };

  const handleReasonBtn = (item: any) => {
    setPanelMode('add');
    setCurrentMissed(item);
    setShowReasonPanel(true);
  };
  const handleEditBtn = (item: any) => {
    setPanelMode('edit');
    setCurrentMissed(item);
    setReason(item.reason || '');
    setText(item.text || '');
    setShowReasonPanel(true);
  };
  const handleViewBtn = (item: any) => {
    setPanelMode('view');
    setCurrentMissed(item);
    setShowReasonPanel(true);
  };

  // Фильтрация по поиску, дате и статусу
  const filteredMissed = React.useMemo(() => {
    return missedList.filter(item => {
      // Фильтр по статусу
      if (filter === 'unmarked' && !item.status.includes('не указана')) return false;
      // Поиск по предмету, преподавателю, дате
      const searchLower = search.toLowerCase();
      const matchesSearch =
        item.subject.toLowerCase().includes(searchLower) ||
        item.teacher.toLowerCase().includes(searchLower) ||
        item.date.includes(searchLower);
      // Фильтрация по диапазону дат
      if (dateRange?.from && dateRange?.to) {
        const [yy, mm, dd] = item.date.split('.').map(Number);
        const itemDate = new Date(2000 + yy, mm - 1, dd);
        return (
          matchesSearch &&
          itemDate >= dateRange.from &&
          itemDate <= dateRange.to
        );
      }
      return matchesSearch;
    });
  }, [search, dateRange, filter]);

  return (
    <div className="flex gap-6 text-[17px]">
      {/* Список пропусков */}
      <div className="flex-1 max-w-3xl">
        <div className="flex items-center gap-2 mb-4">
          <Button variant={filter === 'all' ? 'outline' : 'ghost'} size="sm" onClick={() => setFilter('all')}>Все</Button>
          <Button variant={filter === 'unmarked' ? 'outline' : 'ghost'} size="sm" onClick={() => setFilter('unmarked')}>Не отмеченные</Button>
          <div className="ml-auto flex items-center gap-2">
            <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
              <PopoverTrigger asChild>
                <button
                  className="border rounded-lg px-3 py-1 text-sm bg-white/80 text-black flex items-center gap-2 hover:bg-violet-50 transition-colors cursor-pointer"
                  onClick={() => setPopoverOpen(true)}
                >
                  <CalendarIcon className="text-violet-600" size={18} />
                  {dateRange?.from && dateRange?.to
                    ? `${format(dateRange.from, 'dd.MM.yyyy')} - ${format(dateRange.to, 'dd.MM.yyyy')}`
                    : 'Янв 20, 2023 - Фев 09, 2023'}
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <CalendarPicker
                  mode="range"
                  selected={dateRange}
                  onSelect={setDateRange}
                  numberOfMonths={2}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <div className="p-0">
          <input
            className="w-full mb-4 px-3 py-2 rounded-lg border border-violet-100 text-sm"
            placeholder="Поиск..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-violet-200 scrollbar-track-transparent">
            {filteredMissed.slice(0, 3).map((item) => (
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
                      <button onClick={() => handleReasonBtn(item)} className="border border-violet-500 text-violet-600 rounded-lg px-3 py-1 text-sm font-medium bg-transparent hover:bg-violet-50 transition-all duration-200 animate-fade-in">Указать причину</button>
                    ) : (
                      <button onClick={() => handleEditBtn(item)} className="border border-violet-500 text-violet-600 rounded-lg px-3 py-1 text-sm font-medium bg-transparent hover:bg-violet-50 transition-all duration-200 animate-fade-in">Редактировать</button>
                    )}
                    <button onClick={() => handleViewBtn(item)} className="border border-gray-200 text-gray-700 rounded-lg px-3 py-1 text-sm font-medium bg-transparent hover:bg-gray-100 transition-all duration-200">Подробнее</button>
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
      {showReasonPanel && currentMissed && (
        <MissedReasonPanel
          mode={panelMode}
          missed={currentMissed}
          onClose={handleClosePanel}
          reason={reason}
          text={text}
          onReasonChange={setReason}
          onTextChange={setText}
          onSend={() => { setShowReasonPanel(false); setReason(''); setText(''); setCurrentMissed(null); }}
        />
      )}
    </div>
  );
} 